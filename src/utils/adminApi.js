// Client helper for the staff dashboard's server API (/api/admin).
// The Sanity write token lives ONLY on the server; this talks to it over HTTP.
// The session token is kept in sessionStorage so a refresh keeps you logged in
// until it expires (server-enforced).

const ENDPOINT = '/api/admin'
const STORAGE_KEY = 'swk-admin-session'

export const SESSION_EXPIRED_EVENT = 'swk-admin-session-expired'

export const getSession = () => {
  try { return sessionStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
}
const setSession = (t) => { try { sessionStorage.setItem(STORAGE_KEY, t) } catch { /* storage unavailable */ } }
export const clearSession = () => { try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* storage unavailable */ } }
/** Puts back a token kept elsewhere, such as the door page's longer-lived one. */
export const restoreSession = (token) => { if (token) setSession(token) }

async function call(action, payload = {}) {
  const token = getSession()
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, token, ...payload }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && token && action !== 'password.change') window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

// Accounts
export const getStatus = () => call('status')
export const setupOwner = (fields) => call('setup', fields)
export async function login(email, password) {
  const { token, user } = await call('login', { email, password })
  setSession(token)
  return user
}
export const getMe = async () => (await call('me')).user
/** Changing a password ends the session, so this signs back in with the new one. */
export async function changePassword(email, currentPassword, newPassword) {
  await call('password.change', { currentPassword, newPassword })
  return login(email, newPassword)
}

// Team (Owner)
export const listUsers = async () => (await call('users.list')).users
export const createUser = (fields) => call('users.create', fields)
export const updateUser = (id, changes) => call('users.update', { id, ...changes })
export const resetUserPassword = (id) => call('users.resetPassword', { id })

// Dashboard
export const getOverview = () => call('overview')
export const setCampaign = (campaign) => call('campaign.set', { campaign })
export const getRegistrations = async () => (await call('registrations')).forms
export const getVisitors = () => call('visitors')
export const getQuality = () => call('quality')

// Receipts
export const listReceipts = async () => (await call('receipts.list')).receipts
export const issueReceipt = async (receipt) => (await call('receipts.issue', { receipt })).receipt
export const recordReceipt = async (no, issued, receipt) => (await call('receipts.record', { no, issued, receipt })).receipt
export const updateReceipt = async (no, receipt) => (await call('receipts.update', { no, receipt })).receipt
export const cancelReceipt = (no, reason) => call('receipts.cancel', { no, reason })
export const getSignature = async () => (await call('signature.get')).dataUri
export const setSignature = (dataUri) => call('signature.set', { dataUri })

// Summit check-in
export const getSummitEvent = () => call('summit.event')
export const listAttendees = () => call('summit.list')
export const checkInAttendee = (id, at) => call('summit.checkin', { id, at })
export const undoCheckIn = (id) => call('summit.undo', { id })
export const registerWalkIn = (attendee, at) => call('summit.walkin', { attendee, at })
export const updateAttendee = (id, fields) => call('summit.update', { id, fields })
export const importRegistrations = (csv) => call('summit.import', { csv })
export const syncRegistrations = () => call('summit.sync')
export const setSummitEvent = (event) => call('summit.setEvent', { event })
export const setDoorCode = (code) => call('summit.setCode', { code })
export const getSummitReport = () => call('summit.report')
/** The door team's sign-in: an event code instead of an account. */
export async function doorLogin(code) {
  const { token, user } = await call('door.login', { code })
  setSession(token)
  return user
}

// Website content
/** Create a document. Returns the created document (with _id). */
export const createDoc = async (doc) => (await call('create', { doc })).document
/** Patch a document's fields (set). */
export const patchDoc = (id, set) => call('patch', { id, set })
/** Delete a document by id. */
export const deleteDoc = (id) => call('delete', { id })
