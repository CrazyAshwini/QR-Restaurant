import React from 'react'
import { useRole } from '../context/RoleContext'

export default function RoleSelector() {
  const { role, effectiveRole, impersonatedRole, roleLabels, setRole, resetImpersonation } = useRole()

  function handleChange(event) {
    setRole(event.target.value)
  }

  return (
    <div className="role-selector">
      <label>
        Role:
        <select value={effectiveRole} onChange={handleChange}>
          {Object.entries(roleLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </label>
      {impersonatedRole && (
        <button className="btn btn-secondary small" onClick={resetImpersonation}>
          Stop impersonating
        </button>
      )}
      <div className="role-note">Current role: {role}{impersonatedRole ? ` → impersonating ${impersonatedRole}` : ''}</div>
    </div>
  )
}
