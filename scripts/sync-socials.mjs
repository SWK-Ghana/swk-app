// Writes SWK Ghana's contact details and social profiles (src/data/socials.js)
// into the standalone pages in public/ and the toolkit sources in
// content/toolkit/, so they match the React site exactly. (After changing the
// toolkit, re-render its PDFs with npm run build:toolkit.)
//
// Each page opts in with marker comments; everything between a pair is
// regenerated, so never edit inside them by hand:
//   <!-- swk:topbar -->  <!-- /swk:topbar -->   slim bar: contact + "Follow us"
//   <!-- swk:socials --> <!-- /swk:socials -->  footer icon row (styled by the page's .socials rules)
//   <!-- swk:handles --> <!-- /swk:handles -->  footer line listing the handles
//
// Runs before every build (npm "prebuild"). Run it yourself: npm run sync:socials
// New standalone page? Add the marker pairs where you want them, then run it.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import { SOCIALS, CONTACT } from '../src/data/socials.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = [join(root, 'public'), join(root, 'content', 'toolkit')]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const icon = ({ id, label, href, path }) =>
  `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="${esc(label)}" ` +
  `aria-label="SWK Ghana on ${esc(label)} (opens in a new tab)" data-social="${id}">` +
  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${path}"/></svg></a>`

const MAIL_PATHS = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
const strokeSvg = (inner) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`

const TOPBAR = `
  <!-- Generated from src/data/socials.js by scripts/sync-socials.mjs. Edit the data, not this block. -->
  <style>
    :root { --swk-topbar-h: 36px; }
    .swk-topbar { background: #0C2E11; color: rgba(255, 255, 255, .75); font-family: inherit; font-size: 13px; line-height: 1; }
    .swk-topbar__in { box-sizing: border-box; max-width: 1200px; height: var(--swk-topbar-h); margin: 0 auto; padding: 0 clamp(1rem, 4vw, 3rem); display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .swk-topbar a { color: inherit; text-decoration: none; transition: color .2s ease; }
    .swk-topbar a:hover, .swk-topbar a:focus-visible { color: #A8E04A; }
    .swk-topbar__contact { display: flex; align-items: center; gap: 1.25rem; min-width: 0; }
    .swk-topbar__contact a { display: inline-flex; align-items: center; gap: .4rem; white-space: nowrap; }
    .swk-topbar__contact svg { width: 14px; height: 14px; flex: none; }
    .swk-topbar__follow { display: flex; align-items: center; gap: .1rem; }
    .swk-topbar__label { margin-right: .4rem; font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: rgba(255, 255, 255, .55); }
    .swk-topbar__follow a { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; }
    .swk-topbar__follow svg { width: 15px; height: 15px; }
    @media (max-width: 767px) { .swk-topbar__contact .swk-topbar__phone { display: none; } }
    @media (max-width: 639px) { .swk-topbar__contact { display: none; } .swk-topbar__in { justify-content: center; } }
    @media print { .swk-topbar { display: none; } }
  </style>
  <div class="swk-topbar">
    <div class="swk-topbar__in">
      <div class="swk-topbar__contact">
        <a href="https://swkghana.org">${strokeSvg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>')}swkghana.org</a>
        <a href="mailto:${CONTACT.email}">${strokeSvg(MAIL_PATHS)}${CONTACT.email}</a>
        <a class="swk-topbar__phone" href="${CONTACT.phoneHref}">${strokeSvg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>')}${CONTACT.phone}</a>
      </div>
      <nav class="swk-topbar__follow" aria-label="SWK Ghana on social media">
        <span class="swk-topbar__label">Follow us</span>
        ${SOCIALS.map(icon).join('\n        ')}
      </nav>
    </div>
  </div>
  `

const SOCIAL_ROW = `
          <div class="socials">
            ${SOCIALS.map(icon).join('\n            ')}
            <a href="mailto:${CONTACT.email}" title="Email" aria-label="Email SWK Ghana">${strokeSvg(MAIL_PATHS)}</a>
          </div>
          `

const HANDLES = `
          <p class="socials__handles">${SOCIALS.map((s) => (s.handle.startsWith('@') ? `${s.label} ${s.handle}` : s.label)).join(' &middot; ')}</p>
          `

const BLOCKS = { topbar: TOPBAR, socials: SOCIAL_ROW, handles: HANDLES }

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return htmlFiles(p)
    return name.endsWith('.html') ? [p] : []
  })

let changed = 0
for (const file of DIRS.flatMap(htmlFiles)) {
  const before = readFileSync(file, 'utf8')
  let after = before
  for (const [name, html] of Object.entries(BLOCKS)) {
    const re = new RegExp(`(<!-- swk:${name} -->)[\\s\\S]*?(<!-- /swk:${name} -->)`, 'g')
    after = after.replace(re, (_, open, close) => `${open}${html}${close}`)
  }
  if (after !== before) {
    writeFileSync(file, after)
    changed++
    console.log(`✓ ${relative(root, file)}`)
  }
}
console.log(changed ? `Synced social links into ${changed} page(s).` : 'Standalone pages already match src/data/socials.js.')
