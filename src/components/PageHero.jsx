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
//            filling the header behind centred copy with layout="cover"
//   pattern  the page family's own pattern in an arch (knowledge pages)
//   aside    anything else
//
// image: { path, alt, position, aspect, frame } (path is a Cloudinary path;
// aspect a Tailwind aspect class for large screens; frame a max-width class,
// narrower for portrait photos so the header doesn't grow too tall).
// hideTitle keeps the h1 for search engines and screen readers only.
const PageHero = ({ title, hideTitle, lede, pattern, image, layout = 'split', aside, children }) => {
  const heading = title && (
    <h1 className={hideTitle ? 'sr-only' : 'text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl'}>{title}</h1>
  )

  if (image && layout === 'cover') {
    return (
      <section className="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-[#0C2E11] text-white sm:min-h-[36rem] lg:min-h-[42rem]">
        <img
          src={photoSrc(image.path, 1600)}
          srcSet={photoSrcSet(image.path)}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-30 h-full w-full object-cover"
          style={{ objectPosition: image.position ?? '50% 40%' }}
        />
        {/* The photo blends into the brand: a light green multiply, then a deep
            green wash that is strongest behind the copy and fades out towards
            the edges, so the people in the photo stay clearly visible. */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#78C31E] via-[#1E963C] to-[#123D16] opacity-70 mix-blend-multiply" aria-hidden="true" />
        <div className="swk-veil-photo absolute inset-0 -z-10" aria-hidden="true" />
        <div className="anim-rise swk-shell py-20 text-center sm:py-24 [text-shadow:0_2px_18px_rgba(0,0,0,.35)]">
          {heading}
          {lede && <div className="mx-auto max-w-4xl text-white/90">{lede}</div>}
          {children}
        </div>
        <FlowStrip className="absolute inset-x-0 bottom-0 h-2.5" />
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
      <div className={`swk-shell grid items-center gap-12 py-14 sm:py-16 lg:gap-16 lg:py-20 ${image ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]' : 'lg:grid-cols-[minmax(0,1fr)_auto]'}`}>
        <div className="anim-rise max-w-3xl">
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
