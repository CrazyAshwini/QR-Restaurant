import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { RoleProvider, useRole } from './context/RoleContext'
import RoleSelector from './components/RoleSelector'
import Home from './pages/Home'
import Table from './pages/Table'
import Kitchen from './pages/Kitchen'
import BillDesk from './pages/BillDesk'
import Manage from './pages/Manage'
import Unauthorized from './pages/Unauthorized'

const routeConfig = [
  { path: '/', label: 'Public Home', roles: ['public', 'admin'] },
  { path: '/table/1', label: 'Table 1', roles: ['customer', 'admin'] },
  { path: '/kitchen', label: 'Kitchen', roles: ['chef', 'admin'] },
  { path: '/billdesk', label: 'Bill Desk', roles: ['cashier', 'admin'] },
  { path: '/manage', label: 'Manager', roles: ['manager', 'admin'] },
]

function isRouteAllowed(pathname, role) {
  if (pathname.startsWith('/table/')) {
    return ['customer', 'admin'].includes(role)
  }
  const route = routeConfig.find((item) => item.path === pathname)
  return route ? route.roles.includes(role) : false
}

function getNavLinks(role) {
  if (role === 'admin') return routeConfig
  return routeConfig.filter((item) => item.roles.includes(role))
}

function RequireRole({ roles, children }) {
  const { effectiveRole } = useRole()
  return roles.includes(effectiveRole) ? children : <Unauthorized />
}

function AppContent() {
  const location = useLocation()
  const { effectiveRole } = useRole()
  const links = getNavLinks(effectiveRole)

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/">Campus Cafe</Link>
        <nav>
          {links.map((link) => (
            <Link key={link.path} to={link.path}>{link.label}</Link>
          ))}
        </nav>
        <RoleSelector />
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <RequireRole roles={['public', 'admin']}>
                <Home />
              </RequireRole>
            }
          />
          <Route
            path="/table/:id"
            element={
              <RequireRole roles={['customer', 'admin']}>
                <Table />
              </RequireRole>
            }
          />
          <Route
            path="/kitchen"
            element={
              <RequireRole roles={['chef', 'admin']}>
                <Kitchen />
              </RequireRole>
            }
          />
          <Route
            path="/billdesk"
            element={
              <RequireRole roles={['cashier', 'admin']}>
                <BillDesk />
              </RequireRole>
            }
          />
          <Route
            path="/manage"
            element={
              <RequireRole roles={['manager', 'admin']}>
                <Manage />
              </RequireRole>
            }
          />
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <RoleProvider>
      <AppContent />
    </RoleProvider>
  )
}
