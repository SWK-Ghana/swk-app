import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Cloudinary helpers ───────────────────────────────────────────────────────
const CLD = 'https://res.cloudinary.com/dwgj3lovn'

// Image optimised URL
const img = (path, w = 600) =>
  `${CLD}/image/upload/f_auto,q_auto,w_${w}/${path}`

// Video thumbnail: Cloudinary generates a JPEG from frame 0 of the video
// The trick: use /video/upload/ path but request .jpg extension with so_0
const videoThumb = (ytId) => `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`

// ─── Data ─────────────────────────────────────────────────────────────────────
const imageProjects = [
  {
    id: 'webinar',
    gradient: 'from-[#F2FAE8] to-green-50',
    border: 'border-[#D4F0A0]',
    accent: 'bg-[#F2FAE8] text-[#1E963C]',
    badge: 'Impact',
    thumb: img('v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png'),
    title: 'Agribusiness Webinar Series',
    desc: 'A three-edition webinar series empowering youth with agribusiness knowledge, powered by Agribusiness e-Academy.',
    stat: '230+ Registrants',
  },
  {
    id: 'eacademy',
    gradient: 'from-blue-50 to-cyan-50',
    border: 'border-blue-100',
    accent: 'bg-blue-100 text-blue-700',
    badge: 'Learning',
    thumb: img('v1760551738/Blue_and_Yellow_Bold_Online_Course_Facebook_Post_1_ubqtmu.png'),
    title: 'e-Academy Courses',
    desc: 'Online learning platform for agribusiness and sustainable farming practices available to youth across Ghana.',
    stat: 'Online',
  },
  {
    id: 'ambassador',
    gradient: 'from-[#F2FAE8] to-blue-50',
    border: 'border-[#D4F0A0]',
    accent: 'bg-purple-100 text-purple-700',
    badge: 'Recognition',
    thumb: null, // dual-image layout
    title: 'Ambassador Recognition',
    desc: "SWK Ghana's leadership team selected as official ambassadors for the Agribusiness e-Academy.",
    stat: 'Partnership',
    dual: [
      img('v1760551738/1752658915453_atc9oo.jpg', 400),
      img('v1760551737/1752658914512_k1zf9t.jpg', 400),
    ],
  },
]

const videoProjects = [
  {
    id: 'taka',
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-100',
    accent: 'bg-purple-100 text-purple-700',
    badge: 'Innovation',
    ytId: 'mqVJMGlINt4',
    title: 'Taka Kipawa App',
    desc: 'Digital waste management solutions for a circular economy.',
  },
  {
    id: 'circular',
    gradient: 'from-green-50 to-[#F2FAE8]',
    border: 'border-green-100',
    accent: 'bg-[#F2FAE8] text-[#1E963C]',
    badge: 'Circular Economy',
    ytId: '2SIXUJJppP4',
    title: 'Circular Economy Innovation',
    desc: 'Youth-led solutions for sustainable consumption and waste reduction.',
  },
  {
    id: 'climate',
    gradient: 'from-orange-50 to-red-50',
    border: 'border-orange-100',
    accent: 'bg-orange-100 text-orange-700',
    badge: 'Climate Action',
    ytId: 'GAE6AL3NWBo',
    title: 'Climate Action',
    desc: 'Children advocating for environmental protection and climate action.',
  },
  {
    id: 'galamsey',
    gradient: 'from-red-50 to-pink-50',
    border: 'border-red-100',
    accent: 'bg-red-100 text-red-700',
    badge: 'Advocacy',
    ytId: 'zDywICh3Ay0',
    title: 'Fight Against Galamsey',
    desc: "Youth voices against illegal mining to protect Ghana's natural resources.",
  },
]

// ─── VideoCard ─────────────────────────────────────────────────────────────────
const VideoCard = ({ gradient, border, accent, badge, ytId, title, desc }) => {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl border ${border} overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col`}>
      {!playing ? (
        <div className="relative cursor-pointer group"
          onClick={() => setPlaying(true)}
          role="button" aria-label={`Play video: ${title}`}>
          <img
            src={videoThumb(ytId)}
            alt={`${title} thumbnail`}
            className="w-full h-44 object-cover bg-gray-200"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex' }}
          />
          <div className="hidden w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center flex-col gap-2" aria-hidden="true">
            <span className="text-4xl">🎬</span>
            <span className="text-xs text-gray-700 font-medium">Click to play</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
            <div className="bg-red-600 group-hover:bg-red-700 rounded-2xl px-5 py-3 shadow-lg transition-all group-hover:scale-110 flex items-center gap-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-white text-xs font-bold">YouTube</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-44 bg-black">
          <iframe
            className="w-full h-44"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${accent}`}>
          {badge}
        </span>
        <h4 className="text-sm xs:text-base font-semibold text-gray-900 mb-1 leading-snug">{title}</h4>
        <p className="text-xs text-gray-800 leading-relaxed flex-1">{desc}</p>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
const OurWork = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-white">
      <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 xs:py-10 sm:py-12 md:py-14">

        {/* ── Page header ── */}
        <div className="text-center mb-10 xs:mb-12 sm:mb-14">
          <span className="inline-block bg-[#F2FAE8] text-[#1E963C] text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
            Programs & Impact
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Our Work
          </h1>
          <p className="text-sm xs:text-base sm:text-lg text-gray-800 max-w-2xl mx-auto">
            From agribusiness webinars to climate action films — explore the full breadth of SWK Ghana's programs and impact.
          </p>
        </div>

        {/* ── Projects & Impact ── */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200 mb-8 xs:mb-10 sm:mb-12">

          <div className="text-center mb-6 xs:mb-8 sm:mb-10">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
              Impact
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Our Projects & Impact
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-gray-800 max-w-2xl mx-auto">
              Real projects, real youth, real impact — across Ghana and beyond.
            </p>
          </div>

          {/* Image-based projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 mb-8">
            {imageProjects.map((p) => (
              <div
                key={p.id}
                className={`bg-gradient-to-br ${p.gradient} rounded-xl border ${p.border} overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col`}
              >
                {/* Image or dual-image */}
                {p.dual ? (
                  <div className="grid grid-cols-2 gap-0.5">
                    <img src={p.dual[0]} alt={p.title} className="w-full h-48 object-cover" loading="lazy" />
                    <img src={p.dual[1]} alt={p.title} className="w-full h-48 object-cover" loading="lazy" />
                  </div>
                ) : (
                  <img src={p.thumb} alt={p.title} className="w-full h-48 object-cover" loading="lazy" />
                )}
                <div className="p-4 xs:p-5 flex flex-col flex-1">
                  <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${p.accent}`}>
                    {p.badge}
                  </span>
                  <h4 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">{p.title}</h4>
                  <p className="text-xs xs:text-sm text-gray-800 leading-relaxed flex-1 mb-3">{p.desc}</p>
                  <span className="self-start text-xs font-semibold text-[#78C31E] bg-[#F2FAE8] border border-[#C0E870] px-3 py-1 rounded-full">
                    {p.stat}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Video projects */}
          <div className="mb-2">
            <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🎬</span> Video Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5">
              {videoProjects.map((v) => (
                <VideoCard key={v.id} {...v} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Focus areas ── */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200 mb-8 xs:mb-10 sm:mb-12">
          <div className="text-center mb-6 xs:mb-8">
            <span className="inline-block bg-[#F2FAE8] text-[#1E963C] text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
              Our Pillars
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Focus Areas
            </h2>
            <p className="text-sm xs:text-base text-gray-800 max-w-2xl mx-auto">
              Six interconnected pillars driving sustainable impact across Ghana.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6">
            {[
              { img: 'v1773615456/photo_2026-03-15_22-53-09_kvzvfr.jpg', title: 'Youth Development', desc: 'Leadership workshops, skills training, and mentorship for young change-makers.' },
              { img: 'v1773660247/photo_2026-03-16_11-22-33_gfsqwy.jpg', title: 'Circular Economy', desc: 'Waste reduction, recycling workshops, and sustainable consumption education.' },
              { img: 'v1760551738/Blue_and_Yellow_Bold_Online_Course_Facebook_Post_1_ubqtmu.png', title: 'Agribusiness Development', desc: 'Training in sustainable agriculture and agribusiness value chains.' },
              { img: 'v1773660247/photo_2026-03-16_11-22-22_i0nolg.jpg', title: 'Technology & Innovation', desc: 'Digital literacy, hackathons, and innovation labs for sustainable solutions.' },
              { img: 'v1773660248/photo_2026-03-16_11-22-40_zbflj4.jpg', title: 'Climate Action', desc: 'Conservation, climate education, and youth-led environmental initiatives.' },
              { img: 'v1773615455/photo_2026-03-15_22-53-49_d6sonh.jpg', title: 'Community Engagement', desc: 'Grassroots projects, forums, and participatory initiatives for resilience.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <img
                  src={img(item.img)}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <div className="p-4 xs:p-5">
                  <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-800 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SDG Alignment ── */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200 mb-8 xs:mb-10 sm:mb-12">
          <div className="text-center mb-6 xs:mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
              Global Goals
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              UN SDG Alignment
            </h2>
            <p className="text-sm xs:text-base text-gray-800 max-w-2xl mx-auto">
              Our work directly contributes to eight UN Sustainable Development Goals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { n: '4', title: 'Quality Education', color: 'bg-[#F2FAE8] text-[#1E963C] border-[#D4F0A0]' },
              { n: '8', title: 'Decent Work & Economic Growth', color: 'bg-blue-50 text-blue-700 border-blue-100' },
              { n: '10', title: 'Reduced Inequalities', color: 'bg-purple-50 text-purple-700 border-purple-100' },
              { n: '11', title: 'Sustainable Cities', color: 'bg-green-50 text-green-700 border-green-100' },
              { n: '12', title: 'Responsible Consumption', color: 'bg-[#F2FAE8] text-[#1E963C] border-[#D4F0A0]' },
              { n: '13', title: 'Climate Action', color: 'bg-green-50 text-green-700 border-green-100' },
              { n: '15', title: 'Life on Land', color: 'bg-[#F2FAE8] text-[#1E963C] border-[#D4F0A0]' },
              { n: '17', title: 'Partnerships for the Goals', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            ].map((g, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-xl border ${g.color} p-3 xs:p-4`}>
                <div className="flex items-center justify-center h-10 w-10 xs:h-12 xs:w-12 rounded-lg bg-white shadow-inner border flex-shrink-0">
                  <span className="font-bold text-base xs:text-lg">{g.n}</span>
                </div>
                <div className="font-medium text-xs xs:text-sm leading-tight">{g.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center py-6 xs:py-8">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Want to Be Part of Our Work?
          </h2>
          <p className="text-sm xs:text-base text-gray-800 mb-6 max-w-xl mx-auto">
            Join SWK Ghana as a volunteer, partner, or supporter and help us scale impact across Africa.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
            <button
              className="btn-gradient text-sm xs:text-base px-6 xs:px-8 py-2.5 xs:py-3"
              onClick={() => navigate('/get-involved')}
            >
              Get Involved
            </button>
            <button
              className="border-2 border-[#78C31E] text-[#78C31E] hover:bg-[#78C31E] hover:text-white px-6 xs:px-8 py-2.5 xs:py-3 rounded-xl font-semibold transition-colors text-sm xs:text-base"
              onClick={() => navigate('/donate')}
            >
              Donate Now
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OurWork