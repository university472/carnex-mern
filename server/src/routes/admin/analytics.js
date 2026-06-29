// server/src/routes/admin/analytics.js
const express = require('express')
const auth = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const {
  getAnalyticsSummary,
  getRecentVisits
} = require('../../controllers/admin/analyticsController')

const router = express.Router()

// All analytics routes: read access for all admin roles
router.use(auth(true), authorize('super-admin', 'admin', 'sales', 'viewer'))

// GET /api/admin/analytics/summary
router.get('/summary', getAnalyticsSummary)

// GET /api/admin/analytics/recent
router.get('/recent', getRecentVisits)

module.exports = router
