// server/src/routes/public/analytics.js
const express = require('express')
const validateRequest =
require('../../middleware/validateRequest')
const PageView = require('../../models/PageView')
const crypto = require('crypto')

const router = express.Router()

/**
 * POST /api/analytics/pageview
 * Receives page view beacon from the React SPA.
 * Lightweight — no auth, no heavy validation.
 * Returns 204 No Content always.
 */
router.post('/pageview', async (req, res) => {
  // Always respond immediately — never keep client waiting
  res.sendStatus(204)

  // Process asynchronously
  setImmediate(async () => {
    try {
      const { path, referrer, userAgent } = req.body

      if (!path) return

      // Skip admin paths sent accidentally
      if (path.startsWith('/admin')) return

      // Skip bot user agents
      const ua = (userAgent || '').toLowerCase()
      const botPatterns = [
        'googlebot',
        'bingbot',
        'bot',
        'crawler',
        'spider',
        'scraper',
        'curl',
        'wget',
        'python'
      ]
      if (botPatterns.some((b) => ua.includes(b))) return

      const ip =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.ip ||
        ''

      const ipHash = crypto
        .createHash('sha256')
        .update(ip + (process.env.IP_HASH_SALT || 'carnex_salt_2024'))
        .digest('hex')
        .slice(0, 16)

      // Resolve page name from path
      function resolvePage(p) {
        const clean = (p || '/').split('?')[0].toLowerCase()
        if (clean === '/') return 'Home'
        if (clean === '/inventory') return 'Inventory'
        if (clean.startsWith('/vehicles/')) return 'Vehicle Detail'
        if (clean === '/financing') return 'Financing'
        if (clean === '/trade-in') return 'Trade-In'
        if (clean === '/test-drive') return 'Test Drive'
        if (clean === '/sourcing') return 'Sourcing'
        if (clean === '/about') return 'About'
        if (clean === '/contact') return 'Contact'
        return 'Other'
      }

      function parseDevice(s) {
        if (!s) return 'unknown'
        const l = s.toLowerCase()
        if (
          l.includes('ipad') ||
          (l.includes('android') && !l.includes('mobile'))
        )
          return 'tablet'
        if (
          l.includes('mobile') ||
          l.includes('iphone') ||
          l.includes('android')
        )
          return 'mobile'
        if (
          l.includes('mozilla') ||
          l.includes('chrome') ||
          l.includes('safari')
        )
          return 'desktop'
        return 'unknown'
      }

      function parseBrowser(s) {
        if (!s) return 'unknown'
        const l = s.toLowerCase()
        if (l.includes('edg/')) return 'Edge'
        if (l.includes('opr/')) return 'Opera'
        if (l.includes('chrome') && !l.includes('chromium')) return 'Chrome'
        if (l.includes('firefox')) return 'Firefox'
        if (l.includes('safari') && !l.includes('chrome')) return 'Safari'
        return 'Other'
      }

      const vehicleMatch = path.match(/^\/vehicles\/([a-f0-9]{24})/i)

      await PageView.create({
        page: resolvePage(path),
        path: path.slice(0, 300),
        referrer: (referrer || 'direct').slice(0, 300),
        ipHash,
        userAgent: (userAgent || '').slice(0, 500),
        device: parseDevice(userAgent),
        browser: parseBrowser(userAgent),
        country: req.headers['cf-ipcountry'] || '',
        vehicleId: vehicleMatch ? vehicleMatch[1] : null
      })
    } catch (err) {
      console.error('[analytics] pageview error:', err.message)
    }
  })
})

module.exports = router
