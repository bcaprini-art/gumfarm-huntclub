import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function AdminMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { api.getMembers().then(setMembers).finally(() => setLoading(false)) }, [])

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const updateBirds = async (id, balance) => {
    const val = prompt('New bird balance:')
    if (val === null) return
    await api.updateMemberBirds(id, parseInt(val))
    setMembers(prev => prev.map(m => m.id === id ? { ...m, seasonBirdBalance: parseInt(val) } : m))
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-green-800">Members</h1>
        <div className="text-sm text-gray-500">{members.length} total</div>
      </div>

      <div className="card mb-6">
        <input className="input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Birds Remaining</th>
              <th className="pb-3">Waiver</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium text-green-800">{m.name}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.type === 'CORPORATE' ? 'bg-blue-100 text-blue-800' : m.type === 'FAMILY' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                    {m.type}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{m.email}</td>
                <td className="py-3 text-gray-500">{m.phone || '—'}</td>
                <td className="py-3">
                  <span className={`font-bold ${m.seasonBirdBalance < 5 ? 'text-rust-500' : 'text-green-700'}`}>{m.seasonBirdBalance}</span>
                  <span className="text-gray-400 text-xs"> / {m.seasonBirdBalance + m.seasonBirdsUsed}</span>
                </td>
                <td className="py-3">
                  {m.waiverSigned ? <span className="text-green-600 text-xs">✓ Signed</span> : <span className="text-amber-600 text-xs">⚠ Pending</span>}
                </td>
                <td className="py-3">
                  <button onClick={() => updateBirds(m.id)} className="text-green-700 hover:underline text-xs font-medium">Edit Birds</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
