import React from 'react'
import { Link } from 'react-router-dom'
import Seo from './Seo'

const HELPFUL_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'Get Involved', to: '/get-involved' },
  { label: 'Donate', to: '/donate' },
  { label: 'Contact', to: '/contact' },
]

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <Seo
        title="Page Not Found – SWK Ghana"
        description="The page you are looking for could not be found. Explore SWK Ghana's youth empowerment and sustainability programs."
        path="/404"
        noindex
      />
      <div className="container mx-auto px-4 py-20 sm:py-28 text-center max-w-2xl">
        <p className="text-7xl sm:text-8xl font-bold text-[#78C31E] mb-4">404</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-700 mb-8">
          Sorry, the page you are looking for doesn&apos;t exist or may have moved.
          Here are some helpful links instead:
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {HELPFUL_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-xl border border-[#C0E870] bg-white text-sm font-semibold text-[#1E963C] hover:bg-[#F2FAE8] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link to="/" className="btn-gradient px-6 py-3 rounded-xl">← Back to Home</Link>
      </div>
    </div>
  )
}

export default NotFound
