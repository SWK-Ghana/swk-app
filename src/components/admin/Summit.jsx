import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LuDownload, LuKeyRound, LuPrinter, LuRefreshCw, LuSearch, LuUpload, LuUserPlus } from 'react-icons/lu'
import {
  checkInAttendee, getSummitEvent, getSummitReport, importRegistrations, listAttendees, registerWalkIn, setDoorCode, setSummitEvent, undoCheckIn, updateAttendee,
} from '../../utils/adminApi'
import { Field, Loading, Notice, PageTitle, Panel, Stat, buttonClass, inputClass, quietButtonClass } from './ui'
import WalkInForm from './WalkInForm'
import { downloadFile, matches, nameSort, timeOf, toCsv } from './summitShared'
import { longDate, printReceipt } from './receiptTemplate'
import { reportFileName, reportHtml } from './summitReport'

const REFRESH_MS = 30000
const FILTERS = [
  ['all', 'Everyone'],
  ['in', 'Checked in'],
  ['out', 'Not yet'],
  ['walk', 'At the entrance'],
  ['needs', 'With needs'],
]
const CSV_COLUMNS = ['name', 'phone', 'email', 'gender', 'age', 'location', 'education', 'status', 'study', 'inAgri', 'agriDetails', 'interest', 'why', 'gain', 'hasVenture', 'ventureDetails', 'needs', 'heard', 'consentContact', 'consentPhotos', 'consentNewsletter', 'source', 'registeredAt', 'submissions', 'checkedInAt', 'checkedInBy']

const randomCode = () => {
  const words = ['green', 'maize', 'cocoa', 'seed', 'yam', 'farm', 'leaf', 'root', 'rain', 'soil']
  const n = Math.floor(100 + Math.random() * 900)
  return `${words[Math.floor(Math.random() * words.length)]}-${words[Math.floor(Math.random() * words.length)]}-${n}`
}

const Detail = ({ label, value }) => (value ? <div><dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt><dd className="text-sm text-gray-800">{value}</dd></div> : null)

const Row = ({ person, canEdit, onCheckIn, onUndo, onSave }) => {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(null)
  const [error, setError] = useState('')
  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onSave(person.id, edit)
      setEdit(null)
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    <>
      <tr className="border-b border-gray-100">
        <td className="py-2 pr-3">
          <button onClick={() => setOpen(!open)} className="text-left font-medium text-gray-900 hover:underline">{person.name}</button>
          {person.needs && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-900">needs</span>}
        </td>
        <td className="py-2 pr-3 text-gray-700">{person.phone}</td>
        <td className="py-2 pr-3 text-gray-700">{person.location}</td>
        <td className="py-2 pr-3 text-gray-700">{person.source === 'walk-in' ? 'At the entrance' : `Online${person.submissions > 1 ? ` (${person.submissions} submissions)` : ''}`}</td>
        <td className="py-2 pr-3">
          {person.checkedInAt
            ? <span className="font-medium text-[#17702D]">{timeOf(person.checkedInAt)}<span className="text-xs text-gray-500"> by {person.checkedInBy}</span></span>
            : <span className="text-gray-400">–</span>}
        </td>
        <td className="py-2 text-right">
          {person.checkedInAt
            ? <button onClick={() => onUndo(person)} className="text-sm text-gray-600 underline">Undo</button>
            : <button onClick={() => onCheckIn(person)} className="text-sm font-semibold text-[#17702D] underline">Check in</button>}
        </td>
      </tr>
      {open && (
        <tr className="border-b border-gray-100 bg-[#F7FAF2]">
          <td colSpan={6} className="px-3 py-3">
            {edit ? (
              <form onSubmit={save} className="grid gap-3 sm:grid-cols-3">
                {['name', 'phone', 'email', 'location', 'needs'].map((key) => (
                  <Field key={key} label={key === 'needs' ? 'Dietary / accessibility needs' : key[0].toUpperCase() + key.slice(1)}>
                    <input value={edit[key] || ''} onChange={(e) => setEdit({ ...edit, [key]: e.target.value })} className={inputClass} />
                  </Field>
                ))}
                {error && <div className="sm:col-span-3"><Notice>{error}</Notice></div>}
                <div className="flex gap-2 sm:col-span-3">
                  <button type="submit" className={buttonClass}>Save</button>
                  <button type="button" onClick={() => setEdit(null)} className={quietButtonClass}>Cancel</button>
                </div>
              </form>
            ) : (
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-3">
                <Detail label="Email" value={person.email} />
                <Detail label="Gender" value={person.gender} />
                <Detail label="Age" value={person.age} />
                <Detail label="Education" value={person.education} />
                <Detail label="Status" value={person.status} />
                <Detail label="Studying" value={person.study} />
                <Detail label="In agribusiness" value={person.inAgri} />
                <Detail label="Agribusiness details" value={person.agriDetails} />
                <Detail label="Main interest" value={person.interest} />
                <Detail label="Hopes to gain" value={person.gain} />
                <Detail label="Has a venture" value={person.hasVenture} />
                <Detail label="Venture" value={person.ventureDetails} />
                <Detail label="Why attend" value={person.why} />
                <Detail label="Needs" value={person.needs} />
                <Detail label="Heard through" value={person.heard} />
                <Detail label="Consents" value={[person.consentContact === 'Yes' && 'future contact', person.consentPhotos === 'Yes' && 'photos and video', person.consentNewsletter === 'Yes' && 'newsletter'].filter(Boolean).join(', ') || 'none'} />
                <Detail label="Registered" value={`${longDate(String(person.registeredAt || '').slice(0, 10))}${person.registeredBy ? ` by ${person.registeredBy}` : ''}`} />
                {canEdit && <div className="sm:col-span-3"><button onClick={() => setEdit({ name: person.name, phone: person.phone, email: person.email, location: person.location, needs: person.needs })} className={quietButtonClass}>Correct details</button></div>}
              </dl>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

const OwnerTools = ({ event, onChanged }) => {
  const [code, setCode] = useState('')
  const [details, setDetails] = useState({ name: event.name, date: event.date, venue: event.venue })
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const file = useRef(null)

  const run = async (work, done) => {
    setBusy(true)
    setError('')
    setResult('')
    try {
      setResult(await work())
      if (done) onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const importFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    run(async () => {
      const r = await importRegistrations(await f.text())
      return `${r.rowsRead} rows read, ${r.repeatsRemoved} repeat${r.repeatsRemoved === 1 ? '' : 's'} removed, ${r.people} people found: ${r.added} added, ${r.alreadyThere} already on the list.`
    }, true)
  }
  const saveCode = (e) => {
    e.preventDefault()
    run(async () => { await setDoorCode(code.trim()); setCode(''); return 'Door code saved. Anyone already signed in at the door must enter the new one.' }, true)
  }
  const saveDetails = (e) => {
    e.preventDefault()
    run(async () => { await setSummitEvent(details); return 'Event details saved.' }, true)
  }

  return (
    <Panel className="mb-5">
      <h2 className="mb-1 font-bold text-[#0C2E11]">Set-up (Owner)</h2>
      <p className="mb-4 text-sm text-gray-600">Three things to do before the event: load the registrations, set the door code, and share the check-in link with the door team.</p>
      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <h3 className="mb-1 text-sm font-bold text-gray-800">1. Load the registrations</h3>
          <p className="mb-2 text-sm text-gray-600">In the Google Sheet choose File, Download, CSV, then upload that file here. Repeat submissions are removed, and loading it again only adds new people.</p>
          <input ref={file} type="file" accept=".csv,text/csv" onChange={importFile} className="hidden" />
          <button onClick={() => file.current?.click()} disabled={busy} className={quietButtonClass}><LuUpload aria-hidden="true" /> Upload the CSV</button>
        </div>
        <form onSubmit={saveCode}>
          <h3 className="mb-1 text-sm font-bold text-gray-800">2. Door code {event.hasCode ? <span className="font-normal text-[#17702D]">(set)</span> : <span className="font-normal text-amber-700">(not set yet)</span>}</h3>
          <p className="mb-2 text-sm text-gray-600">The door team enters this at <b className="font-semibold">swkghana.org/checkin</b>. Changing it signs everyone at the door out.</p>
          <div className="flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} minLength={4} maxLength={40} placeholder="e.g. maize-seed-482" autoComplete="off" className={inputClass} />
            <button type="button" onClick={() => setCode(randomCode())} className={quietButtonClass}>Suggest</button>
          </div>
          <button type="submit" disabled={busy || code.trim().length < 4} className={`${buttonClass} mt-2`}><LuKeyRound aria-hidden="true" /> Save code</button>
        </form>
        <form onSubmit={saveDetails} className="space-y-2">
          <h3 className="text-sm font-bold text-gray-800">3. Event details</h3>
          <Field label="Name"><input required value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className={inputClass} /></Field>
          <Field label="Date"><input type="date" required value={details.date} onChange={(e) => setDetails({ ...details, date: e.target.value })} className={inputClass} /></Field>
          <Field label="Venue"><input required value={details.venue} onChange={(e) => setDetails({ ...details, venue: e.target.value })} className={inputClass} /></Field>
          <button type="submit" disabled={busy} className={quietButtonClass}>Save details</button>
        </form>
      </div>
      {result && <div className="mt-4"><Notice tone="ok">{result}</Notice></div>}
      {error && <div className="mt-4"><Notice>{error}</Notice></div>}
    </Panel>
  )
}

const Summit = ({ user }) => {
  const [data, setData] = useState(null)
  const [people, setPeople] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [adding, setAdding] = useState(false)
  const [report, setReport] = useState(null)
  const [reportBusy, setReportBusy] = useState(false)
  const canEdit = ['owner', 'finance'].includes(user.role)

  const load = useCallback(async () => {
    try {
      const [ev, list] = await Promise.all([getSummitEvent(), listAttendees()])
      setData(ev)
      setPeople(list.attendees.sort(nameSort))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    load()
    const timer = setInterval(load, REFRESH_MS)
    return () => clearInterval(timer)
  }, [load])

  const act = async (work, message) => {
    setError('')
    try {
      await work()
      if (message) setNotice(message)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const shown = useMemo(() => people.filter((p) => {
    if (filter === 'in' && !p.checkedInAt) return false
    if (filter === 'out' && p.checkedInAt) return false
    if (filter === 'walk' && p.source !== 'walk-in') return false
    if (filter === 'needs' && !p.needs) return false
    return matches({ ...p, phoneEnd: p.phone }, search)
  }), [people, filter, search])

  const buildReport = async () => {
    setReportBusy(true)
    setError('')
    try {
      setReport(await getSummitReport())
    } catch (err) {
      setError(err.message)
    } finally {
      setReportBusy(false)
    }
  }
  const printReport = () => report && printReceipt(reportHtml(report, { origin: window.location.origin }), reportFileName(report)).catch((err) => setError(err.message))
  const exportCsv = () => downloadFile(`swk-summit-attendees-${new Date().toISOString().slice(0, 10)}.csv`, toCsv([CSV_COLUMNS, ...people.map((p) => CSV_COLUMNS.map((c) => p[c] ?? ''))]))

  if (error && !data) return <Notice>{error}</Notice>
  if (!data) return <Loading />

  const { counts, event } = data
  const rate = counts.online ? Math.round((people.filter((p) => p.source !== 'walk-in' && p.checkedInAt).length / counts.online) * 100) : 0

  return (
    <div className="max-w-6xl">
      <PageTitle title={event.name} subtitle={`${longDate(event.date)} · ${event.venue}. Check people in here or at swkghana.org/checkin.`}>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} className={quietButtonClass}><LuRefreshCw aria-hidden="true" /> Refresh</button>
          <button onClick={exportCsv} disabled={!people.length} className={quietButtonClass}><LuDownload aria-hidden="true" /> Download CSV</button>
        </div>
      </PageTitle>

      {error && <div className="mb-4"><Notice>{error}</Notice></div>}
      {notice && <div className="mb-4"><Notice tone="ok">{notice}</Notice></div>}
      {!event.hasCode && user.role === 'owner' && <div className="mb-4"><Notice tone="warn">The door code is not set yet, so the door team cannot sign in. Set it below.</Notice></div>}
      {!people.length && <div className="mb-4"><Notice tone="warn">No registrations loaded yet.{user.role === 'owner' ? ' Upload the sheet below.' : ' Ask the Owner to upload the sheet.'}</Notice></div>}

      <div className="mb-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Checked in" value={counts.checkedIn} detail={`${rate}% of online registrants so far`} />
        <Stat label="Registered online" value={counts.online} />
        <Stat label="Registered at the entrance" value={counts.walkIns} />
        <Stat label="Not arrived yet" value={counts.online - people.filter((p) => p.source !== 'walk-in' && p.checkedInAt).length} detail="Online registrants" />
      </div>

      {user.role === 'owner' && <OwnerTools event={event} onChanged={load} />}

      <Panel className="mb-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-[#0C2E11]">Attendees</h2>
          <div className="flex flex-wrap gap-2">
            <label className="relative">
              <span className="sr-only">Search attendees</span>
              <LuSearch className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, phone or town" className={`${inputClass} pl-9`} />
            </label>
            <button onClick={() => setAdding(!adding)} className={quietButtonClass}><LuUserPlus aria-hidden="true" /> Register someone</button>
          </div>
        </div>
        {adding && (
          <div className="mb-4 rounded-xl bg-[#F7FAF2] p-4">
            <WalkInForm
              onSubmit={async (fields) => {
                const r = await registerWalkIn(fields)
                setAdding(false)
                setNotice(r.existing ? `${fields.name} was already registered as ${r.attendee.name}, now checked in.` : `${fields.name} is registered and checked in.`)
                await load()
              }}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}
        <div className="mb-3 flex flex-wrap gap-2">
          {FILTERS.map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} className={`rounded-full border px-3 py-1 text-sm font-medium ${filter === id ? 'border-[#0C2E11] bg-[#0C2E11] text-white' : 'border-gray-300 bg-white text-gray-700'}`}>{label}</button>
          ))}
          <span className="self-center text-sm text-gray-500">{shown.length} shown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-600">
              <tr>
                <th scope="col" className="py-2 pr-3 font-medium">Name</th>
                <th scope="col" className="py-2 pr-3 font-medium">Phone</th>
                <th scope="col" className="py-2 pr-3 font-medium">Region / city</th>
                <th scope="col" className="py-2 pr-3 font-medium">Registered</th>
                <th scope="col" className="py-2 pr-3 font-medium">Checked in</th>
                <th scope="col" className="py-2"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <Row
                  key={p.id}
                  person={p}
                  canEdit={canEdit}
                  onCheckIn={(person) => act(() => checkInAttendee(person.id))}
                  onUndo={(person) => act(() => undoCheckIn(person.id))}
                  onSave={(id, fields) => act(() => updateAttendee(id, fields), 'Details saved.')}
                />
              ))}
            </tbody>
          </table>
          {!shown.length && <p className="py-6 text-center text-sm text-gray-500">Nobody matches.</p>}
        </div>
      </Panel>

      <Panel>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-[#0C2E11]">Attendance report</h2>
            <p className="text-sm text-gray-600">Who came, when they arrived, and how they compare with everyone who registered.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={buildReport} disabled={reportBusy} className={quietButtonClass}><LuRefreshCw aria-hidden="true" /> {report ? 'Update report' : 'Generate report'}</button>
            {report && <button onClick={printReport} className={buttonClass}><LuPrinter aria-hidden="true" /> Print or save as PDF</button>}
          </div>
        </div>
        {report && (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <iframe title="Attendance report" srcDoc={reportHtml(report, { origin: window.location.origin })} className="h-[80vh] w-full border-0 bg-white" />
          </div>
        )}
      </Panel>
    </div>
  )
}

export default Summit
