// const { validationResult } = require('express-validator')
// const ContactMessage = require('../../models/ContactMessage')
// const ApiError = require('../../utils/ApiError')
// const ApiResponse = require('../../utils/ApiResponse')

// async function submitContactMessage(req, res, next) {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return next(ApiError.badRequest('Validation failed', errors.array()))
//     }

//     const payload = {
//       ...req.body,
//       ip: req.ip,
//       userAgent: req.headers['user-agent']
//     }

//     const message = await ContactMessage.create(payload)

//     const response = new ApiResponse(
//       201,
//       { id: message._id },
//       'Message received. Our team will contact you shortly.'
//     )

//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// module.exports = {
//   submitContactMessage
// }


// server/src/controllers/public/contactController.js
const { validationResult } = require('express-validator')
const ContactMessage = require('../../models/ContactMessage')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendContactNotification } = require('../../services/emailService')

async function submitContactMessage(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest('Validation failed', errors.array()))
    }

    const payload = {
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }

    // 1. Save to MongoDB first
    const message = await ContactMessage.create(payload)

    // 2. Send email notification — never blocks the response
    sendContactNotification(message).catch(() => {})

    return res.status(201).json(
      new ApiResponse(
        201,
        { id: message._id },
        'Your message has been received. We will get back to you shortly.'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = { submitContactMessage }