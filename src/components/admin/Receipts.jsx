import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LuDownload, LuPrinter, LuSearch } from 'react-icons/lu'
import {
  cancelReceipt, getSignature, issueReceipt, listReceipts, recordReceipt, setSignature, updateReceipt,
} from '../../utils/adminApi'
import { Field, Loading, Notice, PageTitle, Panel, buttonClass, inputClass, quietButtonClass } from './ui'
import { longDate, money, printReceipt, receiptFileName, receiptHtml } from './receiptTemplate'

const METHODS = ['MTN Mobile Money', 'Telecel Cash', 'AT Money', 'Bank transfer', 'Card payment', 'Cash', 'Not stated']
const PURPOSES = ['Agribusiness Summit 2026 · Sponsor a Seat', 'General donation to SWK Ghana', 'Agribusiness Webinar Series']
const today = () => new Date().toISOString().slice(0, 10)

const EMPTY = { name: '', amount: '', date: today(), method: METHODS[0], txn: '', purpose: PURPOSES[0], note: '' }

const toCsv = (receipts) => {
  const columns = ['no', 'issued', 'status', 'name', 'amount', 'date', 'method', 'txn', 'purpose', 'note', 'issuedBy', 'cancelReason']
  const rows = [columns, ...receipts.map((r) => columns.map((c) => r[c] ?? ''))]
  // A leading ' stops a spreadsheet running a donor name such as =SUM(...) as a formula.
  const cell = (v) => `"${String(v).replace(/^[=+\-@]/, "'$&").replace(/"/g, '""')}"`
  return rows.map((row) => row.map(cell).join(',')).join('\r\n')
}

const Receipts = ({ user }) => {
  const [receipts, setReceipts] = useState(null)
  const [signature, setSignatureData] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null) // the receipt being reopened
  const [earlier, setEarlier] = useState({ on: false, no: '', issued: today() })
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const fileInput = useRef(null)
  const isOwner = user.role === 'owner'

  const load = useCallback(async () => {
    const [list, sig] = await Promise.all([listReceipts(), getSignature()])
    setReceipts(list)
    setSignatureData(sig)
  }, [])

  useEffect(() => { load().catch((err) => setError(err.message)) }, [load])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const startNew = () => {
    setForm({ ...EMPTY, date: today() })
    setEditing(null)
    setEarlier({ on: false, no: '', issued: today() })
    setError('')
  }

  const open = (r) => {
    setEditing(r)
    setForm({ name: r.name, amount: r.amount, date: r.date || '', method: r.method, txn: r.txn || '', purpose: r.purpose, note: r.note || '' })
    setEarlier({ on: false, no: '', issued: today() })
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const preview = useMemo(() => ({
    ...form,
    no: editing?.no || (earlier.on ? earlier.no : ''),
    issued: editing?.issued || (earlier.on ? earlier.issued : today()),
    status: editing?.status || 'issued',
  }), [form, editing, earlier])

  const previewHtml = useMemo(
    () => receiptHtml(preview, { signature, origin: window.location.origin }),
    [preview, signature],
  )

  // Prints only after the server has saved it and given it a number.
  const saveAndPrint = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      let saved
      if (editing) saved = await updateReceipt(editing.no, form)
      else if (earlier.on) saved = await recordReceipt(earlier.no.trim(), earlier.issued, form)
      else saved = await issueReceipt(form)
      await load()
      setEditing(saved)
      setEarlier({ on: false, no: '', issued: today() })
      setNotice(`Receipt ${saved.no} saved. In the print window choose Save as PDF, paper size A5, margins None.`)
      await printReceipt(receiptHtml(saved, { signature, origin: window.location.origin }), receiptFileName(saved))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  // The saved record, never the form: unsaved edits must not print under a real number.
  const reprint = () =>
    printReceipt(receiptHtml(editing, { signature, origin: window.location.origin }), receiptFileName(editing))
      .catch((err) => setError(err.message))

  const cancel = async () => {
    const reason = window.prompt(`Why is ${editing.no} being cancelled? It stays on the list, marked cancelled.`)
    if (reason === null) return
    setError('')
    try {
      await cancelReceipt(editing.no, reason)
      await load()
      startNew()
      setNotice(`Receipt ${editing.no} cancelled.`)
    } catch (err) {
      setError(err.message)
    }
  }

  const uploadSignature = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      setError('')
      try {
        await setSignature(reader.result)
        setSignatureData(reader.result)
        setNotice('Signature saved. New receipts will carry it.')
      } catch (err) {
        setError(err.message)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const exportCsv = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿', toCsv(receipts)], { type: 'text/csv' }))
    a.download = `swk-donations-${today()}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (receipts || []).filter((r) => !term || `${r.no} ${r.name} ${r.txn}`.toLowerCase().includes(term))
  }, [receipts, search])

  if (error && !receipts) return <Notice>{error}</Notice>
  if (!receipts) return <Loading />

  const cancelled = editing?.status === 'cancelled'
  const liveTotal = receipts.filter((r) => r.status !== 'cancelled').reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="max-w-6xl">
      <PageTitle title="Donations and receipts" subtitle="Type the donor's name and amount. The number, words and dates fill in by themselves." />

      <div className="mb-5 space-y-3">
        {error && <Notice>{error}</Notice>}
        {notice && <Notice tone="ok">{notice}</Notice>}
        {!signature && (
          <Notice tone="warn">
            No signature yet, so receipts print unsigned.{isOwner ? ' Upload it below.' : ' Ask the Owner to upload it.'}
          </Notice>
        )}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_auto]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#0C2E11]">{editing ? `Receipt ${editing.no}` : 'New receipt'}</h2>
            {editing && <button onClick={startNew} className={quietButtonClass}>New receipt</button>}
          </div>
          {cancelled && <div className="mb-4"><Notice tone="warn">Cancelled: {editing.cancelReason}</Notice></div>}
          <form onSubmit={saveAndPrint} className="space-y-4">
            <Field label="Donor name">
              <input required maxLength={120} value={form.name} onChange={set('name')} disabled={cancelled} className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Amount (GHS)">
                <input type="number" required min="0.01" step="0.01" value={form.amount} onChange={set('amount')} disabled={cancelled} className={inputClass} />
              </Field>
              <Field label="Payment date">
                <input type="date" value={form.date} onChange={set('date')} disabled={cancelled} className={inputClass} />
              </Field>
            </div>
            <Field label="Payment method">
              <select value={form.method} onChange={set('method')} disabled={cancelled} className={inputClass}>
                {METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Transaction ID (optional)">
              <input maxLength={60} value={form.txn} onChange={set('txn')} disabled={cancelled} className={inputClass} />
            </Field>
            <Field label="Purpose">
              <select value={form.purpose} onChange={set('purpose')} disabled={cancelled} className={inputClass}>
                {[...new Set([...PURPOSES, form.purpose])].map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Note on the receipt (optional)">
              <input maxLength={160} value={form.note} onChange={set('note')} disabled={cancelled} className={inputClass} />
            </Field>

            {isOwner && !editing && (
              <div className="rounded-lg bg-[#F7FAF2] p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={earlier.on} onChange={(e) => setEarlier({ ...earlier, on: e.target.checked })} />
                  This is an earlier receipt that already has a number
                </label>
                {earlier.on && (
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <Field label="Receipt number"><input required placeholder="SWK-2026-0002" value={earlier.no} onChange={(e) => setEarlier({ ...earlier, no: e.target.value })} className={inputClass} /></Field>
                    <Field label="Issue date"><input type="date" required value={earlier.issued} onChange={(e) => setEarlier({ ...earlier, issued: e.target.value })} className={inputClass} /></Field>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {!cancelled && (
                <button type="submit" disabled={busy} className={buttonClass}>
                  <LuPrinter aria-hidden="true" /> {busy ? 'Saving…' : editing ? 'Save changes and print' : 'Save and print'}
                </button>
              )}
              {editing && <button type="button" onClick={reprint} className={quietButtonClass}>Print again</button>}
              {editing && !cancelled && <button type="button" onClick={cancel} className={quietButtonClass}>Cancel receipt</button>}
            </div>
          </form>

          {isOwner && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700">Your signature</p>
              <p className="mb-2 text-sm text-gray-600">{signature ? 'Uploaded. Upload again to replace it.' : 'PNG or JPEG, ideally with a transparent background.'}</p>
              <input ref={fileInput} type="file" accept="image/png,image/jpeg" onChange={uploadSignature} className="hidden" />
              <button type="button" onClick={() => fileInput.current?.click()} className={quietButtonClass}>Upload signature</button>
            </div>
          )}
        </Panel>

        <div className="overflow-auto rounded-2xl border border-gray-200 bg-white">
          <iframe title="Receipt preview" srcDoc={previewHtml} style={{ width: '148mm', height: '210mm', border: 0, display: 'block' }} />
        </div>
      </div>

      <Panel className="mt-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-[#0C2E11]">All receipts</h2>
            <p className="text-sm text-gray-600">{receipts.length} on record · {money(liveTotal)} excluding cancelled</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="relative">
              <span className="sr-only">Search receipts</span>
              <LuSearch className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, number or ID" className={`${inputClass} pl-9`} />
            </label>
            <button onClick={exportCsv} disabled={!receipts.length} className={quietButtonClass}><LuDownload aria-hidden="true" /> Export</button>
          </div>
        </div>
        {shown.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">{receipts.length ? 'No receipts match that search.' : 'No receipts yet.'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-600">
                <tr>
                  <th scope="col" className="py-2 pr-3 font-medium">Number</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Donor</th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">Amount</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Issued</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Issued by</th>
                  <th scope="col" className="py-2 font-medium"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.no} className={`border-b border-gray-100 ${r.status === 'cancelled' ? 'text-gray-400' : 'text-gray-900'}`}>
                    <td className="py-2 pr-3 font-medium">{r.no}</td>
                    <td className="py-2 pr-3">{r.name}{r.status === 'cancelled' && <span className="ml-2 text-xs font-semibold text-red-700">Cancelled</span>}</td>
                    <td className={`py-2 pr-3 text-right tabular-nums ${r.status === 'cancelled' ? 'line-through' : ''}`}>{money(r.amount)}</td>
                    <td className="py-2 pr-3">{longDate(r.issued)}</td>
                    <td className="py-2 pr-3">{r.issuedBy}</td>
                    <td className="py-2 text-right"><button onClick={() => open(r)} className="font-semibold text-[#17702D] underline">Open</button></td>
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

export default Receipts
