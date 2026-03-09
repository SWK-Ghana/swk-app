import React, { useEffect, useState } from 'react'

const GetInvolved = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const [isDonateOpen, setIsDonateOpen] = useState(false)
  const [isPartnerOpen, setIsPartnerOpen] = useState(false)

  const [volunteerFullName, setVolunteerFullName] = useState('')
  const [volunteerAge, setVolunteerAge] = useState('')
  const [volunteerEmail, setVolunteerEmail] = useState('')
  const [volunteerMotivation, setVolunteerMotivation] = useState('')
  const [volunteerDocLink, setVolunteerDocLink] = useState('')
  const [volunteerDocFile, setVolunteerDocFile] = useState(null)

  const [donorFullName, setDonorFullName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donationAmount, setDonationAmount] = useState('')
  const [donationCurrency, setDonationCurrency] = useState('GHS')
  const [donationMessage, setDonationMessage] = useState('')

  const [partnerOrgName, setPartnerOrgName] = useState('')
  const [partnerContactName, setPartnerContactName] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerMessage, setPartnerMessage] = useState('')

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsVolunteerOpen(false)
        setIsDonateOpen(false)
        setIsPartnerOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openGetInTouchEmail = () => {
    const to = 'sustainabilitywithkoomson@gmail.com'
    const subject = 'SWK Website: Get in Touch'
    const body = [
      'Message sent via SWK website (Get Involved page)',
      '',
      `Name: ${`${firstName} ${lastName}`.trim()}`,
      `Email: ${email}`,
      '',
      'Message:',
      message,
    ].join('\n')

    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  const openVolunteerEmail = () => {
    const to = 'sustainabilitywithkoomson@gmail.com'
    const subject = `Volunteer Application - ${volunteerFullName || 'SWK Website'}`
    const body = [
      'Volunteer Application (via SWK website)',
      '',
      `Full name: ${volunteerFullName}`,
      `Age: ${volunteerAge}`,
      `Email: ${volunteerEmail}`,
      '',
      'Motivation:',
      volunteerMotivation,
      '',
      `Document link (optional): ${volunteerDocLink || 'N/A'}`,
      `Selected file (optional): ${volunteerDocFile?.name || 'N/A'}`,
      '',
      volunteerDocFile
        ? 'Note: If you selected a file, please attach it to this email before sending (websites cannot auto-attach files to your email).'
        : 'Note: You can attach your CV/resume directly in this email, or include a link above.',
    ].join('\n')

    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  const openDonationEmail = () => {
    const to = 'sustainabilitywithkoomson@gmail.com'
    const subject = `Donation - ${donorFullName || 'SWK Website'}`
    const body = [
      'Donation Interest (via SWK website)',
      '',
      `Name: ${donorFullName}`,
      `Email: ${donorEmail}`,
      `Amount (optional): ${donationAmount ? `${donationAmount} ${donationCurrency}` : 'N/A'}`,
      '',
      'Message:',
      donationMessage || 'N/A',
    ].join('\n')

    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  const openPartnerEmail = () => {
    const to = 'sustainabilitywithkoomson@gmail.com'
    const subject = `Partnership - ${partnerOrgName || partnerContactName || 'SWK Website'}`
    const body = [
      'Partnership Inquiry (via SWK website)',
      '',
      `Organization: ${partnerOrgName}`,
      `Contact name: ${partnerContactName}`,
      `Email: ${partnerEmail}`,
      '',
      'How would you like to partner?',
      partnerMessage,
    ].join('\n')

    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  const resetVolunteerForm = () => {
    setVolunteerFullName('')
    setVolunteerAge('')
    setVolunteerEmail('')
    setVolunteerMotivation('')
    setVolunteerDocLink('')
    setVolunteerDocFile(null)
  }

  const resetDonateForm = () => {
    setDonorFullName('')
    setDonorEmail('')
    setDonationAmount('')
    setDonationCurrency('GHS')
    setDonationMessage('')
  }

  const resetPartnerForm = () => {
    setPartnerOrgName('')
    setPartnerContactName('')
    setPartnerEmail('')
    setPartnerMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">
            Join the SWK Movement
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-600 mb-8 xs:mb-10 sm:mb-12 text-center max-w-3xl mx-auto px-4 xs:px-6 sm:px-0">
            Join SWK Ghana and help us build a more sustainable and equitable Ghana. Together, we can empower young people, transform communities, and protect our planet.
          </p>
          
          {/* Ways to Get Involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-7 md:gap-8 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            {/* Volunteer */}
            <div className="bg-white rounded-lg xs:rounded-xl p-5 xs:p-6 sm:p-7 md:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 xs:w-16 xs:h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 xs:mb-5 sm:mb-6">
                <svg className="w-7 h-7 xs:w-8 xs:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl xs:text-2xl sm:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">Volunteer</h3>
              <p className="text-sm xs:text-base text-gray-600 mb-5 xs:mb-6 leading-relaxed">
                Give your time and skills to support our community initiatives and make a direct impact.
              </p>
              <button type="button" className="btn-gradient w-full" onClick={() => setIsVolunteerOpen(true)}>
                Become a Volunteer
              </button>
            </div>

            {/* Donate */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Donate</h3>
              <p className="text-gray-600 mb-6">
                Support our mission financially and help us expand our programs and reach more people.
              </p>
              <button type="button" className="btn-gradient w-full" onClick={() => setIsDonateOpen(true)}>
                Make a Donation
              </button>
            </div>

            {/* Partner */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Partner With Us</h3>
              <p className="text-gray-600 mb-6">
                Collaborate with us as an organization or business to create meaningful partnerships.
              </p>
              <button type="button" className="btn-gradient w-full" onClick={() => setIsPartnerOpen(true)}>
                Become a Partner
              </button>
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-gray-900 mb-6 xs:mb-8 sm:mb-10 text-center px-2 xs:px-0">Success Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xs:gap-6 sm:gap-7 md:gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold text-lg">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Alex Johnson</h4>
                  <p className="text-gray-600">
                    "Volunteering with this organization has been incredibly rewarding. I've seen firsthand the positive impact we're making in our community."
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Maria Rodriguez</h4>
                  <p className="text-gray-600">
                    "The resources and support provided have helped me grow both personally and professionally. I'm grateful to be part of this community."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">Get in Touch</h2>
            <p className="text-sm xs:text-base text-gray-600 mb-6 xs:mb-8 text-center px-4 xs:px-6 sm:px-0">
              Have questions or want to learn more about how you can get involved? We'd love to hear from you!
            </p>
            <form
              className="max-w-2xl mx-auto"
              onSubmit={(e) => {
                e.preventDefault()
                openGetInTouchEmail()
                setFirstName('')
                setLastName('')
                setEmail('')
                setMessage('')
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Tell us how you'd like to get involved..."
                ></textarea>
              </div>
              <button type="submit" className="btn-gradient w-full text-lg py-3">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Volunteer Modal */}
      {isVolunteerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsVolunteerOpen(false)} />
          <div className="relative bg-white rounded-xl xs:rounded-2xl shadow-xl w-full max-w-xl mx-auto p-4 xs:p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto" tabIndex={-1}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Volunteer With Us</h3>
              <button
                aria-label="Close"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsVolunteerOpen(false)}
              >
                ✕
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                openVolunteerEmail()
                resetVolunteerForm()
                setIsVolunteerOpen(false)
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  required
                  type="text"
                  value={volunteerFullName}
                  onChange={(e) => setVolunteerFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    required
                    type="number"
                    min={10}
                    max={120}
                    value={volunteerAge}
                    onChange={(e) => setVolunteerAge(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. 24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={volunteerEmail}
                    onChange={(e) => setVolunteerEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivation to volunteer</label>
                <textarea
                  required
                  rows={4}
                  value={volunteerMotivation}
                  onChange={(e) => setVolunteerMotivation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Tell us why you want to volunteer with SWK…"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attach document (optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => setVolunteerDocFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Or paste a document link (optional)</label>
                  <input
                    type="url"
                    value={volunteerDocLink}
                    onChange={(e) => setVolunteerDocLink(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://drive.google.com/…"
                  />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  When you submit, your email app will open addressed to us. If you selected a file, please attach it in the email before sending.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => {
                    resetVolunteerForm()
                    setIsVolunteerOpen(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gradient px-5 py-2">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {isDonateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDonateOpen(false)} />
          <div className="relative bg-white rounded-xl xs:rounded-2xl shadow-xl w-full max-w-xl mx-auto p-4 xs:p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto" tabIndex={-1}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Donate</h3>
              <button
                aria-label="Close"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsDonateOpen(false)}
              >
                ✕
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                openDonationEmail()
                resetDonateForm()
                setIsDonateOpen(false)
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  required
                  type="text"
                  value={donorFullName}
                  onChange={(e) => setDonorFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (optional)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. 200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={donationCurrency}
                    onChange={(e) => setDonationCurrency(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="GHS">GHS</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea
                  rows={4}
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Any notes for us (preferred payment method, purpose, etc.)"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => {
                    resetDonateForm()
                    setIsDonateOpen(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gradient px-5 py-2">Send</button>
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
              <h3 className="text-xl font-semibold text-gray-900">Partner With Us</h3>
              <button
                aria-label="Close"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsPartnerOpen(false)}
              >
                ✕
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                openPartnerEmail()
                resetPartnerForm()
                setIsPartnerOpen(false)
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization name</label>
                <input
                  required
                  type="text"
                  value={partnerOrgName}
                  onChange={(e) => setPartnerOrgName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your organization"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact name</label>
                  <input
                    required
                    type="text"
                    value={partnerContactName}
                    onChange={(e) => setPartnerContactName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How would you like to partner?</label>
                <textarea
                  required
                  rows={4}
                  value={partnerMessage}
                  onChange={(e) => setPartnerMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Tell us what partnership you have in mind…"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => {
                    resetPartnerForm()
                    setIsPartnerOpen(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gradient px-5 py-2">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GetInvolved
