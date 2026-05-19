import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRestaurant } from '../context/RestaurantContext'

export default function CustomerPanel() {
  const { tableId } = useParams()
  const { tables, startSession, placeOrder, getTableOrders, requestBill, getTableBill } = useRestaurant()
  const [step, setStep] = useState('welcome')
  const [guests, setGuests] = useState(1)
  const [cart, setCart] = useState([])
  const [sessionId, setSessionId] = useState(null)

  const table = tables[parseInt(tableId)]
  const orders = getTableOrders(parseInt(tableId))
  const bill = getTableBill(parseInt(tableId))

  useEffect(() => {
    if (table?.status !== 'free') {
      setStep('menu')
      setSessionId(table.sessionId)
    }
    if (table?.billRequested) {
      setStep('bill')
    }
  }, [table])

  const handleStartSession = () => {
    const sid = startSession(parseInt(tableId), guests)
    setSessionId(sid)
    setStep('menu')
  }

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id)
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...item, qty: 1, note: '' }])
    }
  }

  const updateQty = (itemId, delta) => {
    setCart(cart.map(c => {
      if (c.id === itemId) {
        const newQty = c.qty + delta
        return newQty > 0 ? { ...c, qty: newQty } : c
      }
      return c
    }).filter(c => c.qty > 0))
  }

  const removeItem = (itemId) => {
    setCart(cart.filter(c => c.id !== itemId))
  }

  const handlePlaceOrder = () => {
    if (cart.length > 0) {
      placeOrder(parseInt(tableId), cart)
      setCart([])
    }
  }

  const handleRequestBill = () => {
    requestBill(parseInt(tableId))
    setStep('bill')
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  if (step === 'welcome') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1d3557, #457b9d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '90%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#e63946', fontSize: '28px' }}>La Bella Italia</h2>
          <p style={{ fontSize: '20px', marginBottom: '20px' }}>Table {tableId}</p>
          <div className="form-group">
            <label>Number of Guests</label>
            <select value={guests} onChange={e => setGuests(parseInt(e.target.value))}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStartSession}>
            Start Order
          </button>
        </div>
      </div>
    )
  }

  if (step === 'bill') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Bill</h2>
          {bill.items.map((item, idx) => (
            <div key={idx} className="bill-item">
              <span>{item.qty}x {item.name}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="bill-item">
            <span>Subtotal</span>
            <span>${bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="bill-item">
            <span>Tax (10%)</span>
            <span>${bill.tax.toFixed(2)}</span>
          </div>
          <div className="bill-total">
            <span>Total</span>
            <span>${bill.total.toFixed(2)}</span>
          </div>
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            Please proceed to the counter to pay
          </p>
          <p style={{ textAlign: 'center', color: '#4caf50', fontWeight: 'bold' }}>
            Thank you for dining with us!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ background: '#e63946', color: 'white', padding: '15px', textAlign: 'center', position: 'sticky', top: 0 }}>
        <span style={{ fontWeight: 'bold' }}>Table {tableId}</span>
        <span style={{ float: 'right' }}>
          {cart.length > 0 && `$${cartTotal.toFixed(2)}`}
        </span>
      </div>

      {orders.length > 0 && (
        <div style={{ background: '#fff3cd', padding: '15px', borderBottom: '1px solid #ffeeba' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Your Orders</h4>
          {orders.map(order => (
            <div key={order.id} style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {new Date(order.timestamp).toLocaleTimeString()}
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>{item.qty}x {item.name}</span>
                  <span className={`badge ${order.status === 'ready' ? 'badge-veg' : order.status === 'preparing' ? 'badge-spicy' : 'badge-non-veg'}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '20px' }}>
        {cart.length > 0 && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h4>Your Cart</h4>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <div>{item.name}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>${item.price.toFixed(2)} each</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => removeItem(item.id)}>✕</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }} onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}

        <MenuItems onAdd={addToCart} cart={cart} />

        {orders.length > 0 && (
          <button className="btn btn-success" style={{ width: '100%', marginTop: '20px' }} onClick={handleRequestBill}>
            Request Bill
          </button>
        )}
      </div>
    </div>
  )
}

function MenuItems({ onAdd, cart }) {
  const { menu } = useRestaurant()
  const [category, setCategory] = useState('starters')

  const categories = [
    { key: 'starters', label: 'Starters' },
    { key: 'mains', label: 'Mains' },
    { key: 'desserts', label: 'Desserts' },
    { key: 'drinks', label: 'Drinks' },
  ]

  const items = menu[category] || []

  return (
    <div>
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`category-tab ${category === cat.key ? 'active' : ''}`}
            onClick={() => setCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div>
        {items.map(item => {
          const inCart = cart.find(c => c.id === item.id)
          return (
            <div key={item.id} className="menu-item">
              <img src={item.image} alt={item.name} className="menu-item-image" />
              <div className="menu-item-content">
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-desc">{item.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="menu-item-price">${item.price.toFixed(2)}</div>
                  <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={() => onAdd(item)}>
                    {inCart ? `Add More (${inCart.qty})` : 'Add'}
                  </button>
                </div>
                <div className="menu-item-badges">
                  <span className={`badge ${item.veg ? 'badge-veg' : 'badge-non-veg'}`}>
                    {item.veg ? 'Veg' : 'Non-Veg'}
                  </span>
                  {item.spicy && <span className="badge badge-spicy">Spicy</span>}
                  <span style={{ color: '#666', fontSize: '12px' }}>{item.prepTime} min</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}