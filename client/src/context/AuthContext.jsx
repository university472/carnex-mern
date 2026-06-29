// client/src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react'
import api, { getToken, setToken, clearToken } from '../services/api'

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * Verify token with backend on every app load / tab focus.
   * sessionStorage is empty on new tab/session → no token → not authenticated.
   */
  const verifyToken = useCallback(async () => {
    const token = getToken() // reads from sessionStorage

    if (!token) {
      // No token in this session → force login
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const { data } = await api.get('/admin/auth/me')
      const payload = data?.data || data
      setUser({
        id: payload.id || payload._id,
        name: payload.name,
        email: payload.email,
        role: payload.role
      })
    } catch {
      // Token invalid or expired → clear and force login
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Verify on every app mount
  useEffect(() => {
    verifyToken()
  }, [verifyToken])

  /**
   * Called after successful OTP verification.
   * Stores token in sessionStorage only — dies with the tab.
   */
  const login = useCallback((payload) => {
    if (payload?.token) {
      setToken(payload.token) // sessionStorage — not localStorage
    }
    setUser({
      id: payload?.id || payload?._id,
      name: payload?.name,
      email: payload?.email,
      role: payload?.role || 'admin'
    })
  }, [])

  /**
   * Sign out — clears session token and user state.
   * Also tells backend to clear httpOnly cookies.
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/admin/auth/logout')
    } catch {
      // Even if API fails, clear local session
    } finally {
      clearToken()
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        user,
        loading,
        login,
        logout,
        verifyToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
