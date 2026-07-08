const mongoose = require('mongoose')

const tradeInRequestSchema = new mongoose.Schema(
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

tradeInRequestSchema.index({ createdAt: -1, status: 1 })

const TradeInRequest = mongoose.model('TradeInRequest', tradeInRequestSchema)

module.exports = TradeInRequest
