import React from 'react'

/**
 * Per-page SEO metadata.
 *
 * React 19 automatically hoists <title>, <meta> and <link> tags rendered
 * anywhere in the tree up into <head>, so each route can declare its own
 * unique title, description and canonical URL. Unique metadata per page is a
 * Google Ad Grants / SEO best practice.
 *
 * @param {string} title        Full document title for the page
 * @param {string} description  Meta description (~150–160 chars)
 * @param {string} path         Route path, e.g. '/about' ('' for home)
 * @param {string} [image]      Absolute OG/Twitter image URL
 * @param {boolean} [noindex]   When true, discourage indexing (e.g. 404)
 */
const SITE = 'https://swkghana.org'
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dwgj3lovn/image/upload/v1760294683/SWK_at_Ga_West_n0c3fz.jpg'

export default function Seo({ title, description, path = '', image = DEFAULT_IMAGE, noindex = false }) {
  const url = `${SITE}${path}`
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
