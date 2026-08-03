import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../utils/sanityClient'
import Seo from './Seo'

const CATEGORIES = ['All', 'Event Recaps', 'Program Updates', 'Impact Stories', 'Opinion', 'Articles']

// Cloudinary hero image (SWK Ghana community photo), responsive + optimised.
const CLD = 'https://res.cloudinary.com/dwgj3lovn/image/upload'
const HERO_PATH = 'v1760294683/SWK_at_Ga_West_n0c3fz.jpg'
const heroSrc = (w) => `${CLD}/f_auto,q_auto,w_${w}/${HERO_PATH}`
const heroSrcSet = [768, 1280, 1920, 2560].map((w) => `${heroSrc(w)} ${w}w`).join(', ')

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    client
      .fetch(`*[_type == "post" && (published == true || !defined(published))] | order(publishedAt desc, _createdAt desc) {
        _id,
        title,
        slug,
        category,
        excerpt,
        publishedAt,
        _createdAt,
        coverImage,
        coverImageUrl,
        author
      }`)
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Blog fetch error:', err)
        setLoading(false)
      })
  }, [])

  // Normalize category for matching — handles singular stored values from older posts
  const normalizeCategory = (cat) =>
    (cat || '').replace(/s$/i, '').toLowerCase().trim()

  const filtered = posts.filter((p) => {
    const matchCat =
      activeCategory === 'All' ||
      p.category === activeCategory ||
      normalizeCategory(p.category) === normalizeCategory(activeCategory)
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
      <Seo
        title="Blog & Stories | SWK Ghana"
        description="Stories, updates, and insights from SWK Ghana on youth empowerment, climate action, agribusiness, and sustainable development across Ghana and Africa."
        path="/blog"
      />
      {/* Hero — full height with blended background image */}
      <section className="relative flex items-center justify-center overflow-hidden min-h-[88vh] md:min-h-[calc(100dvh-6rem)]">
        {/* Background photo */}
        <img
          src={heroSrc(1920)}
          srcSet={heroSrcSet}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Blend layers: brand green multiply + depth + vignette for legible white text */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E963C] via-[#1E963C]/70 to-[#0e3a1b] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center py-24 anim-rise">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest text-white mb-6 border border-white/30 bg-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8E04A]" /> SWK Ghana Blog
          </span>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05] drop-shadow-sm">
            Stories &amp; Insights
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed font-light">
            Updates, impact stories, and thought leadership from SWK Ghana&apos;s work in
            youth empowerment, climate action, circular economy, agribusiness, and technology.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#blog-posts" className="btn-gradient text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg">
              Read the Latest
            </a>
            <Link
              to="/get-involved"
              className="px-7 py-3.5 rounded-xl font-bold text-white text-sm sm:text-base border-2 border-white/70 hover:bg-white hover:text-[#1E963C] transition-colors"
            >
              Get Involved
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <a
          href="#blog-posts"
          aria-label="Scroll to blog posts"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8 anim-bounce-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </a>
      </section>

      <div id="blog-posts" className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 scroll-mt-24">
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
                    <span>{formatDate(post.publishedAt || post._createdAt)}</span>
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