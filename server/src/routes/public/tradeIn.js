// server/src/routes/public/tradeIn.js
const express = require('express')
const validateRequest = require('../../middleware/validateRequest')
const {
  submitTradeInRequest
} = require('../../controllers/public/tradeInController')
const { tradeInRequestValidator } = require('../../validators/formValidators')

const router = express.Router()

// POST /api/trade-in
router.post('/', tradeInRequestValidator, validateRequest, submitTradeInRequest)

module.exports = router
