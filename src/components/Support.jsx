import React, { useMemo, useState } from 'react'
import Seo from './Seo'
import SocialLinks from './SocialLinks'
import { FlowBackdrop, FlowStrip } from './Patterns'
import { TOOLKIT, CATEGORIES, RESOURCES } from '../data/support'
import { CONTACT, SOCIALS } from '../data/socials'

const WHATSAPP = SOCIALS.find((s) => s.id === 'whatsapp')?.href
const SUGGEST = `mailto:${CONTACT.email}?subject=${encodeURIComponent('NGO Support Hub: a suggestion')}`

const kb = (bytes) => (bytes ? `${Math.round(bytes / 1024)} KB` : null)
const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? ''

// ── Toolkit cover, drawn in CSS to echo the PDFs' own covers ────────────────
const Cover = ({ no, title, edition, size = 'md', className = '' }) => (
  <div
    className={`relative overflow-hidden bg-[#0C2E11] text-white ${size === 'lg' ? 'p-7 sm:p-9' : 'p-5'} ${className}`}
    aria-hidden="true"
  >
    <span className={`absolute rounded-full border-[#78C31E]/25 ${size === 'lg' ? '-right-16 -top-16 h-56 w-56 border-[22px]' : '-right-10 -top-10 h-36 w-36 border-[14px]'}`} />
    <span className="absolute right-4 bottom-1 text-[5.5rem] font-bold leading-none text-white/[0.06] select-none">{no}</span>
    <p className="relative text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#A8E04A]">NGO Support Toolkit · {no}</p>
    <p className={`relative mt-3 font-bold leading-tight text-white ${size === 'lg' ? 'text-2xl sm:text-3xl max-w-xs' : 'text-lg max-w-[13rem]'}`}>{title}</p>
    {edition && <p className="relative mt-1.5 text-xs text-white/70">{edition}</p>}
  </div>
)

const DownloadIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
)

const ExternalIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)

const DocActions = ({ item }) => (
  <div className="flex flex-wrap items-center gap-2">
    <a
      href={item.href}
      download
      className="inline-flex items-center gap-2 rounded-xl bg-[#17702D] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0F5A24] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78C31E] focus-visible:ring-offset-2"
    >
      <DownloadIcon /> Download PDF
      <span className="sr-only">: {item.title}</span>
    </a>
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#17702D] transition-colors hover:bg-[#F2FAE8] hover:text-[#177a30] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78C31E]"
    >
      Preview <ExternalIcon />
      <span className="sr-only">{item.title} (opens in a new tab)</span>
    </a>
  </div>
)

const DocMeta = ({ item }) => (
  <p className="text-xs font-medium text-gray-500">
    PDF{item.pages ? ` · ${item.pages} pages` : ''}{item.bytes ? ` · ${kb(item.bytes)}` : ''}
  </p>
)

const FAQS = [
  {
    q: 'Is it really free?',
    a: 'Yes. Everything we publish on this page is free to download and use, with no sign-up. Some of the partner tools we link to are free or discounted only for eligible non-profits, so check each provider’s rules.',
  },
  {
    q: 'Can we change the templates?',
    a: 'Yes, please do. Adapt them for your organisation’s own work. If you share them with others, we ask that you credit SWK Ghana.',
  },
  {
    q: 'Is this legal or financial advice?',
    a: 'No. The toolkit is practical guidance from our own experience. Rules change, so confirm requirements with the relevant authority or a qualified adviser, especially for registration, tax and contracts.',
  },
  {
    q: 'How can we suggest a resource?',
    a: `Email ${CONTACT.email} with the link and why it helped you. We review suggestions when we update this page.`,
  },
]

const Support = () => {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RESOURCES.filter((r) => {
      if (cat !== 'all' && r.cat !== cat) return false
      if (!q) return true
      return [r.name, r.desc, catLabel(r.cat), ...r.tags].join(' ').toLowerCase().includes(q)
    })
  }, [query, cat])

  const [featured, ...rest] = TOOLKIT
  const counts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, RESOURCES.filter((r) => r.cat === c.id).length])),
    []
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'NGO Support Hub',
    url: 'https://swkghana.org/support',
    description: 'Free templates, guides and trusted resources to help NGOs in Ghana and across Africa grow.',
    publisher: { '@type': 'NGO', name: 'SWK Ghana LBG', url: 'https://swkghana.org/' },
    hasPart: TOOLKIT.map((d) => ({
      '@type': 'DigitalDocument',
      name: `${d.title}${d.edition ? `: ${d.edition}` : ''}`,
      description: d.desc,
      url: `https://swkghana.org${d.href}`,
      encodingFormat: 'application/pdf',
      isAccessibleForFree: true,
      inLanguage: 'en',
    })),
  }

  return (
    <main className="bg-white">
      <Seo
        title="NGO Support Hub: Free Toolkit and Resources | SWK Ghana"
        description="Free templates, guides and trusted links to help NGOs grow: registration in Ghana, grant proposals, monitoring and evaluation, partnerships, storytelling and volunteers."
        path="/support"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══ Hero ══════════════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden bg-[#0C2E11] text-white">
        <FlowBackdrop />
        <div className="relative swk-shell grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div className="anim-rise">
            <h1 className="text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Free tools to help your NGO grow.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Templates, guides and trusted links we use ourselves, shared free with NGOs, community groups and
              youth-led organisations in Ghana and across Africa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#toolkit" className="inline-flex items-center gap-2 rounded-xl bg-[#78C31E] px-6 py-3.5 text-sm font-bold text-[#0C2E11] transition-colors hover:bg-[#8AD62B] hover:text-[#0C2E11] sm:text-base">
                Get the free toolkit <span aria-hidden="true">&darr;</span>
              </a>
              <a href="#library" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:text-white sm:text-base">
                Browse {RESOURCES.length} resources
              </a>
            </div>
            <p className="mt-5 text-sm text-white/60">No sign-up. No cost. Free to adapt for your organisation.</p>
          </div>

          {/* A fanned stack of three toolkit covers */}
          <div className="relative mx-auto hidden h-[23rem] w-full max-w-md sm:block" aria-hidden="true">
            {[TOOLKIT[2], TOOLKIT[1], TOOLKIT[0]].map((d, i) => (
              <div
                key={d.file}
                className="absolute left-1/2 top-1/2 w-60 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40 ring-1 ring-white/10"
                style={{ transform: `translate(-50%, -50%) translateX(${(i - 1) * 78}px) rotate(${(i - 1) * 7}deg)`, zIndex: i }}
              >
                <Cover no={d.no} title={d.title} edition={d.edition} className="h-48" />
                <div className="space-y-2 p-4">
                  <span className="block h-2 w-3/4 rounded-full bg-gray-200" />
                  <span className="block h-2 w-full rounded-full bg-gray-100" />
                  <span className="block h-2 w-5/6 rounded-full bg-gray-100" />
                  <span className="mt-3 block h-2 w-1/2 rounded-full bg-[#D4F0A0]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At a glance */}
        <div className="relative border-t border-white/10">
          <dl className="swk-shell grid grid-cols-2 md:grid-cols-4">
            {[
              [TOOLKIT.length, 'Templates and guides'],
              [RESOURCES.length, 'Trusted resources'],
              [CATEGORIES.length, 'Topics covered'],
              ['100%', 'Free to use'],
            ].map(([n, label], i) => (
              <div key={label} className={`py-6 ${i % 2 ? 'pl-6' : ''} md:pl-6 ${i ? 'md:border-l md:border-white/10' : 'md:pl-0'}`}>
                <dt className="text-sm text-white/65">{label}</dt>
                <dd className="mt-1 text-3xl font-bold text-white">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
        <FlowStrip />
      </section>

      {/* ══ Toolkit ═══════════════════════════════════════════════════════ */}
      <section id="toolkit" className="scroll-mt-28 swk-weave py-16 sm:py-20">
        <div className="swk-shell">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Seven practical guides, ready to use today</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              Written by our team from what we’ve learned running a youth-led NGO in Ghana. Download them, print
              them, and adapt them to your organisation.
            </p>
          </div>

          {/* Featured: the Ghana checklist */}
          <article className="mt-10 grid overflow-hidden rounded-3xl border border-[#D4F0A0] bg-white shadow-sm md:grid-cols-[1fr_1.15fr]">
            <Cover no={featured.no} title={featured.title} edition={featured.edition} size="lg" className="min-h-[15rem]" />
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-9">
              <h3 className="text-2xl font-bold text-gray-900">
                {featured.title}: <span className="text-[#17702D]">{featured.edition}</span>
              </h3>
              <p className="leading-relaxed text-gray-600">{featured.desc}</p>
              <DocMeta item={featured} />
              <DocActions item={featured} />
            </div>
          </article>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((d) => (
              <article key={d.file} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#B5DE7F] hover:shadow-md">
                <Cover no={d.no} title={d.title} edition={d.edition} className="h-40" />
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="text-lg font-bold leading-snug text-gray-900">{d.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-600">{d.desc}</p>
                  <DocMeta item={d} />
                  <DocActions item={d} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Library ═══════════════════════════════════════════════════════ */}
      <section id="library" className="scroll-mt-28 py-16 sm:py-20">
        <div className="swk-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Links worth your time</h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                Official registration offices, funders, free and discounted tools, standards and courses. Each one
                checked by our team.
              </p>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search resources</span>
              <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search, e.g. grants, survey, tax"
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-11 pr-4 text-gray-800 transition-colors focus:border-[#1E963C] focus:outline-none focus:ring-4 focus:ring-[#78C31E]/25"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
            {[{ id: 'all', label: 'All' }, ...CATEGORIES].map((c) => {
              const on = cat === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78C31E] ${
                    on ? 'border-[#17702D] bg-[#17702D] text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-[#78C31E] hover:text-[#1E963C]'
                  }`}
                >
                  {c.label}
                  <span className={`text-xs ${on ? 'text-white' : 'text-gray-500'}`}>
                    {c.id === 'all' ? RESOURCES.length : counts[c.id]}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mt-6 text-sm text-gray-500" aria-live="polite">
            Showing {results.length} of {RESOURCES.length} resources
          </p>

          {results.length ? (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B5DE7F] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78C31E]"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-base font-bold leading-snug text-gray-900 group-hover:text-[#1E963C]">{r.name}</span>
                      <span className="mt-1 flex-none text-gray-500 group-hover:text-[#1E963C]"><ExternalIcon /></span>
                    </span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{r.desc}</span>
                    <span className="mt-4 flex flex-wrap gap-1.5">
                      {r.tags.map((t) => (
                        <span key={t} className="rounded-full bg-[#F2FAE8] px-2.5 py-0.5 text-xs font-semibold text-[#17702D]">{t}</span>
                      ))}
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <p className="font-semibold text-gray-900">No resources match that search.</p>
              <button
                type="button"
                onClick={() => { setQuery(''); setCat('all') }}
                className="mt-3 text-sm font-bold text-[#17702D] underline underline-offset-4"
              >
                Clear the search and filters
              </button>
            </div>
          )}

          <p className="mt-6 text-xs text-gray-500">
            Links go to other organisations’ websites, which we don’t control. Last checked October 2026.
          </p>
        </div>
      </section>

      {/* ══ Suggest + follow ══════════════════════════════════════════════ */}
      <section className="swk-shell pb-16 sm:pb-20">
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#0C2E11] px-6 py-12 text-white sm:px-10 lg:px-14">
          <FlowBackdrop />
          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">What would help your organisation next?</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/75">
                Tell us which template, guide or tool you need, or share a resource that helped you. We add to this hub
                as we learn.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={SUGGEST} className="inline-flex items-center gap-2 rounded-xl bg-[#78C31E] px-6 py-3.5 font-bold text-[#0C2E11] transition-colors hover:bg-[#8AD62B] hover:text-[#0C2E11]">
                  Suggest a resource
                </a>
                {WHATSAPP && (
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10 hover:text-white">
                    Join our WhatsApp community
                  </a>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-bold text-white">Follow SWK Ghana</p>
              <p className="mt-1 text-sm text-white/70">New resources, events and opportunities for NGOs and young changemakers.</p>
              <SocialLinks tone="dark" size="md" className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════════════ */}
      <section className="border-t border-gray-100 swk-weave py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">Questions</h2>
          <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#F2FAE8] text-[#17702D] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-gray-600">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            General guidance, not legal or financial advice. Toolkit last reviewed October 2026.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Support
