import React from 'react'
import { FlowBackdrop, FlowStrip, PatternArch } from './Patterns'

const CLD = 'https://res.cloudinary.com/dwgj3lovn/image/upload'
// c_limit: never upscale past the original, so a small photo stays sharp.
const photoSrc = (path, w) => `${CLD}/f_auto,q_auto,c_limit,w_${w}/${path}`
const photoSrcSet = (path) => [480, 768, 1024, 1280, 1600].map((w) => `${photoSrc(path, w)} ${w}w`).join(', ')

// The header every inner page opens with: deep green over Flow (SWK's
// signature pattern) and a ribbon of full-colour Flow along the bottom edge.
//
// Beside the copy it shows one of:
//   image    a photo (people and programme pages), framed on the right, or
//            under centred copy with layout="center"
//   pattern  the page family's own pattern in an arch (knowledge pages)
//   aside    anything else
//
// image: { path, alt, position, aspect, frame } (path is a Cloudinary path;
// aspect a Tailwind aspect class for large screens; frame a max-width class,
// narrower for portrait photos so the header doesn't grow too tall).
// hideTitle keeps the h1 for search engines and screen readers only.
const PageHero = ({ eyebrow, title, hideTitle, lede, pattern, image, layout = 'split', aside, children }) => {
  const heading = title && (
    <h1 className={hideTitle ? 'sr-only' : `${eyebrow ? 'mt-6 ' : ''}text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl`}>{title}</h1>
  )
  const label = eyebrow && (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#A8E04A]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#A8E04A]" /> {eyebrow}
    </p>
  )

  if (image && layout === 'center') {
    return (
      <section className="relative isolate overflow-hidden bg-[#0C2E11] text-white">
        <FlowBackdrop veil="swk-veil-center" />
        <div className="anim-rise mx-auto max-w-4xl px-4 pt-14 text-center sm:px-6 sm:pt-20 lg:pt-24">
          {label}
          {heading}
          {lede && <div className="mx-auto max-w-3xl text-white/85">{lede}</div>}
          {children}
        </div>
        <div className="mx-auto mt-10 max-w-5xl px-4 sm:mt-12 sm:px-6">
          <img
            src={photoSrc(image.path, 1280)}
            srcSet={photoSrcSet(image.path)}
            sizes="(min-width: 1024px) 1024px, 100vw"
            alt={image.alt}
            fetchPriority="high"
            decoding="async"
            className={`block w-full rounded-t-3xl object-cover shadow-2xl shadow-black/40 aspect-[4/3] ${image.aspect ?? 'sm:aspect-[2/1]'}`}
            style={{ objectPosition: image.position ?? '50% 40%' }}
          />
        </div>
        <FlowStrip />
      </section>
    )
  }

  const side = aside ?? (image ? (
    <div className={`relative mx-auto w-full ${image.frame ?? 'max-w-xl'}`}>
      {/* A lime block offset behind the photo, like a print registration mark. */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-[#78C31E]/80" aria-hidden="true" />
      <img
        src={photoSrc(image.path, 1024)}
        srcSet={photoSrcSet(image.path)}
        sizes="(min-width: 1024px) 42vw, 100vw"
        alt={image.alt}
        fetchPriority="high"
        decoding="async"
        className={`relative block w-full rounded-3xl object-cover shadow-2xl shadow-black/40 ring-1 ring-white/10 aspect-[4/3] ${image.aspect ?? ''}`}
        style={{ objectPosition: image.position ?? '50% 40%' }}
      />
    </div>
  ) : pattern ? <PatternArch name={pattern} className="hidden lg:block lg:w-[19rem]" /> : null)

  return (
    <section className="relative isolate overflow-hidden bg-[#0C2E11] text-white">
      <FlowBackdrop />
      <div className={`mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 md:px-8 lg:gap-16 lg:px-10 lg:py-20 xl:px-12 ${image ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]' : 'lg:grid-cols-[minmax(0,1fr)_auto]'}`}>
        <div className="anim-rise max-w-3xl">
          {label}
          {heading}
          {lede && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{lede}</p>}
          {children}
        </div>
        {side}
      </div>
      <FlowStrip />
    </section>
  )
}

export default PageHero
