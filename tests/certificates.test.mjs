import test from 'node:test'
import assert from 'node:assert/strict'
import { createHandler } from '../api/_lib/handler.js'
import { fakeStore } from './fake-store.mjs'

const ENV = { ADMIN_PASSWORD: 'bootstrap-password', ADMIN_SESSION_SECRET: 'test-secret', SANITY_TOKEN: 'x' }
const OWNER = { name: 'Owner', email: 'owner@swkghana.org', password: 'owner-password-1' }

const harness = async () => {
  const store = fakeStore()
  const handler = createHandler(() => store, ENV)
  const call = async (action, body = {}) => {
    let status = 200
    let payload
    const res = { setHeader() {}, status(s) { status = s; return this }, json(p) { payload = p; return this } }
    await handler({ method: 'POST', body: { action, ...body } }, res)
    return { status, ...payload }
  }
  await call('setup', { adminPassword: ENV.ADMIN_PASSWORD, ...OWNER })
  const { token } = await call('login', { email: OWNER.email, password: OWNER.password })
  const staff = async (role) => {
    const email = `${role}@swkghana.org`
    const { temporaryPassword } = await call('users.create', { token, name: role, email, role })
    const first = (await call('login', { email, password: temporaryPassword })).token
    await call('password.change', { token: first, currentPassword: temporaryPassword, newPassword: `${role}-new-password` })
    return (await call('login', { email, password: `${role}-new-password` })).token
  }
  return { store, call, owner: token, staff }
}

test('certificates are numbered in series with a short key, and record who issued them', async () => {
  const { call, owner } = await harness()
  const a = await call('certificates.issue', { token: owner, certificate: { name: 'Ama Test', role: 'participant' } })
  const b = await call('certificates.issue', { token: owner, certificate: { name: 'Kofi Test', role: 'volunteer', detail: 'Registration desk' } })
  assert.equal(a.status, 200)
  assert.equal(a.certificate.no, 'SWK-AS26-0001')
  assert.equal(b.certificate.no, 'SWK-AS26-0002')
  assert.match(a.certificate.key, /^[A-HJ-NP-Z2-9]{4}$/)
  assert.equal(a.certificate.id, `${a.certificate.no}-${a.certificate.key}`)
  assert.equal(a.certificate.issuedBy, 'Owner')
  assert.equal(a.certificate.status, 'issued')
  assert.equal(a.certificate.event, 'Agribusiness Summit 2026')
  assert.equal(a.certificate.eventDate, '2026-11-07')
  assert.equal(b.certificate.detail, 'Registration desk')
})

test('numbering survives a race and bad input is refused', async () => {
  const { call, owner, store } = await harness()
  store.raceOnce = 1
  const issued = await call('certificates.issue', { token: owner, certificate: { name: 'Ama Test', role: 'participant' } })
  assert.equal(issued.certificate.no, 'SWK-AS26-0002')
  assert.equal(store.certificates.get('SWK-AS26-0001').name, 'Someone else')

  assert.equal((await call('certificates.issue', { token: owner, certificate: { name: '', role: 'participant' } })).status, 400)
  assert.equal((await call('certificates.issue', { token: owner, certificate: { name: 'X', role: 'guest' } })).status, 400)
  assert.equal((await call('certificates.issue', { token: owner, certificate: { name: 'X', role: 'participant', detail: 'd'.repeat(200) } })).status, 400)
})

test('issuing many skips people who already hold that role, by attendee or by name', async () => {
  const { call, owner } = await harness()
  await call('certificates.issue', { token: owner, certificate: { name: 'Ama Test', role: 'participant', attendeeId: 'a1' } })
  const r = await call('certificates.issueMany', {
    token: owner,
    items: [
      { name: 'AMA TEST', role: 'participant', attendeeId: 'a1' }, // same person, same role
      { name: 'Ama Test', role: 'volunteer' }, // same person, a different role: fine
      { name: 'Esi Test', role: 'participant', attendeeId: 'a3' },
      { name: 'Esi Test', role: 'participant', attendeeId: 'a3' }, // repeated in the same batch
    ],
  })
  assert.equal(r.status, 200)
  assert.equal(r.issued.length, 2)
  assert.equal(r.skipped, 2)
  assert.deepEqual(r.issued.map((c) => c.no), ['SWK-AS26-0002', 'SWK-AS26-0003'])
  assert.equal((await call('certificates.issueMany', { token: owner, items: [] })).status, 400)
})

test('the public page shows a certificate only with its full id, never a revoked one', async () => {
  const { call, owner, store } = await harness()
  await store.setSignature('data:image/png;base64,AAAA')
  const { certificate } = await call('certificates.issue', { token: owner, certificate: { name: 'Ama Test', role: 'keynote', detail: 'Calidad Farms' } })

  const shown = await call('certificate.get', { id: certificate.id.toLowerCase() })
  assert.equal(shown.status, 200)
  assert.equal(shown.certificate.name, 'Ama Test')
  assert.equal(shown.certificate.role, 'keynote')
  assert.equal(shown.certificate.venue, 'The GracedLife Leadership Centre, Ashaley Botwe, Accra')
  assert.equal(shown.signature, 'data:image/png;base64,AAAA')
  assert.equal(shown.certificate.key, undefined)
  assert.equal(shown.certificate.issuedBy, undefined)

  assert.equal((await call('certificate.get', { id: certificate.no })).status, 404, 'number alone is not enough')
  assert.equal((await call('certificate.get', { id: `${certificate.no}-ZZZZ` })).status, 404, 'wrong key')
  assert.equal((await call('certificate.get', { id: 'SWK-AS26-0002-ABCD' })).status, 404)

  assert.equal((await call('certificates.revoke', { token: owner, no: certificate.no })).status, 400, 'a reason is needed')
  const revoked = await call('certificates.revoke', { token: owner, no: certificate.no, reason: 'Issued to the wrong person' })
  assert.equal(revoked.certificate.status, 'revoked')
  assert.equal((await call('certificate.get', { id: certificate.id })).status, 404)
  assert.equal((await call('certificates.update', { token: owner, no: certificate.no, fields: { name: 'New' } })).status, 400)
})

test('corrections keep the number; roles reach only what they should', async () => {
  const { call, owner, staff } = await harness()
  const content = await staff('content')
  const viewer = await staff('viewer')
  const finance = await staff('finance')

  const issued = await call('certificates.issue', { token: content, certificate: { name: 'Ama Tset', role: 'participant' } })
  assert.equal(issued.status, 200, 'content staff can issue')
  const fixed = await call('certificates.update', { token: finance, no: issued.certificate.no, fields: { name: 'Ama Test' } })
  assert.equal(fixed.certificate.name, 'Ama Test')
  assert.equal(fixed.certificate.no, issued.certificate.no)
  assert.equal(fixed.certificate.key, issued.certificate.key)

  assert.equal((await call('certificates.list', { token: viewer })).certificates.length, 1)
  assert.equal((await call('certificates.issue', { token: viewer, certificate: { name: 'X', role: 'participant' } })).status, 403)
  assert.equal((await call('certificates.revoke', { token: content, no: issued.certificate.no, reason: 'x' })).status, 403)
  assert.equal((await call('signature.get', { token: content })).status, 200, 'content staff can fetch the signature to print')
  assert.equal((await call('signature.get', { token: viewer })).status, 403)
})

test('a bulk issue keeps going when someone else is issuing at the same time', async () => {
  const { call, owner, store } = await harness()
  // Another person takes the next number just before each of the first eight tries.
  store.raceOnce = 8
  const r = await call('certificates.issueMany', {
    token: owner,
    items: [{ name: 'Ama Test', role: 'participant' }, { name: 'Kofi Test', role: 'participant' }, { name: 'Esi Test', role: 'volunteer' }],
  })
  assert.equal(r.status, 200)
  assert.equal(r.issued.length, 3)
  assert.deepEqual(r.issued.map((c) => c.no), ['SWK-AS26-0009', 'SWK-AS26-0010', 'SWK-AS26-0011'])
  assert.equal(new Set([...store.certificates.keys()]).size, 11)
})

test('names from the registration list are set as names; names staff type are left alone', async () => {
  const { tidyName } = await import('../api/_lib/certificates.js')
  assert.equal(tidyName('jonathan kwarteng'), 'Jonathan Kwarteng')
  assert.equal(tidyName('AMA OWUSU-ANSAH'), 'Ama Owusu-Ansah')
  assert.equal(tidyName("n.k. o'brien"), "N.K. O'Brien")
  assert.equal(tidyName('Abena de Graft-Johnson'), 'Abena de Graft-Johnson')
  assert.equal(tidyName('McCarthy Mensah'), 'McCarthy Mensah')

  const { call, owner } = await harness()
  const r = await call('certificates.issueMany', {
    token: owner,
    items: [{ name: 'esi   test', role: 'participant', attendeeId: 'a1' }, { name: 'KOFI TEST', role: 'participant', attendeeId: 'a2' }],
  })
  assert.deepEqual(r.issued.map((c) => c.name), ['Esi Test', 'Kofi Test'])
  const typed = await call('certificates.issue', { token: owner, certificate: { name: 'GIZ', role: 'partner' } })
  assert.equal(typed.certificate.name, 'GIZ')
})
