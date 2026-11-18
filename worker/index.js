// The Cloudflare Worker for swkghana.org. Static files are served by Cloudflare
// directly; this only runs for the paths listed under run_worker_first in
// wrangler.jsonc: the short addresses of the static pages, and /api.

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

// The same security headers as public/_headers, for pages this router serves.
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (ALIASES[path]) {
      url.pathname = ALIASES[path]
      return withSecurityHeaders(await env.ASSETS.fetch(new Request(url, request)))
    }

    if (path.startsWith('/api/')) {
      // The server functions (visit counter, newsletter, dashboard) move here next.
      return withSecurityHeaders(Response.json(
        { error: 'This service is being moved and will be back shortly.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      ))
    }

    return env.ASSETS.fetch(request)
  },
}
