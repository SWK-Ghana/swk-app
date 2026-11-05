// Newsletter sign-up. The browser sends only an email address; the Brevo key
// stays on the server.
const BREVO_CONTACTS = 'https://api.brevo.com/v3/contacts'
const LIST_ID = 2
const SITE_HOSTS = ['swkghana.org', 'www.swkghana.org', 'localhost']
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i
const MAX_PER_MINUTE = 5
const MAX_TRACKED_ADDRESSES = 5000

const fromSite = (headers) => {
  try {
    return SITE_HOSTS.includes(new URL(headers.origin || headers.referer).hostname)
  } catch {
    return false
  }
}

const recent = new Map() // address -> { minute, count }, held only in this instance's memory

const tooMany = (address, now) => {
  const minute = Math.floor(now / 60000)
  const entry = recent.get(address)
  if (!entry || entry.minute !== minute) {
    if (recent.size >= MAX_TRACKED_ADDRESSES) recent.clear()
    recent.set(address, { minute, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_MINUTE
}

/** Handles POST /api/subscribe with { email }. */
export const createSubscribeHandler = (env, fetcher = fetch, now = Date.now) => async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }
  const key = env.BREVO_API_KEY || env.VITE_BREVO_API_KEY
  if (!key) return res.status(503).json({ error: 'Newsletter sign-up is not set up yet.' })
  if (!fromSite(req.headers)) return res.status(403).json({ error: 'Not allowed.' })

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  } catch {
    body = {}
  }
  const email = String(body.email || '').trim().toLowerCase()
  if (!EMAIL.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })

  const address = String(req.headers['x-forwarded-for'] || '').split(',')[0]
  if (tooMany(address, now())) return res.status(429).json({ error: 'Too many tries. Please wait a minute.' })

  try {
    const upstream = await fetcher(BREVO_CONTACTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': key },
      body: JSON.stringify({ email, listIds: [LIST_ID], updateEnabled: true }),
    })
    if (!upstream.ok && upstream.status !== 204) {
      return res.status(502).json({ error: 'Sign-up failed. Please try again later.' })
    }
  } catch {
    return res.status(502).json({ error: 'Sign-up failed. Please try again later.' })
  }
  return res.status(204).end()
}
