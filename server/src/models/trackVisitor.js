// server/src/middleware/trackVisitor.js
const crypto = require('crypto')
const PageView = require('../models/PageView')

/**
 * Parse a basic device type from user agent string.
 * No external library — simple regex patterns.
 */
function parseDevice(ua) {
  if (!ua) return 'unknown'
  const s = ua.toLowerCase()
  if (
    s.includes('ipad') ||
    s.includes('tablet') ||
    (s.includes('android') && !s.includes('mobile'))
  ) {
    return 'tablet'
  }
  if (
    s.includes('mobile') ||
    s.includes('iphone') ||
    s.includes('ipod') ||
    s.includes('android') ||
    s.includes('windows phone')
  ) {
    return 'mobile'
  }
  if (
    s.includes('mozilla') ||
    s.includes('chrome') ||
    s.includes('safari') ||
    s.includes('firefox') ||
    s.includes('edge') ||
    s.includes('opera')
  ) {
    return 'desktop'
  }
  return 'unknown'
}

/**
 * Parse browser name from user agent string.
 */
function parseBrowser(ua) {
  if (!ua) return 'unknown'
  const s = ua.toLowerCase()
  if (s.includes('edg/') || s.includes('edge/')) return 'Edge'
  if (s.includes('opr/') || s.includes('opera')) return 'Opera'
  if (s.includes('chrome') && !s.includes('chromium')) return 'Chrome'
  if (s.includes('chromium')) return 'Chromium'
  if (s.includes('firefox')) return 'Firefox'
  if (s.includes('safari') && !s.includes('chrome')) return 'Safari'
  if (s.includes('msie') || s.includes('trident')) return 'IE'
  return 'Other'
}

/**
 * Map a URL path to a human-readable page name.
 */
function resolvePage(path) {
  if (!path || path === '/') return 'Home'

  const clean = path.split('?')[0].toLowerCase()

  if (clean === '/') return 'Home'
  if (clean === '/inventory') return 'Inventory'
  if (clean.startsWith('/vehicles/')) return 'Vehicle Detail'
  if (clean === '/financing') return 'Financing'
  if (clean === '/trade-in') return 'Trade-In'
  if (clean === '/test-drive') return 'Test Drive'
  if (clean === '/sourcing') return 'Sourcing'
  if (clean === '/about') return 'About'
  if (clean === '/contact') return 'Contact'
  if (clean.startsWith('/admin')) return null // never track admin
  return 'Other'
}

/**
 * Hash IP address for privacy (one-way, non-reversible).
 */
function hashIP(ip) {
  if (!ip) return 'unknown'
  return crypto
    .createHash('sha256')
    .update(ip + (process.env.IP_HASH_SALT || 'carnex_salt_2024'))
    .digest('hex')
    .slice(0, 16) // truncate for storage efficiency
}

/**
 * Extract vehicle ID from path /vehicles/:id
 */
function extractVehicleId(path) {
  const match = path.match(/^\/vehicles\/([a-f0-9]{24})/i)
  return match ? match[1] : null
}

/**
 * Middleware: track public page visits.
 *
 * - Runs async and never blocks the request.
 * - Ignores admin routes, API routes, static assets.
 * - Bot detection: skips common crawlers.
 * - Records are inserted in background — errors are silently logged.
 */
function trackVisitor(req, res, next) {
  // Always call next immediately — tracking never blocks
  next()

  // Run tracking asynchronously after response starts
  setImmediate(async () => {
    try {
      const path = req.path || req.url || '/'
      const ua = req.headers['user-agent'] || ''

      // Skip: API routes
      if (path.startsWith('/api')) return

      // Skip: admin panel routes
      if (path.startsWith('/admin')) return

      // Skip: static assets
      if (
        /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map)$/i.test(path)
      ) {
        return
      }

      // Skip: known bots and crawlers
      const botPatterns = [
        'googlebot',
        'bingbot',
        'slurp',
        'duckduckbot',
        'baiduspider',
        'yandexbot',
        'sogou',
        'exabot',
        'facebot',
        'ia_archiver',
        'bot',
        'crawler',
        'spider',
        'scraper',
        'curl',
        'wget',
        'python-requests',
        'axios',
        'node-fetch',
        'postman'
      ]
      const uaLower = ua.toLowerCase()
      if (botPatterns.some((bot) => uaLower.includes(bot))) return

      const pageName = resolvePage(path)
      if (!pageName) return // null = skip (admin pages)

      const ip =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.ip ||
        ''

      const referrer =
        req.headers['referer'] || req.headers['referrer'] || 'direct'

      const country =
        req.headers['cf-ipcountry'] || // Cloudflare
        req.headers['x-country-code'] || // Some proxies
        ''

      const vehicleId = extractVehicleId(path)

      await PageView.create({
        page: pageName,
        path: path.slice(0, 300), // limit length
        referrer: referrer.slice(0, 300),
        ipHash: hashIP(ip),
        userAgent: ua.slice(0, 500),
        device: parseDevice(ua),
        browser: parseBrowser(ua),
        country: country.slice(0, 10),
        vehicleId: vehicleId || null
      })
    } catch (err) {
      // Never crash the server over tracking errors
      console.error('[trackVisitor] Failed to record visit:', err.message)
    }
  })
}

module.exports = trackVisitor
