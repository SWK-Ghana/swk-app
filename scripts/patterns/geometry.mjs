// Small geometry helpers shared by the pattern generators: a seeded random
// number generator, marching-squares contouring and SVG path formatting.

// Mulberry32: tiny seeded PRNG, so every build draws the same pattern.
export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const round = (n, d = 1) => {
  const p = 10 ** d
  const r = Math.round(n * p) / p
  return Object.is(r, -0) ? 0 : r
}

// Closed contours of {value >= level} on a grid sampled by `sample(x, y)`.
// The grid spans [x0, x1] x [y0, y1] with `step` spacing and is padded with a
// very low value, so every contour closes. Returns arrays of [x, y] points.
export function contours(grid, level) {
  const { nx, ny, v, x0, y0, step } = grid
  const at = (i, j) => v[j * nx + i]
  // Edge ids: horizontal edge (i,j)-(i+1,j) and vertical edge (i,j)-(i,j+1).
  const hId = (i, j) => (j * nx + i) * 2
  const vId = (i, j) => (j * nx + i) * 2 + 1
  const point = (id) => {
    const cell = id >> 1
    const i = cell % nx
    const j = (cell - i) / nx
    const a = at(i, j)
    if (id & 1) {
      const b = at(i, j + 1)
      const t = (level - a) / (b - a)
      return [x0 + i * step, y0 + (j + t) * step]
    }
    const b = at(i + 1, j)
    const t = (level - a) / (b - a)
    return [x0 + (i + t) * step, y0 + j * step]
  }

  // Segments are oriented so the region (value >= level) lies on the left.
  const next = new Map()
  const add = (a, b) => next.set(a, b)
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const tl = at(i, j) >= level ? 1 : 0
      const tr = at(i + 1, j) >= level ? 1 : 0
      const br = at(i + 1, j + 1) >= level ? 1 : 0
      const bl = at(i, j + 1) >= level ? 1 : 0
      const code = tl * 8 + tr * 4 + br * 2 + bl
      if (code === 0 || code === 15) continue
      const T = hId(i, j)
      const B = hId(i, j + 1)
      const L = vId(i, j)
      const R = vId(i + 1, j)
      switch (code) {
        case 1: add(L, B); break
        case 2: add(B, R); break
        case 3: add(L, R); break
        case 4: add(R, T); break
        case 6: add(B, T); break
        case 7: add(L, T); break
        case 8: add(T, L); break
        case 9: add(T, B); break
        case 11: add(T, R); break
        case 12: add(R, L); break
        case 13: add(R, B); break
        case 14: add(B, L); break
        case 5: case 10: {
          const centre = (at(i, j) + at(i + 1, j) + at(i + 1, j + 1) + at(i, j + 1)) / 4
          // Centre inside: the two inside corners join and the outside
          // corners are cut off; otherwise the inside corners are isolated.
          if (code === 5) {
            if (centre >= level) { add(L, T); add(R, B) } else { add(R, T); add(L, B) }
          } else {
            if (centre >= level) { add(T, R); add(B, L) } else { add(T, L); add(B, R) }
          }
          break
        }
      }
    }
  }

  const loops = []
  for (const start of next.keys()) {
    if (!next.has(start)) continue
    const loop = []
    let id = start
    while (next.has(id)) {
      loop.push(point(id))
      const n = next.get(id)
      next.delete(id)
      id = n
    }
    if (loop.length > 2) loops.push(loop)
  }
  return loops
}

// Sample a field over [x0, x1] x [y0, y1], padded by one cell of -Infinity.
export function sampleGrid(field, x0, y0, x1, y1, step) {
  const nx = Math.ceil((x1 - x0) / step) + 3
  const ny = Math.ceil((y1 - y0) / step) + 3
  const v = new Float64Array(nx * ny)
  const ox = x0 - step
  const oy = y0 - step
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const edge = i === 0 || j === 0 || i === nx - 1 || j === ny - 1
      v[j * nx + i] = edge ? -1e9 : field(ox + i * step, oy + j * step)
    }
  }
  return { nx, ny, v, x0: ox, y0: oy, step }
}

// Drop points closer than `min` to the previous kept point (keeps paths small).
export function thin(loop, min) {
  const out = [loop[0]]
  for (let k = 1; k < loop.length; k++) {
    const [px, py] = out[out.length - 1]
    const [x, y] = loop[k]
    if (Math.hypot(x - px, y - py) >= min) out.push(loop[k])
  }
  return out.length > 2 ? out : loop
}

// Closed smooth path through the points (Catmull-Rom as cubic Béziers).
export function smoothClosed(pts, d = 1) {
  const n = pts.length
  const p = (k) => pts[((k % n) + n) % n]
  let s = `M${round(p(0)[0], d)} ${round(p(0)[1], d)}`
  for (let k = 0; k < n; k++) {
    const p0 = p(k - 1), p1 = p(k), p2 = p(k + 1), p3 = p(k + 2)
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    s += `C${round(c1[0], d)} ${round(c1[1], d)} ${round(c2[0], d)} ${round(c2[1], d)} ${round(p2[0], d)} ${round(p2[1], d)}`
  }
  return s + 'Z'
}

export const polyline = (pts, d = 1, close = false) =>
  'M' + pts.map(([x, y]) => `${round(x, d)} ${round(y, d)}`).join('L') + (close ? 'Z' : '')
