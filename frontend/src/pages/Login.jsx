import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../App'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token, member } = await api.login(email, password)
      login(token, member)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Gumfarm Hunt Club" className="h-20 w-20 rounded-full object-cover border-4 border-green-800 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-green-800">Member Login</h2>
          <p className="text-gray-500 text-sm">Gumfarm Hunt Club · Genoa, IL</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Not a member? <Link to="/register" className="text-green-700 font-medium hover:underline">Register here</Link>
        </p>
        <p className="text-center text-sm mt-2">
          <Link to="/" className="text-gray-400 hover:text-gray-600">← Back to website</Link>
        </p>
      </div>
    </div>
  )
}
