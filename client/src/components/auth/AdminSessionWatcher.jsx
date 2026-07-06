import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AdminSessionWatcher() {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const leavingAdmin = !location.pathname.startsWith('/dealer-panel')

    if (isAuthenticated && leavingAdmin) {
      logout()
    }
  }, [location.pathname, isAuthenticated, logout])

  return null
}
