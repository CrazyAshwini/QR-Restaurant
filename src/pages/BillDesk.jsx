import { useState } from 'react'
import { useRestaurant } from '../context/RestaurantContext'

export default function BillDesk() {
  const { tables, getTableBill, processPayment, getTodaysRevenue } = useRestaurant()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [selectedTable, setSelectedTable] = useState(null)
  const [paymentMode, setPaymentMode] = useState(null)
  const [discount, setDiscount] = useState(0)

  const handleLogin = () => {
    if (pin === '5678') {
      setIsAuthenticated(true)
    }
  }

  const handlePayment = () => {
    if (selectedTable && paymentMode) {
      const bill = getTableBill(selectedTable)
      const finalTotal = bill.total - discount
      processPayment(selectedTable, finalTotal, paymentMode)
      setSelectedTable(null)
      setPaymentMode(null)
      setDiscount(0)
    }
  }

  const getTableStatus = (tableNum) => {
    const table = tables[tableNum]
    if (table.billRequested) return 'bill'
    if (table.status === 'occupied') return 'occupied'
    return 'free'
  }

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h2>💳 Bill Desk</h2>
          <div className="form-group">
            <label>Enter PIN</label>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter PIN" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>
            Login
          </button>
          <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>Default PIN: 5678</p>
        </div>
      </div>
    )
  }

  const bill = selectedTable ? getTableBill(selectedTable) : null
  const finalTotal = bill ? bill.total - discount : 0

  return (
    <div>
      <div className="staff-nav">
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>💳 Bill Desk</span>
        <div>
          <span style={{ marginRight: '20px' }}>Today's Revenue: <strong>${getTodaysRevenue().toFixed(2)}</strong></span>
          <button className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </div>

      <div className="container" style={{ padding: '20px' }}>
        <div className="grid" style={{ gridTemplateColumns: selectedTable ? '1fr 2fr' : '1fr', gap: '20px' }}>
          <div>
            <h3 style={{ marginBottom: '15px' }}>Tables Status</h3>
            <div className="table-grid">
              {Array.from({ length: 15 }, (_, i) => i + 1).map(tableNum => {
                const status = getTableStatus(tableNum)
                return (
                  <div
                    key={tableNum}
                    className={`table-cell ${status}`}
                    onClick={() => setSelectedTable(tableNum)}
                    style={{ border: selectedTable === tableNum ? '3px solid #333' : 'none' }}
                  >
                    {tableNum}
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <span><span className="badge" style={{ background: '#4caf50', color: 'white' }}>Free</span></span>
              <span><span className="badge" style={{ background: '#f4a261', color: 'white' }}>Occupied</span></span>
              <span><span className="badge" style={{ background: '#e63946', color: 'white' }}>Bill Request</span></span>
            </div>
          </div>

          {selectedTable && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Bill - Table {selectedTable}</h2>
                <button className="btn btn-secondary" onClick={() => { setSelectedTable(null); setPaymentMode(null); setDiscount(0); }}>Close</button>
              </div>

              {bill.items.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center' }}>No orders for this table</p>
              ) : (
                <>
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
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>Discount ($)</label>
                    <input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} min="0" max={bill.total} />
                  </div>
                  <div className="bill-total">
                    <span>Total</span>
                    <span style={{ color: '#e63946' }}>${finalTotal.toFixed(2)}</span>
                  </div>

                  <h4 style={{ marginTop: '20px' }}>Payment Mode</h4>
                  <div className="payment-modes">
                    <button className={`payment-btn ${paymentMode === 'cash' ? 'selected' : ''}`} onClick={() => setPaymentMode('cash')}>
                      💵 Cash
                    </button>
                    <button className={`payment-btn ${paymentMode === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMode('card')}>
                      💳 Card
                    </button>
                    <button className={`payment-btn ${paymentMode === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMode('upi')}>
                      📱 UPI
                    </button>
                  </div>

                  <button className="btn btn-success" style={{ width: '100%', marginTop: '20px', fontSize: '18px' }} disabled={!paymentMode} onClick={handlePayment}>
                    ✅ Mark Paid & Clear Table
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}