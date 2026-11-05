import React, { useState } from 'react'
import { Field, Notice, buttonClass, inputClass, quietButtonClass } from './ui'
import { EDUCATION, EMPTY_WALK_IN, GENDERS, HEARD, INTERESTS, STATUSES } from './summitShared'

const Choice = ({ label, value, onChange, options, big }) => (
  <Field label={label}>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} ${big ? 'py-3 text-base' : ''}`}>
      <option value="">Choose…</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </Field>
)

/**
 * Registers someone at the entrance. `onSubmit(fields)` saves; it may throw
 * with a message to show. `big` makes the controls finger-sized for the door.
 */
const WalkInForm = ({ onSubmit, onCancel, big = false }) => {
  const [form, setForm] = useState(EMPTY_WALK_IN)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))
  const text = (key, props = {}) => (
    <input value={form[key]} onChange={(e) => set(key)(e.target.value)} className={`${inputClass} ${big ? 'py-3 text-base' : ''}`} {...props} />
  )

  const submit = async (e) => {
    e.preventDefault()
    if (!form.phone.trim() && !form.email.trim()) {
      setError('Enter a phone number or an email address, so we can find them again.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await onSubmit({ ...form, name: form.name.trim() })
      setForm(EMPTY_WALK_IN)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">{text('name', { required: true, maxLength: 120, autoFocus: true, autoComplete: 'off' })}</Field>
        <Field label="Phone number">{text('phone', { type: 'tel', inputMode: 'tel', maxLength: 30, autoComplete: 'off' })}</Field>
        <Field label="Email (optional)">{text('email', { type: 'email', maxLength: 160, autoComplete: 'off' })}</Field>
        <Field label="Region / city">{text('location', { maxLength: 120, autoComplete: 'off', placeholder: 'e.g. Accra, Greater Accra' })}</Field>
        <Choice label="Gender" value={form.gender} onChange={set('gender')} options={GENDERS} big={big} />
        <Field label="Age">{text('age', { type: 'number', min: 10, max: 120, inputMode: 'numeric' })}</Field>
        <Choice label="Current status" value={form.status} onChange={set('status')} options={STATUSES} big={big} />
        <Choice label="Main interest" value={form.interest} onChange={set('interest')} options={INTERESTS} big={big} />
        <Choice label="Highest education" value={form.education || ''} onChange={set('education')} options={EDUCATION} big={big} />
        <Choice label="How they heard about the Summit" value={form.heard} onChange={set('heard')} options={HEARD} big={big} />
      </div>
      <Field label="Dietary or accessibility needs (optional)">{text('needs', { maxLength: 300, autoComplete: 'off' })}</Field>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.consentPhotos === 'Yes'} onChange={(e) => set('consentPhotos')(e.target.checked ? 'Yes' : 'No')} />
          Agrees to photos and video
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.consentContact === 'Yes'} onChange={(e) => set('consentContact')(e.target.checked ? 'Yes' : 'No')} />
          Happy to hear about future SWK programmes
        </label>
      </div>
      {error && <Notice>{error}</Notice>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={`${buttonClass} ${big ? 'px-6 py-3.5 text-base' : ''}`}>{busy ? 'Saving…' : 'Register and check in'}</button>
        {onCancel && <button type="button" onClick={onCancel} className={`${quietButtonClass} ${big ? 'px-6 py-3.5 text-base' : ''}`}>Cancel</button>}
      </div>
    </form>
  )
}

export default WalkInForm
