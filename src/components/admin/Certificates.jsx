import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LuAward, LuCopy, LuDownload, LuPrinter, LuSearch } from 'react-icons/lu'
import {
  getSignature, getSummitEvent, issueCertificate, issueCertificates, listAttendees, listCertificates, revokeCertificate, updateCertificate,
} from '../../utils/adminApi'
import { Field, Loading, Notice, PageTitle, Panel, buttonClass, inputClass, quietButtonClass } from './ui'
import { printReceipt } from './receiptTemplate'
import { ROLE_LABELS, certificateFileName, certificateHtml, fullDate, qrFor, verifyUrl } from './certificateTemplate'
import CertificatePreview from './CertificatePreview'
import { downloadFile, toCsv } from './summitShared'

const EMPTY = { name: '', role: 'participant', detail: '' }
const ROLE_HINTS = {
  participant: 'Anyone who attended. Issue these in bulk from the Summit list below.',
  volunteer: 'Detail line, for example: Registration desk, or Media team.',
  keynote: 'Detail line, for example their organisation.',
  panellist: 'Detail line, for example their organisation.',
  moderator: 'Detail line, for example their organisation.',
  spotlight: 'Detail line, for example their topic: Solar-Powered Irrigation.',
  panelspot: 'Detail line, for example their Spotlight topic.',
  goodwill: 'Detail line, for example their title and organisation.',
  solidarity: 'Detail line, for example who they spoke on behalf of.',
  performer: 'Detail line is optional.',
  workshop: 'Detail line, for example their organisation.',
  demonstration: 'Detail line, for example what they demonstrated.',
  judge: 'Detail line, for example their organisation.',
  partner: 'Use the organisation as the name, and a person or role as the detail.',
}

const Certificates = ({ user }) => {
  const [certs, setCerts] = useState(null)
  const [signature, setSignature] = useState(null)
  const [eventInfo, setEventInfo] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [qr, setQr] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [picked, setPicked] = useState(() => new Set())
  const [pickSearch, setPickSearch] = useState('')
  const [onlyCheckedIn, setOnlyCheckedIn] = useState(true)
  const isOwner = user.role === 'owner'
  const origin = window.location.origin

  const load = useCallback(async () => {
    const [list, sig, ev] = await Promise.all([listCertificates(), getSignature(), getSummitEvent()])
    setCerts(list)
    setSignature(sig)
    setEventInfo(ev.event)
    try { setAttendees((await listAttendees()).attendees) } catch { setAttendees([]) }
  }, [])

  useEffect(() => { load().catch((err) => setError(err.message)) }, [load])

  // The QR is drawn for the saved certificate only, since it encodes the real link.
  useEffect(() => {
    let live = true
    if (!editing) { setQr(null); return undefined }
    qrFor(verifyUrl(editing, origin)).then((dataUri) => { if (live) setQr(dataUri) })
    return () => { live = false }
  }, [editing, origin])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const startNew = () => { setForm(EMPTY); setEditing(null); setError(''); setNotice('') }
  const open = (c) => {
    setEditing(c)
    setForm({ name: c.name, role: c.role, detail: c.detail || '' })
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const preview = useMemo(() => ({
    ...(editing || { no: '', id: '', status: 'issued', event: eventInfo?.name, eventDate: eventInfo?.date, venue: eventInfo?.venue }),
    ...form,
  }), [editing, form, eventInfo])
  const previewHtml = useMemo(() => certificateHtml(preview, { signature, origin, qr }), [preview, signature, origin, qr])

  const run = async (work) => {
    setBusy(true)
    setError('')
    setNotice('')
    try { await work() } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  const save = (e) => {
    e.preventDefault()
    run(async () => {
      const saved = editing ? await updateCertificate(editing.no, form) : await issueCertificate(form)
      await load()
      setEditing(saved)
      setNotice(editing ? `Certificate ${saved.no} updated.` : `Certificate ${saved.no} issued for ${saved.name}. Copy the link to send it, or print it.`)
    })
  }

  const print = (c) => run(async () => {
    const code = await qrFor(verifyUrl(c, origin))
    await printReceipt(certificateHtml(c, { signature, origin, qr: code }), certificateFileName(c))
    setNotice('In the print window choose Save as PDF, paper size A4, landscape, margins None.')
  })

  const copyLink = (c) => run(async () => {
    await navigator.clipboard.writeText(verifyUrl(c, 'https://swkghana.org'))
    setNotice(`Link for ${c.name} copied. Anyone with it can view, download and print this certificate.`)
  })

  const revoke = () => {
    const reason = window.prompt(`Why is ${editing.no} being revoked? Its link will stop working and it stays on the list as revoked.`)
    if (reason === null) return
    run(async () => {
      await revokeCertificate(editing.no, reason)
      await load()
      startNew()
      setNotice(`Certificate ${editing.no} revoked.`)
    })
  }

  // Who on the Summit list already holds a participant certificate.
  const holders = useMemo(() => {
    const ids = new Set()
    const names = new Set()
    for (const c of certs || []) {
      if (c.status === 'revoked' || c.role !== 'participant') continue
      if (c.attendeeId) ids.add(c.attendeeId)
      names.add(c.name.toLowerCase())
    }
    return { ids, names }
  }, [certs])

  const candidates = useMemo(() => {
    const term = pickSearch.trim().toLowerCase()
    return attendees
      .filter((a) => !onlyCheckedIn || a.checkedInAt)
      .filter((a) => !holders.ids.has(a.id) && !holders.names.has((a.name || '').toLowerCase()))
      .filter((a) => !term || `${a.name} ${a.location || ''}`.toLowerCase().includes(term))
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [attendees, onlyCheckedIn, holders, pickSearch])

  const togglePick = (id) => setPicked((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  const pickAll = () => setPicked(new Set(candidates.map((a) => a.id)))
  const issuePicked = () => run(async () => {
    const items = attendees.filter((a) => picked.has(a.id)).map((a) => ({ name: a.name, role: 'participant', attendeeId: a.id }))
    const r = await issueCertificates(items)
    await load()
    setPicked(new Set())
    setNotice(`${r.issued.length} participant certificate${r.issued.length === 1 ? '' : 's'} issued${r.skipped ? `, ${r.skipped} already had one` : ''}. Use Export to get every link in one file.`)
  })

  const exportCsv = () => {
    const rows = [['Number', 'Name', 'Role', 'Detail', 'Link', 'Issued', 'Issued by', 'Status']]
    for (const c of certs) rows.push([c.no, c.name, ROLE_LABELS[c.role] || c.role, c.detail || '', verifyUrl(c, 'https://swkghana.org'), c.issued, c.issuedBy, c.status])
    downloadFile(`swk-certificates-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows), 'text/csv')
  }

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (certs || []).filter((c) => !term || `${c.no} ${c.name} ${ROLE_LABELS[c.role] || ''} ${c.detail || ''}`.toLowerCase().includes(term))
  }, [certs, search])

  if (error && !certs) return <Notice>{error}</Notice>
  if (!certs) return <Loading />

  const revoked = editing?.status === 'revoked'
  const checkedInCount = attendees.filter((a) => a.checkedInAt).length

  return (
    <div className="max-w-6xl">
      <PageTitle title="Certificates" subtitle="Type a name and choose a role, or issue participant certificates for everyone who checked in. Each certificate has a number and a link anyone can verify." />

      <div className="mb-5 space-y-3">
        {error && <Notice>{error}</Notice>}
        {notice && <Notice tone="ok">{notice}</Notice>}
        {!signature && <Notice tone="warn">No signature uploaded yet, so certificates show a blank signature line.{isOwner ? ' Upload it on Donations and receipts.' : ' Ask the Owner to upload it.'}</Notice>}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#0C2E11]">{editing ? `Certificate ${editing.no}` : 'New certificate'}</h2>
            {editing && <button onClick={startNew} className={quietButtonClass}>New certificate</button>}
          </div>
          {revoked && <div className="mb-4"><Notice tone="warn">Revoked: {editing.revokeReason}</Notice></div>}
          <form onSubmit={save} className="space-y-4">
            <Field label="Full name">
              <input required maxLength={120} value={form.name} onChange={set('name')} disabled={revoked} className={inputClass} placeholder="As it should appear on the certificate" />
            </Field>
            <Field label="Role" hint={ROLE_HINTS[form.role]}>
              <select value={form.role} onChange={set('role')} disabled={revoked} className={inputClass}>
                {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
            <Field label="Detail line (optional)">
              <input maxLength={140} value={form.detail} onChange={set('detail')} disabled={revoked} className={inputClass} placeholder="Organisation, team or session" />
            </Field>
            <div className="flex flex-wrap gap-2">
              {!revoked && (
                <button type="submit" disabled={busy} className={buttonClass}>
                  <LuAward aria-hidden="true" /> {busy ? 'Saving…' : editing ? 'Save changes' : 'Issue certificate'}
                </button>
              )}
              {editing && <button type="button" onClick={() => print(editing)} disabled={busy} className={quietButtonClass}><LuPrinter aria-hidden="true" /> Print or save as PDF</button>}
              {editing && !revoked && <button type="button" onClick={() => copyLink(editing)} disabled={busy} className={quietButtonClass}><LuCopy aria-hidden="true" /> Copy link</button>}
              {editing && !revoked && isOwner && <button type="button" onClick={revoke} disabled={busy} className={quietButtonClass}>Revoke</button>}
            </div>
            {editing && !revoked && (
              <p className="break-all text-xs text-gray-500">{verifyUrl(editing, 'https://swkghana.org')}</p>
            )}
          </form>
        </Panel>

        <div className="rounded-2xl border border-gray-200 bg-white p-2">
          <CertificatePreview html={previewHtml} />
        </div>
      </div>

      <Panel className="mt-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-[#0C2E11]">Participants from the Summit list</h2>
            <p className="text-sm text-gray-600">{checkedInCount} checked in · {candidates.length} without a certificate{onlyCheckedIn ? ' among those who checked in' : ''}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={onlyCheckedIn} onChange={(e) => setOnlyCheckedIn(e.target.checked)} /> Only people who checked in
            </label>
            <label className="relative">
              <span className="sr-only">Search attendees</span>
              <LuSearch className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
              <input value={pickSearch} onChange={(e) => setPickSearch(e.target.value)} placeholder="Name or town" className={`${inputClass} pl-9`} />
            </label>
          </div>
        </div>
        {candidates.length === 0 ? (
          <p className="py-4 text-sm text-gray-500">{attendees.length ? 'Everyone shown already has a participant certificate.' : 'The Summit list is empty.'}</p>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              <button onClick={pickAll} className={quietButtonClass}>Select all {candidates.length}</button>
              {picked.size > 0 && <button onClick={() => setPicked(new Set())} className={quietButtonClass}>Clear</button>}
              <button onClick={issuePicked} disabled={busy || picked.size === 0} className={buttonClass}>
                <LuAward aria-hidden="true" /> Issue {picked.size || ''} participant certificate{picked.size === 1 ? '' : 's'}
              </button>
            </div>
            <ul className="grid max-h-80 gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
              {candidates.map((a) => (
                <li key={a.id}>
                  <label className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm ${picked.has(a.id) ? 'border-[#78C31E] bg-[#F2FAE8]' : 'border-gray-200'}`}>
                    <input type="checkbox" checked={picked.has(a.id)} onChange={() => togglePick(a.id)} className="mt-0.5" />
                    <span><span className="font-medium text-gray-900">{a.name}</span>{a.location && <span className="block text-xs text-gray-500">{a.location}</span>}</span>
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      <Panel className="mt-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-[#0C2E11]">All certificates</h2>
            <p className="text-sm text-gray-600">{certs.length} issued</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="relative">
              <span className="sr-only">Search certificates</span>
              <LuSearch className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, number or role" className={`${inputClass} pl-9`} />
            </label>
            <button onClick={exportCsv} disabled={!certs.length} className={quietButtonClass}><LuDownload aria-hidden="true" /> Export with links</button>
          </div>
        </div>
        {shown.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">{certs.length ? 'No certificates match that search.' : 'No certificates yet.'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-600">
                <tr>
                  <th scope="col" className="py-2 pr-3 font-medium">Number</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Name</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Role</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Issued</th>
                  <th scope="col" className="py-2 pr-3 font-medium">By</th>
                  <th scope="col" className="py-2 font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((c) => (
                  <tr key={c.no} className={`border-b border-gray-100 ${c.status === 'revoked' ? 'text-gray-400' : 'text-gray-900'}`}>
                    <td className="py-2 pr-3 font-medium">{c.no}</td>
                    <td className="py-2 pr-3">{c.name}{c.detail && <span className="block text-xs text-gray-500">{c.detail}</span>}{c.status === 'revoked' && <span className="ml-2 text-xs font-semibold text-red-700">Revoked</span>}</td>
                    <td className="py-2 pr-3">{ROLE_LABELS[c.role] || c.role}</td>
                    <td className="py-2 pr-3">{fullDate(c.issued)}</td>
                    <td className="py-2 pr-3">{c.issuedBy}</td>
                    <td className="py-2 text-right whitespace-nowrap">
                      <button onClick={() => open(c)} className="font-semibold text-[#17702D] underline">Open</button>
                      {c.status !== 'revoked' && <button onClick={() => copyLink(c)} className="ml-3 font-semibold text-[#17702D] underline">Copy link</button>}
                      <button onClick={() => print(c)} className="ml-3 font-semibold text-[#17702D] underline">Print</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}

export default Certificates
