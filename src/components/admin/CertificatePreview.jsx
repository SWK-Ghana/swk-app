import React, { useEffect, useRef, useState } from 'react'

// A4 landscape at 96dpi. The sheet is rendered at full size inside a frame and
// scaled to whatever width it is given, so it reads the same on a phone, on
// the dashboard and on paper.
const SHEET_W = 1123
const SHEET_H = 794

/** Shows certificate HTML at its real proportions, shrunk to fit its container. */
const CertificatePreview = ({ html, title = 'Certificate preview', className = '' }) => {
  const box = useRef(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const el = box.current
    if (!el) return undefined
    const fit = () => setScale(Math.min(1, el.clientWidth / SHEET_W))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={box} className={`w-full overflow-hidden ${className}`} style={{ height: Math.round(SHEET_H * scale) }}>
      <iframe
        title={title}
        srcDoc={html}
        scrolling="no"
        style={{ width: SHEET_W, height: SHEET_H, border: 0, display: 'block', transform: `scale(${scale})`, transformOrigin: 'top left' }}
      />
    </div>
  )
}

export default CertificatePreview
