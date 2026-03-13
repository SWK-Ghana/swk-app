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

// ─── Brevo (newsletter subscriptions only) ───────────────────────────────────
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY
const BREVO_API = 'https://api.brevo.com/v3'

/**
 * Add a contact to Brevo newsletter list
 * @param {string} email
 */
export async function subscribeContact(email) {
  const res = await fetch(`${BREVO_API}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      email,
      listIds: [2],
      updateEnabled: true,
    }),
  })
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || 'Failed to subscribe')
  }
  return true
}