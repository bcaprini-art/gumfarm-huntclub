import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'

const STATUS_COLORS = { CONFIRMED: 'bg-green-100 text-green-800', COMPLETED: 'bg-gray-100 text-gray-600', PENDING: 'bg-yellow-100 text-yellow-800', CANCELLED: 'bg-red-100 text-red-600' }

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('upcoming')

  useEffect(() => { api.getBookings().then(b => setBookings(b.sort((a, b) => new Date(b.date) - new Date(a.date)))).finally(() => setLoading(false)) }, [])

  const now = new Date()
  const filtered = bookings.filter(b => {
    if (filter === 'upcoming') return b.status !== 'CANCELLED' && new Date(b.date) >= now
    if (filter === 'today') { const d = new Date(b.date); return d.toDateString() === now.toDateString() }
    if (filter === 'cancelled') return b.status === 'CANCELLED'
    return true
  })

  const markComplete = async (id) => {
    await api.updateBooking(id, { status: 'COMPLETED' })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'COMPLETED' } : b))
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-green-800">All Bookings</h1>
        <div className="flex gap-2">
          {['upcoming', 'today', 'all', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`text-sm px-3 py-1.5 rounded-lg font-medium capitalize ${filter === f ? 'bg-green-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Member</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Field</th>
              <th className="pb-3">Party</th>
              <th className="pb-3">Birds</th>
              <th className="pb-3">Guide</th>
              <th className="pb-3">Fee</th>
              <th className="pb-3">Status</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium">{b.member?.name}</td>
                <td className="py-3 text-gray-500">{new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}<br/><span className="text-xs">{b.timeSlot}</span></td>
                <td className="py-3">{b.field?.name}</td>
                <td className="py-3 text-center">{b.partySize}</td>
                <td className="py-3 text-center">{b.pheasantsReleased + b.chukarsReleased + b.quailReleased}</td>
                <td className="py-3">{b.guide?.name || (b.guideRequested ? 'Any' : '—')}</td>
                <td className="py-3 font-semibold text-green-700">${b.totalFee.toFixed(2)}</td>
                <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                <td className="py-3">
                  {b.status === 'CONFIRMED' && <button onClick={() => markComplete(b.id)} className="text-xs text-green-700 hover:underline">Mark Complete</button>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-gray-400">No bookings found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
