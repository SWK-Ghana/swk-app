import React, { useEffect, useState } from 'react'
import { getRegistrations } from '../../utils/adminApi'
import { BarList, DayChart, Loading, Notice, PageTitle, Panel } from './ui'
import { weekChange } from './helpers'

const DAY_MS = 24 * 60 * 60 * 1000
const CHART_DAYS = 30

const QUESTIONS = {
  gender: 'Gender',
  age: 'Age',
  ageGroup: 'Age',
  location: 'Where they live',
  country: 'Country',
  status: 'Work or study',
  education: 'Education',
  interest: 'Main interest',
  heard: 'How they heard about us',
  area: 'Volunteer area',
  availableNov7: 'Available on 7 November',
  briefing: 'Can attend the briefing',
  partyType: 'Who is applying',
  orgType: 'Type of organisation',
  howSupport: 'How they want to help',
  finLevel: 'Financial support level',
}

const WAITING = {
  'not-connected': 'Not connected yet. Add REGISTRATION_STATS_KEY in Vercel to connect the forms.',
  'needs-update': 'Not connected yet. Publish the new version of this form\'s script.',
  refused: 'The key in this form\'s script does not match the one in Vercel.',
  unreachable: 'This form did not answer. Try again in a moment.',
}

const lastDays = (daily = {}) => {
  const days = []
  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const day = new Date(Date.now() - i * DAY_MS).toISOString().slice(0, 10)
    days.push({ day, count: daily[day] || 0 })
  }
  return days
}

const Form = ({ form }) => {
  if (form.state !== 'ok') {
    return (
      <Panel>
        <h2 className="mb-3 text-lg font-bold text-[#0C2E11]">{form.name}</h2>
        <Notice tone="warn">{WAITING[form.state]}</Notice>
      </Panel>
    )
  }
  return (
    <Panel>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-[#0C2E11]">{form.name}</h2>
        <p className="text-3xl font-bold text-[#0C2E11]">{form.total}</p>
      </div>
      <p className="mb-5 text-sm text-gray-600">
        {form.last7} in the last 7 days, {weekChange(form.last7, form.previous7)}.
        {form.duplicates > 0 && ` ${form.duplicates} of the total are repeat entries from the same email.`}
      </p>
      <DayChart days={lastDays(form.daily)} unit="registered" label={`${form.name}, registrations per day`} />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(form.groups).map(([question, rows]) => (
          <BarList key={question} title={QUESTIONS[question] || question} rows={rows} />
        ))}
      </div>
    </Panel>
  )
}

const Registrations = () => {
  const [forms, setForms] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getRegistrations().then(setForms).catch((err) => setError(err.message))
  }, [])

  if (error) return <Notice>{error}</Notice>
  if (!forms) return <Loading label="Asking the forms for their totals…" />

  return (
    <div className="max-w-5xl">
      <PageTitle
        title="Registrations"
        subtitle="Live totals from each form. Groups smaller than 3 people are shown as Other, and no names or contact details come here."
      />
      <div className="space-y-5">
        {forms.map((form) => <Form key={form.id} form={form} />)}
      </div>
    </div>
  )
}

export default Registrations
