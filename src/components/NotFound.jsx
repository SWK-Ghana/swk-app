import React from 'react'
import { Link } from 'react-router-dom'
import Seo from './Seo'
import PageHero from './PageHero'

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
    <div className="min-h-screen swk-weave">
      <Seo
        title="Page Not Found – SWK Ghana"
        description="The page you are looking for could not be found. Explore SWK Ghana's youth empowerment and sustainability programs."
        path="/404"
        noindex
      />
      <PageHero
        eyebrow="Error 404"
        title="Page not found"
        lede="Sorry, the page you are looking for doesn't exist or may have moved."
      />
      <div className="container mx-auto px-4 py-14 sm:py-20 text-center max-w-2xl">
        <p className="text-gray-700 mb-8">
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
