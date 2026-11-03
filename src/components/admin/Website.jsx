import React, { useEffect, useState } from 'react'
import { getVisitors } from '../../utils/adminApi'
import { BarList, DayChart, Loading, Notice, PageTitle, Panel, Stat } from './ui'
import { weekChange } from './helpers'

const ACTIONS = {
  donate_start: 'Started a donation',
  donate: 'Confirmed a donation',
  donate_interest: 'Asked about donating',
  contact_submit: 'Sent a message',
  volunteer_signup: 'Signed up to volunteer',
  partnership_inquiry: 'Asked about partnering',
}

const countries = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null
const countryName = (code) => countries?.of(code) || code
const pageName = (path) => (path === '/' ? 'Home' : path)

const Website = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getVisitors().then(setData).catch((err) => setError(err.message))
  }, [])

  if (error) return <Notice>{error}</Notice>
  if (!data) return <Loading />

  const pagesPerVisit = data.last30 ? (data.views30 / data.last30).toFixed(1) : '0'

  return (
    <div className="max-w-5xl">
      <PageTitle title="Website visitors" subtitle="SWK's own count, with no cookies and no personal details. A visit is one person's time on the site." />

      {data.last30 === 0 && (
        <div className="mb-5"><Notice tone="warn">No visits counted yet. Counting started when this screen went live, so earlier visits aren't included.</Notice></div>
      )}

      <div className="mb-5 grid gap-5 sm:grid-cols-3">
        <Stat label="Visits today" value={data.today} />
        <Stat label="Visits in 7 days" value={data.last7} detail={weekChange(data.last7, data.previous7)} />
        <Stat label="Visits in 30 days" value={data.last30} detail={`${pagesPerVisit} pages a visit`} />
      </div>

      <Panel className="mb-5">
        <h2 className="mb-3 font-bold text-[#0C2E11]">Visits per day</h2>
        <DayChart days={data.days} unit={data.days.at(-1).count === 1 ? 'visit' : 'visits'} label="Website visits per day, last 30 days" />
      </Panel>

      <Panel>
        <h2 className="mb-4 font-bold text-[#0C2E11]">The last 30 days</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <BarList title="Most read pages" rows={data.pages} nameOf={pageName} />
          <BarList title="How people found us" rows={data.sources} />
          <BarList title="What people did" rows={data.events} nameOf={(name) => ACTIONS[name] || name} />
          <BarList title="Country" rows={data.countries} nameOf={countryName} />
          <BarList title="Device" rows={data.devices} />
        </div>
      </Panel>
    </div>
  )
}

export default Website
