// server/src/models/User.js
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 30 * 60 * 1000 // 30 minutes

const userSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ['super-admin', 'admin', 'sales', 'viewer'],
      default: 'admin'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    mfaEnabled: {
      type: Boolean,
      default: false
    },
    mfaVerified: {
      type: Boolean,
      default: false
    },
    mfaSecret: {
      type: String,
      select: false
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    },
    passwordChangedAt: {
      type: Date
    },
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

// ── Virtual: isLocked ─────────────────────────────────────────
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// ── Pre-save: hash password ───────────────────────────────────
// Mongoose 6+: async pre hooks work via returned Promise — do NOT call next()
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  this.password = await bcrypt.hash(this.password, salt)

  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000)
  }
})

// ── Pre-findOneAndUpdate: hash password if present ────────────
userSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate()
  if (update && update.$set && update.$set.password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    update.$set.password = await bcrypt.hash(update.$set.password, salt)
    update.$set.passwordChangedAt = new Date(Date.now() - 1000)
  }
})

// ── Instance method: comparePassword ─────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// ── Instance method: incrementLoginAttempts ───────────────────
userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    })
  }

  const updates = { $inc: { loginAttempts: 1 } }

  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) }
  }

  return this.updateOne(updates)
}

// ── Instance method: resetLoginAttempts ──────────────────────
userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  })
}

// ── Instance method: changedPasswordAfter ────────────────────
userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return jwtIssuedAt < changedTimestamp
  }
  return false
}

const User = mongoose.model('User', userSchema)

module.exports = User
