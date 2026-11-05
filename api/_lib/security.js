// Password hashing and signed session tokens for the admin API.
import crypto from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(crypto.scrypt)
const KEY_LENGTH = 64

export const SESSION_TTL_MS = 1000 * 60 * 60 * 8 // 8 hours

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const safeEqual = (a, b) => {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const key = await scrypt(String(password), salt, KEY_LENGTH)
  return `scrypt$${salt}$${key.toString('hex')}`
}

export const verifyPassword = async (password, stored) => {
  const [scheme, salt, hash] = String(stored).split('$')
  if (scheme !== 'scrypt' || !salt || !hash) return false
  const key = await scrypt(String(password), salt, KEY_LENGTH)
  return safeEqual(key.toString('hex'), hash)
}

// Compared against when the email is unknown, so both failures do the same work.
export const DUMMY_HASH = `scrypt$${'0'.repeat(32)}$${'0'.repeat(KEY_LENGTH * 2)}`

export const temporaryPassword = () => crypto.randomBytes(12).toString('base64url')

const sign = (payload, secret) => b64url(crypto.createHmac('sha256', secret).update(payload).digest())

export const issueSession = (user, secret, now = Date.now(), ttl = SESSION_TTL_MS) => {
  const payload = b64url(JSON.stringify({ uid: user._id, sv: user.sessionVersion || 0, exp: now + ttl }))
  return `${payload}.${sign(payload, secret)}`
}

export const readSession = (token, secret, now = Date.now()) => {
  if (typeof token !== 'string' || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  if (!safeEqual(sig, sign(payload, secret))) return null
  try {
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    return typeof data.exp === 'number' && data.exp > now ? data : null
  } catch {
    return null
  }
}
