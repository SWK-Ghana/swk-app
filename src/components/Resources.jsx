import React from 'react'
import { Link } from 'react-router-dom'

const Resources = () => {

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3 bg-[#F2FAE8] text-[#1E963C]">
              Help & Resources
            </span>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Resources
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Everything you need to learn about SWK Ghana, get answers, and connect with our team.
            </p>
          </div>

          {/* Active Resources */}
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">Available Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xs:gap-6 mb-10">

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#78C31E] transition-all duration-200 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#F2FAE8] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-[#78C31E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">FAQ</h3>
                  <span className="text-xs font-semibold text-[#1E963C] bg-[#F2FAE8] px-2 py-0.5 rounded-full">Available</span>
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
                  <svg className="w-6 h-6 text-[#78C31E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Support</h3>
                  <span className="text-xs font-semibold text-[#1E963C] bg-[#F2FAE8] px-2 py-0.5 rounded-full">Available</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">
                Get direct help from the SWK Ghana team. Whether it's a question about our programmes, partnerships, or the marketplace — we're here for you.
              </p>
              <Link
                to="/contact"
                className="btn-gradient px-5 py-2.5 text-sm font-semibold rounded-xl text-center"
              >
                Contact Support →
              </Link>
            </div>
          </div>

          {/* Reports Section */}
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Reports & Publications</h2>
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
                    <span className="text-xs font-semibold bg-white border border-[#D4F0A0] text-[#1E963C] px-3 py-1 rounded-full">Annual Report 2025</span>
                    <span className="text-xs font-semibold bg-white border border-[#D4F0A0] text-[#1E963C] px-3 py-1 rounded-full">Agribusiness Impact Report 2025</span>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">

            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: 'Guides & Toolkits',
                description: 'Practical guides on agribusiness, sustainability, and youth leadership.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Video Library',
                description: 'Recorded webinars, programme recaps, and educational videos.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Templates',
                description: 'Downloadable templates for youth projects and entrepreneurship.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Community Hub',
                description: 'A space to connect with fellow SWK Ghana members and changemakers.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col opacity-70">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-gray-500 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">{item.description}</p>
                <span className="inline-block text-xs font-semibold text-gray-400 bg-gray-200 px-3 py-1 rounded-full self-start">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-[#1E963C] rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Join our WhatsApp Community
            </h3>
            <p className="text-white/70 text-sm sm:text-base mb-5 max-w-xl mx-auto">
              Get the latest programme updates, resources, and announcements directly on WhatsApp. Over 100 members already inside.
            </p>
            <a
              href="https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#1E963C] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Join Now →
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Resources