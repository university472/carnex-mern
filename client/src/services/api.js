// client/src/services/api.js
import axios from 'axios'

const TOKEN_KEY = 'carnex_admin_token'

// ── Token helpers using sessionStorage ───────────────────────
// sessionStorage clears automatically when:
// - Browser tab is closed
// - Browser window is closed
// - User opens a new tab/window (separate session)
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

// ── Axios instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname

      const publicAdminPaths = [
        '/admin/login',
        '/admin/forgot-password',
        '/admin/reset-password'
      ]

      const isProtectedAdmin =
        currentPath.startsWith('/admin') &&
        !publicAdminPaths.includes(currentPath)

      if (isProtectedAdmin) {
        clearToken()
        window.location.href = '/admin/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
