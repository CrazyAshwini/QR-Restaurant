import React, { useEffect, useState } from 'react'
import { getTablesListener, listenAllOrders, recordPayment, updateTable } from '../services/firebaseService'
import demoData from '../data/demo-data.json'

export default function BillDesk() {
  const [tables, setTables] = useState(demoData.tables)
  const [orders, setOrders] = useState(demoData.orders || {})
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const offT = getTablesListener((t) => { if (t) setTables(t) })
    const offO = listenAllOrders((o) => { if (o) setOrders(o) })
    return () => { offT && offT(); offO && offO() }
  }, [])

  function openTable(key) {
    setSelected(key)
  }

  async function markPaid(tableKey) {
    // simplistic: sum items and record payment
    const tableOrders = orders[tableKey] || {}
    let total = 0
    Object.values(tableOrders).forEach(o => {
      if (!o.items) return
      o.items.forEach(it => total += (it.price || 0) * (it.qty || 1))
    })
    const payment = { table: tableKey, amount: total, mode: 'cash', timestamp: Date.now() }
    const pid = await recordPayment(payment)
    await updateTable(tableKey.replace('table',''), { status: 'free', lastPayment: Date.now(), paid: true })
    alert('Marked paid — payment id: ' + pid)
  }

  return (
    <div className="page billdesk">
      <h2>Bill Desk</h2>
      <div style={{display:'flex',gap:20}}>
        <div style={{width:300}}>
          <h4>Tables</h4>
          <ul>
            {Object.entries(tables).map(([k,v]) => (
              <li key={k} style={{marginBottom:8}}>
                <button onClick={() => openTable(k)}>{k} — {v.status}</button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{flex:1}}>
          {selected ? (
            <div>
              <h4>Bill — {selected}</h4>
              <div>
                {(orders[selected] && Object.entries(orders[selected]).map(([oid,o]) => (
                  <div key={oid} style={{borderBottom:'1px solid #eee',padding:8}}>
                    <div>Order {oid} — {o.status}</div>
                    <ul>
                      {o.items && o.items.map((it,idx) => <li key={idx}>{it.name} x{it.qty}</li>)}
                    </ul>
                  </div>
                ))) || <div>No orders for this table</div>}
              </div>
              <div style={{marginTop:12}}>
                <button onClick={() => markPaid(selected)}>Mark Paid & Clear</button>
              </div>
            </div>
          ) : (
            <div>Select a table</div>
          )}
        </div>
      </div>
    </div>
  )
}
