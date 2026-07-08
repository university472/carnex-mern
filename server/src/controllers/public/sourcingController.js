// module.exports = { submitSourcingRequest }

const SourcingRequest = require('../../models/SourcingRequest')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendSourcingNotification } = require('../../services/emailService')
const { createNotification } = require('../../services/notificationService')

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
    await createNotification({
      title: 'New Vehicle Sourcing Request',
      message: 'Customer wants help finding a vehicle',
      type: 'sourcing',
      link: `/dealer-panel/sourcing-leads/${requestDoc._id}`
    })

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
