import React from 'react'
import { useNavigate } from 'react-router-dom'
import Seo from './Seo'
import PageHero from './PageHero'
import { FlowBackdrop } from './Patterns'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="About SWK Ghana – Our Mission, Vision & Youth Programs"
        description="Learn about SWK Ghana, a youth-focused nonprofit founded in Accra empowering young people aged 15–35 to lead sustainable change across Africa through climate action, agribusiness, and community development."
        path="/about"
      />
      <PageHero
        title="About SWK Ghana"
        hideTitle
        layout="cover"
        image={{ path: 'v1773615639/photo_2026-03-15_23-00-07_ggjpdz.jpg', alt: 'The SWK Ghana team', position: '50% 38%' }}
        lede={
          <>
            <p className="text-2xl font-semibold leading-snug text-white sm:text-3xl lg:text-[2.5rem] lg:leading-tight">
              A youth-focused nonprofit organisation founded in Ghana, with a vision to scale across Africa.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              We believe holistic youth development is the foundation for resilient communities.
            </p>
          </>
        }
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate('/get-involved')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#78C31E] px-6 py-3.5 text-sm font-bold text-[#0C2E11] transition-colors hover:bg-[#8AD62B] sm:text-base"
          >
            Get Involved
          </button>
          <button
            onClick={() => navigate('/our-work')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:text-base"
          >
            Our Programs
          </button>
        </div>
      </PageHero>

      <div className="swk-weave">
      <div className="swk-shell py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div>
          <blockquote className="text-sm xs:text-base sm:text-lg md:text-xl italic text-gray-700 bg-white p-4 xs:p-6 sm:p-8 md:p-10 rounded-xl xs:rounded-2xl shadow-lg border-l-4 border-[#78C31E] max-w-4xl mx-auto mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            "The power of youth is the common wealth for the entire world. The faces of young people are the faces of our past, our present and our future. No segment in society can match with the power, idealism, enthusiasm and courage of the young people."
            <footer className="mt-3 xs:mt-4 sm:mt-5 text-xs xs:text-sm sm:text-base text-gray-800 font-semibold not-italic">— Kailash Satyarthi (Nobel Peace Prize laureate, 2014)</footer>
          </blockquote>

          {/* Mission, Vision & Values */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10">

              {/* Vision — FIRST */}
              <div className="text-center">
                <div className="w-20 h-20 bg-[#F2FAE8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#78C31E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-800 leading-relaxed">
                  A thriving Africa where empowered youth lead sustainable change, shaping resilient communities and rewriting the future of the continent.
                </p>
              </div>

              {/* Mission — SECOND */}
              <div className="text-center">
                <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-blue-100 rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6">
                  <svg className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">Our Mission</h2>
                <p className="text-sm xs:text-base text-gray-800 leading-relaxed">
                  To empower and mobilise young people as holistic changemakers: building leadership skills and opportunities to drive sustainability, community development, and systemic transformation by 2035.
                </p>
              </div>

              {/* Values */}
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Youth Leadership', icon: '👥' },
                    { name: 'Sustainability', icon: '🌱' },
                    { name: 'Innovation', icon: '💡' },
                    { name: 'Collaboration', icon: '🤝' },
                    { name: 'Equity', icon: '⚖️' },
                    { name: 'Integrity', icon: '✅' }
                  ].map((value, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-sm text-gray-800">
                      <span className="text-lg">{value.icon}</span>
                      <span>{value.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-6 xs:mb-8 sm:mb-10 text-center px-2 xs:px-0">Our Focus Areas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-8">
              {[
                { img: 'v1773615456/photo_2026-03-15_22-53-09_kvzvfr.jpg', title: 'Youth Development', desc: 'Empowering young people with leadership, technical, and entrepreneurial skills.' },
                { img: 'v1773660247/photo_2026-03-16_11-22-33_gfsqwy.jpg', title: 'Circular Economy', desc: 'Promoting sustainable consumption and waste reduction practices.' },
                { img: 'v1760551738/Blue_and_Yellow_Bold_Online_Course_Facebook_Post_1_ubqtmu.png', title: 'Agribusiness', desc: 'Supporting sustainable agriculture and food security initiatives.' },
                { img: 'v1773660247/photo_2026-03-16_11-22-22_i0nolg.jpg', title: 'Technology & Innovation', desc: 'Leveraging digital tools for sustainable development and innovation.' },
                { img: 'v1773660248/photo_2026-03-16_11-22-40_zbflj4.jpg', title: 'Climate Action', desc: 'Addressing climate change through youth-led environmental initiatives.' },
                { img: 'v1773615455/photo_2026-03-15_22-53-49_d6sonh.jpg', title: 'Community Engagement', desc: 'Building resilient communities through grassroots participation.' },
              ].map((area, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group" onClick={() => navigate('/our-work')}>
                  <img
                    src={`https://res.cloudinary.com/dwgj3lovn/image/upload/f_auto,q_auto,w_600/${area.img}`}
                    alt={area.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#78C31E] transition-colors duration-300">{area.title}</h3>
                    <p className="text-gray-800 leading-relaxed text-sm">{area.desc}</p>
                    <div className="mt-4 flex items-center text-[#78C31E] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Learn More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Group & Impact Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            {/* Target Group */}
            <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-lg border border-gray-200">
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6">Our Target Group</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  {/* Fixed: wider box, no overflow */}
                  <div className="flex-shrink-0 w-16 h-16 bg-[#F2FAE8] rounded-xl flex items-center justify-center">
                    <span className="text-[#78C31E] font-bold text-sm leading-tight text-center">15–35</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Age Range</h3>
                    <p className="text-gray-800">Young people in Ghana, particularly those in underserved communities</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">We focus on:</h4>
                  <ul className="space-y-2 text-gray-800">
                    {[
                      'Urban poor, rural, and peri-urban communities',
                      'Young women and girls',
                      'Persons living with disability',
                      'Students and out-of-school youth',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#78C31E] rounded-full flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="relative isolate overflow-hidden rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 text-white">
              <FlowBackdrop veil="swk-veil-green" />
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-4 xs:mb-5 sm:mb-6 text-white">Our Impact</h2>
              <div className="grid grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">236</div>
                  <div className="text-white/80">Youth empowered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">72</div>
                  <div className="text-white/80">Women impacted</div>
                </div>
              </div>
              <button onClick={() => navigate('/our-work')} className="w-full mt-6 bg-white text-[#17702D] font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                See Our Programs
              </button>
            </div>
          </div>

          {/* Our Approach */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">Our Approach</h2>
            <p className="text-base xs:text-lg sm:text-xl text-gray-800 mb-8 xs:mb-10 sm:mb-12 text-center max-w-4xl mx-auto px-4 xs:px-6 sm:px-0">
              At SWK, we believe that true sustainability begins with empowered youth. Our approach is grounded in community-driven action, collaborative partnerships, and continuous learning.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10">
              {[
                { step: '1', title: 'Youth-Centred Engagement', desc: 'We design programmes with and for young people, ensuring their voices shape the future they inherit.', bgColor: 'bg-[#F2FAE8]', stepColor: 'bg-[#78C31E]', icon: '👥' },
                { step: '2', title: 'Community-Based Implementation', desc: 'Our interventions begin at the grassroots, aligning with the needs and aspirations of local communities.', bgColor: 'bg-blue-100', stepColor: 'bg-blue-600', icon: '🏘️' },
                { step: '3', title: 'Capacity Building', desc: 'We emphasise skills development, knowledge sharing, and leadership training to build confident and competent change-makers.', bgColor: 'bg-purple-100', stepColor: 'bg-purple-600', icon: '🎓' },
                { step: '4', title: 'Systems-Level Advocacy', desc: 'By engaging with MMDAs and national institutions, we influence policy, amplify youth perspectives, and champion systemic change.', bgColor: 'bg-orange-100', stepColor: 'bg-orange-600', icon: '📢' },
                { step: '5', title: 'Evidence-Based Impact', desc: 'We evaluate our work rigorously and adapt based on data, stories, and community feedback.', bgColor: 'bg-green-100', stepColor: 'bg-green-600', icon: '📊' },
              ].map((approach, idx) => (
                <div key={idx} className="text-center group">
                  <div className={`w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 ${approach.bgColor} rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl xs:text-3xl">{approach.icon}</span>
                  </div>
                  <div className={`w-10 h-10 xs:w-12 xs:h-12 ${approach.stepColor} text-white rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4 font-bold text-base xs:text-lg`}>
                    {approach.step}
                  </div>
                  <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-3 xs:mb-4 group-hover:text-[#78C31E] transition-colors duration-300">{approach.title}</h3>
                  <p className="text-sm xs:text-base text-gray-800 leading-relaxed">{approach.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal & Registration */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">Legal Status &amp; Registration</h2>
            <p className="text-base xs:text-lg text-gray-800 max-w-3xl mx-auto text-center leading-relaxed">
              SWK Ghana is legally registered as <strong>SWK Ghana LBG</strong>, a Private Company Limited by Guarantee incorporated in Ghana under the Companies Act, 2019 (Act 992).
              <br className="hidden sm:block" />
              Registration No. <strong>CG024110426</strong> · TIN <strong>C0067142656</strong> · Office of the Registrar of Companies, Ghana.
            </p>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto text-center mt-4">
              <strong>swkghana.org</strong> is the official and primary website of SWK Ghana LBG. All programmes, donations, and correspondence referenced on this site are conducted on behalf of SWK Ghana LBG.
            </p>
          </div>

          {/* Call to Action */}
          <div className="relative isolate overflow-hidden rounded-xl xs:rounded-2xl p-6 xs:p-8 sm:p-10 md:p-12 text-center text-white">
            <FlowBackdrop veil="swk-veil-green" />
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-3 xs:mb-4 sm:mb-5 px-2 xs:px-0 text-white">Ready to Make a Difference?</h2>
            <p className="text-base xs:text-lg sm:text-xl mb-6 xs:mb-8 sm:mb-10 max-w-2xl mx-auto px-4 xs:px-6 sm:px-0 text-white/90">
              Join us in empowering youth and building sustainable communities across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center px-4 xs:px-6 sm:px-0">
              <button onClick={() => navigate('/get-involved')} className="bg-white text-[#17702D] font-semibold px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-lg xs:rounded-xl hover:bg-gray-100 transition-colors duration-200 hover:scale-105 transform text-sm xs:text-base sm:text-lg">
                Get Involved Today
              </button>
              <button onClick={() => navigate('/contact')} className="border-2 border-white text-white font-semibold px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-lg xs:rounded-xl hover:bg-white hover:text-[#17702D] transition-all duration-200 text-sm xs:text-base sm:text-lg">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default About