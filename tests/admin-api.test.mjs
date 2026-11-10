import test from 'node:test'
import assert from 'node:assert/strict'
import { createHandler } from '../api/_lib/handler.js'
import { fakeStore } from './fake-store.mjs'

const ENV = { ADMIN_PASSWORD: 'bootstrap-password', ADMIN_SESSION_SECRET: 'test-secret', SANITY_TOKEN: 'x' }
const OWNER = { name: 'Owner', email: 'owner@swkghana.org', password: 'owner-password-1' }

const setup = () => {
  const store = fakeStore()
  const handler = createHandler(() => store, ENV)
  const call = async (action, body = {}) => {
    let status = 200
    let payload
    const res = {
      setHeader() {},
      status(s) { status = s; return this },
      json(p) { payload = p; return this },
    }
    await handler({ method: 'POST', body: { action, ...body } }, res)
    return { status, ...payload }
  }
  return { store, call }
}

const withOwner = async () => {
  const ctx = setup()
  await ctx.call('setup', { adminPassword: ENV.ADMIN_PASSWORD, ...OWNER })
  const { token } = await ctx.call('login', { email: OWNER.email, password: OWNER.password })
  return { ...ctx, owner: token }
}

const addStaff = async ({ call, owner }, role) => {
  const email = `${role}@swkghana.org`
  const { temporaryPassword } = await call('users.create', { token: owner, name: role, email, role })
  const { token } = await call('login', { email, password: temporaryPassword })
  const password = `${role}-new-password`
  await call('password.change', { token, currentPassword: temporaryPassword, newPassword: password })
  return (await call('login', { email, password })).token
}

const RECEIPT = { name: 'Test Donor', amount: 520, date: '2026-11-01', method: 'MTN Mobile Money', txn: '1', purpose: 'Agribusiness Summit 2026 · Sponsor a Seat', note: '' }

test('setup needs the bootstrap password and closes after the first account', async () => {
  const { call } = setup()
  assert.equal((await call('status')).needsSetup, true)
  assert.equal((await call('setup', { adminPassword: 'wrong', ...OWNER })).status, 401)
  assert.equal((await call('setup', { adminPassword: ENV.ADMIN_PASSWORD, ...OWNER })).status, 200)
  assert.equal((await call('status')).needsSetup, false)
  assert.equal((await call('setup', { adminPassword: ENV.ADMIN_PASSWORD, ...OWNER, email: 'x@y.org' })).status, 403)
})

test('reports a misconfigured server', async () => {
  const handler = createHandler(() => fakeStore(), {})
  let status
  await handler({ method: 'POST', body: { action: 'status' } }, { setHeader() {}, status(s) { status = s; return this }, json() { return this } })
  assert.equal(status, 500)
})

test('login errors are identical and five failures lock the account', async () => {
  const { call } = await withOwner()
  const wrong = await call('login', { email: OWNER.email, password: 'nope' })
  const unknown = await call('login', { email: 'nobody@swkghana.org', password: 'nope' })
  assert.equal(wrong.status, 401)
  assert.equal(wrong.error, unknown.error)
  for (let i = 0; i < 4; i++) await call('login', { email: OWNER.email, password: 'nope' })
  const locked = await call('login', { email: OWNER.email, password: OWNER.password })
  assert.equal(locked.status, 401)
  assert.equal(locked.token, undefined)
})

test('sessions are refused when tampered with or missing', async () => {
  const { call, owner } = await withOwner()
  assert.equal((await call('me', { token: owner })).user.role, 'owner')
  assert.equal((await call('me', { token: `${owner}x` })).status, 401)
  assert.equal((await call('me')).status, 401)
})

test('the password hash never leaves the server', async () => {
  const { call, owner } = await withOwner()
  assert.equal((await call('me', { token: owner })).user.passwordHash, undefined)
  assert.equal((await call('users.list', { token: owner })).users[0].passwordHash, undefined)
})

test('roles reach only what they should', async () => {
  const ctx = await withOwner()
  const tokens = {
    owner: ctx.owner,
    finance: await addStaff(ctx, 'finance'),
    content: await addStaff(ctx, 'content'),
    viewer: await addStaff(ctx, 'viewer'),
  }
  const rules = [
    ['users.list', {}, ['owner']],
    ['signature.set', { dataUri: 'data:image/png;base64,AAAA' }, ['owner']],
    ['campaign.set', { campaign: { name: 'C', purpose: 'P', target: 100, seatPrice: 10, seats: 10, deadline: '2026-11-06' } }, ['owner']],
    ['receipts.record', { no: 'SWK-2026-0100', issued: '2026-11-02', receipt: RECEIPT }, ['owner']],
    ['receipts.issue', { receipt: RECEIPT }, ['owner', 'finance']],
    ['receipts.list', {}, ['owner', 'finance']],
    ['signature.get', {}, ['owner', 'finance', 'content']],
    ['create', { doc: { _type: 'post', title: 't' } }, ['owner', 'content']],
    ['overview', {}, ['owner', 'finance', 'content', 'viewer']],
  ]
  for (const [action, body, allowed] of rules) {
    for (const [role, token] of Object.entries(tokens)) {
      const { status } = await ctx.call(action, { token, ...body })
      assert.equal(status === 200, allowed.includes(role), `${role} on ${action} gave ${status}`)
      if (!allowed.includes(role)) assert.equal(status, 403)
    }
  }
})

test('a changed or removed person loses access at once', async () => {
  const ctx = await withOwner()
  const token = await addStaff(ctx, 'finance')
  const { users } = await ctx.call('users.list', { token: ctx.owner })
  const id = users.find((u) => u.role === 'finance').id
  await ctx.call('users.update', { token: ctx.owner, id, role: 'viewer' })
  assert.equal((await ctx.call('receipts.list', { token })).status, 403)
  await ctx.call('users.update', { token: ctx.owner, id, active: false })
  assert.equal((await ctx.call('me', { token })).status, 401)
})

test('a temporary password must be changed before anything else', async () => {
  const { call, owner } = await withOwner()
  const { temporaryPassword } = await call('users.create', { token: owner, name: 'F', email: 'f@swkghana.org', role: 'finance' })
  const { token } = await call('login', { email: 'f@swkghana.org', password: temporaryPassword })
  assert.equal((await call('me', { token })).user.mustChangePassword, true)
  assert.equal((await call('receipts.list', { token })).status, 403)
  assert.equal((await call('password.change', { token, currentPassword: temporaryPassword, newPassword: 'short' })).status, 400)
  assert.equal((await call('password.change', { token, currentPassword: 'wrong-one', newPassword: 'long-enough-pass' })).status, 401)
  assert.equal((await call('password.change', { token, currentPassword: temporaryPassword, newPassword: 'long-enough-pass' })).status, 200)
  assert.equal((await call('receipts.list', { token })).status, 401) // old session ended
})

test('a password reset ends the old session', async () => {
  const ctx = await withOwner()
  const token = await addStaff(ctx, 'finance')
  const { users } = await ctx.call('users.list', { token: ctx.owner })
  const id = users.find((u) => u.role === 'finance').id
  const { temporaryPassword } = await ctx.call('users.resetPassword', { token: ctx.owner, id })
  assert.ok(temporaryPassword)
  assert.equal((await ctx.call('me', { token })).status, 401)
})

test('the last active owner cannot be demoted or removed', async () => {
  const { call, owner } = await withOwner()
  const { user } = await call('me', { token: owner })
  assert.equal((await call('users.update', { token: owner, id: user.id, role: 'viewer' })).status, 400)
  assert.equal((await call('users.update', { token: owner, id: user.id, active: false })).status, 400)
})

test('duplicate staff emails and bad roles are refused', async () => {
  const { call, owner } = await withOwner()
  assert.equal((await call('users.create', { token: owner, name: 'X', email: OWNER.email, role: 'viewer' })).status, 400)
  assert.equal((await call('users.create', { token: owner, name: 'X', email: 'x@swkghana.org', role: 'superuser' })).status, 400)
  assert.equal((await call('users.create', { token: owner, name: 'X', email: 'not-an-email', role: 'viewer' })).status, 400)
})

test('content tools cannot reach private documents', async () => {
  const { call, owner, store } = await withOwner()
  const [id] = store.users.keys()
  assert.equal((await call('patch', { token: owner, id, set: { role: 'owner' } })).status, 400)
  assert.equal((await call('patch', { token: owner, id: 'receipts.SWK-2026-0001', set: { amount: 1 } })).status, 400)
  assert.equal((await call('delete', { token: owner, id })).status, 400)
  assert.equal((await call('create', { token: owner, doc: { _id: 'admin.user.x', _type: 'post' } })).status, 400)
  assert.equal((await call('create', { token: owner, doc: { _type: 'adminUser', email: 'x' } })).status, 400)
  assert.equal((await call('patch', { token: owner, id: 'abc', set: { _type: 'adminUser' } })).status, 400)
})

test('receipt numbers count up and record who issued them', async () => {
  const { call, owner } = await withOwner()
  const year = new Date().getFullYear()
  const a = await call('receipts.issue', { token: owner, receipt: RECEIPT })
  const b = await call('receipts.issue', { token: owner, receipt: RECEIPT })
  assert.equal(a.receipt.no, `SWK-${year}-0001`)
  assert.equal(b.receipt.no, `SWK-${year}-0002`)
  assert.equal(a.receipt.issuedBy, OWNER.name)
  assert.equal(a.receipt.status, 'issued')
})

test('numbering carries on from an earlier receipt and survives a race', async () => {
  const { call, owner, store } = await withOwner()
  const year = new Date().getFullYear()
  await call('receipts.record', { token: owner, no: `SWK-${year}-0002`, issued: `${year}-11-02`, receipt: RECEIPT })
  store.raceOnce = 1
  const issued = await call('receipts.issue', { token: owner, receipt: RECEIPT })
  assert.equal(issued.receipt.no, `SWK-${year}-0004`)
  assert.equal(store.receipts.get(`SWK-${year}-0003`).name, 'Someone else')
})

test('receipts are validated', async () => {
  const { call, owner } = await withOwner()
  for (const bad of [{ amount: 0 }, { amount: -5 }, { amount: 2000000 }, { amount: 'x' }, { name: '' }, { name: 'a'.repeat(121) }, { date: 'yesterday' }, { purpose: '' }]) {
    assert.equal((await call('receipts.issue', { token: owner, receipt: { ...RECEIPT, ...bad } })).status, 400, JSON.stringify(bad))
  }
  assert.equal((await call('receipts.record', { token: owner, no: 'NOT-A-NUMBER', issued: '2026-11-02', receipt: RECEIPT })).status, 400)
  const status = (await call('receipts.issue', { token: owner, receipt: { ...RECEIPT, status: 'cancelled', issuedBy: 'Forged' } }))
  assert.equal(status.receipt.status, 'issued')
  assert.equal(status.receipt.issuedBy, OWNER.name)
})

test('recording a number twice is refused, and corrections keep the number', async () => {
  const { call, owner } = await withOwner()
  const no = 'SWK-2026-0002'
  await call('receipts.record', { token: owner, no, issued: '2026-11-02', receipt: { ...RECEIPT, date: '' } })
  assert.equal((await call('receipts.record', { token: owner, no, issued: '2026-11-02', receipt: RECEIPT })).status, 409)
  const fixed = await call('receipts.update', { token: owner, no, receipt: { ...RECEIPT, date: '2026-10-30' } })
  assert.equal(fixed.receipt.no, no)
  assert.equal(fixed.receipt.date, '2026-10-30')
  assert.equal(fixed.receipt.updatedBy, OWNER.name)
  assert.equal((await call('receipts.update', { token: owner, no: 'SWK-2026-0999', receipt: RECEIPT })).status, 404)
})

test('cancelling needs a reason, keeps the receipt and leaves the totals', async () => {
  const { call, owner } = await withOwner()
  const { receipt } = await call('receipts.issue', { token: owner, receipt: RECEIPT })
  await call('receipts.issue', { token: owner, receipt: { ...RECEIPT, amount: 260 } })
  assert.equal((await call('overview', { token: owner })).campaign.raised, 780)
  assert.equal((await call('receipts.cancel', { token: owner, no: receipt.no, reason: ' ' })).status, 400)
  assert.equal((await call('receipts.cancel', { token: owner, no: receipt.no, reason: 'Entered twice' })).status, 200)
  assert.equal((await call('receipts.update', { token: owner, no: receipt.no, receipt: RECEIPT })).status, 400)
  const { receipts } = await call('receipts.list', { token: owner })
  assert.equal(receipts.length, 2)
  assert.equal(receipts.find((r) => r.no === receipt.no).status, 'cancelled')
  const { campaign, receiptsIssued } = await call('overview', { token: owner })
  assert.equal(campaign.raised, 260)
  assert.equal(campaign.seatsFunded, 1)
  assert.equal(receiptsIssued, 1)
})

test('the overview holds totals only', async () => {
  const ctx = await withOwner()
  const viewer = await addStaff(ctx, 'viewer')
  await ctx.call('receipts.issue', { token: ctx.owner, receipt: RECEIPT })
  const body = JSON.stringify(await ctx.call('overview', { token: viewer }))
  assert.ok(!body.includes('Test Donor'))
  assert.ok(body.includes('"raised":520'))
})

test('signatures must be small images', async () => {
  const { call, owner } = await withOwner()
  assert.equal((await call('signature.set', { token: owner, dataUri: 'javascript:alert(1)' })).status, 400)
  assert.equal((await call('signature.set', { token: owner, dataUri: `data:image/png;base64,${'A'.repeat(500000)}` })).status, 400)
  assert.equal((await call('signature.set', { token: owner, dataUri: 'data:image/png;base64,AAAA' })).status, 200)
  assert.equal((await call('signature.get', { token: owner })).dataUri, 'data:image/png;base64,AAAA')
})
