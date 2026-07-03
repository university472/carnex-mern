// // server/src/models/TestDriveRequest.js
// const mongoose = require('mongoose')

// const testDriveRequestSchema = new mongoose.Schema(
//   {
//     // Frontend sends `name` as a single field
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 120
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true
//     },
//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 7,
//       maxlength: 20
//     },
//     preferredDate: {
//       type: Date
//     },
//     preferredTimeSlot: {
//       type: String,
//       trim: true
//     },
//     vehicleId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Vehicle'
//     },
//     vehicleTitle: {
//       type: String,
//       trim: true
//     },
//     notes: {
//       type: String,
//       trim: true,
//       maxlength: 1000
//     },
//     status: {
//       type: String,
//       enum: ['new', 'confirmed', 'completed', 'cancelled', 'archived'],
//       default: 'new'
//     },
//     source: {
//       type: String,
//       trim: true,
//       default: 'website'
//     },
//     ipHash: String,
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

const mongoose = require('mongoose')

const testDriveRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20
    },
    preferredDate: { type: Date },
    preferredTimeSlot: { type: String, trim: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    vehicleTitle: { type: String, trim: true },
    notes: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'completed', 'cancelled', 'archived'],
      default: 'new'
    },
    source: { type: String, trim: true, default: 'website' },
    ipHash: String,
    userAgent: String,
    consent: {
      accepted: { type: Boolean, required: true, default: false },
      acceptedAt: { type: Date },
      textVersion: { type: String, default: 'v1.0' }
    }
  },
  { timestamps: true }
)

testDriveRequestSchema.index({ preferredDate: 1, status: 1 })

const TestDriveRequest = mongoose.model(
  'TestDriveRequest',
  testDriveRequestSchema
)

module.exports = TestDriveRequest
