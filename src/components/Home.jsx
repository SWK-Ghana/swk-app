import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const [isPartnerOpen, setIsPartnerOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = useMemo(() => ([
    {
      image: 'https://res.cloudinary.com/dwgj3lovn/image/upload/v1760294683/SWK_at_Ga_West_n0c3fz.jpg',
      title: 'Empowering Youth for Sustainable Change',
      subtitle: 'Youth-focused programs driving resilient communities across Africa.'
    },
    {
      image: 'https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339245/Climate_Action_ffrdiu.png',
      title: 'Climate Action & Environmental Stewardship',
      subtitle: 'Youth-led initiatives protecting our planet for future generations.'
    },
    {
      image: 'https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339244/Technology_lwdqyb.png',
      title: 'Technology & Innovation',
      subtitle: 'Building digital skills and solutions for sustainable development.'
    }
  ]), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsVolunteerOpen(false)
        setIsPartnerOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => {
      clearInterval(id)
      window.removeEventListener('keydown', onKey)
    }
  }, [slides.length])
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Hero Section */}
      <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 xs:py-8 sm:py-10 md:py-12">
        <div className="relative mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20 rounded-xl xs:rounded-2xl overflow-hidden">
          {/* Slides */}
          {slides.map((s, idx) => (
            <img
              key={s.image}
              src={s.image}
              srcSet={`${s.image.replace('/upload/', '/upload/w_768/')} 768w, ${s.image.replace('/upload/', '/upload/w_1280/')} 1280w, ${s.image.replace('/upload/', '/upload/w_1920/')} 1920w`}
              sizes="100vw"
              alt={s.title}
              className={`h-[40vh] xs:h-[46vh] sm:h-[50vh] md:h-[56vh] lg:h-[60vh] xl:h-[64vh] 2xl:h-[70vh] w-full object-cover transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-black/40 xs:bg-black/50" />

          {/* Overlay content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 xs:px-6 sm:px-8 md:px-10 max-w-4xl xl:max-w-5xl">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 xs:mb-4 sm:mb-5 md:mb-6 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-emerald-50 mb-6 xs:mb-8 sm:mb-10 px-2 xs:px-0">
                {slides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 sm:gap-5 justify-center px-4 xs:px-0">
                <button
                  className="btn-gradient text-sm xs:text-base sm:text-lg px-6 xs:px-8 sm:px-10 py-2.5 xs:py-3 sm:py-3.5"
                  onClick={() => navigate('/get-involved')}
                >
                  Get Involved
                </button>
                <button
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-6 xs:px-8 sm:px-10 py-2.5 xs:py-3 sm:py-3.5 rounded-lg xs:rounded-xl font-semibold transition-colors text-sm xs:text-base sm:text-lg"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                role="tab"
                aria-selected={idx === currentSlide}
                className={`h-2.5 w-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${idx === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
            <div className="sr-only" aria-live="polite">Slide {currentSlide + 1} of {slides.length}</div>
          </div>
        </div>

        {/* UN SDG Alignment (moved up and redesigned) */}
        <section className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4 text-center px-2 xs:px-0">UN SDG Alignment</h2>
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-6 xs:mb-8 sm:mb-10 text-center max-w-3xl mx-auto px-4 xs:px-6 sm:px-0">SWK's mission and objectives align with key Sustainable Development Goals that guide our programs and impact.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 items-start">
              {/* Image */}
              <div className="order-2 lg:order-1">
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg"
                    srcSet="https://res.cloudinary.com/dwgj3lovn/image/upload/w_640/v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg 640w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_960/v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg 960w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_1280/v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg 1280w"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="SWK team highlighting UN SDG alignment"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
              {/* Goals */}
              <div className="order-1 lg:order-2">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-5">
                  {[
                    { n: '4', title: 'Quality Education', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { n: '8', title: 'Decent Work & Economic Growth', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                    { n: '10', title: 'Reduced Inequalities', color: 'bg-purple-50 text-purple-700 border-purple-100' },
                    { n: '11', title: 'Sustainable Cities & Communities', color: 'bg-green-50 text-green-700 border-green-100' },
                    { n: '12', title: 'Responsible Consumption & Production', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { n: '13', title: 'Climate Action', color: 'bg-green-50 text-green-700 border-green-100' },
                    { n: '15', title: 'Life on Land', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { n: '17', title: 'Partnerships for the Goals', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                  ].map((g, i) => (
                    <div key={i} className={`flex items-center gap-2 xs:gap-3 sm:gap-4 rounded-lg xs:rounded-xl border ${g.color} p-3 xs:p-4 sm:p-5`}>
                      <div className="flex items-center justify-center h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 rounded-lg bg-white shadow-inner border flex-shrink-0">
                        <span className="font-bold text-base xs:text-lg sm:text-xl">{g.n}</span>
                      </div>
                      <div className="font-medium text-xs xs:text-sm sm:text-base">{g.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Projects & Impact - Compact Version */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 xs:mb-8 sm:mb-10 text-center px-2 xs:px-0">Our Projects & Impact</h2>
          
          {/* Impact Statistics */}
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 xs:gap-4 sm:gap-5 text-center mb-6 xs:mb-8 sm:mb-10">
            <div className="bg-emerald-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-700 mb-1">236</div>
              <div className="text-xs xs:text-sm sm:text-base text-gray-600 leading-tight">Youth empowered</div>
            </div>
            <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-1">72</div>
              <div className="text-xs xs:text-sm sm:text-base text-gray-600 leading-tight">Women impacted</div>
            </div>
          </div>

          {/* Project Highlights - Compact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
            {/* Agribusiness Webinar */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="mb-3 xs:mb-4">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png"
                  alt="Agribusiness Webinar"
                  className="w-full rounded-lg shadow-sm"
                  loading="lazy"
                />
              </div>
              <h4 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 mb-2">Agribusiness Webinar</h4>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
                Comprehensive webinar series on agriculture as a business for youth empowerment.
              </p>
            </div>

            {/* Agribusiness e-Academy */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760551738/Blue_and_Yellow_Bold_Online_Course_Facebook_Post_1_ubqtmu.png"
                  alt="Agribusiness e-Academy"
                  className="w-full rounded-lg shadow-sm"
                  loading="lazy"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">e-Academy Courses</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Online learning platform for agribusiness and sustainable farming practices.
              </p>
            </div>

            {/* Ambassador Recognition */}
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-5 border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="mb-3 grid grid-cols-2 gap-2">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760551738/1752658915453_atc9oo.jpg"
                  alt="Founder Ambassador"
                  className="w-full rounded-lg shadow-sm"
                  loading="lazy"
                />
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760551737/1752658914512_k1zf9t.jpg"
                  alt="Agribusiness Lead Ambassador"
                  className="w-full rounded-lg shadow-sm"
                  loading="lazy"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Ambassador Recognition</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our leadership team selected as ambassadors for Agribusiness e-Academy.
              </p>
            </div>

            {/* Taka Kipawa App */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/video/upload/v1760552758/Taka_Kipawa_2_wdxkpo.jpg"
                  alt="Taka Kipawa App video thumbnail"
                  className="w-full rounded-lg shadow-sm object-cover mb-3"
                  loading="lazy"
                />
                <video
                  controls
                  className="w-full rounded-lg shadow-sm"
                >
                  <source src="https://res.cloudinary.com/dwgj3lovn/video/upload/v1760552758/Taka_Kipawa_2_wdxkpo.mp4" type="video/mp4" />
                </video>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Taka Kipawa App</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Digital solutions for waste management and circular economy initiatives.
              </p>
            </div>

            {/* Circular Economy Innovation */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/video/upload/v1760551740/1711018812883_mbddbv.jpg"
                  alt="Circular Economy Innovation video thumbnail"
                  className="w-full rounded-lg shadow-sm object-cover mb-3"
                  loading="lazy"
                />
                <video
                  controls
                  className="w-full rounded-lg shadow-sm"
                >
                  <source src="https://res.cloudinary.com/dwgj3lovn/video/upload/v1760551740/1711018812883_mbddbv.mp4" type="video/mp4" />
                </video>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Circular Economy Innovation</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Youth-led solutions for sustainable consumption and waste reduction.
              </p>
            </div>

            {/* Climate Action */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/video/upload/v1760552757/Galamsey_1_iyyc25.jpg"
                  alt="Climate Action video thumbnail"
                  className="w-full rounded-lg shadow-sm object-cover mb-3"
                  loading="lazy"
                />
                <video
                  controls
                  className="w-full rounded-lg shadow-sm"
                >
                  <source src="https://res.cloudinary.com/dwgj3lovn/video/upload/v1760552757/Galamsey_1_iyyc25.mp4" type="video/mp4" />
                </video>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Climate Action</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Children advocating for environmental protection and climate action.
              </p>
            </div>

            {/* Fight Against Galamsey */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/video/upload/v1760554407/1727031150424_dx6ece.jpg"
                  alt="Fight Against Galamsey video thumbnail"
                  className="w-full rounded-lg shadow-sm object-cover mb-3"
                  loading="lazy"
                />
                <video
                  controls
                  className="w-full rounded-lg shadow-sm"
                >
                  <source src="https://res.cloudinary.com/dwgj3lovn/video/upload/v1760554407/1727031150424_dx6ece.mp4" type="video/mp4" />
                </video>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Fight Against Galamsey</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Children adding their voices to combat illegal mining and protect Ghana's natural resources.
              </p>
            </div>
          </div>
        </div>

        {/* Our Focus Areas (using Programs & Initiatives with images) */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 xs:mb-8 sm:mb-10 text-center px-2 xs:px-0">Our Focus Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-7 md:gap-8">
            <div className="bg-white rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-3 xs:mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339246/Youth_Development_j10oja.png"
                  srcSet="https://res.cloudinary.com/dwgj3lovn/image/upload/w_640/v1760339246/Youth_Development_j10oja.png 640w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_960/v1760339246/Youth_Development_j10oja.png 960w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_1280/v1760339246/Youth_Development_j10oja.png 1280w"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt="Youth Development Programs"
                  className="w-full h-32 xs:h-36 sm:h-40 md:h-44 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg xs:text-xl sm:text-xl font-semibold text-gray-900 mb-2">Youth Development Programs</h3>
              <p className="text-sm xs:text-base text-gray-600 leading-relaxed">Leadership workshops, skills training, and mentorship for youth change-makers.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339246/Circular_Economy_v3oo71.png"
                  srcSet="https://res.cloudinary.com/dwgj3lovn/image/upload/w_640/v1760339246/Circular_Economy_v3oo71.png 640w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_960/v1760339246/Circular_Economy_v3oo71.png 960w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_1280/v1760339246/Circular_Economy_v3oo71.png 1280w"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt="Circular Economy Initiatives"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Circular Economy Initiatives</h3>
              <p className="text-gray-600">Waste reduction, recycling workshops, and sustainable consumption education.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339247/Agribusiness_yqc44a.png"
                  srcSet="https://res.cloudinary.com/dwgj3lovn/image/upload/w_640/v1760339247/Agribusiness_yqc44a.png 640w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_960/v1760339247/Agribusiness_yqc44a.png 960w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_1280/v1760339247/Agribusiness_yqc44a.png 1280w"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt="Agribusiness Development"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Agribusiness Development</h3>
              <p className="text-gray-600">Training in sustainable agriculture and agribusiness value chains.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339244/Technology_lwdqyb.png"
                  srcSet="https://res.cloudinary.com/dwgj3lovn/image/upload/w_640/v1760339244/Technology_lwdqyb.png 640w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_960/v1760339244/Technology_lwdqyb.png 960w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_1280/v1760339244/Technology_lwdqyb.png 1280w"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt="Technology & Innovation"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Technology & Innovation</h3>
              <p className="text-gray-600">Digital literacy, hackathons, and innovation labs for sustainable solutions.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339245/Climate_Action_ffrdiu.png"
                  srcSet="https://res.cloudinary.com/dwgj3lovn/image/upload/w_640/v1760339245/Climate_Action_ffrdiu.png 640w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_960/v1760339245/Climate_Action_ffrdiu.png 960w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_1280/v1760339245/Climate_Action_ffrdiu.png 1280w"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt="Climate Action Projects"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Climate Action Projects</h3>
              <p className="text-gray-600">Conservation, climate education, and youth-led environmental initiatives.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339244/Community_Engagement_jnun1t.png"
                  srcSet="https://res.cloudinary.com/dwgj3lovn/image/upload/w_640/v1760339244/Community_Engagement_jnun1t.png 640w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_960/v1760339244/Community_Engagement_jnun1t.png 960w, https://res.cloudinary.com/dwgj3lovn/image/upload/w_1280/v1760339244/Community_Engagement_jnun1t.png 1280w"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt="Community Engagement"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Engagement</h3>
              <p className="text-gray-600">Grassroots projects, forums, and participatory initiatives for resilience.</p>
            </div>
          </div>
        </div>


        {/* FAQs */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 xs:mb-8 sm:mb-10 text-center px-2 xs:px-0">FAQs</h2>
          <Faqs />
        </div>

        

        {/* Testimonials carousel (simple) */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-6 sm:mb-8 text-center px-2 xs:px-0">What People Say</h2>
          <Testimonials />
        </div>

        {/* Partners strip (moved to last section before footer) */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-6 sm:mb-8 text-center px-2 xs:px-0">Partners & Supporters</h2>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 xs:gap-5 sm:gap-6 md:gap-8 items-center">
            {[
              'https://dummyimage.com/200x80/edf2f7/a0aec0&text=Partner+1',
              'https://dummyimage.com/200x80/edf2f7/a0aec0&text=Partner+2',
              'https://dummyimage.com/200x80/edf2f7/a0aec0&text=Partner+3',
              'https://dummyimage.com/200x80/edf2f7/a0aec0&text=Partner+4',
              'https://dummyimage.com/200x80/edf2f7/a0aec0&text=Partner+5',
            ].map((logo, idx) => (
              <img key={idx} src={logo} alt={`Partner ${idx + 1}`} className="mx-auto h-10 object-contain opacity-80 hover:opacity-100 transition" loading="lazy" />
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 xs:mb-4 sm:mb-5 text-center px-2 xs:px-0">Newsletter</h2>
          <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-4 xs:mb-6 sm:mb-8 text-center max-w-2xl mx-auto px-4 xs:px-6 sm:px-0">Sign up for updates to receive news delivered directly to your inbox.</p>
          <form
            className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 xs:gap-4 px-4 xs:px-6 sm:px-0"
            onSubmit={(e) => { e.preventDefault() }}
          >
            <input
              type="email"
              required
              placeholder="your.email@example.com"
              className="flex-1 px-3 xs:px-4 sm:px-5 py-2.5 xs:py-3 sm:py-3.5 text-sm xs:text-base border border-gray-300 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button type="submit" className="btn-gradient px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-3.5 rounded-lg xs:rounded-xl text-sm xs:text-base">Subscribe</button>
          </form>
        </div>

        {/* Call to Action */}
        <div className="text-center px-4 xs:px-6 sm:px-0">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 xs:mb-4 sm:mb-5">Join the Movement</h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 mb-6 xs:mb-8 sm:mb-10 max-w-2xl mx-auto">
            Together, we can empower young people, transform communities, and protect our planet.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 sm:gap-5 justify-center">
            <button
              className="btn-gradient text-sm xs:text-base sm:text-lg px-6 xs:px-8 sm:px-10 py-2.5 xs:py-3 sm:py-3.5"
              onClick={() => setIsVolunteerOpen(true)}
            >
              Volunteer Today
            </button>
            <button
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-6 xs:px-8 sm:px-10 py-2.5 xs:py-3 sm:py-3.5 rounded-lg xs:rounded-xl font-semibold transition-colors text-sm xs:text-base sm:text-lg"
              onClick={() => setIsPartnerOpen(true)}
            >
              Partner With Us
            </button>
          </div>
        </div>
      </div>

      {/* Volunteer Modal */}
      {isVolunteerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsVolunteerOpen(false)} />
          <div className="relative bg-white rounded-xl xs:rounded-2xl shadow-xl w-full max-w-xl mx-auto p-4 xs:p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto" tabIndex={-1}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Volunteer Sign-Up</h3>
              <button
                aria-label="Close"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsVolunteerOpen(false)}
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Weekdays</option>
                  <option>Weekends</option>
                  <option>Evenings</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                <textarea rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Tell us how you'd like to help" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setIsVolunteerOpen(false)}>Cancel</button>
                <button type="submit" className="btn-gradient px-5 py-2">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      {isPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsPartnerOpen(false)} />
          <div className="relative bg-white rounded-xl xs:rounded-2xl shadow-xl w-full max-w-xl mx-auto p-4 xs:p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto" tabIndex={-1}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Partnership Inquiry</h3>
              <button
                aria-label="Close"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsPartnerOpen(false)}
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How would you like to partner?</label>
                <textarea rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Describe partnership interest" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setIsPartnerOpen(false)}>Cancel</button>
                <button type="submit" className="btn-gradient px-5 py-2">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const Faqs = () => {
  const [open, setOpen] = useState(null)
  const toggle = (idx) => setOpen((v) => (v === idx ? null : idx))
  const items = [
    {
      q: 'What is the difference between weather and climate?',
      a: 'Weather is short-term atmospheric conditions; climate is long-term average patterns.'
    },
    {
      q: 'What is climate change?',
      a: 'A long-term change in average temperature and weather patterns, largely driven by human activities.'
    },
    {
      q: 'How does climate change affect health?',
      a: 'It increases respiratory and cardiovascular risks, extreme weather injuries, disease spread, and mental health stressors.'
    },
    {
      q: 'How can climate risks be reduced?',
      a: 'Through mitigation, adaptation, knowledge expansion, and responsible innovation.'
    }
  ]
  return (
    <div className="max-w-3xl mx-auto divide-y divide-gray-200 px-2 xs:px-4 sm:px-0">
      {items.map((item, idx) => (
        <div key={idx} className="py-3 xs:py-4 sm:py-5">
          <button
            className="w-full text-left flex items-center justify-between gap-3 xs:gap-4"
            onClick={() => toggle(idx)}
            aria-expanded={open === idx}
          >
            <span className="font-semibold text-sm xs:text-base sm:text-lg text-gray-900 pr-2">{item.q}</span>
            <span className="text-gray-500 text-lg xs:text-xl sm:text-2xl flex-shrink-0">{open === idx ? '−' : '+'}</span>
          </button>
          {open === idx && (
            <p className="mt-2 xs:mt-3 text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default Home

const Testimonials = () => {
  const items = [
    {
      name: 'Alex Johnson',
      text: 'Volunteering with SWK has been incredibly rewarding. The impact is real.'
    },
    {
      name: 'Maria Rodriguez',
      text: 'The programs helped me grow personally and professionally.'
    },
    {
      name: 'Kofi Mensah',
      text: 'Community projects brought people together and created opportunities.'
    }
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % items.length), 7000)
    return () => clearInterval(id)
  }, [items.length])
  const item = items[idx]
  return (
    <div className="max-w-3xl mx-auto text-center px-4 xs:px-6 sm:px-0">
      <blockquote className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-700 bg-emerald-50/60 border border-emerald-100 rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 md:p-8 mb-3 xs:mb-4 sm:mb-5">"{item.text}"</blockquote>
      <div className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900">— {item.name}</div>
      <div className="mt-3 xs:mt-4 sm:mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonials">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to testimonial ${i + 1}`}
            role="tab"
            aria-selected={i === idx}
            className={`h-2.5 w-2.5 rounded-full ${i === idx ? 'bg-emerald-600' : 'bg-emerald-200 hover:bg-emerald-300'} focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}
