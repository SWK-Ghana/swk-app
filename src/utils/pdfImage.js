// A one-page PDF that is a single JPEG filling the page. Written by hand
// because that is all the certificate export needs: the browser has already
// drawn the sheet, and a PDF may carry a JPEG as it is (DCTDecode).

const A4_LANDSCAPE = [841.89, 595.28] // points

const ascii = (s) => Uint8Array.from(s, (ch) => ch.charCodeAt(0) & 0xff)

// PDF text strings are Latin-1 here; anything else becomes "?" and the three
// characters that would end or escape the string are escaped.
const pdfString = (s) => `(${String(s).replace(/[^\x20-\x7E]/g, '?').replace(/[\\()]/g, '\\$&')})`

/**
 * @param jpeg    Uint8Array of a baseline or progressive RGB JPEG
 * @param width   its width in pixels
 * @param height  its height in pixels
 * @param title   shown by PDF readers in the title bar
 * @param page    [width, height] in points; A4 landscape by default
 * @returns Uint8Array of the PDF file
 */
export const pdfFromJpeg = (jpeg, width, height, title = '', page = A4_LANDSCAPE) => {
  const [w, h] = page
  const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
    null, // the image, written separately because it holds binary data
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    `<< /Title ${pdfString(title)} /Producer (SWK Ghana staff dashboard) >>`,
  ]

  const parts = [ascii('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')]
  const offsets = []
  let length = parts[0].length
  const push = (bytes) => { parts.push(bytes); length += bytes.length }

  objects.forEach((body, i) => {
    offsets.push(length)
    if (body !== null) return push(ascii(`${i + 1} 0 obj\n${body}\nendobj\n`))
    push(ascii(`${i + 1} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`))
    push(jpeg)
    push(ascii('\nendstream\nendobj\n'))
  })

  const xref = length
  const rows = offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  push(ascii(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${rows}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`))

  const out = new Uint8Array(length)
  let at = 0
  for (const p of parts) { out.set(p, at); at += p.length }
  return out
}
