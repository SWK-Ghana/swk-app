import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 xs:py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 sm:gap-10">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <h3 className="text-xl xs:text-2xl sm:text-2xl font-bold mb-3 xs:mb-4">SWK Ghana</h3>
            <p className="text-sm xs:text-base text-gray-300 mb-4 xs:mb-5 max-w-md leading-relaxed">
              A youth-focused nonprofit organisation dedicated to holistic youth development as the foundation for resilient communities across Africa.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/100929740" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/swk.gh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/swk_gh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="X (Twitter)">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://web.facebook.com/profile.php?id=61560213077945&sk=about" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base xs:text-lg sm:text-lg font-semibold mb-3 xs:mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm xs:text-base text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="text-sm xs:text-base text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="/our-work" className="text-sm xs:text-base text-gray-300 hover:text-white transition-colors">Our Work</a></li>
              <li><a href="/resources" className="text-sm xs:text-base text-gray-300 hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base xs:text-lg sm:text-lg font-semibold mb-3 xs:mb-4">Contact</h4>
            <ul className="space-y-2 text-sm xs:text-base text-gray-300">
              <li>
                <a href="mailto:sustainabilitywithkoomson@gmail.com" className="hover:text-white transition-colors break-words">
                  sustainabilitywithkoomson@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+233534492220" className="hover:text-white transition-colors">
                  +233 (0) 534492220
                </a>
              </li>
              <li>Accra, Ghana</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 xs:mt-8 pt-6 xs:pt-8 text-center text-xs xs:text-sm text-gray-400">
          <p>&copy; 2024 SWK Ghana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
