// Every Sanity query the admin API makes. Documents with a dot in their _id are
// private: anonymous readers of this public dataset cannot see them, so staff,
// receipts and the signature all live under such ids.
const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'qaen86pl'
const DATASET = process.env.SANITY_DATASET || 'production'
const BASE = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data`

const receiptId = (no) => `receipts.${no}`
const SIGNATURE_ID = 'receipts.signature'
const CAMPAIGN_ID = 'admin.campaign'
const USER_FIELDS = '_id, name, email, role, active, passwordHash, mustChangePassword, failedLogins, lockedUntil, sessionVersion'

export const sanityStore = (token) => {
  const request = async (path, body) => {
    const res = await fetch(`${BASE}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data?.error?.description || data?.message || `Sanity error (${res.status})`)
      err.status = res.status
      throw err
    }
    return data
  }
  const query = async (q, params = {}) => (await request(`query/${DATASET}`, { query: q, params })).result
  const mutate = (mutations) => request(`mutate/${DATASET}?returnIds=true&returnDocuments=true`, { mutations })

  return {
    countUsers: () => query('count(*[_type == "adminUser"])'),
    getUser: (id) => query(`*[_type == "adminUser" && _id == $id][0]{${USER_FIELDS}}`, { id }),
    getUserByEmail: (email) => query(`*[_type == "adminUser" && email == $email][0]{${USER_FIELDS}}`, { email }),
    listUsers: () => query(`*[_type == "adminUser"] | order(name asc){${USER_FIELDS}}`),
    createUser: (doc) => mutate([{ create: { _type: 'adminUser', ...doc } }]),
    patchUser: (id, set) => mutate([{ patch: { id, set } }]),

    listReceipts: () => query('*[_type == "donationReceipt"] | order(no desc)'),
    getReceipt: (no) => query('*[_id == $id][0]', { id: receiptId(no) }),
    receiptNumbers: (year) =>
      query('*[_type == "donationReceipt" && string::startsWith(no, $prefix)].no', { prefix: `SWK-${year}-` }),
    createReceipt: (doc) => mutate([{ create: { _id: receiptId(doc.no), _type: 'donationReceipt', ...doc } }]),
    patchReceipt: (no, set) => mutate([{ patch: { id: receiptId(no), set } }]),

    getSignature: () => query('*[_id == $id][0].dataUri', { id: SIGNATURE_ID }),
    setSignature: (dataUri) => mutate([{ createOrReplace: { _id: SIGNATURE_ID, _type: 'receiptSignature', dataUri } }]),
    getCampaign: () => query('*[_id == $id][0]{name, purpose, target, seatPrice, seats, deadline}', { id: CAMPAIGN_ID }),
    setCampaign: (data) => mutate([{ createOrReplace: { _id: CAMPAIGN_ID, _type: 'adminCampaign', ...data } }]),

    pendingProducts: () => query('count(*[_type == "marketplaceProduct" && approved != true])'),

    createDoc: async (doc) => (await mutate([{ create: doc }])).results?.[0]?.document || null,
    patchDoc: (id, set) => mutate([{ patch: { id, set } }]),
    deleteDoc: (id) => mutate([{ delete: { id } }]),
  }
}
