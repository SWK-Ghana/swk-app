import test from 'node:test'
import assert from 'node:assert/strict'
import { createHandler } from '../api/_lib/handler.js'
import { createVisitHandler, visitFields } from '../api/_lib/visits.js'
import { fakeStore } from './fake-store.mjs'

const ENV = { ADMIN_PASSWORD: 'bootstrap-password', ADMIN_SESSION_SECRET: 'test-secret', SANITY_TOKEN: 'x', REGISTRATION_STATS_KEY: 'the-key' }
const OWNER = { name: 'Owner', email: 'owner@swkghana.org', password: 'owner-password-1' }
const VISITOR = { origin: 'https://swkghana.org', 'user-agent': 'Mozilla/5.0 (Linux; Android 14) Mobile', 'x-forwarded-for': '1.2.3.4', 'x-vercel-ip-country': 'GH' }
const DAY_MS = 24 * 60 * 60 * 1000

const STATS = { ok: true, total: 40, last7: 9, previous7: 4, duplicates: 2, latest: '2026-11-02', daily: { '2026-11-02': 3 }, groups: { gender: [{ name: 'Female', count: 22 }] } }

// A pretend internet: the form scripts and the site's own pages.
const internet = ({ forms = STATS, pagesUp = true } = {}) => async (url) => {
  if (url.startsWith('https://script.google.com')) {
    if (forms === 'down') throw new Error('timeout')
    return { json: async () => forms }
  }
  return { ok: pagesUp, status: pagesUp ? 200 : 500, headers: new Headers({ 'strict-transport-security': 'max-age=1' }) }
}

const signedIn = async ({ fetcher = internet(), env = ENV, role = 'owner' } = {}) => {
  const store = fakeStore()
  const handler = createHandler(() => store, env, fetcher)
  const call = async (action, body = {}) => {
    let status = 200
    let payload
    const res = { setHeader() {}, status(s) { status = s; return this }, json(p) { payload = p; return this } }
    await handler({ method: 'POST', body: { action, ...body } }, res)
    return { status, ...payload }
  }
  await call('setup', { adminPassword: ENV.ADMIN_PASSWORD, ...OWNER })
  let { token } = await call('login', { email: OWNER.email, password: OWNER.password })
  if (role !== 'owner') {
    const { temporaryPassword } = await call('users.create', { name: 'Staff', email: 'staff@swkghana.org', role, token })
    ;({ token } = await call('login', { email: 'staff@swkghana.org', password: temporaryPassword }))
    await call('password.change', { token, currentPassword: temporaryPassword, newPassword: 'staff-password-1' })
    ;({ token } = await call('login', { email: 'staff@swkghana.org', password: 'staff-password-1' }))
  }
  return { store, call, token }
}

const checks = (result) => result.groups.flatMap((g) => g.checks)
const titled = (result, words) => checks(result).find((c) => c.title.includes(words))

test('registrations need a signed-in person', async () => {
  const { call } = await signedIn()
  assert.equal((await call('registrations', { token: 'nonsense' })).status, 401)
  assert.equal((await call('visitors')).status, 401)
  assert.equal((await call('quality')).status, 401)
})

test('every role can read the registration totals', async () => {
  for (const role of ['owner', 'finance', 'content', 'viewer']) {
    const { call, token } = await signedIn({ role })
    const { status, forms } = await call('registrations', { token })
    assert.equal(status, 200)
    assert.equal(forms.length, 5)
    assert.equal(forms[0].total, 40)
  }
})

test('each form says plainly why it has no numbers', async () => {
  const states = async (options) => {
    const { call, token } = await signedIn(options)
    return (await call('registrations', { token })).forms[0].state
  }
  assert.equal(await states({ env: { ...ENV, REGISTRATION_STATS_KEY: '' } }), 'not-connected')
  assert.equal(await states({ fetcher: internet({ forms: { ok: true, status: 'ready' } }) }), 'needs-update')
  assert.equal(await states({ fetcher: internet({ forms: { ok: false, error: 'not allowed' } }) }), 'refused')
  assert.equal(await states({ fetcher: internet({ forms: 'down' }) }), 'unreachable')
})

test('a page view is counted with its source, device and country', async () => {
  const store = fakeStore()
  const handler = createVisitHandler(() => store, () => Date.parse('2026-11-03T10:00:00Z'))
  let status
  const res = { setHeader() {}, status(s) { status = s; return this }, end() { return this } }
  await handler({ method: 'POST', headers: VISITOR, body: JSON.stringify({ path: '/about/', first: true, from: 'www.google.com' }) }, res)
  await handler({ method: 'POST', headers: VISITOR, body: { path: '/donate' } }, res)
  assert.equal(status, 204)
  const day = store.visits.get('2026-11-03')
  assert.equal(day.views, 2)
  assert.equal(day.visits, 1)
  assert.deepEqual(Object.keys(day.sources).map((k) => Buffer.from(k.slice(1), 'hex').toString()), ['Google'])
  assert.deepEqual(Object.keys(day.devices).map((k) => Buffer.from(k.slice(1), 'hex').toString()), ['Phone'])
  assert.deepEqual(Object.keys(day.countries).map((k) => Buffer.from(k.slice(1), 'hex').toString()), ['GH'])
  assert.doesNotMatch(JSON.stringify(day), /1\.2\.3\.4/)
})

test('reports from elsewhere, bots, staff pages and junk are ignored', () => {
  const view = { path: '/about' }
  assert.equal(visitFields(view, { ...VISITOR, origin: 'https://evil.example' }), null)
  assert.equal(visitFields(view, { 'user-agent': 'Mozilla' }), null)
  assert.equal(visitFields(view, { ...VISITOR, 'user-agent': 'Googlebot/2.1' }), null)
  assert.equal(visitFields({ path: '/admin' }, VISITOR), null)
  assert.equal(visitFields({ path: '/api/visit' }, VISITOR), null)
  assert.equal(visitFields({ path: '/<script>' }, VISITOR), null)
  assert.equal(visitFields({ path: `/${'a'.repeat(200)}` }, VISITOR), null)
  assert.equal(visitFields({ event: 'made_up' }, VISITOR), null)
  assert.ok(visitFields({ event: 'donate_start' }, VISITOR))
})

test('a flood of reports from one address stops being saved', async () => {
  const store = fakeStore()
  const handler = createVisitHandler(() => store, () => Date.parse('2026-11-03T10:00:00Z'))
  const res = { setHeader() {}, status() { return this }, end() { return this } }
  const headers = { ...VISITOR, 'x-forwarded-for': '9.9.9.9' }
  for (let i = 0; i < 200; i++) await handler({ method: 'POST', headers, body: { path: '/about' } }, res)
  assert.equal(store.visits.get('2026-11-03').views, 120)
})

test('the visitors report totals by week and names the pages', async () => {
  const { store, call, token } = await signedIn()
  const today = new Date().toISOString().slice(0, 10)
  const earlier = new Date(Date.now() - 10 * DAY_MS).toISOString().slice(0, 10)
  await store.recordVisit(today, ['views', 'visits', `pages.k${Buffer.from('/about').toString('hex')}`])
  await store.recordVisit(earlier, ['views', 'visits', `pages.k${Buffer.from('/about').toString('hex')}`])
  const report = await call('visitors', { token })
  assert.equal(report.today, 1)
  assert.equal(report.last7, 1)
  assert.equal(report.previous7, 1)
  assert.equal(report.last30, 2)
  assert.equal(report.days.length, 30)
  assert.deepEqual(report.pages, [{ name: '/about', count: 2 }])
})

test('quality checks find missing receipt numbers and repeated transaction IDs', async () => {
  const { call, token } = await signedIn()
  const receipt = { name: 'Private Donor', amount: 512, method: 'MTN Mobile Money', txn: '555', purpose: 'Agribusiness Summit 2026 · Sponsor a Seat' }
  await call('receipts.record', { token, no: 'SWK-2026-0002', issued: '2026-11-02', receipt })
  await call('receipts.record', { token, no: 'SWK-2026-0003', issued: '2026-11-02', receipt })
  const result = await call('quality', { token })
  assert.match(titled(result, 'missing from the record').detail, /SWK-2026-0001/)
  assert.equal(titled(result, 'missing from the record').status, 'fail')
  assert.match(titled(result, 'same transaction ID').detail, /SWK-2026-000[23] and SWK-2026-000[23]/)
  assert.equal(titled(result, 'signature').status, 'fail')
  assert.doesNotMatch(JSON.stringify(result), /Private Donor/)
})

test('quality checks report broken pages and silent forms', async () => {
  const { call, token } = await signedIn({ fetcher: internet({ forms: 'down', pagesUp: false }) })
  const result = await call('quality', { token })
  assert.equal(titled(result, 'key pages not loading').status, 'fail')
  assert.equal(titled(result, 'not answering').status, 'fail')
})

test('quality checks flag repeat registrations and content gaps', async () => {
  const { store, call, token } = await signedIn()
  await store.createDoc({ _type: 'post', title: 'No picture', published: true, _createdAt: '2026-01-01T00:00:00Z' })
  await store.createDoc({ _type: 'marketplaceProduct', productName: 'Honey' })
  const result = await call('quality', { token })
  assert.match(titled(result, 'repeat entries').title, /Agribusiness Summit 2026: 2 repeat entries/)
  assert.equal(titled(result, 'without a cover image').status, 'warn')
  assert.equal(titled(result, 'waiting for review').status, 'warn')
  assert.match(titled(result, 'Nothing new on the blog').title, /\d+ days/)
  assert.equal(titled(result, 'Only one Owner').status, 'warn')
})

test('each role sees only its own quality checks', async () => {
  const groups = async (role) => {
    const { call, token } = await signedIn({ role })
    return (await call('quality', { token })).groups.map((g) => g.name)
  }
  assert.deepEqual(await groups('viewer'), ['Website', 'Registration forms', 'Visit counter'])
  assert.ok((await groups('finance')).includes('Donations and receipts'))
  assert.ok(!(await groups('finance')).includes('Team'))
  assert.ok((await groups('content')).includes('Website content'))
  assert.ok(!(await groups('content')).includes('Donations and receipts'))
})

test('one failing group does not stop the others', async () => {
  const { store, call, token } = await signedIn()
  store.contentAudit = async () => { throw new Error('boom') }
  const result = await call('quality', { token })
  assert.equal(result.groups.find((g) => g.name === 'Website content').checks[0].title, 'This check could not run')
  assert.equal(result.groups.find((g) => g.name === 'Website').checks[0].status, 'pass')
})
