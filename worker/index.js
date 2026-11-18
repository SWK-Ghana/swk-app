// The Cloudflare Worker for swkghana.org. Static files are served by Cloudflare
// directly; this only runs for the paths listed under run_worker_first in
// wrangler.jsonc: the short addresses of the static pages, and /api.
//
// The server functions in api/ are written for Vercel (Node-style req and res).
// asNode() below hands them a request in that shape, so the same tested code
// runs on both hosts. Their settings come from process.env, which Cloudflare
// fills from the Worker's variables and secrets (nodejs_compat).
import admin from '../api/admin.js'
import subscribe from '../api/subscribe.js'
import visit from '../api/visit.js'

const API = { '/api/admin': admin, '/api/subscribe': subscribe, '/api/visit': visit }

// Short addresses that show a static page (the same as the rewrites in vercel.json).
const ALIASES = {
  '/epwwebinar': '/pitch-workshop-2026',
  '/pitch': '/pitch-workshop-2026',
  '/volunteers': '/summit-call-for-volunteers',
  '/feedback': '/summit-feedback',
  '/speaker-feedback': '/summit-speaker-feedback',
  '/mentorship': '/summit-mentorship',
  '/become-a-mentor': '/mentorship-2027-mentors',
  '/partners': '/summit-call-for-partners',
}

// The same security headers as public/_headers, for responses this router makes.
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

const withSecurityHeaders = (response) => {
  const out = new Response(response.body, response)
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) out.headers.set(key, value)
  return out
}

/** Runs a Vercel-style (req, res) handler for a Fetch API request. */
export const asNode = async (handler, request) => {
  const headers = Object.fromEntries(request.headers)
  // What Vercel sets, from Cloudflare's own equivalents.
  if (!headers['x-forwarded-for']) headers['x-forwarded-for'] = request.headers.get('cf-connecting-ip') || ''
  if (request.cf?.country) headers['x-vercel-ip-country'] = request.cf.country

  // Vercel parses JSON bodies and leaves anything else (sendBeacon) as text.
  let body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text()
  if (body && (headers['content-type'] || '').includes('application/json')) {
    try { body = JSON.parse(body) } catch { /* the handler reports bad JSON itself */ }
  }

  let status = 200
  let payload = null
  const out = new Headers()
  const res = {
    status(code) { status = code; return res },
    setHeader(key, value) { out.set(key, value); return res },
    json(value) { out.set('Content-Type', 'application/json; charset=utf-8'); payload = JSON.stringify(value); return res },
    send(value) { payload = value; return res },
    end(value) { if (value !== undefined) payload = value; return res },
  }
  await handler({ method: request.method, headers, body }, res)
  if (!out.has('Cache-Control')) out.set('Cache-Control', 'no-store')
  return new Response(status === 204 || status === 304 ? null : payload, { status, headers: out })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (ALIASES[path]) {
      url.pathname = ALIASES[path]
      return withSecurityHeaders(await env.ASSETS.fetch(new Request(url, request)))
    }

    // Which settings the server can see: yes or no for each name, never a value.
    if (path === '/api/health') {
      const names = ['SANITY_TOKEN', 'ADMIN_SESSION_SECRET', 'ADMIN_PASSWORD', 'REGISTRATION_STATS_KEY', 'BREVO_API_KEY']
      const seen = (source) => Object.fromEntries(names.map((n) => [n, Boolean(source && source[n])]))
      return withSecurityHeaders(Response.json(
        { worker: seen(env), process: seen(globalThis.process?.env) },
        { headers: { 'Cache-Control': 'no-store' } },
      ))
    }

    if (API[path]) {
      try {
        return withSecurityHeaders(await asNode(API[path], request))
      } catch {
        return withSecurityHeaders(Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 }))
      }
    }

    if (path.startsWith('/api/')) {
      return withSecurityHeaders(Response.json({ error: 'Not found.' }, { status: 404 }))
    }

    return env.ASSETS.fetch(request)
  },
}
