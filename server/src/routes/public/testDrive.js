// server/src/routes/public/testDrive.js
const express = require('express')
const validateRequest = require('../../middleware/validateRequest')
const {
  submitTestDriveRequest
} = require('../../controllers/public/testDriveController')
const { testDriveRequestValidator } = require('../../validators/formValidators')

const router = express.Router()

// POST /api/test-drive
router.post(
  '/',
  testDriveRequestValidator,
  validateRequest,
  submitTestDriveRequest
)

module.exports = router
