import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from './Seo'
import { getPublicCertificate } from '../utils/adminApi'
import { printReceipt } from './admin/receiptTemplate'
import { ROLE_LABELS, certificateFileName, certificateHtml, fullDate, qrFor, titleFor, verifyUrl } from './admin/certificateTemplate'
import CertificatePreview from './admin/CertificatePreview'

// The public face of a certificate: anyone with the full link can view it,
// download it as a PDF, and see that SWK Ghana issued it.
const Certificate = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading') // loading | ok | missing | error
  const [qr, setQr] = useState(null)
  const [notice, setNotice] = useState('')
  const origin = typeof window === 'undefined' ? 'https://swkghana.org' : window.location.origin

  useEffect(() => {
    let live = true
    setState('loading')
    getPublicCertificate(id)
      .then(async (res) => {
        if (!live) return
        setData(res)
        setQr(await qrFor(verifyUrl(res.certificate, origin)))
        setState('ok')
      })
      .catch((err) => { if (live) setState(err.status === 404 ? 'missing' : 'error') })
    return () => { live = false }
  }, [id, origin])

  const html = useMemo(
    () => (data ? certificateHtml(data.certificate, { signature: data.signature, origin, qr }) : ''),
    [data, origin, qr],
  )

  const download = () =>
    printReceipt(html, certificateFileName(data.certificate))
      .then(() => setNotice('In the print window choose Save as PDF, paper size A4, landscape, margins None.'))
      .catch(() => setNotice('Printing is not available in this browser. Try opening the link on a computer.'))

  const copy = () =>
    navigator.clipboard.writeText(verifyUrl(data.certificate, 'https://swkghana.org'))
      .then(() => setNotice('Link copied.'))
      .catch(() => setNotice('Copy the address from your browser bar to share this certificate.'))

  const c = data?.certificate
  const title = c ? `${titleFor(c.role)} · ${c.name}` : 'Certificate'

  return (
    <main className="min-h-screen swk-weave">
      <Seo title={`${title} – SWK Ghana`} description="A certificate issued by SWK Ghana for the Agribusiness Summit 2026." path={`/certificate/${id}`} noindex />
      <div className="swk-shell py-10 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17702D]">SWK Ghana · Certificate verification</p>

        {state === 'loading' && <p className="mt-6 text-gray-600">Looking up this certificate…</p>}

        {state === 'missing' && (
          <div className="mt-6 max-w-2xl">
            <h1 className="text-3xl font-bold text-[#0C2E11]">No certificate matches this link</h1>
            <p className="mt-3 text-gray-700">Check that the whole link was copied, including the letters after the number. If you received a certificate from SWK Ghana and the link still does not work, email <a className="font-semibold text-[#17702D] underline" href="mailto:info@swkghana.org">info@swkghana.org</a> with the number printed on it.</p>
            <Link to="/" className="mt-6 inline-block font-semibold text-[#17702D] underline">Back to swkghana.org</Link>
          </div>
        )}

        {state === 'error' && (
          <div className="mt-6 max-w-2xl">
            <h1 className="text-3xl font-bold text-[#0C2E11]">We could not load this certificate right now</h1>
            <p className="mt-3 text-gray-700">Please try again in a moment.</p>
          </div>
        )}

        {state === 'ok' && c && (
          <>
            <h1 className="mt-2 text-3xl font-bold text-[#0C2E11] sm:text-4xl">{titleFor(c.role)}</h1>
            <p className="mt-2 text-lg text-gray-700">
              Presented to <span className="font-bold text-[#0C2E11]">{c.name}</span> as {/^[aeiou]/i.test(ROLE_LABELS[c.role] || '') ? 'an' : 'a'} {(ROLE_LABELS[c.role] || c.role).toLowerCase()} at the {c.event}.
            </p>
            <p className="mt-1 text-sm text-gray-600">Certificate {c.no} · issued by SWK Ghana on {fullDate(c.issued)} · event held {fullDate(c.eventDate)}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={download} className="inline-flex items-center gap-2 rounded-lg bg-[#78C31E] px-5 py-3 text-sm font-bold text-[#0C2E11] hover:bg-[#8AD62B]">Download or print (PDF)</button>
              <button onClick={copy} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#17702D] hover:bg-[#F2FAE8]">Copy link</button>
            </div>
            {notice && <p role="status" className="mt-3 text-sm text-gray-700">{notice}</p>}

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
              <CertificatePreview html={html} title={`Certificate ${c.no}`} />
            </div>
            <p className="mt-4 text-xs text-gray-500">This page is the record of this certificate. A certificate whose link does not open here was not issued by SWK Ghana, or has been withdrawn.</p>
          </>
        )}
      </div>
    </main>
  )
}

export default Certificate
