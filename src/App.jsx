import { Routes, Route, Navigate } from 'react-router-dom'
import PublicWebsite from './pages/PublicWebsite'
import CustomerPanel from './pages/CustomerPanel'
import KitchenPanel from './pages/KitchenPanel'
import BillDesk from './pages/BillDesk'
import ManagementDashboard from './pages/ManagementDashboard'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/table/:tableId" element={<CustomerPanel />} />
      <Route path="/kitchen" element={<KitchenPanel />} />
      <Route path="/billdesk" element={<BillDesk />} />
      <Route path="/manage" element={<ManagementDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App