import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-emerald-700 mb-4">404</h1>
        <p className="text-gray-700 mb-8">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-gradient px-6 py-3 rounded-xl">Go Home</Link>
      </div>
    </div>
  )
}

export default NotFound



