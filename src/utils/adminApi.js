// Client helper for the server-side admin proxy (/api/admin).
// The Sanity write token lives ONLY on the server; this talks to it over HTTP.
// The session token is kept in memory + sessionStorage so a refresh keeps you
// logged in until it expires (server-enforced).

const ENDPOINT = '/api/admin'
const STORAGE_KEY = 'swk-admin-session'

export const getSession = () => {
  try { return sessionStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
}
const setSession = (t) => { try { sessionStorage.setItem(STORAGE_KEY, t) } catch { /* storage unavailable */ } }
export const clearSession = () => { try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* storage unavailable */ } }

async function post(payload) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

/** Log in with the admin password. Returns true on success; throws on failure. */
export async function login(password) {
  const { token } = await post({ action: 'login', password })
  setSession(token)
  return true
}

/** Create a document. Returns the created document (with _id). */
export async function createDoc(doc) {
  const { document } = await post({ action: 'create', token: getSession(), doc })
  return document
}

/** Patch a document's fields (set). */
export async function patchDoc(id, set) {
  return post({ action: 'patch', token: getSession(), id, set })
}

/** Delete a document by id. */
export async function deleteDoc(id) {
  return post({ action: 'delete', token: getSession(), id })
}
