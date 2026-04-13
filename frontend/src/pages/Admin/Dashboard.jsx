import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getAdminDashboard().then(setData).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Gumfarm Hunt Club · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/book" className="btn-primary">+ New Booking</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Total Members" value={data?.stats.totalMembers} />
        <StatCard icon="📅" label="Today's Hunts" value={data?.stats.todayBookingCount} />
        <StatCard icon="💰" label="Total Revenue" value={`$${(data?.stats.totalRevenue || 0).toFixed(0)}`} />
        <StatCard icon="📋" label="Outstanding" value={`$${(data?.stats.totalOwed || 0).toFixed(0)}`} color="amber" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Today's bookings */}
        <div className="card">
          <h2 className="font-serif text-xl font-bold text-green-800 mb-4">Today's Hunts</h2>
          {data?.todayBookings.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No hunts scheduled today</p>
          ) : (
            <div className="space-y-3">
              {data.todayBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                  <div>
                    <p className="font-medium text-green-800">{b.member.name}</p>
                    <p className="text-sm text-gray-500">{b.field.name} · {b.timeSlot} · {b.partySize} hunters</p>
                    {b.guide && <p className="text-xs text-tan-400">Guide: {b.guide.name}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{b.pheasantsReleased + b.chukarsReleased + b.quailReleased} birds</p>
                    <p className="text-xs text-gray-400">${b.totalFee.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bird inventory */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-green-800">Bird Inventory</h2>
            <Link to="/admin/birds" className="text-sm text-green-700 hover:underline">Manage →</Link>
          </div>
          <div className="space-y-3">
            {data?.inventory.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="font-medium capitalize">{item.species.toLowerCase()}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(100, (item.quantityOnHand / 200) * 100)}%` }} />
                  </div>
                  <span className={`font-bold text-sm ${item.quantityOnHand < 20 ? 'text-rust-500' : 'text-green-700'}`}>
                    {item.quantityOnHand}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming 7 days */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-green-800">Next 7 Days</h2>
          <Link to="/admin/bookings" className="text-sm text-green-700 hover:underline">View all →</Link>
        </div>
        {data?.upcomingBookings.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">No upcoming bookings</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">Member</th><th className="pb-2">Date</th><th className="pb-2">Field</th><th className="pb-2">Birds</th><th className="pb-2">Fee</th></tr></thead>
              <tbody>
                {data.upcomingBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-medium">{b.member.name}</td>
                    <td className="py-2 text-gray-500">{new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {b.timeSlot}</td>
                    <td className="py-2">{b.field.name}</td>
                    <td className="py-2">{b.pheasantsReleased + b.chukarsReleased + b.quailReleased}</td>
                    <td className="py-2 font-semibold text-green-700">${b.totalFee.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`card border-l-4 ${color === 'amber' ? 'border-amber-400' : 'border-green-700'}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-green-800">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}
