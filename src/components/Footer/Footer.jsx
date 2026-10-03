import React from 'react'
import SocialLinks from '../SocialLinks'
import { CONTACT } from '../../data/socials'

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Our Work', href: '/our-work' },
  { label: 'Reports', href: '/reports' },
  { label: 'Resources', href: '/resources' },
  { label: 'Support for NGOs', href: '/support' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Donate', href: '/donate' },
]

const Footer = () => (
  <footer className="bg-[#1A1A1A] text-white">
    <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 xs:py-10 sm:py-12 md:py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 sm:gap-10">

        {/* Company Info */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <h3 className="text-xl xs:text-2xl font-bold mb-3 xs:mb-4 text-white">SWK Ghana</h3>
          <p className="text-sm xs:text-base text-gray-300 mb-3 xs:mb-4 max-w-md leading-relaxed">
            A youth-focused nonprofit organisation dedicated to holistic youth development as the foundation for resilient communities across Africa.
          </p>
          <p className="text-xs text-gray-500 mb-5 xs:mb-6">
            Legally registered as <span className="text-gray-400">SWK Ghana LBG</span>, a Private Company Limited by Guarantee, duly incorporated under the Companies Act, 2019 (Act 992) · Reg. No. CG024110426 · Office of the Registrar of Companies, Ghana. <span className="text-gray-400">swkghana.org</span> is the official website of SWK Ghana LBG.
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 mb-3">Follow us</p>
          <SocialLinks tone="dark" size="md" />
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-base xs:text-lg font-semibold mb-3 xs:mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="text-sm xs:text-base text-gray-300 hover:text-white transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-base xs:text-lg font-semibold mb-3 xs:mb-4 text-white">Contact</h4>
          <ul className="space-y-2 text-sm xs:text-base text-gray-300">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors break-words">
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="hover:text-white transition-colors">
                {CONTACT.phone}
              </a>
            </li>
            <li>Accra, Ghana</li>
            <li className="pt-2">
              <a href="https://swkghana.org" className="hover:text-white transition-colors">
                swkghana.org
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 mt-6 xs:mt-8 pt-6 xs:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs xs:text-sm text-gray-400">
        <p className="text-gray-400">&copy; 2026 SWK Ghana LBG. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          <p className="text-gray-400">Building resilient communities across Africa 🌍</p>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
