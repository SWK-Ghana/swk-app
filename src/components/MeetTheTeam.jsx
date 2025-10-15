import React from 'react'

const teamMembers = [
  { name: 'Founder & Executive Director', role: 'Leadership', initials: 'FE' },
  { name: 'Co-Founder', role: 'Leadership', initials: 'CF' },
  { name: 'Programs Lead', role: 'Programs', initials: 'PL' },
  { name: 'Community Manager', role: 'Engagement', initials: 'CM' },
  { name: 'Tech & Innovation Lead', role: 'Technology', initials: 'TI' },
  { name: 'Agribusiness Lead', role: 'Agriculture', initials: 'AL' },
  { name: 'Climate Action Lead', role: 'Environment', initials: 'CA' },
  { name: 'Finance Officer', role: 'Finance', initials: 'FO' },
  { name: 'Operations Manager', role: 'Operations', initials: 'OM' }
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 text-white flex items-center justify-center text-lg font-semibold shadow-sm">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
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


