import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Billing() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getMyPayments().then(setData).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-green-800 mb-8">Billing</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center border-l-4 border-gray-300">
          <div className="text-2xl font-bold text-gray-700">${(data?.totalOwed || 0).toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">Total Owed</div>
        </div>
        <div className="card text-center border-l-4 border-green-700">
          <div className="text-2xl font-bold text-green-700">${(data?.totalPaid || 0).toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">Total Paid</div>
        </div>
        <div className={`card text-center border-l-4 ${data?.balance > 0 ? 'border-rust-500' : 'border-green-700'}`}>
          <div className={`text-2xl font-bold ${data?.balance > 0 ? 'text-rust-500' : 'text-green-700'}`}>${(data?.balance || 0).toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">{data?.balance > 0 ? 'Balance Due' : 'Paid Up ✓'}</div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-700 mb-1">Payment Methods</h2>
        <p className="text-sm text-gray-500 mb-4">Cash, check, and major credit cards accepted. Credit card payments include a 4% processing fee.</p>
        <a href="tel:8157390612" className="btn-primary text-sm inline-block">📞 Contact Amber to Pay: (815) 739-0612</a>
      </div>

      {data?.payments?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Payment History</h2>
          <div className="space-y-3">
            {data.payments.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-sm">{p.booking?.field?.name || 'Payment'}</p>
                  <p className="text-xs text-gray-400">{new Date(p.paidAt || p.createdAt).toLocaleDateString()} · {p.method}</p>
                </div>
                <span className="font-semibold text-green-700">+${p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.payments?.length === 0 && (
        <div className="card text-center py-8 text-gray-400">No payment history yet.</div>
      )}
    </div>
  )
}
