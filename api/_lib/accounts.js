// Staff accounts: first-run setup, login, and the owner's team management.
import crypto from 'crypto'
import { DUMMY_HASH, hashPassword, issueSession, safeEqual, temporaryPassword, verifyPassword } from './security.js'
import { fail } from './errors.js'

export const ROLES = ['owner', 'finance', 'content', 'viewer']

const MAX_FAILED_LOGINS = 5
const LOCK_MS = 15 * 60 * 1000
const MIN_PASSWORD = 10
const BAD_LOGIN = 'Incorrect email or password. After five wrong tries an account locks for 15 minutes.'

const cleanEmail = (value) => {
  const email = String(value || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) fail(400, 'Enter a valid email address.')
  return email
}
const cleanName = (value) => {
  const name = String(value || '').trim()
  if (!name || name.length > 120) fail(400, 'Enter a name of up to 120 characters.')
  return name
}
const checkPassword = (value) => {
  if (typeof value !== 'string' || value.length < MIN_PASSWORD) fail(400, `Passwords need at least ${MIN_PASSWORD} characters.`)
  return value
}

// What the browser may see of an account.
export const publicUser = (u) => ({
  id: u._id, name: u.name, email: u.email, role: u.role, active: u.active !== false,
  mustChangePassword: !!u.mustChangePassword,
})

export const status = async ({ store }) => ({ needsSetup: (await store.countUsers()) === 0 })

export const setup = async ({ store, body, env }) => {
  if ((await store.countUsers()) > 0) fail(403, 'Setup is already complete. Please log in.')
  if (!safeEqual(body.adminPassword || '', env.ADMIN_PASSWORD)) fail(401, 'That is not the setup password.')
  // A fixed id, so two setups racing each other cannot both succeed.
  await store.createUser({
    _id: 'admin.user.first-owner',
    name: cleanName(body.name),
    email: cleanEmail(body.email),
    role: 'owner',
    active: true,
    passwordHash: await hashPassword(checkPassword(body.password)),
    mustChangePassword: false,
    failedLogins: 0,
    sessionVersion: 0,
  })
  return { ok: true }
}

export const login = async ({ store, body, env }) => {
  const email = String(body.email || '').trim().toLowerCase()
  const user = await store.getUserByEmail(email)
  const hash = user?.passwordHash || DUMMY_HASH
  const matches = await verifyPassword(body.password || '', hash)

  const locked = user?.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()
  if (!user || user.active === false || locked || !matches) {
    if (user && !locked) {
      const failedLogins = (user.failedLogins || 0) + 1
      await store.patchUser(user._id, failedLogins >= MAX_FAILED_LOGINS
        ? { failedLogins: 0, lockedUntil: new Date(Date.now() + LOCK_MS).toISOString() }
        : { failedLogins })
    }
    fail(401, BAD_LOGIN)
  }
  if (user.failedLogins || user.lockedUntil) await store.patchUser(user._id, { failedLogins: 0, lockedUntil: null })
  return { token: issueSession(user, env.ADMIN_SESSION_SECRET), user: publicUser(user) }
}

export const me = async ({ user }) => ({ user: publicUser(user) })

export const changePassword = async ({ store, user, body }) => {
  if (!(await verifyPassword(body.currentPassword || '', user.passwordHash))) fail(401, 'Your current password is not right.')
  await store.patchUser(user._id, {
    passwordHash: await hashPassword(checkPassword(body.newPassword)),
    mustChangePassword: false,
    sessionVersion: (user.sessionVersion || 0) + 1,
  })
  return { ok: true }
}

export const listUsers = async ({ store }) => ({ users: (await store.listUsers()).map(publicUser) })

export const createUser = async ({ store, body }) => {
  const email = cleanEmail(body.email)
  if (!ROLES.includes(body.role)) fail(400, 'Choose a valid role.')
  if (await store.getUserByEmail(email)) fail(400, 'Someone already has that email address.')
  const password = temporaryPassword()
  await store.createUser({
    _id: `admin.user.${crypto.randomUUID()}`,
    name: cleanName(body.name),
    email,
    role: body.role,
    active: true,
    passwordHash: await hashPassword(password),
    mustChangePassword: true,
    failedLogins: 0,
    sessionVersion: 0,
  })
  return { temporaryPassword: password }
}

const targetUser = async (store, id) => {
  const user = await store.getUser(String(id || ''))
  if (!user) fail(404, 'That person was not found.')
  return user
}

export const updateUser = async ({ store, body }) => {
  const target = await targetUser(store, body.id)
  const set = {}
  if (body.role !== undefined) {
    if (!ROLES.includes(body.role)) fail(400, 'Choose a valid role.')
    set.role = body.role
  }
  if (body.active !== undefined) set.active = !!body.active

  const losesOwner = target.role === 'owner' && target.active !== false &&
    ((set.role && set.role !== 'owner') || set.active === false)
  if (losesOwner) {
    const owners = (await store.listUsers()).filter((u) => u.role === 'owner' && u.active !== false)
    if (owners.length <= 1) fail(400, 'SWK needs at least one active Owner.')
  }
  if (set.active === false) set.sessionVersion = (target.sessionVersion || 0) + 1
  await store.patchUser(target._id, set)
  return { ok: true }
}

export const resetPassword = async ({ store, body }) => {
  const target = await targetUser(store, body.id)
  const password = temporaryPassword()
  await store.patchUser(target._id, {
    passwordHash: await hashPassword(password),
    mustChangePassword: true,
    failedLogins: 0,
    lockedUntil: null,
    sessionVersion: (target.sessionVersion || 0) + 1,
  })
  return { temporaryPassword: password }
}
