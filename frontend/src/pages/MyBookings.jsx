import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

const STATUS_COLORS = { CONFIRMED: 'bg-green-100 text-green-800', COMPLETED: 'bg-gray-100 text-gray-600', PENDING: 'bg-yellow-100 text-yellow-800', CANCELLED: 'bg-red-100 text-red-600' }

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getBookings().then(b => setBookings(b.sort((a, b) => new Date(b.date) - new Date(a.date)))).finally(() => setLoading(false)) }, [])

  const upcoming = bookings.filter(b => b.status !== 'CANCELLED' && new Date(b.date) >= new Date())
  const past = bookings.filter(b => b.status === 'CANCELLED' || new Date(b.date) < new Date())

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking? Birds may be forfeited if within 24 hours.')) return
    try {
      const { birdsForfeited } = await api.cancelBooking(id)
      if (birdsForfeited) alert('Cancellation processed. Birds were forfeited due to late cancellation.')
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
    } catch (err) { alert(err.message) }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-green-800">My Hunts</h1>
          <p className="text-gray-500 text-sm">{upcoming.length} upcoming</p>
        </div>
        <Link to="/book" className="btn-primary">+ Book a Hunt</Link>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-gray-700 uppercase text-xs tracking-wider mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map(b => <BookingRow key={b.id} booking={b} onCancel={handleCancel} />)}
          </div>
        </section>
      )}

      {upcoming.length === 0 && (
        <div className="card text-center py-12 mb-8">
          <p className="text-gray-400 mb-4">No upcoming hunts. Ready to book?</p>
          <Link to="/book" className="btn-primary">Book a Hunt</Link>
        </div>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-700 uppercase text-xs tracking-wider mb-3">Past & Cancelled</h2>
          <div className="space-y-3 opacity-75">
            {past.map(b => <BookingRow key={b.id} booking={b} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function BookingRow({ booking: b, onCancel }) {
  const isFuture = new Date(b.date) >= new Date()
  const totalBirds = b.pheasantsReleased + b.chukarsReleased + b.quailReleased

  return (
    <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
          <h3 className="font-semibold text-green-800">{b.field?.name}</h3>
        </div>
        <p className="text-sm text-gray-600">
          {new Date(b.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {b.timeSlot}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {b.partySize} hunter(s) · {totalBirds} birds
          {b.guideRequested && ' · Guide requested'}
          {b.birdCleaning && ' · Cleaning'}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-bold text-green-800">${b.totalFee.toFixed(2)}</p>
          <p className="text-xs text-gray-400">est. total</p>
        </div>
        {onCancel && isFuture && b.status !== 'CANCELLED' && (
          <button onClick={() => onCancel(b.id)} className="text-sm text-rust-500 hover:text-rust-600 font-medium">Cancel</button>
        )}
      </div>
    </div>
  )
}
