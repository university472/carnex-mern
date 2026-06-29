// server/src/routes/admin/auth.js
const express = require('express')
const {
  login,
  verifyLoginOTP,
  logout,
  getMe
} = require('../../controllers/admin/authController')
const {
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword,
  confirmChangePassword
} = require('../../controllers/admin/passwordResetController')
const auth = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')

const router = express.Router()

// ── Unauthenticated routes ────────────────────────────────────
router.post('/login', login)
router.post('/verify-otp', verifyLoginOTP)
router.post('/forgot-password', forgotPassword)
router.post('/verify-reset-otp', verifyResetOTP)
router.post('/reset-password', resetPassword)

// ── Authenticated routes ──────────────────────────────────────

// /me — used by ProtectedRoute to verify token on every visit
router.get(
  '/me',
  auth(true),
  authorize('super-admin', 'admin', 'sales', 'viewer'),
  getMe
)

router.post('/logout', auth(true), logout)
router.post('/change-password', auth(true), changePassword)
router.post('/confirm-change-password', auth(true), confirmChangePassword)

module.exports = router
