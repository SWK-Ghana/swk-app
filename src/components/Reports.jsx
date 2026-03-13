import React, { useState } from 'react'

// ─── Report data ───────────────────────────────────────────────────────────────
const reports = [
  {
    id: 1,
    category: 'Impact Report',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-emerald-50 to-green-50',
    border: 'border-emerald-100',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700',
    btnBorder: 'border-emerald-600 text-emerald-600 hover:bg-emerald-50',
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
      'https://res.cloudinary.com/dwgj3lovn/image/upload/f_auto,q_auto,w_600/v1760551738/photo_2025-07-30_10-50-49_snxydg.jpg',
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 xs:py-10 sm:py-12">

      {/* ── Page header ── */}
      <div className="max-w-6xl mx-auto text-center mb-8 xs:mb-10 sm:mb-12">
        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Publications
        </span>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Reports & Publications
        </h1>
        <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
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
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {report.badgeText}
                  </span>
                )}
                <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${report.categoryColor}`}>
                  {report.category}
                </span>
              </div>
              {/* Content */}
              <div className="p-5 xs:p-6 flex flex-col flex-1">
                <p className="text-xs text-gray-500 mb-1">{report.date}</p>
                <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-5 flex-1">
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
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-400 hover:text-emerald-600'
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
                    <span className="absolute top-2 right-2 bg-white/90 text-xs font-semibold text-emerald-700 px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  )}
                </div>
              ) : (
                <div className={`h-40 bg-gradient-to-br ${report.thumbBg} flex flex-col items-center justify-center gap-1`}>
                  <span className="text-4xl">{report.thumbEmoji}</span>
                  <span className="text-xs font-semibold text-gray-600">Coming Soon</span>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${report.categoryColor}`}>
                    {report.category}
                  </span>
                  <span className="text-xs text-gray-500">{report.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug flex-1">
                  {report.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
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
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-4 xs:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.categoryColor}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">{article.date}</span>
                </div>
                <h3 className="text-sm xs:text-base font-semibold text-gray-900 mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-4">
                  {article.description}
                </p>
                {article.link && (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs xs:text-sm font-semibold text-emerald-600 hover:text-emerald-700"
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
            <p className="text-xs xs:text-sm text-gray-500 max-w-sm">
              We're working on new articles and thought leadership content. Check back soon!
            </p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Reports