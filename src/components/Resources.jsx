import React from 'react'
import { Link } from 'react-router-dom'
import Seo from './Seo'
import PageHero from './PageHero'
import { FlowPanel } from './Patterns'
import { TOOLKIT, RESOURCES } from '../data/support'

const Resources = () => {

  return (
    <div className="min-h-screen swk-weave">
      <Seo
        title="Resources | SWK Ghana"
        description="Access SWK Ghana's resources, guides, and educational materials on youth development, sustainability, climate action, agribusiness, and the circular economy."
        path="/resources"
      />
      <PageHero
        title="Resources"
        lede="Everything you need to learn about SWK Ghana, get answers, and connect with our team."
        pattern="keys"
      />
      <div className="swk-shell py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div>

          {/* Active Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xs:gap-6 mb-10">

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#78C31E] transition-all duration-200 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#F2FAE8] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-[#17702D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">FAQ</h3>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">
                Frequently asked questions and answers about SWK Ghana, our programmes, the marketplace, partnerships, and how to get involved.
              </p>
              <Link
                to="/faq"
                className="btn-gradient px-5 py-2.5 text-sm font-semibold rounded-xl text-center"
              >
                View FAQ →
              </Link>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#78C31E] transition-all duration-200 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#F2FAE8] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-[#17702D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Support for NGOs</h3>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">
                Our free NGO Support Hub: {TOOLKIT.length} templates and guides, plus {RESOURCES.length} trusted links to help NGOs register, raise funds, measure impact and grow.
              </p>
              <Link
                to="/support"
                className="btn-gradient px-5 py-2.5 text-sm font-semibold rounded-xl text-center"
              >
                Open the Support Hub →
              </Link>
              <Link to="/contact" className="mt-3 text-center text-sm font-semibold text-[#17702D] hover:underline">
                Need our team? Contact us
              </Link>
            </div>
          </div>

          {/* Reports Section */}
          <div className="bg-[#F2FAE8] border border-[#D4F0A0] rounded-2xl p-6 sm:p-8 mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#78C31E] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">SWK Ghana Reports</h3>
                  <p className="text-gray-700 text-sm leading-relaxed max-w-lg">
                    Download our Annual Reports and Impact Reports — tracking our programmes, reach, and community outcomes across Ghana and Africa.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs font-semibold bg-white border border-[#D4F0A0] text-[#17702D] px-3 py-1 rounded-full">Annual Report 2025</span>
                    <span className="text-xs font-semibold bg-white border border-[#D4F0A0] text-[#17702D] px-3 py-1 rounded-full">Agribusiness Impact Report 2025</span>
                  </div>
                </div>
              </div>
              <Link
                to="/reports"
                className="btn-gradient px-6 py-3 text-sm font-semibold rounded-xl flex-shrink-0 text-center"
              >
                View All Reports →
              </Link>
            </div>
          </div>

          {/* Coming Soon Resources */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Coming soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">

            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Video Library',
                description: 'Recorded webinars, programme recaps, and educational videos.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Community Hub',
                description: 'A space to connect with fellow SWK Ghana members and changemakers.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white/70 border border-dashed border-gray-300 rounded-2xl p-5 flex flex-col">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.description}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <FlowPanel className="p-6 sm:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Join our WhatsApp Community
            </h3>
            <p className="text-white/90 text-sm sm:text-base mb-5 max-w-xl mx-auto">
              Get the latest programme updates, resources, and announcements directly on WhatsApp. Over 100 members already inside.
            </p>
            <a
              href="https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#17702D] hover:text-[#17702D] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Join Now →
            </a>
          </FlowPanel>

        </div>
      </div>
    </div>
  )
}

export default Resources