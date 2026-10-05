// Draws SWK Ghana's brand patterns into public/patterns/*.svg.
//
// Two patterns run through every page, so the site reads as one family:
//   flow.svg    the signature: ribbed green bands that wrap into eyes and
//               pointed seams, like a printed cloth. Shown bold on strips
//               and panels, and under a deep green veil on dark sections.
//   weave.svg   a quiet patchwork of geometric line motifs for light sections.
//
// Each page family then has its own (see scripts/patterns/motifs.mjs):
//   keys, wax, arcs, unity, rosette, arches and kente.
//
// The colours are the brand palette in src/index.css. The drawings are our
// own, so they can be used anywhere: web, print, slides and social posts.
//
// Usage: npm run build:patterns
// The SVGs are committed, so deploys don't run this.

import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { flowField, flowSvg } from './patterns/flow.mjs'
import { weaveSvg } from './patterns/weave.mjs'
import * as motifs from './patterns/motifs.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'patterns')
mkdirSync(out, { recursive: true })

// Band colours, cycled outwards: deep green to lime to pale and back, so
// each ribbon reads as a rounded tube.
const FLOW_PALETTE = ['#17702D', '#2F9A3A', '#78C31E', '#B5E57A', '#DDF5BD', '#B5E57A', '#78C31E', '#2F9A3A']

const field = flowField({ seed: 32, w: 320, h: 400, count: 2, stretch: 1.2, warp: 0.05, soft: 0.004 })

const files = {
  'flow.svg': flowSvg({
    ...field,
    band: 12,
    minLoop: 18,
    palette: FLOW_PALETTE,
    ink: '#0A2410',
    outline: 1.4,
    rib: { width: 1.1, gap: 4.2, opacity: 0.8, reach: 2.4 },
  }),
  'weave.svg': weaveSvg({ seed: 9, size: 480, n: 4, colour: '#EAF0E1' }),
  'keys.svg': motifs.keys(),
  'wax.svg': motifs.wax(),
  'arcs.svg': motifs.arcs(),
  'unity.svg': motifs.unity(),
  'rosette.svg': motifs.rosette(),
  'arches.svg': motifs.archFrame(),
  'kente.svg': motifs.kente(),
}

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(out, name), svg)
  console.log(`✓ patterns/${name}  ${(svg.length / 1024).toFixed(1)} KB`)
}
