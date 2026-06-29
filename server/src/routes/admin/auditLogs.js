// server/src/routes/admin/auditLogs.js
const express = require('express')
const auth = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const { getAuditLogs } = require('../../controllers/admin/auditLogController')

const router = express.Router()

router.use(auth(true), authorize('super-admin', 'admin'))

// GET /api/admin/audit-logs
router.get('/', getAuditLogs)

module.exports = router
