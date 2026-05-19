import { createContext, useContext, useState, useEffect } from 'react'

const RestaurantContext = createContext()

const initialMenu = {
  starters: [
    { id: 's1', name: 'Calamari', price: 12.99, description: 'Crispy fried squid with garlic aioli', prepTime: 10, veg: false, spicy: false, image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=200' },
    { id: 's2', name: 'Bruschetta', price: 8.99, description: 'Toasted bread with tomatoes and basil', prepTime: 5, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=200' },
    { id: 's3', name: 'Soup of the Day', price: 6.99, description: 'Chef\'s daily creation', prepTime: 8, veg: false, spicy: false, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200' },
    { id: 's4', name: 'Spring Rolls', price: 7.99, description: 'Crispy vegetable rolls', prepTime: 8, veg: true, spicy: true, image: 'https://images.unsplash.com/photo-1606525437679-37f9b0f9d5b5?w=200' },
  ],
  mains: [
    { id: 'm1', name: 'Ribeye Steak', price: 42.99, description: '12oz premium ribeye with herb butter', prepTime: 25, veg: false, spicy: false, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200' },
    { id: 'm2', name: 'Margherita Pizza', price: 18.99, description: 'Fresh mozzarella, tomatoes, basil', prepTime: 15, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200' },
    { id: 'm3', name: 'Grilled Salmon', price: 28.99, description: 'Atlantic salmon with lemon dill sauce', prepTime: 20, veg: false, spicy: false, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200' },
    { id: 'm4', name: 'Risotto', price: 19.99, description: 'Creamy mushroom risotto', prepTime: 18, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=200' },
    { id: 'm5', name: 'Chicken Parmesan', price: 24.99, description: 'Breaded chicken with marinara and cheese', prepTime: 22, veg: false, spicy: false, image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=200' },
  ],
  desserts: [
    { id: 'd1', name: 'Tiramisu', price: 9.99, description: 'Classic Italian coffee dessert', prepTime: 5, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200' },
    { id: 'd2', name: 'Chocolate Lava Cake', price: 11.99, description: 'Warm chocolate cake with molten center', prepTime: 12, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=200' },
    { id: 'd3', name: 'Cheesecake', price: 8.99, description: 'New York style cheesecake', prepTime: 5, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200' },
  ],
  drinks: [
    { id: 'dr1', name: 'Red Wine', price: 11.00, description: 'House selection', prepTime: 2, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200' },
    { id: 'dr2', name: 'White Wine', price: 11.00, description: 'House selection', prepTime: 2, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1566754436893-a5fc3af4eb33?w=200' },
    { id: 'dr3', name: 'Craft Beer', price: 7.00, description: 'Local IPA', prepTime: 2, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=200' },
    { id: 'dr4', name: 'Soft Drinks', price: 3.00, description: 'Coke, Sprite, Fanta', prepTime: 1, veg: true, spicy: false, image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=200' },
  ]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export function RestaurantProvider({ children }) {
  const [menu, setMenu] = useState(initialMenu)
  const [tables, setTables] = useState(() => {
    const t = {}
    for (let i = 1; i <= 15; i++) {
      t[i] = { id: i, status: 'free', sessionId: null, billRequested: false, orderCount: 0 }
    }
    return t
  })
  const [orders, setOrders] = useState({})
  const [sessions, setSessions] = useState({})
  const [payments, setPayments] = useState([])
  const [staff, setStaff] = useState([
    { id: 'chef1', name: 'Chef Marco', role: 'chef', pin: '1234' },
    { id: 'cash1', name: 'Lisa', role: 'cashier', pin: '5678' },
    { id: 'mgr1', name: 'Manager John', role: 'manager', pin: '9999' },
  ])

  const startSession = (tableId, guests = 1) => {
    const sessionId = generateId()
    const session = {
      id: sessionId,
      tableId,
      guests,
      startTime: Date.now(),
      endTime: null,
    }
    setSessions(prev => ({ ...prev, [sessionId]: session }))
    setTables(prev => ({
      ...prev,
      [tableId]: { ...prev[tableId], status: 'occupied', sessionId, billRequested: false }
    }))
    return sessionId
  }

  const placeOrder = (tableId, items) => {
    const orderId = generateId()
    const order = {
      id: orderId,
      tableId,
      items,
      status: 'received',
      timestamp: Date.now(),
      notes: '',
    }
    setOrders(prev => ({
      ...prev,
      [tableId]: [...(prev[tableId] || []), order]
    }))
    setTables(prev => ({
      ...prev,
      [tableId]: { ...prev[tableId], orderCount: (prev[tableId].orderCount || 0) + 1 }
    }))
    return orderId
  }

  const updateOrderStatus = (tableId, orderId, status) => {
    setOrders(prev => ({
      ...prev,
      [tableId]: prev[tableId]?.map(o => 
        o.id === orderId ? { ...o, status } : o
      ) || []
    }))
  }

  const startPreparing = (tableId, orderId) => {
    updateOrderStatus(tableId, orderId, 'preparing')
  }

  const markReady = (tableId, orderId) => {
    updateOrderStatus(tableId, orderId, 'ready')
  }

  const markServed = (tableId, orderId) => {
    updateOrderStatus(tableId, orderId, 'served')
  }

  const requestBill = (tableId) => {
    setTables(prev => ({
      ...prev,
      [tableId]: { ...prev[tableId], billRequested: true }
    }))
  }

  const processPayment = (tableId, amount, mode) => {
    const payment = {
      id: generateId(),
      tableId,
      amount,
      mode,
      timestamp: Date.now(),
    }
    setPayments(prev => [...prev, payment])
    setTables(prev => ({
      ...prev,
      [tableId]: { ...prev[tableId], status: 'free', sessionId: null, billRequested: false, orderCount: 0 }
    }))
    setOrders(prev => ({ ...prev, [tableId]: [] }))
    return payment
  }

  const getTableOrders = (tableId) => {
    return orders[tableId] || []
  }

  const getAllOrders = () => {
    const allOrders = []
    Object.entries(orders).forEach(([tableId, tableOrders]) => {
      tableOrders.forEach(order => {
        allOrders.push({ ...order, tableId: parseInt(tableId) })
      })
    })
    return allOrders.sort((a, b) => b.timestamp - a.timestamp)
  }

  const getRevenue = () => {
    return payments.reduce((sum, p) => sum + p.amount, 0)
  }

  const getTodaysRevenue = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return payments
      .filter(p => p.timestamp >= today.getTime())
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const getTodaysOrders = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const allOrders = getAllOrders()
    return allOrders.filter(o => o.timestamp >= today.getTime())
  }

  const getTableBill = (tableId) => {
    const tableOrders = orders[tableId] || []
    let subtotal = 0
    const items = []
    tableOrders.forEach(order => {
      order.items.forEach(item => {
        subtotal += item.price * item.qty
        items.push({ ...item, orderId: order.id, status: order.status })
      })
    })
    const tax = subtotal * 0.10
    return { items, subtotal, tax, total: subtotal + tax }
  }

  const value = {
    menu,
    tables,
    orders,
    sessions,
    payments,
    staff,
    startSession,
    placeOrder,
    updateOrderStatus,
    startPreparing,
    markReady,
    markServed,
    requestBill,
    processPayment,
    getTableOrders,
    getAllOrders,
    getRevenue,
    getTodaysRevenue,
    getTodaysOrders,
    getTableBill,
  }

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider')
  }
  return context
}