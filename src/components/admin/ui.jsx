import React from 'react'

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
