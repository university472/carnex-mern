//server/src/controllers/public/financeController.js
const FinanceApplication = require('../../models/FinanceApplication')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendFinanceNotification } = require('../../services/emailService')
const { createNotification } = require('../../services/notificationService')

async function submitFinanceApplication(req, res, next) {
  try {
    const payload = {
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }

    if (payload.consent && payload.consent.accepted) {
      payload.consent.acceptedAt = new Date()
    }

    const application = await FinanceApplication.create(payload)
    await createNotification({
      title: 'New Finance Application',
      message: `${application.firstName || 'Customer'} ${
        application.lastName || ''
      } submitted financing request`,
      type: 'finance',
      link: `/dealer-panel/finance-leads/${application._id}`
    })
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
