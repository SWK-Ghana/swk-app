import React, { useCallback, useEffect, useState } from 'react'
import { LuCircleAlert, LuCircleCheck, LuCircleX, LuRefreshCw } from 'react-icons/lu'
import { getQuality } from '../../utils/adminApi'
import { Loading, Notice, PageTitle, Panel, Stat, quietButtonClass } from './ui'
import { worstFirst } from './helpers'

const STATUS = {
  fail: { label: 'Fix now', icon: LuCircleX, color: 'text-red-700' },
  warn: { label: 'Look at this', icon: LuCircleAlert, color: 'text-amber-700' },
  pass: { label: 'Good', icon: LuCircleCheck, color: 'text-[#17702D]' },
}

export const Check = ({ check, onNavigate }) => {
  const { label, icon: Icon, color } = STATUS[check.status]
  return (
    <li className="flex items-start gap-3 py-2.5">
      <Icon className={`mt-0.5 h-4 w-4 flex-none ${color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900"><span className="sr-only">{label}: </span>{check.title}</p>
        {check.detail && <p className="break-words text-sm text-gray-600">{check.detail}</p>}
      </div>
      {check.screen && (
        <button onClick={() => onNavigate(check.screen)} className="flex-none text-sm font-semibold text-[#17702D] underline">Open</button>
      )}
    </li>
  )
}

const Quality = ({ onNavigate }) => {
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      setData(await getQuality())
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => { run() }, [run])

  if (error && !data) return <Notice>{error}</Notice>
  if (!data) return <Loading label="Running the checks…" />

  const all = data.groups.flatMap((group) => group.checks)
  const count = (status) => all.filter((check) => check.status === status).length

  return (
    <div className="max-w-4xl">
      <PageTitle title="Quality checks" subtitle="The dashboard checks these for you each time you open this screen.">
        <button onClick={run} disabled={busy} className={quietButtonClass}>
          <LuRefreshCw aria-hidden="true" /> {busy ? 'Checking…' : 'Check again'}
        </button>
      </PageTitle>
      {error && <div className="mb-4"><Notice>{error}</Notice></div>}

      <div className="mb-5 grid gap-5 sm:grid-cols-3">
        <Stat label="Fix now" value={count('fail')} />
        <Stat label="Look at this" value={count('warn')} />
        <Stat label="Good" value={count('pass')} />
      </div>

      <div className="space-y-5">
        {data.groups.map((group) => (
          <Panel key={group.name}>
            <h2 className="mb-1 font-bold text-[#0C2E11]">{group.name}</h2>
            <ul className="divide-y divide-gray-100">
              {worstFirst(group.checks).map((check) => <Check key={check.title} check={check} onNavigate={onNavigate} />)}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  )
}

export default Quality
