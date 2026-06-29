// server/src/models/PageView.js
const mongoose = require('mongoose')

const pageViewSchema = new mongoose.Schema(
  {
    // Page that was visited
    page: {
      type: String,
      required: true,
      trim: true
    },
    // Full URL path including query string
    path: {
      type: String,
      trim: true
    },
    // HTTP referrer
    referrer: {
      type: String,
      trim: true,
      default: 'direct'
    },
    // Visitor IP (hashed for privacy)
    ipHash: {
      type: String,
      trim: true
    },
    // Raw user agent string
    userAgent: {
      type: String,
      trim: true
    },
    // Parsed device category
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown'
    },
    // Parsed browser name
    browser: {
      type: String,
      trim: true,
      default: 'unknown'
    },
    // Country from CF-IPCountry header (if behind Cloudflare)
    // or left blank otherwise
    country: {
      type: String,
      trim: true,
      default: ''
    },
    // Which vehicle was viewed (for /vehicles/:id pages)
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null
    }
  },
  {
    timestamps: true // createdAt = visit timestamp
  }
)

// Indexes for dashboard queries
pageViewSchema.index({ createdAt: -1 })
pageViewSchema.index({ page: 1, createdAt: -1 })
pageViewSchema.index({ ipHash: 1, createdAt: -1 })

// Auto-delete visits older than 90 days to keep DB lean
pageViewSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
)

const PageView = mongoose.model('PageView', pageViewSchema)

module.exports = PageView
