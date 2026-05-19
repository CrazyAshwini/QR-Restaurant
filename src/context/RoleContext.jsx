import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ROLE_LABELS = {
  public: 'Public',
  customer: 'Customer',
  chef: 'Chef',
  cashier: 'Cashier',
  manager: 'Manager',
  admin: 'Admin'
}

const DEFAULT_ROLE = 'public'

const RoleContext = createContext(null)

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    const saved = window.localStorage.getItem('campusCafeRole')
    return saved || DEFAULT_ROLE
  })
  const [impersonatedRole, setImpersonatedRole] = useState(null)

  useEffect(() => {
    window.localStorage.setItem('campusCafeRole', role)
    if (role !== 'admin') {
      setImpersonatedRole(null)
    }
  }, [role])

  const effectiveRole = impersonatedRole || role

  const setRole = (nextRole) => {
    if (role === 'admin' && nextRole !== 'admin') {
      setImpersonatedRole(nextRole)
      return
    }
    setImpersonatedRole(null)
    setRoleState(nextRole)
  }

  const resetImpersonation = () => setImpersonatedRole(null)

  const value = useMemo(() => ({
    role,
    effectiveRole,
    impersonatedRole,
    roleLabels: ROLE_LABELS,
    setRole,
    resetImpersonation,
  }), [role, effectiveRole, impersonatedRole])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
