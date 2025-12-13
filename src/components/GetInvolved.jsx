import React from 'react'

const GetInvolved = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">
            Join the SWK Movement
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-600 mb-8 xs:mb-10 sm:mb-12 text-center max-w-3xl mx-auto px-4 xs:px-6 sm:px-0">
            Join SWK Ghana and help us build a more sustainable and equitable Ghana. Together, we can empower young people, transform communities, and protect our planet.
          </p>
          
          {/* Ways to Get Involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-7 md:gap-8 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            {/* Volunteer */}
            <div className="bg-white rounded-lg xs:rounded-xl p-5 xs:p-6 sm:p-7 md:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 xs:w-16 xs:h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 xs:mb-5 sm:mb-6">
                <svg className="w-7 h-7 xs:w-8 xs:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl xs:text-2xl sm:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">Volunteer</h3>
              <p className="text-sm xs:text-base text-gray-600 mb-5 xs:mb-6 leading-relaxed">
                Give your time and skills to support our community initiatives and make a direct impact.
              </p>
              <button className="btn-gradient w-full">
                Become a Volunteer
              </button>
            </div>

            {/* Donate */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Donate</h3>
              <p className="text-gray-600 mb-6">
                Support our mission financially and help us expand our programs and reach more people.
              </p>
              <button className="btn-gradient w-full">
                Make a Donation
              </button>
            </div>

            {/* Partner */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Partner With Us</h3>
              <p className="text-gray-600 mb-6">
                Collaborate with us as an organization or business to create meaningful partnerships.
              </p>
              <button className="btn-gradient w-full">
                Become a Partner
              </button>
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-gray-900 mb-6 xs:mb-8 sm:mb-10 text-center px-2 xs:px-0">Success Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xs:gap-6 sm:gap-7 md:gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold text-lg">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Alex Johnson</h4>
                  <p className="text-gray-600">
                    "Volunteering with this organization has been incredibly rewarding. I've seen firsthand the positive impact we're making in our community."
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Maria Rodriguez</h4>
                  <p className="text-gray-600">
                    "The resources and support provided have helped me grow both personally and professionally. I'm grateful to be part of this community."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">Get in Touch</h2>
            <p className="text-sm xs:text-base text-gray-600 mb-6 xs:mb-8 text-center px-4 xs:px-6 sm:px-0">
              Have questions or want to learn more about how you can get involved? We'd love to hear from you!
            </p>
            <form className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              <div className="mb-6">
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
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Tell us how you'd like to get involved..."
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
  )
}

export default GetInvolved
