// module.exports = { submitTestDriveRequest }

const TestDriveRequest = require('../../models/TestDriveRequest')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendTestDriveNotification } = require('../../services/emailService')
const { createNotification } = require('../../services/notificationService')

async function submitTestDriveRequest(req, res, next) {
  try {
    const payload = {
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }

    if (payload.consent && payload.consent.accepted) {
      payload.consent.acceptedAt = new Date()
    }

    const requestDoc = await TestDriveRequest.create(payload)
    await createNotification({
      title: 'New Test Drive Request',
      message: 'Customer requested a test drive',
      type: 'testdrive',
      link: `/dealer-panel/test-drive-leads/${requestDoc._id}`
    })

    sendTestDriveNotification(requestDoc).catch(() => {})

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: requestDoc._id },
          'Your test drive request has been submitted successfully.'
        )
      )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = { submitTestDriveRequest }
