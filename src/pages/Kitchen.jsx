import React, { useEffect, useState } from 'react'
import { listenAllOrders } from '../services/firebaseService'
import demoData from '../data/demo-data.json'

export default function Kitchen() {
  const [orders, setOrders] = useState(demoData.orders || {})

  useEffect(() => {
    const off = listenAllOrders((all) => {
      if (all) setOrders(all)
    })
    return () => off && off()
  }, [])

  return (
    <div className="page kitchen">
      <h2>Kitchen Display</h2>
      {Object.keys(orders).length === 0 && <div>No active orders (demo)</div>}
      {Object.entries(orders).map(([tableKey, tableOrders]) => (
        <div key={tableKey} style={{border:'1px solid #eee',padding:12,marginBottom:10}}>
          <h4>{tableKey}</h4>
          {tableOrders && Object.entries(tableOrders).map(([orderId, o]) => (
            <div key={orderId} style={{paddingLeft:8}}>
              <div>Order {orderId} — {o.status}</div>
              <ul>
                {o.items && o.items.map((it, idx) => (
                  <li key={idx}>{it.name} x{it.qty}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
