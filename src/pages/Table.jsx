import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMenuListener, placeOrder } from '../services/firebaseService'

import demoData from '../data/demo-data.json'

export default function Table() {
  const { id } = useParams()
  const [menu, setMenu] = useState(demoData.menu)
  const [cart, setCart] = useState({})

  useEffect(() => {
    const off = getMenuListener((m) => {
      if (m) setMenu(m)
    })
    return () => off && off()
  }, [])

  function addToCart(cat, key) {
    const item = menu[cat][key]
    setCart(prev => {
      const next = { ...prev }
      if (!next[key]) next[key] = { ...item, qty: 0 }
      next[key].qty += 1
      return next
    })
  }

  function removeFromCart(key) {
    setCart(prev => {
      const next = { ...prev }
      if (!next[key]) return next
      next[key].qty -= 1
      if (next[key].qty <= 0) delete next[key]
      return next
    })
  }

  async function handlePlaceOrder() {
    const items = Object.entries(cart).map(([key, v]) => ({ id: key, name: v.name, qty: v.qty, price: v.price }))
    const order = {
      items,
      status: 'received',
      tableId: id,
      timestamp: Date.now()
    }
    const key = await placeOrder(id, order)
    if (key !== null) {
      setCart({})
      alert('Order placed!')
    } else {
      // demo fallback
      console.log('Demo order:', order)
      setCart({})
      alert('Demo order created (not sent to Firebase).')
    }
  }

  return (
    <div className="page table">
      <h2>Table {id} — Campus Cafe</h2>
      <div style={{display:'flex',gap:24}}>
        <div style={{flex:1}}>
          <h3>Menu</h3>
          {Object.entries(menu).map(([cat, items]) => (
            <div key={cat}>
              <h4>{cat}</h4>
              <ul>
                {Object.entries(items).map(([k, item]) => (
                  <li key={k} style={{marginBottom:8}}>
                    <strong>{item.name}</strong> — ${item.price.toFixed(2)}{' '}
                    <button onClick={() => addToCart(cat, k)} style={{marginLeft:8}}>Add</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <aside style={{width:320,borderLeft:'1px solid #eee',paddingLeft:16}}>
          <h3>Cart</h3>
          {Object.keys(cart).length === 0 && <div>Cart is empty</div>}
          <ul>
            {Object.entries(cart).map(([k, it]) => (
              <li key={k}>
                {it.name} x{it.qty} — ${ (it.qty * it.price).toFixed(2)}{' '}
                <button onClick={() => removeFromCart(k)} style={{marginLeft:8}}>-</button>
              </li>
            ))}
          </ul>
          <div style={{marginTop:12}}>
            <button onClick={handlePlaceOrder} disabled={Object.keys(cart).length===0}>Place Order</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
