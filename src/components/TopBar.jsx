import React from 'react'
import SocialLinks from './SocialLinks'
import { CONTACT } from '../data/socials'

// Slim bar above the main navigation on every page: contact details on the
// left, social profiles on the right. It scrolls away; the navbar stays sticky.
// Fixed at 2.25rem tall (h-9) so full-height heroes can subtract it.
const TopBar = () => (
  <div className="bg-[#0C2E11] text-[13px] text-white/75">
    <div className="swk-shell flex h-9 items-center justify-center gap-4 sm:justify-between">
      <div className="hidden min-w-0 items-center gap-5 sm:flex">
        <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5 text-white/75 transition-colors hover:text-white">
          <svg className="h-3.5 w-3.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          {CONTACT.email}
        </a>
        <a href={CONTACT.phoneHref} className="hidden items-center gap-1.5 text-white/75 transition-colors hover:text-white md:inline-flex">
          <svg className="h-3.5 w-3.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {CONTACT.phone}
        </a>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="mr-1 text-xs font-medium uppercase tracking-[0.14em] text-white/55">Follow us</span>
        <SocialLinks tone="bar" size="sm" className="gap-0.5" />
      </div>
    </div>
  </div>
)

export default TopBar
