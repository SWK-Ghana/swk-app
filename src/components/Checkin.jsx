import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LuCheck, LuCloudOff, LuCloudUpload, LuSearch, LuUserPlus } from 'react-icons/lu'
import Seo from './Seo'
import { FlowStrip } from './Patterns'
import {
  SESSION_EXPIRED_EVENT, checkInAttendee, clearSession, doorLogin, getSummitEvent, listAttendees, registerWalkIn, restoreSession, undoCheckIn,
} from '../utils/adminApi'
import WalkInForm from './admin/WalkInForm'
import { Field, Notice, buttonClass, inputClass, quietButtonClass } from './admin/ui'
import { applyQueue, doorStore, matches, timeOf } from './admin/summitShared'

const MAX_RESULTS = 40
const REFRESH_MS = 30000
const RETRY_MS = 15000

const tempId = () => `tmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const Gate = ({ onSignedIn, message }) => {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await doorLogin(code.trim())
      onSignedIn()
    } catch (err) {
      setError(err.status ? err.message : 'No connection. Check the internet and try again.')
      setBusy(false)
    }
  }
  return (
    <main className="swk-weave flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <FlowStrip />
        <form onSubmit={submit} className="space-y-4 p-7">
          <img src="/brand/swk-logo.svg" alt="SWK Ghana" className="mx-auto h-16 w-auto" />
          <h1 className="text-center text-xl font-bold text-[#0C2E11]">Summit check-in</h1>
          <p className="text-center text-sm text-gray-600">Enter the door code from the organiser to start.</p>
          {message && <Notice tone="warn">{message}</Notice>}
          <Field label="Door code">
            <input required autoFocus autoComplete="off" autoCapitalize="off" value={code} onChange={(e) => setCode(e.target.value)} className={`${inputClass} py-3 text-lg`} />
          </Field>
          {error && <Notice>{error}</Notice>}
          <button type="submit" disabled={busy} className={`${buttonClass} w-full py-3.5 text-base`}>{busy ? 'Checking…' : 'Start'}</button>
        </form>
      </div>
    </main>
  )
}

const Person = ({ person, onCheckIn, onUndo }) => (
  <li className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${person.checkedInAt ? 'border-[#D4F0A0] bg-[#F2FAE8]' : 'border-gray-200 bg-white'}`}>
    <div className="min-w-0 flex-1">
      <p className="text-lg font-bold leading-tight text-[#0C2E11]">{person.name}</p>
      <p className="text-sm text-gray-600">
        {[person.location, person.phoneEnd && `phone ends ${person.phoneEnd}`, person.source === 'walk-in' && 'registered at the entrance'].filter(Boolean).join(' · ')}
      </p>
      {person.needs && <p className="mt-1 inline-block rounded-md bg-amber-100 px-2 py-0.5 text-sm font-medium text-amber-900">Needs: {person.needs}</p>}
    </div>
    {person.checkedInAt ? (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#17702D]"><LuCheck aria-hidden="true" /> In at {timeOf(person.checkedInAt)}{person.pending ? ' (saving)' : ''}</span>
        <button onClick={() => onUndo(person)} className="text-sm text-gray-600 underline">Undo</button>
      </div>
    ) : (
      <button onClick={() => onCheckIn(person)} className={`${buttonClass} px-6 py-3 text-base`}>Check in</button>
    )}
  </li>
)

const Door = ({ onSignedOut }) => {
  const [server, setServer] = useState(() => doorStore.read('list', { attendees: [], fetchedAt: null }))
  const [queue, setQueue] = useState(() => doorStore.read('queue', []))
  const [event, setEvent] = useState(null)
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  const [reachable, setReachable] = useState(true)
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const flushing = useRef(false)
  const queueRef = useRef(queue)
  queueRef.current = queue

  const saveQueue = useCallback((next) => { queueRef.current = next; setQueue(next); doorStore.write('queue', next) }, [])

  const refresh = useCallback(async () => {
    try {
      const [list, ev] = await Promise.all([listAttendees(), getSummitEvent()])
      const next = { attendees: list.attendees, fetchedAt: list.fetchedAt }
      setServer(next)
      doorStore.write('list', next)
      setEvent(ev.event)
      setReachable(true)
    } catch (err) {
      if (!err.status) setReachable(false)
    }
  }, [])

  // Sends the waiting actions one at a time, oldest first, and stops at the first failure.
  const flush = useCallback(async () => {
    if (flushing.current) return
    flushing.current = true
    try {
      while (queueRef.current.length) {
        const op = queueRef.current[0]
        try {
          if (op.kind === 'checkin') await checkInAttendee(op.id, op.at)
          else if (op.kind === 'undo') await undoCheckIn(op.id)
          else if (op.kind === 'walkin') {
            const result = await registerWalkIn(op.attendee, op.at)
            if (result.existing) setNotice(`${op.attendee.name} was already registered as ${result.attendee.name}, now checked in.`)
          }
          saveQueue(queueRef.current.slice(1))
          setReachable(true)
        } catch (err) {
          if (!err.status) { setReachable(false); break } // no connection: keep it and try later
          if (err.status === 401) break // the door code changed: the gate takes over, the queue waits
          saveQueue(queueRef.current.slice(1)) // the server refused this one for good
          setError(`One action could not be saved: ${err.message}`)
        }
      }
    } finally {
      flushing.current = false
    }
    if (!queueRef.current.length) refresh()
  }, [refresh, saveQueue])

  useEffect(() => {
    refresh().then(flush)
    const up = () => { setOnline(true); flush() }
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    const retry = setInterval(() => { if (queueRef.current.length) flush(); else refresh() }, queueRef.current.length ? RETRY_MS : REFRESH_MS)
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); clearInterval(retry) }
  }, [refresh, flush])

  const people = useMemo(() => applyQueue(server.attendees, queue), [server, queue])
  const checkedIn = people.filter((p) => p.checkedInAt).length
  const walkIns = people.filter((p) => p.source === 'walk-in').length
  const shown = useMemo(() => {
    const term = search.trim()
    if (!term) return people.filter((p) => p.checkedInAt).sort((a, b) => String(b.checkedInAt).localeCompare(String(a.checkedInAt))).slice(0, 8)
    return people.filter((p) => matches(p, term)).slice(0, MAX_RESULTS)
  }, [people, search])

  const act = (op) => { setError(''); saveQueue([...queueRef.current, op]); flush() }
  const checkIn = (person) => { act({ kind: 'checkin', id: person.id, at: new Date().toISOString() }); setSearch('') }
  const undo = (person) => {
    if (person.pending && String(person.id).startsWith('tmp-')) { saveQueue(queueRef.current.filter((op) => op.tempId !== person.id)); return }
    if (person.pending) { saveQueue(queueRef.current.filter((op) => op.id !== person.id)); return }
    act({ kind: 'undo', id: person.id })
  }
  const walkIn = async (fields) => {
    act({ kind: 'walkin', tempId: tempId(), attendee: fields, at: new Date().toISOString() })
    setAdding(false)
    setSearch('')
    setNotice(`${fields.name} is registered and checked in.`)
  }

  const waiting = queue.length
  const status = !online || !reachable
    ? { icon: LuCloudOff, text: waiting ? `Offline · ${waiting} waiting to save` : 'Offline · working from the saved list', tone: 'text-amber-800 bg-amber-50 border-amber-200' }
    : waiting
      ? { icon: LuCloudUpload, text: `Saving ${waiting}…`, tone: 'text-[#17702D] bg-[#F2FAE8] border-[#D4F0A0]' }
      : { icon: LuCheck, text: 'All saved', tone: 'text-[#17702D] bg-[#F2FAE8] border-[#D4F0A0]' }

  return (
    <div className="min-h-screen bg-[#F7FAF2]">
      <header className="bg-[#0C2E11] text-white">
        <FlowStrip />
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">SWK Ghana · check-in</p>
            <p className="text-lg font-bold leading-tight text-white">{event?.name || 'Agribusiness Summit 2026'}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold leading-none text-[#A8E04A]">{checkedIn}<span className="text-base font-medium text-white/70"> of {people.length}</span></p>
            <p className="text-xs text-white/70">checked in · {walkIns} at the entrance</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${status.tone}`} role="status">
          <status.icon className="h-4 w-4" aria-hidden="true" /> {status.text}
        </div>
        {notice && <div className="mb-3"><Notice tone="ok">{notice}</Notice></div>}
        {error && <div className="mb-3"><Notice>{error}</Notice></div>}
        {!server.fetchedAt && !people.length && (
          <div className="mb-3"><Notice tone="warn">The list has not loaded yet. Check the internet connection.</Notice></div>
        )}

        {adding ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-bold text-[#0C2E11]">Register at the entrance</h2>
            <WalkInForm big onSubmit={walkIn} onCancel={() => setAdding(false)} />
          </section>
        ) : (
          <>
            <label className="relative block">
              <span className="sr-only">Search by name or phone</span>
              <LuSearch className="absolute left-4 top-4 h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, or the last digits of the phone"
                autoFocus
                autoComplete="off"
                className={`${inputClass} py-3.5 pl-12 text-lg`}
              />
            </label>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-gray-600">
                {search.trim()
                  ? `${shown.length === MAX_RESULTS ? `First ${MAX_RESULTS}` : shown.length} found`
                  : shown.length ? 'Latest check-ins' : 'Type a name to find someone'}
              </p>
              <button onClick={() => { setAdding(true); setNotice('') }} className={quietButtonClass}><LuUserPlus aria-hidden="true" /> Not on the list? Register</button>
            </div>
            <ul className="mt-3 space-y-2">
              {shown.map((p) => <Person key={p.id} person={p} onCheckIn={checkIn} onUndo={undo} />)}
            </ul>
            {search.trim() && shown.length === 0 && (
              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5 text-center">
                <p className="text-gray-700">Nobody matches “{search.trim()}”. Try another part of the name, or the phone number.</p>
                <button onClick={() => setAdding(true)} className={`${buttonClass} mt-3`}><LuUserPlus aria-hidden="true" /> Register them now</button>
              </div>
            )}
          </>
        )}
        <p className="mt-8 text-center text-xs text-gray-500">
          {server.fetchedAt ? `List updated ${timeOf(server.fetchedAt)}.` : ''}{' '}
          <button onClick={onSignedOut} className="underline">Sign out of the door</button>
        </p>
      </main>
    </div>
  )
}

const Checkin = () => {
  const [signedIn, setSignedIn] = useState(() => {
    const token = doorStore.read('token')
    if (token) restoreSession(token)
    return !!token
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const expired = () => { setSignedIn(false); setMessage('The door code has changed. Enter the new one; nothing waiting to save is lost.') }
    window.addEventListener(SESSION_EXPIRED_EVENT, expired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, expired)
  }, [])

  const signedInNow = () => {
    try { doorStore.write('token', sessionStorage.getItem('swk-admin-session')) } catch { /* storage unavailable */ }
    setMessage('')
    setSignedIn(true)
  }
  const signOut = () => {
    if (doorStore.read('queue', []).length && !window.confirm('Some check-ins are still waiting to save. Sign out anyway?')) return
    doorStore.remove('token')
    clearSession()
    setSignedIn(false)
  }

  return (
    <>
      <Seo title="Summit check-in | SWK Ghana" description="Door check-in for SWK Ghana events." path="/checkin" noindex />
      {signedIn ? <Door onSignedOut={signOut} /> : <Gate onSignedIn={signedInNow} message={message} />}
    </>
  )
}

export default Checkin
