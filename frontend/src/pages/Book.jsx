import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../App'

const STEPS = ['Date & Field', 'Birds & Party', 'Services', 'Confirm']

export default function Book() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [fields, setFields] = useState([])
  const [guides, setGuides] = useState([])
  const [availability, setAvailability] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    date: '', timeSlot: 'Morning (8am)', fieldId: '',
    partySize: 1,
    pheasantsReleased: 3, chukarsReleased: 0, quailReleased: 0,
    guideRequested: false, guideId: '',
    birdCleaning: false, trapHouse: false,
    notes: '',
  })

  useEffect(() => {
    Promise.all([api.getFields(), api.getGuides()]).then(([f, g]) => { setFields(f); setGuides(g) })
  }, [])

  useEffect(() => {
    if (form.date) api.getAvailability(form.date).then(setAvailability)
  }, [form.date])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const totalBirds = Number(form.pheasantsReleased) + Number(form.chukarsReleased) + Number(form.quailReleased)
  const estimatedFee = () => {
    let fee = Number(form.pheasantsReleased) * 22 + Number(form.chukarsReleased) * 16 + Number(form.quailReleased) * 10
    if (form.guideRequested) fee += 100
    if (form.birdCleaning) fee += 5 * totalBirds
    return fee
  }

  const selectedFieldAvail = availability.find(a => a.field.id === form.fieldId)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      await api.createBooking({ ...form, partySize: Number(form.partySize) })
      navigate('/my-bookings')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user.waiverSigned) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="card">
        <p className="text-xl mb-4">⚠️ Please sign the club waiver before booking.</p>
        <button onClick={() => api.signWaiver().then(() => window.location.reload())} className="btn-primary">Sign Waiver</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-green-800 mb-2">Book a Hunt</h1>
      <p className="text-gray-500 text-sm mb-8">Bird balance: <strong>{user.seasonBirdBalance} birds remaining</strong></p>

      {/* Progress */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i <= step ? 'text-green-800' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${i < step ? 'bg-green-800 text-white' : i === step ? 'border-2 border-green-800 text-green-800' : 'border-2 border-gray-300 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-green-700' : 'bg-gray-300'}`} />}
          </React.Fragment>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">{error}</div>}

      <div className="card">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-green-800 mb-4">Select Date & Field</h2>
            <div>
              <label className="label">Hunt Date</label>
              <input type="date" className="input" value={form.date} onChange={set('date')}
                min={new Date().toISOString().split('T')[0]} required />
            </div>
            <div>
              <label className="label">Preferred Time</label>
              <select className="input" value={form.timeSlot} onChange={set('timeSlot')}>
                <option>Morning (8am)</option>
                <option>Midday (11am)</option>
                <option>Afternoon (2pm)</option>
              </select>
            </div>
            {form.date && (
              <div>
                <label className="label">Select Field</label>
                <div className="grid grid-cols-2 gap-3">
                  {availability.map(({ field, availableSlots }) => (
                    <button key={field.id} onClick={() => setForm(f => ({ ...f, fieldId: field.id }))}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${form.fieldId === field.id ? 'border-green-700 bg-green-50' : availableSlots > 0 ? 'border-gray-200 hover:border-green-400' : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'}`}
                      disabled={availableSlots === 0}>
                      <p className="font-semibold text-green-800">{field.name}</p>
                      <p className="text-xs text-gray-500">{availableSlots > 0 ? `${availableSlots} spots open` : 'Full'}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-green-800 mb-4">Birds & Party Size</h2>
            <div>
              <label className="label">Party Size (number of hunters)</label>
              <input type="number" className="input" min={1} max={6} value={form.partySize} onChange={set('partySize')} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">🦃 Pheasants</label>
                <input type="number" className="input" min={0} value={form.pheasantsReleased} onChange={set('pheasantsReleased')} />
                <p className="text-xs text-gray-400 mt-1">$22/bird (member)</p>
              </div>
              <div>
                <label className="label">🐦 Chukar</label>
                <input type="number" className="input" min={0} value={form.chukarsReleased} onChange={set('chukarsReleased')} />
                <p className="text-xs text-gray-400 mt-1">$16/bird (member)</p>
              </div>
              <div>
                <label className="label">🪶 Quail</label>
                <input type="number" className="input" min={0} value={form.quailReleased} onChange={set('quailReleased')} />
                <p className="text-xs text-gray-400 mt-1">$10/bird (min 25)</p>
              </div>
            </div>
            <div className="bg-green-50 rounded p-3 text-sm">
              <strong>Total birds:</strong> {totalBirds} &nbsp;·&nbsp;
              <strong>Your balance:</strong> {user.seasonBirdBalance} remaining
              {totalBirds > user.seasonBirdBalance && <p className="text-rust-500 mt-1">⚠️ Exceeds your bird balance — additional birds may be purchased at booking.</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-green-800 mb-4">Add Services</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 accent-green-700" checked={form.guideRequested} onChange={set('guideRequested')} />
              <div>
                <p className="font-medium">Guide Service (+$100)</p>
                <p className="text-sm text-gray-500">Professional guide with bird dog. Must book 1 week in advance. Tip not included.</p>
              </div>
            </label>
            {form.guideRequested && (
              <div className="ml-7">
                <label className="label">Select Guide</label>
                <select className="input" value={form.guideId} onChange={set('guideId')}>
                  <option value="">Any available guide</option>
                  {guides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            )}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 accent-green-700" checked={form.birdCleaning} onChange={set('birdCleaning')} />
              <div>
                <p className="font-medium">Bird Cleaning (+$5/bird)</p>
                <p className="text-sm text-gray-500">On-site cleaning area. Estimated: ${(5 * totalBirds).toFixed(0)} for {totalBirds} birds.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 accent-green-700" checked={form.trapHouse} onChange={set('trapHouse')} />
              <div>
                <p className="font-medium">Trap House (additional charge)</p>
                <p className="text-sm text-gray-500">Warm up before your hunt at one of our 2 trap houses.</p>
              </div>
            </label>
            <div>
              <label className="label">Notes (optional)</label>
              <textarea className="input" rows={3} value={form.notes} onChange={set('notes')} placeholder="Any special requests..." />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-green-800 mb-4">Confirm Booking</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <Row label="Date" value={new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} />
              <Row label="Time" value={form.timeSlot} />
              <Row label="Field" value={fields.find(f => f.id === form.fieldId)?.name || '—'} />
              <Row label="Party Size" value={`${form.partySize} hunter(s)`} />
              <Row label="Pheasants" value={form.pheasantsReleased} />
              {form.chukarsReleased > 0 && <Row label="Chukar" value={form.chukarsReleased} />}
              {form.quailReleased > 0 && <Row label="Quail" value={form.quailReleased} />}
              {form.guideRequested && <Row label="Guide" value={`${guides.find(g => g.id === form.guideId)?.name || 'Any'} (+$100)`} />}
              {form.birdCleaning && <Row label="Bird Cleaning" value={`+$${(5 * totalBirds).toFixed(0)}`} />}
              {form.trapHouse && <Row label="Trap House" value="Yes (charged separately)" />}
              <div className="border-t pt-2 mt-2">
                <Row label="Estimated Total" value={`$${estimatedFee().toFixed(2)}`} bold />
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800">
              ⚠️ <strong>Cancellation Policy:</strong> Cancel 24 hours before hunt or birds are forfeited. Guide cancellations require 72 hours.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="text-gray-600 hover:text-gray-800 font-medium">← Back</button>
          ) : <div />}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && (!form.date || !form.fieldId)}
              className="btn-primary disabled:opacity-50">
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary">
              {loading ? 'Booking...' : '✓ Confirm Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-bold text-green-800' : 'font-medium'}>{value}</span>
    </div>
  )
}
