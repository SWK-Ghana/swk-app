// SWK's own visit counter. No cookies, and no IP address or other personal detail
// is stored: each day is one private document holding totals by page, source,
// device and country.
const SITE_HOSTS = ['swkghana.org', 'www.swkghana.org']
const BOTS = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|facebookexternalhit|whatsapp/i
const PAGE = /^\/[a-z0-9/_-]{0,79}$/i
const HIDDEN_PAGE = /^\/(admin|api)(\/|$)/
const HOST = /^[a-z0-9.-]{1,60}$/i
const EVENTS = ['donate_start', 'donate', 'donate_interest', 'contact_submit', 'volunteer_signup', 'partnership_inquiry']
const MAX_PER_MINUTE = 120
const MAX_TRACKED_ADDRESSES = 5000
const DAY_MS = 24 * 60 * 60 * 1000
const HISTORY_DAYS = 30
const TOP_ROWS = 10

// Sanity field names can't hold "/" or ".", so names are stored as hex.
const toKey = (name) => `k${Buffer.from(name).toString('hex')}`
const fromKey = (key) => Buffer.from(key.slice(1), 'hex').toString()

const dayOf = (time) => new Date(time).toISOString().slice(0, 10)

const SOURCES = [
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)(bing|duckduckgo|yahoo)\./, 'Other search'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'Facebook'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'LinkedIn'],
  [/(^|\.)tiktok\.com$/, 'TikTok'],
  [/^(t\.co|x\.com|twitter\.com)$/, 'X'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, 'WhatsApp'],
]

const sourceName = (host) => {
  if (!host) return 'Direct or shared link'
  const lower = host.toLowerCase()
  const known = SOURCES.find(([pattern]) => pattern.test(lower))
  return known ? known[1] : lower.replace(/^www\./, '')
}

const deviceName = (agent) => {
  if (/ipad|tablet/i.test(agent)) return 'Tablet'
  return /mobi|android|iphone/i.test(agent) ? 'Phone' : 'Computer'
}

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

/** What one report adds to the day's totals, or null if it shouldn't count. */
export const visitFields = (body, headers) => {
  if (!fromSite(headers) || BOTS.test(headers['user-agent'] || '')) return null

  if (body.event !== undefined) {
    return EVENTS.includes(body.event) ? [`events.${toKey(body.event)}`] : null
  }

  const page = String(body.path || '').replace(/\.html$/, '').replace(/(.)\/$/, '$1')
  if (!PAGE.test(page) || HIDDEN_PAGE.test(page)) return null

  const fields = ['views', `pages.${toKey(page)}`]
  if (body.first === true) {
    const host = String(body.from || '')
    const country = String(headers['x-vercel-ip-country'] || '')
    fields.push('visits')
    fields.push(`sources.${toKey(sourceName(HOST.test(host) ? host : ''))}`)
    fields.push(`devices.${toKey(deviceName(headers['user-agent'] || ''))}`)
    if (/^[A-Z]{2}$/.test(country)) fields.push(`countries.${toKey(country)}`)
  }
  return fields
}

/** Handles POST /api/visit. It answers 204 either way and never shows why a report was dropped. */
export const createVisitHandler = (makeStore, now = Date.now) => async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const address = String(req.headers['x-forwarded-for'] || '').split(',')[0]
    const fields = visitFields(body, req.headers)
    if (fields && !tooMany(address, now())) await makeStore().recordVisit(dayOf(now()), fields)
  } catch {
    // A visit that wasn't counted must never trouble the visitor.
  }
  return res.status(204).end()
}

const add = (totals, group = {}) => {
  for (const [key, count] of Object.entries(group)) {
    const name = fromKey(key)
    totals[name] = (totals[name] || 0) + count
  }
}

const ranked = (totals) =>
  Object.entries(totals)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_ROWS)

export const visitors = async ({ store }) => {
  const now = Date.now()
  const first = dayOf(now - (HISTORY_DAYS * 2 - 1) * DAY_MS)
  const records = await store.listVisits(first)
  const byDay = new Map(records.map((r) => [r.day, r]))
  const sum = (from, to, field) => {
    let total = 0
    for (let i = from; i < to; i++) total += byDay.get(dayOf(now - i * DAY_MS))?.[field] || 0
    return total
  }

  const groups = { pages: {}, sources: {}, devices: {}, countries: {}, events: {} }
  const days = []
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const day = dayOf(now - i * DAY_MS)
    const record = byDay.get(day)
    days.push({ day, count: record?.visits || 0 })
    if (record) Object.keys(groups).forEach((name) => add(groups[name], record[name]))
  }

  return {
    today: sum(0, 1, 'visits'),
    last7: sum(0, 7, 'visits'),
    previous7: sum(7, 14, 'visits'),
    last30: sum(0, HISTORY_DAYS, 'visits'),
    views30: sum(0, HISTORY_DAYS, 'views'),
    latest: records.at(-1)?.day || '',
    days,
    pages: ranked(groups.pages),
    sources: ranked(groups.sources),
    devices: ranked(groups.devices),
    countries: ranked(groups.countries),
    events: ranked(groups.events),
  }
}
