

const express = require('express')

const {
  getPublicSettings
} = require('../../controllers/public/settingsController')

const router = express.Router()

// GET /api/settings/public
router.get('/public', getPublicSettings)

module.exports = router
