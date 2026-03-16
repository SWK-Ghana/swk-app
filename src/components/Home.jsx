import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendEmail, subscribeContact } from '../utils/brevo'

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

const videoThumb = (ytId) => `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`

// Video card using YouTube embed
const VideoCard = ({ bg, border, accent, badge, ytId, title, description }) => {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`bg-gradient-to-br ${bg} rounded-xl border ${border} overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col`}>
      {!playing ? (
        <div className="relative cursor-pointer group" onClick={() => setPlaying(true)}>
          <img
            src={videoThumb(ytId)}
            alt={title}
            className="w-full h-44 object-cover bg-gray-200"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling.style.display = 'flex'
            }}
          />
          <div className="hidden w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center flex-col gap-2">
            <span className="text-4xl">🎬</span>
            <span className="text-xs text-gray-500">Click to play</span>
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
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&rel=0&playsinline=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${accent}`}>{badge}</span>
        <h3 className="text-sm xs:text-base font-semibold text-gray-900 mb-1 leading-snug">{title}</h3>
        <p className="text-xs text-gray-800 leading-relaxed flex-1">{description}</p>
      </div>
    </div>
  )
}

const Faqs = () => {
  const [open, setOpen] = useState(null)
  const items = [
    {
      q: 'How do I join SWK Ghana?',
      a: 'There are several ways to join! You can volunteer, partner with us, or simply stay connected through our community. Visit the Get Involved page to fill out a volunteer application or reach out to us at info@swkghana.org. We welcome young people aged 15–35 who are passionate about sustainability and community development.',
    },
    {
      q: 'Do you have a WhatsApp group I can join for updates and to meet other people?',
      a: 'Yes! We have an active WhatsApp community where we share updates, opportunities, and connect with like-minded youth across Ghana and Africa. Click the "Join our WhatsApp Community" button anywhere on the site or use this link: https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu',
    },
    {
      q: 'I have a project and/or collaboration suggestion. What do I do?',
      a: 'We love new ideas! Send us a message through the Contact page or email us directly at info@swkghana.org with your project idea or collaboration proposal. You can also fill out the Partner With Us form on the Get Involved page. Our team reviews all submissions and will get back to you within 3–5 business days.',
    },
    {
      q: 'I am a young entrepreneur. Can I list my product on SWK Marketplace?',
      a: 'Absolutely! SWK Marketplace is built specifically to support youth-led ventures in agribusiness and the circular economy. Head to the Marketplace page and click "List Your Product". All products must align with UN SDG 12 and be eco-friendly. Our team will review your submission within 24–48 hours.',
    },
    {
      q: 'Does SWK Ghana operate outside of Accra?',
      a: 'Our current base is in Accra, Greater Accra Region, but our programs — especially our webinar series — reach youth across Ghana and beyond. We have had participants from 9+ countries. Our vision is to scale across Africa by 2035.',
    },
    {
      q: 'How can my organization partner with SWK Ghana?',
      a: 'We are always open to meaningful partnerships with organizations, businesses, NGOs, and institutions that share our vision. Visit the Get Involved page and click "Become a Partner", or email us at info@swkghana.org with details about your organization and the type of partnership you have in mind.',
    },
    {
      q: 'Are your programs free to participate in?',
      a: 'Yes! Most of our programs, webinars, and community events are free of charge. Our mission is to make youth development and sustainability education accessible to all young people regardless of their financial situation.',
    },
    {
      q: 'How can I support SWK Ghana financially?',
      a: 'You can support us through donations on our Donate page. Every contribution — big or small — goes directly towards funding our programs, events, and community initiatives. We also welcome in-kind support and sponsorships.',
    },
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
      <blockquote className="text-sm xs:text-base sm:text-lg text-gray-700 bg-[#F2FAE8] border border-[#D4F0A0] rounded-xl p-5 xs:p-6 sm:p-8 mb-4 italic">
        "{items[idx].text}"
      </blockquote>
      <div className="text-sm font-semibold text-gray-800">— {items[idx].name}</div>
      <div className="mt-4 flex justify-center gap-1">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-current={i === idx ? 'true' : undefined}
            className="p-2 flex items-center justify-center"
          >
            <span className={`block h-2.5 w-2.5 rounded-full transition-colors ${i === idx ? 'bg-[#78C31E]' : 'bg-emerald-200 hover:bg-emerald-300'}`} />
          </button>
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
  const [volunteerRole, setVolunteerRole] = useState('')
  const [volunteerHours, setVolunteerHours] = useState('')
  const [volunteerMotivation, setVolunteerMotivation] = useState('')
  const [volunteerDocLink, setVolunteerDocLink] = useState('')
  const [volunteerDocFile, setVolunteerDocFile] = useState(null)
  const [volunteerStatus, setVolunteerStatus] = useState('idle')
  const [partnerOrg, setPartnerOrg] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerMessage, setPartnerMessage] = useState('')
  const [partnerStatus, setPartnerStatus] = useState('idle')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')

  const slides = useMemo(() => ([
    { _path: 'v1773615456/photo_2026-03-15_22-53-09_kvzvfr.jpg', image: img('v1773615456/photo_2026-03-15_22-53-09_kvzvfr.jpg', 1280), title: 'Empowering Youth for Sustainable Change', subtitle: 'Youth-focused programs driving resilient communities across Africa.', position: 'object-center' },
    { _path: 'v1773663233/photo_4_2026-03-16_12-13-08_ox4qsx.jpg', image: img('v1773663233/photo_4_2026-03-16_12-13-08_ox4qsx.jpg', 1280), title: 'Climate Action & Environmental Stewardship', subtitle: 'Youth-led initiatives protecting our planet for future generations.', position: 'object-center' },
    { _path: 'v1760294683/SWK_at_Ga_West_n0c3fz.jpg', image: img('v1760294683/SWK_at_Ga_West_n0c3fz.jpg', 1280), title: 'Building Resilient Communities', subtitle: 'Connecting young people across Ghana and Africa for lasting impact.', position: 'object-center' },
    { _path: 'v1773615456/photo_2026-03-15_22-53-24_iqemaf.jpg', image: img('v1773615456/photo_2026-03-15_22-53-24_iqemaf.jpg', 1280), title: 'Agribusiness Development', subtitle: 'Equipping youth with the knowledge and tools to thrive in agribusiness.', position: 'object-top' },
    { _path: 'v1773660247/photo_2026-03-16_11-22-15_enjvh6.jpg', image: img('v1773660247/photo_2026-03-16_11-22-15_enjvh6.jpg', 1280), title: 'Technology & Innovation', subtitle: 'Building digital skills and solutions for sustainable development.', position: 'object-center' },
  ]), [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setIsVolunteerOpen(false); setIsPartnerOpen(false) } }
    window.addEventListener('keydown', onKey)
    const id = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 6000)
    return () => { clearInterval(id); window.removeEventListener('keydown', onKey) }
  }, [slides.length])

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault()
    setVolunteerStatus('sending')
    try {
      await sendEmail({
        _subject: `Volunteer Application — ${volunteerFullName}`,
        name: volunteerFullName,
        age: volunteerAge,
        email: volunteerEmail,
        role: volunteerRole || 'N/A',
        hours_per_week: volunteerHours || 'N/A',
        motivation: volunteerMotivation,
        document_link: volunteerDocLink || 'N/A',
        file_name: volunteerDocFile?.name || 'N/A',
        form_type: 'Volunteer Application',
      })
      setVolunteerStatus('success')
    } catch {
      setVolunteerStatus('error')
    }
  }

  const handlePartnerSubmit = async (e) => {
    e.preventDefault()
    setPartnerStatus('sending')
    try {
      await sendEmail({
        _subject: `Partnership Inquiry — ${partnerOrg}`,
        organisation: partnerOrg,
        contact_name: partnerName,
        email: partnerEmail,
        message: partnerMessage,
        form_type: 'Partnership Inquiry',
      })
      setPartnerStatus('success')
    } catch {
      setPartnerStatus('error')
    }
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    setNewsletterStatus('sending')
    try {
      await subscribeContact(newsletterEmail)
      setNewsletterStatus('success')
      setNewsletterEmail('')
    } catch {
      setNewsletterStatus('error')
    }
  }

  const resetVolunteer = () => { setVolunteerFullName(''); setVolunteerAge(''); setVolunteerEmail(''); setVolunteerRole(''); setVolunteerHours(''); setVolunteerMotivation(''); setVolunteerDocLink(''); setVolunteerDocFile(null); setVolunteerStatus('idle') }
  const resetPartner = () => { setPartnerOrg(''); setPartnerName(''); setPartnerEmail(''); setPartnerMessage(''); setPartnerStatus('idle') }

  const videoProjects = [
    { id: 'taka', bg: 'from-purple-50 to-pink-50', border: 'border-purple-100', accent: 'bg-purple-100 text-purple-700', badge: 'Innovation', ytId: 'mqVJMGlINt4', title: 'Taka Kipawa App', description: 'Digital solutions for waste management and circular economy.' },
    { id: 'circular', bg: 'from-green-50 to-[#F2FAE8]', border: 'border-green-100', accent: 'bg-[#F2FAE8] text-[#1E963C]', badge: 'Circular Economy', ytId: '2SIXUJJppP4', title: 'Circular Economy Innovation', description: 'Youth-led solutions for sustainable consumption and waste reduction.' },
    { id: 'climate', bg: 'from-orange-50 to-red-50', border: 'border-orange-100', accent: 'bg-orange-100 text-orange-700', badge: 'Climate Action', ytId: 'GAE6AL3NWBo', title: 'Climate Action', description: 'Children advocating for environmental protection and climate action.' },
    { id: 'galamsey', bg: 'from-red-50 to-pink-50', border: 'border-red-100', accent: 'bg-red-100 text-red-700', badge: 'Advocacy', ytId: 'zDywICh3Ay0', title: 'Fight Against Galamsey', description: "Youth voices against illegal mining to protect Ghana's natural resources." },
  ]

  const Section = ({ children, className = '' }) => (
    <div className={`bg-white rounded-2xl p-6 sm:p-10 md:p-14 shadow-sm border border-gray-100 mb-10 sm:mb-16 ${className}`}>
      {children}
    </div>
  )

  const SectionHeader = ({ badge, badgeColor = 'bg-[#F2FAE8] text-[#1E963C]', title, subtitle }) => (
    <div className="text-center mb-10 sm:mb-14">
      <span className={`inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest ${badgeColor}`}>{badge}</span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{title}</h2>
      {subtitle && <p className="text-lg sm:text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="px-0 pb-0">

        {/* ══ 1. HERO SLIDER ══════════════════════════════════════════════════ */}
        <div className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
          {slides.map((s, idx) => (
            <img key={s.image} src={s.image}
              srcSet={heroSrcset(s._path)}
              sizes="100vw"
              alt={s.title}
              fetchPriority={idx === 0 ? 'high' : 'low'}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding={idx === 0 ? 'sync' : 'async'}
              className={`absolute inset-0 w-full h-full object-cover ${s.position || 'object-center'} transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          {/* Dark gradient overlay — stronger at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          {/* Hero content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 sm:px-10">
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest bg-[#F2FAE8]0/30 text-emerald-200 border border-emerald-400/40">
              Youth · Sustainability · Africa
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05] max-w-5xl">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 max-w-2xl font-light leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-gradient text-base sm:text-lg px-8 py-4 rounded-xl" onClick={() => navigate('/get-involved')}>
                Get Involved
              </button>
              <button
                className="border-2 border-white text-white hover:bg-white hover:text-[#1E963C] px-8 py-4 rounded-xl font-bold transition-all text-base sm:text-lg"
                onClick={() => navigate('/about')}>
                Learn More
              </button>
            </div>
          </div>

          {/* Slide dots */}
          <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="p-1.5">
                <span className={`block rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-8 h-2' : 'bg-white/40 w-2 h-2 hover:bg-white/70'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-12 sm:pt-16">

        {/* ══ 2. IMPACT STATS ═════════════════════════════════════════════════ */}
        <div className="bg-[#1E963C] rounded-2xl p-8 sm:p-12 mb-10 sm:mb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-center">
            {[
              { n: '230+', label: 'Webinar Registrants' },
              { n: '236', label: 'Youth Empowered' },
              { n: '72', label: 'Women Impacted' },
              { n: '3', label: 'Program Editions' }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{s.n}</div>
                <div className="text-sm sm:text-base text-white/70 font-light">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 3. ABOUT US SNAPSHOT ════════════════════════════════════════════ */}
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl order-2 lg:order-1 h-full">
              <img
                src={img('v1773615639/photo_2026-03-15_23-00-07_ggjpdz.jpg', 900)}
                srcSet={srcset('v1773615639/photo_2026-03-15_23-00-07_ggjpdz.jpg', [480, 768, 900])}
                sizes="(max-width: 1024px) 100vw, 50vw"
                alt="SWK Ghana team"
                className="w-full h-full min-h-[400px] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest bg-[#F2FAE8] text-[#1E963C]">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Building Africa's Next Generation of Changemakers
              </h2>
              <p className="text-lg text-gray-500 font-light leading-relaxed mb-4">
                SWK Ghana is a youth-focused nonprofit founded in Accra, Ghana. We empower young people aged 15–35 to lead sustainable change through programs in agribusiness, climate action, circular economy, technology, and community development.
              </p>
              <p className="text-lg text-gray-500 font-light leading-relaxed mb-8">
                Founded in 2024, our vision is a thriving Africa where empowered youth shape resilient communities and rewrite the future of the continent.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: 'Founded', value: '2024' },
                  { label: 'Based in', value: 'Accra, Ghana' },
                  { label: 'Target', value: 'Ages 15–35' },
                  { label: 'Vision', value: 'Pan-African' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F2FAE8] border border-[#D4F0A0] rounded-xl px-4 py-3 text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
                    <div className="text-sm font-bold text-[#1E963C]">{value}</div>
                  </div>
                ))}
              </div>
              <button className="btn-gradient text-base px-8 py-4" onClick={() => navigate('/about')}>
                Learn More About Us →
              </button>
            </div>
          </div>
        </Section>

        {/* ══ 4. FOCUS AREAS ══════════════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="What We Do" title="Our Focus Areas" subtitle="Six pillars driving sustainable youth development across Ghana and Africa." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6">
            {[
              { src: 'v1773615456/photo_2026-03-15_22-53-09_kvzvfr.jpg', title: 'Youth Development Programs', desc: 'Leadership workshops, skills training, and mentorship for youth change-makers.' },
              { src: 'v1773660247/photo_2026-03-16_11-22-33_gfsqwy.jpg', title: 'Circular Economy Initiatives', desc: 'Waste reduction, recycling workshops, and sustainable consumption education.' },
              { src: 'v1760551738/Blue_and_Yellow_Bold_Online_Course_Facebook_Post_1_ubqtmu.png', title: 'Agribusiness Development', desc: 'Training in sustainable agriculture and agribusiness value chains.' },
              { src: 'v1773660247/photo_2026-03-16_11-22-22_i0nolg.jpg', title: 'Technology & Innovation', desc: 'Digital literacy, hackathons, and innovation labs for sustainable solutions.' },
              { src: 'v1773660248/photo_2026-03-16_11-22-40_zbflj4.jpg', title: 'Climate Action Projects', desc: 'Conservation, climate education, and youth-led environmental initiatives.' },
              { src: 'v1773615455/photo_2026-03-15_22-53-49_d6sonh.jpg', title: 'Community Engagement', desc: 'Grassroots projects, forums, and participatory initiatives for resilience.' },
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

        {/* ══ 5. PROJECTS & IMPACT ════════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="Impact" badgeColor="bg-blue-100 text-blue-700" title="Our Projects & Impact" subtitle="From agribusiness webinars to climate action — here's what we've been building." />

          {/* Image projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 mb-8">
            {[
              {
                gradient: 'from-[#F2FAE8] to-green-50', border: 'border-[#D4F0A0]', badge: 'Impact', accent: 'bg-[#F2FAE8] text-[#1E963C]',
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
                  <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">{p.title}</h3>
                  <p className="text-xs xs:text-sm text-gray-600 leading-relaxed flex-1 mb-3">{p.desc}</p>
                  <span className="self-start text-xs font-semibold text-[#78C31E] bg-[#F2FAE8] border border-[#C0E870] px-3 py-1 rounded-full">{p.stat}</span>
                  {p.title === 'Agribusiness Webinar Series' && (
                    <a
                      href="https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu?mode=gi_t"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] px-3 py-2 rounded-lg transition-colors self-start"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                      Join our WhatsApp Community
                    </a>
                  )}
                </div>
              </div>
            ))}
            {/* Ambassador — dual image */}
            <div className="bg-gradient-to-br from-[#F2FAE8] to-blue-50 rounded-xl border border-[#D4F0A0] overflow-hidden hover:shadow-md transition-shadow flex flex-col">
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
                <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">Ambassador Recognition</h3>
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

        {/* ══ 6. WHAT WE'RE DOING ═════════════════════════════════════════════ */}
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
              <div key={idx} className="bg-gradient-to-br from-[#F2FAE8] to-green-50 rounded-xl p-5 border border-[#D4F0A0] hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.tc}`}>{a.tag}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2FAE8] text-[#1E963C]">● Ongoing</span>
                </div>
                <div className="text-3xl mb-3">{a.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-xs xs:text-sm text-gray-600 leading-relaxed flex-1">{a.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ══ 7. UPCOMING EVENTS ══════════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="Mark Your Calendar" badgeColor="bg-blue-100 text-blue-700" title="Upcoming Events" subtitle="Join us at our next events and be part of the movement for sustainable change." />
          <div className="space-y-4 xs:space-y-5 mb-8">
            {[
              { tag: 'Webinar', tc: 'bg-green-100 text-green-700', title: 'Agribusiness Webinar Series — Next Edition', desc: 'Join us for the next edition of our popular Agribusiness Webinar Series. Details coming soon!', location: 'Google Meet (Online)' },
              { tag: 'Workshop', tc: 'bg-yellow-100 text-yellow-700', title: 'Youth Leadership & Skills Training Workshop', desc: 'A hands-on workshop building leadership, entrepreneurship, and digital skills for young Ghanaians.', location: 'Accra, Ghana' },
              { tag: 'Community', tc: 'bg-purple-100 text-purple-700', title: 'Community Outreach & Engagement Day', desc: "An outreach day bringing SWK Ghana's programs directly to communities across Greater Accra.", location: 'Greater Accra, Ghana' },
            ].map((event, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 bg-gradient-to-r from-[#F2FAE8] to-blue-50 rounded-xl p-4 xs:p-5 sm:p-6 border border-[#D4F0A0] hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 flex sm:flex-col items-center justify-center bg-white rounded-xl border border-[#C0E870] px-5 py-3 text-center gap-2 sm:gap-0">
                  <span className="text-xl font-bold text-[#1E963C]">TBA</span>
                  <span className="text-xs font-medium text-gray-400 uppercase">Soon</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${event.tc}`}>{event.tag}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2FAE8] text-[#1E963C]">Free</span>
                  </div>
                  <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-3">{event.desc}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-gray-500">📍 {event.location}</span>
                    <span className="text-xs font-semibold text-[#78C31E] bg-[#F2FAE8] border border-[#C0E870] px-3 py-1.5 rounded-lg">Registration Opening Soon</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="btn-gradient text-sm xs:text-base px-6 xs:px-8 py-2.5 xs:py-3" onClick={() => navigate('/get-involved')}>
              Get Notified About Events
            </button>
            <a
              href="https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm xs:text-base font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] px-6 xs:px-8 py-2.5 xs:py-3 rounded-xl transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Join our WhatsApp Community
            </a>
          </div>
        </Section>

        {/* ══ 8. REPORTS & RESOURCES ══════════════════════════════════════════ */}
        <Section>
          <SectionHeader badge="Publications" title="Reports & Resources" subtitle="Access our latest impact reports, annual reviews, and research publications." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 mb-8">

            {/* Report 1 — Agribusiness Impact Report (cover = webinar flyer) */}
            <div className="bg-gradient-to-br from-[#F2FAE8] to-green-50 rounded-xl border border-[#D4F0A0] overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative">
                <img
                  src={img('v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png')}
                  srcSet={cardSrcset('v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png')}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt="Agribusiness Impact Report 2025" className="w-full h-48 object-cover" loading="lazy" decoding="async" />
                <span className="absolute top-3 left-3 bg-[#78C31E] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Latest Report</span>
              </div>
              <div className="p-4 xs:p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-[#78C31E] uppercase tracking-wide">Impact Report</span>
                <h3 className="text-base font-semibold text-gray-900 mt-1 mb-2">Agribusiness Webinar Series Impact Report 2025</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">Three editions. 230+ verified registrants. Full impact metrics, SDG alignment, and demographic insights.</p>
                <div className="flex gap-2">
                  <a href="https://drive.google.com/file/d/1Sl55CXUFD_OQY8GYmx9IeTaM0jOTr-Po/view?usp=sharing" target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold text-white bg-[#78C31E] hover:bg-[#1E963C] px-3 py-2 rounded-lg transition-colors">📄 View</a>
                  <a href="https://drive.google.com/uc?export=download&id=1Sl55CXUFD_OQY8GYmx9IeTaM0jOTr-Po" target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold text-[#78C31E] border border-[#78C31E] hover:bg-[#F2FAE8] px-3 py-2 rounded-lg transition-colors">⬇️ PDF</a>
                </div>
              </div>
            </div>

            {/* Report 2 — Annual Report (cover = SWK team photo) */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative">
                <img
                  src={img('v1773615456/photo_2026-03-15_22-53-24_iqemaf.jpg')}
                  srcSet={cardSrcset('v1773615456/photo_2026-03-15_22-53-24_iqemaf.jpg')}
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
                  <a href="https://drive.google.com/file/d/17wNhPEXy1_VCo8uDD1rWzwRqvm8bmQx4/view?usp=sharing" target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors">📄 View</a>
                  <a href="https://drive.google.com/uc?export=download&id=17wNhPEXy1_VCo8uDD1rWzwRqvm8bmQx4" target="_blank" rel="noopener noreferrer"
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

        {/* ══ 9. UN SDG ALIGNMENT (moved down) ═══════════════════════════════ */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div key={i} className={`flex items-center gap-3 rounded-xl border ${g.color} p-3`}>
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white shadow-inner border flex-shrink-0">
                    <span className="font-bold text-base">{g.n}</span>
                  </div>
                  <div className="font-medium text-sm leading-tight">{g.title}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══ 10. FAQs ═════════════════════════════════════════════════════════ */}
        <Section>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-6 xs:mb-8 text-center">FAQs</h2>
          <Faqs />
        </Section>

        {/* ══ 11. TESTIMONIALS ════════════════════════════════════════════════ */}
        <Section>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-6 xs:mb-8 text-center">What People Say</h2>
          <Testimonials />
        </Section>

        {/* ══ 12. PARTNERS ════════════════════════════════════════════════════ */}
        <Section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">Partners & Supporters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 items-center">
            {[
              { src: 'v1773661462/AEQUITAS-08-1536x361_pcxgvy.png', alt: 'Aequitas Foundation' },
              { src: 'v1773661462/1715875277298_tjdnsb.jpg', alt: 'Agribusiness e-Academy' },
              { src: 'v1773661461/cropped-tglc-logo-q1ubu2o8mbbpktpnzd608sx1q4jd6s8hmd4b4yek8w_vilk2e.png', alt: 'The GracedLife Leadership Centre' },
              { src: 'v1773661734/World-Inspiring-Network-Logo-1024x366_v8it3x.png', alt: 'World Inspiring Network' },
              { src: 'v1773661462/311331075_3157445151233536_1506695373056214199_n_lqwu03.jpg', alt: 'Charter House Ghana' },
            ].map(({ src, alt }) => (
              <div key={alt} className="flex items-center justify-center p-3">
                <img
                  src={img(src, 400)}
                  alt={alt}
                  className="max-h-20 w-auto object-contain opacity-90 hover:opacity-100 transition"
                  loading="lazy"
                  title={alt}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ══ 13. NEWSLETTER ══════════════════════════════════════════════════ */}
        <Section>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Newsletter</h2>
          <p className="text-sm xs:text-base text-gray-600 mb-6 text-center max-w-2xl mx-auto">Sign up to receive updates and news from SWK Ghana directly in your inbox.</p>
          {newsletterStatus === 'success' ? (
            <div className="text-center py-4">
              <span className="text-[#78C31E] font-semibold text-lg">🎉 You're subscribed! Welcome to the SWK Ghana community.</span>
            </div>
          ) : (
            <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78C31E] focus:border-emerald-500"
              />
              <button type="submit" disabled={newsletterStatus === 'sending'}
                className="btn-gradient px-6 py-3 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {newsletterStatus === 'sending' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-center text-sm text-red-500 mt-2">Something went wrong. Please try again.</p>
          )}
        </Section>

        {/* ══ 14. CTA ═════════════════════════════════════════════════════════ */}
        <div className="text-center py-10 sm:py-16 bg-[#1E963C] rounded-2xl mb-10 sm:mb-16 px-6 sm:px-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Join the Movement</h2>
          <p className="text-lg sm:text-xl text-white/70 font-light mb-10 max-w-2xl mx-auto">Together, we can empower young people, transform communities, and protect our planet.</p>
          <div className="flex flex-col gap-4 justify-center items-stretch max-w-xs mx-auto sm:max-w-none sm:flex-row sm:items-center">
            <button className="bg-white text-[#1E963C] font-bold text-base px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors w-full sm:w-auto" onClick={() => setIsVolunteerOpen(true)}>Volunteer Today</button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-[#1E963C] px-8 py-4 rounded-xl font-bold transition-colors text-base w-full sm:w-auto" onClick={() => setIsPartnerOpen(true)}>Partner With Us</button>
            <a
              href="https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-base font-bold text-white bg-[#25D366] hover:bg-[#1ebe5d] px-8 py-4 rounded-xl transition-colors w-full sm:w-auto"
            >
              <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Join our WhatsApp Community
            </a>
          </div>
        </div>

        </div>{/* end inner padding div */}

      </div>{/* end outer wrapper */}

      {/* VOLUNTEER MODAL */}
      {isVolunteerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsVolunteerOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Volunteer Sign-Up</h3>
              <button className="text-gray-400 hover:text-gray-600 text-xl" aria-label="Close volunteer form" onClick={() => { setIsVolunteerOpen(false); resetVolunteer() }}>✕</button>
            </div>
            {volunteerStatus === 'success' ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-14 h-14 bg-[#F2FAE8] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-[#78C31E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Application Received!</h4>
                <p className="text-sm text-gray-600 mb-5">Thank you, {volunteerFullName.split(' ')[0]}! We'll be in touch soon.</p>
                <button onClick={() => { setIsVolunteerOpen(false); resetVolunteer() }} className="btn-gradient px-6 py-2 text-sm">Close</button>
              </div>
            ) : (
            <form className="space-y-4" onSubmit={handleVolunteerSubmit}>
              <div>
                <label htmlFor="vol-name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input required id="vol-name" type="text" value={volunteerFullName} onChange={(e) => setVolunteerFullName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" placeholder="Your full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vol-age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input required id="vol-age" type="number" min={10} max={120} value={volunteerAge} onChange={(e) => setVolunteerAge(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" placeholder="e.g. 24" />
                </div>
                <div>
                  <label htmlFor="vol-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required id="vol-email" type="email" value={volunteerEmail} onChange={(e) => setVolunteerEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="vol-role" className="block text-sm font-medium text-gray-700 mb-1">Preferred volunteer role *</label>
                <select required id="vol-role" value={volunteerRole} onChange={(e) => setVolunteerRole(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] bg-white">
                  <option value="">— Select a role —</option>
                  <option>Media & Communications</option>
                  <option>Programs & Events</option>
                  <option>Agribusiness & Agriculture</option>
                  <option>Climate & Environment</option>
                  <option>Technology & Innovation</option>
                  <option>Community Outreach</option>
                  <option>Research & Documentation</option>
                  <option>Fundraising & Partnerships</option>
                  <option>Admin & Operations</option>
                  <option>Open to Any Role</option>
                </select>
              </div>
              <div>
                <label htmlFor="vol-hours" className="block text-sm font-medium text-gray-700 mb-1">Hours available per week *</label>
                <select required id="vol-hours" value={volunteerHours} onChange={(e) => setVolunteerHours(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E] bg-white">
                  <option value="">— Select hours —</option>
                  <option>1–3 hours</option>
                  <option>4–6 hours</option>
                  <option>7–10 hours</option>
                  <option>10+ hours</option>
                  <option>Flexible / Project-based</option>
                </select>
              </div>
              <div>
                <label htmlFor="vol-motivation" className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer? *</label>
                <textarea required id="vol-motivation" rows={3} value={volunteerMotivation} onChange={(e) => setVolunteerMotivation(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" placeholder="Tell us about your passion and what you'd like to contribute…" />
              </div>
              <div className="space-y-2">
                <div>
                  <label htmlFor="vol-file" className="block text-sm font-medium text-gray-700 mb-1">Upload CV / Resume <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input id="vol-file" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setVolunteerDocFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg bg-white text-sm" />
                  <p className="text-xs text-gray-400 mt-0.5">PDF or Word document</p>
                </div>
                <div>
                  <label htmlFor="vol-link" className="block text-sm font-medium text-gray-700 mb-1">Or paste a link <span className="text-gray-400 font-normal">(Google Drive, LinkedIn, etc.)</span></label>
                  <input id="vol-link" type="url" value={volunteerDocLink} onChange={(e) => setVolunteerDocLink(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" placeholder="https://drive.google.com/…" />
                </div>
              </div>
              {volunteerStatus === 'error' && (
                <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg border text-gray-700" onClick={() => { resetVolunteer(); setIsVolunteerOpen(false) }}>Cancel</button>
                <button type="submit" disabled={volunteerStatus === 'sending'} className="btn-gradient px-5 py-2 disabled:opacity-60">
                  {volunteerStatus === 'sending' ? 'Sending...' : 'Send Application'}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      {/* PARTNER MODAL */}
      {isPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setIsPartnerOpen(false); resetPartner() }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Partnership Inquiry</h3>
              <button className="text-gray-400 hover:text-gray-600 text-xl" aria-label="Close partnership form" onClick={() => { setIsPartnerOpen(false); resetPartner() }}>✕</button>
            </div>
            {partnerStatus === 'success' ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-14 h-14 bg-[#F2FAE8] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-[#78C31E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Inquiry Received!</h4>
                <p className="text-sm text-gray-600 mb-5">Thank you for your interest in partnering with SWK Ghana. We'll be in touch soon.</p>
                <button onClick={() => { setIsPartnerOpen(false); resetPartner() }} className="btn-gradient px-6 py-2 text-sm">Close</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handlePartnerSubmit}>
                <div>
                  <label htmlFor="partner-org" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input required id="partner-org" type="text" value={partnerOrg} onChange={(e) => setPartnerOrg(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="partner-name" className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input required id="partner-name" type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" />
                  </div>
                  <div>
                    <label htmlFor="partner-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required id="partner-email" type="email" value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" />
                  </div>
                </div>
                <div>
                  <label htmlFor="partner-message" className="block text-sm font-medium text-gray-700 mb-1">How would you like to partner?</label>
                  <textarea id="partner-message" rows={4} value={partnerMessage} onChange={(e) => setPartnerMessage(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#78C31E]" placeholder="Describe your partnership interest" />
                </div>
                {partnerStatus === 'error' && (
                  <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="px-4 py-2 rounded-lg border text-gray-700" onClick={() => { setIsPartnerOpen(false); resetPartner() }}>Cancel</button>
                  <button type="submit" disabled={partnerStatus === 'sending'} className="btn-gradient px-5 py-2 disabled:opacity-60">
                    {partnerStatus === 'sending' ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default Home