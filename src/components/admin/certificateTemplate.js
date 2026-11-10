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

// The seal: the Summit's name set around a ring, the date at its heart.
const seal = (year) => `
<svg class="seal" viewBox="0 0 120 120" aria-hidden="true">
  <defs><path id="ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs>
  <circle cx="60" cy="60" r="58" fill="#78C31E"/>
  <circle cx="60" cy="60" r="52" fill="none" stroke="#0C2E11" stroke-width="1.2"/>
  <circle cx="60" cy="60" r="34" fill="#0C2E11"/>
  <text font-family="Ubuntu, sans-serif" font-size="9.4" font-weight="700" letter-spacing="1.5" fill="#0C2E11"><textPath href="#ring" startOffset="1%">SWK GHANA · AGRIBUSINESS SUMMIT ·</textPath></text>
  <text x="60" y="56" text-anchor="middle" font-family="Ubuntu, sans-serif" font-size="9" font-weight="500" letter-spacing="1" fill="#A8E04A">ACCRA</text>
  <text x="60" y="74" text-anchor="middle" font-family="Ubuntu, sans-serif" font-size="17" font-weight="700" fill="#FFFFFF">${esc(year)}</text>
</svg>`

/**
 * @param c        certificate: no, id, name, role, detail, event, eventDate, venue, issued, status
 * @param options  signature: data URI or null; origin: site origin for assets; qr: data URI or null
 */
export const certificateHtml = (c, { signature = null, origin = '', qr = null } = {}) => {
  const event = c.event || 'SWK Ghana Agribusiness Summit 2026'
  const eventName = /^SWK Ghana/i.test(event) ? event : `SWK Ghana ${event}`
  const deed = (DEEDS[c.role] || DEEDS.participant).replace('{event}', eventName)
  const link = verifyUrl(c, 'https://swkghana.org').replace(/^https?:\/\//, '')
  const year = (c.eventDate || '2026').slice(0, 4)
  const name = c.name || 'Name of recipient'
  const nameClass = name.length > 34 ? ' name--xs' : name.length > 24 ? ' name--s' : ''
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(certificateFileName(c))}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root { --deep: #0C2E11; --green: #17702D; --lime: #78C31E; --cream: #F7FAF2; --ink: #1C2A1E; --soft: #5B665C; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { background: #fff; }
  body { font-family: 'Ubuntu', system-ui, sans-serif; color: var(--ink); }
  .cert { position: relative; width: 297mm; height: 210mm; overflow: hidden; contain: strict; background: #fff; padding: 7mm; }
  /* Weave, SWK's print pattern, as the outer mat; a fine double rule frames the sheet. */
  .mat { position: absolute; inset: 0; background: var(--deep) url("${esc(origin)}/patterns/weave.svg") center / 44mm auto repeat; opacity: .96; }
  .mat::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(12,46,17,.35), rgba(12,46,17,.65)); }
  .sheet { position: relative; height: 100%; background: #fff; border: 1.4pt solid var(--lime); outline: 0.6pt solid var(--deep); outline-offset: -3.2mm; padding: 11mm 16mm 9mm; display: flex; flex-direction: column; text-align: center; }
  .logo { width: 40mm; height: auto; margin: 0 auto; display: block; }
  .kicker { margin-top: 4mm; font-size: 9pt; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; color: var(--green); }
  .kicker span { color: var(--soft); font-weight: 500; letter-spacing: .14em; }
  .main { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; }
  .title { font-family: 'Playfair Display', Georgia, serif; font-size: 38pt; font-weight: 700; color: var(--deep); letter-spacing: -.2pt; line-height: 1.05; }
  .rule { width: 36mm; height: 1pt; background: var(--lime); margin: 4mm auto 0; position: relative; }
  .rule::before, .rule::after { content: ""; position: absolute; top: -1.1mm; width: 2.4mm; height: 2.4mm; background: var(--lime); transform: rotate(45deg); }
  .rule::before { left: -3.5mm; } .rule::after { right: -3.5mm; }
  .presented { margin-top: 5mm; font-size: 10.5pt; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--soft); }
  .name { margin-top: 3mm; font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 44pt; font-weight: 600; color: var(--green); line-height: 1.1; overflow-wrap: anywhere; }
  .name--s { font-size: 36pt; } .name--xs { font-size: 28pt; }
  .detail { margin-top: 1.5mm; font-size: 12pt; font-weight: 500; color: var(--deep); letter-spacing: .02em; }
  .deed { margin: 5mm auto 0; max-width: 196mm; font-size: 12.5pt; line-height: 1.6; color: var(--ink); }
  .when { margin-top: 4mm; font-size: 10.5pt; color: var(--soft); }
  .when b { color: var(--deep); font-weight: 700; }
  .foot { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 8mm; text-align: left; }
  .who { font-size: 9.5pt; }
  .who img { display: block; width: 46mm; height: auto; margin: 0 0 1mm -1mm; }
  .who .line { width: 60mm; height: 12mm; }
  .who .bar { width: 60mm; border-top: 1pt solid var(--deep); margin-bottom: 1.5mm; }
  .who b { display: block; font-size: 11pt; color: var(--deep); }
  .who span { color: var(--soft); }
  .seal { width: 30mm; height: 30mm; display: block; margin-bottom: 2mm; }
  .verify { justify-self: end; display: flex; align-items: center; gap: 3.5mm; text-align: right; font-size: 7.8pt; color: var(--soft); line-height: 1.5; }
  .verify img { width: 20mm; height: 20mm; display: block; }
  .verify b { display: block; font-size: 10pt; color: var(--deep); letter-spacing: .05em; }
  .legal { margin-top: 4mm; font-size: 7pt; line-height: 1.5; color: var(--soft); }
  .legal b { color: var(--deep); }
  .void { position: absolute; inset: 0; display: grid; place-items: center; font-size: 60pt; font-weight: 700; letter-spacing: .1em; color: rgba(185, 28, 28, .25); transform: rotate(-18deg); pointer-events: none; }
  @page { size: 297mm 210mm; margin: 0; }
</style></head>
<body>
<article class="cert">
  <div class="mat"></div>
  <div class="sheet">
    <header>
      <img class="logo" src="${esc(origin)}/brand/swk-logo.svg" alt="SWK Ghana">
      <p class="kicker">${esc(eventName)} <span>· From the Ground Up</span></p>
    </header>
    <section class="main">
      <h1 class="title">${esc(titleFor(c.role))}</h1>
      <div class="rule"></div>
      <p class="presented">This certificate is proudly presented to</p>
      <div class="name${nameClass}">${esc(name)}</div>
      ${c.detail ? `<div class="detail">${esc(c.detail)}</div>` : ''}
      <p class="deed">${c.role === 'partner' ? 'which' : 'who'} ${esc(deed)}</p>
      <p class="when"><b>${esc(fullDate(c.eventDate))}</b> · ${esc(c.venue || '')}</p>
    </section>
    <footer class="foot">
      <div class="who">
        ${signature ? `<img src="${esc(signature)}" alt="Signature of Frank Koomson">` : '<div class="line"></div>'}
        <div class="bar"></div>
        <b>Frank Koomson</b><span>Founder, SWK Ghana</span>
      </div>
      ${seal(year)}
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
