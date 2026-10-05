// "Weave": SWK Ghana's quiet second pattern. A patchwork of geometric line
// motifs (nested shapes, stripes, zigzags, combs, dots), like a strip-woven
// cloth seen up close. Drawn in one pale colour so it sits under content on
// light sections without competing with it.
//
// How it is drawn: a jittered grid of quadrilaterals that wraps around the
// tile edges is split into triangles; each patch is shrunk to leave a gutter
// and filled with a motif clipped to its outline.

import { rng, round } from './geometry.mjs'

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, k) => [a[0] * k, a[1] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const len = (a) => Math.hypot(a[0], a[1])
const norm = (a) => mul(a, 1 / (len(a) || 1))

// Signed area: positive when the polygon winds clockwise on screen.
const area = (poly) => poly.reduce((s, p, i) => {
  const q = poly[(i + 1) % poly.length]
  return s + (p[0] * q[1] - q[0] * p[1])
}, 0) / 2

const ccw = (poly) => (area(poly) < 0 ? poly : [...poly].reverse())

// Shrink a convex polygon by d (null when it vanishes).
function inset(poly, d, minArea = 30) {
  const P = ccw(poly)
  const n = P.length
  const lines = P.map((p, i) => {
    const q = P[(i + 1) % n]
    const e = norm(sub(q, p))
    const inward = [e[1], -e[0]] // for counter-clockwise winding on screen
    return { p: add(p, mul(inward, d)), e }
  })
  const out = []
  for (let i = 0; i < n; i++) {
    const a = lines[(i + n - 1) % n]
    const b = lines[i]
    const den = a.e[0] * b.e[1] - a.e[1] * b.e[0]
    if (Math.abs(den) < 1e-9) return null
    const t = ((b.p[0] - a.p[0]) * b.e[1] - (b.p[1] - a.p[1]) * b.e[0]) / den
    out.push(add(a.p, mul(a.e, t)))
  }
  // A vanished polygon flips its winding.
  return area(out) * area(P) > 0 && Math.abs(area(out)) > minArea ? out : null
}

// Clip segment ab to a convex polygon (Cyrus-Beck); null when outside.
function clipSeg(a, b, poly) {
  const P = ccw(poly)
  let t0 = 0, t1 = 1
  const d = sub(b, a)
  for (let i = 0; i < P.length; i++) {
    const p = P[i]
    const q = P[(i + 1) % P.length]
    const e = sub(q, p)
    const inward = [e[1], -e[0]]
    const num = dot(sub(a, p), inward)
    const den = dot(d, inward)
    if (Math.abs(den) < 1e-12) { if (num < 0) return null; continue }
    const t = -num / den
    if (den > 0) t0 = Math.max(t0, t)
    else t1 = Math.min(t1, t)
    if (t0 > t1) return null
  }
  return [add(a, mul(d, t0)), add(a, mul(d, t1))]
}

const bbox = (poly) => {
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1])
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
}

const fmt = (p) => `${round(p[0])} ${round(p[1])}`
const polyPath = (poly) => `M${poly.map(fmt).join('L')}Z`

// Parallel lines across a polygon, along direction `dir`, `gap` apart.
function hatch(poly, dir, gap, shape = 'line', amp = 0) {
  const e = norm(dir)
  const nrm = [-e[1], e[0]]
  const [x0, y0, x1, y1] = bbox(poly)
  const c = [(x0 + x1) / 2, (y0 + y1) / 2]
  const R = Math.hypot(x1 - x0, y1 - y0)
  const out = []
  for (let s = -R; s <= R; s += gap) {
    const o = add(c, mul(nrm, s))
    if (shape === 'line') {
      const seg = clipSeg(add(o, mul(e, -R)), add(o, mul(e, R)), poly)
      if (seg) out.push(`M${fmt(seg[0])}L${fmt(seg[1])}`)
    } else {
      // Zigzag: clip every leg separately.
      const step = amp * 1.6
      let prev = null
      for (let t = -R, k = 0; t <= R + step; t += step, k++) {
        const p = add(add(o, mul(e, t)), mul(nrm, k % 2 ? amp : -amp))
        if (prev) {
          const seg = clipSeg(prev, p, poly)
          if (seg) out.push(`M${fmt(seg[0])}L${fmt(seg[1])}`)
        }
        prev = p
      }
    }
  }
  return out.join('')
}

export function weaveSvg({
  seed = 7, size = 480, n = 4, jitter = 0.22, gutter = 6, stroke = 3.4,
  colour = '#E3ECD8', opacity = 1,
}) {
  const r = rng(seed)
  const cell = size / n
  // Jittered lattice that wraps: point (i, j) and (i + n, j) differ by one tile.
  const J = Array.from({ length: n }, () => Array.from({ length: n }, () => [(r() - 0.5) * 2 * jitter * cell, (r() - 0.5) * 2 * jitter * cell]))
  const pt = (i, j) => {
    const wi = ((i % n) + n) % n, wj = ((j % n) + n) % n
    const [jx, jy] = J[wi][wj]
    return [i * cell + jx, j * cell + jy]
  }
  // Per-cell choices, also wrapped so copies across the edge match.
  const choices = Array.from({ length: n * n }, () => ({
    diag: r() < 0.5, split: r() < 0.75,
    motifs: [Math.floor(r() * 7), Math.floor(r() * 7)], angle: Math.floor(r() * 3),
  }))
  const pick = (i, j) => choices[(((j % n) + n) % n) * n + (((i % n) + n) % n)]

  const parts = []
  for (let j = -1; j <= n; j++) {
    for (let i = -1; i <= n; i++) {
      const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1)
      const ch = pick(i, j)
      const polys = !ch.split ? [[a, b, c, d]] : ch.diag ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]
      polys.forEach((poly, pi) => {
        const inner = inset(poly, gutter + stroke / 2)
        if (!inner) return
        const motif = ch.motifs[pi % 2]
        const edge = sub(inner[(ch.angle + pi) % inner.length], inner[(ch.angle + pi + 1) % inner.length])
        switch (motif) {
          case 0: { // nested outlines
            let p = inner, k = 0
            while (p && k < 6) { parts.push(polyPath(p)); p = inset(p, stroke + 5.5, 420); k++ }
            break
          }
          case 1: parts.push(polyPath(inner), hatch(inner, edge, stroke + 6)); break
          case 2: parts.push(hatch(inner, edge, stroke + 9, 'zig', 4.2)); break
          case 3: { // outline + comb teeth
            parts.push(polyPath(inner))
            const tight = inset(inner, stroke + 4)
            if (tight) parts.push(hatch(tight, [-edge[1], edge[0]], stroke + 5))
            break
          }
          case 4: { // dots
            parts.push(polyPath(inner))
            const tight = inset(inner, stroke + 4)
            if (!tight) break
            const [x0, y0, x1, y1] = bbox(tight)
            const g = stroke + 7
            for (let y = y0 + g / 2; y < y1; y += g) {
              for (let x = x0 + g / 2; x < x1; x += g) {
                if (clipSeg([x, y], [x + 0.01, y], tight)) parts.push(`M${round(x)} ${round(y)}h.01`)
              }
            }
            break
          }
          case 5: { // two nested outlines + stripes in the core
            parts.push(polyPath(inner))
            const mid = inset(inner, stroke + 5.5)
            if (mid) {
              parts.push(polyPath(mid))
              const core = inset(mid, stroke + 4)
              if (core) parts.push(hatch(core, edge, stroke + 5))
            }
            break
          }
          default: parts.push(hatch(inner, [-edge[1], edge[0]], stroke + 7, 'zig', 3.6))
        }
      })
    }
  }
  // Dots use the stroke too: round caps on a zero-length segment draw a dot.
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<path d="${parts.join('')}" fill="none" stroke="${colour}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"${opacity < 1 ? ` opacity="${opacity}"` : ''}/></svg>`
  )
}
