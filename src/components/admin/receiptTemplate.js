// The donation receipt as a self-contained A5 page. It renders inside an iframe,
// on screen and for printing, so the site's own styles can't touch it.

export const money = (n) =>
  'GHS ' + (Number(n) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const longDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

const underThousand = (k) => {
  let s = ''
  if (k >= 100) {
    s += `${ONES[Math.floor(k / 100)]} hundred`
    k %= 100
    if (k) s += ' and '
  }
  if (k >= 20) {
    s += TENS[Math.floor(k / 10)]
    if (k % 10) s += `-${ONES[k % 10]}`
  } else if (k) {
    s += ONES[k]
  }
  return s
}

const words = (n) => {
  if (n === 0) return 'zero'
  const parts = []
  let rest = n
  if (rest >= 1000) {
    parts.push(`${underThousand(Math.floor(rest / 1000))} thousand`)
    rest %= 1000
  }
  if (rest) parts.push((parts.length && rest < 100 ? 'and ' : '') + underThousand(rest))
  return parts.join(' ')
}

export const amountWords = (amount) => {
  const total = Math.round((Number(amount) || 0) * 100)
  const cedis = Math.floor(total / 100)
  const pesewas = total % 100
  let s = `${words(cedis)} Ghana cedi${cedis === 1 ? '' : 's'}`
  if (pesewas) s += ` and ${words(pesewas)} pesewa${pesewas === 1 ? '' : 's'}`
  s += ' only'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export const receiptFileName = (r) =>
  `SWK-receipt-${r.no || 'draft'}-${(r.name || 'donor').replace(/[^A-Za-z0-9]+/g, '-')}`

const row = (label, value) => (value ? `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>` : '')

/**
 * @param r         receipt fields: no, issued, name, amount, date, method, txn, purpose, note, status
 * @param options   signature: image data URI or null; origin: site origin for the logo and pattern
 */
export const receiptHtml = (r, { signature = null, origin = '' } = {}) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(receiptFileName(r))}</title>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root { --deep: #0C2E11; --green: #17702D; --lime: #78C31E; --cream: #F7FAF2; --ink: #1C2A1E; --line: #DCE2D6; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { background: #fff; }
  body { font-family: 'Ubuntu', system-ui, sans-serif; color: var(--ink); }
  .receipt { position: relative; width: 148mm; height: 209.8mm; display: flex; flex-direction: column; overflow: hidden; contain: strict; background: #fff; }
  .ribbon { flex: none; height: 7mm; background: var(--lime) url("${esc(origin)}/patterns/flow.svg") 0 38% / 96mm auto; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; padding: 8mm 12mm 0; }
  .head img { width: 38mm; height: auto; display: block; }
  .title { text-align: right; }
  .kicker { font-size: 9pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--green); }
  .no { font-size: 15pt; font-weight: 700; color: var(--deep); margin-top: 1mm; }
  .date { font-size: 9pt; color: #5B665C; margin-top: 1mm; }
  .body { flex: 1 1 auto; padding: 6mm 12mm 0; }
  .thanks { font-size: 10.5pt; color: #3B463C; }
  .amount { margin-top: 3mm; font-size: 30pt; font-weight: 700; color: var(--deep); line-height: 1.05; letter-spacing: -.5pt; }
  .words { font-size: 9.5pt; color: #5B665C; margin-top: 1.5mm; }
  .from { margin-top: 5mm; padding: 4mm 6mm; background: var(--cream); border-radius: 3mm; }
  .from .lbl { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .1em; color: var(--green); font-weight: 700; }
  .from .name { font-size: 15pt; font-weight: 700; color: var(--deep); margin-top: 1mm; overflow-wrap: anywhere; }
  .from .note { font-size: 9.5pt; color: #3B463C; margin-top: 1mm; }
  dl { display: grid; grid-template-columns: 38mm 1fr; gap: 1.8mm 4mm; margin-top: 5mm; font-size: 9.5pt; }
  dt { color: #5B665C; }
  dd { font-weight: 500; min-width: 0; overflow-wrap: anywhere; }
  .msg { margin-top: 5mm; font-size: 9.5pt; line-height: 1.5; color: #3B463C; }
  .sign { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 3mm; }
  .who { font-size: 9pt; }
  .who img { display: block; width: 34mm; height: auto; margin: 0 0 1mm -1mm; }
  .who b { display: block; font-size: 10.5pt; color: var(--deep); }
  .who span { color: #5B665C; }
  .stamp { width: 22mm; height: 22mm; border: 1.5pt solid var(--lime); border-radius: 50%; display: grid; place-items: center; text-align: center; font-size: 6pt; font-weight: 700; color: var(--green); letter-spacing: .08em; text-transform: uppercase; line-height: 1.3; transform: rotate(-8deg); }
  .foot { flex: none; margin-top: 4mm; padding: 3.5mm 12mm 4mm; font-size: 7.5pt; line-height: 1.5; color: #5B665C; border-top: 1px solid var(--line); }
  .foot b { color: var(--deep); }
  .void { position: absolute; inset: 0; display: grid; place-items: center; font-size: 44pt; font-weight: 700; letter-spacing: .08em; color: rgba(185, 28, 28, .28); transform: rotate(-24deg); pointer-events: none; }
  @page { size: 148mm 210mm; margin: 0; }
</style></head>
<body>
<article class="receipt">
  <div class="ribbon"></div>
  <header class="head">
    <img src="${esc(origin)}/brand/swk-logo.svg" alt="SWK Ghana">
    <div class="title">
      <div class="kicker">Donation receipt</div>
      <div class="no">${esc(r.no || 'New receipt')}</div>
      <div class="date">Issued ${esc(longDate(r.issued))}</div>
    </div>
  </header>
  <section class="body">
    <p class="thanks">Received with thanks, the sum of</p>
    <div class="amount">${esc(money(r.amount))}</div>
    <div class="words">${esc(amountWords(r.amount))}</div>
    <div class="from">
      <div class="lbl">From</div>
      <div class="name">${esc(r.name || 'Donor name')}</div>
      ${r.note ? `<div class="note">${esc(r.note)}</div>` : ''}
    </div>
    <dl>
      ${row('Purpose', r.purpose)}
      ${row('Payment date', longDate(r.date))}
      ${row('Payment method', r.method === 'Not stated' ? '' : r.method)}
      ${row('Transaction ID', r.txn)}
    </dl>
    <p class="msg">Thank you for standing with young people in Ghana. Your gift goes directly into SWK Ghana's programmes, and every donor receives our impact report when the work is done.</p>
    <div class="sign">
      <div class="who">
        ${signature ? `<img src="${esc(signature)}" alt="Signature of Frank Koomson">` : ''}
        <b>Frank Koomson</b><span>Founder, SWK Ghana</span>
      </div>
      <div class="stamp">SWK Ghana<br>official<br>receipt</div>
    </div>
  </section>
  <footer class="foot">
    <b>SWK Ghana LBG</b> · Registered non-profit company limited by guarantee · Reg. No. CG024110426 · NPO Licence No. NPOS/GR01/LN04158/26<br>
    info@swkghana.org · +233 59 683 8595 · swkghana.org
  </footer>
  <div class="ribbon"></div>
  ${r.status === 'cancelled' ? '<div class="void">CANCELLED</div>' : ''}
</article>
</body></html>`

/** Prints a receipt from a hidden frame, once its fonts and images have loaded. */
export const printReceipt = (html, fileName) =>
  new Promise((resolve, reject) => {
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'
    frame.onload = async () => {
      try {
        const doc = frame.contentDocument
        await doc.fonts.ready
        await Promise.all([...doc.images].map((img) => img.decode().catch(() => {})))
        const pageTitle = document.title
        document.title = fileName
        frame.contentWindow.focus()
        frame.contentWindow.print()
        document.title = pageTitle
        setTimeout(() => frame.remove(), 1000)
        resolve()
      } catch (err) {
        frame.remove()
        reject(err)
      }
    }
    frame.srcdoc = html
    document.body.appendChild(frame)
  })
