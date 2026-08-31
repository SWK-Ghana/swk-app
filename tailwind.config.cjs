/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ['"Ubuntu"', 'sans-serif'],
        sans: ['"Ubuntu"', 'sans-serif'],
      },
      colors: {
        // SWK Marketplace palette. Used only by the /marketplace landing page,
        // so that page carries the product's own identity rather than the
        // site's. sand-600 is #6B6454 rather than the marketplace's original
        // #7D7666: the lighter value measures 4.25:1 on the sand-50 background
        // and fails WCAG AA for body text.
        mk: {
          green:       '#3B6D11',
          'green-700': '#2E560C',
          'green-800': '#27500A',
          'green-100': '#C0DD97',
          'green-50':  '#EAF3DE',
          gold:        '#BA7517',
          'gold-50':   '#FAEEDA',
          teal:        '#0F6E56',
          'teal-50':   '#E1F5EE',
          'sand-50':   '#FAF8F3',
          'sand-100':  '#F3F0E8',
          'sand-200':  '#E8E4D8',
          'sand-600':  '#6B6454',
          'sand-700':  '#5F5A4E',
          'sand-900':  '#2A2823',
        },
        swk: {
          green: '#78C31E',
          'green-dark': '#1E963C',
          'green-light': '#A8E04A',
          'green-bg': '#F2FAE8',
          charcoal: '#3C3C2D',
          'charcoal-light': '#5A5A45',
        },
      },
      fontSize: {
        'hero': ['5rem', { lineHeight: '1.05', fontWeight: '700' }],
        'hero-sm': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'phone': { 'max': '640px' },
        'tablet': { 'min': '641px', 'max': '1024px' },
        'laptop': { 'min': '1025px', 'max': '1440px' },
        'desktop': { 'min': '1441px' },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}