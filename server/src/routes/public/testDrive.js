// server/src/routes/public/testDrive.js
const express = require('express')
const {
  submitTestDriveRequest
} = require('../../controllers/public/testDriveController')
const { testDriveRequestValidator } = require('../../validators/formValidators')

const router = express.Router()

// POST /api/test-drive
router.post('/', testDriveRequestValidator, submitTestDriveRequest)

module.exports = router
