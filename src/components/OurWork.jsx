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
