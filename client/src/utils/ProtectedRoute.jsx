// client/src/utils/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Wait for sessionStorage token verification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 rounded-full border-2 border-brand-primary
                          border-t-transparent animate-spin"
          />
          <p className="text-xs text-brand-muted">Verifying session…</p>
        </div>
      </div>
    )
  }

  // No valid session → redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/dealer-panel/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
