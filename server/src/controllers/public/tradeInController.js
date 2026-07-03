// // server/src/controllers/public/tradeInController.js

// const TradeInRequest = require('../../models/TradeInRequest')
// const ApiError = require('../../utils/ApiError')
// const ApiResponse = require('../../utils/ApiResponse')
// const { sendTradeInNotification } = require('../../services/emailService')

// async function submitTradeInRequest(req, res, next) {
//   try {
//     const payload = {
//       ...req.body,
//       ip: req.ip,
//       userAgent: req.headers['user-agent']
//     }

//     // 1. Save to MongoDB first
//     const requestDoc = await TradeInRequest.create(payload)

//     // 2. Send email notification — never blocks the response
//     sendTradeInNotification(requestDoc).catch(() => {})

//     return res
//       .status(201)
//       .json(
//         new ApiResponse(
//           201,
//           { id: requestDoc._id },
//           'Your trade-in request has been submitted successfully.'
//         )
//       )
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// module.exports = { submitTradeInRequest }

const TradeInRequest = require('../../models/TradeInRequest')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendTradeInNotification } = require('../../services/emailService')

async function submitTradeInRequest(req, res, next) {
  try {
    const payload = {
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }

    // Automatically set acceptedAt when consent is given
    if (payload.consent && payload.consent.accepted) {
      payload.consent.acceptedAt = new Date()
    }

    const requestDoc = await TradeInRequest.create(payload)

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
