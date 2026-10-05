// Page-specific patterns. Each page family gets one, always in the same
// brand palette, so pages feel distinct but clearly belong together:
//
//   keys     Resources, Reports, FAQ, Privacy            chevrons, keys and diamonds
//   wax      Our Work, Taka Kipawa                       a wax-print of discs and dotted halos
//   arcs     Blog and stories                            quarter-circle arcs in green and gold
//   unity    About, Team, the 404 page                   five figures joined in a ring
//   rosette  Get Involved, Donate, Contact               an eight-petal rosette
//   arches   Pitch Workshop page and its report          nested arches, a sun, a heavy ring
//   kente    Agribusiness Summit pages                   crossing kente ribbons with glyphs
//
// Tiles repeat seamlessly: every element is drawn again one tile away on
// each side and the viewBox clips the overflow.

import { rng, round } from './geometry.mjs'

export const C = {
  deep: '#0C2E11',
  deep2: '#123D16',
  green: '#1E963C',
  greenText: '#17702D',
  lime: '#78C31E',
  limeSoft: '#A8E04A',
  pale: '#DDF5BD',
  mint: '#F2FAE8',
  cream: '#F7FAF2',
  gold: '#E9A23B',
  red: '#C8102E',
  ink: '#111A12',
}

const n = (v) => round(v, 1)
const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
  (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + '</svg>'

// Repeat a drawing function at the 3x3 neighbouring tile offsets.
const wrap = (w, h, draw) => {
  let out = ''
  for (const dy of [-h, 0, h]) for (const dx of [-w, 0, w]) out += draw(dx, dy)
  return out
}

// ── Keys ────────────────────────────────────────────────────────────────────
// Nested chevrons climbing towards a key, with nested diamonds in the
// valleys between them. Brick layout: every second row shifts half a tile.
export function keys({ fg = C.green, bg = C.cream, stroke = 8 } = {}) {
  const W = 240, H = 240
  const unit = (x, y) => {
    // key: ring, stem and crossbar, standing on the top chevron
    let d = `<circle cx="${n(x)}" cy="${n(y - 50)}" r="10" fill="none"/>`
    d += `<path d="M${n(x)} ${n(y - 40)}V${n(y + 8)}M${n(x - 14)} ${n(y - 18)}H${n(x + 14)}"/>`
    // three nested chevrons
    for (let k = 0; k < 3; k++) {
      const ay = y + 8 + k * 26
      d += `<path d="M${n(x - 60)} ${n(ay + 60)}L${n(x)} ${n(ay)}L${n(x + 60)} ${n(ay + 60)}"/>`
    }
    // nested diamond, sheltered under the chevrons of the next unit along
    const dx = x + 120, dy = y + 8
    d += `<path d="M${n(dx)} ${n(dy - 30)}L${n(dx + 30)} ${n(dy)}L${n(dx)} ${n(dy + 30)}L${n(dx - 30)} ${n(dy)}Z"/>`
    d += `<path d="M${n(dx)} ${n(dy - 9)}L${n(dx + 9)} ${n(dy)}L${n(dx)} ${n(dy + 9)}L${n(dx - 9)} ${n(dy)}Z" fill="${fg}" stroke="none"/>`
    return d
  }
  const body = wrap(W, H, (ox, oy) => unit(60 + ox, 70 + oy) + unit(180 + ox, 190 + oy))
  return svg(W, H, `<g fill="none" stroke="${fg}" stroke-width="${stroke}" stroke-linecap="square" stroke-linejoin="miter">${body}</g>`, bg)
}

// ── Wax ─────────────────────────────────────────────────────────────────────
// A wax-print: lime discs (single and twin) on deep green, each ringed by
// dotted halos, with sprays of cream dots between them.
export function wax({ bg = C.deep, disc = '#86D42B', halo = '#3FA03A', halo2 = '#2B7F32', spray = '#EDE6C4' } = {}) {
  const W = 240, H = 240
  // A row of dots along a circle or arc: one dashed stroke with round caps
  // and zero-length dashes, spaced evenly so the ends meet cleanly.
  const dotsOnCircle = (cx, cy, r, gap, rad, colour, a0 = 0, a1 = 2 * Math.PI) => {
    const full = a1 - a0 > 6.28
    const length = r * (a1 - a0)
    const count = Math.max(full ? 6 : 2, Math.round(length / gap))
    const step = length / (full ? count : count - 1)
    const style = `fill="none" stroke="${colour}" stroke-width="${n(rad * 2)}" stroke-linecap="round" stroke-dasharray="0 ${n(step)}"`
    if (full) return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${r}" ${style}/>`
    const P = (a) => `${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`
    return `<path d="M${P(a0)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${P(a1)}" ${style}/>`
  }
  const single = (x, y) =>
    dotsOnCircle(x, y, 33, 7.5, 1.9, halo) + dotsOnCircle(x, y, 42, 8, 1.7, halo2) +
    `<circle cx="${x}" cy="${y}" r="23" fill="${disc}"/>`
  const twin = (x, y) =>
    dotsOnCircle(x - 15, y, 33, 7.5, 1.9, halo, 1.9, 4.38) + dotsOnCircle(x + 15, y, 33, 7.5, 1.9, halo, -1.24, 1.24) +
    dotsOnCircle(x - 15, y, 42, 8, 1.7, halo2, 1.75, 4.53) + dotsOnCircle(x + 15, y, 42, 8, 1.7, halo2, -1.39, 1.39) +
    `<circle cx="${x - 15}" cy="${y}" r="21" fill="${disc}"/><circle cx="${x + 15}" cy="${y}" r="21" fill="${disc}"/>` +
    `<path d="M${x} ${y - 13}V${y + 13}" stroke="${bg}" stroke-width="1.6" opacity=".55"/>`
  const sprayAt = (x, y, a) => {
    let d = ''
    for (let row = 0; row < 3; row++) d += dotsOnCircle(x, y, 9 + row * 7, 6.5, 1.5, spray, a - 0.7, a + 0.7)
    return d
  }
  const body = wrap(W, H, (ox, oy) =>
    single(60 + ox, 60 + oy) + single(180 + ox, 60 + oy) +
    twin(0 + ox, 180 + oy) + twin(120 + ox, 180 + oy) +
    sprayAt(120 + ox, 66 + oy, -1.57) + sprayAt(60 + ox, 186 + oy, 1.57) + sprayAt(180 + ox, 186 + oy, 1.57))
  return svg(W, H, body, bg)
}

// ── Arcs ────────────────────────────────────────────────────────────────────
// Thick quarter-circle arcs, each hugging one corner of its cell (a Truchet
// layout), with small gold arcs in the gaps.
export function arcs({ fg = C.deep2, accent = C.gold, bg = C.cream } = {}) {
  const cell = 100
  const cols = 4, rows = 4
  // Corner each cell's arc hugs: 0 top-left, 1 top-right, 2 bottom-right,
  // 3 bottom-left. Pairs of cells make half-circles that alternate up and
  // down, so each pair of rows reads as a broken wave; the second wave is
  // shifted half a step.
  const layout = [
    [2, 3, 2, 3],
    [0, 1, 0, 1],
    [3, 2, 3, 2],
    [1, 0, 1, 0],
  ]
  const corner = (c, x, y) => [[x, y], [x + cell, y], [x + cell, y + cell], [x, y + cell]][c]
  // Start angle of the quarter that lies inside the cell, per corner.
  const start = [0, 90, 180, 270]
  const arc = (cx, cy, c, rad, w, colour) => {
    const a0 = (start[c] * Math.PI) / 180
    const p = (a) => `${n(cx + rad * Math.cos(a))} ${n(cy + rad * Math.sin(a))}`
    return `<path d="M${p(a0)}A${rad} ${rad} 0 0 1 ${p(a0 + Math.PI / 2)}" fill="none" stroke="${colour}" stroke-width="${w}"/>`
  }
  let body = ''
  layout.forEach((row, ri) => row.forEach((c, ci) => {
    const [cx, cy] = corner(c, ci * cell, ri * cell)
    body += arc(cx, cy, c, 36, 16, fg)
  }))
  // Small gold arcs in the open space between the waves: [row, col, corner].
  for (const [ri, ci, c] of [[1, 0, 3], [1, 2, 2], [3, 1, 2], [3, 3, 3]]) {
    const [gx, gy] = corner(c, ci * cell, ri * cell)
    body += arc(gx, gy, c, 20, 8, accent)
  }
  return svg(cell * cols, cell * rows, body, bg)
}

// ── Unity ───────────────────────────────────────────────────────────────────
// Four figures (a head and a sweeping arm each) joined in a ring: people
// moving together. Tiled as a quiet emblem pattern.
export function unityEmblem({ fg = C.green, x = 0, y = 0, scale = 1, people = 4 } = {}) {
  // Seen from above: people standing in a ring, arms linked. Each person
  // is a head; each pair of linked arms is a curve dipping towards the centre.
  const s = scale
  let d = ''
  const at = (a, r) => [x + r * Math.cos(a), y + r * Math.sin(a)]
  const step = (2 * Math.PI) / people
  for (let k = 0; k < people; k++) {
    const a = -Math.PI / 2 + k * step
    const [hx, hy] = at(a, 52 * s)
    d += `<circle cx="${n(hx)}" cy="${n(hy)}" r="${n(12 * s)}"/>`
    const [x0, y0] = at(a + 0.2, 34 * s)
    const [x1, y1] = at(a + step - 0.2, 34 * s)
    const [cx, cy] = at(a + step / 2, 8 * s)
    d += `<path d="M${n(x0)} ${n(y0)}Q${n(cx)} ${n(cy)} ${n(x1)} ${n(y1)}" fill="none" stroke="${fg}" stroke-width="${n(12 * s)}" stroke-linecap="round"/>`
  }
  return `<g fill="${fg}">${d}</g>`
}

export function unity({ fg = C.green, soft = '#BFE09F', bg = C.mint, people = 5 } = {}) {
  const W = 280, H = 280
  const body = wrap(W, H, (ox, oy) =>
    unityEmblem({ fg, x: 70 + ox, y: 70 + oy, scale: 0.9, people }) +
    unityEmblem({ fg: soft, x: 210 + ox, y: 210 + oy, scale: 0.9, people }))
  return svg(W, H, body, bg)
}

// ── Rosette ─────────────────────────────────────────────────────────────────
// An eight-petal rosette of outlined almond petals, framed by diamonds and
// rounded squares. Tiled with small diamonds between rosettes.
export function rosetteMotif({ x = 0, y = 0, s = 1, petalA = C.lime, petalB = C.green, diamond = C.deep2, square = C.gold, w = 6 } = {}) {
  let d = ''
  const petal = (a, colour) => {
    // Almond between the centre (r = 10) and the tip (r = 62).
    const r0 = 12 * s, r1 = 60 * s, bulge = 17 * s
    const ca = Math.cos(a), sa = Math.sin(a)
    const P = (u, v) => `${n(x + ca * u - sa * v)} ${n(y + sa * u + ca * v)}`
    const mid = (r0 + r1) / 2
    return `<path d="M${P(r0, 0)}Q${P(mid, bulge * 1.9)} ${P(r1, 0)}Q${P(mid, -bulge * 1.9)} ${P(r0, 0)}Z" fill="none" stroke="${colour}" stroke-width="${n(w * s)}" stroke-linejoin="round"/>`
  }
  for (let k = 0; k < 8; k++) d += petal((k * Math.PI) / 4 + Math.PI / 8, k % 2 ? petalB : petalA)
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 8 - Math.PI / 8
    const cx = x + Math.cos(a) * 84 * s, cy = y + Math.sin(a) * 84 * s
    const r = 16 * s
    d += `<path d="M${n(cx + r)} ${n(cy)}L${n(cx)} ${n(cy + r)}L${n(cx - r)} ${n(cy)}L${n(cx)} ${n(cy - r)}Z" fill="none" stroke="${diamond}" stroke-width="${n(w * s)}" stroke-linejoin="round"/>`
    const b = a + Math.PI / 4
    const qx = x + Math.cos(b) * 80 * s, qy = y + Math.sin(b) * 80 * s
    const q = 12 * s
    d += `<rect x="${n(qx - q)}" y="${n(qy - q)}" width="${n(2 * q)}" height="${n(2 * q)}" rx="${n(4 * s)}" fill="none" stroke="${square}" stroke-width="${n(w * s)}" transform="rotate(45 ${n(qx)} ${n(qy)})"/>`
  }
  return d
}

export function rosette({ bg = C.cream } = {}) {
  const W = 300, H = 300
  const small = (x, y) => `<path d="M${x} ${y - 8}L${x + 8} ${y}L${x} ${y + 8}L${x - 8} ${y}Z" fill="${C.limeSoft}"/>`
  const body = wrap(W, H, (ox, oy) =>
    rosetteMotif({ x: 75 + ox, y: 75 + oy, s: 0.78, w: 7 }) + rosetteMotif({ x: 225 + ox, y: 225 + oy, s: 0.78, w: 7 }) +
    small(225 + ox, 75 + oy) + small(75 + ox, 225 + oy))
  return svg(W, H, body, bg)
}

// ── Arches ──────────────────────────────────────────────────────────────────
// A frame for a poster: nested arches rising around it, a sun behind its
// top corner and a heavy quarter-ring at its foot.
// Drawn for a box 136% x 120% of a 4:5 poster, inset 18% at the sides,
// 16% above and 4% below (see pitch-workshop-2026.html, .poster-frame).
export function archFrame({ line = '#2E9E45', heavy = '#0F3D1C', sun = C.lime } = {}) {
  const W = 640, H = 706
  const cx = 320, cy = 325
  let arches = ''
  for (let k = 0; k < 7; k++) {
    const r = 261 + k * 9
    arches += `<path d="M${cx - r} ${H}V${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}V${H}"/>`
  }
  return svg(W, H,
    `<circle cx="70" cy="70" r="40" fill="${sun}"/>` +
    `<path d="M640 556A150 150 0 0 0 490 706" fill="none" stroke="${heavy}" stroke-width="60"/>` +
    `<g fill="none" stroke="${line}" stroke-width="3">${arches}</g>`)
}

// ── Kente ───────────────────────────────────────────────────────────────────
// Ribbons of kente cloth crossing a corner. Each ribbon is a strip of
// colour blocks, bars and simple glyphs (concentric rings, crosses, stars,
// diamonds). A composition for the Summit pages, drawn for the top right.
function glyph(kind, x, y, s, colour) {
  switch (kind) {
    case 'rings': return `<g fill="none" stroke="${colour}" stroke-width="${n(2.6 * s)}"><circle cx="${x}" cy="${y}" r="${n(4 * s)}"/><circle cx="${x}" cy="${y}" r="${n(8.5 * s)}"/><circle cx="${x}" cy="${y}" r="${n(13 * s)}"/></g>`
    case 'cross': return `<path d="M${n(x - 12 * s)} ${y}H${n(x + 12 * s)}M${x} ${n(y - 12 * s)}V${n(y + 12 * s)}" stroke="${colour}" stroke-width="${n(5 * s)}"/><circle cx="${x}" cy="${y}" r="${n(4.5 * s)}" fill="${colour}"/>`
    case 'star': {
      let p = ''
      for (let k = 0; k < 16; k++) {
        const a = (k * Math.PI) / 8
        const r = (k % 2 ? 5.5 : 13) * s
        p += `${k ? 'L' : 'M'}${n(x + r * Math.cos(a))} ${n(y + r * Math.sin(a))}`
      }
      return `<path d="${p}Z" fill="${colour}"/>`
    }
    case 'diamond': return `<path d="M${x} ${n(y - 13 * s)}L${n(x + 13 * s)} ${y}L${x} ${n(y + 13 * s)}L${n(x - 13 * s)} ${y}ZM${x} ${n(y - 6 * s)}L${n(x + 6 * s)} ${y}L${x} ${n(y + 6 * s)}L${n(x - 6 * s)} ${y}Z" fill="${colour}" fill-rule="evenodd"/>`
    case 'ladder': return `<path d="M${n(x - 12 * s)} ${n(y - 12 * s)}V${n(y + 12 * s)}M${n(x + 12 * s)} ${n(y - 12 * s)}V${n(y + 12 * s)}M${n(x - 12 * s)} ${n(y - 6 * s)}H${n(x + 12 * s)}M${n(x - 12 * s)} ${y}H${n(x + 12 * s)}M${n(x - 12 * s)} ${n(y + 6 * s)}H${n(x + 12 * s)}" stroke="${colour}" stroke-width="${n(3 * s)}" fill="none"/>`
    default: return ''
  }
}

function ribbon({ x, y, angle, length, width, base, seed }) {
  const r = rng(seed)
  const glyphs = ['rings', 'cross', 'star', 'diamond', 'ladder']
  const stripePalettes = [
    [C.gold, C.deep2, C.lime, C.deep2],
    [C.red, C.gold, C.deep2, C.gold],
    [C.lime, C.deep2, C.gold, C.ink],
  ]
  // The strip ends in a swallowtail notch, like a ribbon's cut end.
  const h = width / 2
  let d = `<path d="M0 ${n(-h)}H${length}L${n(length - h)} 0L${length} ${n(h)}H0Z" fill="${base}"/>`
  let t = 20 + r() * 30
  while (t < length - width - 40) {
    if (r() < 0.45) {
      // a kente block: narrow bars across the ribbon
      const pal = stripePalettes[Math.floor(r() * stripePalettes.length)]
      const bars = 5 + Math.floor(r() * 4)
      for (let b = 0; b < bars; b++) {
        d += `<rect x="${n(t + b * 7)}" y="${n(-width / 2)}" width="4" height="${width}" fill="${pal[b % pal.length]}"/>`
      }
      t += bars * 7 + 26
    } else {
      const kind = glyphs[Math.floor(r() * glyphs.length)]
      const ink = base === C.ink || base === C.deep2 || base === C.red ? C.gold : C.ink
      d += glyph(kind, n(t + 14), 0, width / 34, ink)
      t += 50
    }
  }
  return `<g transform="translate(${x} ${y}) rotate(${angle})">${d}</g>`
}

// Ribbons enter from the top and right edges and end, notched, towards the
// lower left, where the page places its poster over them.
export function kente({ bg = 'none' } = {}) {
  const W = 640, H = 480
  const ribbons = [
    { x: 300, y: -50, angle: 70, length: 400, width: 46, base: C.ink, seed: 13 },
    { x: 470, y: -50, angle: 118, length: 450, width: 48, base: C.deep2, seed: 3 },
    { x: 610, y: -50, angle: 104, length: 500, width: 44, base: C.gold, seed: 5 },
    { x: 690, y: 30, angle: 151, length: 540, width: 46, base: C.red, seed: 8 },
    { x: 690, y: 215, angle: 168, length: 520, width: 50, base: C.lime, seed: 11 },
  ]
  return svg(W, H, ribbons.map(ribbon).join(''), bg === 'none' ? null : bg)
}
