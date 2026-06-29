// const { validationResult } = require('express-validator')
// const FinanceApplication = require('../../models/FinanceApplication')
// const ApiError = require('../../utils/ApiError')
// const ApiResponse = require('../../utils/ApiResponse')

// async function submitFinanceApplication(req, res, next) {
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

//     const application = await FinanceApplication.create(payload)

//     const response = new ApiResponse(
//       201,
//       { id: application._id },
//       'Financing application submitted successfully'
//     )

//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// module.exports = {
//   submitFinanceApplication
// }

// server/src/controllers/public/financeController.js
const { validationResult } = require('express-validator')
const FinanceApplication = require('../../models/FinanceApplication')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendFinanceNotification } = require('../../services/emailService')

async function submitFinanceApplication(req, res, next) {
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
    const application = await FinanceApplication.create(payload)

    // 2. Send email notification — never blocks the response
    sendFinanceNotification(application).catch(() => {})

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: application._id },
          'Your financing application has been submitted successfully.'
        )
      )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = { submitFinanceApplication }
