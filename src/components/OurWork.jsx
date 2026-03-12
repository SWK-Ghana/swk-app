import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Cloudinary helpers ───────────────────────────────────────────────────────
const CLD = 'https://res.cloudinary.com/dwgj3lovn'

// Image optimised URL
const img = (path, w = 600) =>
  `${CLD}/image/upload/f_auto,q_auto,w_${w}/${path}`

// Video thumbnail: Cloudinary generates a JPEG from frame 0 of the video
// The trick: use /video/upload/ path but request .jpg extension with so_0
const videoThumb = (publicId) =>
  `${CLD}/video/upload/so_0,w_640,f_jpg/${publicId}.jpg`

// Video stream URL
const videoUrl = (publicId, version) =>
  `${CLD}/video/upload/v${version}/${publicId}.mp4`

// ─── Data ─────────────────────────────────────────────────────────────────────
const imageProjects = [
  {
    id: 'webinar',
    gradient: 'from-emerald-50 to-green-50',
    border: 'border-emerald-100',
    accent: 'bg-emerald-100 text-emerald-700',
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
    gradient: 'from-emerald-50 to-blue-50',
    border: 'border-emerald-100',
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
    publicId: 'Taka_Kipawa_2_wdxkpo',
    version: '1760552758',
    title: 'Taka Kipawa App',
    desc: 'Digital waste management solutions for a circular economy.',
  },
  {
    id: 'circular',
    gradient: 'from-green-50 to-emerald-50',
    border: 'border-green-100',
    accent: 'bg-green-100 text-green-700',
    badge: 'Circular Economy',
    publicId: '1711018812883_mbddbv',
    version: '1760551740',
    title: 'Circular Economy Innovation',
    desc: 'Youth-led solutions for sustainable consumption and waste reduction.',
  },
  {
    id: 'climate',
    gradient: 'from-orange-50 to-red-50',
    border: 'border-orange-100',
    accent: 'bg-orange-100 text-orange-700',
    badge: 'Climate Action',
    publicId: 'Galamsey_1_iyyc25',
    version: '1760552757',
    title: 'Climate Action',
    desc: 'Children advocating for environmental protection and climate action.',
  },
  {
    id: 'galamsey',
    gradient: 'from-red-50 to-pink-50',
    border: 'border-red-100',
    accent: 'bg-red-100 text-red-700',
    badge: 'Advocacy',
    publicId: '1727031150424_dx6ece',
    version: '1760554407',
    title: 'Fight Against Galamsey',
    desc: "Youth voices against illegal mining to protect Ghana's natural resources.",
  },
]

// ─── VideoCard ─────────────────────────────────────────────────────────────────
const VideoCard = ({ gradient, border, accent, badge, publicId, version, title, desc }) => {
  const [playing, setPlaying] = useState(false)
  const thumb = videoThumb(publicId)
  const src = videoUrl(publicId, version)

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl border ${border} overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col`}>
      {/* Media area */}
      {!playing ? (
        <div
          className="relative cursor-pointer group"
          onClick={() => setPlaying(true)}
          role="button"
          aria-label={`Play video: ${title}`}
        >
          {/* Thumbnail image — Cloudinary serves a JPEG from the video's first frame */}
          <img
            src={thumb}
            alt={`${title} thumbnail`}
            className="w-full h-44 object-cover bg-gray-200"
            loading="lazy"
            onError={(e) => {
              // If the auto-thumbnail fails, show a styled fallback
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling.style.display = 'flex'
            }}
          />
          {/* Fallback — hidden by default, revealed only if thumbnail 404s */}
          <div
            className="hidden w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center flex-col gap-2"
            aria-hidden="true"
          >
            <span className="text-4xl">🎬</span>
            <span className="text-xs text-gray-500 font-medium">Click to play</span>
          </div>
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors">
            <div className="bg-white/95 group-hover:bg-white rounded-full p-3 shadow-lg transition-all group-hover:scale-110">
              <svg className="w-6 h-6 text-emerald-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <video
          controls
          autoPlay
          className="w-full h-44 object-cover bg-black"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Text */}
      <div className="p-4 flex flex-col flex-1">
        <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${accent}`}>
          {badge}
        </span>
        <h4 className="text-sm xs:text-base font-semibold text-gray-900 mb-1 leading-snug">{title}</h4>
        <p className="text-xs text-gray-600 leading-relaxed flex-1">{desc}</p>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
const OurWork = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 xs:py-10 sm:py-12 md:py-14">

        {/* ── Page header ── */}
        <div className="text-center mb-10 xs:mb-12 sm:mb-14">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
            Programs & Impact
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Our Work
          </h1>
          <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
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
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
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
                  <p className="text-xs xs:text-sm text-gray-600 leading-relaxed flex-1 mb-3">{p.desc}</p>
                  <span className="self-start text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
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
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
              Our Pillars
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Focus Areas
            </h2>
            <p className="text-sm xs:text-base text-gray-600 max-w-2xl mx-auto">
              Six interconnected pillars driving sustainable impact across Ghana.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6">
            {[
              { img: 'v1760339246/Youth_Development_j10oja.png', title: 'Youth Development', desc: 'Leadership workshops, skills training, and mentorship for young change-makers.' },
              { img: 'v1760339246/Circular_Economy_v3oo71.png', title: 'Circular Economy', desc: 'Waste reduction, recycling workshops, and sustainable consumption education.' },
              { img: 'v1760339247/Agribusiness_yqc44a.png', title: 'Agribusiness Development', desc: 'Training in sustainable agriculture and agribusiness value chains.' },
              { img: 'v1760339244/Technology_lwdqyb.png', title: 'Technology & Innovation', desc: 'Digital literacy, hackathons, and innovation labs for sustainable solutions.' },
              { img: 'v1760339245/Climate_Action_ffrdiu.png', title: 'Climate Action', desc: 'Conservation, climate education, and youth-led environmental initiatives.' },
              { img: 'v1760339244/Community_Engagement_jnun1t.png', title: 'Community Engagement', desc: 'Grassroots projects, forums, and participatory initiatives for resilience.' },
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
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
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
            <p className="text-sm xs:text-base text-gray-600 max-w-2xl mx-auto">
              Our work directly contributes to eight UN Sustainable Development Goals.
            </p>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-3 xs:gap-4">
            {[
              { n: '4', title: 'Quality Education', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
              { n: '8', title: 'Decent Work & Economic Growth', color: 'bg-blue-50 text-blue-700 border-blue-100' },
              { n: '10', title: 'Reduced Inequalities', color: 'bg-purple-50 text-purple-700 border-purple-100' },
              { n: '11', title: 'Sustainable Cities', color: 'bg-green-50 text-green-700 border-green-100' },
              { n: '12', title: 'Responsible Consumption', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
              { n: '13', title: 'Climate Action', color: 'bg-green-50 text-green-700 border-green-100' },
              { n: '15', title: 'Life on Land', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
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
          <p className="text-sm xs:text-base text-gray-600 mb-6 max-w-xl mx-auto">
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
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-6 xs:px-8 py-2.5 xs:py-3 rounded-xl font-semibold transition-colors text-sm xs:text-base"
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