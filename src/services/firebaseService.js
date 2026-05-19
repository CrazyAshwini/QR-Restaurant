import { ref, onValue, push, set, update, get } from 'firebase/database'
import { db, isConfigured } from '../firebase/config'

const listeners = []

function safe(cb) {
  if (!isConfigured) return null
  return cb()
}

export function getMenuListener(cb) {
  if (!isConfigured) return null
  const r = ref(db, 'menu')
  const off = onValue(r, snapshot => cb(snapshot.val()))
  listeners.push(() => off())
  return () => off()
}

export async function placeOrder(tableId, order) {
  return safe(async () => {
    const ordersRef = ref(db, `orders/table${tableId}`)
    const newOrderRef = push(ordersRef)
    await set(newOrderRef, order)
    await update(ref(db, `tables/table${tableId}`), { status: 'ordering', lastOrder: Date.now() })
    return newOrderRef.key
  }) || (console.log('Firebase not configured — order would be:', { tableId, order }), null)
}

export function listenAllOrders(cb) {
  if (!isConfigured) return null
  const r = ref(db, 'orders')
  const off = onValue(r, snapshot => cb(snapshot.val()))
  listeners.push(() => off())
  return () => off()
}

export function getTablesListener(cb) {
  if (!isConfigured) return null
  const r = ref(db, 'tables')
  const off = onValue(r, snapshot => cb(snapshot.val()))
  listeners.push(() => off())
  return () => off()
}

export async function updateTable(tableId, patch) {
  return safe(async () => {
    await update(ref(db, `tables/table${tableId}`), patch)
  })
}

export async function recordPayment(payment) {
  return safe(async () => {
    const pRef = ref(db, 'payments')
    const newRef = push(pRef)
    await set(newRef, payment)
    return newRef.key
  }) || (console.log('Firebase not configured — payment would be:', payment), null)
}

export async function fetchAllPayments() {
  if (!isConfigured) return null
  const snap = await get(ref(db, 'payments'))
  return snap.val()
}

export async function seedDemoData(demo) {
  return safe(async () => {
    if (!demo) return
    // write menu and tables, and empty orders
    await set(ref(db, 'menu'), demo.menu)
    await set(ref(db, 'tables'), demo.tables)
    await set(ref(db, 'orders'), demo.orders || {})
  }) || console.log('Firebase not configured — skip seed')
}

export function teardown() {
  listeners.forEach(fn => fn())
}
