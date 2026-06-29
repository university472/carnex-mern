// const mongoose = require('mongoose')

// const contactMessageSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true, maxlength: 120 },
//     email: { type: String, required: true, trim: true, lowercase: true },
//     phone: { type: String, trim: true },

//     topic: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 200
//     },
//     message: { type: String, required: true, trim: true, maxlength: 4000 },

//     status: {
//       type: String,
//       enum: ['new', 'responded', 'closed', 'archived'],
//       default: 'new'
//     },

//     source: { type: String, trim: true, default: 'website' },

//     ip: String,
//     userAgent: String
//   },
//   { timestamps: true }
// )

// contactMessageSchema.index({ createdAt: -1, status: 1 })

// const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)

// module.exports = ContactMessage


// server/src/models/ContactMessage.js
const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    topic: {
      type: String,
      trim: true
    },
    // Subject is required — matches frontend ContactForm
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000
    },
    status: {
      type: String,
      enum: ['new', 'responded', 'closed', 'archived'],
      default: 'new'
    },
    source: {
      type: String,
      trim: true,
      default: 'website'
    },
    ip: String,
    userAgent: String
  },
  { timestamps: true }
)

contactMessageSchema.index({ createdAt: -1, status: 1 })

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)

module.exports = ContactMessage
