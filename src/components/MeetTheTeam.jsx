import React from 'react'

const teamMembers = [
  { 
    name: 'Frank Koomson', 
    role: 'Founder', 
    initials: 'FK',
    photo: 'https://res.cloudinary.com/dwgj3lovn/image/upload/c_fill,g_face,w_400,h_400/v1760618900/Gemini_Generated_Image_kon0jtkon0jtkon0_2_wreiep.png',
    imagePosition: 'object-center',
    social: {
      linkedin: 'https://linkedin.com/in/frank-koomson',
      twitter: 'https://twitter.com/frankkoomson',
      email: 'mailto:frank@swkghana.org'
    }
  },
  { 
    name: 'Ben Brown', 
    role: 'Co-Founder', 
    initials: 'BB',
    photo: 'https://res.cloudinary.com/dwgj3lovn/image/upload/c_fill,g_face,w_400,h_400/v1760618901/WhatsApp_Image_2025-09-20_at_08.56.03_23333094_xrg9kn.jpg',
    imagePosition: 'object-center',
    social: {
      linkedin: 'https://linkedin.com/in/ben-brown',
      twitter: 'https://twitter.com/benbrown',
      email: 'mailto:ben@swkghana.org'
    }
  },
  { 
    name: 'Doreen Lawuratu Baidoo', 
    role: 'Administrative Manager', 
    initials: 'DLB',
    photo: 'https://res.cloudinary.com/dwgj3lovn/image/upload/c_fill,g_face,w_500,h_500,f_auto,q_auto/v1762719821/Gemini_Generated_Image_xp3ul4xp3ul4xp3u_et6wsu.png',
    imagePosition: 'object-center',
    social: {
      linkedin: 'https://linkedin.com/in/doreen-baidoo',
      twitter: 'https://twitter.com/doreenbaidoo',
      email: 'mailto:doreen@swkghana.org'
    }
  },
  { 
    name: 'Ernestina Gyamfi', 
    role: 'Programs and Agribusiness Lead', 
    initials: 'EG',
    photo: 'https://res.cloudinary.com/dwgj3lovn/image/upload/c_fill,g_face,w_400,h_400/v1760619065/WhatsApp_Image_2025-08-26_at_10.52.02_3ec2d7b6_uhih1r.jpg',
    imagePosition: 'object-center',
    social: {
      linkedin: 'https://linkedin.com/in/ernestina-gyamfi',
      twitter: 'https://twitter.com/ernestinagyamfi',
      email: 'mailto:ernestina@swkghana.org'
    }
  },
  { 
    name: 'Jessica Awurabena Asamoah', 
    role: 'Communication and Media Lead', 
    initials: 'JAA',
    photo: 'https://res.cloudinary.com/dwgj3lovn/image/upload/c_fill,g_face,w_400,h_400/v1762633599/WhatsApp_Image_2025-10-25_at_13.36.50_981a330d_fwjdgb.jpg',
    imagePosition: 'object-center',
    social: {
      linkedin: 'https://linkedin.com/in/jessica-asamoah',
      twitter: 'https://twitter.com/jessicaasamoah',
      email: 'mailto:jessica@swkghana.org'
    }
  }
]

const MeetTheTeam = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Meet the Team</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The people behind SWK Ghana who are dedicated to empowering youth and building resilient communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Photo */}
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-emerald-100 shadow-lg">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className={`w-full h-full object-cover ${member.imagePosition || 'object-center'}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white z-10">
                      {member.initials}
                    </div>
                  </div>
                </div>

                {/* Name and Role */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>

                {/* Social Media Icons */}
                <div className="flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors duration-200"
                      aria-label={`${member.name} Twitter`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  
                  {member.social.email && (
                    <a
                      href={member.social.email}
                      className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors duration-200"
                      aria-label={`${member.name} Email`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Volunteers</h2>
            <p className="text-gray-600">We’ll showcase our amazing volunteers here as they join us.</p>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Join Our Mission</h2>
            <p className="text-gray-600 mb-6">We collaborate with volunteers and partners to amplify impact.</p>
            
            {/* Company Social Media */}
            <div className="flex justify-center space-x-4 mb-6">
              <a
                href="https://www.linkedin.com/company/100929740"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                aria-label="SWK Ghana LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            
            <a href="/get-involved" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 hover:brightness-105">
              Get Involved
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeetTheTeam


