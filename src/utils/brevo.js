// ─── Formspree (contact/volunteer/partner forms) ────────────────────────────
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzwqozw'

/**
 * Submit a form to Formspree
 * @param {object} data - Key/value pairs to send
 */
export async function sendEmail(data) {
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to send message')
  }
  return true
}

// ─── Newsletter (via /api/subscribe, so the Brevo key stays on the server) ───

/**
 * Add an email address to the newsletter list
 * @param {string} email
 */
export async function subscribeContact(email) {
  const res = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to subscribe')
  }
  return true
}