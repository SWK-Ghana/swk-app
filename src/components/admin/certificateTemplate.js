// The certificate itself: one A4 landscape page, printed to PDF from a hidden
// frame like receipts. Used by the staff screen and by the public page at
// /certificate/<id>, so the two can never drift apart.
//
// It is dressed as the Summit was: a band of kente (the Summit's own pattern
// and palette), Figtree (the Summit page's typeface), the partners' logos and
// the theme, From the Ground Up.
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

// The second line of the title; the first is always "Certificate".
const KINDS = {
  participant: 'of Participation',
  volunteer: 'of Volunteer Service',
  partner: 'of Partnership',
}
const kindFor = (role) => KINDS[role] || 'of Appreciation'

// What the certificate recognises. {event} is the event's name.
const DEEDS = {
  participant: 'in recognition of active participation in the {event}, themed From the Ground Up: a day built to inspire, equip and connect young people in agribusiness.',
  volunteer: 'in appreciation of dedicated volunteer service at the {event}, giving time and skill so that every young person in the room could be inspired, equipped and connected.',
  keynote: 'in appreciation of delivering the keynote address at the {event}, setting the tone for a day that moved young people from inspiration to action.',
  panellist: 'in appreciation of serving as a panellist at the {event}, sharing the lived experience of agribusiness in Ghana with the young people in the room.',
  workshop: 'in appreciation of leading the Agribusiness Model Canvas workshop at the {event}, putting a practical tool in the hands of young agripreneurs.',
  demonstration: 'in appreciation of leading a live demonstration at the {event}, showing young people agribusiness as it is really done.',
  judge: 'in appreciation of serving as a judge of the Youth Pitch Showcase at the {event}, giving young agripreneurs a serious hearing and honest guidance.',
  partner: 'in appreciation of partnering with SWK Ghana to deliver the {event}, making a free Summit for young people in agribusiness possible.',
}

// The Summit's partners, as they appear on the Summit page (crops of the flyer).
const FLYER = 'https://res.cloudinary.com/dwgj3lovn/image/upload'
const PARTNERS = [
  ['The GracedLife Leadership Centre', 'c_crop,x_1018,y_121,w_168,h_168', 1],
  ['Agribusiness e-Academy', 'c_crop,x_1246,y_133,w_245,h_146', 245 / 146],
  ['Calidad Farms Ltd', 'c_crop,x_1538,y_150,w_305,h_106', 305 / 106],
  ['The Food Discourse', 'c_crop,x_1888,y_122,w_160,h_160', 1],
].map(([name, crop, ratio]) => ({ name, ratio, src: `${FLYER}/${crop}/f_auto,q_auto/v1790846227/SummitFlyer-selection_5_zshe0n.png` }))

export const titleFor = (role) => `Certificate ${kindFor(role)}`

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

// ── Kente ────────────────────────────────────────────────────────────────────
// Strip-woven cloth: four strips, each alternating a block of warp stripes
// with a block of weft motif, neighbouring strips offset so the blocks
// chequer. Drawn here in the Summit's palette; 4 units to the millimetre.
const INK = '#111A12'
const GOLD = '#E9A23B'
const LIME = '#78C31E'
const DEEP = '#123D16'
const RED = '#C8102E'
const STRIP = 58
const BLOCK = 70
const STRIPS = 4
const ROWS = 12

const kenteBand = () => {
  const stripes = [[3, 4, GOLD], [9, 3, LIME], [15, 6, RED], [24, 3, GOLD], [28.5, 1, LIME], [30.5, 3, GOLD], [36.5, 6, RED], [45.5, 3, LIME], [51, 4, GOLD]]
    .map(([x, w, fill]) => `<rect x="${x}" width="${w}" height="${BLOCK}" fill="${fill}"/>`).join('')
  const warp = `<g id="k-warp"><rect width="${STRIP}" height="${BLOCK}" fill="${DEEP}"/>${stripes}</g>`
  const zig = `<g id="k-zig"><rect width="${STRIP}" height="${BLOCK}" fill="${GOLD}"/>
    <rect y="5" width="${STRIP}" height="6" fill="${INK}"/><rect y="14" width="${STRIP}" height="3" fill="${RED}"/>
    <polyline points="0,44 9.7,26 19.3,44 29,26 38.7,44 48.3,26 58,44" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="miter"/>
    <rect y="53" width="${STRIP}" height="3" fill="${RED}"/><rect y="59" width="${STRIP}" height="6" fill="${INK}"/></g>`
  const diamond = `<g id="k-dia"><rect width="${STRIP}" height="${BLOCK}" fill="${INK}"/>
    <path d="M29 5 L54 35 L29 65 L4 35Z" fill="${LIME}"/><path d="M29 15 L46 35 L29 55 L12 35Z" fill="${INK}"/>
    <path d="M29 23 L39 35 L29 47 L19 35Z" fill="${GOLD}"/><path d="M29 30 L33 35 L29 40 L25 35Z" fill="${RED}"/>
    <path d="M0 0 H12 L0 14Z M58 0 V14 L46 0Z M0 70 V56 L12 70Z M58 70 H46 L58 56Z" fill="${GOLD}"/></g>`
  let cloth = ''
  for (let i = 0; i < STRIPS; i++) {
    for (let j = 0; j < ROWS; j++) {
      const id = (i + j) % 2 === 0 ? 'k-warp' : (i + (j >> 1)) % 2 === 0 ? 'k-zig' : 'k-dia'
      cloth += `<use href="#${id}" x="${i * STRIP}" y="${j * BLOCK}"/>`
    }
  }
  const seams = Array.from({ length: STRIPS - 1 }, (_, i) => `<rect x="${(i + 1) * STRIP - 0.6}" width="1.2" height="${ROWS * BLOCK}" fill="${INK}"/>`).join('')
  return `<svg class="kente" viewBox="0 0 ${STRIPS * STRIP} ${ROWS * BLOCK}" preserveAspectRatio="none" aria-hidden="true"><defs>${warp}${zig}${diamond}</defs>${cloth}${seams}</svg>`
}

// The seal: the Summit's name set around a ring, the year at its heart.
const seal = (year) => `
<svg class="seal" viewBox="0 0 120 120" aria-hidden="true">
  <defs><path id="ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs>
  <circle cx="60" cy="60" r="59" fill="#FFFFFF"/>
  <circle cx="60" cy="60" r="55" fill="${LIME}"/>
  <circle cx="60" cy="60" r="50.5" fill="none" stroke="#0C2E11" stroke-width="1"/>
  <circle cx="60" cy="60" r="34" fill="#0C2E11"/>
  <circle cx="60" cy="60" r="30" fill="none" stroke="${GOLD}" stroke-width="1"/>
  <text font-family="Figtree, sans-serif" font-size="9.4" font-weight="800" letter-spacing="1.5" fill="#0C2E11"><textPath href="#ring" startOffset="1%">SWK GHANA · AGRIBUSINESS SUMMIT ·</textPath></text>
  <text x="60" y="55" text-anchor="middle" font-family="Figtree, sans-serif" font-size="8" font-weight="700" letter-spacing="1.2" fill="${GOLD}">ACCRA</text>
  <text x="60" y="73" text-anchor="middle" font-family="Figtree, sans-serif" font-size="17" font-weight="800" fill="#FFFFFF">${esc(year)}</text>
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
<link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400..900;1,400..600&family=Great+Vibes&display=swap" rel="stylesheet">
<style>
  :root { --deep: #0C2E11; --green: #17702D; --lime: #78C31E; --gold: #E9A23B; --ink: #1C2A1E; --soft: #5B665C; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { background: #fff; }
  body { font-family: 'Figtree', system-ui, sans-serif; color: var(--ink); }
  .cert { position: relative; width: 297mm; height: 210mm; display: grid; grid-template-columns: 58mm 1fr; overflow: hidden; contain: strict; background: #fff; }

  /* The kente band, edged in gold and lime. */
  .band { position: relative; background: ${INK}; border-right: 1mm solid var(--deep); box-shadow: 1.2mm 0 0 var(--lime); }
  .kente { display: block; width: 100%; height: 100%; }
  .seal { position: absolute; z-index: 2; left: 58mm; top: 50mm; width: 31mm; height: 31mm; transform: translateX(-50%); }

  .page { position: relative; display: flex; flex-direction: column; padding: 11mm 14mm 7mm 22mm; min-width: 0; }
  .top { display: flex; justify-content: space-between; align-items: center; gap: 8mm; }
  .logo { width: 37mm; height: auto; display: block; }
  .partners { text-align: right; }
  .partners p { font-size: 6.6pt; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--soft); margin-bottom: 1.2mm; }
  .partners div { display: flex; align-items: center; justify-content: flex-end; gap: 4mm; }
  /* The crops carry the flyer's off-white ground; lifting it to white hides the box. */
  .partners img { height: 13mm; width: auto; display: block; filter: brightness(1.05); }

  .main { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; padding: 2mm 0; }
  .eyebrow { display: flex; align-items: center; gap: 2.5mm; font-size: 8.6pt; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--green); }
  .eyebrow::before { content: ""; width: 11mm; height: .8mm; border-radius: 1mm; background: var(--lime); }
  .eyebrow span { color: var(--soft); font-weight: 600; letter-spacing: .16em; }
  .title { margin-top: 2.5mm; font-size: 55pt; font-weight: 900; line-height: .95; letter-spacing: .015em; text-transform: uppercase; color: var(--green); }
  .kind { margin-top: 2mm; font-size: 19pt; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--deep); }
  .presented { margin-top: 6.5mm; font-size: 9.5pt; font-weight: 500; font-style: italic; letter-spacing: .14em; text-transform: uppercase; color: var(--soft); }
  .name { margin-top: .5mm; font-family: 'Great Vibes', 'Figtree', cursive; font-size: 50pt; font-weight: 400; line-height: 1.2; color: var(--deep); white-space: nowrap; overflow: hidden; text-overflow: clip; padding: 0 1mm; }
  .name--s { font-size: 41pt; } .name--xs { font-size: 32pt; }
  .name.blank { font-family: 'Figtree', sans-serif; font-size: 22pt; font-weight: 500; color: #9AA39B; line-height: 2.4; }
  .underline { height: 1.1pt; background: var(--deep); margin-top: -1mm; }
  .detail { margin-top: 2mm; font-size: 10pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--green); }
  .deed { margin-top: 4mm; max-width: 188mm; font-size: 11.6pt; font-style: italic; line-height: 1.55; color: var(--ink); }
  .held { margin-top: 5mm; display: flex; align-items: center; gap: 4mm; flex-wrap: wrap; }
  .held b { background: var(--green); color: #fff; font-size: 10.5pt; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; padding: 2.2mm 4.5mm; }
  .held span { font-size: 10pt; font-weight: 500; color: var(--soft); }

  /* Signature, number and QR sit on one baseline: every block is a 15mm
     stage, a rule, then two label lines, and the QR is exactly as tall. */
  .foot { display: flex; align-items: flex-end; gap: 8mm; }
  .blk { flex: none; }
  .blk .stage { height: 15mm; display: flex; align-items: flex-end; }
  .blk .rule { height: .4mm; background: var(--deep); margin-bottom: 1.6mm; }
  .blk .l1 { height: 4.6mm; line-height: 4.6mm; font-size: 10.5pt; font-weight: 800; color: var(--deep); white-space: nowrap; }
  .blk .l2 { height: 4mm; line-height: 4mm; font-size: 8.4pt; font-weight: 500; color: var(--soft); white-space: nowrap; }
  .sig { width: 50mm; }
  .sig img { display: block; height: 19mm; width: auto; margin: 0 0 -2.6mm 1mm; }
  .num { width: 44mm; }
  .num .stage span { font-size: 14.5pt; font-weight: 800; letter-spacing: .03em; color: var(--deep); line-height: 1; padding-bottom: 1.6mm; white-space: nowrap; }
  .scan { display: flex; align-items: flex-end; gap: 3.5mm; }
  .scan > img, .scan > .qrbox { width: 25.6mm; height: 25.6mm; display: block; flex: none; }
  .scan > .qrbox { border: .4mm dashed #B9C2BA; }
  .scan .blk .stage { height: 15mm; }
  .scan .blk .rule { background: transparent; }
  .scan .blk .l2 { font-size: 7.8pt; }

  .legal { margin-top: 4.5mm; padding-top: 2.2mm; border-top: 1px solid #DCE2D6; font-size: 6.9pt; line-height: 1.4; color: var(--soft); }
  .legal b { color: var(--deep); }
  .void { position: absolute; inset: 0; display: grid; place-items: center; font-size: 60pt; font-weight: 900; letter-spacing: .1em; color: rgba(185, 28, 28, .25); transform: rotate(-18deg); pointer-events: none; }
  @page { size: 297mm 210mm; margin: 0; }
</style></head>
<body>
<article class="cert">
  <div class="band">${kenteBand()}</div>
  ${seal(year)}
  <div class="page">
    <header class="top">
      <img class="logo" src="${esc(origin)}/brand/swk-logo.svg" alt="SWK Ghana">
      <div class="partners">
        <p>In partnership with</p>
        <div>${PARTNERS.map((p) => `<img src="${esc(p.src)}" alt="${esc(p.name)}" style="aspect-ratio:${p.ratio.toFixed(3)}">`).join('')}</div>
      </div>
    </header>
    <section class="main">
      <p class="eyebrow">${esc(eventName)} <span>· From the Ground Up</span></p>
      <h1 class="title">Certificate</h1>
      <p class="kind">${esc(kindFor(c.role))}</p>
      <p class="presented">Proudly presented to</p>
      <div class="name${c.name ? nameClass : ' blank'}">${esc(name)}</div>
      <div class="underline"></div>
      ${c.detail ? `<div class="detail">${esc(c.detail)}</div>` : ''}
      <p class="deed">${esc(deed)}</p>
      <p class="held"><b>Held on ${esc(fullDate(c.eventDate))}</b><span>${esc(c.venue || '')}</span></p>
    </section>
    <footer class="foot">
      <div class="blk sig">
        <div class="stage">${signature ? `<img src="${esc(signature)}" alt="Signature of Frank Koomson">` : ''}</div>
        <div class="rule"></div>
        <div class="l1">Frank Koomson</div>
        <div class="l2">Founder, SWK Ghana</div>
      </div>
      <div class="blk num">
        <div class="stage"><span>${esc(c.no || 'SWK-AS26-····')}</span></div>
        <div class="rule"></div>
        <div class="l1">Certificate number</div>
        <div class="l2">${c.no ? `Issued ${esc(fullDate(c.issued).replace(/^\w+, /, ''))}` : 'Given when the certificate is issued'}</div>
      </div>
      <div class="scan">
        ${qr ? `<img src="${esc(qr)}" alt="QR code linking to the verification page">` : '<div class="qrbox"></div>'}
        <div class="blk">
          <div class="stage"></div>
          <div class="rule"></div>
          <div class="l1">Scan to verify</div>
          <div class="l2">${c.no ? esc(link) : 'The link appears once issued'}</div>
        </div>
      </div>
    </footer>
    <p class="legal"><b>SWK Ghana LBG</b> · Registered non-profit company limited by guarantee · Reg. No. CG024110426 · NPO Licence No. NPOS/GR01/LN04158/26 · info@swkghana.org · swkghana.org</p>
    ${c.status === 'revoked' ? '<div class="void">REVOKED</div>' : ''}
  </div>
</article>
</body></html>`
}
