// The attendance report as a printable A4 document, built from the server's
// report numbers. Everything is escaped; it renders in a frame like the receipts.
import { longDate } from './receiptTemplate'

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const time = (iso) => (iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '–')

const bars = (title, rows) => `
  <section class="block">
    <h3>${esc(title)}</h3>
    ${rows.length ? `<table class="bars">${rows.map((r) => `<tr><th>${esc(r.name)}</th><td><span style="width:${Math.max(2, (r.count / Math.max(1, rows[0].count)) * 100)}%"></span></td><td class="n">${r.count}</td></tr>`).join('')}</table>` : '<p class="muted">Nothing recorded.</p>'}
  </section>`

const people = (title, list, extra) => `
  <section class="block wide">
    <h3>${esc(title)} (${list.length})</h3>
    ${list.length ? `<table class="list"><thead><tr><th>Name</th><th>Region / city</th><th>Phone ends</th>${extra ? `<th>${esc(extra.label)}</th>` : ''}</tr></thead><tbody>${list.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.location)}</td><td>${esc(p.phoneEnd)}</td>${extra ? `<td>${esc(extra.value(p))}</td>` : ''}</tr>`).join('')}</tbody></table>` : '<p class="muted">None.</p>'}
  </section>`

export const reportFileName = (r) => `SWK-${r.event.name.replace(/[^A-Za-z0-9]+/g, '-')}-attendance-report`

export const reportHtml = (r, { origin = '' } = {}) => {
  const t = r.totals
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(reportFileName(r))}</title>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root { --deep: #0C2E11; --green: #17702D; --lime: #78C31E; --ink: #1C2A1E; --line: #DCE2D6; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Ubuntu', system-ui, sans-serif; color: var(--ink); background: #fff; font-size: 10.5pt; line-height: 1.4; }
  .page { padding: 0 0 12mm; }
  .ribbon { height: 6mm; background: var(--lime) url("${esc(origin)}/patterns/flow.svg") 0 38% / 96mm auto; }
  header { display: flex; justify-content: space-between; align-items: flex-end; padding: 10mm 14mm 0; }
  header img { width: 36mm; height: auto; }
  .title { text-align: right; }
  .kicker { font-size: 9pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--green); }
  h1 { font-size: 20pt; color: var(--deep); line-height: 1.15; margin-top: 1mm; }
  .meta { color: #5B665C; margin-top: 1mm; }
  main { padding: 6mm 14mm 0; }
  .tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 4mm; }
  .tile { border: 1px solid var(--line); border-radius: 3mm; padding: 4mm; }
  .tile b { display: block; font-size: 22pt; color: var(--deep); line-height: 1.1; }
  .tile span { color: #5B665C; font-size: 9pt; }
  .summary { margin-top: 5mm; padding: 4mm 5mm; background: #F2FAE8; border-radius: 3mm; }
  h2 { font-size: 13pt; color: var(--deep); margin-top: 8mm; padding-bottom: 1.5mm; border-bottom: 2px solid var(--lime); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 8mm; margin-top: 3mm; }
  .block { break-inside: avoid; }
  .block.wide { grid-column: 1 / -1; }
  h3 { font-size: 10.5pt; color: var(--green); margin-bottom: 1.5mm; }
  .bars { width: 100%; border-collapse: collapse; }
  .bars th { text-align: left; font-weight: 400; width: 48%; padding: .6mm 2mm .6mm 0; }
  .bars td { padding: .6mm 0; }
  .bars td span { display: block; height: 3mm; border-radius: 1.5mm; background: var(--green); }
  .bars td.n { width: 9mm; text-align: right; font-weight: 500; padding-left: 2mm; }
  .list { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  .list th { text-align: left; color: #5B665C; font-weight: 500; border-bottom: 1px solid var(--line); padding: 1mm 2mm 1mm 0; }
  .list td { border-bottom: 1px solid #EEF2EA; padding: 1mm 2mm 1mm 0; vertical-align: top; }
  .muted { color: #5B665C; }
  footer { margin-top: 10mm; padding: 3mm 14mm 0; font-size: 8pt; color: #5B665C; border-top: 1px solid var(--line); }
  @page { size: A4; margin: 0 0 10mm; }
  @media print { .ribbon { position: static; } }
</style></head>
<body><div class="page">
<div class="ribbon"></div>
<header>
  <img src="${esc(origin)}/brand/swk-logo.svg" alt="SWK Ghana">
  <div class="title">
    <div class="kicker">Attendance report</div>
    <h1>${esc(r.event.name)}</h1>
    <p class="meta">${esc(longDate(r.event.date))} · ${esc(r.event.venue)}</p>
  </div>
</header>
<main>
  <div class="tiles">
    <div class="tile"><b>${t.attended}</b><span>${t.attended === 1 ? 'person' : 'people'} attended</span></div>
    <div class="tile"><b>${t.registered}</b><span>registered in all</span></div>
    <div class="tile"><b>${t.attendanceRate}%</b><span>of online registrants came</span></div>
    <div class="tile"><b>${t.walkIns}</b><span>registered at the entrance</span></div>
  </div>
  <p class="summary">
    ${t.attended} ${t.attended === 1 ? 'person' : 'people'} attended: ${t.onlineAttended} of the ${t.online} who registered online, plus ${t.walkIns} who registered at the entrance.
    ${t.noShows} online registrants did not come.
    ${t.firstArrival ? `The first arrival was at ${time(t.firstArrival)} and the last at ${time(t.lastArrival)}.` : ''}
    ${t.withNeeds} attendees noted dietary or accessibility needs. ${t.photoConsent} agreed to photos and video, and ${t.contactConsent} are happy to hear about future programmes.
  </p>

  <h2>Who attended</h2>
  <div class="grid">
    ${bars('Arrivals by half hour', r.arrivalsBySlot)}
    ${bars('Gender', r.attended.gender)}
    ${bars('Age', r.attended.age)}
    ${bars('Current status', r.attended.status)}
    ${bars('Main interest', r.attended.interest)}
    ${bars('Education', r.attended.education)}
    ${bars('Where they live', r.attended.location)}
    ${bars('How they heard about the Summit', r.attended.heard)}
    ${bars('Already in agribusiness', r.attended.inAgri)}
    ${bars('What they hoped to gain', r.attended.gain)}
  </div>

  <h2>Compared with everyone who registered</h2>
  <div class="grid">
    ${bars('Gender, all registered', r.registered.gender)}
    ${bars('Age, all registered', r.registered.age)}
    ${bars('Main interest, all registered', r.registered.interest)}
    ${bars('Checked in by', r.checkedInBy)}
  </div>

  <h2>Lists</h2>
  <div class="grid">
    ${people('Dietary or accessibility needs', r.needs, { label: 'Needs', value: (p) => p.needs })}
    ${people('Registered at the entrance', r.walkIns, { label: 'Arrived', value: (p) => time(p.checkedInAt) })}
    ${people('Registered online but did not attend', r.noShows)}
  </div>
</main>
<footer>SWK Ghana LBG · Generated ${esc(new Date(r.generatedAt).toLocaleString('en-GB'))} from the staff dashboard · swkghana.org</footer>
</div></body></html>`
}
