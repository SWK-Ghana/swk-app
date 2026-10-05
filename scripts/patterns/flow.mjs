// "Flow": SWK Ghana's signature pattern. Ribbons of green bands that wrap
// around a few centres and meet in pointed seams, mirrored like a printed
// cloth. Each band is ribbed with fine ticks.
//
// How it is drawn: a warped distance field (distance to the nearest centre)
// is sampled over one mirrored tile, its level sets are traced with marching
// squares, and the regions are painted from the outside in. The tile repeats
// seamlessly because the field is mirrored at every tile edge.

import { contours, rng, round, sampleGrid, thin } from './geometry.mjs'

const mirror = (t, size) => {
  const p = ((t % (2 * size)) + 2 * size) % (2 * size)
  return p <= size ? p : 2 * size - p
}

export function flowField({
  seed = 1, w = 300, h = 380, centres, count = 3,
  warp = 0.08, warpFreq = 1, stretch = 1, edgeBias = 0.7, soft = 0.008,
}) {
  const r = rng(seed)
  const pts = centres ?? Array.from({ length: count }, () => {
    const c = { x: r(), y: r(), s: 0.85 + r() * 0.35, o: r() * 0.05, sx: 1, sy: 1 }
    // Pull most centres onto an edge: the mirror then turns them into
    // ring systems straddling the tile's axes, which read as hearts and eyes.
    if (r() < edgeBias) {
      const side = Math.floor(r() * 4)
      if (side === 0) c.x = 0
      else if (side === 1) c.x = 1
      else if (side === 2) c.y = 0
      else c.y = 1
    }
    // Stretch some systems so the rings sweep instead of staying round.
    if (r() < 0.6) { c.sx = 1 / stretch; c.sy = stretch } else { c.sx = stretch; c.sy = 1 / stretch }
    return c
  })
  const ph = Array.from({ length: 4 }, () => r() * 6.283)
  const aspect = h / w
  const k = 6.283 * warpFreq
  const field = (x, y) => {
    const u = mirror(x, w) / w
    const v = mirror(y, h) / h
    // Gentle domain warp so the rings flow instead of staying circular.
    const wu = u + warp * Math.sin(k * v + ph[0]) + warp * 0.45 * Math.sin(k * 1.6 * (u + v) + ph[2])
    const wv = v + warp * Math.sin(k * u + ph[1]) + warp * 0.45 * Math.sin(k * 1.6 * (u - v) + ph[3])
    // Soft minimum of the distances: seams stay pointed but never splinter.
    let sum = 0
    for (const c of pts) {
      const dx = (wu - c.x) * c.sx
      const dy = (wv - c.y) * aspect * c.sy
      sum += Math.exp(-(Math.hypot(dx, dy) * c.s + c.o) / soft)
    }
    return -soft * Math.log(sum)
  }
  return { field, w, h, centres: pts }
}

// Compact relative path for a closed polyline.
const relPath = (pts, d = 1) => {
  let s = `M${round(pts[0][0], d)} ${round(pts[0][1], d)}`
  let [px, py] = pts[0]
  let x0 = round(px, d), y0 = round(py, d)
  for (let k = 1; k < pts.length; k++) {
    const x = round(pts[k][0], d), y = round(pts[k][1], d)
    const dx = round(x - x0, d), dy = round(y - y0, d)
    if (dx === 0 && dy === 0) continue
    s += `l${dx}${dy < 0 ? '' : ' '}${dy}`
    x0 = x; y0 = y
  }
  return s.replace(/l(-?)0\./g, 'l$1.').replace(/ (-?)0\./g, ' $1.') + 'z'
}

// Build the SVG for one tile (2w x 2h).
export function flowSvg({
  field, w, h,
  band = 14,             // approximate band width, in tile units
  palette,               // band fills, cycled outward
  ink = '#0A2410',       // outline colour
  outline = 1.5,         // outline width (0 for none)
  rib = { width: 1.1, gap: 4.2, opacity: 0.85 }, // ticks across each band (null for none)
  background,            // colour under everything (defaults to palette[0])
  spacing = 4,           // distance between path points
  step = 2,
  margin = 40,
  minLoop = 6,           // drop loops smaller than this (in tile units)
}) {
  const W = 2 * w
  const H = 2 * h
  const grid = sampleGrid(field, -margin, -margin, W + margin, H + margin, step)
  let lo = Infinity, hi = -Infinity
  for (const val of grid.v) if (val > -1e8) { lo = Math.min(lo, val); hi = Math.max(hi, val) }
  // The field is a distance in units of the quadrant width, so one band of
  // `band` tile units is band / w in field units.
  const delta = band / w
  const levels = []
  for (let t = lo + delta * 0.6; t < hi; t += delta) levels.push(t)

  const defs = []
  const body = [`<rect width="${W}" height="${H}" fill="${background ?? palette[0]}"/>`]
  const big = (l) => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const [x, y] of l) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    return x1 - x0 > minLoop && y1 - y0 > minLoop
  }
  levels.forEach((t, k) => {
    const loops = contours(grid, t).filter(big).map((l) => thin(l, spacing))
    if (!loops.length) return
    const id = `L${k}`
    defs.push(`<path id="${id}" d="${loops.map((l) => relPath(l)).join('')}"/>`)
    body.push(`<use href="#${id}" fill="${palette[(k + 1) % palette.length]}" fill-rule="evenodd"/>`)
    if (rib) {
      // Ribs: the band's own outline, stroked wide and dashed so each dash
      // is a tick across the band. Clipped to the region, the outer half is
      // hidden; the next region painted on top trims anything too long.
      defs.push(`<clipPath id="c${k}"><use href="#${id}" clip-rule="evenodd"/></clipPath>`)
      body.push(
        `<use href="#${id}" fill="none" stroke="${rib.color ?? ink}" stroke-opacity="${rib.opacity}" ` +
        `stroke-width="${round(band * (rib.reach ?? 2.2), 1)}" stroke-dasharray="${rib.width} ${rib.gap}" ` +
        `stroke-linejoin="bevel" clip-path="url(#c${k})"/>`,
      )
    }
    if (outline) body.push(`<use href="#${id}" fill="none" stroke="${ink}" stroke-width="${outline}" stroke-linejoin="round"/>`)
  })

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<defs>${defs.join('')}</defs>${body.join('')}</svg>`
  )
}
