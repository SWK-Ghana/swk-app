// Turns certificates into PDF files inside one ZIP, entirely in the browser.
//
// Each sheet is drawn by the browser's own layout engine from the same HTML
// the print button uses: the page is packed into a self-contained SVG (fonts
// and pictures carried inside it), painted onto a canvas at print resolution
// and wrapped in a one-page PDF. A downloaded file therefore matches what the
// certificate's own page shows.
import { pdfFromJpeg } from '../../utils/pdfImage'
import { certificateHtml, qrFor, verifyUrl } from './certificateTemplate'

// A4 landscape at 96 px to the inch, the size the template is drawn at.
const SHEET_W = 1123
const SHEET_H = 794
// 2.3 times that is about 220 dots per inch on paper: sharp text, files near half a megabyte.
const SCALE = 2.3
const JPEG_QUALITY = 0.9
// Only the alphabets the certificates use; the others would triple the size.
const FONT_SUBSETS = ['latin', 'latin-ext']

const safe = (s) => String(s || '').normalize('NFKD').replace(/[^\w\s.-]/g, '').trim().replace(/\s+/g, '-')
export const pdfName = (c) => `${c.no}-${safe(c.name) || 'certificate'}.pdf`

const asDataUri = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('A picture on the certificate could not be read.'))
    reader.readAsDataURL(blob)
  })

// Pictures and fonts are the same on every sheet, so each is fetched once.
const fetched = new Map()
const dataUriOf = (url) => {
  if (!fetched.has(url)) {
    fetched.set(url, fetch(url, { mode: 'cors' }).then((res) => {
      if (!res.ok) throw new Error(`Could not load ${url.split('/').pop().slice(0, 40)}`)
      return res.blob()
    }).then(asDataUri))
  }
  return fetched.get(url)
}

/** The stylesheet's @font-face rules with the font files carried inside them. */
const embeddedFonts = async (href) => {
  const css = await (await fetch(href)).text()
  const faces = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)]
    .filter(([, subset]) => FONT_SUBSETS.includes(subset))
    .map(([, , face]) => face)
  return (await Promise.all(faces.map(async (face) => {
    const url = face.match(/url\((https:[^)]+)\)/)?.[1]
    return url ? face.replace(url, await dataUriOf(url)) : face
  }))).join('\n')
}
const fontCss = new Map()
const fontsFor = (href) => {
  if (!fontCss.has(href)) fontCss.set(href, embeddedFonts(href))
  return fontCss.get(href)
}

const painted = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('This browser could not draw the certificate.'))
    img.src = src
  })

/** One certificate's HTML as a JPEG of the sheet: { bytes, width, height }. */
export const sheetJpeg = async (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const sheet = doc.querySelector('.cert')
  const link = doc.querySelector('link[rel="stylesheet"]')
  await Promise.all([...sheet.querySelectorAll('img')].map(async (img) => {
    const src = img.getAttribute('src')
    if (src && !src.startsWith('data:')) img.setAttribute('src', await dataUriOf(src))
  }))
  // The template styles <body>; inside the SVG that part is played by a wrapper.
  const css = [...doc.querySelectorAll('style')].map((s) => s.textContent).join('\n')
    .replace(/html,\s*body\s*\{/g, '.sheet-root {')
    .replace(/(^|[\s}])body\s*\{/g, '$1.sheet-root {')
  const fonts = link ? await fontsFor(link.href) : ''
  const root = doc.createElement('div')
  root.className = 'sheet-root'
  root.setAttribute('style', `width:${SHEET_W}px;height:${SHEET_H}px;overflow:hidden`)
  const style = doc.createElement('style')
  style.textContent = `${fonts}\n${css}`
  root.append(style, sheet)

  const w = Math.round(SHEET_W * SCALE)
  const h = Math.round(SHEET_H * SCALE)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${SHEET_W} ${SHEET_H}">`
    + `<foreignObject x="0" y="0" width="${SHEET_W}" height="${SHEET_H}">${new XMLSerializer().serializeToString(root)}</foreignObject></svg>`
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  // Fonts inside an SVG picture can arrive a beat after the picture itself, so
  // the sheet is painted twice and the second painting is the one kept.
  for (let pass = 0; pass < 2; pass++) {
    const img = await painted(src)
    if (img.decode) await img.decode().catch(() => {})
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    if (pass === 0) await new Promise((r) => setTimeout(r, 60))
  }
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
  if (!blob) throw new Error('This browser could not save the picture of the certificate.')
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width: w, height: h }
}

/**
 * @param certs    certificates to export (staff shape: no, id, name, role, …)
 * @param options  signature: data URI or null; origin: site origin for assets;
 *                 onProgress(done, total); shouldStop(): true to give up early
 * @returns { blob, count } the ZIP and how many PDFs it holds, or null if stopped
 */
export const exportCertificatesZip = async (certs, { signature = null, origin = '', onProgress = () => {}, shouldStop = () => false } = {}) => {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const used = new Set()
  for (let i = 0; i < certs.length; i++) {
    if (shouldStop()) return null
    const c = certs[i]
    const qr = await qrFor(verifyUrl(c, origin))
    const { bytes, width, height } = await sheetJpeg(certificateHtml(c, { signature, origin, qr }))
    // Two people with the same name still get a file each.
    let name = pdfName(c)
    for (let n = 2; used.has(name); n++) name = pdfName(c).replace(/\.pdf$/, `-${n}.pdf`)
    used.add(name)
    zip.file(name, pdfFromJpeg(bytes, width, height, `${c.no} ${c.name}`))
    onProgress(i + 1, certs.length)
  }
  // PDFs holding JPEGs do not shrink, so they are stored as they are.
  return { blob: await zip.generateAsync({ type: 'blob', compression: 'STORE' }), count: certs.length }
}
