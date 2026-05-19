import React, { useEffect, useState } from 'react'
import { getTablesListener, listenAllOrders, fetchAllPayments, seedDemoData } from '../services/firebaseService'
import demoData from '../data/demo-data.json'

export default function Manage() {
  const [tables, setTables] = useState(demoData.tables)
  const [orders, setOrders] = useState(demoData.orders || {})
  const [payments, setPayments] = useState({})

  useEffect(() => {
    const offT = getTablesListener((t) => { if (t) setTables(t) })
    const offO = listenAllOrders((o) => { if (o) setOrders(o) })
    // fetch payments once
    ;(async ()=>{
      const p = await fetchAllPayments()
      if (p) setPayments(p)
    })()
    return () => { offT && offT(); offO && offO() }
  }, [])

  function calcRevenue() {
    let total = 0
    Object.values(payments).forEach(p => total += p.amount || 0)
    return total
  }

  function topSelling() {
    const counts = {}
    Object.values(orders).forEach(tableOrders => {
      Object.values(tableOrders).forEach(o => {
        (o.items || []).forEach(it => counts[it.name] = (counts[it.name]||0) + (it.qty||1))
      })
    })
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5)
  }

  async function handleSeed() {
    await seedDemoData(demoData)
    alert('Seed request complete (check console).')
  }

  return (
    <div className="page manage">
      <h2>Order Management Dashboard</h2>
      <div style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <h3>Overview</h3>
          <div>Revenue: ${calcRevenue().toFixed(2)}</div>
          <div>Tables: {Object.keys(tables).length}</div>
        </div>
        <div style={{width:320}}>
          <h3>Top Selling</h3>
          <ol>
            {topSelling().map(([name,count])=> <li key={name}>{name} × {count}</li>)}
          </ol>
        </div>
      </div>
      <div style={{marginTop:20}}>
        <button onClick={handleSeed}>Seed Demo Data to Firebase</button>
      </div>
    </div>
  )
}
