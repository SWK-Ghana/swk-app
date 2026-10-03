// Renders the NGO Support Toolkit PDFs (served at swkghana.org/support).
//
// Each content/toolkit/<name>.html is an A4 page styled by toolkit.css. This
// prints it to public/support/toolkit/<name>.pdf with headless Chrome, then
// writes src/data/toolkit-manifest.json (page count and size of every PDF)
// for the Support page to show.
//
// Usage: npm run build:toolkit            (all documents)
//        npm run build:toolkit -- <name>  (one document, without .html)
// Needs Google Chrome; set CHROME_PATH if it isn't in a standard location.
// Not part of `npm run build`: the PDFs are committed, so deploys don't need Chrome.

import { execFileSync } from 'child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'content', 'toolkit')
const out = join(root, 'public', 'support', 'toolkit')

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p))

if (!chrome) {
  console.error('Google Chrome not found. Set CHROME_PATH to its executable.')
  process.exit(1)
}

mkdirSync(out, { recursive: true })

const only = process.argv[2]
const docs = readdirSync(src)
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))
  .filter((name) => !only || name === only)

for (const name of docs) {
  const pdf = join(out, `${name}.pdf`)
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=15000',
    `--print-to-pdf=${pdf}`,
    pathToFileURL(join(src, `${name}.html`)).href,
  ], { stdio: 'ignore' })
  console.log(`✓ ${name}.pdf`)
}

// Page count and size for every PDF, read straight from the files.
const manifest = {}
for (const f of readdirSync(out).filter((f) => f.endsWith('.pdf')).sort()) {
  const buf = readFileSync(join(out, f))
  const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
  manifest[f] = { pages, bytes: statSync(join(out, f)).size }
}
writeFileSync(join(root, 'src', 'data', 'toolkit-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`\nWrote src/data/toolkit-manifest.json (${Object.keys(manifest).length} documents)`)
