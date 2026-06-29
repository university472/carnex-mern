// client/src/hooks/useAnalytics.js
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../services/analyticsService'

// Map path → page title for analytics
function resolveTitle(pathname) {
  if (pathname === '/') return 'Home'
  if (pathname === '/inventory') return 'Inventory'
  if (pathname.startsWith('/vehicles/')) return 'Vehicle Detail'
  if (pathname === '/financing') return 'Financing'
  if (pathname === '/trade-in') return 'Trade-In'
  if (pathname === '/test-drive') return 'Test Drive'
  if (pathname === '/sourcing') return 'Sourcing'
  if (pathname === '/about') return 'About'
  if (pathname === '/contact') return 'Contact'
  return 'Page'
}

/**
 * Hook: automatically tracks every public page navigation.
 * Place once inside the router context (App.jsx or PublicLayout).
 */
export function useAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Skip admin routes entirely
    if (location.pathname.startsWith('/admin')) return

    const title = resolveTitle(location.pathname)

    // Small delay so the page has time to render
    const timer = setTimeout(() => {
      trackPageView(location.pathname + location.search, title)
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search])
}
