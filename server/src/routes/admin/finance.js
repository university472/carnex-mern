// server/src/routes/admin/finance.js
const express = require('express')
const auth = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const {
  adminGetFinanceOverview,
  adminGetFinanceVehicles
} = require('../../controllers/admin/financeController')

const router = express.Router()

// Profit/financial data — restricted to admin roles, not sales/viewer.
router.use(auth(true), authorize('super-admin', 'admin'))

// GET /api/admin/finance/overview
router.get('/overview', adminGetFinanceOverview)

// GET /api/admin/finance/vehicles
router.get('/vehicles', adminGetFinanceVehicles)

module.exports = router
