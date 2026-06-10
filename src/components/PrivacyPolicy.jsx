import React from 'react'
import { useNavigate } from 'react-router-dom'

const PrivacyPolicy = () => {
  const navigate = useNavigate()
  const lastUpdated = 'May 2026'

  const sections = [
    {
      title: '1. Who We Are',
      content: `SWK Ghana LBG (hereinafter "SWK Ghana", "we", "us", or "our") is a nonprofit organisation incorporated in Ghana under the Companies Act, 2019 (Act 992), registered as a Company Limited by Guarantee.

Registration Number: CG024110426
Tax Identification Number (TIN): C0067142656
Registered Address: GE-138-7728, Number 24, Agbogba Ashongman, Glendora Street, Accra, Greater Accra, Ghana
Email: info@swkghana.org
Website: https://swkghana.org`
    },
    {
      title: '2. What Information We Collect',
      content: `We collect information you provide directly to us when you:

• Fill in our contact, volunteer, or partnership forms
• Subscribe to our newsletter
• Register for our programmes or events
• List a product on SWK Marketplace
• Contact us by email

The types of personal data we may collect include: your name, email address, phone number, age, location, and any information you voluntarily provide in form fields or messages.

We do not collect sensitive personal data (such as health information, financial account numbers, or government ID numbers) unless strictly necessary and with your explicit consent.`
    },
    {
      title: '3. How We Use Your Information',
      content: `We use the information we collect to:

• Respond to your enquiries and communicate with you
• Send newsletters and programme updates (only if you subscribed)
• Process volunteer and partnership applications
• Manage programme registrations and event attendance
• Improve our website and services
• Comply with our legal obligations

We will never sell, rent, or trade your personal information to third parties for marketing purposes.`
    },
    {
      title: '4. Legal Basis for Processing',
      content: `We process your personal data on the following grounds:

• Consent — where you have given us clear permission (e.g. newsletter subscription)
• Legitimate interests — to operate and improve our programmes and services
• Contractual necessity — where processing is needed to fulfil a request you have made
• Legal compliance — where we are required by law to process your data`
    },
    {
      title: '5. How We Share Your Information',
      content: `We may share your information with trusted third-party service providers who assist us in operating our website and delivering our services, including:

• Formspree — form submission processing
• Brevo — email marketing and newsletter delivery
• Cloudinary — media hosting
• Sanity — content management
• Vercel — website hosting

These providers are contractually bound to use your data only to provide services on our behalf and to protect it appropriately.

We may also disclose your information where required by law or to protect the rights, property, or safety of SWK Ghana, our users, or others.`
    },
    {
      title: '6. Cookies and Analytics',
      content: `Our website may use cookies and similar tracking technologies to enhance your experience and analyse how visitors use the site.

• Essential cookies — necessary for the website to function
• Analytics cookies — help us understand how visitors interact with the site (e.g. Google Analytics)

You can control and manage cookies through your browser settings. Disabling cookies may affect some functionality of the website.`
    },
    {
      title: '7. Data Retention',
      content: `We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by law. Form submissions and enquiries are generally retained for up to 2 years. Newsletter subscriber data is retained until you unsubscribe.`
    },
    {
      title: '8. Your Rights',
      content: `You have the right to:

• Access — request a copy of the personal data we hold about you
• Correction — request that we correct inaccurate or incomplete data
• Deletion — request that we delete your personal data ("right to be forgotten")
• Restriction — request that we restrict how we use your data
• Objection — object to our processing of your personal data
• Portability — request your data in a portable format
• Withdraw consent — at any time where processing is based on consent

To exercise any of these rights, please contact us at info@swkghana.org. We will respond within 30 days.`
    },
    {
      title: '9. Data Security',
      content: `We take reasonable technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse. Our website uses HTTPS encryption. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
      title: '10. Third-Party Links',
      content: `Our website may contain links to third-party websites (such as partner organisations, Google Forms, or social media platforms). This Privacy Policy does not apply to those websites. We encourage you to review the privacy policies of any third-party sites you visit.`
    },
    {
      title: "11. Children's Privacy",
      content: `Our website is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13 without verifiable parental consent. If you believe we have inadvertently collected such data, please contact us immediately at info@swkghana.org.`
    },
    {
      title: '12. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. When we make significant changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of the website after changes constitutes your acceptance of the updated policy.`
    },
    {
      title: '13. Contact Us',
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact us:

SWK Ghana LBG
Email: info@swkghana.org
Website: https://swkghana.org
Address: GE-138-7728, Number 24, Agbogba Ashongman, Glendora Street, Accra, Greater Accra, Ghana`
    },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="py-16 md:py-20" style={{ background: 'linear-gradient(135deg, #F2FAE8 0%, #ffffff 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
          <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest bg-[#F2FAE8] text-[#1E963C]">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#1A1A1A', fontFamily: 'Ubuntu, sans-serif' }}>
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-xl mx-auto mb-3">
            How SWK Ghana collects, uses, and protects your personal information.
          </p>
          <p className="text-sm text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Registration info bar */}
      <div className="bg-[#1A1A1A] py-4">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-0.5">Organisation</span>
              <span className="text-sm font-semibold text-white">SWK Ghana LBG</span>
            </div>
            <div className="hidden sm:block w-px bg-white/10" />
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-0.5">Reg No.</span>
              <span className="text-sm font-semibold text-[#78C31E]">CG024110426</span>
            </div>
            <div className="hidden sm:block w-px bg-white/10" />
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-0.5">TIN</span>
              <span className="text-sm font-semibold text-[#78C31E]">C0067142656</span>
            </div>
            <div className="hidden sm:block w-px bg-white/10" />
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-0.5">Incorporated</span>
              <span className="text-sm font-semibold text-white">14 April 2026 · Ghana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16 max-w-4xl">

        {/* Intro */}
        <div className="bg-[#F2FAE8] border border-[#D4F0A0] rounded-2xl p-6 sm:p-8 mb-10">
          <p className="text-gray-700 leading-relaxed">
            SWK Ghana LBG is committed to protecting your privacy. This Privacy Policy explains what personal information we collect when you use <strong>swkghana.org</strong>, how we use it, and your rights regarding that information. By using our website, you agree to the practices described in this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Ubuntu, sans-serif' }}>
                {section.title}
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SWK Ghana LBG · Reg No. CG024110426
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/contact')}
              className="text-sm font-semibold text-[#78C31E] hover:text-[#1E963C] transition-colors"
            >
              Contact Us →
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-semibold px-5 py-2 rounded-xl text-white transition-colors"
              style={{ background: '#78C31E' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
