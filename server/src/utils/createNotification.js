const Notification = require('../models/Notification')

async function createNotification(data) {
  try {
    const notification = await Notification.create({
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link
    })

    console.log(`🔔 ${data.title}: ${data.message}`)

    return notification
  } catch (err) {
    console.error('Notification Error:', err.message)
  }
}

module.exports = createNotification
