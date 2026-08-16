// Build-time prerenderer + sitemap generator.
//
// Runs after `vite build` (client → dist/) and `vite build --ssr` (server →
// dist-ssr/). For every route — static pages plus every published blog post —
// it renders real HTML into dist/<route>/index.html and regenerates
// dist/sitemap.xml. Vercel serves existing static files before applying the
// SPA rewrite, so crawlers get full content while the React app still
// hydrates normally in the browser.
//
// Best-effort by design: a failure prerendering one route skips that route
// (the SPA fallback still works); only a total systemic failure warns loudly.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://swkghana.org'

const STATIC_ROUTES = [
  '/', '/about', '/our-work', '/team', '/resources', '/faq', '/get-involved',
  '/contact', '/donate', '/reports', '/blog', '/marketplace', '/taka-kipawa',
  '/privacy-policy',
]

// ── Fetch published blog slugs from Sanity (public dataset, no token) ────────
async function fetchPosts() {
  const query = encodeURIComponent(
    '*[_type=="post" && (published==true || !defined(published))]{ "slug": slug.current, publishedAt, _updatedAt }'
  )
  const res = await fetch(
    `https://qaen86pl.apicdn.sanity.io/v2024-01-01/data/query/production?query=${query}`
  )
  if (!res.ok) throw new Error(`Sanity query failed (${res.status})`)
  const data = await res.json()
  return (data.result || []).filter((p) => p.slug)
}

// ── Sitemap ──────────────────────────────────────────────────────────────────
function buildSitemap(posts) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = []
  for (const route of STATIC_ROUTES) {
    const priority = route === '/' ? '1.0' : ['/our-work', '/donate'].includes(route) ? '0.9' : '0.8'
    urls.push(`  <url>\n    <loc>${SITE}${route === '/' ? '/' : route}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`)
  }
  for (const p of posts) {
    const lastmod = (p._updatedAt || p.publishedAt || today).slice(0, 10)
    urls.push(`  <url>\n    <loc>${SITE}/blog/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>0.7</priority>\n  </url>`)
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

// ── Move page-level <title>/<meta>/<link> from the app HTML into <head>, ────
//    replacing any same-named tags the template already carries.
function mergeHead(template, appHtml) {
  const headTags = []
  const tagRe = /<title[^>]*>[\s\S]*?<\/title>|<meta\s[^>]*?\/?>|<link\s[^>]*?\/?>/g
  const body = appHtml.replace(tagRe, (m) => {
    const isTitle = /^<title/i.test(m)
    const isMeta = /^<meta/i.test(m) && /\b(name|property)="/.test(m)
    const isCanonical = /^<link/i.test(m) && /rel="canonical"/.test(m)
    if (isTitle || isMeta || isCanonical) {
      headTags.push(m)
      return ''
    }
    return m
  })

  let head = template
  for (const tag of headTags) {
    if (/^<title/i.test(tag)) {
      head = head.replace(/<title[^>]*>[\s\S]*?<\/title>/, '')
    } else {
      const attr = tag.match(/\b(name|property)="([^"]+)"/)
      if (attr) {
        const [, kind, value] = attr
        head = head.replace(new RegExp(`<meta\\s[^>]*${kind}="${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*?/?>`, 'g'), '')
      }
      if (/rel="canonical"/.test(tag)) {
        head = head.replace(/<link\s[^>]*rel="canonical"[^>]*?\/?>/g, '')
      }
    }
  }
  head = head.replace('</head>', `  ${headTags.join('\n  ')}\n</head>`)
  return { head, body }
}

// ── Main ─────────────────────────────────────────────────────────────────────
const template = readFileSync(join(dist, 'index.html'), 'utf8')

let posts = []
try {
  posts = await fetchPosts()
  console.log(`Fetched ${posts.length} blog posts from Sanity`)
} catch (err) {
  console.warn(`⚠ Could not fetch blog posts (${err.message}) — prerendering static routes only`)
}

writeFileSync(join(dist, 'sitemap.xml'), buildSitemap(posts))
console.log(`Wrote sitemap.xml (${STATIC_ROUTES.length + posts.length} URLs)`)

let render
try {
  ;({ render } = await import(new URL(`file://${join(root, 'dist-ssr', 'entry-server.js').replace(/\\/g, '/')}`)))
} catch (err) {
  console.warn(`⚠ SSR bundle failed to load — skipping prerender (SPA still works). ${err.message}`)
  process.exit(0)
}

const routes = [...STATIC_ROUTES, ...posts.map((p) => `/blog/${p.slug}`)]
let ok = 0
let failed = 0

for (const route of routes) {
  try {
    const result = await render(route)
    if (!result?.html) throw new Error(result?.redirect ? `redirects to ${result.redirect}` : 'empty output')
    const { head, body } = mergeHead(template, result.html)
    const pageHtml = head.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${body}</div>`
    )
    const outDir = route === '/' ? dist : join(dist, ...route.split('/').filter(Boolean))
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'index.html'), pageHtml)
    ok++
  } catch (err) {
    failed++
    console.warn(`✗ ${route}: ${err.message}`)
  }
}

// The server bundle must not ship inside the deployed static output.
if (existsSync(join(root, 'dist-ssr'))) rmSync(join(root, 'dist-ssr'), { recursive: true, force: true })

console.log(`\nPrerendered ${ok}/${routes.length} routes${failed ? ` (${failed} failed — SPA fallback covers them)` : ''}`)
if (ok === 0) console.warn('⚠⚠ Prerender produced no pages — the deploy will behave as a plain SPA.')
