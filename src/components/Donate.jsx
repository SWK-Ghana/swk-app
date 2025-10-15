import React from 'react'

const Donate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Support Us</h1>
          <p className="text-gray-600 mb-8 text-center">
            Your donation helps us empower youth, build resilient communities, and advance climate action.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button className="btn-gradient py-3 rounded-xl">$10</button>
            <button className="btn-gradient py-3 rounded-xl">$25</button>
            <button className="btn-gradient py-3 rounded-xl">$50</button>
          </div>
          <form className="space-y-4">
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



