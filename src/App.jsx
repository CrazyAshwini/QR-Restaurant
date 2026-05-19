import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Table from './pages/Table'
import Kitchen from './pages/Kitchen'
import BillDesk from './pages/BillDesk'
import Manage from './pages/Manage'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/">Campus Cafe</Link>
        <nav>
          <Link to="/kitchen">Kitchen</Link>
          <Link to="/billdesk">Bill Desk</Link>
          <Link to="/manage">Manager</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/table/:id" element={<Table />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/billdesk" element={<BillDesk />} />
          <Route path="/manage" element={<Manage />} />
        </Routes>
      </main>
    </div>
  )
}
