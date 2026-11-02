import React, { useCallback, useEffect, useState } from 'react'
import { createUser, listUsers, resetUserPassword, updateUser } from '../../utils/adminApi'
import { Field, Loading, Notice, PageTitle, Panel, buttonClass, inputClass, quietButtonClass } from './ui'

const ROLES = [
  { id: 'owner', name: 'Owner', detail: 'Everything, including staff and the signature' },
  { id: 'finance', name: 'Finance', detail: 'Issue receipts and see donations' },
  { id: 'content', name: 'Content', detail: 'Blog posts and marketplace' },
  { id: 'viewer', name: 'Viewer', detail: 'See the overview only' },
]

const EMPTY = { name: '', email: '', role: 'finance' }

const Team = ({ user }) => {
  const [users, setUsers] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [passwordFor, setPasswordFor] = useState(null) // { name, email, password }, shown once

  const load = useCallback(() => {
    listUsers().then(setUsers).catch((err) => setError(err.message))
  }, [])
  useEffect(() => { load() }, [load])

  const run = async (action) => {
    setError('')
    try {
      await action()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const add = (e) => {
    e.preventDefault()
    run(async () => {
      const { temporaryPassword } = await createUser(form)
      setPasswordFor({ name: form.name, email: form.email.trim().toLowerCase(), password: temporaryPassword })
      setForm(EMPTY)
    })
  }

  const reset = (person) => {
    if (!window.confirm(`Reset the password for ${person.name}? They will be signed out.`)) return
    run(async () => {
      const { temporaryPassword } = await resetUserPassword(person.id)
      setPasswordFor({ name: person.name, email: person.email, password: temporaryPassword })
    })
  }

  const toggleActive = (person) => {
    const verb = person.active ? 'Remove access for' : 'Restore access for'
    if (!window.confirm(`${verb} ${person.name}?`)) return
    run(() => updateUser(person.id, { active: !person.active }))
  }

  if (error && !users) return <Notice>{error}</Notice>
  if (!users) return <Loading />

  return (
    <div className="max-w-4xl">
      <PageTitle title="Team" subtitle="Who can use this dashboard, and what they can do." />
      {error && <div className="mb-4"><Notice>{error}</Notice></div>}

      {passwordFor && (
        <Panel tone="ok" className="mb-5">
          <h2 className="font-bold text-[#0C2E11]">Temporary password for {passwordFor.name}</h2>
          <p className="mt-1 text-sm text-gray-700">
            Give this to them privately. It won't be shown again, and they must replace it at first sign-in.
          </p>
          <p className="mt-3 select-all rounded-lg bg-white px-3 py-2 font-mono text-sm text-gray-900">{passwordFor.password}</p>
          <p className="mt-2 text-sm text-gray-700">They sign in at swkghana.org/admin with {passwordFor.email}.</p>
          <button onClick={() => setPasswordFor(null)} className={`${quietButtonClass} mt-3`}>Done</button>
        </Panel>
      )}

      <Panel className="mb-5">
        <h2 className="mb-3 font-bold text-[#0C2E11]">People</h2>
        <ul className="divide-y divide-gray-100">
          {users.map((person) => (
            <li key={person.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium text-gray-900">
                  {person.name}{person.id === user.id ? ' (you)' : ''}
                  {!person.active && <span className="ml-2 text-xs font-semibold text-red-700">No access</span>}
                </p>
                <p className="truncate text-sm text-gray-600">{person.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label={`Role for ${person.name}`}
                  value={person.role}
                  onChange={(e) => run(() => updateUser(person.id, { role: e.target.value }))}
                  className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
                >
                  {ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <button onClick={() => reset(person)} className={quietButtonClass}>Reset password</button>
                <button onClick={() => toggleActive(person)} className={quietButtonClass}>{person.active ? 'Remove access' : 'Restore access'}</button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <h2 className="mb-3 font-bold text-[#0C2E11]">Add someone</h2>
        <form onSubmit={add} className="grid gap-4 sm:grid-cols-3">
          <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></Field>
          <Field label="Email"><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></Field>
          <Field label="Role">
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <ul className="space-y-1 text-sm text-gray-600 sm:col-span-3">
            {ROLES.map((r) => <li key={r.id}><b className="font-medium text-gray-800">{r.name}:</b> {r.detail}</li>)}
          </ul>
          <div className="sm:col-span-3"><button type="submit" className={buttonClass}>Add to team</button></div>
        </form>
      </Panel>
    </div>
  )
}

export default Team
