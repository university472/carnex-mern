// server/src/models/OTP.js
const mongoose = require('mongoose')
const crypto = require('crypto')

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    purpose: {
      type: String,
      enum: ['login', 'password-reset'],
      required: true
    },
    code: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    used: {
      type: Boolean,
      default: false
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

// Auto-delete expired documents from MongoDB
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

/**
 * Generate a 6-digit OTP for a user and purpose.
 * Deletes any existing OTP for same user+purpose first.
 */
otpSchema.statics.generateFor = async function (userId, purpose) {
  // Delete any existing OTP for this user + purpose
  await this.deleteMany({ userId, purpose })

  // Generate cryptographically random 6-digit code
  const code = String(
    parseInt(crypto.randomBytes(3).toString('hex'), 16) % 1000000
  ).padStart(6, '0')

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await this.create({ userId, purpose, code, expiresAt })

  return code
}

/**
 * Verify an OTP code for a user and purpose.
 * Returns the OTP document if valid, null if invalid.
 */
otpSchema.statics.verifyCode = async function (userId, purpose, code) {
  const otp = await this.findOne({
    userId,
    purpose,
    used: false,
    expiresAt: { $gt: new Date() }
  })

  if (!otp) return null

  // Increment attempts
  otp.attempts += 1

  // Block after 5 wrong attempts
  if (otp.attempts > 5) {
    await otp.save()
    return null
  }

  if (otp.code !== String(code).trim()) {
    await otp.save()
    return null
  }

  // Mark as used
  otp.used = true
  await otp.save()

  return otp
}

const OTP = mongoose.model('OTP', otpSchema)

module.exports = OTP
