import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const categoryColors = {
  'Event Recap': 'bg-blue-100 text-blue-700',
  'Program Update': 'bg-[#F2FAE8] text-[#1E963C]',
  'Impact Story': 'bg-purple-100 text-purple-700',
  'Opinion': 'bg-orange-100 text-orange-700',
}

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
    {
      label: 'Facebook',
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
    },
    {
      label: 'X',
      color: 'bg-black hover:bg-gray-800',
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>,
    },
    {
      label: 'LinkedIn',
      color: 'bg-[#0A66C2] hover:bg-[#095fb6]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>,
    },
    {
      label: 'WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#1ebe5d]',
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>,
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-gray-800">Share:</span>
      {shares.map(({ label, color, href, icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className={`${color} text-white rounded-lg p-2 transition-colors`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
        </a>
      ))}
      <button onClick={copyLink} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
        {copied ? '✓ Copied!' : '🔗 Copy link'}
      </button>
    </div>
  )
}

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('swk_blog_posts')
    if (stored) {
      const posts = JSON.parse(stored)
      const found = posts.find(p => p.slug === slug && p.published)
      setPost(found || null)
    }
  }, [slug])

  if (!post) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white to-white flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
          <span className="text-5xl mb-4 block">🔍</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-700 text-sm mb-5">This post may have been removed or doesn't exist.</p>
          <button onClick={() => navigate('/blog')} className="btn-gradient px-6 py-2 text-sm">Back to Blog</button>
        </div>
      </main>
    )
  }

  const postUrl = `https://swkghana.org/blog/${post.slug}`

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-white">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-sm text-[#78C31E] font-semibold mb-6 hover:underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="w-full h-56 sm:h-72 object-cover" />
            )}
            <div className="p-5 xs:p-6 sm:p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">{post.date}</span>
                {post.author && <span className="text-xs text-gray-400">by {post.author}</span>}
              </div>

              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

              {/* Share buttons — top */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* Post content */}
              <div
                className="prose prose-emerald max-w-none text-gray-700 leading-relaxed text-sm xs:text-base [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_p]:my-3 [&_a]:text-[#78C31E] [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4 [&_strong]:font-bold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share buttons — bottom */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Found this helpful? Share it:</p>
                <ShareButtons url={postUrl} title={post.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export { ShareButtons }
export default BlogPost