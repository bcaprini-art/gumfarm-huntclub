import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'

export default function MyBirds() {
  const { user } = useAuth()
  const pct = user.seasonBirdBalance + user.seasonBirdsUsed > 0
    ? Math.round((user.seasonBirdsUsed / (user.seasonBirdBalance + user.seasonBirdsUsed)) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-green-800 mb-8">My Bird Package</h1>

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Season Package</h2>
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-800">{user.seasonBirdBalance}</div>
            <div className="text-sm text-gray-500 mt-1">Remaining</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-700">{user.seasonBirdsUsed}</div>
            <div className="text-sm text-gray-500 mt-1">Used</div>
          </div>
          <div className="bg-tan-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-tan-400">{user.seasonBirdBalance + user.seasonBirdsUsed}</div>
            <div className="text-sm text-gray-500 mt-1">Total Package</div>
          </div>
        </div>

        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>Season usage</span>
          <span>{pct}% used</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-green-700 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Season Rules</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>✓ Minimum 3 birds released per hunt</li>
          <li>✓ Cancel 24 hours ahead or birds are forfeited</li>
          <li>✗ Unused birds do not carry over to next year</li>
          <li>⚠️ Birds not hunted by Dec 31 — $2/bird surcharge added</li>
          <li>⚠️ All birds must be released by March 2</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Link to="/book" className="btn-primary flex-1 text-center">Book a Hunt</Link>
        <a href="tel:8157390612" className="flex-1 text-center border border-green-800 text-green-800 font-semibold px-6 py-2 rounded hover:bg-green-50">
          Contact Club
        </a>
      </div>
    </div>
  )
}
