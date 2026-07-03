// // server/src/models/SourcingRequest.js
// const mongoose = require('mongoose')

// const sourcingRequestSchema = new mongoose.Schema(
//   {
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
//     desiredYearMin: { type: Number },
//     desiredYearMax: { type: Number },
//     desiredMake: { type: String, trim: true },
//     desiredModel: { type: String, trim: true },
//     desiredBodyType: { type: String, trim: true },
//     desiredBudgetMax: { type: Number, min: 0 },
//     mustHaveFeatures: {
//       type: String,
//       trim: true,
//       maxlength: 2000
//     },
//     status: {
//       type: String,
//       enum: ['new', 'searching', 'matched', 'closed', 'archived'],
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

// sourcingRequestSchema.index({ createdAt: -1, status: 1 })

// const SourcingRequest = mongoose.model('SourcingRequest', sourcingRequestSchema)

// module.exports = SourcingRequest

const mongoose = require('mongoose')

const sourcingRequestSchema = new mongoose.Schema(
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
    desiredYearMin: { type: Number },
    desiredYearMax: { type: Number },
    desiredMake: { type: String, trim: true },
    desiredModel: { type: String, trim: true },
    desiredBodyType: { type: String, trim: true },
    desiredBudgetMax: { type: Number, min: 0 },
    mustHaveFeatures: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['new', 'searching', 'matched', 'closed', 'archived'],
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

sourcingRequestSchema.index({ createdAt: -1, status: 1 })

const SourcingRequest = mongoose.model('SourcingRequest', sourcingRequestSchema)

module.exports = SourcingRequest
