const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        'finance',
        'contact',
        'trade',
        'testdrive',
        'sourcing',
        'vehicle',
        'system'
      ],
      default: 'system'
    },

    link: {
      type: String
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

notificationSchema.index({
  isRead: 1,
  createdAt: -1
})

module.exports = mongoose.model('Notification', notificationSchema)
