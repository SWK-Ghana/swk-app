import React from 'react'

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">
            Contact SWK Ghana
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-600 mb-8 xs:mb-10 sm:mb-12 text-center max-w-3xl mx-auto px-4 xs:px-6 sm:px-0">
            Get in touch with our team and learn how you can support youth empowerment and sustainable development in Ghana.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-gray-900 mb-6 xs:mb-7 sm:mb-8">Get in Touch</h2>
              
              <div className="space-y-5 xs:space-y-6 sm:space-y-7">
                {/* Email */}
                <div className="flex items-start space-x-3 xs:space-x-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 xs:w-6 xs:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base xs:text-lg sm:text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:sustainabilitywithkoomson@gmail.com" className="text-sm xs:text-base text-gray-600 hover:text-emerald-600 transition-colors break-words">
                      sustainabilitywithkoomson@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3 xs:space-x-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 xs:w-6 xs:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base xs:text-lg sm:text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:+233534492220" className="text-sm xs:text-base text-gray-600 hover:text-emerald-600 transition-colors">
                      +233 (0) 534492220
                    </a>
                    <p className="text-sm xs:text-base text-gray-600">Mon-Fri 9AM - 6PM UTC/GMT</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3 xs:space-x-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 xs:w-6 xs:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base xs:text-lg sm:text-lg font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-sm xs:text-base text-gray-600">Accra, Ghana</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-start space-x-3 xs:space-x-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 xs:w-6 xs:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base xs:text-lg sm:text-lg font-semibold text-gray-900 mb-1">Follow Us</h3>
                    <div className="flex flex-wrap gap-3 xs:gap-4">
                      <a href="https://www.linkedin.com/company/100929740" target="_blank" rel="noopener noreferrer" className="text-sm xs:text-base text-gray-600 hover:text-emerald-600 transition-colors">
                        LinkedIn
                      </a>
                      <a href="https://www.instagram.com/swk.gh/" target="_blank" rel="noopener noreferrer" className="text-sm xs:text-base text-gray-600 hover:text-emerald-600 transition-colors">
                        Instagram
                      </a>
                      <a href="https://x.com/swk_gh" target="_blank" rel="noopener noreferrer" className="text-sm xs:text-base text-gray-600 hover:text-emerald-600 transition-colors">
                        X
                      </a>
                      <a href="https://web.facebook.com/profile.php?id=61560213077945&sk=about" target="_blank" rel="noopener noreferrer" className="text-sm xs:text-base text-gray-600 hover:text-emerald-600 transition-colors">
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg xs:rounded-xl p-5 xs:p-6 sm:p-7 md:p-8 shadow-sm border border-gray-200">
              <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6">Send us a Message</h2>
              <form className="space-y-4 xs:space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-gradient w-full text-lg py-3">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

