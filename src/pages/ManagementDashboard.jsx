import { useState } from 'react'
import { useRestaurant } from '../context/RestaurantContext'

export default function ManagementDashboard() {
  const { 
    tables, getAllOrders, getTodaysRevenue, getTodaysOrders, 
    getRevenue, getTableOrders, updateOrderStatus, startSession, processPayment 
  } = useRestaurant()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [selectedTable, setSelectedTable] = useState(null)

  const handleLogin = () => {
    if (pin === '9999') {
      setIsAuthenticated(true)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h2>📊 Management Dashboard</h2>
          <div className="form-group">
            <label>Enter PIN</label>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter PIN" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>
            Login
          </button>
          <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>Default PIN: 9999</p>
        </div>
      </div>
    )
  }

  const orders = getAllOrders()
  const todaysOrders = getTodaysOrders()
  const revenue = getTodaysRevenue()
  const totalRevenue = getRevenue()
  const occupiedCount = Object.values(tables).filter(t => t.status === 'occupied').length

  const topSelling = todaysOrders.flatMap(o => o.items)
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.qty
      return acc
    }, {})
  const topItems = Object.entries(topSelling).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div>
      <div className="staff-nav">
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>📊 Order Management</span>
        <div>
          <span style={{ marginRight: '20px' }}>{new Date().toLocaleDateString()}</span>
          <button className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </div>

      <div className="container" style={{ padding: '20px' }}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">${revenue.toFixed(2)}</div>
            <div className="stat-label">Today's Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{todaysOrders.length}</div>
            <div className="stat-label">Today's Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{occupiedCount}/15</div>
            <div className="stat-label">Tables Occupied</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">${totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ marginBottom: '15px' }}>15 Table Grid</h3>
            <div className="table-grid">
              {Array.from({ length: 15 }, (_, i) => i + 1).map(tableNum => {
                const table = tables[tableNum]
                let status = 'free'
                if (table.billRequested) status = 'bill'
                else if (table.status === 'occupied') status = 'occupied'
                return (
                  <div
                    key={tableNum}
                    className={`table-cell ${status}`}
                    onClick={() => setSelectedTable(tableNum)}
                    style={{ border: selectedTable === tableNum ? '3px solid #333' : 'none' }}
                  >
                    T{tableNum}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '15px' }}>Top Selling Today</h3>
            <div className="card">
              <ul className="top-items">
                {topItems.length > 0 ? topItems.map(([name, qty], idx) => (
                  <li key={idx}>
                    <span>{idx + 1}. {name}</span>
                    <strong>{qty} sold</strong>
                  </li>
                )) : (
                  <li style={{ color: '#666', justifyContent: 'center' }}>No orders yet</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>Live Order Feed</h3>
          <div className="card">
            <div className="live-feed">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="feed-item">
                  <span className="feed-time">{new Date(order.timestamp).toLocaleTimeString()}</span>
                  <span>Table {order.tableId}</span>
                  <span style={{ fontWeight: '500' }}>{order.items.length} items</span>
                  <span className={`badge ${order.status === 'ready' ? 'badge-veg' : order.status === 'preparing' ? 'badge-spicy' : 'badge-non-veg'}`}>
                    {order.status}
                  </span>
                </div>
              )) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No orders yet</p>
              )}
            </div>
          </div>
        </div>

        {selectedTable && (
          <div style={{ marginTop: '30px' }}>
            <h3>Table {selectedTable} Details</h3>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span>Status: <strong>{tables[selectedTable].status}</strong></span>
                <button className="btn btn-secondary" onClick={() => setSelectedTable(null)}>Close</button>
              </div>
              {(() => {
                const tableOrders = getTableOrders(selectedTable)
                return tableOrders.length > 0 ? (
                  tableOrders.map(order => (
                    <div key={order.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                      <div style={{ fontWeight: '500', marginBottom: '5px' }}>
                        Order {order.id.slice(0,6)} - {order.status}
                      </div>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ color: '#666', fontSize: '14px' }}>
                          {item.qty}x {item.name} - ${(item.price * item.qty).toFixed(2)}
                        </div>
                      ))}
                      <div style={{ marginTop: '10px' }}>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '14px' }} onClick={() => updateOrderStatus(selectedTable, order.id, 'cancelled')}>
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#666' }}>No orders for this table</p>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}