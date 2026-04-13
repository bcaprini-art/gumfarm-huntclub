import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../App'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setError('')
    setLoading(true)
    try {
      const { token, member } = await api.register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      login(token, member)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-800 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Gumfarm Hunt Club" className="h-20 w-20 rounded-full object-cover border-4 border-green-800 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-green-800">Create Member Account</h2>
          <p className="text-gray-500 text-sm">Gumfarm Hunt Club · Genoa, IL</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="label">Email address</label>
            <input type="email" className="input" value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="label">Phone number</label>
            <input type="tel" className="input" value={form.phone} onChange={set('phone')} placeholder="815-555-0100" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={form.password} onChange={set('password')} required minLength={8} />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" className="input" value={form.confirm} onChange={set('confirm')} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          You'll be asked to sign the club waiver after registration.
        </p>
        <p className="text-center text-sm text-gray-600 mt-3">
          Already a member? <Link to="/login" className="text-green-700 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
