// A small CSV reader: quoted fields may hold commas, quotes and line breaks.
export const parseCsv = (text) => {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const src = String(text || '').replace(/^\uFEFF/, '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') {
      quoted = true
    } else if (c === ',') {
      row.push(cell)
      cell = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += c
    }
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.some((v) => String(v).trim()))
}

export const toCsv = (rows) =>
  rows.map((row) => row.map((v) => {
    const s = String(v ?? '')
    // A leading ' stops a spreadsheet running a cell such as =SUM(...) as a formula.
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s
    return `"${safe.replace(/"/g, '""')}"`
  }).join(',')).join('\r\n')
