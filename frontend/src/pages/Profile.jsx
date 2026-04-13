import React from 'react'
import { useAuth } from '../App'
import { api } from '../lib/api'

export default function Profile() {
  const { user, setUser } = useAuth()

  const handleSignWaiver = async () => {
    const updated = await api.signWaiver()
    setUser(u => ({ ...u, ...updated }))
    alert('Waiver signed successfully!')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-green-800 mb-8">My Profile</h1>

      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">{user.type} Member</span>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium">{user.phone || '—'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Member since</span>
            <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Waiver</span>
            <span className={`font-medium ${user.waiverSigned ? 'text-green-700' : 'text-rust-500'}`}>
              {user.waiverSigned ? `✓ Signed ${new Date(user.waiverSignedAt).toLocaleDateString()}` : 'Not signed'}
            </span>
          </div>
        </div>
      </div>

      {!user.waiverSigned && (
        <div className="card border-amber-200 bg-amber-50 mb-6">
          <h3 className="font-semibold text-amber-800 mb-2">⚠️ Sign Club Waiver</h3>
          <p className="text-amber-700 text-sm mb-4">Required before booking your first hunt.</p>
          <button onClick={handleSignWaiver} className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded text-sm">
            Sign Waiver
          </button>
        </div>
      )}

      <div className="card text-sm text-gray-600">
        <h3 className="font-semibold text-gray-800 mb-3">Club Contact</h3>
        <p>Amber Gum — (815) 739-0612</p>
        <p>33380 Pierce Rd, Genoa, IL 60135</p>
        <p className="mt-2 text-gray-400">Open Wed–Sun · Oct 1 – Mar 31</p>
      </div>
    </div>
  )
}
