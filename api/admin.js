// Vercel serverless function — server-side Sanity admin proxy.
//
// This is the ONLY place the Sanity write token lives. It runs on the server,
// so the token (SANITY_TOKEN) is never shipped to the browser. Admins log in
// with a password (checked server-side against ADMIN_PASSWORD) and receive a
// short-lived HMAC-signed session token; every write must present that token.
//
// Required environment variables (set in Vercel → Project → Settings → Env):
//   SANITY_TOKEN          Sanity Editor/write token (server secret)
//   ADMIN_PASSWORD        Admin login password (server secret)
//   ADMIN_SESSION_SECRET  Random string used to sign session tokens
//   SANITY_PROJECT_ID     Optional, defaults to 'qaen86pl'
//   SANITY_DATASET        Optional, defaults to 'production'

import crypto from 'crypto'

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'qaen86pl'
const DATASET = process.env.SANITY_DATASET || 'production'
const API_VERSION = '2024-01-01'
const SESSION_TTL_MS = 1000 * 60 * 60 * 8 // 8 hours

// Only these document types may be created/edited/deleted through this proxy.
const ALLOWED_TYPES = ['post', 'marketplaceProduct']

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const sign = (payloadB64, secret) =>
  b64url(crypto.createHmac('sha256', secret).update(payloadB64).digest())

const issueSession = (secret) => {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })
  const payloadB64 = b64url(payload)
  return `${payloadB64}.${sign(payloadB64, secret)}`
}

const verifySession = (token, secret) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false
  const [payloadB64, sig] = token.split('.')
  const expected = sign(payloadB64, secret)
  // constant-time comparison
  if (sig.length !== expected.length) return false
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

const sanityMutate = async (mutations, token) => {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}?returnIds=true&returnDocuments=true`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = data?.error?.description || data?.message || `Sanity error (${res.status})`
    const err = new Error(detail)
    err.status = res.status
    throw err
  }
  return data
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { ADMIN_PASSWORD, ADMIN_SESSION_SECRET, SANITY_TOKEN } = process.env
  if (!ADMIN_PASSWORD || !ADMIN_SESSION_SECRET || !SANITY_TOKEN) {
    return res.status(500).json({
      error: 'Server not configured. Set SANITY_TOKEN, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the environment.',
    })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  body = body || {}
  const { action } = body

  try {
    // ── Login ──────────────────────────────────────────────────────────────
    if (action === 'login') {
      const supplied = String(body.password || '')
      const expected = String(ADMIN_PASSWORD)
      const ok =
        supplied.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
      if (!ok) return res.status(401).json({ error: 'Incorrect password' })
      return res.status(200).json({ token: issueSession(ADMIN_SESSION_SECRET) })
    }

    // ── Everything below requires a valid session ────────────────────────────
    if (!verifySession(body.token, ADMIN_SESSION_SECRET)) {
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' })
    }

    if (action === 'create') {
      const doc = body.doc || {}
      if (!ALLOWED_TYPES.includes(doc._type)) {
        return res.status(400).json({ error: `Type "${doc._type}" is not allowed` })
      }
      const result = await sanityMutate([{ create: doc }], SANITY_TOKEN)
      return res.status(200).json({ document: result.results?.[0]?.document || null })
    }

    if (action === 'patch') {
      if (!body.id || typeof body.set !== 'object') {
        return res.status(400).json({ error: 'Missing id or set payload' })
      }
      await sanityMutate([{ patch: { id: body.id, set: body.set } }], SANITY_TOKEN)
      return res.status(200).json({ ok: true })
    }

    if (action === 'delete') {
      if (!body.id) return res.status(400).json({ error: 'Missing id' })
      await sanityMutate([{ delete: { id: body.id } }], SANITY_TOKEN)
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: `Unknown action: ${action}` })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'Server error' })
  }
}
