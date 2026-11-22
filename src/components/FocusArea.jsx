import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  LuArrowRight, LuCrown, LuExternalLink, LuHandshake, LuPlay, LuSprout,
} from 'react-icons/lu'
import Seo from './Seo'
import PageHero from './PageHero'
import { FlowPanel } from './Patterns'
import NotFound from './NotFound'
import { AGRI_JOURNEY, FOCUS_AREAS, MARKETPLACE, TAKA_KIPAWA, cld, focusArea } from '../data/focusAreas'
import { PARTNERSHIPS } from '../data/partnerships'
import { AREA_ICONS } from '../data/focusAreaIcons'

// One page per focus area, at /our-work/<slug>. The content is in src/data/focusAreas.js.
// Agribusiness also tells its story in order: Phase 1 (five webinars, crowned by
// the Summit), then Phase 2 (the Mentorship Programme).

const PROJECTS = { taka: TAKA_KIPAWA, marketplace: MARKETPLACE }

const SectionHead = ({ eyebrow, title, children }) => (
  <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17702D]">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">{title}</h2>
    {children && <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">{children}</p>}
  </div>
)

// A link that opens in a new tab when it leaves the site.
const Go = ({ href, external, className, children }) => (
  external || /^https?:/.test(href)
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
    : <a href={href} className={className}>{children}</a>
)

const imgSrc = (p, w) => (p.src ? p.src : cld(p.path, w))

const Video = ({ ytId, title, desc }) => {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#D4F0A0] bg-white text-center shadow-sm">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={`Play video: ${title}`}>
            <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/40">
              <span className="flex items-center gap-2 rounded-2xl bg-[#17702D] px-5 py-3 text-sm font-bold text-white shadow-lg">
                <LuPlay className="h-5 w-5" aria-hidden="true" /> Play
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  )
}

const LinkCard = ({ item }) => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-[#D4F0A0] bg-gradient-to-br from-[#F2FAE8] to-white text-center">
    {item.image && <img src={cld(item.image.path, 700)} alt={item.image.alt} className="h-48 w-full object-cover" loading="lazy" />}
    <div className="flex flex-1 flex-col p-6">
      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
      <p className="mb-5 mt-2 flex-1 text-sm leading-relaxed text-gray-600">{item.text}</p>
      <Go href={item.href} external={item.external} className="inline-flex items-center justify-center gap-1.5 self-center rounded-xl bg-[#17702D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0F5A24] hover:text-white">
        {item.cta} {item.external ? <LuExternalLink className="h-4 w-4" aria-hidden="true" /> : <LuArrowRight className="h-4 w-4" aria-hidden="true" />}
      </Go>
    </div>
  </div>
)

// The agribusiness story, in order.
const Journey = () => (
  <section className="py-16 sm:py-20">
    <div className="swk-shell">
      <SectionHead eyebrow="Our agribusiness journey" title="Five webinars, a Summit, then mentorship.">
        Phase 1 raised awareness and built knowledge, and the Summit crowned it. Phase 2 turns that knowledge into businesses.
      </SectionHead>
      <ol className="relative mx-auto max-w-3xl">
        <span className="absolute bottom-6 left-5 top-6 w-0.5 bg-[#D4F0A0] sm:left-1/2 sm:-translate-x-1/2" aria-hidden="true" />
        {AGRI_JOURNEY.map((s, i) => (
          <li key={s.title} className="relative mb-6 pl-14 last:mb-0 sm:pl-0">
            <span className={`absolute left-0 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold sm:left-1/2 sm:-translate-x-1/2 ${s.current ? 'bg-[#0C2E11] text-[#A8E04A] ring-4 ring-[#78C31E]' : s.crown ? 'bg-[#78C31E] text-[#123D16] ring-4 ring-white' : 'bg-white text-[#17702D] ring-4 ring-[#D4F0A0]'}`} aria-hidden="true">
              {s.crown ? <LuCrown className="h-5 w-5" /> : s.current ? <LuSprout className="h-5 w-5" /> : <span className="text-xs">{s.mark}</span>}
            </span>
            <div className={`rounded-2xl p-5 text-center sm:w-[calc(50%-2.5rem)] ${i % 2 ? 'sm:ml-auto' : ''} ${s.current ? 'bg-[#0C2E11] text-white shadow-xl' : s.crown ? 'border-2 border-[#78C31E] bg-[#F4FAEC]' : 'border border-gray-200 bg-white shadow-sm'}`}>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${s.current || s.crown ? 'bg-[#78C31E] text-[#123D16]' : 'bg-[#F2FAE8] text-[#17702D]'}`}>{s.phase}</span>
              <p className={`mt-2 text-sm font-bold ${s.current ? 'text-[#A8E04A]' : 'text-[#17702D]'}`}>{s.when}</p>
              <h3 className={`mt-1 text-lg font-bold ${s.current ? 'text-white' : 'text-gray-900'}`}>{s.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${s.current ? 'text-white/85' : 'text-gray-600'}`}>{s.text}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
                {s.links.map((l) => (
                  <Go key={l.label} href={l.href} external={l.external} className={`inline-flex items-center gap-1 text-sm font-bold hover:underline ${s.current ? 'text-[#A8E04A]' : 'text-[#17702D]'}`}>
                    {l.label} {l.external ? <LuExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> : <LuArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  </Go>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

const FocusArea = () => {
  const { slug } = useParams()
  const area = focusArea(slug)
  if (!area) return <NotFound />
  const Icon = AREA_ICONS[area.slug]
  const others = FOCUS_AREAS.filter((a) => a.slug !== area.slug)
  const isAgri = area.slug === 'agribusiness'
  const cards = [...(area.projects || []).map((p) => PROJECTS[p]), ...(area.links || [])]

  return (
    <div className="min-h-screen bg-white">
      <Seo title={`${area.name} | SWK Ghana`} description={`${area.short} ${area.lede}`.slice(0, 300)} path={`/our-work/${area.slug}`} />

      <PageHero
        title={area.name}
        lede={area.lede}
        aside={(
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-[#78C31E]/80" aria-hidden="true" />
            <img
              src={imgSrc(area.hero, 1024)}
              srcSet={area.hero.srcSet}
              sizes="(min-width: 1024px) 42vw, 100vw"
              width={area.hero.width}
              height={area.hero.height}
              alt={area.hero.alt}
              fetchPriority="high"
              decoding="async"
              className={`relative block w-full rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10 ${area.hero.src ? 'h-auto' : 'aspect-[4/3] object-cover'}`}
            />
          </div>
        )}
      >
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A8E04A]">
          <Icon className="h-4 w-4" aria-hidden="true" /> Focus area · Our Work
        </p>
      </PageHero>

      {area.stats && (
        <div className="swk-flow-deep py-10">
          <dl className="swk-shell grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {area.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-bold text-[#78C31E] sm:text-4xl">{s.n}</dd>
                <dd className="mt-1 text-sm text-white/80">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* What we do */}
      <section className="swk-weave py-16 sm:py-20">
        <div className="swk-shell">
          <SectionHead eyebrow="What we do" title={area.short} />
          <div className="grid gap-5 md:grid-cols-3">
            {area.does.map((d, i) => (
              <div key={d.title} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2FAE8] text-sm font-bold text-[#17702D]">{i + 1}</span>
                <h3 className="text-lg font-bold text-gray-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isAgri && <Journey />}

      {isAgri && (
        <section className="swk-weave py-16 sm:py-20">
          <div className="swk-shell">
            <SectionHead eyebrow="Partnerships and milestones" title="Where we stand in agribusiness." />
            <div className="grid gap-5 md:grid-cols-3">
              {PARTNERSHIPS.map((p) => {
                const cover = p.photos.find((ph) => !ph.poster)
                return (
                  <a key={p.id} href={`/our-work#${p.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-center shadow-sm transition-all hover:border-[#78C31E] hover:shadow-md">
                    <img src={cld(cover.path, 700)} alt={cover.alt} className="h-48 w-full object-cover" loading="lazy" />
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-bold text-gray-900">{p.title}</h3>
                      <p className="mt-2 flex-1 text-sm text-gray-600">{p.short}</p>
                      <span className="mt-3 inline-flex items-center justify-center gap-1 text-sm font-bold text-[#17702D] group-hover:underline">Read the story <LuArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {cards.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="swk-shell">
            <SectionHead eyebrow={area.projects ? 'Our projects' : 'Take part'} title={area.projects ? `Where ${area.name.toLowerCase().replace(/ (programs|initiatives|projects)$/, '')} comes to life.` : 'Be part of it.'} />
            <div className={`mx-auto grid gap-5 ${cards.length === 1 ? 'max-w-md' : cards.length === 2 ? 'max-w-4xl md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {cards.map((c) => <LinkCard key={c.title} item={c} />)}
            </div>
          </div>
        </section>
      )}

      {area.videos && (
        <section className={`${cards.length ? 'swk-weave' : ''} py-16 sm:py-20`}>
          <div className="swk-shell">
            <SectionHead eyebrow="Watch" title="See the work." />
            <div className={`mx-auto grid gap-5 ${area.videos.length === 1 ? 'max-w-xl' : 'max-w-4xl md:grid-cols-2'}`}>
              {area.videos.map((v) => <Video key={v.ytId} {...v} />)}
            </div>
          </div>
        </section>
      )}

      {/* Photos and the article */}
      <section className="py-16 sm:py-20">
        <div className="swk-shell">
          <SectionHead eyebrow="In pictures" title="From our programmes." />
          <div className={`mx-auto grid gap-4 ${area.photos.length === 1 ? 'max-w-md' : area.photos.length === 2 ? 'max-w-4xl grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {area.photos.map((p) => (
              <figure key={p.alt} className="overflow-hidden rounded-2xl bg-[#F2FAE8]">
                <img src={imgSrc(p, 900)} alt={p.alt} loading="lazy" decoding="async" className={p.whole ? 'h-auto w-full' : 'aspect-[4/3] w-full object-cover'} />
              </figure>
            ))}
          </div>

          <a href={`/blog/${area.article.slug}`} className="group mx-auto mt-10 flex max-w-3xl flex-col items-center gap-2 rounded-2xl border border-[#D4F0A0] bg-gradient-to-br from-[#F2FAE8] to-white p-6 text-center transition-shadow hover:shadow-md">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#17702D]">Read the article</span>
            <span className="text-xl font-bold text-gray-900">{area.article.title}</span>
            <span className="text-sm text-gray-600">{area.article.excerpt}</span>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-[#17702D] group-hover:underline">Read on our blog <LuArrowRight className="h-4 w-4" aria-hidden="true" /></span>
          </a>
        </div>
      </section>

      {/* The other focus areas, so the whole of Our Work is one click away */}
      <section className="swk-weave py-16 sm:py-20">
        <div className="swk-shell">
          <SectionHead eyebrow="Our Work" title="Explore our other focus areas." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((a) => {
              const I = AREA_ICONS[a.slug]
              return (
                <a key={a.slug} href={`/our-work/${a.slug}`} className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#78C31E] hover:shadow-md">
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2FAE8] text-[#17702D]"><I className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="font-bold text-gray-900 group-hover:text-[#17702D]">{a.name}</span>
                </a>
              )
            })}
          </div>
          <p className="mt-6 text-center"><a href="/our-work" className="inline-flex items-center gap-1 text-sm font-bold text-[#17702D] hover:underline">All our work <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a></p>
        </div>
      </section>

      <section className="swk-shell py-16 sm:py-20">
        <FlowPanel className="px-6 py-10 text-center sm:px-12 sm:py-14">
          <LuHandshake className="mx-auto h-10 w-10 text-[#A8E04A]" aria-hidden="true" />
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Work with us on {area.name.toLowerCase()}.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">Volunteer, partner with us, or support the work with a gift.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/get-involved" className="inline-flex items-center gap-2 rounded-xl bg-[#78C31E] px-6 py-3.5 text-sm font-bold text-[#0C2E11] hover:bg-[#8AD62B] hover:text-[#0C2E11] sm:text-base">Get involved <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href="/donate" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 hover:text-white sm:text-base">Donate</a>
          </div>
        </FlowPanel>
      </section>
    </div>
  )
}

export default FocusArea
