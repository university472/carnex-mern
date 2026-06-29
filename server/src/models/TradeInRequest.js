// const mongoose = require('mongoose')

// const tradeInRequestSchema = new mongoose.Schema(
//   {
//     // Contact
//     name: { type: String, required: true, trim: true, maxlength: 120 },
//     email: { type: String, required: true, trim: true, lowercase: true },
//     phone: { type: String, required: true, trim: true },

//     // Vehicle being traded
//     year: { type: Number, required: true },
//     make: { type: String, required: true, trim: true },
//     model: { type: String, required: true, trim: true },
//     mileage: { type: Number, min: 0 },
//     vin: { type: String, trim: true, uppercase: true },
//     condition: { type: String, trim: true },

//     // Desired vehicle / notes
//     desiredVehicle: { type: String, trim: true },
//     notes: { type: String, trim: true, maxlength: 2000 },

//     status: {
//       type: String,
//       enum: ['new', 'contacted', 'appraised', 'completed', 'archived'],
//       default: 'new'
//     },

//     source: { type: String, trim: true, default: 'website' },

//     ip: String,
//     userAgent: String
//   },
//   { timestamps: true }
// )

// tradeInRequestSchema.index({ createdAt: -1, status: 1 })

// const TradeInRequest = mongoose.model('TradeInRequest', tradeInRequestSchema)

// module.exports = TradeInRequest

// server/src/models/TradeInRequest.js
const mongoose = require('mongoose')

const tradeInRequestSchema = new mongoose.Schema(
  {
    // Frontend sends `name` as single field
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
    // Vehicle being traded
    year: { type: Number },
    make: { type: String, trim: true },
    model: { type: String, trim: true },
    mileage: { type: Number, min: 0 },
    vin: { type: String, trim: true, uppercase: true },
    condition: { type: String, trim: true },
    desiredVehicle: { type: String, trim: true },
    notes: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['new', 'contacted', 'appraised', 'completed', 'archived'],
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

tradeInRequestSchema.index({ createdAt: -1, status: 1 })

const TradeInRequest = mongoose.model('TradeInRequest', tradeInRequestSchema)

module.exports = TradeInRequest
