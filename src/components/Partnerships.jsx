import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PARTNERSHIPS } from '../data/partnerships'

const CLD = 'https://res.cloudinary.com/dwgj3lovn/image/upload'
const src = (path, w) => `${CLD}/f_auto,q_auto,c_limit,w_${w}/${path}`
const srcSet = (path) => [400, 640, 960, 1280].map((w) => `${src(path, w)} ${w}w`).join(', ')

// A photo that opens the viewer. Fills its cell (the cell sets the shape).
const Tile = ({ photo, onOpen, sizes, className = '', children }) => (
  <button
    type="button"
    onClick={onOpen}
    className={`group relative block overflow-hidden rounded-2xl bg-[#0C2E11] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#78C31E] ${className}`}
    aria-label={`View photo: ${photo.alt}`}
  >
    <img
      src={src(photo.path, 640)}
      srcSet={srcSet(photo.path)}
      sizes={sizes}
      alt=""
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.04] ${photo.poster ? 'object-contain bg-white' : 'object-cover'}`}
    />
    {children}
  </button>
)

// Each partnership gets a collage shaped to its photos.
const Collage = ({ item, open }) => {
  const [a, b, c, ...rest] = item.photos
  if (item.id === 'yogsec') {
    return (
      <div className="relative pb-12 pr-2 sm:pb-16">
        <Tile photo={a} onOpen={() => open(0)} sizes="(min-width: 1024px) 40vw, 90vw" className="aspect-[4/3] w-[88%] shadow-xl" />
        <Tile photo={b} onOpen={() => open(1)} sizes="(min-width: 1024px) 20vw, 45vw" className="!absolute bottom-0 right-0 aspect-[4/3] w-[48%] shadow-2xl ring-[6px] ring-white" />
      </div>
    )
  }
  if (item.id === 'e-academy') {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-3">
        {/* The poster sets the height (square, shown whole); the photos split it. */}
        <Tile photo={c} onOpen={() => open(2)} sizes="(min-width: 1024px) 22vw, 48vw" className="row-span-2 aspect-square !rounded-2xl ring-1 ring-gray-200" />
        <Tile photo={a} onOpen={() => open(0)} sizes="(min-width: 1024px) 22vw, 48vw" />
        <Tile photo={b} onOpen={() => open(1)} sizes="(min-width: 1024px) 22vw, 48vw" />
      </div>
    )
  }
  // Gastro Feastival: the pitch large, four festival photos beside it.
  const more = item.photos.length - 5
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-3">
      <Tile photo={a} onOpen={() => open(0)} sizes="(min-width: 1024px) 22vw, 48vw" className="row-span-2 aspect-[3/4]" />
      <Tile photo={b} onOpen={() => open(1)} sizes="(min-width: 1024px) 11vw, 24vw" />
      <Tile photo={c} onOpen={() => open(2)} sizes="(min-width: 1024px) 11vw, 24vw" />
      <Tile photo={rest[0]} onOpen={() => open(3)} sizes="(min-width: 1024px) 11vw, 24vw" />
      <Tile photo={rest[1]} onOpen={() => open(4)} sizes="(min-width: 1024px) 11vw, 24vw">
        {more > 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-[#0C2E11]/60 text-lg font-bold text-white">+{more}</span>
        )}
      </Tile>
    </div>
  )
}

const Viewer = ({ photos, index, setIndex, onClose }) => {
  const closeRef = useRef(null)
  const n = photos.length
  useEffect(() => { closeRef.current?.focus() }, [])
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % n)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n, onClose, setIndex])
  const photo = photos[index]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full px-3 py-1 text-3xl font-bold text-white hover:text-gray-300">✕</button>
      {n > 1 && (
        <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + n) % n) }} className="absolute left-2 top-1/2 -translate-y-1/2 px-3 text-5xl font-bold text-white hover:text-gray-300 sm:left-4">‹</button>
      )}
      <figure className="flex max-w-5xl flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <img src={src(photo.path, 1280)} alt={photo.alt} className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl" />
        <figcaption className="max-w-2xl text-center text-sm font-semibold text-white">{photo.alt}</figcaption>
        <p className="text-xs text-white/60">{index + 1} / {n}</p>
      </figure>
      {n > 1 && (
        <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % n) }} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 text-5xl font-bold text-white hover:text-gray-300 sm:right-4">›</button>
      )}
    </div>
  )
}

// Our Work: one story per partnership, photo collage and text alternating sides.
const Partnerships = () => {
  const [viewer, setViewer] = useState(null) // { item, index }
  const close = useCallback(() => setViewer(null), [])
  const setIndex = useCallback(
    (next) => setViewer((v) => ({ ...v, index: typeof next === 'function' ? next(v.index) : next })),
    []
  )

  return (
    <section id="partnerships" className="scroll-mt-28 bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-10 sm:mb-12">
      <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900">Partnerships and milestones</h2>
        <p className="mt-3 text-base text-gray-700 sm:text-lg">
          The partners we work with, and the stages we have stood on, for young people in agribusiness.
        </p>
      </div>

      <div className="space-y-16 sm:space-y-20">
        {PARTNERSHIPS.map((item, i) => (
          <article key={item.id} id={item.id} className="scroll-mt-28 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className={i % 2 ? 'lg:order-2' : ''}>
              <Collage item={item} open={(index) => setViewer({ item, index })} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">{item.title}</h3>
              <p className="mt-4 leading-relaxed text-gray-700 sm:text-lg">{item.body}</p>
              <ul className="mt-5 space-y-2.5">
                {item.facts.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-gray-700 sm:text-base">
                    <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#78C31E]" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setViewer({ item, index: 0 })}
                className="mt-7 inline-flex items-center gap-2 rounded-xl border-2 border-[#1E963C] px-5 py-2.5 text-sm font-bold text-[#17702D] transition-colors hover:bg-[#1E963C] hover:text-white"
              >
                View all {item.photos.length} photos
              </button>
            </div>
          </article>
        ))}
      </div>

      {viewer && (
        <Viewer
          photos={viewer.item.photos}
          index={viewer.index}
          setIndex={setIndex}
          onClose={close}
        />
      )}
    </section>
  )
}

export default Partnerships
