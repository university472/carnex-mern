// // server/src/routes/admin/settings.js
// import express from 'express'
// import auth from '../../middleware/auth.js'
// import authorize from '../../middleware/authorize.js'
// import {
//   getSettings,
//   updateSettings
// } from '../../controllers/admin/settingsController.js'

// const router = express.Router()

// // Only super_admin can view/update global settings according to your matrix
// // GET /api/admin/settings
// router.get('/', auth, authorize('super_admin'), getSettings)

// // PUT /api/admin/settings
// router.put('/', auth, authorize('super_admin'), updateSettings)

// export default router

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
