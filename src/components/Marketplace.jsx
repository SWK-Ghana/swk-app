import React from 'react'
import Seo from './Seo'

/**
 * Landing page for SWK Marketplace.
 *
 * This page used to be a standalone shop: products from Sanity, orders emailed
 * to the team through Formspree, no accounts, no payment and no buyer
 * protection. That existed as a placeholder while the real platform was built.
 *
 * The real platform now runs at marketplace.swkghana.org with vendor
 * verification, escrow and payouts, so this page's job is to introduce it and
 * hand people over. It deliberately wears the marketplace's own palette rather
 * than the swkghana.org site styling, so visitors recognise the product when
 * they arrive there.
 */

const APP = 'https://marketplace.swkghana.org'

const CATEGORIES = [
  { name: 'Agribusiness',        blurb: 'Sustainably grown crops, farm produce and agro-processing', href: `${APP}/marketplace?category=agribusiness` },
  { name: 'Recycled & Upcycled', blurb: 'Products made from reclaimed and repurposed materials',      href: `${APP}/marketplace?category=recycled_upcycled` },
  { name: 'Handmade Crafts',     blurb: 'Hand-produced goods from young Ghanaian artisans',           href: `${APP}/marketplace?category=handmade_crafts` },
  { name: 'Organic Produce',     blurb: 'Certified and locally grown organic food',                   href: `${APP}/marketplace?category=organic_produce` },
]

const ESCROW_STEPS = [
  { n: '1', title: 'You pay',            body: 'Your money goes to SWK Ghana, not straight to the vendor.' },
  { n: '2', title: 'The vendor ships',   body: 'They confirm your order and send it out, knowing payment is secured.' },
  { n: '3', title: 'You confirm',        body: 'Once the goods are in your hands, you confirm delivery.' },
  { n: '4', title: 'The vendor is paid', body: 'Only then does SWK Ghana release the funds.' },
]

const VALUES = [
  'Zero Waste', 'Organic', 'Plastic Free', 'Upcycled', 'Handmade',
  'Women-Led', 'Youth-Led', 'Locally Sourced', 'Biodegradable', 'Fair Trade',
]

const ASSURANCES = [
  { title: 'Every listing is checked',   body: 'Products are reviewed for SDG 12 alignment before they can be sold. Claims that cannot be supported are rejected.' },
  { title: 'Every vendor is verified',   body: 'No one lists until SWK Ghana has reviewed their business and sustainability statement.' },
  { title: 'Every payment is protected', body: 'Funds sit in escrow until you confirm delivery. Payouts are never automatic.' },
  { title: 'Every review is earned',     body: 'Only a buyer with a delivered order can review that product.' },
]

export default function Marketplace() {
  return (
    <div className="bg-mk-sand-50 font-sans">
      <Seo
        title="SWK Marketplace – Shop Verified Youth-Led Green Businesses | SWK Ghana"
        description="Browse sustainable products from verified youth-led green entrepreneurs across Ghana. Every listing is SDG 12 checked and every payment is held in escrow until you confirm delivery."
        path="/marketplace"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-mk-green-50 blur-3xl opacity-70" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-mk-teal-50 blur-3xl opacity-70" />
        </div>

        <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-mk-green-100 bg-mk-green-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-mk-green-800">
            SDG 12 Verified · Youth-Powered · Ghana
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] text-mk-sand-900 sm:text-5xl md:text-6xl">
            Shop green.{' '}
            <span className="text-mk-green">Support youth.</span>{' '}
            Build Africa.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-mk-sand-700 sm:text-lg">
            A marketplace of eco-friendly products from verified young entrepreneurs across Ghana.
            Every purchase is escrow-protected, and every listing is checked before it goes live.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`${APP}/marketplace`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-mk-green px-7 text-base font-semibold text-white shadow-sm transition-colors hover:bg-mk-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mk-green focus-visible:ring-offset-2"
            >
              Browse the marketplace
            </a>
            <a
              href={`${APP}/vendor/apply`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-mk-sand-200 bg-white px-7 text-base font-semibold text-mk-sand-900 transition-colors hover:border-mk-green hover:bg-mk-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mk-green focus-visible:ring-offset-2"
            >
              Sell your products
            </a>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 rounded-lg border border-mk-teal-50 bg-mk-teal-50 px-3 py-2 text-sm font-medium text-mk-teal">
            Your money is held safely by SWK Ghana until you confirm delivery.
          </p>
        </div>
      </section>

      {/* ── What you can buy ── */}
      <section className="border-t border-mk-sand-200 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-mk-sand-900 sm:text-3xl">What you can buy</h2>
          <p className="mt-2 max-w-xl text-mk-sand-600">
            Four categories, all produced by young people building sustainable businesses in Ghana.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map(c => (
              <li key={c.name}>
                <a
                  href={c.href}
                  className="group flex h-full flex-col rounded-2xl border border-mk-sand-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-mk-green hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mk-green focus-visible:ring-offset-2"
                >
                  <span className="text-base font-semibold text-mk-sand-900 group-hover:text-mk-green-700">
                    {c.name}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-mk-sand-600">{c.blurb}</span>
                  <span aria-hidden="true" className="mt-4 text-sm font-semibold text-mk-green">
                    Browse →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Escrow ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-mk-sand-900 sm:text-3xl">
            Why you can buy with confidence
          </h2>
          <p className="mt-2 max-w-2xl text-mk-sand-600">
            Buying from someone you have never met usually means one side has to take a risk.
            Escrow removes it for both of you.
          </p>

          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ESCROW_STEPS.map(s => (
              <li key={s.n} className="rounded-2xl border border-mk-sand-200 bg-mk-sand-50 p-6">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-mk-green text-sm font-bold text-white"
                >
                  {s.n}
                </span>
                <h3 className="mt-4 text-base font-semibold text-mk-sand-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mk-sand-600">{s.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-sm italic text-mk-sand-600">
            SWK Ghana holds the funds throughout. Payouts are never released automatically.
          </p>
        </div>
      </section>

      {/* ── Assurances ── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)] lg:items-start">
            <div>
              <h2 className="text-2xl font-bold text-mk-sand-900 sm:text-3xl">
                What &ldquo;verified&rdquo; actually means
              </h2>
              <p className="mt-3 max-w-md leading-relaxed text-mk-sand-600">
                Anyone can call a product sustainable. On SWK Marketplace it is reviewed before
                anyone can sell it, so the badge is a check rather than a claim.
              </p>
              <a
                href={`${APP}/how-it-works`}
                className="mt-6 inline-flex min-h-[44px] items-center text-base font-semibold text-mk-green underline underline-offset-4 hover:text-mk-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mk-green focus-visible:ring-offset-2"
              >
                See how it works
              </a>
            </div>

            <ul className="space-y-3">
              {ASSURANCES.map(a => (
                <li key={a.title} className="rounded-2xl border border-mk-sand-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-mk-sand-900">{a.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-mk-sand-600">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Shop by values ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-mk-sand-900 sm:text-3xl">
            Shop by what matters to you
          </h2>
          <p className="mt-2 max-w-xl text-mk-sand-600">
            Filter the marketplace by the values behind each product.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {VALUES.map(v => (
              <li key={v}>
                <span className="inline-flex min-h-[44px] items-center rounded-full border border-mk-sand-200 bg-mk-sand-50 px-4 text-sm font-medium text-mk-sand-700">
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Vendor CTA ── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-mk-green-800 px-6 py-12 sm:px-10 md:py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-mk-green-100">
              For young green entrepreneurs
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl">
              You make it. We handle the shopfront, the buyers and the payment.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-mk-green-50">
              A storefront of your own, buyers across all 16 regions, and payment you can rely on.
              Free to join and free to list — SWK Ghana keeps 15% only when you make a sale,
              and you keep 85%.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`${APP}/vendor/apply`}
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-white px-7 text-base font-semibold text-mk-green-800 transition-colors hover:bg-mk-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mk-green-800"
              >
                Apply to sell
              </a>
              <a
                href={`${APP}/signup`}
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-white/40 px-7 text-base font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mk-green-800"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing ── */}
      <section className="border-t border-mk-sand-200 bg-white py-14">
        <div className="container mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-mk-sand-900 sm:text-2xl">The marketplace is open</h2>
          <p className="mx-auto mt-2 max-w-lg leading-relaxed text-mk-sand-600">
            Browse verified products, or sign in to pick up where you left off.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`${APP}/marketplace`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-mk-green px-7 text-base font-semibold text-white transition-colors hover:bg-mk-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mk-green focus-visible:ring-offset-2"
            >
              Start shopping
            </a>
            <a
              href={`${APP}/login`}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-mk-sand-200 px-7 text-base font-semibold text-mk-sand-900 transition-colors hover:border-mk-green hover:bg-mk-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mk-green focus-visible:ring-offset-2"
            >
              Sign in
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
