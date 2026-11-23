import React from 'react'
import { LuArrowRight, LuClipboardCheck, LuReceipt, LuShieldCheck, LuSprout } from 'react-icons/lu'
import Donate from './Donate'
import { FlowPanel } from './Patterns'

// /support-mentorship: give to the Agribusiness Mentorship Programme 2027.
// The QR code on the pitch-event advert opens this page. It is the donation page
// (Paystack card and Mobile Money, international, MoMo Pay) with the programme's
// information around it, and every gift tagged "Mentorship Programme 2027".

const FACTS = [
  ['20', 'young agripreneurs, aged 18 to 35'],
  ['5', 'paid mentors who run agribusinesses'],
  ['6', 'months, July to December 2027'],
  ['40%+', 'of places for young women'],
]

const HALVES = [
  ['July to September', 'Learn from a mentor', 'Time inside a working agribusiness: customers, inputs, records, money, and a business plan.'],
  ['October to December', 'Take first steps', 'Meet funders, regulators and buyers, then take a first real step, with a small grant where it helps.'],
  ['January 2028', 'Demo Day', 'Mentees present their plans to partners, buyers and funders. We publish the results.'],
]

const PROMISES = [
  { icon: LuClipboardCheck, title: 'Paid against work done', text: 'Mentor stipends are paid only against session logs; first-step grants only against receipts and an approved plan.' },
  { icon: LuReceipt, title: 'A receipt for every gift', text: 'Paystack emails you a receipt straight away, and SWK Ghana acknowledges every gift.' },
  { icon: LuShieldCheck, title: 'Results in public', text: 'A public impact report in February 2028, and a follow-up six months after graduation.' },
]

const before = (
  <div className="swk-flow-deep py-10">
    <dl className="swk-shell grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
      {FACTS.map(([n, label]) => (
        <div key={label}>
          <dt className="sr-only">{label}</dt>
          <dd className="text-3xl font-bold text-[#78C31E] sm:text-4xl">{n}</dd>
          <dd className="mt-1 text-sm text-white/80">{label}</dd>
        </div>
      ))}
    </dl>
  </div>
)

const after = (
  <>
    <section className="bg-white py-16 sm:py-20">
      <div className="swk-shell">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17702D]">The programme your gift funds</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">Learn from a mentor. Then take your first steps.</h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">Phase 2 of our agribusiness journey, after five webinars crowned by the 2026 Agribusiness Summit. Each of five mentors guides a circle of four young people for six months.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {HALVES.map(([when, title, text], i) => (
            <div key={title} className={`rounded-2xl p-6 text-center ${i === 2 ? 'border-2 border-dashed border-[#78C31E] bg-[#F4FAEC]' : 'bg-[#0C2E11] text-white'}`}>
              <span className="inline-block rounded-full bg-[#78C31E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#123D16]">{when}</span>
              <h3 className={`mt-3 text-xl font-bold ${i === 2 ? 'text-gray-900' : 'text-white'}`}>{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${i === 2 ? 'text-gray-700' : 'text-white/85'}`}>{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <a href="/mentorship-programme" className="inline-flex items-center gap-1.5 font-bold text-[#17702D] hover:underline">
            Read the full programme <LuArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>

    <section className="swk-weave py-16 sm:py-20">
      <div className="swk-shell">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17702D]">Our promise to you</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">Every cedi accounted for.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PROMISES.map((p) => (
            <div key={p.title} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2FAE8] text-[#17702D]"><p.icon className="h-5 w-5" aria-hidden="true" /></span>
              <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="swk-shell py-16 sm:py-20">
      <FlowPanel className="px-6 py-10 text-center sm:px-12 sm:py-14">
        <LuSprout className="mx-auto h-10 w-10 text-[#A8E04A]" aria-hidden="true" />
        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Want to fund a whole mentor circle?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/90">Organisations can sponsor a circle, the First-Step Fund, an event, or the whole programme. We will send you the sponsorship pack.</p>
        <a href="mailto:info@swkghana.org?subject=Partnering%20on%20the%20SWK%20Mentorship%20Programme%202027" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#78C31E] px-6 py-3.5 text-sm font-bold text-[#0C2E11] hover:bg-[#8AD62B] hover:text-[#0C2E11] sm:text-base">
          Talk to us about partnering <LuArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </FlowPanel>
    </section>
  </>
)

const MENTORSHIP_CAMPAIGN = {
  designation: 'Mentorship Programme 2027',
  seo: {
    title: 'Sponsor 20 Young Agripreneurs | SWK Ghana Mentorship Programme 2027',
    description: 'Give to the SWK Agribusiness Mentorship Programme 2027: six months with a mentor who runs an agribusiness, then first real steps, for 20 young people in Ghana. Card, Mobile Money or MoMo Pay.',
    path: '/support-mentorship',
  },
  hero: {
    title: 'Sponsor 20 young agripreneurs',
    lede: 'Six months of one-on-one and group mentorship, a business plan, and links to buyers and finance: taking a young Ghanaian from idea to first steps.',
    aside: (
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
    ),
    children: (
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="#give" className="inline-flex items-center gap-2 rounded-xl bg-[#78C31E] px-7 py-3.5 text-sm font-bold text-[#0C2E11] transition-colors hover:bg-[#8AD62B] hover:text-[#0C2E11] sm:text-base">Give now <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        <a href="/mentorship-programme" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:text-white sm:text-base">About the programme</a>
      </div>
    ),
  },
  impactsTitle: 'Choose what to fund',
  impacts: [
    { amt: 'GH₵200', value: 200, impact: 'A month of data and transport for one mentee' },
    { amt: 'GH₵2,000', value: 2000, impact: 'Pays one mentor for a month' },
    { amt: 'GH₵5,000', value: 5000, impact: 'One young person’s first-step grant' },
    { amt: 'GH₵14,000', value: 14000, impact: 'Sponsors one young person’s full six-month place' },
  ],
  ghsPresets: [200, 2000, 5000, 14000],
  before,
  after,
}

const SupportMentorship = () => <Donate campaign={MENTORSHIP_CAMPAIGN} />

export default SupportMentorship
