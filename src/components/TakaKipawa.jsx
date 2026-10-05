import React from 'react'
import { useNavigate } from 'react-router-dom'
import Seo from './Seo'
import PageHero from './PageHero'
import { LuExternalLink, LuLayoutDashboard, LuLock, LuMap, LuNewspaper, LuRecycle, LuShoppingBag } from 'react-icons/lu'

const TakaKipawa = () => {
  const navigate = useNavigate()

  const features = [
    { icon: LuRecycle, title: 'Waste Collection Scheduling', desc: 'Users can schedule waste pickups directly from the app — making waste management convenient and reliable.' },
    { icon: LuShoppingBag, title: 'Recycled Products Marketplace', desc: 'A marketplace where vendors list eco-friendly and recycled products for buyers to discover and purchase.' },
    { icon: LuNewspaper, title: 'News & Articles', desc: 'Stay informed with the latest news on waste management, circular economy, and sustainability in Ghana and Africa.' },
    { icon: LuMap, title: 'Direction & Guidance', desc: 'Get directions to waste collection points, recycling centres, and drop-off locations near you.' },
    { icon: LuLayoutDashboard, title: 'User & Vendor Dashboards', desc: 'Dedicated dashboards for customers and vendors — manage orders, products, pickups and more in one place.' },
    { icon: LuLock, title: 'Secure Authentication', desc: 'Secure signup and login for users, vendors, and administrators with role-based access control.' },
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
      <Seo
        title="Taka Kipawa – Waste Management App | SWK Ghana"
        description="Taka Kipawa is SWK Ghana's waste management platform connecting households, waste collectors, and recyclers across Ga West Municipality for a cleaner, circular economy."
        path="/taka-kipawa"
      />

      <PageHero
        title="Taka Kipawa"
        lede="Ghana's youth-powered waste management app: a digital platform connecting communities, vendors, and waste collectors to build a cleaner, circular economy across Ghana and Africa."
        image={{ path: 'v1773660247/photo_2026-03-16_11-22-33_gfsqwy.jpg', alt: 'Young people sorting plastic bottles for recycling at a community clean-up', position: '50% 55%' }}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://takakipawa.swkghana.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#78C31E] px-6 py-3.5 text-sm font-bold text-[#0C2E11] transition-colors hover:bg-[#8AD62B] hover:text-[#0C2E11] sm:text-base"
          >
            Launch the app <LuExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:text-base"
          >
            Get In Touch
          </button>
        </div>
      </PageHero>

      {/* Stats */}
      <div className="swk-flow-deep py-10">
        <div className="swk-shell">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-bold text-[#78C31E] mb-1">{s.n}</div>
                <div className="text-sm text-white/75 font-light">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="swk-shell py-16 md:py-20">

        {/* About */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-20">
          <div className="text-center mb-10">
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
            <div className="bg-gradient-to-br from-[#F2FAE8] to-white rounded-2xl p-8 border border-[#D4F0A0]">
              <h3 className="text-lg font-bold text-gray-900 mb-4">The Problem We Solve</h3>
              <ul className="space-y-3">
                {[
                  'Over 60% of households face irregular waste collection in Ga West Municipality alone',
                  'Informal waste pickers lack digital tools to connect with buyers',
                  'Youth entrepreneurs in recycling have no marketplace to sell products',
                  'Communities lack access to sustainability education and resources',
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-[#17702D] font-bold mt-0.5 flex-shrink-0">✓</span>
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
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2FAE8] text-[#17702D]">
                  <f.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SDG Alignment */}
        <div className="swk-flow-deep rounded-2xl p-8 sm:p-12 mb-16 md:mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: 'Ubuntu, sans-serif' }}>
              SDG Alignment
            </h2>
            <p className="text-white/75 font-light">Taka Kipawa directly contributes to four UN Sustainable Development Goals.</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Ubuntu, sans-serif' }}>
              Built With
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'React + Vite', desc: 'Frontend', color: 'bg-[#F2FAE8] border-[#D4F0A0] text-[#0F5A24]' },
              { label: 'Node.js + Express', desc: 'Backend API', color: 'bg-[#F2FAE8] border-[#D4F0A0] text-[#0F5A24]' },
              { label: 'MongoDB Atlas', desc: 'Database', color: 'bg-[#F2FAE8] border-[#D4F0A0] text-[#17702D]' },
              { label: 'Cloudinary', desc: 'Media Storage', color: 'bg-[#F2FAE8] border-[#D4F0A0] text-[#0F5A24]' },
              { label: 'Vercel', desc: 'Frontend Hosting', color: 'bg-gray-50 border-gray-200 text-gray-700' },
              { label: 'Render', desc: 'Backend Hosting', color: 'bg-[#F2FAE8] border-[#D4F0A0] text-[#0F5A24]' },
              { label: 'Tailwind CSS', desc: 'Styling', color: 'bg-[#F2FAE8] border-[#D4F0A0] text-[#0F5A24]' },
              { label: 'JWT Auth', desc: 'Security', color: 'bg-[#F2FAE8] border-[#D4F0A0] text-[#0F5A24]' },
            ].map((t, i) => (
              <div key={i} className={`rounded-xl border p-4 text-center ${t.color}`}>
                <div className="font-bold text-sm mb-1">{t.label}</div>
                <div className="text-xs opacity-70">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-[#F2FAE8] to-white rounded-2xl p-10 sm:p-16 border border-[#D4F0A0]">
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
              className="inline-flex items-center justify-center gap-2 bg-[#78C31E] hover:bg-[#8AD62B] text-[#0C2E11] font-bold text-base px-10 py-4 rounded-xl transition-colors shadow-lg"
            >
              Launch the app <LuExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center gap-2 border-2 border-[#78C31E] text-[#17702D] hover:bg-[#78C31E] hover:text-[#0C2E11] font-bold text-base px-10 py-4 rounded-xl transition-all"
            >
              Contact Us
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Free to use · Built in Ghana · Powered by SWK Ghana
          </p>
        </div>

      </div>
    </div>
  )
}

export default TakaKipawa