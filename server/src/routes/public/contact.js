// server/src/routes/public/contact.js
const express = require('express')
const {
  submitContactMessage
} = require('../../controllers/public/contactController')
const { contactMessageValidator } = require('../../validators/formValidators')

const router = express.Router()

// POST /api/contact
router.post('/', contactMessageValidator, submitContactMessage)

module.exports = router
