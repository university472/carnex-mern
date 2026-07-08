// server/src/routes/admin/settings.js
const express = require('express')
const auth = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const {
  getSettings,
  updateSettings
} = require('../../controllers/admin/settingsController')

const router = express.Router()

// GET /api/admin/settings
router.get('/', auth(true), authorize('super-admin', 'admin'), getSettings)

// PUT /api/admin/settings
router.put('/', auth(true), authorize('super-admin'), updateSettings)

module.exports = router
