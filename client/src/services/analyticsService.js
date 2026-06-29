// client/src/services/analyticsService.js

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Send a page view ping to the backend.
 * Uses navigator.sendBeacon when available (non-blocking, survives page unload).
 * Falls back to a fire-and-forget fetch.
 * Never throws — analytics must never affect the user experience.
 *
 * @param {string} path  - current URL path, e.g. /inventory
 * @param {string} title - page title, e.g. "Inventory"
 */
export function trackPageView(path, title) {
  try {
    const payload = JSON.stringify({
      path,
      title,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })

    const url = `${BASE_URL}/analytics/pageview`

    // Prefer sendBeacon — non-blocking and survives navigation
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon(url, blob)
      return
    }

    // Fallback: fire-and-forget fetch
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true
    }).catch(() => {})
  } catch {
    // Silently ignore — never affect user experience
  }
}
