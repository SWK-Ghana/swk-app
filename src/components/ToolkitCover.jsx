import React from 'react'

// The cover drawn for each NGO Support Toolkit guide (no image files needed).
// Used on /support and in the preview on /resources.
const ToolkitCover = ({ no, title, edition, size = 'md', className = '' }) => (
  <div
    className={`relative overflow-hidden bg-[#0C2E11] text-white ${size === 'lg' ? 'p-7 sm:p-9' : 'p-5'} ${className}`}
    aria-hidden="true"
  >
    <span className={`absolute rounded-full border-[#78C31E]/25 ${size === 'lg' ? '-right-16 -top-16 h-56 w-56 border-[22px]' : '-right-10 -top-10 h-36 w-36 border-[14px]'}`} />
    <span className="absolute right-4 bottom-1 text-[5.5rem] font-bold leading-none text-white/[0.06] select-none">{no}</span>
    <p className="relative text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#A8E04A]">NGO Support Toolkit · {no}</p>
    <p className={`relative mt-3 font-bold leading-tight text-white ${size === 'lg' ? 'text-2xl sm:text-3xl max-w-xs' : 'text-lg max-w-[13rem]'}`}>{title}</p>
    {edition && <p className="relative mt-1.5 text-xs text-white/70">{edition}</p>}
  </div>
)

export default ToolkitCover
