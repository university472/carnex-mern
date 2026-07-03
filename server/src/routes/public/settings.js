// // server/src/routes/public/settings.js
// const express = require('express')
// const validateRequest = require('../../middleware/validateRequest')
// const {
//   getPublicSettings
// } = require('../../controllers/public/settingsController')

// const router = express.Router()
// router.post(
//  '/',
//  validateRequest,
//  submitContactMessage
// )
// // GET /api/settings/public
// router.get('/public', getPublicSettings)

// module.exports = router

// server/src/routes/public/settings.js

const express = require('express')

const {
  getPublicSettings
} = require('../../controllers/public/settingsController')

const router = express.Router()

// GET /api/settings/public
router.get('/public', getPublicSettings)

module.exports = router
