import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className={`text-center mb-12 xs:mb-16 sm:mb-18 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent px-2 xs:px-0">
              About SWK Ghana
            </h1>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 xs:mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed px-4 xs:px-6 sm:px-0">
              A youth-focused nonprofit organisation founded in Ghana, with a vision to scale across Africa. 
              We believe holistic youth development is the foundation for resilient communities.
            </p>
            <blockquote className="text-sm xs:text-base sm:text-lg md:text-xl italic text-gray-700 bg-white p-4 xs:p-6 sm:p-8 md:p-10 rounded-xl xs:rounded-2xl shadow-lg border-l-4 border-emerald-500 max-w-4xl mx-auto px-4 xs:px-6 sm:px-8 md:px-10">
              "The power of youth is the common wealth for the entire world. The faces of young people are the faces of our past, our present and our future. No segment in society can match with the power, idealism, enthusiasm and courage of the young people."
              <footer className="mt-3 xs:mt-4 sm:mt-5 text-xs xs:text-sm sm:text-base text-gray-600 font-semibold">— Kailash Satyarthi (Nobel Peace Prize laureate, 2014)</footer>
            </blockquote>
            <div className="mt-6 xs:mt-8 sm:mt-10 flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center px-4 xs:px-0">
              <button 
                onClick={() => navigate('/get-involved')}
                className="btn-gradient text-lg px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
              >
                Get Involved
              </button>
              <button 
                onClick={() => navigate('/our-work')}
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Our Programs
              </button>
            </div>
          </div>

          {/* Mission, Vision & Values - Side by Side */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10">
              {/* Mission */}
              <div className="text-center">
                <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-blue-100 rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6">
                  <svg className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">Our Mission</h2>
                <p className="text-sm xs:text-base text-gray-600 leading-relaxed">
                  To empower and mobilise young people as holistic changemakers: building leadership skills and opportunities to drive sustainability, community development, and systemic transformation by 2035.
                </p>
              </div>

              {/* Vision */}
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  A thriving Africa where empowered youth lead sustainable change, shaping resilient communities and rewriting the future of the continent.
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
                    { name: 'Integrity', icon: '✅' },
                    { name: 'Collaboration', icon: '🤝' },
                    { name: 'Innovation', icon: '💡' },
                    { name: 'Equity', icon: '⚖️' }
                  ].map((value, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span className="text-lg">{value.icon}</span>
                      <span>{value.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


          {/* Focus Areas with Interactive Cards */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-6 xs:mb-8 sm:mb-10 text-center px-2 xs:px-0">Our Focus Areas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-8">
              {[
                { 
                  title: 'Youth Development', 
                  icon: '👥', 
                  desc: 'Empowering young people with leadership, technical, and entrepreneurial skills',
                  color: 'from-emerald-500 to-green-500',
                  bgColor: 'bg-emerald-50'
                },
                { 
                  title: 'Circular Economy', 
                  icon: '♻️', 
                  desc: 'Promoting sustainable consumption and waste reduction practices',
                  color: 'from-green-500 to-teal-500',
                  bgColor: 'bg-green-50'
                },
                { 
                  title: 'Agribusiness', 
                  icon: '🌾', 
                  desc: 'Supporting sustainable agriculture and food security initiatives',
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'bg-blue-50'
                },
                { 
                  title: 'Technology', 
                  icon: '💻', 
                  desc: 'Leveraging digital tools for sustainable development and innovation',
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'bg-purple-50'
                },
                { 
                  title: 'Climate Action', 
                  icon: '🌍', 
                  desc: 'Addressing climate change through youth-led environmental initiatives',
                  color: 'from-orange-500 to-red-500',
                  bgColor: 'bg-orange-50'
                },
                { 
                  title: 'Community Engagement', 
                  icon: '🏘️', 
                  desc: 'Building resilient communities through grassroots participation',
                  color: 'from-emerald-500 to-green-500',
                  bgColor: 'bg-emerald-50'
                }
              ].map((area, idx) => (
                <div 
                  key={idx} 
                  className={`${area.bgColor} rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}
                  onClick={() => navigate('/our-work')}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${area.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{area.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">{area.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{area.desc}</p>
                  <div className="mt-4 flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Learn More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-lg">15-35</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Age Range</h3>
                    <p className="text-gray-600">Young people in Ghana, particularly those in underserved communities</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">We focus on:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Urban poor, rural, and peri-urban communities
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Young women and girls
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Persons living with disability
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Students and out-of-school youth
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 text-white">
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-4 xs:mb-5 sm:mb-6">Our Impact</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">80+</div>
                  <div className="text-emerald-100">Youth Empowered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">30</div>
                  <div className="text-emerald-100">Women Empowered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">0</div>
                  <div className="text-emerald-100">Trees Planted</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">0</div>
                  <div className="text-emerald-100">Green Jobs Created</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">0</div>
                  <div className="text-emerald-100">Tonnes Compost Produced</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">0</div>
                  <div className="text-emerald-100">Tonnes Plastics Processed</div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/our-work')}
                className="w-full mt-6 bg-white text-emerald-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                See Our Programs
              </button>
            </div>
          </div>

          {/* Our Approach */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">Our Approach</h2>
            <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-600 mb-8 xs:mb-10 sm:mb-12 text-center max-w-4xl mx-auto px-4 xs:px-6 sm:px-0">
              At SWK, we believe that true sustainability begins with empowered youth. Our approach is grounded in community-driven action, collaborative partnerships, and continuous learning.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10">
              {[
                {
                  step: '1',
                  title: 'Youth-Centred Engagement',
                  desc: 'We design programmes with and for young people, ensuring their voices shape the future they inherit.',
                  bgColor: 'bg-emerald-100',
                  stepColor: 'bg-emerald-600',
                  icon: '👥'
                },
                {
                  step: '2',
                  title: 'Community-Based Implementation',
                  desc: 'Our interventions begin at the grassroots, aligning with the needs and aspirations of local communities.',
                  bgColor: 'bg-blue-100',
                  stepColor: 'bg-blue-600',
                  icon: '🏘️'
                },
                {
                  step: '3',
                  title: 'Capacity Building',
                  desc: 'We emphasise skills development, knowledge sharing, and leadership training to build confident and competent change-makers.',
                  bgColor: 'bg-purple-100',
                  stepColor: 'bg-purple-600',
                  icon: '🎓'
                },
                {
                  step: '4',
                  title: 'Systems-Level Advocacy',
                  desc: 'By engaging with MMDAs and national institutions, we influence policy, amplify youth perspectives, and champion systemic change.',
                  bgColor: 'bg-orange-100',
                  stepColor: 'bg-orange-600',
                  icon: '📢'
                },
                {
                  step: '5',
                  title: 'Evidence-Based Impact',
                  desc: 'We evaluate our work rigorously and adapt based on data, stories, and community feedback.',
                  bgColor: 'bg-green-100',
                  stepColor: 'bg-green-600',
                  icon: '📊'
                }
              ].map((approach, idx) => (
                <div key={idx} className="text-center group">
                  <div className={`w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 ${approach.bgColor} rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl xs:text-3xl">{approach.icon}</span>
                  </div>
                  <div className={`w-10 h-10 xs:w-12 xs:h-12 ${approach.stepColor} text-white rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4 font-bold text-base xs:text-lg`}>
                    {approach.step}
                  </div>
                  <h3 className="text-lg xs:text-xl sm:text-xl font-bold text-gray-900 mb-3 xs:mb-4 group-hover:text-emerald-600 transition-colors duration-300">{approach.title}</h3>
                  <p className="text-sm xs:text-base text-gray-600 leading-relaxed">{approach.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl xs:rounded-2xl p-6 xs:p-8 sm:p-10 md:p-12 text-center text-white">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-3 xs:mb-4 sm:mb-5 px-2 xs:px-0">Ready to Make a Difference?</h2>
            <p className="text-base xs:text-lg sm:text-xl md:text-xl mb-6 xs:mb-8 sm:mb-10 max-w-2xl mx-auto px-4 xs:px-6 sm:px-0">
              Join us in empowering youth and building sustainable communities across Africa.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center px-4 xs:px-6 sm:px-0">
              <button 
                onClick={() => navigate('/get-involved')}
                className="bg-white text-emerald-600 font-semibold px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-lg xs:rounded-xl hover:bg-gray-100 transition-colors duration-200 hover:scale-105 transform text-sm xs:text-base sm:text-lg"
              >
                Get Involved Today
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="border-2 border-white text-white font-semibold px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-lg xs:rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-200 text-sm xs:text-base sm:text-lg"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
