import React from 'react'
import {
  LuArrowRight, LuCalendarDays, LuChartColumn, LuClipboardList, LuHandshake, LuHeartHandshake, LuMail,
  LuMessagesSquare, LuSprout, LuUser, LuUsers,
} from 'react-icons/lu'
import Seo from './Seo'
import PageHero from './PageHero'
import { FlowPanel } from './Patterns'

// The SWK Agribusiness Mentorship Programme 2027: what it is, how it works,
// who can join and how to get involved. The forms live on their own pages
// (/mentorship, /become-a-mentor, /volunteers); this page explains the programme.
// The form pages are static HTML, so they get plain links, not router links.
// Sponsorship amounts are deliberately left off: partners are sent the pack.

const FACTS = [
  { n: '20', label: 'young agripreneurs, aged 18 to 35' },
  { n: '5', label: 'paid mentors who run agribusinesses' },
  { n: '6', label: 'months, July to December 2027' },
  { n: '40%+', label: 'of places for young women' },
]

const WHY = [
  { n: '21.9%', title: 'Young people need work', text: 'Unemployment among Ghanaians aged 15 to 35 in the first three quarters of 2025, nearly twice the national rate.', source: 'Ghana Statistical Service, 2026' },
  { n: '2.0m → 1.2m', title: 'They are leaving agriculture', text: 'Young people working in agriculture, 2010 to 2021, even though agriculture still employs about a third of Ghana\'s workforce.', source: 'GSS, Ghana in Numbers 2025' },
  { n: '76 of 138', title: 'They are asking for mentors', text: 'People who registered for our 2026 Agribusiness Summit said they hoped to gain mentorship.', source: 'SWK Ghana registration records' },
]

const HALVES = [
  {
    when: 'July to September 2027',
    title: 'Part 1: Learn from the mentors',
    months: [
      ['July · Immersion', 'Goals, a starting baseline, the Agribusiness Model Canvas, and a day inside your mentor\'s business.'],
      ['August · Markets and operations', 'How your mentor finds customers, sources inputs and keeps records, plus ten conversations with your own potential customers.'],
      ['September · Money and the plan', 'Costing, cash flow and funding options, ending with a business plan and start-up budget reviewed at a Plan Review.'],
    ],
  },
  {
    when: 'October to December 2027',
    title: 'Part 2: Get started',
    months: [
      ['October · Who to turn to', 'Meet finance providers, the Registrar of Companies, FDA and Ghana Standards Authority, extension officers, suppliers and buyers, and build your own support map.'],
      ['November · First steps', 'Take at least one concrete first step: registering a name, securing land, a test batch, lining up buyers or applying for funding.'],
      ['December · The road ahead', 'A 12-month roadmap and a pitch, ready for Demo Day.'],
    ],
  },
]

const RHYTHM = [
  { icon: LuUsers, n: '90 min', label: 'mentor-circle session with your mentor and three other mentees' },
  { icon: LuUser, n: '45 min', label: 'one-to-one session with your mentor' },
  { icon: LuMessagesSquare, n: '1 clinic', label: 'for the whole cohort, led by a guest expert' },
  { icon: LuClipboardList, n: '1 report', label: 'a short update on your progress' },
]

const TRACKS = ['Production', 'Processing and value addition', 'Markets and trade', 'Agri-tech and innovation']

const DATES = [
  ['May 2027', 'Applications open, 10 May to 6 June'],
  ['June 2027', 'Scoring, interviews and matching with mentors'],
  ['3 July 2027', 'Orientation'],
  ['July to September', 'Part 1: Learn'],
  ['October to December', 'Part 2: Get started'],
  ['January 2028', 'Demo Day and graduation'],
]

const WAYS = [
  { icon: LuSprout, title: 'Young people', text: 'Aged 18 to 35 with an agribusiness idea or an early venture? Register your interest and we will tell you when applications open.', cta: 'Register your interest', to: '/mentorship' },
  { icon: LuHandshake, title: 'Mentors', text: 'Run an agribusiness with at least five years\' experience? Guide a circle of four young people, with a monthly stipend.', cta: 'Become a mentor', to: '/become-a-mentor' },
  { icon: LuHeartHandshake, title: 'Volunteers', text: 'Help with mentee support, events, communications, design, research and more, in person or online.', cta: 'Volunteer with us', to: '/volunteers' },
  { icon: LuMail, title: 'Partners and sponsors', text: 'Fund a mentor circle, a young person\'s place, an event, or give in kind. We will send you the sponsorship pack.', cta: 'Talk to us', href: 'mailto:info@swkghana.org?subject=Partnering%20on%20the%20SWK%20Mentorship%20Programme%202027' },
]

const FAQS = [
  ['Who can apply?', 'Young people aged 18 to 35 in Ghana with an agribusiness idea or a venture up to three years old. You do not need a registered business. At least 40% of places are for young women.'],
  ['Is registering my interest the same as applying?', 'No. Registering your interest tells us you would like to take part, and helps us shape the programme. Applications open on 10 May 2027, and we will let you know when they do.'],
  ['How much time will it take?', 'Each month: one 90-minute circle session, one 45-minute one-to-one with your mentor, one cohort clinic and a short progress report, plus the work on your own plan in between.'],
  ['Where does it happen?', 'A mix of online sessions and in-person time, including a day inside your mentor\'s business. Selected mentees will get full details at orientation.'],
  ['How are mentees chosen?', 'Through an open, scored process: an application, a short interview and matching with a mentor in the track that fits your idea.'],
  ['Who are the mentors?', 'Practitioners with at least five years in agribusiness. Every mentor is verified (identity, business and two references), trained, and paid a monthly stipend.'],
  ['What happens after the six months?', 'You present your plan at Demo Day in January 2028 to partners, buyers and funders, join our alumni network, and we check in again six months later.'],
]

const btnLime = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#78C31E] px-6 py-3.5 text-sm font-bold text-[#0C2E11] transition-colors hover:bg-[#8AD62B] hover:text-[#0C2E11] sm:text-base'
const btnLine = 'inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:text-white sm:text-base'

const SectionHead = ({ eyebrow, title, children }) => (
  <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17702D]">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">{title}</h2>
    {children && <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">{children}</p>}
  </div>
)

const MentorshipProgramme = () => (
  <div className="min-h-screen bg-white">
    <Seo
      title="Agribusiness Mentorship Programme 2027 | SWK Ghana"
      description="A six-month programme for 20 young agripreneurs in Ghana, aged 18 to 35, guided by five paid mentors who run agribusinesses. Learn from a mentor, then take your first steps. July to December 2027."
      path="/mentorship-programme"
    />

    <PageHero
      title="Agribusiness Mentorship Programme 2027"
      lede="Learn from a mentor, then take your first steps. Six months for 20 young agripreneurs in Ghana, guided by people who already run agribusinesses."
      aside={(
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-[#78C31E]/80" aria-hidden="true" />
          <img
            src="/summit-2026/group-800.webp"
            srcSet="/summit-2026/group-800.webp 800w, /summit-2026/group-1600.webp 1600w"
            sizes="(min-width: 1024px) 42vw, 100vw"
            width="1600"
            height="822"
            alt="Young people, speakers and the SWK Ghana team at the Agribusiness Summit 2026 in Accra"
            fetchPriority="high"
            decoding="async"
            className="relative block h-auto w-full rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10"
          />
        </div>
      )}
    >
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="/mentorship" className={btnLime}>Register your interest <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        <a href="/become-a-mentor" className={btnLine}>Become a mentor</a>
      </div>
      <p className="mt-4 text-sm text-white/65">Applications open 10 May 2027. Registering your interest now is free and takes about five minutes.</p>
    </PageHero>

    {/* Key facts */}
    <div className="swk-flow-deep py-10">
      <div className="swk-shell">
        <dl className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-3xl font-bold text-[#78C31E] sm:text-4xl">{f.n}</dd>
              <dd className="mt-1 text-sm text-white/80">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>

    {/* Why */}
    <section className="swk-weave py-16 sm:py-20">
      <div className="swk-shell">
        <SectionHead eyebrow="Why this programme" title="Young people see the opportunity. Too few have someone to show them how.">
          The programme connects young people with agribusiness ideas to people who have already built one, for long enough to make a real difference.
        </SectionHead>
        <div className="grid gap-5 md:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-2xl border border-[#D4F0A0] bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#17702D]">{w.n}</p>
              <h3 className="mt-2 text-lg font-bold text-gray-900">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{w.text}</p>
              <p className="mt-3 text-xs text-gray-500">{w.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-16 sm:py-20">
      <div className="swk-shell">
        <SectionHead eyebrow="How it works" title="Six months, in two halves.">
          Each of five mentors guides a circle of four young people. First you learn inside a working agribusiness; then you take your first real steps.
        </SectionHead>
        <div className="grid gap-5 lg:grid-cols-2">
          {HALVES.map((h) => (
            <div key={h.title} className="relative isolate overflow-hidden rounded-2xl bg-[#0C2E11] p-6 text-white sm:p-8">
              <span className="inline-block rounded-full bg-[#78C31E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#123D16]">{h.when}</span>
              <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">{h.title}</h3>
              <ul className="mt-4 space-y-4">
                {h.months.map(([m, t]) => (
                  <li key={m}>
                    <p className="font-bold text-[#A8E04A]">{m}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/85">{t}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#78C31E] bg-[#F4FAEC] p-5 text-center sm:flex-row sm:gap-4">
          <span className="rounded-full bg-[#78C31E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#123D16]">January 2028</span>
          <p className="text-gray-800"><strong className="text-[#123D16]">Demo Day and graduation:</strong> mentees present their plans to partners, buyers and funders.</p>
        </div>

        <h3 className="mt-12 text-center text-xl font-bold text-gray-900 sm:text-2xl">Every month</h3>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {RHYTHM.map((r) => (
            <div key={r.n} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2FAE8] text-[#17702D]">
                <r.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-xl font-bold text-[#17702D]">{r.n}</p>
              <p className="mt-1 text-sm leading-snug text-gray-600">{r.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Who can join, and key dates */}
    <section className="swk-weave py-16 sm:py-20">
      <div className="swk-shell">
        <SectionHead eyebrow="Who can join" title="For young people ready to build in agribusiness." />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2FAE8] text-[#17702D]"><LuSprout className="h-5 w-5" aria-hidden="true" /></div>
            <h3 className="text-center text-lg font-bold text-gray-900">Mentees</h3>
            <ul className="mx-auto mt-3 w-fit space-y-2 text-sm text-gray-700">
              {['Aged 18 to 35, living in Ghana', 'An agribusiness idea, or a venture up to three years old', 'Ready to commit to six months', 'At least 40% of places for young women'].map((t) => (
                <li key={t} className="flex gap-2"><span className="font-bold text-[#17702D]">✓</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2FAE8] text-[#17702D]"><LuHandshake className="h-5 w-5" aria-hidden="true" /></div>
            <h3 className="text-center text-lg font-bold text-gray-900">Mentors</h3>
            <ul className="mx-auto mt-3 w-fit space-y-2 text-sm text-gray-700">
              {['At least five years in agribusiness', 'Verified: identity, business and two references', 'Trained, and paid a monthly stipend', 'Two reserve mentors on standby'].map((t) => (
                <li key={t} className="flex gap-2"><span className="font-bold text-[#17702D]">✓</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2FAE8] text-[#17702D]"><LuChartColumn className="h-5 w-5" aria-hidden="true" /></div>
            <h3 className="text-center text-lg font-bold text-gray-900">Tracks</h3>
            <ul className="mx-auto mt-3 w-fit space-y-2 text-sm text-gray-700">
              {TRACKS.map((t) => (
                <li key={t} className="flex gap-2"><span className="font-bold text-[#17702D]">✓</span>{t}</li>
              ))}
            </ul>
            <p className="mt-3 text-center text-xs text-gray-500">Finance and funding readiness runs through every track.</p>
          </div>
        </div>

        <h3 className="mt-14 flex items-center justify-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
          <LuCalendarDays className="h-6 w-6 text-[#17702D]" aria-hidden="true" /> Key dates
        </h3>
        <ol className="mx-auto mt-5 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DATES.map(([d, t]) => (
            <li key={d} className="rounded-2xl border-t-4 border-[#78C31E] bg-white p-5 text-center shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-[#17702D]">{d}</p>
              <p className="mt-1 text-gray-800">{t}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-center text-sm text-gray-500">Planned dates. We will confirm them by April 2027.</p>
      </div>
    </section>

    {/* Get involved */}
    <section className="py-16 sm:py-20">
      <div className="swk-shell">
        <SectionHead eyebrow="Get involved" title="There is a place for you in this programme." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.map((w) => {
            const cls = 'mt-auto inline-flex items-center justify-center gap-1.5 self-center rounded-xl bg-[#17702D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0F5A24] hover:text-white'
            return (
              <div key={w.title} className="flex flex-col rounded-2xl border border-[#D4F0A0] bg-gradient-to-br from-[#F2FAE8] to-white p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#17702D] shadow-sm ring-1 ring-[#D4F0A0]">
                  <w.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{w.title}</h3>
                <p className="mb-5 mt-2 flex-1 text-sm leading-relaxed text-gray-600">{w.text}</p>
                {w.to
                  ? <a href={w.to} className={cls}>{w.cta} <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
                  : <a href={w.href} className={cls}>{w.cta} <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>}
              </div>
            )
          })}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="swk-weave py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead eyebrow="Questions" title="Frequently asked questions" />
        <div className="space-y-3">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm open:border-[#B5DE7F]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-gray-900">
                {q}
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#F2FAE8] text-[#17702D] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-gray-700">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    {/* Closing call to action */}
    <section className="swk-shell pb-16 sm:pb-20">
      <FlowPanel className="px-6 py-10 text-center sm:px-12 sm:py-14">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to grow your agribusiness?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/90">Register your interest today, and join our WhatsApp community for free webinars and opportunities while you wait.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="/mentorship" className={btnLime}>Register your interest <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          <a href="https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu" target="_blank" rel="noopener noreferrer" className={btnLine}>Join our WhatsApp community</a>
        </div>
      </FlowPanel>
    </section>
  </div>
)

export default MentorshipProgramme
