// server/src/models/Settings.js
const mongoose = require('mongoose')

const { Schema } = mongoose

const businessHourSchema = new Schema(
  {
    day: { type: String, required: true },
    open: String,
    close: String,
    closed: { type: Boolean, default: false }
  },
  { _id: false }
)

const settingsSchema = new Schema(
  {
    dealershipName: { type: String, default: 'Carnex Auto Sales LLC' },
    phone: String,
    email: String,
    address: String,
    businessHours: {
      type: [businessHourSchema],
      default: []
    },
    notificationEmails: {
      type: [String],
      default: []
    },
    emailTemplates: {
      type: Object,
      default: {}
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

settingsSchema.statics.getOrCreate = async function () {
  let doc = await this.findOne()
  if (!doc) {
    doc = await this.create({})
  }
  return doc
}

const Settings = mongoose.model('Settings', settingsSchema)

module.exports = Settings
