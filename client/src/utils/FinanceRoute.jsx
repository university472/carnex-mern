// client/src/utils/FinanceRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Must match FINANCE_ROLES on the server (admin vehicleController / finance routes).
const FINANCE_ROLES = ['super-admin', 'admin']

export function canViewFinance(user) {
  return FINANCE_ROLES.includes(user?.role)
}

// Guards profit/financial pages — any other role is sent back to the dashboard.
export function FinanceRoute() {
  const { user } = useAuth()

  if (!canViewFinance(user)) {
    return <Navigate to="/dealer-panel" replace />
  }

  return <Outlet />
}
