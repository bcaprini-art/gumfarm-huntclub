import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function AdminBirds() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getInventory().then(setInventory).finally(() => setLoading(false)) }, [])

  const updateQty = async (species) => {
    const val = prompt(`New quantity for ${species}:`)
    if (val === null || isNaN(parseInt(val))) return
    await api.updateInventory(species, parseInt(val))
    setInventory(prev => prev.map(i => i.species === species ? { ...i, quantityOnHand: parseInt(val) } : i))
  }

  const ICONS = { PHEASANT: '🦃', CHUKAR: '🐦', QUAIL: '🪶' }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-green-800 mb-8">Bird Inventory</h1>

      <div className="grid gap-4 mb-8">
        {inventory.map(item => {
          const pct = Math.min(100, (item.quantityOnHand / 200) * 100)
          const low = item.quantityOnHand < 25
          return (
            <div key={item.id} className={`card border-l-4 ${low ? 'border-rust-500' : 'border-green-700'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ICONS[item.species]}</span>
                  <div>
                    <h3 className="font-bold text-lg capitalize">{item.species.toLowerCase()}</h3>
                    {low && <p className="text-rust-500 text-xs font-medium">⚠️ Low stock</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${low ? 'text-rust-500' : 'text-green-700'}`}>{item.quantityOnHand}</div>
                  <div className="text-xs text-gray-400">on hand</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className={`h-3 rounded-full ${low ? 'bg-rust-500' : 'bg-green-600'}`} style={{ width: `${pct}%` }} />
              </div>
              <button onClick={() => updateQty(item.species)} className="btn-primary text-sm">Update Count</button>
            </div>
          )
        })}
      </div>

      <div className="card bg-green-50">
        <h3 className="font-semibold text-green-800 mb-2">Inventory Notes</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Update counts after each stocking delivery</li>
          <li>• Quail minimum release is 25 birds per hunt</li>
          <li>• Low stock alert triggers below 25 birds</li>
          <li>• All birds raised on-site at Gumfarm</li>
        </ul>
      </div>
    </div>
  )
}
