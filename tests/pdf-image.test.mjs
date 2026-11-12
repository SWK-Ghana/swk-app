import test from 'node:test'
import assert from 'node:assert/strict'
import { pdfFromJpeg } from '../src/utils/pdfImage.js'

const latin1 = (bytes) => Buffer.from(bytes).toString('latin1')

test('the PDF wraps the JPEG untouched and its cross-reference table points at each object', () => {
  // Not a real picture: any bytes will do to check the container.
  const jpeg = Uint8Array.from({ length: 5000 }, (_, i) => (i * 37) % 256)
  const pdf = pdfFromJpeg(jpeg, 2470, 1747, 'SWK-AS26-0042 (Ama) \\ test')
  const text = latin1(pdf)

  assert.ok(text.startsWith('%PDF-1.4\n'))
  assert.ok(text.trimEnd().endsWith('%%EOF'))
  assert.match(text, /\/MediaBox \[0 0 841\.89 595\.28\]/)
  assert.match(text, /\/Width 2470 \/Height 1747 .*\/Filter \/DCTDecode \/Length 5000/)
  assert.ok(text.includes('/Title (SWK-AS26-0042 \\(Ama\\) \\\\ test)'), 'brackets and backslashes are escaped')

  // The image bytes sit in the file exactly as given.
  const start = text.indexOf('/Length 5000 >>\nstream\n') + '/Length 5000 >>\nstream\n'.length
  assert.deepEqual([...pdf.slice(start, start + 5000)], [...jpeg])

  // Every xref offset lands on "<n> 0 obj", and startxref lands on "xref".
  const xrefAt = Number(text.match(/startxref\n(\d+)\n/)[1])
  assert.equal(text.slice(xrefAt, xrefAt + 4), 'xref')
  const offsets = [...text.slice(xrefAt).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]))
  assert.equal(offsets.length, 6)
  offsets.forEach((offset, i) => assert.equal(text.slice(offset, offset + `${i + 1} 0 obj`.length), `${i + 1} 0 obj`))
})

test('a title with other alphabets cannot break the file', () => {
  const pdf = latin1(pdfFromJpeg(new Uint8Array(10), 1, 1, 'Ɛsi Ɔwusu ✓'))
  assert.ok(pdf.includes('/Title (?si ?wusu ?)'))
})
