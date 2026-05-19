import React from 'react'
import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="page unauthorized">
      <h2>Access restricted</h2>
      <p>This panel is not available for your current role.</p>
      <p>Use the appropriate panel link or switch roles.</p>
      <Link to="/">Return home</Link>
    </div>
  )
}
