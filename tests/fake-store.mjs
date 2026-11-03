// In-memory stand-in for api/_lib/store.js, same interface, for the API tests.
export const fakeStore = () => {
  const users = new Map()
  const receipts = new Map()
  const docs = new Map()
  const visits = new Map()
  let signature = null
  let campaign = null
  const conflict = () => Object.assign(new Error('Document already exists'), { status: 409 })

  return {
    users, receipts, docs,
    raceOnce: 0, // make the next N createReceipt calls lose a numbering race

    countUsers: async () => users.size,
    getUser: async (id) => users.get(id) || null,
    getUserByEmail: async (email) => [...users.values()].find((u) => u.email === email) || null,
    listUsers: async () => [...users.values()],
    async createUser(doc) { if (users.has(doc._id)) throw conflict(); users.set(doc._id, { ...doc }) },
    async patchUser(id, set) { users.set(id, { ...users.get(id), ...set }) },

    listReceipts: async () => [...receipts.values()].sort((a, b) => (a.no < b.no ? 1 : -1)),
    getReceipt: async (no) => receipts.get(no) || null,
    receiptNumbers: async (year) => [...receipts.keys()].filter((no) => no.startsWith(`SWK-${year}-`)),
    async createReceipt(doc) {
      if (this.raceOnce > 0) {
        this.raceOnce -= 1
        receipts.set(doc.no, { ...doc, name: 'Someone else' })
        throw conflict()
      }
      if (receipts.has(doc.no)) throw conflict()
      receipts.set(doc.no, { ...doc })
    },
    async patchReceipt(no, set) { receipts.set(no, { ...receipts.get(no), ...set }) },

    getSignature: async () => signature,
    async setSignature(v) { signature = v },
    getCampaign: async () => campaign,
    async setCampaign(v) { campaign = v },

    pendingProducts: async () => [...docs.values()].filter((d) => d._type === 'marketplaceProduct' && !d.approved).length,
    contentAudit: async () => ({
      posts: [...docs.values()].filter((d) => d._type === 'post'),
      products: [...docs.values()].filter((d) => d._type === 'marketplaceProduct'),
    }),

    visits,
    async recordVisit(day, fields) {
      const record = visits.get(day) || { day, views: 0, visits: 0 }
      for (const field of fields) {
        const [group, key] = field.split('.')
        if (key) record[group] = { ...record[group], [key]: (record[group]?.[key] || 0) + 1 }
        else record[group] += 1
      }
      visits.set(day, record)
    },
    listVisits: async (from) => [...visits.values()].filter((r) => r.day >= from).sort((a, b) => (a.day < b.day ? -1 : 1)),

    async createDoc(doc) { const d = { _id: `doc${docs.size + 1}`, ...doc }; docs.set(d._id, d); return d },
    async patchDoc(id, set) { docs.set(id, { ...docs.get(id), ...set }) },
    async deleteDoc(id) { docs.delete(id) },
  }
}
