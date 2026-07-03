// // server/src/controllers/public/sourcingController.js
// const SourcingRequest = require('../../models/SourcingRequest')
// const ApiError = require('../../utils/ApiError')
// const ApiResponse = require('../../utils/ApiResponse')
// const { sendSourcingNotification } = require('../../services/emailService')

// async function submitSourcingRequest(req, res, next) {
//   try {

//     const payload = {
//       ...req.body,
//       ip: req.ip,
//       userAgent: req.headers['user-agent']
//     }

//     // 1. Save to MongoDB first
//     const requestDoc = await SourcingRequest.create(payload)

//     // 2. Send email notification — never blocks the response
//     sendSourcingNotification(requestDoc).catch(() => {})

//     return res
//       .status(201)
//       .json(
//         new ApiResponse(
//           201,
//           { id: requestDoc._id },
//           'Your vehicle sourcing request has been submitted successfully.'
//         )
//       )
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// module.exports = { submitSourcingRequest }

const SourcingRequest = require('../../models/SourcingRequest')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendSourcingNotification } = require('../../services/emailService')

async function submitSourcingRequest(req, res, next) {
  try {
    const payload = {
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }

    if (payload.consent && payload.consent.accepted) {
      payload.consent.acceptedAt = new Date()
    }

    const requestDoc = await SourcingRequest.create(payload)

    sendSourcingNotification(requestDoc).catch(() => {})

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: requestDoc._id },
          'Your vehicle sourcing request has been submitted successfully.'
        )
      )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = { submitSourcingRequest }
