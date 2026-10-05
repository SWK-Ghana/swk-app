import React from 'react'

// SWK Ghana's brand patterns (public/patterns, drawn by
// scripts/build-patterns.mjs). Flow and Weave run through every page; each
// page family shows one of these in its hero arch:
//
//   keys     Resources, Reports, FAQ, Privacy
//   wax      Our Work, Taka Kipawa
//   unity    About, Team, 404
//   rosette  Get Involved, Donate, Contact
//   arcs     Blog (covers and the follow card)
//
// The standalone pages use the rest: kente (Summit) and arches (Pitch Workshop).
const PATTERNS = {
  keys: { src: '/patterns/keys.svg', size: '180px', bg: '#F7FAF2' },
  wax: { src: '/patterns/wax.svg', size: '190px', bg: '#0C2E11' },
  unity: { src: '/patterns/unity.svg', size: '190px', bg: '#F2FAE8' },
  rosette: { src: '/patterns/rosette.svg', size: '230px', bg: '#F7FAF2' },
  arcs: { src: '/patterns/arcs.svg', size: '260px', bg: '#F7FAF2' },
}

const patternStyle = (name, size) => {
  const p = PATTERNS[name]
  return { backgroundColor: p.bg, backgroundImage: `url(${p.src})`, backgroundSize: size ?? p.size, backgroundPosition: 'center' }
}

// Flow behind a deep green veil. Place inside a `relative isolate` section.
export const FlowBackdrop = ({ veil = 'swk-veil' }) => (
  <>
    <div className="swk-flow absolute inset-0 -z-20" aria-hidden="true" />
    <div className={`${veil} absolute inset-0 -z-10`} aria-hidden="true" />
  </>
)

// A rounded panel over Flow: calls to action and highlight cards.
export const FlowPanel = ({ veil = 'swk-veil-green', className = '', children }) => (
  <div className={`relative isolate overflow-hidden rounded-2xl text-white ${className}`}>
    <FlowBackdrop veil={veil} />
    {children}
  </div>
)

// A ribbon of full-colour Flow along an edge.
export const FlowStrip = ({ className = 'h-2.5' }) => (
  <div className={`swk-flow-strip ${className}`} aria-hidden="true" />
)

// A page's own pattern framed in an arch, with a Flow medallion tying it
// back to the signature pattern.
export const PatternArch = ({ name, className = '' }) => (
  <div className={`relative mx-auto w-full max-w-[19rem] ${className}`} aria-hidden="true">
    <div className="absolute -inset-3 rounded-t-full rounded-b-[2.1rem] border border-[#A8E04A]/35" />
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[1.6rem] shadow-2xl shadow-black/40 ring-1 ring-white/10"
      style={patternStyle(name)}
    />
    <div
      className="swk-flow absolute -bottom-6 -left-6 h-24 w-24 rounded-full shadow-xl shadow-black/40 ring-[5px] ring-[#0C2E11]"
      style={{ backgroundSize: '300px auto', backgroundPosition: '42% 38%' }}
    />
  </div>
)

// A band of a page pattern (for dividers and feature cards).
export const PatternBand = ({ name, size, className = '' }) => (
  <div className={className} style={patternStyle(name, size)} aria-hidden="true" />
)
