// The certificate itself: one A4 landscape page, printed to PDF from a hidden
// frame like receipts. Used by the staff screen and by the public page at
// /certificate/<id>, so the two can never drift apart.
import QRCode from 'qrcode'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export const ROLE_LABELS = {
  participant: 'Participant',
  volunteer: 'Volunteer',
  keynote: 'Keynote speaker',
  panellist: 'Panellist',
  workshop: 'Workshop lead',
  demonstration: 'Live demonstration',
  judge: 'Pitch judge',
  partner: 'Partner',
}

const TITLES = {
  participant: 'Certificate of Participation',
  partner: 'Certificate of Partnership',
}

// What the certificate says the person did. {event} is the event's name.
const DEEDS = {
  participant: 'participated in the {event}, From the Ground Up, a day built to inspire, equip and connect young people in agribusiness.',
  volunteer: 'served as a volunteer at the {event}, giving their time and skills so that the young people in the room could be inspired, equipped and connected.',
  keynote: 'delivered the keynote address at the {event}, setting the tone for a day that moved young people from inspiration to action.',
  panellist: 'served as a panellist at the {event}, sharing the lived experience of agribusiness in Ghana with the young people in the room.',
  workshop: 'led the Agribusiness Model Canvas workshop at the {event}, putting a practical tool in the hands of young agripreneurs.',
  demonstration: 'led a live demonstration at the {event}, showing young people agribusiness as it is really done.',
  judge: 'served as a judge of the Youth Pitch Showcase at the {event}, giving young agripreneurs a serious hearing and honest guidance.',
  partner: 'partnered with SWK Ghana to deliver the {event}, making a free Summit for young people in agribusiness possible.',
}

export const titleFor = (role) => TITLES[role] || 'Certificate of Appreciation'

export const fullDate = (iso) => {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00Z`)
  return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export const certificateFileName = (c) =>
  `SWK-certificate-${c.no || 'draft'}-${(c.name || 'name').replace(/[^A-Za-z0-9]+/g, '-')}`

export const verifyUrl = (c, origin = 'https://swkghana.org') => `${origin}/certificate/${c.id || `${c.no}-${c.key}`}`

/** A QR code for the verification link, as a data URI; null if it cannot be drawn. */
export const qrFor = (url) =>
  QRCode.toDataURL(url, { margin: 0, width: 360, errorCorrectionLevel: 'M', color: { dark: '#0C2E11', light: '#FFFFFF' } }).catch(() => null)

/**
 * @param c        certificate: no, id, name, role, detail, event, eventDate, venue, issued, status
 * @param options  signature: data URI or null; origin: site origin for assets; qr: data URI or null
 */
export const certificateHtml = (c, { signature = null, origin = '', qr = null } = {}) => {
  const event = c.event || 'SWK Ghana Agribusiness Summit 2026'
  const eventName = /^SWK Ghana/i.test(event) ? event : `SWK Ghana ${event}`
  const deed = (DEEDS[c.role] || DEEDS.participant).replace('{event}', eventName)
  const link = verifyUrl(c, 'https://swkghana.org').replace(/^https?:\/\//, '')
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(certificateFileName(c))}</title>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root { --deep: #0C2E11; --green: #17702D; --lime: #78C31E; --cream: #F7FAF2; --ink: #1C2A1E; --soft: #5B665C; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { background: #fff; }
  body { font-family: 'Ubuntu', system-ui, sans-serif; color: var(--ink); }
  .cert { position: relative; width: 297mm; height: 210mm; display: grid; grid-template-columns: 16mm 1fr; overflow: hidden; contain: strict; background: #fff; }
  .band { background: var(--lime) url("${esc(origin)}/patterns/weave.svg") center / 32mm auto repeat; }
  .page { position: relative; display: flex; flex-direction: column; padding: 14mm 18mm 11mm 16mm; border-right: 3mm solid var(--deep); }
  .head { display: flex; justify-content: space-between; align-items: flex-start; }
  .head img { width: 46mm; height: auto; display: block; }
  .kicker { text-align: right; font-size: 9.5pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--green); line-height: 1.5; max-width: 110mm; }
  .kicker span { display: block; color: var(--soft); letter-spacing: .08em; font-weight: 500; text-transform: none; font-size: 9pt; }
  .main { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; padding: 4mm 0 2mm; }
  .title { font-size: 30pt; font-weight: 700; color: var(--deep); letter-spacing: -.3pt; line-height: 1.05; }
  .title small { display: block; font-size: 10.5pt; font-weight: 500; color: var(--soft); letter-spacing: .02em; margin-top: 3mm; }
  .name { margin-top: 5mm; font-size: 34pt; font-weight: 700; color: var(--green); line-height: 1.1; overflow-wrap: anywhere; padding-bottom: 2.5mm; border-bottom: 1.2pt solid var(--lime); display: inline-block; max-width: 100%; }
  .name.long { font-size: 26pt; }
  .detail { margin-top: 2.5mm; font-size: 12pt; font-weight: 500; color: var(--deep); }
  .deed { margin-top: 5mm; font-size: 12.5pt; line-height: 1.55; color: var(--ink); max-width: 200mm; }
  .when { margin-top: 4mm; font-size: 10.5pt; color: var(--soft); }
  .when b { color: var(--deep); font-weight: 700; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 10mm; }
  .who { font-size: 9.5pt; min-width: 60mm; }
  .who img { display: block; width: 44mm; height: auto; margin: 0 0 1mm -1mm; }
  .who .line { width: 60mm; border-top: 1pt solid var(--deep); margin-bottom: 1.5mm; }
  .who b { display: block; font-size: 11pt; color: var(--deep); }
  .who span { color: var(--soft); }
  .verify { display: flex; align-items: center; gap: 4mm; text-align: right; font-size: 8pt; color: var(--soft); line-height: 1.5; }
  .verify img { width: 22mm; height: 22mm; display: block; }
  .verify b { display: block; font-size: 10pt; color: var(--deep); letter-spacing: .04em; }
  .legal { margin-top: 5mm; padding-top: 2.5mm; border-top: 1px solid #DCE2D6; font-size: 7.2pt; line-height: 1.5; color: var(--soft); }
  .legal b { color: var(--deep); }
  .void { position: absolute; inset: 0; display: grid; place-items: center; font-size: 60pt; font-weight: 700; letter-spacing: .1em; color: rgba(185, 28, 28, .25); transform: rotate(-18deg); pointer-events: none; }
  @page { size: 297mm 210mm; margin: 0; }
</style></head>
<body>
<article class="cert">
  <div class="band"></div>
  <div class="page">
    <header class="head">
      <img src="${esc(origin)}/brand/swk-logo.svg" alt="SWK Ghana">
      <div class="kicker">${esc(eventName)}<span>From the Ground Up</span></div>
    </header>
    <section class="main">
      <h1 class="title">${esc(titleFor(c.role))}<small>This certificate is proudly presented to</small></h1>
      <div class="name${(c.name || '').length > 28 ? ' long' : ''}">${esc(c.name || 'Name of recipient')}</div>
      ${c.detail ? `<div class="detail">${esc(c.detail)}</div>` : ''}
      <p class="deed">who ${esc(deed)}</p>
      <p class="when"><b>${esc(fullDate(c.eventDate))}</b> · ${esc(c.venue || '')}</p>
    </section>
    <footer class="foot">
      <div class="who">
        ${signature ? `<img src="${esc(signature)}" alt="Signature of Frank Koomson">` : '<div class="line"></div>'}
        <b>Frank Koomson</b><span>Founder, SWK Ghana</span>
      </div>
      <div class="verify">
        ${c.no
          ? `<div><b>${esc(c.no)}</b>Verify this certificate at<br>${esc(link)}</div>`
          : '<div><b>SWK-AS26-····</b>The number and verification link<br>appear once the certificate is issued</div>'}
        ${qr ? `<img src="${esc(qr)}" alt="QR code linking to the verification page">` : ''}
      </div>
    </footer>
    <p class="legal"><b>SWK Ghana LBG</b> · Registered non-profit company limited by guarantee · Reg. No. CG024110426 · NPO Licence No. NPOS/GR01/LN04158/26 · info@swkghana.org · swkghana.org</p>
    ${c.status === 'revoked' ? '<div class="void">REVOKED</div>' : ''}
  </div>
</article>
</body></html>`
}
