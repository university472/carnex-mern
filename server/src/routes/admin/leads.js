// // server/src/routes/admin/leads.js
// const express = require('express')
// const auth = require('../../middleware/auth')
// const authorize = require('../../middleware/authorize')
// const {
//   getLeadSummary,
//   getLeadById,
//   updateLead,
//   getFinanceLeads,
//   getTradeInLeads,
//   getTestDriveLeads,
//   getSourcingLeads,
//   getContactLeads
// } = require('../../controllers/admin/leadController')

// const router = express.Router()

// router.use(auth(true), authorize('super-admin', 'admin', 'sales', 'viewer'))

// // Summary for dashboard KPI cards
// // GET /api/admin/leads/summary
// router.get('/summary', getLeadSummary)

// // List endpoints
// // GET /api/admin/leads/finance
// router.get('/finance', getFinanceLeads)
// // GET /api/admin/leads/trade-in
// router.get('/trade-in', getTradeInLeads)
// // GET /api/admin/leads/test-drive
// router.get('/test-drive', getTestDriveLeads)
// // GET /api/admin/leads/sourcing
// router.get('/sourcing', getSourcingLeads)
// // GET /api/admin/leads/contact
// router.get('/contact', getContactLeads)

// // Single lead by type + id (sales/admin can view; viewer read-only)
// // GET  /api/admin/leads/:type/:id
// router.get('/:type/:id', getLeadById)

// // PATCH /api/admin/leads/:type/:id  (status + notes update)
// router.patch(
//   '/:type/:id',
//   authorize('super-admin', 'admin', 'sales'),
//   updateLead
// )

// module.exports = router

// server/src/routes/admin/leads.js
const express = require('express')
const auth = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const {
  getLeadSummary,
  getLeadById,
  updateLead,
  getFinanceLeads,
  getTradeInLeads,
  getTestDriveLeads,
  getSourcingLeads,
  getContactLeads
} = require('../../controllers/admin/leadController')

const router = express.Router()

// All lead routes require authentication
router.use(auth(true), authorize('super-admin', 'admin', 'sales', 'viewer'))

// ── Fixed list routes (must come BEFORE /:type/:id) ──────────
// GET /api/admin/leads/summary
router.get('/summary', getLeadSummary)

// GET /api/admin/leads/finance
router.get('/finance', getFinanceLeads)

// GET /api/admin/leads/trade-in
router.get('/trade-in', getTradeInLeads)

// GET /api/admin/leads/test-drive
router.get('/test-drive', getTestDriveLeads)

// GET /api/admin/leads/sourcing
router.get('/sourcing', getSourcingLeads)

// GET /api/admin/leads/contact
router.get('/contact', getContactLeads)

// ── Dynamic single-lead routes ────────────────────────────────
// GET  /api/admin/leads/:type/:id
router.get('/:type/:id', getLeadById)

// PATCH /api/admin/leads/:type/:id
router.patch(
  '/:type/:id',
  authorize('super-admin', 'admin', 'sales'),
  updateLead
)

module.exports = router
