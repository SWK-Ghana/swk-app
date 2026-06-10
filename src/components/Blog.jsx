import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../utils/sanityClient'

const CATEGORIES = ['All', 'Event Recaps', 'Program Updates', 'Impact Stories', 'Opinion']

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    client
      .fetch(`*[_type == "post" && published != false] | order(publishedAt desc) {
        _id,
        title,
        slug,
        category,
        excerpt,
        publishedAt,
        coverImage,
        coverImageUrl,
        author
      }`)
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="py-16 md:py-20" style={{ background: 'linear-gradient(135deg, #1E963C 0%, #78C31E 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white mb-4"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            SWK Ghana Blog
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Stories & Insights
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Updates, impact stories, and thought leadership from SWK Ghana's youth empowerment work.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none text-gray-800"
            style={{ '--tw-ring-color': '#78C31E' }}
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
              style={
                activeCategory === cat
                  ? { background: '#78C31E', borderColor: '#78C31E', color: '#fff' }
                  : { background: '#fff', borderColor: '#e5e7eb', color: '#3C3C2D' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin"
              style={{ borderColor: '#78C31E', borderTopColor: 'transparent' }} />
            <p className="mt-4 text-gray-500">Loading posts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-500">Check back soon for updates from SWK Ghana.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug?.current}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                {post.coverImageUrl ? (
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : post.coverImage ? (
                  <img
                    src={`https://cdn.sanity.io/images/qaen86pl/production/${post.coverImage.asset._ref
                      .replace('image-', '')
                      .replace('-jpg', '.jpg')
                      .replace('-png', '.png')
                      .replace('-webp', '.webp')}`}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-4xl"
                    style={{ background: '#F2FAE8' }}>
                    📝
                  </div>
                )}
                <div className="p-5">
                  {post.category && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                      style={{ background: '#F2FAE8', color: '#1E963C' }}>
                      {post.category}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.author || 'SWK Ghana'}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog