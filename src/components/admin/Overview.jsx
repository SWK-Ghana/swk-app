import React, { useCallback, useEffect, useState } from 'react'
import { LuTriangleAlert } from 'react-icons/lu'
import { getOverview, getQuality, getRegistrations, getSummitEvent, getVisitors, setCampaign } from '../../utils/adminApi'
import { Field, Loading, Notice, PageTitle, Panel, Stat, buttonClass, inputClass, quietButtonClass } from './ui'
import { problemsIn, weekChange } from './helpers'
import { longDate, money } from './receiptTemplate'
import { Check } from './Quality'

const SHOWN_PROBLEMS = 5

const Meter = ({ label, value, max, text }) => {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap justify-between gap-2 text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{text}</span>
      </div>
      <div role="meter" aria-label={label} aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100} className="h-3 overflow-hidden rounded-full bg-[#EAF0E1]">
        <div className="h-full rounded-full bg-[#1E963C]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

const CampaignForm = ({ campaign, onSaved, onClose }) => {
  const [form, setForm] = useState({
    name: campaign.name, purpose: campaign.purpose, target: campaign.target,
    seatPrice: campaign.seatPrice, seats: campaign.seats, deadline: campaign.deadline,
  })
  const [error, setError] = useState('')
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await setCampaign(form)
      onSaved()
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    <form onSubmit={save} className="mt-5 grid gap-4 border-t border-gray-200 pt-5 sm:grid-cols-2">
      <Field label="Campaign name"><input required value={form.name} onChange={set('name')} className={inputClass} /></Field>
      <Field label="Receipt purpose it counts" hint="Must match the purpose on the receipt.">
        <input required value={form.purpose} onChange={set('purpose')} className={inputClass} />
      </Field>
      <Field label="Target (GHS)"><input type="number" required min="1" value={form.target} onChange={set('target')} className={inputClass} /></Field>
      <Field label="Cost of one seat (GHS)"><input type="number" required min="1" value={form.seatPrice} onChange={set('seatPrice')} className={inputClass} /></Field>
      <Field label="Seats to fund"><input type="number" required min="1" value={form.seats} onChange={set('seats')} className={inputClass} /></Field>
      <Field label="Deadline"><input type="date" required value={form.deadline} onChange={set('deadline')} className={inputClass} /></Field>
      {error && <div className="sm:col-span-2"><Notice>{error}</Notice></div>}
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" className={buttonClass}>Save campaign</button>
        <button type="button" onClick={onClose} className={quietButtonClass}>Close</button>
      </div>
    </form>
  )
}

// What it would take to reach the target in the days left.
const paceText = ({ raised, target, daysLeft }) => {
  const left = target - raised
  if (left <= 0) return 'Target reached.'
  if (daysLeft <= 0) return `Closed ${money(left)} short of the target.`
  return `${money(left)} still to raise, about ${money(left / daysLeft)} a day.`
}

const Overview = ({ user, onNavigate }) => {
  const [data, setData] = useState(null)
  const [problems, setProblems] = useState([])
  const [summit, setSummit] = useState(null)
  const [visits, setVisits] = useState(null)
  const [checkin, setCheckin] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)

  const load = useCallback(() => {
    getOverview().then(setData).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    load()
    // The slower sources fill in on their own, so they never hold up the page.
    getQuality().then((result) => setProblems(problemsIn(result.groups))).catch(() => {})
    getRegistrations().then((forms) => setSummit(forms.find((f) => f.id === 'summit') || null)).catch(() => {})
    getVisitors().then(setVisits).catch(() => {})
    getSummitEvent().then(setCheckin).catch(() => {})
  }, [load])

  if (error) return <Notice>{error}</Notice>
  if (!data) return <Loading />

  const { campaign, receiptsIssued, pendingProducts } = data
  const registered = summit?.state === 'ok'

  return (
    <div className="max-w-5xl">
      <PageTitle title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="Where SWK Ghana stands today." />

      {problems.length > 0 && (
        <Panel tone="warn" className="mb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-bold text-amber-900"><LuTriangleAlert aria-hidden="true" /> Needs attention ({problems.length})</h2>
            <button onClick={() => onNavigate('quality')} className="text-sm font-semibold text-amber-900 underline">All quality checks</button>
          </div>
          <ul className="mt-1 divide-y divide-amber-200">
            {problems.slice(0, SHOWN_PROBLEMS).map((check, i) => <Check key={i} check={check} onNavigate={onNavigate} />)}
          </ul>
        </Panel>
      )}

      <Panel className="mb-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0C2E11]">{campaign.name}</h2>
            <p className="text-sm text-gray-600">
              {campaign.daysLeft > 0 ? `${campaign.daysLeft} day${campaign.daysLeft === 1 ? '' : 's'} left` : 'Fundraising has closed'} · closes {longDate(campaign.deadline)}
            </p>
          </div>
          {user.role === 'owner' && !editing && (
            <button onClick={() => setEditing(true)} className={quietButtonClass}>Edit campaign</button>
          )}
        </div>
        <div className="space-y-5">
          <Meter label="Money raised" value={campaign.raised} max={campaign.target} text={`${money(campaign.raised)} of ${money(campaign.target)}`} />
          <Meter label="Seats funded" value={campaign.seatsFunded} max={campaign.seats} text={`${campaign.seatsFunded} of ${campaign.seats}`} />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700">{paceText(campaign)}</p>
        {editing && <CampaignForm campaign={campaign} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); load() }} />}
      </Panel>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Raised for this campaign" value={money(campaign.raised)} detail={`${campaign.donations} donation${campaign.donations === 1 ? '' : 's'}`} />
        <Stat
          label={checkin?.counts.registered ? 'Checked in at the Summit' : 'Registered for the Summit'}
          value={checkin?.counts.registered ? checkin.counts.checkedIn : registered ? summit.total : '–'}
          detail={checkin?.counts.registered ? `of ${checkin.counts.registered} on the list, ${checkin.counts.walkIns} at the entrance` : registered ? `${campaign.seatsFunded} seats funded so far` : 'Waiting for the form'}
        />
        <Stat
          label="Website visits in 7 days"
          value={visits ? visits.last7 : '–'}
          detail={visits ? weekChange(visits.last7, visits.previous7) : ''}
        />
        <Stat label="Receipts issued" value={receiptsIssued} detail={`${pendingProducts} marketplace product${pendingProducts === 1 ? '' : 's'} to review`} />
      </div>
    </div>
  )
}

export default Overview
