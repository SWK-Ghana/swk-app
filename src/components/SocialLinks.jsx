import React from 'react'
import { SOCIALS } from '../data/socials'

// SWK Ghana's social profiles as icon links. `tone` matches the surface the
// row sits on; `size` sets the button size. Profiles come from data/socials.js.
const TONES = {
  bar: 'text-white/75 hover:text-[#A8E04A] focus-visible:text-[#A8E04A]',
  dark: 'bg-white/10 text-white hover:bg-[#78C31E] hover:text-[#123D16] focus-visible:bg-[#78C31E] focus-visible:text-[#123D16]',
  light: 'bg-[#F2FAE8] text-[#1E963C] hover:bg-[#1E963C] hover:text-white focus-visible:bg-[#1E963C] focus-visible:text-white',
}

const SIZES = {
  sm: { box: 'h-8 w-8', icon: 'h-[15px] w-[15px]' },
  md: { box: 'h-10 w-10', icon: 'h-[18px] w-[18px]' },
  lg: { box: 'h-12 w-12', icon: 'h-5 w-5' },
}

const SocialLinks = ({ tone = 'light', size = 'md', className = '' }) => {
  const s = SIZES[size]
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="SWK Ghana on social media">
      {SOCIALS.map(({ id, label, href, path }) => (
        <li key={id}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            aria-label={`SWK Ghana on ${label} (opens in a new tab)`}
            className={`inline-flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8E04A] ${s.box} ${TONES[tone]}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={s.icon}>
              <path d={path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialLinks
