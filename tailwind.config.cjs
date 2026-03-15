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