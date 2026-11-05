// Shared pieces of the Summit check-in: the form's choices, searching and
// the offline queue used by the door page.

export const GENDERS = ['Female', 'Male', 'Prefer not to say']
export const STATUSES = ['Student', 'Unemployed', 'Employed', 'Self-employed', 'Running a business']
export const INTERESTS = ['Crop production', 'Livestock / poultry', 'Agro-processing & value addition', 'Agri-tech & innovation', 'Agribusiness finance / investment', 'Marketing / sales / export', 'Other']
export const EDUCATION = ['Junior High School', 'Senior High School', 'Technical / Vocational', 'Diploma / HND', "Bachelor's degree", 'Postgraduate', 'Other']
export const HEARD = ['Social media', 'Friend / referral', 'SWK newsletter', 'Radio / TV', 'At the entrance', 'Other']

export const EMPTY_WALK_IN = {
  name: '', phone: '', email: '', gender: '', age: '', location: '', status: '', interest: '', heard: 'At the entrance',
  needs: '', consentPhotos: 'Yes', consentContact: 'Yes',
}

const plain = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Matches on any part of the name, the last digits of the phone, or the town. */
export const matches = (person, term) => {
  const t = plain(term).trim()
  if (!t) return true
  const digits = t.replace(/\D/g, '')
  if (digits.length >= 3 && digits === t.replace(/\s/g, '')) {
    const phone = person.phoneEnd || person.phone || ''
    return phone.endsWith(digits) || phone.includes(digits)
  }
  const words = t.split(/\s+/)
  const hay = `${plain(person.name)} ${plain(person.location)}`
  return words.every((w) => hay.includes(w))
}

export const timeOf = (iso) =>
  iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''

export const nameSort = (a, b) => a.name.localeCompare(b.name)

export const toCsv = (rows) =>
  rows.map((row) => row.map((v) => {
    const s = String(v ?? '')
    // A leading ' stops a spreadsheet running a cell such as =SUM(...) as a formula.
    return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`
  }).join(',')).join('\r\n')

export const downloadFile = (name, text, type = 'text/csv') => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['﻿', text], { type }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

// ─── The door page's memory, so it keeps working when the venue's internet drops ───

const KEYS = { token: 'swk-door-token', list: 'swk-door-list', queue: 'swk-door-queue' }

export const doorStore = {
  read(key, fallback = null) {
    try { const raw = localStorage.getItem(KEYS[key]); return raw === null ? fallback : JSON.parse(raw) } catch { return fallback }
  },
  write(key, value) {
    try { localStorage.setItem(KEYS[key], JSON.stringify(value)) } catch { /* storage unavailable */ }
  },
  remove(key) {
    try { localStorage.removeItem(KEYS[key]) } catch { /* storage unavailable */ }
  },
}

/** The server's list with the not-yet-saved door actions laid on top. */
export const applyQueue = (attendees, queue, doorName = 'Door team') => {
  const byId = new Map(attendees.map((a) => [a.id, { ...a }]))
  for (const op of queue) {
    if (op.kind === 'checkin' && byId.has(op.id)) byId.set(op.id, { ...byId.get(op.id), checkedInAt: op.at, checkedInBy: doorName, pending: true })
    if (op.kind === 'undo' && byId.has(op.id)) byId.set(op.id, { ...byId.get(op.id), checkedInAt: null, checkedInBy: '', pending: true })
    if (op.kind === 'walkin') {
      byId.set(op.tempId, {
        id: op.tempId, name: op.attendee.name, phoneEnd: op.attendee.phone.replace(/\D/g, '').slice(-4), location: op.attendee.location,
        needs: op.attendee.needs, source: 'walk-in', checkedInAt: op.at, checkedInBy: doorName, pending: true,
      })
    }
  }
  return [...byId.values()].sort(nameSort)
}
