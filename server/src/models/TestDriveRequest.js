// const mongoose = require('mongoose')

// const testDriveRequestSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true, maxlength: 120 },
//     email: { type: String, required: true, trim: true, lowercase: true },
//     phone: { type: String, required: true, trim: true },

//     preferredDate: { type: Date, required: true },
//     preferredTimeSlot: { type: String, trim: true },

//     vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
//     vehicleTitle: { type: String, trim: true },

//     notes: { type: String, trim: true, maxlength: 1000 },

//     status: {
//       type: String,
//       enum: ['new', 'confirmed', 'completed', 'cancelled', 'archived'],
//       default: 'new'
//     },

//     source: { type: String, trim: true, default: 'website' },

//     ip: String,
//     userAgent: String
//   },
//   { timestamps: true }
// )

// testDriveRequestSchema.index({ preferredDate: 1, status: 1 })

// const TestDriveRequest = mongoose.model(
//   'TestDriveRequest',
//   testDriveRequestSchema
// )

// module.exports = TestDriveRequest

// server/src/models/TestDriveRequest.js
const mongoose = require('mongoose')

const testDriveRequestSchema = new mongoose.Schema(
  {
    // Frontend sends `name` as a single field
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
      required: true,
      trim: true
    },
    preferredDate: {
      type: Date
    },
    preferredTimeSlot: {
      type: String,
      trim: true
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    vehicleTitle: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'completed', 'cancelled', 'archived'],
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

testDriveRequestSchema.index({ preferredDate: 1, status: 1 })

const TestDriveRequest = mongoose.model(
  'TestDriveRequest',
  testDriveRequestSchema
)

module.exports = TestDriveRequest
