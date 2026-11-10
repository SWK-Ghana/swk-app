// Routes admin API actions: who may call what, and the content tools' limits.
import { readSession } from './security.js'
import { fail } from './errors.js'
import * as accounts from './accounts.js'
import * as receipts from './receipts.js'
import { registrations } from './registrations.js'
import { visitors } from './visits.js'
import { quality } from './quality.js'
import * as summit from './summit.js'
import * as certificates from './certificates.js'

// Only these document types may be created through the content tools.
const ALLOWED_TYPES = ['post', 'marketplaceProduct']

// Private documents have a dot in their _id. The content tools must never reach them.
const publicId = (id) => {
  if (typeof id !== 'string' || !id || id.includes('.')) fail(400, 'That document cannot be changed here.')
  return id
}

const content = {
  create: async ({ store, body }) => {
    const doc = body.doc || {}
    if (!ALLOWED_TYPES.includes(doc._type)) fail(400, `Type "${doc._type}" is not allowed`)
    if (doc._id !== undefined) publicId(doc._id)
    return { document: await store.createDoc(doc) }
  },
  patch: async ({ store, body }) => {
    const id = publicId(body.id)
    const set = body.set
    if (!set || typeof set !== 'object' || '_id' in set || '_type' in set) fail(400, 'Missing or invalid changes')
    await store.patchDoc(id, set)
    return { ok: true }
  },
  delete: async ({ store, body }) => {
    await store.deleteDoc(publicId(body.id))
    return { ok: true }
  },
}

const PUBLIC_ACTIONS = {
  status: accounts.status, setup: accounts.setup, login: accounts.login, 'door.login': summit.doorLogin,
  'certificate.get': certificates.publicCertificate,
}

const OWNER = ['owner']
const MONEY = ['owner', 'finance']
const EDITORS = ['owner', 'content']
const STAFF = ['owner', 'finance', 'content']
const EVERYONE = accounts.ROLES
// The door team signs in with the event code and sees only the check-in tools.
const DOOR = ['door', ...EVERYONE]

const ACTIONS = {
  me: [DOOR, accounts.me],

  'summit.event': [DOOR, summit.getEvent],
  'summit.list': [DOOR, summit.listAttendees],
  'summit.checkin': [DOOR, summit.checkIn],
  'summit.undo': [DOOR, summit.undoCheckIn],
  'summit.walkin': [DOOR, summit.walkIn],
  'summit.report': [EVERYONE, summit.report],
  'summit.update': [MONEY, summit.updateAttendee],
  'summit.import': [OWNER, summit.importRegistrations],
  'summit.sync': [EVERYONE, summit.syncFromSheet],
  'summit.setEvent': [OWNER, summit.setEvent],
  'summit.setCode': [OWNER, summit.setDoorCode],

  'password.change': [EVERYONE, accounts.changePassword],
  overview: [EVERYONE, receipts.overview],
  registrations: [EVERYONE, registrations],
  visitors: [EVERYONE, visitors],
  quality: [EVERYONE, quality],

  'users.list': [OWNER, accounts.listUsers],
  'users.create': [OWNER, accounts.createUser],
  'users.update': [OWNER, accounts.updateUser],
  'users.resetPassword': [OWNER, accounts.resetPassword],

  'receipts.list': [MONEY, receipts.listReceipts],
  'receipts.issue': [MONEY, receipts.issueReceipt],
  'receipts.update': [MONEY, receipts.updateReceipt],
  'receipts.cancel': [MONEY, receipts.cancelReceipt],
  'receipts.record': [OWNER, receipts.recordReceipt],
  'signature.get': [STAFF, receipts.getSignature],
  'certificates.list': [EVERYONE, certificates.listCertificates],
  'certificates.issue': [STAFF, certificates.issueCertificate],
  'certificates.issueMany': [STAFF, certificates.issueCertificates],
  'certificates.update': [STAFF, certificates.updateCertificate],
  'certificates.revoke': [OWNER, certificates.revokeCertificate],
  'signature.set': [OWNER, receipts.setSignature],
  'campaign.set': [OWNER, receipts.setCampaign],

  create: [EDITORS, content.create],
  patch: [EDITORS, content.patch],
  delete: [EDITORS, content.delete],
}

// Allowed while a temporary password is still in place.
const BEFORE_PASSWORD_CHANGE = ['me', 'password.change']

// The account is re-read on every request, so a change takes effect at once.
const signedInUser = async (store, token, secret) => {
  const session = readSession(token, secret)
  if (session?.uid === 'door') {
    if (!(await summit.doorSessionValid(store, session))) fail(401, 'The door code has changed. Please enter the new one.')
    return summit.DOOR_USER
  }
  const user = session && (await store.getUser(session.uid))
  if (!user || user.active === false || (user.sessionVersion || 0) !== session.sv) {
    fail(401, 'Session expired or invalid. Please log in again.')
  }
  return user
}

export const createHandler = (makeStore, env = process.env, fetcher = fetch) => async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET || !env.SANITY_TOKEN) {
    return res.status(500).json({
      error: 'Server not configured. Set SANITY_TOKEN, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the environment.',
    })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  body = body || {}

  try {
    const store = makeStore()
    const action = String(body.action || '')

    if (Object.hasOwn(PUBLIC_ACTIONS, action)) {
      return res.status(200).json(await PUBLIC_ACTIONS[action]({ store, body, env }))
    }

    const user = await signedInUser(store, body.token, env.ADMIN_SESSION_SECRET)
    if (!Object.hasOwn(ACTIONS, action)) fail(400, `Unknown action: ${action}`)
    const [roles, run] = ACTIONS[action]
    if (user.mustChangePassword && !BEFORE_PASSWORD_CHANGE.includes(action)) fail(403, 'Please set a new password first.')
    if (!roles.includes(user.role)) fail(403, 'Your role does not allow this.')
    return res.status(200).json(await run({ store, user, body, env, fetcher }))
  } catch (err) {
    const status = err.status || 500
    // Sanity's own permission errors are worth showing; anything unexpected is not.
    const message = err.expose || status < 500 ? err.message : 'Server error'
    return res.status(status).json({ error: message })
  }
}
