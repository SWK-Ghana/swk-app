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
  panellist: 'Panellist',
  moderator: 'Panel moderator',
  spotlight: 'Spotlight speaker',
  panelspot: 'Panellist and Spotlight speaker',
  workshop: 'Workshop facilitator',
  goodwill: 'Goodwill speaker',
  solidarity: 'Solidarity speaker',
  performer: 'Spoken word artiste',
  keynote: 'Keynote speaker',
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
  moderator: 'in appreciation of moderating the panel discussion at the {event}, drawing out the lived experience of agribusiness in Ghana for the young people in the room.',
  spotlight: 'in appreciation of speaking in the Spotlight session at the {event}, showing young people what is possible in agribusiness today.',
  panelspot: 'in appreciation of serving as a panellist and Spotlight speaker at the {event}, sharing the lived experience of agribusiness in Ghana and showing young people what is possible.',
  workshop: 'in appreciation of presenting the Agribusiness e-Academy and facilitating the Agribusiness Model Canvas workshop at the {event}, putting practical tools in the hands of young agripreneurs.',
  goodwill: 'in appreciation of delivering a goodwill message to the {event}, encouraging the young people in the room to build from the ground up.',
  solidarity: 'in appreciation of delivering a solidarity message at the {event}, standing with the young people in the room and with the work ahead.',
  performer: 'in appreciation of a spoken word performance at the {event} that set the tone for the day and stirred the room.',
  demonstration: 'in appreciation of leading a live demonstration at the {event}, showing young people agribusiness as it is really done.',
  judge: 'in appreciation of serving as a judge of the Youth Pitch Showcase at the {event}, giving young agripreneurs a serious hearing and honest guidance.',
  partner: 'in appreciation of partnering with SWK Ghana to deliver the {event}, making a free Summit for young people in agribusiness possible.',
}

// The Summit's partners, as they appear on the Summit page: crops of the flyer,
// with the flyer's off-white ground turned white so no box shows on the sheet.
const FLYER = 'https://res.cloudinary.com/dwgj3lovn/image/upload'
const PARTNERS = [
  ['The GracedLife Leadership Centre', 'c_crop,x_1018,y_121,w_168,h_168', 1],
  ['Agribusiness e-Academy', 'c_crop,x_1246,y_133,w_245,h_146', 245 / 146],
  ['Calidad Farms Ltd', 'c_crop,x_1538,y_150,w_305,h_106', 305 / 106],
  ['The Food Discourse', 'c_crop,x_1888,y_122,w_160,h_160', 1],
].map(([name, crop, ratio]) => ({ name, ratio, src: `${FLYER}/${crop}/e_replace_color:white:12:F7F7F4/f_auto,q_auto/v1790846227/SummitFlyer-selection_5_zshe0n.png` }))

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
  // The citation, with the event's name set in bold.
  const [before, after] = (DEEDS[c.role] || DEEDS.participant).split('{event}')
  const deed = `${esc(before)}<b>${esc(eventName)}</b>${esc(after)}`
  const link = verifyUrl(c, 'https://swkghana.org').replace(/^https?:\/\//, '')
  const year = (c.eventDate || '2026').slice(0, 4)
  const name = c.name || 'Name of recipient'
  const nameClass = name.length > 36 ? ' name--xxs' : name.length > 28 ? ' name--xs' : name.length > 20 ? ' name--s' : ''
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(certificateFileName(c))}</title>
<link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400..900;1,400..600&family=League+Spartan:wght@500..900&display=swap" rel="stylesheet">
<style>
  :root { --deep: #0C2E11; --green: #17702D; --lime: #78C31E; --gold: #E9A23B; --ink: #1C2A1E; --soft: #5B665C; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { background: #fff; }
  body { font-family: 'Figtree', system-ui, sans-serif; color: var(--ink); }
  .cert { position: relative; width: 297mm; height: 210mm; display: grid; grid-template-columns: 58mm 1fr; overflow: hidden; contain: strict; background: #fff; }

  /* The kente band, edged in deep green and lime. */
  .band { position: relative; background: ${INK}; border-right: 1mm solid var(--deep); box-shadow: 1.2mm 0 0 var(--lime); }
  .kente { display: block; width: 100%; height: 100%; }

  /* Everything on the sheet is centred inside a fine frame. */
  .page { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 13mm 17mm 9mm 18.2mm; min-width: 0; }
  .page::before { content: ""; position: absolute; inset: 5.5mm 5.5mm 5.5mm 6.7mm; border: .35mm solid #C5CFC3; pointer-events: none; }

  /* SWK's logo and the partners' logos stand together as one row. */
  .top { display: flex; align-items: center; justify-content: center; gap: 6mm; }
  .logo { width: 35mm; height: auto; display: block; }
  .top i { width: .35mm; align-self: stretch; background: #C5CFC3; margin: 1mm 0; }
  .partners p { font-size: 6.4pt; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--soft); margin-bottom: 1mm; text-align: left; }
  .partners div { display: flex; align-items: center; gap: 4.5mm; }
  .partners img { height: 12.5mm; width: auto; display: block; }

  .main { flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2mm 0; width: 100%; }
  .eyebrow { display: flex; align-items: center; gap: 3mm; font-size: 8.4pt; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--green); }
  .eyebrow::before, .eyebrow::after { content: ""; width: 10mm; height: .7mm; border-radius: 1mm; background: var(--lime); }
  .eyebrow span { color: var(--soft); font-weight: 600; letter-spacing: .16em; }
  .title { margin-top: 3.5mm; font-family: 'League Spartan', 'Figtree', sans-serif; font-size: 50pt; font-weight: 800; line-height: .9; letter-spacing: .05em; text-transform: uppercase; color: var(--green); }
  .kind { margin-top: 1.5mm; font-family: 'League Spartan', 'Figtree', sans-serif; font-size: 17pt; font-weight: 500; letter-spacing: .34em; text-transform: uppercase; color: var(--deep); padding-left: .34em; }
  .presented { margin-top: 6mm; font-size: 9pt; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--soft); }
  .name { margin-top: 2.5mm; font-family: 'League Spartan', 'Figtree', sans-serif; font-size: 40pt; font-weight: 700; line-height: 1.1; letter-spacing: -.005em; color: var(--deep); white-space: nowrap; max-width: 100%; overflow: hidden; }
  .name--s { font-size: 34pt; } .name--xs { font-size: 28pt; } .name--xxs { font-size: 22pt; }
  .name.blank { font-weight: 500; font-size: 26pt; color: #A6AEA6; }
  .underline { width: 150mm; height: .5mm; background: var(--lime); margin-top: 1.5mm; }
  .detail { margin-top: 2.2mm; font-size: 9.6pt; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--green); }
  .deed { margin-top: 4mm; max-width: 172mm; font-size: 11.4pt; line-height: 1.55; color: var(--ink); }
  .deed b { font-weight: 700; color: var(--deep); }
  .deed { text-wrap: balance; }
  .deed + .deed { margin-top: 1.2mm; max-width: 198mm; }

  /* Signature, seal, number and QR stand together on one baseline: each
     lettered block is a 15mm stage, a rule, then two label lines, and the
     seal and QR are exactly as tall as those blocks. */
  .foot { display: flex; align-items: flex-end; justify-content: center; gap: 7mm; text-align: left; }
  .blk { flex: none; }
  .blk .stage { height: 15mm; display: flex; align-items: flex-end; }
  .blk .rule { height: .4mm; background: var(--deep); margin-bottom: 1.6mm; }
  .blk .l1 { height: 4.6mm; line-height: 4.6mm; font-size: 10.5pt; font-weight: 800; color: var(--deep); white-space: nowrap; }
  .blk .l2 { height: 4mm; line-height: 4mm; font-size: 8.4pt; font-weight: 500; color: var(--soft); white-space: nowrap; }
  .sig { width: 52mm; }
  .sig img { display: block; height: 19mm; width: auto; margin: 0 0 -2.6mm 1mm; }
  .num { width: 48mm; }
  .num .stage span { font-family: 'League Spartan', 'Figtree', sans-serif; font-size: 16pt; font-weight: 700; letter-spacing: .04em; color: var(--deep); line-height: 1; padding-bottom: .8mm; white-space: nowrap; }
  .seal, .qr { flex: none; width: 25.6mm; height: 25.6mm; display: block; }
  .qr--blank { border: .4mm dashed #B9C2BA; }

  .verify { margin-top: 4mm; font-size: 8pt; font-weight: 500; color: var(--soft); }
  .verify b { color: var(--deep); font-weight: 700; }
  .legal { margin-top: 1.2mm; font-size: 6.7pt; line-height: 1.4; color: var(--soft); }
  .legal b { color: var(--deep); }
  .void { position: absolute; inset: 0; display: grid; place-items: center; font-size: 60pt; font-weight: 900; letter-spacing: .1em; color: rgba(185, 28, 28, .25); transform: rotate(-18deg); pointer-events: none; }
  @page { size: 297mm 210mm; margin: 0; }
</style></head>
<body>
<article class="cert">
  <div class="band">${kenteBand()}</div>
  <div class="page">
    <header class="top">
      <img class="logo" src="${esc(origin)}/brand/swk-logo.svg" alt="SWK Ghana">
      <i></i>
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
      <p class="deed">${deed}</p>
      <p class="deed"><b>Held on ${esc(fullDate(c.eventDate))}</b>${c.venue ? ` at ${esc(c.venue)}` : ''}.</p>
    </section>
    <footer class="foot">
      <div class="blk sig">
        <div class="stage">${signature ? `<img src="${esc(signature)}" alt="Signature of Frank Koomson">` : ''}</div>
        <div class="rule"></div>
        <div class="l1">Frank Koomson</div>
        <div class="l2">Founder, SWK Ghana</div>
      </div>
      ${seal(year)}
      <div class="blk num">
        <div class="stage"><span>${esc(c.no || 'SWK-AS26-····')}</span></div>
        <div class="rule"></div>
        <div class="l1">Certificate number</div>
        <div class="l2">${c.no ? `Issued ${esc(fullDate(c.issued).replace(/^\w+, /, ''))}` : 'Given when the certificate is issued'}</div>
      </div>
      ${qr ? `<img class="qr" src="${esc(qr)}" alt="QR code linking to the verification page">` : '<div class="qr qr--blank"></div>'}
    </footer>
    <p class="verify">${c.no ? `Scan the code to verify this certificate, or visit <b>${esc(link)}</b>` : 'The verification code and link appear once the certificate is issued'}</p>
    <p class="legal"><b>SWK Ghana LBG</b> · Registered non-profit company limited by guarantee · Reg. No. CG024110426 · NPO Licence No. NPOS/GR01/LN04158/26 · info@swkghana.org · swkghana.org</p>
    ${c.status === 'revoked' ? '<div class="void">REVOKED</div>' : ''}
  </div>
</article>
</body></html>`
}
