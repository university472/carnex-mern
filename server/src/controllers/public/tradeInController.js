// const { validationResult } = require('express-validator')
// const TradeInRequest = require('../../models/TradeInRequest')
// const ApiError = require('../../utils/ApiError')
// const ApiResponse = require('../../utils/ApiResponse')

// async function submitTradeInRequest(req, res, next) {
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

//     const requestDoc = await TradeInRequest.create(payload)

//     const response = new ApiResponse(
//       201,
//       { id: requestDoc._id },
//       'Trade-in request submitted successfully'
//     )

//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// module.exports = {
//   submitTradeInRequest
// }

// server/src/controllers/public/tradeInController.js
const { validationResult } = require('express-validator')
const TradeInRequest = require('../../models/TradeInRequest')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendTradeInNotification } = require('../../services/emailService')

async function submitTradeInRequest(req, res, next) {
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
    const requestDoc = await TradeInRequest.create(payload)

    // 2. Send email notification — never blocks the response
    sendTradeInNotification(requestDoc).catch(() => {})

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: requestDoc._id },
          'Your trade-in request has been submitted successfully.'
        )
      )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = { submitTradeInRequest }
