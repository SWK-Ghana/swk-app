import React, { useEffect, useState } from 'react'
import { changePassword, getStatus, login, setupOwner } from '../../utils/adminApi'
import { Field, Loading, Notice, buttonClass, inputClass } from './ui'
import { FlowStrip } from '../Patterns'

const Card = ({ title, subtitle, children }) => (
  <main className="swk-weave flex min-h-screen items-center justify-center px-4 py-10">
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <FlowStrip />
      <div className="p-7">
        <img src="/brand/swk-logo.svg" alt="SWK Ghana" className="mx-auto mb-5 h-16 w-auto" />
        <h1 className="text-center text-xl font-bold text-[#0C2E11]">{title}</h1>
        <p className="mb-5 mt-1 text-center text-sm text-gray-600">{subtitle}</p>
        {children}
      </div>
    </div>
  </main>
)

const useSubmit = () => {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = (run) => async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await run()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }
  return { busy, error, submit }
}

const LoginForm = ({ onSignedIn, notice }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { busy, error, submit } = useSubmit()
  return (
    <Card title="SWK Ghana staff" subtitle="Sign in with your own account">
      <form onSubmit={submit(async () => onSignedIn(await login(email, password)))} className="space-y-4">
        {notice && <Notice tone="warn">{notice}</Notice>}
        <Field label="Email">
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Password">
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
        {error && <Notice>{error}</Notice>}
        <button type="submit" disabled={busy} className={`${buttonClass} w-full`}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </Card>
  )
}

const SetupForm = ({ onSignedIn }) => {
  const [form, setForm] = useState({ adminPassword: '', name: '', email: '', password: '' })
  const { busy, error, submit } = useSubmit()
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  return (
    <Card title="Create the Owner account" subtitle="This appears once. After this, the setup password stops working.">
      <form
        onSubmit={submit(async () => {
          await setupOwner(form)
          onSignedIn(await login(form.email, form.password))
        })}
        className="space-y-4"
      >
        <Field label="Setup password" hint="The ADMIN_PASSWORD you set in Vercel.">
          <input type="password" required autoComplete="off" value={form.adminPassword} onChange={set('adminPassword')} className={inputClass} />
        </Field>
        <Field label="Your name">
          <input required value={form.name} onChange={set('name')} className={inputClass} />
        </Field>
        <Field label="Your email">
          <input type="email" required autoComplete="username" value={form.email} onChange={set('email')} className={inputClass} />
        </Field>
        <Field label="Your new password" hint="At least 10 characters.">
          <input type="password" required minLength={10} autoComplete="new-password" value={form.password} onChange={set('password')} className={inputClass} />
        </Field>
        {error && <Notice>{error}</Notice>}
        <button type="submit" disabled={busy} className={`${buttonClass} w-full`}>{busy ? 'Creating…' : 'Create my account'}</button>
      </form>
    </Card>
  )
}

export const ChangePasswordForm = ({ user, onChanged }) => {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const { busy, error, submit } = useSubmit()
  return (
    <Card title="Set your own password" subtitle={`Welcome, ${user.name}. Replace your temporary password to continue.`}>
      <form onSubmit={submit(async () => onChanged(await changePassword(user.email, current, next)))} className="space-y-4">
        <Field label="Temporary password">
          <input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass} />
        </Field>
        <Field label="New password" hint="At least 10 characters.">
          <input type="password" required minLength={10} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={inputClass} />
        </Field>
        {error && <Notice>{error}</Notice>}
        <button type="submit" disabled={busy} className={`${buttonClass} w-full`}>{busy ? 'Saving…' : 'Save and continue'}</button>
      </form>
    </Card>
  )
}

const AdminLogin = ({ onSignedIn, notice }) => {
  const [needsSetup, setNeedsSetup] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getStatus().then((s) => setNeedsSetup(s.needsSetup)).catch((err) => setError(err.message))
  }, [])

  if (error) return <Card title="SWK Ghana staff" subtitle="The dashboard can't be reached right now."><Notice>{error}</Notice></Card>
  if (needsSetup === null) return <Card title="SWK Ghana staff" subtitle=""><Loading /></Card>
  return needsSetup ? <SetupForm onSignedIn={onSignedIn} /> : <LoginForm onSignedIn={onSignedIn} notice={notice} />
}

export default AdminLogin
