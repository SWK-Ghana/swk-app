// Summit attendance: the registration list, door check-in, walk-in
// registration and the attendance report. Attendees are private Sanity
// documents (summit.attendee.<id>), so the public dataset never shows them.
import crypto from 'crypto'
import { fail } from './errors.js'
import { hashPassword, issueSession, verifyPassword } from './security.js'
import { parseCsv } from './csv.js'
import { FORMS } from './registrations.js'

export const DEFAULT_EVENT = {
  name: 'Agribusiness Summit 2026',
  date: '2026-11-07',
  venue: 'The GracedLife Leadership Centre, Ashaley Botwe, Accra',
}
export const DOOR_SESSION_MS = 1000 * 60 * 60 * 16 // a whole event day
const ID_PREFIX = 'summit.attendee.'
const MIN_CODE = 4
const MAX_CODE = 40
const DOOR_TRIES_PER_MINUTE = 30
const CREATE_CHUNK = 50
const SHEET_URL = FORMS.find((f) => f.id === 'summit').url
const SHEET_TIMEOUT_MS = 8000
const SYNC_EVERY_MS = 3 * 60 * 1000 // how often an open door or dashboard re-reads the sheet
const SYNC_USER = 'Sheet sync'

// The registration form's questions. Column names match the Sheet's headers
// and the form's own field names, so either export imports.
export const FIELDS = [
  ['name', ['full name', 'fullname', 'name']],
  ['age', ['age']],
  ['gender', ['gender']],
  ['phone', ['phone number', 'phone', 'whatsapp']],
  ['email', ['email address', 'email']],
  ['location', ['region / city', 'location', 'region', 'city']],
  ['education', ['highest education', 'education']],
  ['status', ['current status', 'status']],
  ['study', ['field of study', 'study']],
  ['inAgri', ['in agribusiness', 'inagri']],
  ['agriDetails', ['agribusiness details', 'agridetails']],
  ['interest', ['area of interest', 'interest']],
  ['why', ['why attend', 'why']],
  ['gain', ['hopes to gain', 'gain']],
  ['hasVenture', ['has venture', 'hasventure']],
  ['ventureDetails', ['venture details', 'venturedetails']],
  ['needs', ['dietary / accessibility needs', 'needs', 'dietary']],
  ['heard', ['heard about summit', 'heard']],
  ['consentContact', ['consent: future contact', 'consentcontact']],
  ['consentPhotos', ['consent: photos & video', 'consentphotos']],
  ['consentNewsletter', ['consent: newsletter', 'consentnewsletter']],
]
const TEXT_LIMITS = { name: 120, phone: 30, email: 160, location: 120, needs: 300, why: 1000, agriDetails: 1000, ventureDetails: 1000, gain: 300 }
const DEFAULT_LIMIT = 120

export const normalisePhone = (value) => {
  let digits = String(value || '').replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('233') && digits.length === 12) digits = `0${digits.slice(3)}`
  if (digits.length === 9 && /^[2-9]/.test(digits)) digits = `0${digits}`
  return digits
}
export const normaliseEmail = (value) => String(value || '').trim().toLowerCase()
const clean = (key, value) => String(value ?? '').trim().slice(0, TEXT_LIMITS[key] || DEFAULT_LIMIT)
const newId = () => `${ID_PREFIX}${crypto.randomBytes(5).toString('hex')}`
const shortId = (doc) => doc._id.slice(ID_PREFIX.length)

/** Fields as the browser sees them. The door team gets no contact details. */
export const forStaff = (doc) => ({ ...doc, id: shortId(doc), _id: undefined, _type: undefined, _rev: undefined, _createdAt: undefined, _updatedAt: undefined })
export const forDoor = (doc) => ({
  id: shortId(doc),
  name: doc.name,
  phoneEnd: doc.phone ? doc.phone.slice(-4) : '',
  location: doc.location || '',
  needs: doc.needs || '',
  source: doc.source,
  checkedInAt: doc.checkedInAt || null,
})

const cleanAttendee = (input = {}) => {
  const out = {}
  for (const [key] of FIELDS) out[key] = clean(key, input[key])
  out.phone = normalisePhone(out.phone)
  out.email = normaliseEmail(out.email)
  if (!out.name) fail(400, "Enter the person's name.")
  if (!out.phone && !out.email) fail(400, 'Enter a phone number or an email address.')
  if (out.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) fail(400, 'That email address does not look right.')
  return out
}

// ─── Importing the registration sheet ───────────────────────────────────────

const columnMap = (header) => {
  const names = header.map((h) => String(h).trim().toLowerCase())
  const map = {}
  for (const [key, aliases] of FIELDS) {
    const i = names.findIndex((n) => aliases.includes(n))
    if (i > -1) map[key] = i
  }
  const time = names.findIndex((n) => n === 'timestamp' || n === 'registered' || n === 'date')
  if (map.name === undefined || (map.phone === undefined && map.email === undefined)) {
    fail(400, 'That file does not look like the registration sheet: it needs name and phone or email columns.')
  }
  return { map, time: time > -1 ? time : 0 }
}

/** Groups rows that share a phone or an email: one person, several submissions. */
const groupPeople = (rows) => {
  const parent = rows.map((_, i) => i)
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  const seen = new Map()
  rows.forEach((row, i) => {
    for (const key of [row.phone && `p:${row.phone}`, row.email && `e:${row.email}`].filter(Boolean)) {
      if (seen.has(key)) parent[find(i)] = find(seen.get(key))
      else seen.set(key, i)
    }
  })
  const groups = new Map()
  rows.forEach((row, i) => {
    const root = find(i)
    groups.set(root, [...(groups.get(root) || []), row])
  })
  return [...groups.values()]
}

/** Reads the sheet's rows (header first): one attendee per person, keeping the latest answers and the first registration time. */
export const peopleFromRows = (rows) => {
  if (rows.length < 2) fail(400, 'That file has no registrations in it.')
  const { map, time } = columnMap(rows[0])
  const parsed = rows.slice(1).map((r, n) => {
    const row = { sheetRow: n + 2 }
    for (const [key, i] of Object.entries(map)) row[key] = clean(key, r[i])
    row.phone = normalisePhone(row.phone)
    row.email = normaliseEmail(row.email)
    const when = new Date(r[time])
    row.registeredAt = isNaN(when.getTime()) ? null : when.toISOString()
    return row
  }).filter((row) => row.name && (row.phone || row.email))

  const people = groupPeople(parsed).map((group) => {
    const sorted = [...group].sort((a, b) => String(a.registeredAt || '').localeCompare(String(b.registeredAt || '')))
    const latest = sorted.at(-1)
    const first = sorted[0]
    // The latest row has their most recent answers; the first row has when they really registered.
    const person = { ...latest, registeredAt: first.registeredAt || latest.registeredAt || new Date().toISOString(), submissions: group.length }
    // Any phone or email given in an earlier submission still finds them.
    person.phone = latest.phone || sorted.map((r) => r.phone).find(Boolean) || ''
    person.email = latest.email || sorted.map((r) => r.email).find(Boolean) || ''
    return person
  })
  return { people, rowsRead: parsed.length, repeatsRemoved: parsed.length - people.length }
}

export const peopleFromCsv = (csv) => peopleFromRows(parseCsv(csv))

/** Adds the people not already on the list, matched by phone or email. */
const addPeople = async (store, { people, rowsRead, repeatsRemoved }, by) => {
  const existing = await store.listAttendees()
  const known = new Set()
  for (const a of existing) {
    if (a.phone) known.add(`p:${a.phone}`)
    if (a.email) known.add(`e:${a.email}`)
  }
  const fresh = people.filter((p) => !(p.phone && known.has(`p:${p.phone}`)) && !(p.email && known.has(`e:${p.email}`)))
  const now = new Date().toISOString()
  const docs = fresh.map((p) => ({ _id: newId(), _type: 'summitAttendee', ...p, source: 'online', importedAt: now, importedBy: by }))
  for (let i = 0; i < docs.length; i += CREATE_CHUNK) await store.createAttendees(docs.slice(i, i + CREATE_CHUNK))
  return { rowsRead, repeatsRemoved, people: people.length, added: docs.length, alreadyThere: people.length - docs.length }
}

export const importRegistrations = async ({ store, user, body }) => addPeople(store, peopleFromCsv(body.csv), user.name)

// ─── Reading the Google Sheet directly ──────────────────────────────────────
// The form's Apps Script hands over the sheet's rows when asked with the
// private key, so new registrations reach the list without a CSV. The sheet is
// only ever read.

// state: ok | not-connected (no key set) | needs-update (old script) | refused (wrong key) | unreachable
const readSheet = async (env, fetcher) => {
  const key = env.REGISTRATION_STATS_KEY
  if (!key) return { state: 'not-connected' }
  try {
    const res = await fetcher(`${SHEET_URL}?rows=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(SHEET_TIMEOUT_MS) })
    const data = await res.json()
    if (data.ok && Array.isArray(data.headers) && Array.isArray(data.rows)) {
      return { state: 'ok', rows: [data.headers, ...data.rows] }
    }
    return { state: data.status === 'ready' || (data.ok && data.total !== undefined) ? 'needs-update' : 'refused' }
  } catch {
    return { state: 'unreachable' }
  }
}

const SYNC_MESSAGES = {
  'not-connected': 'The dashboard is not connected to the form yet (REGISTRATION_STATS_KEY is not set).',
  'needs-update': "The form's script needs its new version before the sheet can be read. Publish the private copy as a new deployment.",
  refused: "The form's script refused the key. It must match STATS_KEY in the private script.",
  unreachable: 'Google did not answer in time. Try again in a moment.',
}

/** Reads the sheet and adds anyone new. Records the outcome on the event so every screen can show it. */
const syncSheet = async (store, env, fetcher) => {
  const at = new Date().toISOString()
  const sheet = await readSheet(env, fetcher)
  if (sheet.state !== 'ok') {
    await store.patchEvent({ syncAt: at, syncState: sheet.state })
    return { state: sheet.state, at, error: SYNC_MESSAGES[sheet.state] }
  }
  let parsed
  try {
    parsed = peopleFromRows(sheet.rows)
  } catch {
    parsed = { people: [], rowsRead: 0, repeatsRemoved: 0 }
  }
  const result = await addPeople(store, parsed, SYNC_USER)
  await store.patchEvent({ syncAt: at, syncState: 'ok', syncRows: result.rowsRead, syncAdded: result.added })
  return { state: 'ok', at, ...result }
}

export const syncFromSheet = async ({ store, env, fetcher }) => {
  const result = await syncSheet(store, env, fetcher)
  if (result.state !== 'ok') fail(result.state === 'unreachable' ? 503 : 409, result.error)
  return result
}

/** Called by the list: re-reads the sheet when the last look is older than SYNC_EVERY_MS. Never fails the list. */
const syncIfStale = async (store, env, fetcher, now) => {
  if (!env.REGISTRATION_STATS_KEY) return
  const e = (await store.getEvent()) || {}
  const last = e.syncAt ? new Date(e.syncAt).getTime() : 0
  if (now - last < SYNC_EVERY_MS) return
  // Claim the slot first, so a room full of door phones does not all read the sheet at once.
  await store.patchEvent({ syncAt: new Date(now).toISOString() })
  try {
    await syncSheet(store, env, fetcher)
  } catch {
    // The list still loads; the next refresh tries again.
  }
}

const syncInfo = (e, env) => ({
  state: e.syncState || (env.REGISTRATION_STATS_KEY ? 'pending' : 'not-connected'),
  at: e.syncAt || null,
  rows: e.syncRows || 0,
  added: e.syncAdded || 0,
  message: SYNC_MESSAGES[e.syncState] || '',
})

// ─── The event and the door code ────────────────────────────────────────────

const event = async (store) => ({ ...DEFAULT_EVENT, ...((await store.getEvent()) || {}) })

export const getEvent = async ({ store, user, env = {} }) => {
  const e = await event(store)
  const attendees = await store.listAttendees()
  const checkedIn = attendees.filter((a) => a.checkedInAt)
  return {
    event: { name: e.name, date: e.date, venue: e.venue, hasCode: !!e.doorCodeHash },
    sync: syncInfo(e, env),
    counts: {
      registered: attendees.length,
      online: attendees.filter((a) => a.source !== 'walk-in').length,
      walkIns: attendees.filter((a) => a.source === 'walk-in').length,
      checkedIn: checkedIn.length,
    },
    role: user.role,
  }
}

export const setEvent = async ({ store, body }) => {
  const e = body.event || {}
  const data = { name: clean('name', e.name), date: clean('date', e.date), venue: clean('venue', e.venue) }
  if (!data.name || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !data.venue) fail(400, 'Check the event name, date and venue.')
  await store.patchEvent(data)
  return { ok: true }
}

export const setDoorCode = async ({ store, body }) => {
  const code = String(body.code || '').trim()
  if (code.length < MIN_CODE || code.length > MAX_CODE) fail(400, `The door code needs ${MIN_CODE} to ${MAX_CODE} characters.`)
  const current = (await store.getEvent()) || {}
  await store.patchEvent({ doorCodeHash: await hashPassword(code), codeVersion: (current.codeVersion || 0) + 1 })
  return { ok: true }
}

export const DOOR_USER = { _id: 'door', name: 'Door team', role: 'door', active: true }

let doorTries = { minute: 0, count: 0 }
const doorTriesExceeded = () => {
  const minute = Math.floor(Date.now() / 60000)
  if (doorTries.minute !== minute) doorTries = { minute, count: 0 }
  doorTries.count += 1
  return doorTries.count > DOOR_TRIES_PER_MINUTE
}

/** Volunteers sign in with the event's door code instead of an account. */
export const doorLogin = async ({ store, body, env }) => {
  if (doorTriesExceeded()) fail(429, 'Too many tries. Wait a minute and try again.')
  const e = (await store.getEvent()) || {}
  if (!e.doorCodeHash) fail(403, 'No door code has been set yet. Ask the organiser.')
  if (!(await verifyPassword(String(body.code || '').trim(), e.doorCodeHash))) fail(401, 'That door code is not right.')
  return { token: issueSession({ ...DOOR_USER, sessionVersion: e.codeVersion || 0 }, env.ADMIN_SESSION_SECRET, Date.now(), DOOR_SESSION_MS), user: { id: 'door', name: DOOR_USER.name, role: 'door' } }
}

/** True while the door token's code version is still the current one. */
export const doorSessionValid = async (store, session) => session.sv === (((await store.getEvent()) || {}).codeVersion || 0)

// ─── Check-in ───────────────────────────────────────────────────────────────

export const listAttendees = async ({ store, user, env = {}, fetcher = fetch }) => {
  await syncIfStale(store, env, fetcher, Date.now())
  const attendees = await store.listAttendees()
  return { attendees: attendees.map(user.role === 'door' ? forDoor : forStaff), fetchedAt: new Date().toISOString() }
}

const existing = async (store, id) => {
  const doc = await store.getAttendee(`${ID_PREFIX}${String(id || '').replace(/[^a-z0-9]/gi, '')}`)
  if (!doc) fail(404, 'That person was not found on the list.')
  return doc
}

const stampTime = (value) => {
  const when = new Date(value || Date.now())
  // A time reported from a phone that was offline is kept, but never from the future.
  return (isNaN(when.getTime()) || when.getTime() > Date.now() + 60000 ? new Date() : when).toISOString()
}

/** Marks someone as arrived. Doing it twice changes nothing. */
export const checkIn = async ({ store, user, body }) => {
  const doc = await existing(store, body.id)
  const view = user.role === 'door' ? forDoor : forStaff
  if (doc.checkedInAt) return { attendee: view(doc), already: true }
  const set = { checkedInAt: stampTime(body.at), checkedInBy: user.name }
  await store.patchAttendee(doc._id, set)
  return { attendee: view({ ...doc, ...set }), already: false }
}

export const undoCheckIn = async ({ store, user, body }) => {
  const doc = await existing(store, body.id)
  await store.patchAttendee(doc._id, {}, ['checkedInAt', 'checkedInBy'])
  const view = user.role === 'door' ? forDoor : forStaff
  return { attendee: view({ ...doc, checkedInAt: undefined, checkedInBy: undefined }) }
}

/** Registers someone at the entrance and checks them in. A known phone or email finds the existing record instead. */
export const walkIn = async ({ store, user, body }) => {
  const fields = cleanAttendee(body.attendee)
  const view = user.role === 'door' ? forDoor : forStaff
  const all = await store.listAttendees()
  const match = all.find((a) => (fields.phone && a.phone === fields.phone) || (fields.email && a.email === fields.email))
  if (match) {
    if (match.checkedInAt) return { attendee: view(match), existing: true, already: true }
    const set = { checkedInAt: stampTime(body.at), checkedInBy: user.name }
    await store.patchAttendee(match._id, set)
    return { attendee: view({ ...match, ...set }), existing: true, already: false }
  }
  const at = stampTime(body.at)
  const doc = {
    _id: newId(), _type: 'summitAttendee', ...fields,
    source: 'walk-in', registeredAt: at, submissions: 1, registeredBy: user.name,
    checkedInAt: at, checkedInBy: user.name,
  }
  await store.createAttendees([doc])
  return { attendee: view(doc), existing: false, already: false }
}

export const updateAttendee = async ({ store, user, body }) => {
  const doc = await existing(store, body.id)
  const fields = cleanAttendee({ ...doc, ...(body.fields || {}) })
  await store.patchAttendee(doc._id, { ...fields, updatedBy: user.name, updatedAt: new Date().toISOString() })
  return { attendee: forStaff({ ...doc, ...fields }) }
}

// ─── The report ─────────────────────────────────────────────────────────────

const ageBand = (age) => {
  const n = parseInt(age, 10)
  if (!n) return 'Not stated'
  if (n < 18) return 'Under 18'
  if (n <= 24) return '18 to 24'
  if (n <= 35) return '25 to 35'
  return '36 and over'
}

const placeOf = (location) => {
  const part = String(location || '').split(',').pop().trim().toLowerCase()
  return part ? part.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : 'Not stated'
}

const tally = (items, pick) => {
  const counts = {}
  for (const item of items) {
    for (const value of [].concat(pick(item)).map((v) => String(v || '').trim() || 'Not stated')) counts[value] = (counts[value] || 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

const slotOf = (iso) => {
  const d = new Date(iso)
  const minutes = d.getUTCMinutes() < 30 ? '00' : '30'
  return `${String(d.getUTCHours()).padStart(2, '0')}:${minutes}`
}

export const report = async ({ store }) => {
  const e = await event(store)
  const all = (await store.listAttendees()).sort((a, b) => a.name.localeCompare(b.name))
  const arrived = all.filter((a) => a.checkedInAt)
  const online = all.filter((a) => a.source !== 'walk-in')
  const walkIns = all.filter((a) => a.source === 'walk-in')
  const onlineArrived = online.filter((a) => a.checkedInAt)
  const times = arrived.map((a) => a.checkedInAt).sort()
  const slots = tally(arrived, (a) => slotOf(a.checkedInAt)).sort((a, b) => a.name.localeCompare(b.name))
  const person = (a) => ({ id: shortId(a), name: a.name, location: a.location || '', phoneEnd: a.phone ? a.phone.slice(-4) : '', checkedInAt: a.checkedInAt || null, checkedInBy: a.checkedInBy || '', needs: a.needs || '' })

  return {
    event: { name: e.name, date: e.date, venue: e.venue },
    generatedAt: new Date().toISOString(),
    totals: {
      registered: all.length,
      online: online.length,
      walkIns: walkIns.length,
      attended: arrived.length,
      onlineAttended: onlineArrived.length,
      noShows: online.length - onlineArrived.length,
      attendanceRate: online.length ? Math.round((onlineArrived.length / online.length) * 100) : 0,
      firstArrival: times[0] || null,
      lastArrival: times.at(-1) || null,
      withNeeds: arrived.filter((a) => a.needs).length,
      photoConsent: arrived.filter((a) => /^y/i.test(a.consentPhotos || '')).length,
      contactConsent: arrived.filter((a) => /^y/i.test(a.consentContact || '')).length,
    },
    arrivalsBySlot: slots,
    attended: {
      gender: tally(arrived, (a) => a.gender),
      age: tally(arrived, (a) => ageBand(a.age)),
      status: tally(arrived, (a) => a.status),
      interest: tally(arrived, (a) => a.interest),
      education: tally(arrived, (a) => a.education),
      location: tally(arrived, (a) => placeOf(a.location)).slice(0, 10),
      heard: tally(arrived, (a) => a.heard),
      inAgri: tally(arrived, (a) => a.inAgri),
      gain: tally(arrived, (a) => String(a.gain || '').split(';')),
    },
    registered: {
      gender: tally(all, (a) => a.gender),
      age: tally(all, (a) => ageBand(a.age)),
      interest: tally(all, (a) => a.interest),
    },
    checkedInBy: tally(arrived, (a) => a.checkedInBy),
    needs: arrived.filter((a) => a.needs).map(person),
    walkIns: walkIns.map(person),
    noShows: online.filter((a) => !a.checkedInAt).map(person),
  }
}
