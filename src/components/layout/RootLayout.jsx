import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  const [showConsent, setShowConsent] = useState(false)
  useEffect(() => {
    try {
      const accepted = localStorage.getItem('cookie-consent')
      if (!accepted) setShowConsent(true)
    } catch {}
  }, [])

  const acceptCookies = () => {
    try { localStorage.setItem('cookie-consent', 'accepted') } catch {}
    setShowConsent(false)
  }

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      {showConsent && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-lg p-4 sm:p-5">
            <div className="sm:flex sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-700">
                We use cookies for basic analytics to improve your experience. By clicking Accept, you agree to our use of cookies.
              </p>
              <div className="mt-3 sm:mt-0 flex gap-2 justify-end">
                <button className="px-4 py-2 rounded-xl border" onClick={() => setShowConsent(false)}>Dismiss</button>
                <button className="btn-gradient px-4 py-2 rounded-xl" onClick={acceptCookies}>Accept</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RootLayout
