import React, { useState } from 'react'

// ─── Social Share Buttons ───────────────────────────────────────────────────────
const ShareButtons = ({ url, title }) => {
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shares = [
    { label: 'Facebook', color: 'bg-[#1877F2] hover:bg-[#166fe5]', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/> },
    { label: 'X', color: 'bg-black hover:bg-gray-800', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`, icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> },
    { label: 'LinkedIn', color: 'bg-[#0A66C2] hover:bg-[#095fb6]', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
    { label: 'WhatsApp', color: 'bg-[#25D366] hover:bg-[#1ebe5d]', href: `https://wa.me/?text=${encodedTitle}%20${encoded}`, icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/> },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-xs font-semibold text-gray-700">Share:</span>
      {shares.map(({ label, color, href, icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${label}`}
          className={`${color} text-white rounded-lg p-1.5 transition-colors`}>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
        </a>
      ))}
      <button onClick={copyLink} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2.5 py-1.5 rounded-lg transition-colors">
        {copied ? '✓ Copied!' : '🔗 Copy'}
      </button>
    </div>
  )
}

// ─── Report data ───────────────────────────────────────────────────────────────
const reports = [
  {
    id: 1,
    category: 'Impact Report',
    categoryColor: 'bg-[#F2FAE8] text-[#1E963C]',
    gradient: 'from-[#F2FAE8] to-green-50',
    border: 'border-[#D4F0A0]',
    btnColor: 'bg-[#78C31E] hover:bg-[#1E963C]',
    btnBorder: 'border-[#78C31E] text-[#78C31E] hover:bg-[#F2FAE8]',
    title: 'Agribusiness Webinar Series Impact Report 2025',
    description:
      'Three-edition webinar series (September–November 2025). 230+ verified registrants, demographic insights, SDG alignment, and full impact metrics.',
    date: 'November 2025',
    // Using the webinar flyer from Cloudinary as the report cover
    thumbnail:
      'https://res.cloudinary.com/dwgj3lovn/image/upload/f_auto,q_auto,w_600/v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png',
    badgeText: 'Latest Report',
    driveLink: 'https://drive.google.com/file/d/1Sl55CXUFD_OQY8GYmx9IeTaM0jOTr-Po/view?usp=sharing',
    downloadLink: 'https://drive.google.com/uc?export=download&id=1Sl55CXUFD_OQY8GYmx9IeTaM0jOTr-Po',
  },
  {
    id: 2,
    category: 'Annual Report',
    categoryColor: 'bg-blue-100 text-blue-700',
    gradient: 'from-blue-50 to-cyan-50',
    border: 'border-blue-100',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    btnBorder: 'border-blue-600 text-blue-600 hover:bg-blue-50',
    title: 'SWK Ghana Annual Report 2025',
    description:
      "Our annual review of programs, partnerships, community impact, and organizational milestones for the year 2025.",
    date: 'March 2026',
    // Using the SWK community photo as the annual report cover
    thumbnail:
      'https://res.cloudinary.com/dwgj3lovn/image/upload/f_auto,q_auto,w_600/v1773615456/photo_2026-03-15_22-53-24_iqemaf.jpg',
    badgeText: 'Annual Report',
    driveLink: 'https://drive.google.com/file/d/17wNhPEXy1_VCo8uDD1rWzwRqvm8bmQx4/view?usp=sharing',
    downloadLink: 'https://drive.google.com/uc?export=download&id=17wNhPEXy1_VCo8uDD1rWzwRqvm8bmQx4',
  },
  {
    id: 3,
    category: 'Program Summary',
    categoryColor: 'bg-purple-100 text-purple-700',
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-100',
    btnColor: null,
    btnBorder: null,
    title: 'Youth Development Program Summary',
    description:
      "A comprehensive summary of SWK Ghana's youth development programs, geographic reach, and outcomes across Ghana.",
    date: 'Coming Soon',
    thumbnail: null,
    thumbEmoji: '📋',
    thumbBg: 'from-purple-200 to-pink-200',
    badgeText: null,
    driveLink: null,
    downloadLink: null,
  },
  {
    id: 4,
    category: 'Research',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    gradient: 'from-yellow-50 to-orange-50',
    border: 'border-yellow-100',
    btnColor: null,
    btnBorder: null,
    title: 'Youth & Sustainable Agriculture in Ghana',
    description:
      'Research findings on the role of youth in advancing sustainable agriculture and agribusiness value chains across Ghana.',
    date: 'Coming Soon',
    thumbnail: null,
    thumbEmoji: '🔬',
    thumbBg: 'from-yellow-200 to-orange-200',
    badgeText: null,
    driveLink: null,
    downloadLink: null,
  },
]

const articles = []

const categories = ['All', 'Impact Report', 'Annual Report', 'Program Summary', 'Research']

// ─── Reports page ──────────────────────────────────────────────────────────────
const Reports = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? reports
      : reports.filter((r) => r.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-white px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 xs:py-10 sm:py-12">

      {/* ── Page header ── */}
      <div className="max-w-6xl mx-auto text-center mb-8 xs:mb-10 sm:mb-12">
        <span className="inline-block bg-[#F2FAE8] text-[#1E963C] text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Publications
        </span>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Reports & Publications
        </h1>
        <p className="text-sm xs:text-base sm:text-lg text-gray-800 max-w-2xl mx-auto">
          Access SWK Ghana's impact reports, annual reviews, program summaries, research findings, and latest articles.
        </p>
      </div>

      {/* ── Featured: two live reports side-by-side ── */}
      <div className="max-w-6xl mx-auto mb-6 xs:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xs:gap-6">
          {reports.filter((r) => r.driveLink).map((report) => (
            <div
              key={report.id}
              className={`bg-gradient-to-br ${report.gradient} rounded-2xl border ${report.border} overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col`}
            >
              {/* Cover image */}
              <div className="relative">
                <img
                  src={report.thumbnail}
                  alt={report.title}
                  className="w-full h-52 xs:h-56 sm:h-60 object-cover"
                  loading="lazy"
                />
                {report.badgeText && (
                  <span className="absolute top-3 left-3 bg-[#78C31E] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {report.badgeText}
                  </span>
                )}
                <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${report.categoryColor}`}>
                  {report.category}
                </span>
              </div>
              {/* Content */}
              <div className="p-5 xs:p-6 flex flex-col flex-1">
                <p className="text-xs text-gray-700 mb-1">{report.date}</p>
                <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs xs:text-sm text-gray-800 leading-relaxed mb-5 flex-1">
                  {report.description}
                </p>
                <div className="flex gap-2">
                  <a
                    href={report.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 text-center text-xs font-semibold text-white ${report.btnColor} px-3 py-2.5 rounded-lg transition-colors`}
                  >
                    📄 View Report
                  </a>
                  <a
                    href={report.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 text-center text-xs font-semibold border ${report.btnBorder} px-3 py-2.5 rounded-lg transition-colors`}
                  >
                    ⬇️ Download PDF
                  </a>
                </div>
                <ShareButtons url={report.driveLink} title={report.title} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── All reports with filter ── */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200 mb-8 xs:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 xs:mb-8">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">
            All Documents
          </h2>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs xs:text-sm font-semibold px-3 xs:px-4 py-1.5 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#78C31E] text-white border-[#78C31E]'
                    : 'bg-white text-gray-800 border-gray-300 hover:border-[#78C31E] hover:text-[#78C31E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-5">
          {filtered.map((report) => (
            <div
              key={report.id}
              className={`bg-gradient-to-br ${report.gradient} rounded-xl border ${report.border} overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col`}
            >
              {/* Thumbnail or emoji placeholder */}
              {report.thumbnail ? (
                <div className="relative">
                  <img
                    src={report.thumbnail}
                    alt={report.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  {report.driveLink && (
                    <span className="absolute top-2 right-2 bg-white/90 text-xs font-semibold text-[#1E963C] px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  )}
                </div>
              ) : (
                <div className={`h-40 bg-gradient-to-br ${report.thumbBg} flex flex-col items-center justify-center gap-1`}>
                  <span className="text-4xl">{report.thumbEmoji}</span>
                  <span className="text-xs font-semibold text-gray-800">Coming Soon</span>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${report.categoryColor}`}>
                    {report.category}
                  </span>
                  <span className="text-xs text-gray-700">{report.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug flex-1">
                  {report.title}
                </h3>
                <p className="text-xs text-gray-800 leading-relaxed mb-3">
                  {report.description.slice(0, 80)}…
                </p>
                {report.driveLink ? (
                  <div className="flex gap-1.5">
                    <a
                      href={report.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center text-xs font-semibold text-white ${report.btnColor} px-2 py-1.5 rounded-lg transition-colors`}
                    >
                      📄 View
                    </a>
                    <a
                      href={report.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center text-xs font-semibold border ${report.btnBorder} px-2 py-1.5 rounded-lg transition-colors`}
                    >
                      ⬇️ PDF
                    </a>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg text-center">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Articles section ── */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-6">
          Latest Articles
        </h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-gradient-to-br from-[#F2FAE8] to-green-50 rounded-xl border border-[#D4F0A0] p-4 xs:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.categoryColor}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-700">{article.date}</span>
                </div>
                <h3 className="text-sm xs:text-base font-semibold text-gray-900 mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs xs:text-sm text-gray-800 leading-relaxed mb-4">
                  {article.description}
                </p>
                {article.link && (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs xs:text-sm font-semibold text-[#78C31E] hover:text-[#1E963C]"
                  >
                    Read Article →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-14 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-4xl mb-4">✍️</span>
            <h3 className="text-base xs:text-lg font-semibold text-gray-700 mb-2">Articles Coming Soon</h3>
            <p className="text-xs xs:text-sm text-gray-700 max-w-sm">
              We're working on new articles and thought leadership content. Check back soon!
            </p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Reports