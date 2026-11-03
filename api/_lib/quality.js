// Automatic checks behind the dashboard's Quality checks screen. Each group
// returns plain results; a group that can't run reports that, without stopping
// the others. Results carry receipt numbers, never donor names.
import { DEFAULT_CAMPAIGN } from './receipts.js'
import { readRegistrations } from './registrations.js'

const SITE = 'https://swkghana.org'
const KEY_PAGES = ['/', '/about', '/our-work', '/donate', '/get-involved', '/blog', '/summit', '/volunteers', '/partners', '/sitemap.xml']
const PAGE_TIMEOUT_MS = 6000
const DAY_MS = 24 * 60 * 60 * 1000
const STALE_BLOG_DAYS = 30
const SILENT_COUNTER_DAYS = 2
const SHOWN_EXAMPLES = 3

const pass = (title, detail = '') => ({ status: 'pass', title, detail })
const warn = (title, detail = '', screen) => ({ status: 'warn', title, detail, screen })
const failed = (title, detail = '', screen) => ({ status: 'fail', title, detail, screen })

const examples = (names) => {
  const shown = names.slice(0, SHOWN_EXAMPLES).join(', ')
  return names.length > SHOWN_EXAMPLES ? `${shown} and ${names.length - SHOWN_EXAMPLES} more` : shown
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

const siteChecks = async ({ fetcher }) => {
  const pages = await Promise.all(
    KEY_PAGES.map(async (path) => {
      try {
        const res = await fetcher(`${SITE}${path}`, { signal: AbortSignal.timeout(PAGE_TIMEOUT_MS) })
        return { path, ok: res.ok, status: res.status, headers: res.headers }
      } catch {
        return { path, ok: false, status: 'no answer' }
      }
    }),
  )
  const broken = pages.filter((p) => !p.ok)
  const secure = pages[0].headers?.get('strict-transport-security')
  return [
    broken.length
      ? failed(`${plural(broken.length, 'key page')} not loading`, broken.map((p) => `${p.path} (${p.status})`).join(', '))
      : pass(`All ${KEY_PAGES.length} key pages are loading`),
    secure ? pass('Secure connection is enforced') : warn('Secure connection header is missing', 'The site is not telling browsers to always use HTTPS.'),
  ]
}

const formChecks = async ({ env, fetcher }) => {
  const { forms } = await readRegistrations(env, fetcher)
  const results = []
  const waiting = forms.filter((f) => ['not-connected', 'needs-update', 'refused'].includes(f.state))
  const down = forms.filter((f) => f.state === 'unreachable')
  const working = forms.filter((f) => f.state === 'ok')
  if (waiting.length) results.push(warn(`${plural(waiting.length, 'form')} not connected to the dashboard`, examples(waiting.map((f) => f.name)), 'registrations'))
  if (down.length) results.push(failed(`${plural(down.length, 'form')} not answering`, `${examples(down.map((f) => f.name))}. People may not be able to register.`, 'registrations'))
  if (working.length) results.push(pass(`${plural(working.length, 'form')} connected`))
  for (const form of working) {
    if (form.duplicates) results.push(warn(`${form.name}: ${plural(form.duplicates, 'repeat entry', 'repeat entries')}`, 'The same email address appears more than once, so the total may be high.', 'registrations'))
  }
  return results
}

const visitChecks = async ({ store }) => {
  const records = await store.listVisits(new Date(Date.now() - SILENT_COUNTER_DAYS * DAY_MS).toISOString().slice(0, 10))
  return [
    records.length
      ? pass('The visit counter is recording')
      : warn('No visits recorded in the last two days', 'Either the site has had no visitors or the counter has stopped.', 'website'),
  ]
}

const contentChecks = async ({ store }) => {
  const { posts, products } = await store.contentAudit()
  const live = posts.filter((p) => p.published !== false)
  const drafts = posts.filter((p) => p.published === false)
  const noCover = live.filter((p) => !p.coverImageUrl)
  const noSummary = live.filter((p) => !p.excerpt)
  const newest = Math.max(0, ...live.map((p) => Date.parse(p.publishedAt || p._createdAt) || 0))
  const quietDays = Math.floor((Date.now() - newest) / DAY_MS)
  const pending = products.filter((p) => p.approved !== true)
  const incomplete = products.filter((p) => p.approved === true && (!p.imageUrl || !p.price))

  return [
    noCover.length ? warn(`${plural(noCover.length, 'live post')} without a cover image`, examples(noCover.map((p) => p.title)), 'posts') : pass('Every live post has a cover image'),
    noSummary.length ? warn(`${plural(noSummary.length, 'live post')} without a summary`, examples(noSummary.map((p) => p.title)), 'posts') : pass('Every live post has a summary'),
    drafts.length ? warn(`${plural(drafts.length, 'draft')} waiting to be published`, examples(drafts.map((p) => p.title)), 'posts') : pass('No drafts waiting'),
    quietDays > STALE_BLOG_DAYS ? warn(`Nothing new on the blog for ${quietDays} days`, '', 'posts') : pass('The blog is up to date'),
    pending.length ? warn(`${plural(pending.length, 'marketplace product')} waiting for review`, examples(pending.map((p) => p.productName)), 'marketplace') : pass('No marketplace products waiting'),
    incomplete.length ? warn(`${plural(incomplete.length, 'marketplace product')} missing a photo or price`, examples(incomplete.map((p) => p.productName)), 'marketplace') : pass('Marketplace listings are complete'),
  ]
}

const missingNumbers = (numbers) => {
  const missing = []
  const years = new Map()
  for (const no of numbers) {
    const [, year, n] = no.split('-')
    years.set(year, Math.max(years.get(year) || 0, parseInt(n, 10) || 0))
  }
  for (const [year, highest] of years) {
    for (let n = 1; n < highest; n++) {
      const no = `SWK-${year}-${String(n).padStart(4, '0')}`
      if (!numbers.includes(no)) missing.push(no)
    }
  }
  return missing
}

const moneyChecks = async ({ store }) => {
  const all = await store.listReceipts()
  const issued = all.filter((r) => r.status !== 'cancelled')
  const campaign = (await store.getCampaign()) || DEFAULT_CAMPAIGN
  const closed = Date.now() > new Date(`${campaign.deadline}T23:59:59Z`).getTime()
  const gaps = missingNumbers(all.map((r) => r.no))
  const noTxn = issued.filter((r) => !r.txn && r.method !== 'Cash')
  const noDate = issued.filter((r) => !r.date)
  const seen = new Map()
  for (const r of issued) if (r.txn) seen.set(r.txn, [...(seen.get(r.txn) || []), r.no])
  const repeated = [...seen.values()].filter((numbers) => numbers.length > 1)

  return [
    (await store.getSignature()) ? pass('The signature is uploaded') : failed('The signature has not been uploaded', 'Receipts print unsigned until it is.', 'receipts'),
    all.length ? pass(`${plural(all.length, 'receipt')} on record`) : warn('No receipts entered yet', '', 'receipts'),
    gaps.length ? failed(`${plural(gaps.length, 'receipt number')} missing from the record`, examples(gaps), 'receipts') : pass('Receipt numbers run without gaps'),
    repeated.length ? failed('The same transaction ID is on more than one receipt', repeated.map((numbers) => numbers.join(' and ')).join('; '), 'receipts') : pass('No transaction ID is used twice'),
    noTxn.length ? warn(`${plural(noTxn.length, 'receipt')} without a transaction ID`, examples(noTxn.map((r) => r.no)), 'receipts') : pass('Every receipt has a transaction ID'),
    noDate.length ? warn(`${plural(noDate.length, 'receipt')} without a payment date`, examples(noDate.map((r) => r.no)), 'receipts') : pass('Every receipt has a payment date'),
    closed ? warn(`${campaign.name} has closed`, 'Set up the next campaign from the Overview.', 'overview') : pass('The campaign is open'),
  ]
}

const teamChecks = async ({ store }) => {
  const users = await store.listUsers()
  const active = users.filter((u) => u.active !== false)
  const temporary = active.filter((u) => u.mustChangePassword)
  return [
    active.filter((u) => u.role === 'owner').length > 1
      ? pass('More than one Owner')
      : warn('Only one Owner', 'If this person is locked out, nobody can manage staff.', 'team'),
    temporary.length ? warn(`${plural(temporary.length, 'person', 'people')} still on a temporary password`, examples(temporary.map((u) => u.name)), 'team') : pass('Everyone has set their own password'),
  ]
}

const GROUPS = [
  { name: 'Website', roles: ['owner', 'finance', 'content', 'viewer'], run: siteChecks },
  { name: 'Registration forms', roles: ['owner', 'finance', 'content', 'viewer'], run: formChecks },
  { name: 'Visit counter', roles: ['owner', 'finance', 'content', 'viewer'], run: visitChecks },
  { name: 'Donations and receipts', roles: ['owner', 'finance'], run: moneyChecks },
  { name: 'Website content', roles: ['owner', 'content'], run: contentChecks },
  { name: 'Team', roles: ['owner'], run: teamChecks },
]

export const quality = async (context) => {
  const groups = await Promise.all(
    GROUPS.filter((group) => group.roles.includes(context.user.role)).map(async ({ name, run }) => {
      try {
        return { name, checks: await run(context) }
      } catch {
        return { name, checks: [failed('This check could not run', 'Try again in a moment.')] }
      }
    }),
  )
  return { groups, checkedAt: new Date().toISOString() }
}
