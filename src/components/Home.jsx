import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Cloudinary helpers
const CLD = 'https://res.cloudinary.com/dwgj3lovn'

// Single-width optimised image (fallback src)
const img = (path, w = 600) => `${CLD}/image/upload/f_auto,q_auto,w_${w}/${path}`

// Responsive srcset — Cloudinary serves WebP/AVIF automatically via f_auto
const srcset = (path, widths = [400, 800, 1200]) =>
  widths.map((w) => `${CLD}/image/upload/f_auto,q_auto,w_${w}/${path} ${w}w`).join(', ')

// Hero images — full-width banner breakpoints
const heroSrcset = (path) => srcset(path, [480, 768, 1024, 1280, 1920])

// Card images — smaller breakpoints for thumbnails
const cardSrcset = (path) => srcset(path, [300, 600, 900])

const videoThumb = (publicId) => `${CLD}/video/upload/so_0,w_640,f_jpg/${publicId}.jpg`
const videoUrl = (publicId, version) => `${CLD}/video/upload/v${version}/${publicId}.mp4`

// Video card with proper Cloudinary thumbnail + fallback
const VideoCard = ({ bg, border, accent, badge, publicId, version, title, description }) => {
  const [playing, setPlaying] = useState(false)
  return (
    <div className={`bg-gradient-to-br ${bg} rounded-xl border ${border} overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col`}>
      {!playing ? (
        <div className="relative cursor-pointer group" onClick={() => setPlaying(true)}>
          <img
            src={videoThumb(publicId)}
            alt={title}
            className="w-full h-44 object-cover bg-gray-200"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling.style.display = 'flex'
            }}
          />
          {/* Fallback if thumbnail fails */}
          <div className="hidden w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center flex-col gap-2">
            <span className="text-4xl">🎬</span>
            <span className="text-xs text-gray-500">Click to play</span>
          </div>
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors">
            <div className="bg-white/95 group-hover:bg-white rounded-full p-3 shadow-lg transition-all group-hover:scale-110">
              <svg className="w-6 h-6 text-emerald-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <video controls autoPlay className="w-full h-44 bg-black">
          <source src={videoUrl(publicId, version)} type="video/mp4" />
        </video>
      )}
      <div className="p-4 flex flex-col flex-1">
        <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${accent}`}>{badge}</span>
        <h4 className="text-sm xs:text-base font-semibold text-gray-900 mb-1 leading-snug">{title}</h4>
        <p className="text-xs text-gray-600 leading-relaxed flex-1">{description}</p>
      </div>
    </div>
  )
}

const Faqs = () => {
  const [open, setOpen] = useState(null)
  const items = [
    { q: 'What is the difference between weather and climate?', a: 'Weather is short-term atmospheric conditions; climate is long-term average patterns.' },
    { q: 'What is climate change?', a: 'A long-term change in average temperature and weather patterns, largely driven by human activities.' },
    { q: 'How does climate change affect health?', a: 'It increases respiratory and cardiovascular risks, extreme weather injuries, disease spread, and mental health stressors.' },
    { q: 'How can climate risks be reduced?', a: 'Through mitigation, adaptation, knowledge expansion, and responsible innovation.' },
  ]
  return (
    <div className="max-w-3xl mx-auto divide-y divide-gray-200">
      {items.map((item, idx) => (
        <div key={idx} className="py-4">
          <button className="w-full text-left flex items-center justify-between gap-3" onClick={() => setOpen(v => v === idx ? null : idx)}>
            <span className="font-semibold text-sm xs:text-base text-gray-900">{item.q}</span>
            <span className="text-gray-400 text-xl flex-shrink-0">{open === idx ? '−' : '+'}</span>
          </button>
          {open === idx && <p className="mt-2 text-xs xs:text-sm text-gray-600 leading-relaxed">{item.a}</p>}
        </div>
      ))}
    </div>
  )
}

const Testimonials = () => {
  const items = [
    { name: 'Alex Johnson', text: 'Volunteering with SWK has been incredibly rewarding. The impact is real.' },
    { name: 'Maria Rodriguez', text: 'The programs helped me grow personally and professionally.' },
    { name: 'Kofi Mensah', text: 'Community projects brought people together and created amazing opportunities.' },
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % items.length), 7000)
    return () => clearInterval(id)
  }, [items.length])
  return (
    <div className="max-w-3xl mx-auto text-center">
      <blockquote className="text-sm xs:text-base sm:text-lg text-gray-700 bg-emerald-50 border border-emerald-100 rounded-xl p-5 xs:p-6 sm:p-8 mb-4 italic">
        "{items[idx].text}"
      </blockquote>
      <div className="text-sm font-semibold text-gray-800">— {items[idx].name}</div>
      <div className="mt-4 flex justify-center gap-2">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-current={i === idx ? 'true' : undefined}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${i === idx ? 'bg-emerald-600' : 'bg-emerald-200 hover:bg-emerald-300'}`} />
        ))}
      </div>
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const [isPartnerOpen, setIsPartnerOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [volunteerFullName, setVolunteerFullName] = useState('')
  const [volunteerAge, setVolunteerAge] = useState('')
  const [volunteerEmail, setVolunteerEmail] = useState('')
  const [volunteerMotivation, setVolunteerMotivation] = useState('')
  const [volunteerDocLink, setVolunteerDocLink] = useState('')
  const [volunteerDocFile, setVolunteerDocFile] = useState(null)

  const slides = useMemo(() => ([
    { _path: 'v1760294683/SWK_at_Ga_West_n0c3fz.jpg', image: img('v1760294683/SWK_at_Ga_West_n0c3fz.jpg', 1280), title: 'Empowering Youth for Sustainable Change', subtitle: 'Youth-focused programs driving resilient communities across Africa.' },
    { _path: 'v1760339245/Climate_Action_ffrdiu.png', image: img('v1760339245/Climate_Action_ffrdiu.png', 1280), title: 'Climate Action & Environmental Stewardship', subtitle: 'Youth-led initiatives protecting our planet for future generations.' },
    { _path: 'v1760339244/Technology_lwdqyb.png', image: img('v1760339244/Technology_lwdqyb.png', 1280), title: 'Technology & Innovation', subtitle: 'Building digital skills and solutions for sustainable development.' },
  ]), [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setIsVolunteerOpen(false); setIsPartnerOpen(false) } }
    window.addEventListener('keydown', onKey)
    const id = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 6000)
    return () => { clearInterval(id); window.removeEventListener('keydown', onKey) }
  }, [slides.length])

  const openVolunteerEmail = () => {
    const to = 'sustainabilitywithkoomson@gmail.com'
    const subject = `Volunteer Application - ${volunteerFullName || 'SWK Website'}`
    const body = ['Volunteer Application (via SWK website)', '', `Full name: ${volunteerFullName}`, `Age: ${volunteerAge}`, `Email: ${volunteerEmail}`, '', 'Motivation:', volunteerMotivation, '', `Document link: ${volunteerDocLink || 'N/A'}`, `File selected: ${volunteerDocFile?.name || 'N/A'}`, '', volunteerDocFile ? 'Note: Please attach the file before sending.' : ''].join('\n')
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const resetVolunteer = () => { setVolunteerFullName(''); setVolunteerAge(''); setVolunteerEmail(''); setVolunteerMotivation(''); setVolunteerDocLink(''); setVolunteerDocFile(null) }

  const videoProjects = [
    { id: 'taka', bg: 'from-purple-50 to-pink-50', border: 'border-purple-100', accent: 'bg-purple-100 text-purple-700', badge: 'Innovation', publicId: 'Taka_Kipawa_2_wdxkpo', version: '1760552758', title: 'Taka Kipawa App', description: 'Digital solutions for waste management and circular economy.' },
    { id: 'circular', bg: 'from-green-50 to-emerald-50', border: 'border-green-100', accent: 'bg-green-100 text-green-700', badge: 'Circular Economy', publicId: '1711018812883_mbddbv', version: '1760551740', title: 'Circular Economy Innovation', description: 'Youth-led solutions for sustainable consumption and waste reduction.' },
    { id: 'climate', bg: 'from-orange-50 to-red-50', border: 'border-orange-100', accent: 'bg-orange-100 text-orange-700', badge: 'Climate Action', publicId: 'Galamsey_1_iyyc25', version: '1760552757', title: 'Climate Action', description: 'Children advocating for environmental protection and climate action.' },
    { id: 'galamsey', bg: 'from-red-50 to-pink-50', border: 'border-red-100', accent: 'bg-red-100 text-red-700', badge: 'Advocacy', publicId: '1727031150424_dx6ece', version: '1760554407', title: 'Fight Against Galamsey', description: "Youth voices against illegal mining to protect Ghana's natural resources." },
  ]

  const Section = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200 mb-8 xs:mb-10 sm:mb-12 ${className}`}>
      {children}
    </div>
  )

  const SectionHeader = ({ badge, badgeColor = 'bg-emerald-100 text-emerald-700', title, subtitle }) => (
    <div className="text-center mb-6 xs:mb-8 sm:mb-10">
      <span className={`inline-block text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3 ${badgeColor}`}>{badge}</span>
      <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
      {subtitle && <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 xs:py-8 sm:py-10 md:py-12">

        {/* ══ 1. HERO SLIDER ══════════════════════════════════════════════════ */}
        <div className="relative mb-8 xs:mb-10 sm:mb-12 rounded-xl xs:rounded-2xl overflow-hidden">
          {slides.map((s, idx) => (
            <img key={s.image} src={s.image}
              srcSet={heroSrcset(s._path)}
              sizes="100vw"
              alt={s.title}
              fetchPriority={idx === 0 ? 'high' : 'low'}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding={idx === 0 ? 'sync' : 'async'}
              className={`h-[42vh] xs:h-[48vh] sm:h-[52vh] md:h-[58vh] lg:h-[62vh] w-full object-cover transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 xs:px-6 sm:px-8 max-w-4xl xl:max-w-5xl">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 xs:mb-4 leading-tight">{slides[currentSlide].title}</h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-emerald-100 mb-6 xs:mb-8">{slides[currentSlide].subtitle}</p>
              <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
                <button className="btn-gradient text-sm xs:text-base sm:text-lg px-6 xs:px-8 py-2.5 xs:py-3" onClick={() => navigate('/get-involved')}>Get Involved</button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-6 xs:px-8 py-2.5 xs:py-3 rounded-xl font-semibold transition-colors text-sm xs:text-base" onClick={() => navigate('/about')}>Learn More</button>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentSlide ? 'true' : undefined}
                className={`h-2.5 w-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'}`} />
            ))}
          </div>
        </div>

        {/* ══ 2. IMPACT STATS ═════════════════════════════════════════════════ */}
        <div className="bg-emerald-700 rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-8 mb-8 xs:mb-10 sm:mb-12">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 xs:gap-6 text-center">
            {[{ n: '230+', label: 'Webinar Registrants' }, { n: '236', label: 'Youth Empowered' }, { n: '72', label: 'Women Impacted' }, { n: '3', label: 'Program Editions' }].map((s, i) => (
              <div key={i}>
                <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-1">{s.n}</div>
                <div className="text-xs xs:text-sm text-emerald-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 3. FOCUS AREAS ══════════════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="What We Do" title="Our Focus Areas" subtitle="Six pillars driving sustainable youth development across Ghana and Africa." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6">
            {[
              { src: 'v1760339246/Youth_Development_j10oja.png', title: 'Youth Development Programs', desc: 'Leadership workshops, skills training, and mentorship for youth change-makers.' },
              { src: 'v1760339246/Circular_Economy_v3oo71.png', title: 'Circular Economy Initiatives', desc: 'Waste reduction, recycling workshops, and sustainable consumption education.' },
              { src: 'v1760339247/Agribusiness_yqc44a.png', title: 'Agribusiness Development', desc: 'Training in sustainable agriculture and agribusiness value chains.' },
              { src: 'v1760339244/Technology_lwdqyb.png', title: 'Technology & Innovation', desc: 'Digital literacy, hackathons, and innovation labs for sustainable solutions.' },
              { src: 'v1760339245/Climate_Action_ffrdiu.png', title: 'Climate Action Projects', desc: 'Conservation, climate education, and youth-led environmental initiatives.' },
              { src: 'v1760339244/Community_Engagement_jnun1t.png', title: 'Community Engagement', desc: 'Grassroots projects, forums, and participatory initiatives for resilience.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <img
                  src={img(item.src)}
                  srcSet={cardSrcset(item.src)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-4 xs:p-5">
                  <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ══ 4. PROJECTS & IMPACT ════════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="Impact" badgeColor="bg-blue-100 text-blue-700" title="Our Projects & Impact" subtitle="From agribusiness webinars to climate action — here's what we've been building." />

          {/* Image projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 mb-8">
            {[
              {
                gradient: 'from-emerald-50 to-green-50', border: 'border-emerald-100', badge: 'Impact', accent: 'bg-emerald-100 text-emerald-700',
                path: 'v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png', title: 'Agribusiness Webinar Series',
                desc: 'Three-edition webinar series on agriculture as a business for youth empowerment.', stat: '230+ Registrants',
              },
              {
                gradient: 'from-blue-50 to-cyan-50', border: 'border-blue-100', badge: 'Learning', accent: 'bg-blue-100 text-blue-700',
                path: 'v1760551738/Blue_and_Yellow_Bold_Online_Course_Facebook_Post_1_ubqtmu.png', title: 'e-Academy Courses',
                desc: 'Online learning platform for agribusiness and sustainable farming practices.', stat: 'Online',
              },
            ].map((p, i) => (
              <div key={i} className={`bg-gradient-to-br ${p.gradient} rounded-xl border ${p.border} overflow-hidden hover:shadow-md transition-shadow flex flex-col`}>
                <img
                  src={img(p.path)}
                  srcSet={cardSrcset(p.path)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={p.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-4 xs:p-5 flex flex-col flex-1">
                  <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${p.accent}`}>{p.badge}</span>
                  <h4 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">{p.title}</h4>
                  <p className="text-xs xs:text-sm text-gray-600 leading-relaxed flex-1 mb-3">{p.desc}</p>
                  <span className="self-start text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">{p.stat}</span>
                </div>
              </div>
            ))}
            {/* Ambassador — dual image */}
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="grid grid-cols-2 gap-0.5">
                <img
                  src={img('v1760551738/1752658915453_atc9oo.jpg', 400)}
                  srcSet={cardSrcset('v1760551738/1752658915453_atc9oo.jpg')}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                  alt="Founder Ambassador" className="w-full h-48 object-cover" loading="lazy" decoding="async" />
                <img
                  src={img('v1760551737/1752658914512_k1zf9t.jpg', 400)}
                  srcSet={cardSrcset('v1760551737/1752658914512_k1zf9t.jpg')}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                  alt="Ambassador" className="w-full h-48 object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="p-4 xs:p-5 flex flex-col flex-1">
                <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 bg-purple-100 text-purple-700">Recognition</span>
                <h4 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">Ambassador Recognition</h4>
                <p className="text-xs xs:text-sm text-gray-600 leading-relaxed flex-1 mb-3">SWK Ghana's leadership team selected as official ambassadors for the Agribusiness e-Academy.</p>
                <span className="self-start text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">Partnership</span>
              </div>
            </div>
          </div>

          {/* Video stories */}
          <div>
            <h3 className="text-base xs:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🎬</span> Video Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5">
              {videoProjects.map((v) => <VideoCard key={v.id} {...v} />)}
            </div>
          </div>
        </Section>

        {/* ══ 5. WHAT WE'RE DOING ═════════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="Currently Active" title="What We're Doing" subtitle="Programs and initiatives SWK Ghana is actively running right now." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5">
            {[
              { icon: '🌾', tag: 'Agribusiness', tc: 'bg-green-100 text-green-700', title: 'Agribusiness Webinar Series', desc: "Ongoing webinar series equipping youth with agribusiness knowledge, tools, and networks." },
              { icon: '🌍', tag: 'Climate Action', tc: 'bg-blue-100 text-blue-700', title: 'Climate Action Campaigns', desc: 'Youth-led campaigns raising awareness about climate change and sustainable practices across Ghana.' },
              { icon: '🤝', tag: 'Community', tc: 'bg-purple-100 text-purple-700', title: 'Community Outreach Programs', desc: 'Grassroots programs engaging communities in sustainable development and education across Greater Accra.' },
              { icon: '💡', tag: 'Training', tc: 'bg-yellow-100 text-yellow-700', title: 'Skills & Leadership Workshops', desc: 'Practical workshops building leadership, entrepreneurship, and digital skills for young Ghanaians.' },
              { icon: '📢', tag: 'Advocacy', tc: 'bg-red-100 text-red-700', title: 'Youth Advocacy Initiatives', desc: 'Amplifying youth voices in policy discussions on climate and sustainability at local and continental levels.' },
            ].map((a, idx) => (
              <div key={idx} className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.tc}`}>{a.tag}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">● Ongoing</span>
                </div>
                <div className="text-3xl mb-3">{a.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-xs xs:text-sm text-gray-600 leading-relaxed flex-1">{a.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ══ 6. UPCOMING EVENTS ══════════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="Mark Your Calendar" badgeColor="bg-blue-100 text-blue-700" title="Upcoming Events" subtitle="Join us at our next events and be part of the movement for sustainable change." />
          <div className="space-y-4 xs:space-y-5 mb-8">
            {[
              { tag: 'Webinar', tc: 'bg-green-100 text-green-700', title: 'Agribusiness Webinar Series — Next Edition', desc: 'Join us for the next edition of our popular Agribusiness Webinar Series. Details coming soon!', location: 'Google Meet (Online)' },
              { tag: 'Workshop', tc: 'bg-yellow-100 text-yellow-700', title: 'Youth Leadership & Skills Training Workshop', desc: 'A hands-on workshop building leadership, entrepreneurship, and digital skills for young Ghanaians.', location: 'Accra, Ghana' },
              { tag: 'Community', tc: 'bg-purple-100 text-purple-700', title: 'Community Outreach & Engagement Day', desc: "An outreach day bringing SWK Ghana's programs directly to communities across Greater Accra.", location: 'Greater Accra, Ghana' },
            ].map((event, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 xs:p-5 sm:p-6 border border-emerald-100 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 flex sm:flex-col items-center justify-center bg-white rounded-xl border border-emerald-200 px-5 py-3 text-center gap-2 sm:gap-0">
                  <span className="text-xl font-bold text-emerald-700">TBA</span>
                  <span className="text-xs font-medium text-gray-400 uppercase">Soon</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${event.tc}`}>{event.tag}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Free</span>
                  </div>
                  <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-3">{event.desc}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-gray-500">📍 {event.location}</span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">Registration Opening Soon</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="btn-gradient text-sm xs:text-base px-6 xs:px-8 py-2.5 xs:py-3" onClick={() => navigate('/get-involved')}>
              Get Notified About Events
            </button>
          </div>
        </Section>

        {/* ══ 7. REPORTS & RESOURCES ══════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="Publications" title="Reports & Resources" subtitle="Access our latest impact reports, annual reviews, and research publications." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 mb-8">

            {/* Report 1 — Agribusiness Impact Report (cover = webinar flyer) */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative">
                <img
                  src={img('v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png')}
                  srcSet={cardSrcset('v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png')}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt="Agribusiness Impact Report 2025" className="w-full h-48 object-cover" loading="lazy" decoding="async" />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Latest Report</span>
              </div>
              <div className="p-4 xs:p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Impact Report</span>
                <h3 className="text-base font-semibold text-gray-900 mt-1 mb-2">Agribusiness Webinar Series Impact Report 2025</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">Three editions. 230+ verified registrants. Full impact metrics, SDG alignment, and demographic insights.</p>
                <div className="flex gap-2">
                  <a href="https://docs.google.com/document/d/1C7_1Yh86niEFApNaQFBcJn37zLgz3kOb/edit?usp=sharing" target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors">📄 View</a>
                  <a href="https://docs.google.com/document/d/1C7_1Yh86niEFApNaQFBcJn37zLgz3kOb/export?format=pdf" target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold text-emerald-600 border border-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors">⬇️ PDF</a>
                </div>
              </div>
            </div>

            {/* Report 2 — Annual Report (cover = SWK team photo) */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative">
                <img
                  src={img('v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg')}
                  srcSet={cardSrcset('v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg')}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt="SWK Ghana Annual Report 2025"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'flex'
                  }}
                />
                {/* Fallback cover */}
                <div className="hidden w-full h-48 bg-gradient-to-br from-blue-200 to-cyan-200 items-center justify-center">
                  <span className="text-5xl">📊</span>
                </div>
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Annual Report</span>
              </div>
              <div className="p-4 xs:p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Annual Report</span>
                <h3 className="text-base font-semibold text-gray-900 mt-1 mb-2">SWK Ghana Annual Report 2025</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">Our annual review of programs, partnerships, community impact, and organizational milestones for 2025.</p>
                <div className="flex gap-2">
                  <a href="https://docs.google.com/document/d/12mrbzehyu34yzYL_xpxm5OcJUoEeAyz8/edit?usp=sharing" target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors">📄 View</a>
                  <a href="https://docs.google.com/document/d/12mrbzehyu34yzYL_xpxm5OcJUoEeAyz8/export?format=pdf" target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">⬇️ PDF</a>
                </div>
              </div>
            </div>

            {/* Report 3 — Coming soon */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col items-center justify-center gap-2">
                <span className="text-5xl">📋</span>
                <span className="text-sm font-semibold text-purple-800">Coming Soon</span>
              </div>
              <div className="p-4 xs:p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Program Summary</span>
                <h3 className="text-base font-semibold text-gray-900 mt-1 mb-2">Youth Development Program Summary</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">A comprehensive summary of SWK Ghana's youth development programs, reach, and outcomes across Ghana.</p>
                <span className="self-start text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg">Coming Soon</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button className="btn-gradient text-sm xs:text-base px-6 xs:px-8 py-2.5 xs:py-3" onClick={() => navigate('/reports')}>
              View All Reports & Publications →
            </button>
          </div>
        </Section>

        {/* ══ 8. UN SDG ALIGNMENT (moved down) ═══════════════════════════════ */}
        <Section>
          <SectionHeader badge="Global Goals" badgeColor="bg-blue-100 text-blue-700" title="UN SDG Alignment" subtitle="SWK Ghana's mission directly contributes to eight Sustainable Development Goals." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 items-center">
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <img
                src={img('v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg', 900)}
                srcSet={srcset('v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg', [480, 768, 900])}
                sizes="(max-width: 1024px) 100vw, 50vw"
                alt="SWK team" className="w-full h-auto" loading="lazy" decoding="async" />
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
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
        </Section>

        {/* ══ 9. FAQs ═════════════════════════════════════════════════════════ */}
        <Section>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-6 xs:mb-8 text-center">FAQs</h2>
          <Faqs />
        </Section>

        {/* ══ 10. TESTIMONIALS ════════════════════════════════════════════════ */}
        <Section>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-6 xs:mb-8 text-center">What People Say</h2>
          <Testimonials />
        </Section>

        {/* ══ 11. PARTNERS ════════════════════════════════════════════════════ */}
        <Section>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Partners & Supporters</h2>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 xs:gap-5 items-center">
            {[1,2,3,4,5].map((n) => (
              <img key={n} src={`https://dummyimage.com/200x80/edf2f7/a0aec0&text=Partner+${n}`} alt={`Partner ${n}`} className="mx-auto h-10 object-contain opacity-80 hover:opacity-100 transition" loading="lazy" />
            ))}
          </div>
        </Section>

        {/* ══ 12. NEWSLETTER ══════════════════════════════════════════════════ */}
        <Section>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Newsletter</h2>
          <p className="text-sm xs:text-base text-gray-600 mb-6 text-center max-w-2xl mx-auto">Sign up to receive updates and news from SWK Ghana directly in your inbox.</p>
          <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="your.email@example.com"
              className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button type="submit" className="btn-gradient px-6 py-3 rounded-xl text-sm">Subscribe</button>
          </form>
        </Section>

        {/* ══ 13. CTA ═════════════════════════════════════════════════════════ */}
        <div className="text-center mb-4">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Join the Movement</h2>
          <p className="text-sm xs:text-base text-gray-600 mb-8 max-w-2xl mx-auto">Together, we can empower young people, transform communities, and protect our planet.</p>
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
            <button className="btn-gradient text-sm xs:text-base px-6 xs:px-8 py-2.5 xs:py-3" onClick={() => setIsVolunteerOpen(true)}>Volunteer Today</button>
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-6 xs:px-8 py-2.5 xs:py-3 rounded-xl font-semibold transition-colors text-sm xs:text-base" onClick={() => setIsPartnerOpen(true)}>Partner With Us</button>
          </div>
        </div>

      </div>

      {/* VOLUNTEER MODAL */}
      {isVolunteerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsVolunteerOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Volunteer Sign-Up</h3>
              <button className="text-gray-400 hover:text-gray-600 text-xl" aria-label="Close volunteer form" onClick={() => setIsVolunteerOpen(false)}>✕</button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); openVolunteerEmail(); resetVolunteer(); setIsVolunteerOpen(false) }}>
              <div>
                <label htmlFor="vol-name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input required id="vol-name" type="text" value={volunteerFullName} onChange={(e) => setVolunteerFullName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vol-age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input required id="vol-age" type="number" min={10} max={120} value={volunteerAge} onChange={(e) => setVolunteerAge(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 24" />
                </div>
                <div>
                  <label htmlFor="vol-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required id="vol-email" type="email" value={volunteerEmail} onChange={(e) => setVolunteerEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="vol-motivation" className="block text-sm font-medium text-gray-700 mb-1">Motivation</label>
                <textarea required id="vol-motivation" rows={4} value={volunteerMotivation} onChange={(e) => setVolunteerMotivation(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Tell us why you want to volunteer…" />
              </div>
              <div className="space-y-2">
                <div>
                  <label htmlFor="vol-file" className="block text-sm font-medium text-gray-700 mb-1">Attach document (optional)</label>
                  <input id="vol-file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => setVolunteerDocFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg bg-white" />
                </div>
                <div>
                  <label htmlFor="vol-link" className="block text-sm font-medium text-gray-700 mb-1">Or paste a link (optional)</label>
                  <input id="vol-link" type="url" value={volunteerDocLink} onChange={(e) => setVolunteerDocLink(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="https://drive.google.com/…" />
                </div>
                <p className="text-xs text-gray-500">Your email app will open on submit. Attach files before sending.</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg border text-gray-700" onClick={() => { resetVolunteer(); setIsVolunteerOpen(false) }}>Cancel</button>
                <button type="submit" className="btn-gradient px-5 py-2">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARTNER MODAL */}
      {isPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsPartnerOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Partnership Inquiry</h3>
              <button className="text-gray-400 hover:text-gray-600 text-xl" aria-label="Close partnership form" onClick={() => setIsPartnerOpen(false)}>✕</button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="partner-org" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input required id="partner-org" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="partner-name" className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input required id="partner-name" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label htmlFor="partner-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required id="partner-email" type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label htmlFor="partner-message" className="block text-sm font-medium text-gray-700 mb-1">How would you like to partner?</label>
                <textarea id="partner-message" rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Describe partnership interest" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg border text-gray-700" onClick={() => setIsPartnerOpen(false)}>Cancel</button>
                <button type="submit" className="btn-gradient px-5 py-2">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home