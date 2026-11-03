import React, { useState } from 'react'

// Shared pieces of the staff dashboard, so every screen looks and behaves alike.
export const PageTitle = ({ title, subtitle, children }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 className="text-2xl font-bold text-[#0C2E11]">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
    </div>
    {children}
  </div>
)

const PANEL_TONES = {
  plain: 'border-gray-200 bg-white',
  warn: 'border-amber-200 bg-amber-50',
  ok: 'border-[#D4F0A0] bg-[#F2FAE8]',
}

export const Panel = ({ children, className = '', tone = 'plain' }) => (
  <section className={`rounded-2xl border p-5 sm:p-6 ${PANEL_TONES[tone]} ${className}`}>{children}</section>
)

export const Field = ({ label, hint, children }) => (
  <label className="block text-sm font-medium text-gray-700">
    {label}
    <div className="mt-1">{children}</div>
    {hint && <span className="mt-1 block text-xs font-normal text-gray-500">{hint}</span>}
  </label>
)

export const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#17702D] focus:outline-none focus:ring-2 focus:ring-[#78C31E]/40'

export const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#78C31E] px-4 py-2.5 text-sm font-bold text-[#0C2E11] transition-colors hover:bg-[#8AD62B] disabled:cursor-not-allowed disabled:opacity-60'

export const quietButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#17702D] transition-colors hover:bg-[#F2FAE8] disabled:cursor-not-allowed disabled:opacity-60'

export const Notice = ({ tone = 'error', children }) => {
  const tones = {
    error: 'border-red-200 bg-red-50 text-red-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-900',
    ok: 'border-[#D4F0A0] bg-[#F2FAE8] text-[#0F5A24]',
  }
  return <p role="status" className={`rounded-lg border px-3 py-2 text-sm ${tones[tone]}`}>{children}</p>
}

export const Loading = ({ label = 'Loading…' }) => <p className="py-10 text-center text-sm text-gray-500">{label}</p>

export const Stat = ({ label, value, detail }) => (
  <Panel>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="mt-1 text-3xl font-bold text-[#0C2E11]">{value}</p>
    {detail && <p className="mt-1 text-sm text-gray-500">{detail}</p>}
  </Panel>
)

const shortDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

/** One bar per day. Hovering or tapping a day shows its number above the chart. */
export const DayChart = ({ days, unit, label }) => {
  const [picked, setPicked] = useState(null)
  const peak = Math.max(1, ...days.map((d) => d.count))
  const shown = picked || days.at(-1)
  return (
    <figure aria-label={label}>
      <p className="mb-2 text-sm text-gray-600">
        {shortDate(shown.day)}: <b className="font-bold text-[#0C2E11]">{shown.count}</b> {unit}
      </p>
      <div aria-hidden="true" onMouseLeave={() => setPicked(null)} className="flex h-36 items-end gap-0.5 border-b border-gray-300">
        {days.map((d) => (
          <div key={d.day} onMouseEnter={() => setPicked(d)} onClick={() => setPicked(d)} className="flex h-full min-w-0 flex-1 items-end">
            <div
              className={`w-full rounded-t ${d === shown ? 'bg-[#0C2E11]' : 'bg-[#1E963C]'}`}
              style={{ height: d.count ? `${Math.max(3, (d.count / peak) * 100)}%` : 0 }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="mt-1 flex justify-between text-xs text-gray-500">
        <span>{shortDate(days[0].day)}</span>
        <span>{shortDate(days.at(-1).day)}</span>
      </div>
      <div className="sr-only">
        <table>
          <caption>{label}</caption>
          <tbody>
            {days.map((d) => <tr key={d.day}><th scope="row">{shortDate(d.day)}</th><td>{d.count}</td></tr>)}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

/** A ranked list with a bar beside each count. */
export const BarList = ({ title, rows, nameOf = (name) => name }) => {
  const peak = Math.max(1, ...rows.map((r) => r.count))
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-[#0C2E11]">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.name} className="text-sm">
              <div className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-gray-700">{nameOf(row.name)}</span>
                <span className="font-medium tabular-nums text-gray-900">{row.count}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#EAF0E1]">
                <div className="h-full rounded-full bg-[#1E963C]" style={{ width: `${(row.count / peak) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
