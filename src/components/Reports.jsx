// ============================================
// FILE 1: src/components/Reports.jsx
// New standalone Reports & Publications page
// ============================================

import React, { useState } from 'react'

const reports = [
  {
    id: 1,
    category: 'Impact Report',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    title: 'Agribusiness Webinar Series Impact Report 2025',
    description:
      'A comprehensive report on the SWK Ghana Agribusiness Webinar Series covering three editions (September–November 2025), 230+ verified registrants, demographic insights, SDG alignment, and key impact metrics.',
    date: 'November 2025',
    thumbnail:
      'https://res.cloudinary.com/dwgj3lovn/image/upload/f_auto,q_auto,w_600/v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png',
    driveLink:
      'https://docs.google.com/document/d/1C7_1Yh86niEFApNaQFBcJn37zLgz3kOb/edit?usp=sharing',
    downloadLink:
      'https://docs.google.com/document/d/1C7_1Yh86niEFApNaQFBcJn37zLgz3kOb/export?format=pdf',
    featured: true,
  },
  {
    id: 2,
    category: 'Annual Report',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: 'SWK Ghana Annual Report 2025',
    description:
      "SWK Ghana's annual review of programs, partnerships, community impact, and organizational milestones for the year 2025.",
    date: 'March 2026',
    thumbnail: null,
    driveLink:
      'https://docs.google.com/document/d/12mrbzehyu34yzYL_xpxm5OcJUoEeAyz8/edit?usp=sharing',
    downloadLink:
      'https://docs.google.com/document/d/12mrbzehyu34yzYL_xpxm5OcJUoEeAyz8/export?format=pdf',
    featured: false,
  },
  {
    id: 3,
    category: 'Program Summary',
    categoryColor: 'bg-purple-100 text-purple-700',
    title: 'Youth Development Program Summary',
    description:
      "A summary of SWK Ghana's youth development programs, reach, and outcomes across Ghana.",
    date: 'Coming Soon',
    thumbnail: null,
    driveLink: null,
    downloadLink: null,
    featured: false,
  },
  {
    id: 4,
    category: 'Research',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    title: 'Youth & Sustainable Agriculture in Ghana',
    description:
      'Research findings on the role of youth in advancing sustainable agriculture and agribusiness across Ghana.',
    date: 'Coming Soon',
    thumbnail: null,
    driveLink: null,
    downloadLink: null,
    featured: false,
  },
]

// Add articles here when ready. Example structure:
// {
//   id: 1,
//   category: 'Agribusiness',
//   categoryColor: 'bg-green-100 text-green-700',
//   title: 'Article Title Here',
//   description: 'Brief description of the article.',
//   date: 'Month Year',
//   link: 'https://link-to-article.com',
// },
const articles = []

const categories = ['All', 'Impact Report', 'Annual Report', 'Program Summary', 'Research']

const Reports = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredReports =
    activeCategory === 'All'
      ? reports
      : reports.filter((r) => r.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 xs:py-8 sm:py-10 md:py-12">

      {/* Page Header */}
      <div className="max-w-6xl mx-auto text-center mb-8 xs:mb-10 sm:mb-12">
        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Publications
        </span>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 xs:mb-4">
          Reports & Publications
        </h1>
        <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Access SWK Ghana's impact reports, annual reviews, program summaries, research findings, and latest articles.
        </p>
      </div>

      {/* ── Reports Section ── */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200 mb-8 xs:mb-10 sm:mb-12">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-6">
          Reports & Documents
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 xs:gap-3 mb-6 xs:mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs xs:text-sm font-semibold px-3 xs:px-4 py-1.5 xs:py-2 rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`rounded-xl border overflow-hidden hover:shadow-md transition-shadow ${
                report.featured
                  ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {report.thumbnail ? (
                <div className="relative">
                  <img
                    src={report.thumbnail}
                    alt={report.title}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                  {report.featured && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Latest
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                  <span className="text-5xl">📄</span>
                </div>
              )}

              <div className="p-4 xs:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${report.categoryColor}`}>
                    {report.category}
                  </span>
                  <span className="text-xs text-gray-500">{report.date}</span>
                </div>
                <h3 className="text-sm xs:text-base font-semibold text-gray-900 mb-2 leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-4">
                  {report.description}
                </p>

                {report.driveLink ? (
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={report.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      📄 View
                    </a>
                    <a
                      href={report.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs font-semibold text-emerald-600 border border-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      ⬇️ Download PDF
                    </a>
                  </div>
                ) : (
                  <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Articles Section ── */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-4 xs:mb-6">
          Latest Articles
        </h2>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
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
          <div className="flex flex-col items-center justify-center text-center py-12 xs:py-16 border-2 border-dashed border-gray-200 rounded-xl">
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


// ============================================
// HOMEPAGE SNIPPET — paste into Home.jsx
// above the {/* FAQs */} comment
// ============================================
//
// {/* Reports & Publications */}
// <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-200 mb-8 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
//   <div className="max-w-6xl mx-auto">
//     <div className="text-center mb-6 xs:mb-8 sm:mb-10">
//       <span className="inline-block bg-emerald-100 text-emerald-700 text-xs xs:text-sm font-semibold px-3 py-1 rounded-full mb-3">
//         Publications
//       </span>
//       <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 xs:mb-3">
//         Reports & Resources
//       </h2>
//       <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
//         Access our latest impact reports, annual reviews, and research publications.
//       </p>
//     </div>
//
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 mb-8">
//
//       {/* Card 1 – Agribusiness Impact Report */}
//       <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow">
//         <div className="relative">
//           <img
//             src="https://res.cloudinary.com/dwgj3lovn/image/upload/f_auto,q_auto,w_600/v1760551738/SWK_Ghana_Webinar_Thank_you_Flyer_2_rwupaq.png"
//             alt="Agribusiness Webinar Impact Report 2025"
//             className="w-full h-48 object-cover"
//             loading="lazy"
//           />
//           <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
//             Latest Report
//           </span>
//         </div>
//         <div className="p-4 xs:p-5 sm:p-6">
//           <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Impact Report</span>
//           <h3 className="text-base xs:text-lg font-semibold text-gray-900 mt-1 mb-2">
//             Agribusiness Webinar Series Impact Report 2025
//           </h3>
//           <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-4">
//             Three editions. 230+ verified registrants. Full impact metrics, SDG alignment, and demographic insights.
//           </p>
//           <div className="flex flex-wrap gap-2">
//             <a href="https://docs.google.com/document/d/1C7_1Yh86niEFApNaQFBcJn37zLgz3kOb/edit?usp=sharing"
//               target="_blank" rel="noopener noreferrer"
//               className="flex-1 text-center text-xs xs:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 xs:px-4 py-2 rounded-lg transition-colors">
//               📄 View Report
//             </a>
//             <a href="https://docs.google.com/document/d/1C7_1Yh86niEFApNaQFBcJn37zLgz3kOb/export?format=pdf"
//               target="_blank" rel="noopener noreferrer"
//               className="flex-1 text-center text-xs xs:text-sm font-semibold text-emerald-600 border border-emerald-600 hover:bg-emerald-50 px-3 xs:px-4 py-2 rounded-lg transition-colors">
//               ⬇️ Download PDF
//             </a>
//           </div>
//         </div>
//       </div>
//
//       {/* Card 2 – Annual Report */}
//       <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 overflow-hidden hover:shadow-md transition-shadow">
//         <div className="h-48 bg-blue-100 flex items-center justify-center">
//           <span className="text-5xl">📊</span>
//         </div>
//         <div className="p-4 xs:p-5 sm:p-6">
//           <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Annual Report</span>
//           <h3 className="text-base xs:text-lg font-semibold text-gray-900 mt-1 mb-2">
//             SWK Ghana Annual Report 2025
//           </h3>
//           <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-4">
//             Our annual review of programs, partnerships, community impact, and organizational milestones for 2025.
//           </p>
//           <div className="flex flex-wrap gap-2">
//             <a href="https://docs.google.com/document/d/12mrbzehyu34yzYL_xpxm5OcJUoEeAyz8/edit?usp=sharing"
//               target="_blank" rel="noopener noreferrer"
//               className="flex-1 text-center text-xs xs:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 xs:px-4 py-2 rounded-lg transition-colors">
//               📄 View Report
//             </a>
//             <a href="https://docs.google.com/document/d/12mrbzehyu34yzYL_xpxm5OcJUoEeAyz8/export?format=pdf"
//               target="_blank" rel="noopener noreferrer"
//               className="flex-1 text-center text-xs xs:text-sm font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 px-3 xs:px-4 py-2 rounded-lg transition-colors">
//               ⬇️ Download PDF
//             </a>
//           </div>
//         </div>
//       </div>
//
//       {/* Card 3 – Program Summary (Coming Soon) */}
//       <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 overflow-hidden hover:shadow-md transition-shadow">
//         <div className="h-48 bg-purple-100 flex items-center justify-center">
//           <span className="text-5xl">📋</span>
//         </div>
//         <div className="p-4 xs:p-5 sm:p-6">
//           <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Program Summary</span>
//           <h3 className="text-base xs:text-lg font-semibold text-gray-900 mt-1 mb-2">
//             Youth Development Program Summary
//           </h3>
//           <p className="text-xs xs:text-sm text-gray-600 leading-relaxed mb-4">
//             A summary of SWK Ghana's youth development programs, reach, and outcomes across Ghana.
//           </p>
//           <span className="inline-block text-xs xs:text-sm font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-3 xs:px-4 py-2 rounded-lg">
//             Coming Soon
//           </span>
//         </div>
//       </div>
//
//     </div>
//
//     <div className="text-center">
//       <button
//         className="btn-gradient text-sm xs:text-base px-6 xs:px-8 py-2.5 xs:py-3"
//         onClick={() => navigate('/reports')}
//       >
//         View All Reports & Publications →
//       </button>
//     </div>
//   </div>
// </div>
//
//
// ── App.jsx changes ──────────────────────────
// 1. Add import at top:
//    import Reports from './components/Reports'
//
// 2. Add route inside <Routes>:
//    <Route path="/reports" element={<Reports />} />
//
// 3. Add "Reports" to your Navbar links
