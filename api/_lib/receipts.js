// Donation receipts, the fundraising campaign and the dashboard totals.
import { fail } from './errors.js'

const NUMBER = /^SWK-\d{4}-\d{4}$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const NUMBER_RETRIES = 5
const MAX_SIGNATURE = 300 * 1024
const DAY_MS = 24 * 60 * 60 * 1000

export const DEFAULT_CAMPAIGN = {
  name: 'Agribusiness Summit 2026',
  purpose: 'Agribusiness Summit 2026 · Sponsor a Seat',
  target: 26000,
  seatPrice: 260,
  seats: 100,
  deadline: '2026-11-06',
}

const text = (value, max) => String(value ?? '').trim().slice(0, max + 1)
const today = () => new Date().toISOString().slice(0, 10)

// Only these fields ever reach a receipt, so status and authorship can't be forged.
const cleanReceipt = (input = {}) => {
  const name = text(input.name, 120)
  if (!name || name.length > 120) fail(400, "Enter the donor's name, up to 120 characters.")
  const amount = Math.round(Number(input.amount) * 100) / 100
  if (!Number.isFinite(amount) || amount <= 0 || amount >= 1000000) fail(400, 'Enter an amount above 0 and below 1,000,000.')
  const date = text(input.date, 10)
  if (date && !ISO_DATE.test(date)) fail(400, 'Enter a valid payment date.')
  const purpose = text(input.purpose, 120)
  if (!purpose || purpose.length > 120) fail(400, 'Choose what the donation is for.')
  return {
    name, amount, date, purpose,
    method: text(input.method, 40) || 'Not stated',
    txn: text(input.txn, 60),
    note: text(input.note, 160),
  }
}

const padded = (year, n) => `SWK-${year}-${String(n).padStart(4, '0')}`
const stamp = (user) => ({ name: user.name, at: new Date().toISOString() })

export const issueReceipt = async ({ store, user, body }) => {
  const clean = cleanReceipt(body.receipt)
  const year = new Date().getFullYear()
  const by = stamp(user)
  // The highest number wins; `create` fails if someone else took it first.
  for (let attempt = 0; attempt < NUMBER_RETRIES; attempt++) {
    const used = await store.receiptNumbers(year)
    const next = Math.max(0, ...used.map((no) => parseInt(no.split('-')[2], 10) || 0)) + 1
    const receipt = { ...clean, no: padded(year, next), issued: today(), status: 'issued', issuedBy: by.name, issuedAt: by.at }
    try {
      await store.createReceipt(receipt)
      return { receipt }
    } catch (err) {
      if (err.status !== 409) throw err
    }
  }
  fail(503, 'Could not get a receipt number. Please try again.')
}

// An earlier receipt, entered with the number it already carries.
export const recordReceipt = async ({ store, user, body }) => {
  const no = String(body.no || '').trim()
  if (!NUMBER.test(no)) fail(400, 'Receipt numbers look like SWK-2026-0002.')
  const issued = text(body.issued, 10)
  if (!ISO_DATE.test(issued)) fail(400, 'Enter the date the receipt was issued.')
  const by = stamp(user)
  const receipt = { ...cleanReceipt(body.receipt), no, issued, status: 'issued', issuedBy: by.name, issuedAt: by.at }
  try {
    await store.createReceipt(receipt)
  } catch (err) {
    if (err.status === 409) fail(409, `Receipt ${no} already exists.`)
    throw err
  }
  return { receipt }
}

const existing = async (store, no) => {
  const receipt = await store.getReceipt(String(no || ''))
  if (!receipt) fail(404, 'That receipt was not found.')
  return receipt
}

export const updateReceipt = async ({ store, user, body }) => {
  const current = await existing(store, body.no)
  if (current.status === 'cancelled') fail(400, 'A cancelled receipt cannot be changed.')
  const by = stamp(user)
  const set = { ...cleanReceipt(body.receipt), updatedBy: by.name, updatedAt: by.at }
  await store.patchReceipt(current.no, set)
  return { receipt: { ...current, ...set } }
}

export const cancelReceipt = async ({ store, user, body }) => {
  const current = await existing(store, body.no)
  const reason = text(body.reason, 160)
  if (!reason) fail(400, 'Say why this receipt is being cancelled.')
  const by = stamp(user)
  await store.patchReceipt(current.no, { status: 'cancelled', cancelledBy: by.name, cancelledAt: by.at, cancelReason: reason })
  return { ok: true }
}

export const listReceipts = async ({ store }) => ({ receipts: await store.listReceipts() })

export const getSignature = async ({ store }) => ({ dataUri: (await store.getSignature()) || null })

export const setSignature = async ({ store, body }) => {
  const dataUri = String(body.dataUri || '')
  if (!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(dataUri)) fail(400, 'Upload a PNG or JPEG image.')
  if (dataUri.length > MAX_SIGNATURE) fail(400, 'That image is too large. Use one under 200 KB.')
  await store.setSignature(dataUri)
  return { ok: true }
}

export const setCampaign = async ({ store, body }) => {
  const c = body.campaign || {}
  const campaign = {
    name: text(c.name, 120),
    purpose: text(c.purpose, 120),
    target: Number(c.target),
    seatPrice: Number(c.seatPrice),
    seats: Number(c.seats),
    deadline: text(c.deadline, 10),
  }
  const positive = [campaign.target, campaign.seatPrice, campaign.seats].every((n) => Number.isFinite(n) && n > 0)
  if (!campaign.name || !campaign.purpose || !positive || !ISO_DATE.test(campaign.deadline)) fail(400, 'Check the campaign details.')
  await store.setCampaign(campaign)
  return { ok: true }
}

// Totals only: every signed-in role sees this, so no donor details belong here.
export const overview = async ({ store, user }) => {
  const campaign = (await store.getCampaign()) || DEFAULT_CAMPAIGN
  const issued = (await store.listReceipts()).filter((r) => r.status !== 'cancelled')
  const counted = issued.filter((r) => r.purpose === campaign.purpose)
  const raised = Math.round(counted.reduce((sum, r) => sum + r.amount, 0) * 100) / 100
  const end = new Date(`${campaign.deadline}T23:59:59Z`).getTime()
  return {
    campaign: {
      ...campaign,
      raised,
      seatsFunded: Math.floor(raised / campaign.seatPrice),
      donations: counted.length,
      daysLeft: Math.max(0, Math.ceil((end - Date.now()) / DAY_MS)),
    },
    receiptsIssued: issued.length,
    pendingProducts: await store.pendingProducts(),
    role: user.role,
  }
}
