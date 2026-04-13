import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../App'

export default function Dashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [billing, setBilling] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getBookings(), api.getMyPayments()])
      .then(([b, billing]) => { setBookings(b); setBilling(billing) })
      .finally(() => setLoading(false))
  }, [])

  const upcoming = bookings.filter(b => b.status !== 'CANCELLED' && new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3)

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Waiver banner */}
      {!user.waiverSigned && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800">⚠️ Please sign the club waiver to book hunts</p>
            <p className="text-amber-700 text-sm">Required before your first reservation.</p>
          </div>
          <button onClick={() => api.signWaiver().then(() => window.location.reload())}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded font-medium text-sm">
            Sign Waiver
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-green-800">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 text-sm mt-1">Gumfarm Hunt Club Member Portal</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Bird Balance" value={`${user.seasonBirdBalance}`} sub="birds remaining" color="green" icon="🦃" />
        <StatCard label="Birds Used" value={`${user.seasonBirdsUsed}`} sub="this season" color="tan" icon="✓" />
        <StatCard label="Upcoming Hunts" value={upcoming.length} sub="confirmed" color="green" icon="📅" />
        <StatCard label="Balance Due" value={`$${(billing?.balance || 0).toFixed(2)}`} sub="outstanding" color={billing?.balance > 0 ? 'rust' : 'green'} icon="💳" />
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="font-serif text-xl font-bold text-green-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/book" className="flex items-center gap-3 bg-green-800 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <span className="text-xl">🗓️</span> Book a Hunt
            </Link>
            <Link to="/my-bookings" className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors">
              <span className="text-xl">📋</span> View My Hunts
            </Link>
            <Link to="/billing" className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors">
              <span className="text-xl">💰</span> View Billing
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="font-serif text-xl font-bold text-green-800 mb-4">Upcoming Hunts</h2>
          {upcoming.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-3">No upcoming hunts scheduled</p>
              <Link to="/book" className="btn-primary text-sm">Book Your First Hunt</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(b => (
                <div key={b.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                  <div>
                    <p className="font-medium text-green-800">{b.field?.name}</p>
                    <p className="text-sm text-gray-500">{new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {b.timeSlot}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-700">{b.pheasantsReleased + b.chukarsReleased + b.quailReleased} birds</p>
                    <p className="text-xs text-gray-400">${b.totalFee.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Season info */}
      <div className="bg-green-800 rounded-xl p-6 text-white">
        <h3 className="font-serif text-lg font-bold mb-2">Season Reminder</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div><span className="text-tan-200">Season:</span> Oct 1 – Mar 31</div>
          <div><span className="text-tan-200">Open:</span> Wed–Sun by reservation</div>
          <div><span className="text-tan-200">Contact:</span> Amber · (815) 739-0612</div>
        </div>
        <p className="text-tan-200 text-xs mt-3">⚠️ Unused birds do not carry over. Cancel 24hrs in advance or birds are forfeited.</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color, icon }) {
  const colors = { green: 'border-green-700 bg-green-50', tan: 'border-tan-300 bg-tan-100', rust: 'border-rust-500 bg-red-50' }
  const textColors = { green: 'text-green-800', tan: 'text-tan-400', rust: 'text-rust-500' }
  return (
    <div className={`card border-l-4 ${colors[color]} py-4`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${textColors[color]}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
      <div className="text-xs text-gray-400">{sub}</div>
    </div>
  )
}
