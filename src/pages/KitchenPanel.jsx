import { useState } from 'react'
import { useRestaurant } from '../context/RestaurantContext'

export default function KitchenPanel() {
  const { tables, getAllOrders, startPreparing, markReady, markServed } = useRestaurant()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')

  const orders = getAllOrders()
  const newOrders = orders.filter(o => o.status === 'received')
  const inProgress = orders.filter(o => o.status === 'preparing')
  const ready = orders.filter(o => o.status === 'ready' || o.status === 'served')

  const handleLogin = () => {
    if (pin === '1234') {
      setIsAuthenticated(true)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h2>🍳 Kitchen Panel</h2>
          <div className="form-group">
            <label>Enter PIN</label>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter PIN" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>
            Login
          </button>
          <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>Default PIN: 1234</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="staff-nav">
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>🍽️ Kitchen Display</span>
        <div>
          <span style={{ marginRight: '20px' }}>{new Date().toLocaleTimeString()}</span>
          <button className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </div>

      {newOrders.length > 0 && (
        <div style={{ background: '#e63946', color: 'white', padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>
          🔔 {newOrders.length} New Order{newOrders.length > 1 ? 's' : ''}!
        </div>
      )}

      <div className="container" style={{ padding: '20px' }}>
        <div className="grid grid-3">
          <div>
            <h2 style={{ color: '#e63946', marginBottom: '20px' }}>🆕 New Orders ({newOrders.length})</h2>
            {newOrders.map(order => (
              <OrderCard key={order.id} order={order} onStart={() => startPreparing(order.tableId, order.id)} actionLabel="Start" />
            ))}
            {newOrders.length === 0 && <p style={{ color: '#666' }}>No new orders</p>}
          </div>

          <div>
            <h2 style={{ color: '#f4a261', marginBottom: '20px' }}>🔥 In Progress ({inProgress.length})</h2>
            {inProgress.map(order => (
              <OrderCard key={order.id} order={order} onReady={() => markReady(order.tableId, order.id)} actionLabel="Mark Ready" />
            ))}
            {inProgress.length === 0 && <p style={{ color: '#666' }}>No orders in progress</p>}
          </div>

          <div>
            <h2 style={{ color: '#4caf50', marginBottom: '20px' }}>✅ Ready ({ready.length})</h2>
            {ready.map(order => (
              <div key={order.id} className="order-card" style={{ borderLeft: '4px solid #4caf50' }}>
                <div className="order-header">
                  <strong>Table {order.tableId}</strong>
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>READY!</span>
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span>{item.qty}x {item.name}</span>
                  </div>
                ))}
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  {new Date(order.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {ready.length === 0 && <p style={{ color: '#666' }}>No ready orders</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order, onAction, actionLabel }) {
  const getElapsedTime = () => {
    const mins = Math.floor((Date.now() - order.timestamp) / 60000)
    return mins
  }

  const urgency = getElapsedTime() > 15 ? 'red' : getElapsedTime() > 10 ? 'yellow' : 'green'

  return (
    <div className="order-card" style={{ borderLeft: `4px solid ${urgency === 'red' ? '#e63946' : urgency === 'yellow' ? '#f4a261' : '#4caf50'}` }}>
      <div className="order-header">
        <strong style={{ fontSize: '18px' }}>Table {order.tableId}</strong>
        <span style={{ 
          background: urgency === 'red' ? '#e63946' : urgency === 'yellow' ? '#f4a261' : '#4caf50', 
          color: 'white', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {getElapsedTime()} min ago
        </span>
      </div>
      <div className="order-items">
        {order.items.map((item, idx) => (
          <div key={idx} className="order-item" style={{ fontSize: '16px' }}>
            <span><strong>{item.qty}x</strong> {item.name}</span>
            {item.note && <span style={{ color: '#e63946', fontSize: '12px' }}>Note: {item.note}</span>}
          </div>
        ))}
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}