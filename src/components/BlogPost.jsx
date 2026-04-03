import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { client } from '../utils/sanityClient'

const ShareButton = ({ platform, url, title }) => {
  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
  }
  const labels = { facebook: 'Facebook', twitter: 'X', linkedin: 'LinkedIn', whatsapp: 'WhatsApp' }
  const colors = { facebook: '#1877F2', twitter: '#000', linkedin: '#0A66C2', whatsapp: '#25D366' }

  return (
    <a
      href={links[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-80"
      style={{ background: colors[platform] }}
    >
      {labels[platform]}
    </a>
  )
}

// Render Sanity portable text blocks
const renderBlock = (block, idx) => {
  if (block._type === 'image') {
    const ref = block.asset?._ref || ''
    const url = `https://cdn.sanity.io/images/qaen86pl/production/${ref
      .replace('image-', '')
      .replace(/-(\w+)$/, '.$1')}`
    return (
      <img key={idx} src={url} alt={block.alt || ''} className="w-full rounded-xl my-6 shadow" />
    )
  }
  if (block._type !== 'block') return null

  const style = block.style || 'normal'
  const text = block.children?.map((span) => {
    let t = span.text
    if (span.marks?.includes('strong')) t = <strong key={span._key}>{t}</strong>
    if (span.marks?.includes('em')) t = <em key={span._key}>{t}</em>
    if (span.marks?.includes('underline')) t = <u key={span._key}>{t}</u>
    return t
  })

  const classMap = {
    h1: 'text-3xl font-bold text-gray-900 mt-8 mb-4',
    h2: 'text-2xl font-bold text-gray-900 mt-8 mb-3',
    h3: 'text-xl font-bold text-gray-900 mt-6 mb-2',
    normal: 'text-gray-700 leading-relaxed mb-4',
    blockquote: 'border-l-4 pl-4 italic text-gray-600 my-4',
  }

  if (style === 'h1') return <h1 key={idx} className={classMap.h1}>{text}</h1>
  if (style === 'h2') return <h2 key={idx} className={classMap.h2}>{text}</h2>
  if (style === 'h3') return <h3 key={idx} className={classMap.h3}>{text}</h3>
  if (style === 'blockquote') return <blockquote key={idx} className={classMap.blockquote}>{text}</blockquote>

  if (block.listItem === 'bullet') return <li key={idx} className="text-gray-700 mb-1 ml-4 list-disc">{text}</li>
  if (block.listItem === 'number') return <li key={idx} className="text-gray-700 mb-1 ml-4 list-decimal">{text}</li>

  return <p key={idx} className={classMap.normal}>{text}</p>
}

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0] {
          _id, title, slug, category, excerpt,
          publishedAt, coverImage, author, body
        }`,
        { slug }
      )
      .then((data) => {
        if (!data) setNotFound(true)
        else setPost(data)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin mb-4"
          style={{ borderColor: '#78C31E', borderTopColor: 'transparent' }} />
        <p className="text-gray-500">Loading post...</p>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Post not found</h2>
        <Link to="/blog" className="font-semibold" style={{ color: '#78C31E' }}>← Back to Blog</Link>
      </div>
    </div>
  )

  const coverUrl = post.coverImage
    ? `https://cdn.sanity.io/images/qaen86pl/production/${post.coverImage.asset._ref
        .replace('image-', '')
        .replace(/-(\w+)$/, '.$1')}`
    : null

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      {coverUrl && (
        <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <img src={coverUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 max-w-3xl">
        {/* Back link */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold mb-6"
          style={{ color: '#78C31E' }}>
          ← Back to Blog
        </Link>

        {/* Meta */}
        {post.category && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{ background: '#F2FAE8', color: '#1E963C' }}>
            {post.category}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <span>By <strong className="text-gray-700">{post.author || 'SWK Ghana'}</strong></span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>

        {/* Share buttons — top */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm font-semibold text-gray-500 self-center mr-1">Share:</span>
          {['facebook', 'twitter', 'linkedin', 'whatsapp'].map((p) => (
            <ShareButton key={p} platform={p} url={url} title={post.title} />
          ))}
        </div>

        {/* Body */}
        <article className="prose max-w-none">
          {post.body?.map((block, idx) => renderBlock(block, idx))}
        </article>

        {/* Share buttons — bottom */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-500 self-center mr-1">Share this post:</span>
          {['facebook', 'twitter', 'linkedin', 'whatsapp'].map((p) => (
            <ShareButton key={p} platform={p} url={url} title={post.title} />
          ))}
        </div>

        <div className="mt-8">
          <Link to="/blog" className="inline-flex items-center gap-2 font-semibold"
            style={{ color: '#78C31E' }}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPost