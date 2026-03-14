import React, { useState, useEffect } from 'react'
import { sendEmail } from '../utils/brevo'

const GetInvolved = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [contactStatus, setContactStatus] = useState('idle')

  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const [isDonateOpen, setIsDonateOpen] = useState(false)
  const [isPartnerOpen, setIsPartnerOpen] = useState(false)

  const [volunteerFullName, setVolunteerFullName] = useState('')
  const [volunteerAge, setVolunteerAge] = useState('')
  const [volunteerEmail, setVolunteerEmail] = useState('')
  const [volunteerRole, setVolunteerRole] = useState('')
  const [volunteerHours, setVolunteerHours] = useState('')
  const [volunteerMotivation, setVolunteerMotivation] = useState('')
  const [volunteerDocLink, setVolunteerDocLink] = useState('')
  const [volunteerDocFile, setVolunteerDocFile] = useState(null)
  const [volunteerStatus, setVolunteerStatus] = useState('idle')

  const [donorFullName, setDonorFullName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donationAmount, setDonationAmount] = useState('')
  const [donationCurrency, setDonationCurrency] = useState('GHS')
  const [donationMessage, setDonationMessage] = useState('')
  const [donateStatus, setDonateStatus] = useState('idle')

  const [partnerOrgName, setPartnerOrgName] = useState('')
  const [partnerContactName, setPartnerContactName] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerMessage, setPartnerMessage] = useState('')
  const [partnerStatus, setPartnerStatus] = useState('idle')

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

  const resetVolunteerForm = () => { setVolunteerFullName(''); setVolunteerAge(''); setVolunteerEmail(''); setVolunteerRole(''); setVolunteerHours(''); setVolunteerMotivation(''); setVolunteerDocLink(''); setVolunteerDocFile(null); setVolunteerStatus('idle') }
  const resetDonateForm = () => { setDonorFullName(''); setDonorEmail(''); setDonationAmount(''); setDonationCurrency('GHS'); setDonationMessage(''); setDonateStatus('idle') }
  const resetPartnerForm = () => { setPartnerOrgName(''); setPartnerContactName(''); setPartnerEmail(''); setPartnerMessage(''); setPartnerStatus('idle') }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactStatus('sending')
    try {
      await sendEmail({
        _subject: 'SWK Website: Get in Touch (Get Involved page)',
        name: `${firstName} ${lastName}`.trim(),
        email,
        message,
        form_type: 'Get in Touch',
      })
      setContactStatus('success')
      setFirstName(''); setLastName(''); setEmail(''); setMessage('')
    } catch { setContactStatus('error') }
  }

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
    } catch { setVolunteerStatus('error') }
  }

  const handleDonateSubmit = async (e) => {
    e.preventDefault()
    setDonateStatus('sending')
    try {
      await sendEmail({
        _subject: `Donation Interest — ${donorFullName}`,
        name: donorFullName,
        email: donorEmail,
        amount: donationAmount ? `${donationAmount} ${donationCurrency}` : 'N/A',
        message: donationMessage || 'N/A',
        form_type: 'Donation Interest',
      })
      setDonateStatus('success')
    } catch { setDonateStatus('error') }
  }

  const handlePartnerSubmit = async (e) => {
    e.preventDefault()
    setPartnerStatus('sending')
    try {
      await sendEmail({
        _subject: `Partnership Inquiry — ${partnerOrgName}`,
        organisation: partnerOrgName,
        contact_name: partnerContactName,
        email: partnerEmail,
        message: partnerMessage,
        form_type: 'Partnership Inquiry',
      })
      setPartnerStatus('success')
    } catch { setPartnerStatus('error') }
  }

  const SuccessState = ({ name, message, onClose }) => (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
        <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{name}</h4>
      <p className="text-sm text-gray-600 mb-5">{message}</p>
      <button onClick={onClose} className="btn-gradient px-6 py-2 text-sm">Close</button>
    </div>
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 text-center px-2 xs:px-0">
            Join the SWK Movement
          </h1>
          <p className="text-base xs:text-lg sm:text-xl text-gray-600 mb-8 xs:mb-10 sm:mb-12 text-center max-w-3xl mx-auto px-4 xs:px-6 sm:px-0">
            Join SWK Ghana and help us build a more sustainable and equitable Ghana. Together, we can empower young people, transform communities, and protect our planet.
          </p>

          {/* Ways to Get Involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 sm:gap-7 md:gap-8 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <div className="bg-white rounded-lg xs:rounded-xl p-5 xs:p-6 sm:p-7 md:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 xs:w-16 xs:h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 xs:mb-5 sm:mb-6">
                <svg className="w-7 h-7 xs:w-8 xs:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl xs:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">Volunteer</h3>
              <p className="text-sm xs:text-base text-gray-600 mb-5 xs:mb-6 leading-relaxed">Give your time and skills to support our community initiatives and make a direct impact.</p>
              <button type="button" className="btn-gradient w-full" onClick={() => setIsVolunteerOpen(true)}>Become a Volunteer</button>
            </div>

            <div className="bg-white rounded-lg xs:rounded-xl p-5 xs:p-6 sm:p-7 md:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 xs:w-16 xs:h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 xs:mb-5 sm:mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl xs:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">Donate</h3>
              <p className="text-sm xs:text-base text-gray-600 mb-5 xs:mb-6 leading-relaxed">Support our mission financially and help us expand our programs and reach more people.</p>
              <button type="button" className="btn-gradient w-full" onClick={() => setIsDonateOpen(true)}>Make a Donation</button>
            </div>

            <div className="bg-white rounded-lg xs:rounded-xl p-5 xs:p-6 sm:p-7 md:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 xs:w-16 xs:h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4 xs:mb-5 sm:mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2" />
                </svg>
              </div>
              <h3 className="text-xl xs:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">Partner With Us</h3>
              <p className="text-sm xs:text-base text-gray-600 mb-5 xs:mb-6 leading-relaxed">Collaborate with us as an organization or business to create meaningful partnerships.</p>
              <button type="button" className="btn-gradient w-full" onClick={() => setIsPartnerOpen(true)}>Become a Partner</button>
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14">
            <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-6 xs:mb-8 text-center">Success Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xs:gap-6">
              {[
                { initial: 'A', color: 'bg-emerald-100 text-emerald-600', name: 'Alex Johnson', text: '"Volunteering with this organization has been incredibly rewarding. I\'ve seen firsthand the positive impact we\'re making in our community."' },
                { initial: 'M', color: 'bg-blue-100 text-blue-600', name: 'Maria Rodriguez', text: '"The resources and support provided have helped me grow both personally and professionally. I\'m grateful to be part of this community."' },
              ].map(({ initial, color, name, text }) => (
                <div key={name} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="font-bold text-lg">{initial}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{name}</h4>
                    <p className="text-gray-600 text-sm xs:text-base">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Get in Touch Form */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200">
            <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-4 xs:mb-5 text-center">Get in Touch</h2>
            <p className="text-sm xs:text-base text-gray-600 mb-6 text-center max-w-xl mx-auto">Have questions or want to learn more? We'd love to hear from you!</p>
            {contactStatus === 'success' ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h4>
                <p className="text-sm text-gray-600 mb-5">Thank you for reaching out. We'll get back to you soon.</p>
                <button onClick={() => setContactStatus('idle')} className="btn-gradient px-6 py-2 text-sm">Send Another</button>
              </div>
            ) : (
              <form className="max-w-2xl mx-auto space-y-5" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="gi-firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" id="gi-firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your first name" />
                  </div>
                  <div>
                    <label htmlFor="gi-lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="gi-lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your last name" />
                  </div>
                </div>
                <div>
                  <label htmlFor="gi-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="gi-email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label htmlFor="gi-message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea id="gi-message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Tell us how you'd like to get involved..." />
                </div>
                {contactStatus === 'error' && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
                <button type="submit" disabled={contactStatus === 'sending'} className="btn-gradient w-full text-lg py-3 disabled:opacity-60">
                  {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* VOLUNTEER MODAL */}
      {isVolunteerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setIsVolunteerOpen(false); resetVolunteerForm() }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Volunteer With Us</h3>
              <button aria-label="Close" className="text-gray-500 hover:text-gray-700 text-xl" onClick={() => { setIsVolunteerOpen(false); resetVolunteerForm() }}>✕</button>
            </div>
            {volunteerStatus === 'success' ? (
              <SuccessState name="Application Received!" message={`Thank you, ${volunteerFullName.split(' ')[0]}! We'll be in touch soon.`} onClose={() => { setIsVolunteerOpen(false); resetVolunteerForm() }} />
            ) : (
              <form className="space-y-4" onSubmit={handleVolunteerSubmit}>
                <div>
                  <label htmlFor="v-name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input required id="v-name" type="text" value={volunteerFullName} onChange={(e) => setVolunteerFullName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your full name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="v-age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input required id="v-age" type="number" min={10} max={120} value={volunteerAge} onChange={(e) => setVolunteerAge(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 24" />
                  </div>
                  <div>
                    <label htmlFor="v-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required id="v-email" type="email" value={volunteerEmail} onChange={(e) => setVolunteerEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="v-role" className="block text-sm font-medium text-gray-700 mb-1">Preferred volunteer role *</label>
                  <select required id="v-role" value={volunteerRole} onChange={(e) => setVolunteerRole(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white">
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
                  <label htmlFor="v-hours" className="block text-sm font-medium text-gray-700 mb-1">Hours available per week *</label>
                  <select required id="v-hours" value={volunteerHours} onChange={(e) => setVolunteerHours(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option value="">— Select hours —</option>
                    <option>1–3 hours</option>
                    <option>4–6 hours</option>
                    <option>7–10 hours</option>
                    <option>10+ hours</option>
                    <option>Flexible / Project-based</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="v-motivation" className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer? *</label>
                  <textarea required id="v-motivation" rows={3} value={volunteerMotivation} onChange={(e) => setVolunteerMotivation(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Tell us about your passion and what you'd like to contribute…" />
                </div>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="v-file" className="block text-sm font-medium text-gray-700 mb-1">Upload CV / Resume <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input id="v-file" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setVolunteerDocFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg bg-white text-sm" />
                    <p className="text-xs text-gray-400 mt-0.5">PDF or Word document</p>
                  </div>
                  <div>
                    <label htmlFor="v-link" className="block text-sm font-medium text-gray-700 mb-1">Or paste a link <span className="text-gray-400 font-normal">(Google Drive, LinkedIn, etc.)</span></label>
                    <input id="v-link" type="url" value={volunteerDocLink} onChange={(e) => setVolunteerDocLink(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="https://drive.google.com/…" />
                  </div>
                </div>
                {volunteerStatus === 'error' && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="px-4 py-2 rounded-lg border text-gray-700" onClick={() => { setIsVolunteerOpen(false); resetVolunteerForm() }}>Cancel</button>
                  <button type="submit" disabled={volunteerStatus === 'sending'} className="btn-gradient px-5 py-2 disabled:opacity-60">
                    {volunteerStatus === 'sending' ? 'Sending...' : 'Send Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DONATION MODAL */}
      {isDonateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setIsDonateOpen(false); resetDonateForm() }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Make a Donation</h3>
              <button aria-label="Close" className="text-gray-500 hover:text-gray-700 text-xl" onClick={() => { setIsDonateOpen(false); resetDonateForm() }}>✕</button>
            </div>
            {donateStatus === 'success' ? (
              <SuccessState name="Thank You!" message="Your donation interest has been received. We'll reach out with payment details shortly." onClose={() => { setIsDonateOpen(false); resetDonateForm() }} />
            ) : (
              <form className="space-y-4" onSubmit={handleDonateSubmit}>
                <div>
                  <label htmlFor="d-name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input required id="d-name" type="text" value={donorFullName} onChange={(e) => setDonorFullName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="d-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required id="d-email" type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="your.email@example.com" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="d-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (optional)</label>
                    <input id="d-amount" type="number" min={0} step="0.01" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 200" />
                  </div>
                  <div>
                    <label htmlFor="d-currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select id="d-currency" value={donationCurrency} onChange={(e) => setDonationCurrency(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option>GHS</option><option>USD</option><option>EUR</option><option>GBP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="d-message" className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                  <textarea id="d-message" rows={3} value={donationMessage} onChange={(e) => setDonationMessage(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Preferred payment method, purpose, etc." />
                </div>
                {donateStatus === 'error' && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="px-4 py-2 rounded-lg border text-gray-700" onClick={() => { setIsDonateOpen(false); resetDonateForm() }}>Cancel</button>
                  <button type="submit" disabled={donateStatus === 'sending'} className="btn-gradient px-5 py-2 disabled:opacity-60">
                    {donateStatus === 'sending' ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PARTNER MODAL */}
      {isPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setIsPartnerOpen(false); resetPartnerForm() }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-5 xs:p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Partner With Us</h3>
              <button aria-label="Close" className="text-gray-500 hover:text-gray-700 text-xl" onClick={() => { setIsPartnerOpen(false); resetPartnerForm() }}>✕</button>
            </div>
            {partnerStatus === 'success' ? (
              <SuccessState name="Inquiry Received!" message="Thank you for your interest in partnering with SWK Ghana. We'll be in touch soon." onClose={() => { setIsPartnerOpen(false); resetPartnerForm() }} />
            ) : (
              <form className="space-y-4" onSubmit={handlePartnerSubmit}>
                <div>
                  <label htmlFor="p-org" className="block text-sm font-medium text-gray-700 mb-1">Organization name</label>
                  <input required id="p-org" type="text" value={partnerOrgName} onChange={(e) => setPartnerOrgName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your organization" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="p-name" className="block text-sm font-medium text-gray-700 mb-1">Contact name</label>
                    <input required id="p-name" type="text" value={partnerContactName} onChange={(e) => setPartnerContactName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="p-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required id="p-email" type="email" value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="p-message" className="block text-sm font-medium text-gray-700 mb-1">How would you like to partner?</label>
                  <textarea required id="p-message" rows={4} value={partnerMessage} onChange={(e) => setPartnerMessage(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Tell us what partnership you have in mind…" />
                </div>
                {partnerStatus === 'error' && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="px-4 py-2 rounded-lg border text-gray-700" onClick={() => { setIsPartnerOpen(false); resetPartnerForm() }}>Cancel</button>
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

export default GetInvolved