import React from 'react'
import { useNavigate } from 'react-router-dom'

const TakaKipawa = () => {
  const navigate = useNavigate()

  const features = [
    { icon: '♻️', title: 'Waste Collection Scheduling', desc: 'Users can schedule waste pickups directly from the app — making waste management convenient and reliable.' },
    { icon: '🛍️', title: 'Recycled Products Marketplace', desc: 'A marketplace where vendors list eco-friendly and recycled products for buyers to discover and purchase.' },
    { icon: '📰', title: 'News & Articles', desc: 'Stay informed with the latest news on waste management, circular economy, and sustainability in Ghana and Africa.' },
    { icon: '🗺️', title: 'Direction & Guidance', desc: 'Get directions to waste collection points, recycling centres, and drop-off locations near you.' },
    { icon: '👤', title: 'User & Vendor Dashboards', desc: 'Dedicated dashboards for customers and vendors — manage orders, products, pickups and more in one place.' },
    { icon: '🔐', title: 'Secure Authentication', desc: 'Secure signup and login for users, vendors, and administrators with role-based access control.' },
  ]

  const sdgs = [
    { n: '11', title: 'Sustainable Cities & Communities' },
    { n: '12', title: 'Responsible Consumption & Production' },
    { n: '13', title: 'Climate Action' },
    { n: '15', title: 'Life on Land' },
  ]

  const stats = [
    { n: 'Live', label: 'App Status' },
    { n: 'Free', label: 'To Use' },
    { n: '3', label: 'User Roles' },
    { n: 'Ghana', label: 'Based In' },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E963C 0%, #78C31E 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-white/30">
            Digital Innovation · SWK Ghana
          </span>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl">
              <span className="text-5xl">♻️</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Ubuntu, sans-serif' }}>
            Taka Kipawa
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 font-light mb-4 max-w-2xl mx-auto">
            Ghana's Youth-Powered Waste Management App
          </p>
          <p className="text-base text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            A digital platform connecting communities, vendors, and waste collectors to build a cleaner, circular economy across Ghana and Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://takakipawa.swkghana.org"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#1E963C] font-bold text-base px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              🚀 Launch App
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white hover:bg-white hover:text-[#1E963C] px-8 py-4 rounded-xl font-bold transition-all text-base"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#1A1A1A] py-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-bold text-[#78C31E] mb-1">{s.n}</div>
                <div className="text-sm text-white/60 font-light">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 md:py-20">

        {/* About */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-20">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest bg-[#F2FAE8] text-[#1E963C]">
              About the App
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: 'Ubuntu, sans-serif' }}>
              What is Taka Kipawa?
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-5">
                <strong className="text-gray-900">Taka Kipawa</strong> — meaning <em>"Our Waste"</em> in Swahili — is a digital waste management solution developed under SWK Ghana's Technology & Innovation pillar.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-5">
                The app tackles Ghana's growing urban waste challenge by connecting households with waste collectors, empowering youth vendors to sell recycled and upcycled products, and providing communities with actionable sustainability information.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Built by young developers and rooted in circular economy principles, Taka Kipawa is proof that technology can drive sustainable change at the community level.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#F2FAE8] to-green-50 rounded-2xl p-8 border border-[#D4F0A0]">
              <h3 className="text-lg font-bold text-gray-900 mb-4">The Problem We Solve</h3>
              <ul className="space-y-3">
                {[
                  'Over 60% of households face irregular waste collection in Ga West Municipality alone',
                  'Informal waste pickers lack digital tools to connect with buyers',
                  'Youth entrepreneurs in recycling have no marketplace to sell products',
                  'Communities lack access to sustainability education and resources',
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-[#78C31E] font-bold mt-0.5 flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest bg-[#F2FAE8] text-[#1E963C]">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Ubuntu, sans-serif' }}>
              What the App Does
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
              A full-featured platform built for communities, vendors, and administrators.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SDG Alignment */}
        <div className="bg-[#1A1A1A] rounded-2xl p-8 sm:p-12 mb-16 md:mb-20">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest bg-[#78C31E]/20 text-[#78C31E] border border-[#78C31E]/30">
              Global Goals
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: 'Ubuntu, sans-serif' }}>
              SDG Alignment
            </h2>
            <p className="text-white/60 font-light">Taka Kipawa directly contributes to four UN Sustainable Development Goals.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sdgs.map((g, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                <div className="text-3xl font-bold text-[#78C31E] mb-2">SDG {g.n}</div>
                <div className="text-xs text-white/70 leading-snug">{g.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest bg-blue-100 text-blue-700">
              Technology
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Ubuntu, sans-serif' }}>
              Built With
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'React + Vite', desc: 'Frontend', color: 'bg-blue-50 border-blue-100 text-blue-700' },
              { label: 'Node.js + Express', desc: 'Backend API', color: 'bg-green-50 border-green-100 text-green-700' },
              { label: 'MongoDB Atlas', desc: 'Database', color: 'bg-[#F2FAE8] border-[#D4F0A0] text-[#1E963C]' },
              { label: 'Cloudinary', desc: 'Media Storage', color: 'bg-purple-50 border-purple-100 text-purple-700' },
              { label: 'Vercel', desc: 'Frontend Hosting', color: 'bg-gray-50 border-gray-200 text-gray-700' },
              { label: 'Render', desc: 'Backend Hosting', color: 'bg-orange-50 border-orange-100 text-orange-700' },
              { label: 'Tailwind CSS', desc: 'Styling', color: 'bg-cyan-50 border-cyan-100 text-cyan-700' },
              { label: 'JWT Auth', desc: 'Security', color: 'bg-red-50 border-red-100 text-red-700' },
            ].map((t, i) => (
              <div key={i} className={`rounded-xl border p-4 text-center ${t.color}`}>
                <div className="font-bold text-sm mb-1">{t.label}</div>
                <div className="text-xs opacity-70">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-[#F2FAE8] to-green-50 rounded-2xl p-10 sm:p-16 border border-[#D4F0A0]">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Ubuntu, sans-serif' }}>
            Try Taka Kipawa Today
          </h2>
          <p className="text-lg text-gray-500 font-light mb-8 max-w-xl mx-auto">
            Join the movement for cleaner communities and a circular economy in Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://takakipawa.swkghana.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#78C31E] hover:bg-[#1E963C] text-white font-bold text-base px-10 py-4 rounded-xl transition-colors shadow-lg"
            >
              🚀 Launch the App
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center gap-2 border-2 border-[#78C31E] text-[#1E963C] hover:bg-[#78C31E] hover:text-white font-bold text-base px-10 py-4 rounded-xl transition-all"
            >
              Contact Us
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            Free to use · Built in Ghana · Powered by SWK Ghana
          </p>
        </div>

      </div>
    </div>
  )
}

export default TakaKipawa