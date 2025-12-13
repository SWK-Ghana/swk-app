import React from 'react'

const Donate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-lg xs:rounded-xl p-5 xs:p-6 sm:p-7 md:p-8 lg:p-10 shadow-sm border border-gray-200">
          <h1 className="text-3xl xs:text-4xl sm:text-4xl font-bold text-gray-900 mb-3 xs:mb-4 text-center px-2 xs:px-0">Support Us</h1>
          <p className="text-sm xs:text-base sm:text-base text-gray-600 mb-6 xs:mb-8 text-center px-4 xs:px-6 sm:px-0">
            Your donation helps us empower youth, build resilient communities, and advance climate action.
          </p>
          <div className="grid grid-cols-3 gap-3 xs:gap-4 mb-6 xs:mb-8">
            <button className="btn-gradient py-2.5 xs:py-3 sm:py-3.5 rounded-lg xs:rounded-xl text-sm xs:text-base">$10</button>
            <button className="btn-gradient py-2.5 xs:py-3 sm:py-3.5 rounded-lg xs:rounded-xl text-sm xs:text-base">$25</button>
            <button className="btn-gradient py-2.5 xs:py-3 sm:py-3.5 rounded-lg xs:rounded-xl text-sm xs:text-base">$50</button>
          </div>
          <form className="space-y-3 xs:space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input type="number" min="1" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Enter amount" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="you@example.com" />
            </div>
            <button type="submit" className="btn-gradient w-full py-3 text-lg">Donate</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Donate



