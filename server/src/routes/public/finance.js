// server/src/routes/public/finance.js
const express = require('express')
const validateRequest = require('../../middleware/validateRequest')
const {
  submitFinanceApplication
} = require('../../controllers/public/financeController')
const {
  financeApplicationValidator
} = require('../../validators/formValidators')

const router = express.Router()

// POST /api/finance
router.post(
  '/',
  financeApplicationValidator,
  validateRequest,
  submitFinanceApplication
)

module.exports = router
