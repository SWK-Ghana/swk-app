import React from 'react'
import { FlowBackdrop, FlowStrip, PatternArch } from './Patterns'

// The header every inner page opens with: deep green over Flow (SWK's
// signature pattern), the page family's own pattern in an arch on the
// right, and a ribbon of full-colour Flow along the bottom edge.
//
// `children` sits under the lede (buttons, meta). `aside` replaces the arch.
const PageHero = ({ eyebrow, title, lede, pattern, aside, children }) => (
  <section className="relative isolate overflow-hidden bg-[#0C2E11] text-white">
    <FlowBackdrop />
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20 lg:px-10 lg:py-20 xl:px-12">
      <div className="anim-rise max-w-3xl">
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#A8E04A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A8E04A]" /> {eyebrow}
          </p>
        )}
        <h1 className="mt-6 text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">{title}</h1>
        {lede && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{lede}</p>}
        {children}
      </div>
      {aside ?? (pattern && <PatternArch name={pattern} className="hidden lg:block lg:w-[19rem]" />)}
    </div>
    <FlowStrip />
  </section>
)

export default PageHero
