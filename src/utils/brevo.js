const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY
const BREVO_API = 'https://api.brevo.com/v3'

/**
 * Send a transactional email via Brevo
 * @param {object} opts
 * @param {string} opts.subject - Email subject
 * @param {string} opts.htmlContent - HTML body
 * @param {string} opts.replyToEmail - Reply-to address (the person who submitted)
 * @param {string} opts.replyToName - Reply-to name
 */
export async function sendEmail({ subject, htmlContent, replyToEmail, replyToName }) {
    const res = await fetch(`${BREVO_API}/smtp/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: { name: 'SWK Ghana Website', email: 'sustainabilitywithkoomson@gmail.com' },
            to: [{ email: 'sustainabilitywithkoomson@gmail.com', name: 'SWK Ghana' }],
            replyTo: { email: replyToEmail, name: replyToName },
            subject,
            htmlContent,
        }),
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.message || 'Failed to send email')
    }
    return true
}

/**
 * Add a contact to Brevo (newsletter subscription)
 * @param {string} email
 * @param {string} [firstName]
 */
export async function subscribeContact(email, firstName = '') {
    const res = await fetch(`${BREVO_API}/contacts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
            email,
            attributes: firstName ? { FIRSTNAME: firstName } : {},
            listIds: [2], // Default list — update if you create a specific list in Brevo
            updateEnabled: true,
        }),
    })
    // 204 = already exists (updated), 201 = created — both are success
    if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message || 'Failed to subscribe')
    }
    return true
}

/** Format a simple HTML email table from key-value pairs */
export function formatEmailHtml(title, rows) {
    const rowsHtml = rows
        .map(
            ([key, value]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#374151;background:#f9fafb;border:1px solid #e5e7eb;width:140px">${key}</td>
        <td style="padding:8px 12px;color:#111827;border:1px solid #e5e7eb">${value || '—'}</td>
      </tr>`
        )
        .join('')

    return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1B4332;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0;font-size:18px">SWK Ghana — ${title}</h2>
        <p style="color:#a7f3d0;margin:4px 0 0;font-size:13px">Submitted via swkghana.org</p>
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none">
        ${rowsHtml}
      </table>
      <p style="font-size:12px;color:#9ca3af;padding:12px;text-align:center">
        Reply directly to this email to respond to the sender.
      </p>
    </div>`
}