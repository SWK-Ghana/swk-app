import React from 'react'

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">
            Resources
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-600 mb-8 xs:mb-10 sm:mb-12 text-center max-w-3xl mx-auto px-4 xs:px-6 sm:px-0">
            Access helpful resources, guides, and tools to support your journey with us.
          </p>
          
          {/* Resources Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-7 md:gap-8">
            {/* Resource 1 */}
            <div className="bg-white rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3 xs:mb-4">
                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 xs:mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 xs:w-6 xs:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg xs:text-xl sm:text-xl font-semibold text-gray-900">Documentation</h3>
              </div>
              <p className="text-sm xs:text-base text-gray-600 mb-3 xs:mb-4 leading-relaxed">
                Comprehensive guides and documentation to help you get started.
              </p>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                View Docs →
              </a>
            </div>

            {/* Resource 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Video Tutorials</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Step-by-step video tutorials to guide you through our processes.
              </p>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Watch Videos →
              </a>
            </div>

            {/* Resource 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Community</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Connect with our community and get support from other members.
              </p>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Join Community →
              </a>
            </div>

            {/* Resource 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Templates</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ready-to-use templates and examples to accelerate your work.
              </p>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Browse Templates →
              </a>
            </div>

            {/* Resource 5 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">FAQ</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Frequently asked questions and answers to common queries.
              </p>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                View FAQ →
              </a>
            </div>

            {/* Resource 6 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get help and support from our team when you need it.
              </p>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resources
