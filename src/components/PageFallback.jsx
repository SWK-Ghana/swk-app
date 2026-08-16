import React from 'react'

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin"
      style={{ borderColor: '#78C31E', borderTopColor: 'transparent' }}
      role="status" aria-label="Loading" />
  </div>
)

export default PageFallback
