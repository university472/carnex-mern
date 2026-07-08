// server/src/routes/public/contact.js

const express = require('express')
const validateRequest = require('../../middleware/validateRequest')

const {
  submitContactMessage
} = require('../../controllers/public/contactController')

// const { contactMessageValidator } = require('../../validators/formValidators')

const router = express.Router()

router.post('/',  validateRequest, submitContactMessage)

module.exports = router
