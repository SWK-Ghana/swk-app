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
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 xs:px-4 sm:px-6 pb-3 xs:pb-4 sm:pb-5">
          <div className="mx-auto max-w-3xl rounded-lg xs:rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-lg p-3 xs:p-4 sm:p-5 md:p-6">
            <div className="sm:flex sm:items-center sm:justify-between gap-3 xs:gap-4">
              <p className="text-xs xs:text-sm sm:text-base text-gray-700 mb-3 xs:mb-3 sm:mb-0 pr-2">
                We use cookies for basic analytics to improve your experience. By clicking Accept, you agree to our use of cookies.
              </p>
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-2 sm:gap-3 sm:mt-0 sm:justify-end">
                <button className="px-3 xs:px-4 py-2 rounded-lg xs:rounded-xl border text-xs xs:text-sm" onClick={() => setShowConsent(false)}>Dismiss</button>
                <button className="btn-gradient px-3 xs:px-4 py-2 rounded-lg xs:rounded-xl text-xs xs:text-sm" onClick={acceptCookies}>Accept</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RootLayout
