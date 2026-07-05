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

  // ==========================
  // verify existing token
  // ==========================
  const verifyToken = useCallback(async () => {
    const token = getToken()

    if (!token) {
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
    } catch (err) {
      console.error('Token verification error:', err)
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==========================
  // login after OTP
  // ==========================
  const login = useCallback((payload) => {
    if (payload?.token) {
      setToken(payload.token)
    }

    setUser({
      id: payload?.id || payload?._id,
      name: payload?.name,
      email: payload?.email,
      role: payload?.role || 'admin'
    })
  }, [])

  // ==========================
  // logout
  // ==========================
  const logout = useCallback(async () => {
    try {
      await api.post('/admin/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
      // ignore
    } finally {
      clearToken()
      setUser(null)
    }
  }, [])

  // ==========================
  // check token on refresh
  // ==========================
  useEffect(() => {
    verifyToken()
  }, [verifyToken])

  // ==========================
  // AUTO LOGOUT WHEN ADMIN LEAVES
  // ==========================


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
