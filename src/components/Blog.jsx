import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['All', 'Event Recap', 'Program Update', 'Impact Story', 'Opinion']

const categoryColors = {
  'Event Recap': 'bg-blue-100 text-blue-700',
  'Program Update': 'bg-emerald-100 text-emerald-700',
  'Impact Story': 'bg-purple-100 text-purple-700',
  'Opinion': 'bg-orange-100 text-orange-700',
}

const Blog = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const stored = localStorage.getItem('swk_blog_posts')
    if (stored) setPosts(JSON.parse(stored))
  }, [])

  const filtered = activeCategory === 'All'
    ? posts.filter(p => p.published)
    : posts.filter(p => p.published && p.category === activeCategory)

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 mb-3 text-center">Blog & News</h1>
          <p className="text-base xs:text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Updates, stories, and insights from SWK Ghana's programs and community.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <span className="text-5xl mb-4 block">📝</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-500 text-sm">Check back soon for updates from SWK Ghana.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center">
                      <span className="text-4xl">🌱</span>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400">{post.date}</span>
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug">{post.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-4 text-sm font-semibold text-emerald-600 flex items-center gap-1">
                      Read more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Blog