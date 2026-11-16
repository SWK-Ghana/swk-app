import React from 'react'
import { Link } from 'react-router-dom'
import { LuDownload, LuExternalLink, LuFileText } from 'react-icons/lu'
import Seo from './Seo'
import ToolkitCover from './ToolkitCover'
import { FlowBackdrop, FlowPanel, FlowStrip } from './Patterns'
import { TOOLKIT, RESOURCES, CATEGORIES } from '../data/support'
import { REPORTS } from '../data/reports'

// Resources opens straight onto the resources themselves: a slim header, then
// reports, then the NGO Support Hub (with a preview of the toolkit), then FAQ.

const PREVIEW_GUIDES = TOOLKIT.slice(0, 4)
// One trusted link from each of the first four library topics.
const PREVIEW_LINKS = CATEGORIES.slice(0, 4)
  .map((c) => ({ cat: c.label, item: RESOURCES.find((r) => r.cat === c.id) }))
  .filter((x) => x.item)
const LATEST_REPORTS = REPORTS.filter((r) => r.driveLink).slice(0, 3)

const kb = (bytes) => (bytes ? `${Math.round(bytes / 1024)} KB` : null)

const SectionTitle = ({ eyebrow, title, children, action }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17702D]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">{title}</h2>
      {children && <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">{children}</p>}
    </div>
    {action}
  </div>
)

const Resources = () => {
  return (
    <div className="min-h-screen swk-weave">
      <Seo
        title="Resources | SWK Ghana"
        description="SWK Ghana's event and impact reports, a free NGO toolkit with trusted links, and answers to common questions."
        path="/resources"
      />

      {/* Slim header: the page gets straight to the resources. */}
      <header className="relative isolate overflow-hidden bg-[#0C2E11] text-white">
        <FlowBackdrop />
        <div className="relative swk-shell py-7 text-center sm:py-9">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">Resources</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
            Our reports, free tools for NGOs and non-profits, and answers to common questions.
          </p>
          <nav className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-semibold" aria-label="On this page">
            <a href="#reports" className="rounded-full border border-white/25 px-4 py-1.5 text-white hover:border-[#78C31E] hover:text-[#A8E04A]">Reports</a>
            <a href="#ngo-support" className="rounded-full border border-white/25 px-4 py-1.5 text-white hover:border-[#78C31E] hover:text-[#A8E04A]">Support for NGOs and NPOs</a>
            <a href="#faq" className="rounded-full border border-white/25 px-4 py-1.5 text-white hover:border-[#78C31E] hover:text-[#A8E04A]">FAQ</a>
          </nav>
        </div>
        <FlowStrip />
      </header>

      <div className="swk-shell space-y-14 py-10 sm:space-y-16 sm:py-12">

        {/* ══ 1. Reports ════════════════════════════════════════════════════ */}
        <section id="reports" className="scroll-mt-28">
          <SectionTitle
            eyebrow="Reports"
            title="What we do, in numbers"
            action={(
              <Link to="/reports" className="btn-gradient shrink-0 rounded-xl px-5 py-2.5 text-center text-sm font-semibold">
                View all reports →
              </Link>
            )}
          >
            Event reports, impact reports and our annual reports, tracking our programmes, reach and results.
          </SectionTitle>

          <div className="grid gap-5 md:grid-cols-3">
            {LATEST_REPORTS.map((r) => (
              <article key={r.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {r.thumbnail && (
                  <img src={r.thumbnail} alt="" className="h-40 w-full object-cover" loading="lazy" decoding="async" />
                )}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="text-xs text-gray-600">{r.category} · {r.date}</p>
                  <h3 className="text-base font-bold leading-snug text-gray-900">{r.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-600">{r.description}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
                    <a href={r.driveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#17702D] hover:text-[#0F5A24]">
                      <LuFileText className="h-4 w-4" aria-hidden="true" />Read
                    </a>
                    {r.downloadLink && (
                      <a href={r.downloadLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#17702D] hover:text-[#0F5A24]">
                        <LuDownload className="h-4 w-4" aria-hidden="true" />PDF
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ══ 2. Support for NGOs and NPOs ══════════════════════════════════ */}
        <section id="ngo-support" className="scroll-mt-28">
          <SectionTitle
            eyebrow="NGO Support Hub"
            title="Support for NGOs and NPOs"
            action={(
              <Link to="/support" className="btn-gradient shrink-0 rounded-xl px-5 py-2.5 text-center text-sm font-semibold">
                Open the Support Hub →
              </Link>
            )}
          >
            {TOOLKIT.length} free templates and guides from our own experience, plus {RESOURCES.length} trusted links to help
            NGOs and non-profits register, raise funds, measure impact and grow.
          </SectionTitle>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PREVIEW_GUIDES.map((d) => (
              <article key={d.file} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#B5DE7F] hover:shadow-md">
                <ToolkitCover no={d.no} title={d.title} edition={d.edition} className="h-36" />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#17702D]">{d.topic}</p>
                  <p className="flex-1 text-sm leading-relaxed text-gray-600">{d.desc}</p>
                  <p className="text-xs text-gray-500">PDF{d.pages ? ` · ${d.pages} page${d.pages > 1 ? 's' : ''}` : ''}{kb(d.bytes) ? ` · ${kb(d.bytes)}` : ''}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold">
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#17702D] hover:text-[#0F5A24]">
                      <LuExternalLink className="h-4 w-4" aria-hidden="true" />Preview
                    </a>
                    <a href={d.href} download className="inline-flex items-center gap-1.5 text-[#17702D] hover:text-[#0F5A24]">
                      <LuDownload className="h-4 w-4" aria-hidden="true" />Download
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[#D4F0A0] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-gray-900">Trusted links, from registering in Ghana to funding and free tech</p>
              <Link to="/support#library" className="shrink-0 text-sm font-bold text-[#17702D] hover:underline">
                See all {RESOURCES.length} links →
              </Link>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PREVIEW_LINKS.map(({ cat, item }) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block h-full rounded-xl bg-[#F7FAF2] p-4 transition-colors hover:bg-[#EAF6DC]">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wide text-[#17702D]">{cat}</span>
                    <span className="mt-1 flex items-start gap-1.5 text-sm font-bold text-gray-900">
                      {item.name}
                      <LuExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-[#17702D]" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-600">{item.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══ 3. FAQ ════════════════════════════════════════════════════════ */}
        <section id="faq" className="scroll-mt-28">
          <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17702D]">FAQ</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Questions about SWK Ghana?</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                Answers about our programmes, the marketplace, partnerships, giving and how to get involved.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <Link to="/faq" className="btn-gradient rounded-xl px-5 py-2.5 text-center text-sm font-semibold">View the FAQ →</Link>
              <Link to="/contact" className="text-center text-sm font-semibold text-[#17702D] hover:underline">Still stuck? Contact us</Link>
            </div>
          </div>
        </section>

        {/* ══ Coming soon ═══════════════════════════════════════════════════ */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Coming soon</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              ['Video Library', 'Recorded webinars, programme recaps, and educational videos.'],
              ['Community Hub', 'A space to connect with fellow SWK Ghana members and changemakers.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-5">
                <h3 className="mb-2 text-base font-bold text-gray-800">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ WhatsApp ══════════════════════════════════════════════════════ */}
        <FlowPanel className="p-6 text-center sm:p-10">
          <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">Join our WhatsApp Community</h2>
          <p className="mx-auto mb-5 max-w-xl text-sm text-white/90 sm:text-base">
            Get the latest programme updates, resources, and announcements directly on WhatsApp. Over 100 members already inside.
          </p>
          <a
            href="https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#17702D] transition-colors hover:bg-gray-100 hover:text-[#17702D] sm:text-base"
          >
            Join Now →
          </a>
        </FlowPanel>
      </div>
    </div>
  )
}

export default Resources
