import React, { useEffect } from 'react'
import Seo from './Seo'

/**
 * /marketplace is not a page any more — it hands straight over to the real
 * marketplace app.
 *
 * There used to be a standalone shop here (products in Sanity, orders emailed
 * through Formspree, no accounts, no payment, no buyer protection) built while
 * the real platform was under construction. That platform now runs at
 * marketplace.swkghana.org with vendor verification, escrow and payouts, so
 * keeping a second shop on this domain only split buyers between them.
 *
 * Two redirects are needed, not one:
 *   - vercel.json handles direct hits, bookmarks and search results at the
 *     edge, before any JavaScript loads.
 *   - this component handles in-app navigation, because react-router resolves
 *     <Link to="/marketplace"> on the client and never reaches the server.
 *
 * The markup below is only seen if JavaScript is unavailable, so it carries a
 * real link rather than leaving anyone stranded.
 */

const APP = 'https://marketplace.swkghana.org'

export default function Marketplace() {
  useEffect(() => {
    // replace(), not assign(), so Back does not bounce the visitor
    // straight back into this redirect.
    window.location.replace(APP)
  }, [])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <Seo
        title="SWK Marketplace | SWK Ghana"
        description="SWK Marketplace has moved to marketplace.swkghana.org — shop verified youth-led green businesses across Ghana."
        path="/marketplace"
        noindex
      />
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#1E963C]">
          SWK Marketplace
        </p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
          Taking you to the marketplace…
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-700">
          SWK Marketplace now lives at its own address, where you can browse verified
          youth-led products and buy with escrow protection.
        </p>
        <a
          href={APP}
          className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#1E963C] px-7 text-base font-semibold text-white transition-colors hover:bg-[#17742f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E963C] focus-visible:ring-offset-2"
        >
          Go to marketplace.swkghana.org
        </a>
      </div>
    </div>
  )
}
