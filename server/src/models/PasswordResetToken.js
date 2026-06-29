// server/src/models/PasswordResetToken.js
const mongoose = require('mongoose')
const crypto = require('crypto')

const passwordResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
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
    }
  },
  { timestamps: true }
)

// Auto-delete expired tokens
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

passwordResetTokenSchema.statics.generateFor = async function (userId) {
  // Invalidate any existing tokens for this user
  await this.deleteMany({ userId })

  const raw = crypto.randomBytes(32).toString('hex')
  const hashed = crypto.createHash('sha256').update(raw).digest('hex')

  await this.create({
    userId,
    token: hashed,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  })

  return raw // return unhashed — sent in email
}

passwordResetTokenSchema.statics.verify = async function (raw) {
  const hashed = require('crypto')
    .createHash('sha256')
    .update(raw)
    .digest('hex')
  const record = await this.findOne({
    token: hashed,
    expiresAt: { $gt: new Date() },
    used: false
  })
  return record
}

const PasswordResetToken = mongoose.model(
  'PasswordResetToken',
  passwordResetTokenSchema
)

module.exports = PasswordResetToken
