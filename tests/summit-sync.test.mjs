import test from 'node:test'
import assert from 'node:assert/strict'
import { createHandler } from '../api/_lib/handler.js'
import { fakeStore } from './fake-store.mjs'

const ENV = { ADMIN_PASSWORD: 'bootstrap-password', ADMIN_SESSION_SECRET: 'test-secret', SANITY_TOKEN: 'x', REGISTRATION_STATS_KEY: 'the-key' }
const OWNER = { name: 'Owner', email: 'owner@swkghana.org', password: 'owner-password-1' }

const HEADERS = ['Timestamp', 'Full Name', 'Age', 'Gender', 'Phone Number', 'Email Address', 'Region / City']
const ROWS = [
  ['2026-09-11T16:31:02.000Z', 'Ama Test', '22', 'Female', '0551234567', 'ama@example.test', 'Accra'],
  ['2026-09-11T16:32:10.000Z', 'Ama Test', '22', 'Female', '0551234567', 'ama@example.test', 'Accra'],
  ['2026-10-06T11:55:00.000Z', 'Kofi Test', '30', 'Male', '+233 24 000 0000', 'kofi@example.test', 'Kumasi'],
]

// A pretend Apps Script: answers with the rows for the right key, like the old script without the rows door, or not at all.
const sheet = ({ rows = ROWS, mode = 'new' } = {}) => {
  const calls = []
  const fetcher = async (url) => {
    calls.push(url)
    if (mode === 'down') throw new Error('timeout')
    const key = new URL(url).searchParams.get('rows')
    if (mode === 'old') return { json: async () => ({ ok: true, status: 'ready' }) }
    if (key !== 'the-key') return { json: async () => ({ ok: false, error: 'not allowed' }) }
    return { json: async () => ({ ok: true, headers: HEADERS, rows }) }
  }
  return { fetcher, calls }
}

const harness = async ({ env = ENV, fetcher } = {}) => {
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
  const { token } = await call('login', { email: OWNER.email, password: OWNER.password })
  return { store, call, token }
}

test('checking the sheet adds the people on it once, with repeats merged', async () => {
  const { fetcher, calls } = sheet()
  const { call, token, store } = await harness({ fetcher })
  const first = await call('summit.sync', { token })
  assert.equal(first.status, 200)
  assert.equal(first.state, 'ok')
  assert.deepEqual([first.rowsRead, first.repeatsRemoved, first.people, first.added, first.alreadyThere], [3, 1, 2, 2, 0])
  assert.ok(calls[0].startsWith('https://script.google.com/macros/s/') && calls[0].endsWith('?rows=the-key'))

  const again = await call('summit.sync', { token })
  assert.deepEqual([again.added, again.alreadyThere], [0, 2])
  const people = await store.listAttendees()
  assert.equal(people.length, 2)
  assert.equal(people.find((p) => p.name === 'Ama Test').submissions, 2)
  assert.equal(people[0].importedBy, 'Sheet sync')

  const { sync } = await call('summit.event', { token })
  assert.equal(sync.state, 'ok')
  assert.equal(sync.added, 0)
  assert.ok(sync.at)
})

test('an open list re-reads the sheet only when the last look is old', async () => {
  const { fetcher, calls } = sheet()
  const { call, token, store } = await harness({ fetcher })

  const list = await call('summit.list', { token })
  assert.equal(list.attendees.length, 2)
  assert.equal(calls.length, 1)

  await call('summit.list', { token })
  await call('summit.list', { token })
  assert.equal(calls.length, 1, 'no second read within the window')

  // Time passes and someone new registers.
  const e = await store.getEvent()
  await store.patchEvent({ syncAt: new Date(new Date(e.syncAt).getTime() - 10 * 60 * 1000).toISOString() })
  ROWS.push(['2026-11-06T09:00:00.000Z', 'Esi Test', '17', 'Female', '0209999999', 'esi@example.test', 'Tamale'])
  const later = await call('summit.list', { token })
  assert.equal(calls.length, 2)
  assert.equal(later.attendees.length, 3)
  ROWS.pop()
})

test('each set-up gap is named, and the list still loads', async () => {
  const state = async (options) => {
    const { call, token } = await harness(options)
    const list = await call('summit.list', { token })
    assert.equal(list.status, 200)
    const manual = await call('summit.sync', { token })
    const { sync } = await call('summit.event', { token })
    return { manual: manual.status, state: sync.state, message: sync.message }
  }
  const noKey = await state({ env: { ...ENV, REGISTRATION_STATS_KEY: '' }, fetcher: sheet().fetcher })
  assert.equal(noKey.state, 'not-connected')
  assert.equal(noKey.manual, 409)

  const old = await state({ fetcher: sheet({ mode: 'old' }).fetcher })
  assert.equal(old.state, 'needs-update')
  assert.match(old.message, /new version/)

  const wrongKey = await state({ env: { ...ENV, REGISTRATION_STATS_KEY: 'other' }, fetcher: sheet().fetcher })
  assert.equal(wrongKey.state, 'refused')

  const down = await state({ fetcher: sheet({ mode: 'down' }).fetcher })
  assert.equal(down.state, 'unreachable')
  assert.equal(down.manual, 503)
})

test('the door sees newcomers from the sheet too', async () => {
  const { fetcher } = sheet()
  const { call, token } = await harness({ fetcher })
  await call('summit.setCode', { token, code: 'summit-2026' })
  const door = (await call('door.login', { code: 'summit-2026' })).token
  const list = await call('summit.list', { token: door })
  assert.equal(list.attendees.length, 2)
  assert.equal(list.attendees[0].email, undefined, 'the door never sees emails')
})
