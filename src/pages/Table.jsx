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
    <div className="page table table-page">
      <header className="table-header">
        <div>
          <p className="eyebrow">Campus Dhaba</p>
          <h2>Table {id} — Indian QR menu</h2>
          <p className="hero-copy">Browse the menu, add your favorite dishes, and place your order directly from your table.</p>
        </div>
        <div className="table-status-card">
          <h4>Table {id}</h4>
          <p>Ready to order</p>
          <div className="badge badge-accent">QR table service</div>
        </div>
      </header>

      <div className="table-grid">
        <section className="menu-panel">
          {Object.entries(menu).map(([cat, items]) => (
            <div key={cat} className="menu-category">
              <h3>{cat}</h3>
              <div className="menu-grid">
                {Object.entries(items).map(([k, item]) => (
                  <article key={k} className="menu-card">
                    <img src={item.image} alt={item.name} />
                    <div className="menu-card-body">
                      <div className="menu-card-top">
                        <span className="badge">{item.veg ? 'Veg' : 'Non-veg'}</span>
                        <span>{item.prep} min</span>
                      </div>
                      <h4>{item.name}</h4>
                      <div className="menu-card-footer">
                        <strong>${item.price.toFixed(2)}</strong>
                        <button onClick={() => addToCart(cat, k)} className="btn btn-small">Add</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <aside className="cart-panel">
          <div className="cart-card">
            <h3>Your Cart</h3>
            {Object.keys(cart).length === 0 ? (
              <div className="empty-state">Your cart is empty.</div>
            ) : (
              <ul className="cart-list">
                {Object.entries(cart).map(([k, it]) => (
                  <li key={k} className="cart-item">
                    <div>
                      <strong>{it.name}</strong>
                      <div>x{it.qty}</div>
                    </div>
                    <div className="cart-actions">
                      <span>${(it.qty * it.price).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(k)} className="btn btn-secondary btn-small">-</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="cart-total">
              <span>Total</span>
              <strong>${Object.values(cart).reduce((sum, it) => sum + it.qty * it.price, 0).toFixed(2)}</strong>
            </div>
            <button onClick={handlePlaceOrder} disabled={Object.keys(cart).length===0} className="btn btn-block">Place Order</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
