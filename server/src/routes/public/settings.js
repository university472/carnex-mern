// // server/src/routes/public/settings.js
// import express from 'express'
// import { getPublicSettings } from '../../controllers/public/settingsController.js'

// const router = express.Router()

// // GET /api/settings/public
// router.get('/public', getPublicSettings)

// export default router

// server/src/routes/public/settings.js
const express = require('express')
const { getPublicSettings } = require('../../controllers/public/settingsController')

const router = express.Router()

// GET /api/settings/public
router.get('/public', getPublicSettings)

module.exports = router