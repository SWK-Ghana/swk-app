import test from 'node:test'
import assert from 'node:assert/strict'
import { createHandler } from '../api/_lib/handler.js'
import { peopleFromCsv, normalisePhone } from '../api/_lib/summit.js'
import { fakeStore } from './fake-store.mjs'

const ENV = { ADMIN_PASSWORD: 'bootstrap-password', ADMIN_SESSION_SECRET: 'test-secret', SANITY_TOKEN: 'x' }
const OWNER = { name: 'Owner', email: 'owner@swkghana.org', password: 'owner-password-1' }

// The sheet's own headers. Row 3 repeats row 2 by email; row 5 repeats row 4 by phone, written differently.
const CSV = `Timestamp,Full Name,Age,Gender,Phone Number,Email Address,Region / City,Highest Education,Current Status,Field of Study,In Agribusiness,Agribusiness Details,Area of Interest,Why Attend,Hopes To Gain,Has Venture,Venture Details,Dietary / Accessibility Needs,Heard About Summit,Consent: Future Contact,Consent: Photos & Video,Consent: Newsletter,Source
9/11/2026 16:31:02,Ama Test,22,Female,0551234567,ama@example.test,"Accra, Greater Accra",Bachelor's degree,Student,Agriculture,No,,Crop production,"Learn, grow",Networking; Mentorship,No,,None,Social media,Yes,Yes,No,https://swkghana.org/summit
9/11/2026 16:32:10,Ama Test,22,Female,0551234567,AMA@example.test,"Accra, Greater Accra",Bachelor's degree,Student,Agriculture,No,,Agri-tech & innovation,Learn,Networking,No,,Vegetarian,Social media,Yes,Yes,No,https://swkghana.org/summit
10/6/2026 11:55:00,Kofi Test,30,Male,+233 24 000 0000,kofi@example.test,Kumasi,Diploma / HND,Employed,,Yes,Poultry,Livestock / poultry,Why,Funding / investor connections,Yes,Eggs,,Friend / referral,Yes,No,Yes,https://swkghana.org/summit
10/17/2026 12:21:00,Kofi Test,30,Male,0240000000,,Kumasi,Diploma / HND,Employed,,Yes,Poultry,Livestock / poultry,Why,Funding / investor connections,Yes,Eggs,,Friend / referral,Yes,No,Yes,https://swkghana.org/summit
10/20/2026 09:00:00,Esi Test,17,Female,0209999999,esi@example.test,Tamale,Senior High School,Student,,No,,Agro-processing & value addition,Why,Practical skills,No,,,Radio / TV,Yes,Yes,Yes,https://swkghana.org/summit
`

const harness = () => {
  const store = fakeStore()
  const handler = createHandler(() => store, ENV)
  const call = async (action, body = {}) => {
    let status = 200
    let payload
    const res = { setHeader() {}, status(s) { status = s; return this }, json(p) { payload = p; return this } }
    await handler({ method: 'POST', body: { action, ...body } }, res)
    return { status, ...payload }
  }
  return { store, call }
}

const withOwner = async () => {
  const h = harness()
  await h.call('setup', { adminPassword: ENV.ADMIN_PASSWORD, ...OWNER })
  const { token } = await h.call('login', { email: OWNER.email, password: OWNER.password })
  return { ...h, owner: token }
}

const withDoor = async () => {
  const h = await withOwner()
  await h.call('summit.setCode', { token: h.owner, code: 'summit-2026' })
  const { token } = await h.call('door.login', { code: 'summit-2026' })
  return { ...h, door: token }
}

test('phone numbers are written one way', () => {
  for (const v of ['+233 24 000 0000', '0240000000', '233240000000', '24 000 0000', '00233 24 000 0000']) assert.equal(normalisePhone(v), '0240000000')
})

test('the sheet becomes one person per registrant, keeping the latest answers and the first time', () => {
  const { people, rowsRead, repeatsRemoved } = peopleFromCsv(CSV)
  assert.equal(rowsRead, 5)
  assert.equal(repeatsRemoved, 2)
  assert.equal(people.length, 3)
  const ama = people.find((p) => p.name === 'Ama Test')
  assert.equal(ama.submissions, 2)
  assert.equal(ama.interest, 'Agri-tech & innovation')
  assert.equal(ama.needs, 'Vegetarian')
  assert.equal(ama.email, 'ama@example.test')
  assert.match(ama.registeredAt, /^2026-09-11T/)
  const kofi = people.find((p) => p.name === 'Kofi Test')
  assert.equal(kofi.phone, '0240000000')
  assert.equal(kofi.email, 'kofi@example.test', 'an email from an earlier submission is kept')
})

test('importing is for the owner and never adds anyone twice', async () => {
  const { call, owner } = await withOwner()
  const first = await call('summit.import', { token: owner, csv: CSV })
  assert.equal(first.added, 3)
  assert.equal(first.repeatsRemoved, 2)
  const again = await call('summit.import', { token: owner, csv: CSV })
  assert.equal(again.added, 0)
  assert.equal(again.alreadyThere, 3)
  const more = await call('summit.import', { token: owner, csv: `${CSV}10/30/2026 10:00:00,Yaw Test,40,Male,0271111111,,Ho,,Self-employed,,Yes,,Crop production,Why,,No,,,Other,Yes,Yes,No,\n` })
  assert.equal(more.added, 1)
  assert.equal((await call('summit.list', { token: owner })).attendees.length, 4)
})

test('a file that is not the sheet is refused', async () => {
  const { call, owner } = await withOwner()
  assert.equal((await call('summit.import', { token: owner, csv: 'a,b\n1,2\n' })).status, 400)
})

test('the door signs in with the code and sees only the check-in tools', async () => {
  const { call, owner } = await withOwner()
  assert.equal((await call('door.login', { code: 'anything' })).status, 403, 'no code set yet')
  await call('summit.setCode', { token: owner, code: 'summit-2026' })
  assert.equal((await call('door.login', { code: 'wrong' })).status, 401)
  const { status, token, user } = await call('door.login', { code: 'summit-2026' })
  assert.equal(status, 200)
  assert.equal(user.role, 'door')
  assert.equal((await call('summit.list', { token })).status, 200)
  assert.equal((await call('me', { token })).user.role, 'door')
  for (const action of ['overview', 'receipts.list', 'users.list', 'summit.import', 'summit.report', 'summit.setCode']) {
    assert.equal((await call(action, { token })).status, 403, action)
  }
})

test('changing the door code signs every door out', async () => {
  const { call, owner, door } = await withDoor()
  await call('summit.setCode', { token: owner, code: 'new-code-2026' })
  assert.equal((await call('summit.list', { token: door })).status, 401)
  assert.equal((await call('door.login', { code: 'new-code-2026' })).status, 200)
})

test('the door list carries no email or full phone number', async () => {
  const { call, owner, door } = await withDoor()
  await call('summit.import', { token: owner, csv: CSV })
  const { attendees } = await call('summit.list', { token: door })
  const text = JSON.stringify(attendees)
  assert.doesNotMatch(text, /example\.test|0551234567|0240000000/)
  assert.equal(attendees.find((a) => a.name === 'Ama Test').phoneEnd, '4567')
  assert.equal(attendees.find((a) => a.name === 'Ama Test').needs, 'Vegetarian')
})

test('checking in is recorded once, can be undone, and keeps an offline time', async () => {
  const { call, owner, door } = await withDoor()
  await call('summit.import', { token: owner, csv: CSV })
  const id = (await call('summit.list', { token: door })).attendees[0].id
  const first = await call('summit.checkin', { token: door, id, at: '2026-11-04T08:12:00.000Z' })
  assert.equal(first.already, false)
  assert.equal(first.attendee.checkedInAt, '2026-11-04T08:12:00.000Z')
  const second = await call('summit.checkin', { token: door, id })
  assert.equal(second.already, true)
  assert.equal(second.attendee.checkedInAt, '2026-11-04T08:12:00.000Z', 'the first time stands')
  const counts = (await call('summit.event', { token: door })).counts
  assert.equal(counts.checkedIn, 1)
  await call('summit.undo', { token: door, id })
  assert.equal((await call('summit.event', { token: door })).counts.checkedIn, 0)
  assert.equal((await call('summit.checkin', { token: door, id: 'nope' })).status, 404)
})

test('a walk-in is registered and checked in, and a known phone finds the existing person', async () => {
  const { call, owner, door, store } = await withDoor()
  await call('summit.import', { token: owner, csv: CSV })
  const fresh = await call('summit.walkin', { token: door, attendee: { name: 'Walk In', phone: '055 777 7777', gender: 'Male', age: '28', location: 'Accra', interest: 'Crop production', consentPhotos: 'Yes' } })
  assert.equal(fresh.existing, false)
  assert.equal(fresh.attendee.source, 'walk-in')
  assert.ok(fresh.attendee.checkedInAt)
  const known = await call('summit.walkin', { token: door, attendee: { name: 'Ama Again', phone: '+233 55 123 4567' } })
  assert.equal(known.existing, true)
  assert.equal(known.attendee.name, 'Ama Test')
  assert.ok(known.attendee.checkedInAt)
  assert.equal(store.attendees.size, 4)
  assert.equal((await call('summit.walkin', { token: door, attendee: { name: 'No Contact' } })).status, 400)
  assert.equal((await call('summit.walkin', { token: door, attendee: { name: 'Bad Email', email: 'nope' } })).status, 400)
})

test('the report adds up and names who came, who did not and who needs something', async () => {
  const { call, owner, door } = await withDoor()
  await call('summit.import', { token: owner, csv: CSV })
  const list = (await call('summit.list', { token: door })).attendees
  await call('summit.checkin', { token: door, id: list.find((a) => a.name === 'Ama Test').id, at: '2026-11-04T08:12:00.000Z' })
  await call('summit.walkin', { token: door, attendee: { name: 'Walk In', phone: '0557777777', gender: 'Male', age: '28' }, at: '2026-11-04T09:40:00.000Z' })
  const r = await call('summit.report', { token: owner })
  assert.equal(r.totals.registered, 4)
  assert.equal(r.totals.online, 3)
  assert.equal(r.totals.walkIns, 1)
  assert.equal(r.totals.attended, 2)
  assert.equal(r.totals.noShows, 2)
  assert.equal(r.totals.attendanceRate, 33)
  assert.equal(r.totals.withNeeds, 1)
  assert.deepEqual(r.arrivalsBySlot.map((s) => s.name), ['08:00', '09:30'])
  assert.deepEqual(r.noShows.map((p) => p.name), ['Esi Test', 'Kofi Test'])
  assert.deepEqual(r.walkIns.map((p) => p.name), ['Walk In'])
  assert.equal(r.needs[0].needs, 'Vegetarian')
  assert.equal(r.attended.age.find((g) => g.name === '18 to 24').count, 1)
  assert.equal((await call('summit.report', { token: door })).status, 403)
})

test('owner can correct a record and a viewer cannot', async () => {
  const { call, owner, store } = await withOwner()
  await call('summit.import', { token: owner, csv: CSV })
  const id = (await call('summit.list', { token: owner })).attendees[0].id
  const fixed = await call('summit.update', { token: owner, id, fields: { name: 'Ama Corrected' } })
  assert.equal(fixed.attendee.name, 'Ama Corrected')
  const { temporaryPassword } = await call('users.create', { token: owner, name: 'V', email: 'v@swkghana.org', role: 'viewer' })
  let { token } = await call('login', { email: 'v@swkghana.org', password: temporaryPassword })
  await call('password.change', { token, currentPassword: temporaryPassword, newPassword: 'viewer-password-1' })
  ;({ token } = await call('login', { email: 'v@swkghana.org', password: 'viewer-password-1' }))
  assert.equal((await call('summit.update', { token, id, fields: { name: 'X' } })).status, 403)
  assert.equal((await call('summit.report', { token })).status, 200)
  assert.ok(store.attendees.size === 3)
})
