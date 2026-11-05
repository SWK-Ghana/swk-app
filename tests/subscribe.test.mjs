import test from 'node:test'
import assert from 'node:assert/strict'
import { createSubscribeHandler } from '../api/_lib/subscribe.js'

const SITE = { origin: 'https://swkghana.org', 'x-forwarded-for': '1.2.3.4' }

const run = async (handler, { headers = SITE, body = { email: 'ama@example.com' }, method = 'POST' } = {}) => {
  let status
  let payload
  const res = {
    setHeader() {},
    status(s) { status = s; return this },
    json(p) { payload = p; return this },
    end() { return this },
  }
  await handler({ method, headers, body }, res)
  return { status, ...payload }
}

const brevo = (calls = [], ok = true) => async (url, init) => {
  calls.push({ url, init })
  return { ok, status: ok ? 201 : 400 }
}

test('an email from the site reaches Brevo with the server key only', async () => {
  const calls = []
  const handler = createSubscribeHandler({ BREVO_API_KEY: 'server-key' }, brevo(calls))
  const { status } = await run(handler, { body: { email: ' Ama@Example.com ' } })
  assert.equal(status, 204)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, 'https://api.brevo.com/v3/contacts')
  assert.equal(calls[0].init.headers['api-key'], 'server-key')
  assert.deepEqual(JSON.parse(calls[0].init.body), { email: 'ama@example.com', listIds: [2], updateEnabled: true })
})

test('the old VITE_ key still works on the server until it is replaced', async () => {
  const calls = []
  const handler = createSubscribeHandler({ VITE_BREVO_API_KEY: 'old-key' }, brevo(calls))
  assert.equal((await run(handler)).status, 204)
  assert.equal(calls[0].init.headers['api-key'], 'old-key')
})

test('bad input, other sites and outages are refused without reaching Brevo', async () => {
  const calls = []
  const handler = createSubscribeHandler({ BREVO_API_KEY: 'k' }, brevo(calls))
  assert.equal((await run(handler, { body: { email: 'not-an-email' } })).status, 400)
  assert.equal((await run(handler, { body: 'not json {' })).status, 400)
  assert.equal((await run(handler, { headers: { origin: 'https://evil.example' } })).status, 403)
  assert.equal((await run(handler, { method: 'GET' })).status, 405)
  assert.equal(calls.length, 0)

  assert.equal((await run(createSubscribeHandler({}, brevo(calls)))).status, 503)
  assert.equal((await run(createSubscribeHandler({ BREVO_API_KEY: 'k' }, brevo([], false)))).status, 502)
  assert.equal((await run(createSubscribeHandler({ BREVO_API_KEY: 'k' }, async () => { throw new Error('down') }))).status, 502)
  assert.equal(calls.length, 0)
})

test('one address cannot sign up more than five times a minute', async () => {
  const handler = createSubscribeHandler({ BREVO_API_KEY: 'k' }, brevo(), () => Date.parse('2026-11-05T10:00:00Z'))
  const headers = { ...SITE, 'x-forwarded-for': '9.9.9.9' }
  for (let i = 0; i < 5; i++) assert.equal((await run(handler, { headers })).status, 204)
  assert.equal((await run(handler, { headers })).status, 429)
})
