// server/src/routes/public/sourcing.js
const express = require('express')
const validateRequest =
require('../../middleware/validateRequest')
const {
  submitSourcingRequest
} = require('../../controllers/public/sourcingController')
const { sourcingRequestValidator } = require('../../validators/formValidators')

const router = express.Router()

// POST /api/sourcing
router.post('/', sourcingRequestValidator, validateRequest, submitSourcingRequest)

module.exports = router
