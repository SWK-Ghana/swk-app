import React from 'react'

const OurWork = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">
            Our Programs & Initiatives
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-600 mb-8 xs:mb-10 sm:mb-12 text-center max-w-3xl mx-auto px-4 xs:px-6 sm:px-0">
            At the heart of SWK's work are our dynamic programs that empower youth and promote sustainability. These initiatives are designed to be participatory, inclusive, and impactful.
          </p>
          
          {/* Our Projects & Impact (aligned with Home) */}
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

            {/* Project Highlights - Compact Grid (same cards as Home for consistency) */}
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

          {/* Programs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-7 md:gap-8">
            {/* Youth Development */}
            <div className="bg-white rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform">
              <div className="mb-3 xs:mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339246/Youth_Development_j10oja.png"
                  alt="Youth Development Programs"
                  className="w-full h-32 xs:h-36 sm:h-40 md:h-44 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg xs:text-xl sm:text-xl font-semibold text-gray-900 mb-2">Youth Development Programs</h3>
              <p className="text-sm xs:text-base text-gray-600 mb-4 leading-relaxed">
                Leadership workshops, skills training, and mentorship programs that equip young people with the tools to become effective change-makers in their communities.
              </p>
              <button className="btn-gradient">
                Learn More
              </button>
            </div>

            {/* Circular Economy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339246/Circular_Economy_v3oo71.png"
                  alt="Circular Economy Initiatives"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Circular Economy Initiatives</h3>
              <p className="text-gray-600 mb-4">
                Waste reduction programs, recycling workshops, and sustainable consumption education that promote circular economy principles among youth and communities.
              </p>
              <button className="btn-gradient">
                Learn More
              </button>
            </div>

            {/* Agribusiness */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339247/Agribusiness_yqc44a.png"
                  alt="Agribusiness Development"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Agribusiness Development</h3>
              <p className="text-gray-600 mb-4">
                Training in sustainable agriculture, agribusiness skills, and value chain development to create economic opportunities for young people in the agricultural sector.
              </p>
              <button className="btn-gradient">
                Learn More
              </button>
            </div>

            {/* Technology */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339244/Technology_lwdqyb.png"
                  alt="Technology & Innovation"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Technology & Innovation</h3>
              <p className="text-gray-600 mb-4">
                Digital literacy programs, tech hackathons, and innovation labs that leverage technology for sustainable development and youth empowerment.
              </p>
              <button className="btn-gradient">
                Learn More
              </button>
            </div>

            {/* Climate Action */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339245/Climate_Action_ffrdiu.png"
                  alt="Climate Action Projects"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Climate Action Projects</h3>
              <p className="text-gray-600 mb-4">
                Environmental conservation programs, climate education, and youth-led initiatives that address climate change and promote environmental stewardship.
              </p>
              <button className="btn-gradient">
                Learn More
              </button>
            </div>

            {/* Community Engagement */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src="https://res.cloudinary.com/dwgj3lovn/image/upload/v1760339244/Community_Engagement_jnun1t.png"
                  alt="Community Engagement"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Engagement</h3>
              <p className="text-gray-600 mb-4">
                Grassroots community projects, town hall forums, and participatory initiatives that build resilient communities and promote active citizenship.
              </p>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 hover:brightness-105">
                Learn More
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 xs:mt-14 sm:mt-16 text-center px-4 xs:px-6 sm:px-0">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-gray-900 mb-3 xs:mb-4">Want to Get Involved?</h2>
            <p className="text-base xs:text-lg sm:text-lg text-gray-600 mb-6 xs:mb-8">
              Join us in making a difference in our community.
            </p>
            <button className="btn-gradient text-lg px-8 py-3">
              Get Involved
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurWork
