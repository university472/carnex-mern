const Notification = require('../models/Notification')

async function createNotification({ title, message, type = 'system', link }) {
  return Notification.create({
    title,
    message,
    type,
    link
  })
}

module.exports = {
  createNotification
}
