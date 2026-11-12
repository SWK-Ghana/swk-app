// Certificates for the people who made the Summit: participants, volunteers,
// speakers, panellists, workshop leads, demonstrators, pitch judges and
// partners. Each one is a private Sanity document (cert.<number>) with a
// serial number and a short random key; the public page shows a certificate
// only when both match, so names cannot be listed by counting upwards.
import crypto from 'crypto'
import { fail } from './errors.js'
import { DEFAULT_EVENT } from './summit.js'

export const SERIES = 'SWK-AS26' // Agribusiness Summit 2026
export const ROLES = [
  'participant', 'volunteer', 'panellist', 'moderator', 'spotlight', 'panelspot', 'workshop',
  'goodwill', 'solidarity', 'performer', 'keynote', 'demonstration', 'judge', 'partner',
]
const NUMBER = new RegExp(`^${SERIES}-\\d{4}$`)
const PUBLIC_ID = new RegExp(`^(${SERIES}-\\d{4})-([A-HJ-NP-Z2-9]{4})$`)
const KEY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O or 1/I to misread
const NUMBER_RETRIES = 5
const MAX_BATCH = 300
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

const text = (value, max) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max + 1)
const today = () => new Date().toISOString().slice(0, 10)
const padded = (n) => `${SERIES}-${String(n).padStart(4, '0')}`
const randomKey = () => {
  const bytes = crypto.randomBytes(4)
  return [...bytes].map((b) => KEY_ALPHABET[b % KEY_ALPHABET.length]).join('')
}

// Only these fields ever reach a certificate, so numbers, status and authorship can't be forged.
const cleanCertificate = (input = {}) => {
  const name = text(input.name, 120)
  if (!name || name.length > 120) fail(400, "Enter the person's name, up to 120 characters.")
  const role = String(input.role || '').trim()
  if (!ROLES.includes(role)) fail(400, 'Choose a role for the certificate.')
  const detail = text(input.detail, 140)
  if (detail.length > 140) fail(400, 'Keep the detail line under 140 characters.')
  const attendeeId = text(input.attendeeId, 40).replace(/[^a-z0-9.]/gi, '')
  return { name, role, detail, attendeeId }
}

export const forPublic = (c) => ({
  id: `${c.no}-${c.key}`,
  no: c.no,
  name: c.name,
  role: c.role,
  detail: c.detail || '',
  event: c.event,
  eventDate: c.eventDate,
  venue: c.venue,
  issued: c.issued,
})

const forStaff = (c) => ({ ...c, id: `${c.no}-${c.key}`, _id: undefined, _type: undefined, _rev: undefined, _createdAt: undefined, _updatedAt: undefined })

const eventFields = async (store) => {
  const e = { ...DEFAULT_EVENT, ...((await store.getEvent()) || {}) }
  return { event: e.name, eventDate: e.date, venue: e.venue }
}

/** Gives one cleaned certificate the next free number. */
const numberAndSave = async (store, user, clean, ev) => {
  for (let attempt = 0; attempt < NUMBER_RETRIES; attempt++) {
    const used = await store.certificateNumbers(SERIES)
    const next = Math.max(0, ...used.map((no) => parseInt(no.split('-')[2], 10) || 0)) + 1
    const cert = {
      ...clean,
      ...ev,
      no: padded(next),
      key: randomKey(),
      issued: today(),
      issuedBy: user.name,
      issuedAt: new Date().toISOString(),
      status: 'issued',
    }
    try {
      await store.createCertificate(cert)
      return cert
    } catch (err) {
      if (err.status !== 409) throw err
    }
  }
  fail(503, 'Could not get a certificate number. Please try again.')
}

export const issueCertificate = async ({ store, user, body }) => {
  const clean = cleanCertificate(body.certificate)
  const cert = await numberAndSave(store, user, clean, await eventFields(store))
  return { certificate: forStaff(cert) }
}

/** Issues many at once, skipping anyone who already holds a certificate for that role. */
export const issueCertificates = async ({ store, user, body }) => {
  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) fail(400, 'Choose at least one person.')
  if (items.length > MAX_BATCH) fail(400, `Issue at most ${MAX_BATCH} certificates at a time.`)
  const cleaned = items.map(cleanCertificate)
  const existing = await store.listCertificates()
  const held = new Set()
  for (const c of existing) {
    if (c.status === 'revoked') continue
    if (c.attendeeId) held.add(`a:${c.attendeeId}:${c.role}`)
    held.add(`n:${c.name.toLowerCase()}:${c.role}`)
  }
  const ev = await eventFields(store)
  const issued = []
  let skipped = 0
  for (const clean of cleaned) {
    const keys = [`n:${clean.name.toLowerCase()}:${clean.role}`, clean.attendeeId && `a:${clean.attendeeId}:${clean.role}`].filter(Boolean)
    if (keys.some((k) => held.has(k))) { skipped++; continue }
    const cert = await numberAndSave(store, user, clean, ev)
    keys.forEach((k) => held.add(k))
    issued.push(forStaff(cert))
  }
  return { issued, skipped }
}

const existing = async (store, no) => {
  if (!NUMBER.test(String(no || ''))) fail(400, 'That is not a certificate number.')
  const cert = await store.getCertificate(no)
  if (!cert) fail(404, 'That certificate was not found.')
  return cert
}

/** Fixes a name or detail line; the number and key stay the same. */
export const updateCertificate = async ({ store, user, body }) => {
  const cert = await existing(store, body.no)
  if (cert.status === 'revoked') fail(400, 'A revoked certificate cannot be changed.')
  const clean = cleanCertificate({ ...cert, ...(body.fields || {}) })
  const set = { name: clean.name, role: clean.role, detail: clean.detail, updatedBy: user.name, updatedAt: new Date().toISOString() }
  await store.patchCertificate(cert.no, set)
  return { certificate: forStaff({ ...cert, ...set }) }
}

export const revokeCertificate = async ({ store, user, body }) => {
  const cert = await existing(store, body.no)
  const reason = text(body.reason, 160)
  if (!reason) fail(400, 'Say why the certificate is being revoked.')
  const set = { status: 'revoked', revokeReason: reason, revokedBy: user.name, revokedAt: new Date().toISOString() }
  await store.patchCertificate(cert.no, set)
  return { certificate: forStaff({ ...cert, ...set }) }
}

export const listCertificates = async ({ store }) => ({ certificates: (await store.listCertificates()).map(forStaff) })

/** The public page: a certificate by its full id (number and key), with the signature to print it. */
export const publicCertificate = async ({ store, body }) => {
  const match = PUBLIC_ID.exec(String(body.id || '').trim().toUpperCase())
  if (!match) fail(404, 'No certificate matches that link.')
  const cert = await store.getCertificate(match[1])
  if (!cert || cert.key !== match[2] || cert.status !== 'issued') fail(404, 'No certificate matches that link.')
  return { certificate: forPublic(cert), signature: (await store.getSignature()) || null }
}

export const isIsoDate = (value) => ISO_DATE.test(String(value || ''))
