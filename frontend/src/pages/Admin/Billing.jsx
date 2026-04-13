import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function AdminBilling() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ memberId: '', amount: '', method: 'CASH', notes: '' })
  const [members, setMembers] = useState([])

  useEffect(() => {
    Promise.all([api.getAllPayments(), api.getMembers()])
      .then(([p, m]) => { setPayments(p); setMembers(m) })
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + p.amount, 0)

  const recordPayment = async () => {
    await api.recordCashPayment(form)
    setShowForm(false)
    api.getAllPayments().then(setPayments)
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-green-800">Billing</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">+ Record Payment</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card border-l-4 border-green-700">
          <div className="text-2xl font-bold text-green-700">${totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">Total Revenue (Recorded)</div>
        </div>
        <div className="card border-l-4 border-gray-300">
          <div className="text-2xl font-bold text-gray-700">{payments.length}</div>
          <div className="text-sm text-gray-500 mt-1">Total Transactions</div>
        </div>
      </div>

      {showForm && (
        <div className="card mb-6 border border-green-200">
          <h3 className="font-serif text-lg font-bold text-green-800 mb-4">Record Cash/Check Payment</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Member</label>
              <select className="input" value={form.memberId} onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))}>
                <option value="">Select member...</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Amount ($)</label>
              <input type="number" className="input" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label className="label">Method</label>
              <select className="input" value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
                <option value="CASH">Cash</option>
                <option value="CHECK">Check</option>
              </select>
            </div>
            <div>
              <label className="label">Notes</label>
              <input className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. Hunt on 11/15" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={recordPayment} className="btn-primary">Record Payment</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <h2 className="font-serif text-xl font-bold text-green-800 mb-4">Payment History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Member</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Method</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium">{p.member?.name}</td>
                <td className="py-3 text-gray-500">{new Date(p.paidAt || p.createdAt).toLocaleDateString()}</td>
                <td className="py-3 font-bold text-green-700">${p.amount.toFixed(2)}</td>
                <td className="py-3">{p.method}</td>
                <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
                <td className="py-3 text-gray-400 text-xs">{p.notes || '—'}</td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">No payments recorded yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
