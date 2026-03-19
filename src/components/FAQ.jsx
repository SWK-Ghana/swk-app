import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    question: 'What is SWK Ghana?',
    answer: 'SWK Ghana is a youth-focused nonprofit organisation based in Accra, Ghana. We empower and mobilise young people as holistic changemakers — building leadership skills and opportunities to drive sustainability, community development, and systemic transformation. We were founded in 2024 and have since reached 236+ youth across 9+ countries through our programmes.',
  },
  {
    question: 'How can I join or get involved with SWK Ghana?',
    answer: 'There are several ways to get involved! You can register for our webinars and programmes, join our WhatsApp community, volunteer with us, or support us through donations. Visit our Get Involved page for all the options, or send us an email at info@swkghana.org.',
  },
  {
    question: 'How do I join the SWK Ghana WhatsApp community?',
    answer: 'You can join our WhatsApp community directly using this link: chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu. The community is open to all young people interested in youth empowerment, agribusiness, sustainability, and community development.',
  },
  {
    question: 'What programmes does SWK Ghana run?',
    answer: 'Our programmes cover six key pillars: Youth Development & Leadership, Agribusiness & Food Systems, Circular Economy & Sustainability, Climate Action & Resilience, Technology & Digital Innovation, and Community Empowerment. Our flagship programme is the Agribusiness Webinar Series, which has reached youth in 9+ countries. We also run leadership workshops, professional development sessions, and community initiatives.',
  },
  {
    question: 'Are SWK Ghana programmes free to attend?',
    answer: 'Yes — all of our core programmes, including webinars and workshops, are completely free to attend. SWK Ghana is committed to making quality youth development accessible to every young person, regardless of their financial situation.',
  },
  {
    question: 'Can I suggest a programme or topic for a webinar?',
    answer: 'Absolutely! We welcome ideas from our community. If you have a topic you would like us to cover — whether in agribusiness, leadership, sustainability, finance, or technology — reach out to us at info@swkghana.org or send a message in our WhatsApp community. Your suggestions directly shape our programme calendar.',
  },
  {
    question: 'What is the SWK Marketplace?',
    answer: 'SWK Marketplace is our digital marketplace for youth-led green and sustainable businesses. It connects eco-conscious buyers with young entrepreneurs selling agribusiness products, recycled and upcycled goods, handmade crafts, and organic produce — all aligned with UN SDG 12 (Responsible Consumption and Production). Visit swkghana.org/marketplace to browse or list your products.',
  },
  {
    question: 'How do I list my product on the SWK Marketplace?',
    answer: 'Visit swkghana.org/marketplace and click "List Your Product." Fill in your product details, upload a photo, and agree to our Vendor Terms & Conditions. Our team reviews every submission within 24–48 hours to ensure it meets our sustainability criteria. Once approved, your product goes live and is visible to buyers across our platform and network.',
  },
  {
    question: 'I am outside Accra. Can I still participate in SWK Ghana programmes?',
    answer: 'Yes, absolutely! Most of our programmes are delivered online, which means you can participate from anywhere in Ghana, Africa, or the world. Our Agribusiness Webinar Series has reached participants in 9+ countries. For in-person events, we will always announce the location and details well in advance.',
  },
  {
    question: 'How can my organisation partner with SWK Ghana?',
    answer: 'We are always open to meaningful partnerships with organisations that share our mission. Whether you are an NGO, corporate body, academic institution, or development organisation, we would love to explore how we can work together. Reach out to us at info@swkghana.org or visit our Contact page and our team will respond within 48 hours.',
  },
  {
    question: 'Does SWK Ghana provide financial support or grants to youth?',
    answer: 'SWK Ghana is currently focused on building our programme capacity and organisational foundation. We do not currently offer direct financial grants to individuals. However, we share information about grants, funding opportunities, and scholarships through our WhatsApp community and social media channels. We also connect youth to relevant funding opportunities through our partner network.',
  },
  {
    question: 'How can I support SWK Ghana financially?',
    answer: 'You can support SWK Ghana through a donation via our website at swkghana.org/donate. Every contribution — no matter the size — directly funds our programmes, webinars, and community initiatives. You can also support us by sharing our work with your network, volunteering your time and skills, or becoming a programme sponsor.',
  },
]

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#F2FAE8] transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm xs:text-base pr-4">{question}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${open ? 'bg-[#78C31E] text-white rotate-45' : 'bg-[#F2FAE8] text-[#78C31E]'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white border-t border-gray-100">
          <p className="text-gray-700 text-sm xs:text-base leading-relaxed pt-3">{answer}</p>
        </div>
      )}
    </div>
  )
}

const FAQ = () => {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-[#1E963C] py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-[#78C31E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            Help Centre
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            Answers to the most common questions about SWK Ghana, our programmes, the marketplace, and how to get involved.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-[#F2FAE8] border border-[#D4F0A0] rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have a question?</h3>
          <p className="text-gray-700 text-sm mb-5">
            Can't find what you're looking for? Our team is happy to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="btn-gradient px-6 py-2.5 text-sm font-semibold rounded-xl">
              Contact Us
            </Link>
            <a
              href="https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 text-sm font-semibold rounded-xl border-2 border-[#78C31E] text-[#1E963C] hover:bg-[#F2FAE8] transition-colors"
            >
              Join WhatsApp Community
            </a>
          </div>
        </div>

        {/* Back to Resources */}
        <div className="mt-6 text-center">
          <Link to="/resources" className="text-sm font-semibold text-[#78C31E] hover:text-[#1E963C] hover:underline transition-colors">
            ← Back to Resources
          </Link>
        </div>
      </div>
    </main>
  )
}

export default FAQ