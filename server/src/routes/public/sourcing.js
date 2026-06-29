// server/src/routes/public/sourcing.js
const express = require('express')
const {
  submitSourcingRequest
} = require('../../controllers/public/sourcingController')
const { sourcingRequestValidator } = require('../../validators/formValidators')

const router = express.Router()

// POST /api/sourcing
router.post('/', sourcingRequestValidator, submitSourcingRequest)

module.exports = router
