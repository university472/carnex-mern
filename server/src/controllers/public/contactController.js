// module.exports = { submitContactMessage }

const ContactMessage = require('../../models/ContactMessage')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendContactNotification } = require('../../services/emailService')
const { createNotification } = require('../../services/notificationService')
async function submitContactMessage(req, res, next) {
  try {
    const payload = {
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }

    if (payload.consent && payload.consent.accepted) {
      payload.consent.acceptedAt = new Date()
    }

    const message = await ContactMessage.create(payload)
    await createNotification({
      title: 'New Contact Message',
      message: `${message.name || 'Customer'} sent a message`,
      type: 'contact',
      link: '/dealer-panel/contact-leads'
    })

    sendContactNotification(message).catch(() => {})

    return res
      .status(201)
      .json(
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
