// server/src/controllers/admin/passwordResetController.js
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const OTP = require('../../models/OTP')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { sendOTPEmail, sendMail } = require('../../config/nodemailer')

// ── POST /api/admin/auth/forgot-password ──────────────────────
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body

    if (!email) {
      return next(new ApiError(400, 'Email is required'))
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    // Always return 200 — never reveal if email exists
    if (user && user.isActive) {
      const code = await OTP.generateFor(user._id, 'password-reset')

      await sendOTPEmail({
        to: user.email,
        name: user.name,
        code,
        purpose: 'password-reset'
      })

      // Set pending cookie so verify step knows who is resetting
      const pendingToken = jwt.sign(
        { id: user._id, type: 'reset-pending' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      )

      res.cookie('reset_pending', pendingToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      })
    }

    return res.json(
      new ApiResponse(
        200,
        null,
        'If that email is registered, an OTP has been sent to it.'
      )
    )
  } catch (err) {
    return next(err)
  }
}

// ── POST /api/admin/auth/verify-reset-otp ────────────────────
// Step 1: verify OTP → get a short-lived reset token
async function verifyResetOTP(req, res, next) {
  try {
    const { code } = req.body

    if (!code) {
      return next(new ApiError(400, 'OTP code is required'))
    }

    const pendingToken = req.cookies?.reset_pending
    if (!pendingToken) {
      return next(
        new ApiError(401, 'Session expired. Please request a new OTP.')
      )
    }

    let decoded
    try {
      decoded = jwt.verify(pendingToken, process.env.JWT_SECRET)
    } catch {
      return next(
        new ApiError(401, 'Session expired. Please request a new OTP.')
      )
    }

    if (decoded.type !== 'reset-pending') {
      return next(new ApiError(401, 'Invalid session'))
    }

    const valid = await OTP.verifyCode(decoded.id, 'password-reset', code)

    if (!valid) {
      return next(new ApiError(401, 'Invalid or expired OTP code.'))
    }

    // OTP verified — issue a short-lived reset-confirmed token
    const resetToken = jwt.sign(
      { id: decoded.id, type: 'reset-confirmed' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    )

    res.clearCookie('reset_pending')

    res.cookie('reset_confirmed', resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000
    })

    return res.json(
      new ApiResponse(
        200,
        { verified: true },
        'OTP verified. You can now set a new password.'
      )
    )
  } catch (err) {
    return next(err)
  }
}

// ── POST /api/admin/auth/reset-password ──────────────────────
// Step 2: set new password after OTP verified
async function resetPassword(req, res, next) {
  try {
    const { newPassword, confirmPassword } = req.body

    if (!newPassword || !confirmPassword) {
      return next(new ApiError(400, 'Both password fields are required'))
    }

    if (newPassword !== confirmPassword) {
      return next(new ApiError(400, 'Passwords do not match'))
    }

    if (newPassword.length < 8) {
      return next(new ApiError(400, 'Password must be at least 8 characters'))
    }

    const resetToken = req.cookies?.reset_confirmed
    if (!resetToken) {
      return next(
        new ApiError(401, 'Reset session expired. Please start over.')
      )
    }

    let decoded
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    } catch {
      return next(
        new ApiError(401, 'Reset session expired. Please start over.')
      )
    }

    if (decoded.type !== 'reset-confirmed') {
      return next(new ApiError(401, 'Invalid reset session'))
    }

    const user = await User.findById(decoded.id)
    if (!user || !user.isActive) {
      return next(new ApiError(404, 'User not found'))
    }

    user.password = newPassword
    await user.save()

    res.clearCookie('reset_confirmed')

    // Send confirmation email
    await sendMail({
      to: user.email,
      subject: 'Carnex Admin — Password Changed Successfully',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
          <div style="background:#DC2626;padding:16px 24px;border-radius:8px 8px 0 0">
            <h2 style="color:#fff;margin:0">Carnex Auto Sales</h2>
          </div>
          <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;
                      padding:24px;border-radius:0 0 8px 8px">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p style="color:#6b7280">
              Your admin account password was successfully changed.
            </p>
            <p style="color:#dc2626;font-size:13px">
              If you did not make this change, contact your administrator immediately.
            </p>
          </div>
        </div>
      `
    })

    return res.json(
      new ApiResponse(
        200,
        null,
        'Password reset successfully. You can now log in.'
      )
    )
  } catch (err) {
    return next(err)
  }
}

// ── POST /api/admin/auth/change-password (authenticated) ─────
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new ApiError(400, 'All fields are required'))
    }

    if (newPassword !== confirmPassword) {
      return next(new ApiError(400, 'New passwords do not match'))
    }

    if (newPassword.length < 8) {
      return next(new ApiError(400, 'Password must be at least 8 characters'))
    }

    const user = await User.findById(req.admin.id).select('+password')
    if (!user) return next(new ApiError(404, 'User not found'))

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return next(new ApiError(400, 'Current password is incorrect'))
    }

    // Send OTP before allowing change
    const code = await OTP.generateFor(user._id, 'password-reset')

    await sendOTPEmail({
      to: user.email,
      name: user.name,
      code,
      purpose: 'password-reset'
    })

    // Store new password temporarily in a signed token (not in DB yet)
    const pendingToken = jwt.sign(
      {
        id: user._id,
        type: 'change-password-pending'
        // We don't store the password in the token for security
        // User will confirm with OTP then we re-read from request
      },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    )

    res.cookie('change_pw_pending', pendingToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000
    })

    return res.json(
      new ApiResponse(
        200,
        { otpSent: true },
        'An OTP has been sent to your email. Enter it to confirm the password change.'
      )
    )
  } catch (err) {
    return next(err)
  }
}

// ── POST /api/admin/auth/confirm-change-password ──────────────
async function confirmChangePassword(req, res, next) {
  try {
    const { code, newPassword, confirmPassword } = req.body

    if (!code || !newPassword || !confirmPassword) {
      return next(new ApiError(400, 'OTP code and new password are required'))
    }

    if (newPassword !== confirmPassword) {
      return next(new ApiError(400, 'Passwords do not match'))
    }

    if (newPassword.length < 8) {
      return next(new ApiError(400, 'Password must be at least 8 characters'))
    }

    const pendingToken = req.cookies?.change_pw_pending
    if (!pendingToken) {
      return next(
        new ApiError(
          401,
          'Session expired. Please start the password change again.'
        )
      )
    }

    let decoded
    try {
      decoded = jwt.verify(pendingToken, process.env.JWT_SECRET)
    } catch {
      return next(
        new ApiError(
          401,
          'Session expired. Please start the password change again.'
        )
      )
    }

    if (decoded.type !== 'change-password-pending') {
      return next(new ApiError(401, 'Invalid session'))
    }

    // Verify OTP
    const valid = await OTP.verifyCode(decoded.id, 'password-reset', code)
    if (!valid) {
      return next(new ApiError(401, 'Invalid or expired OTP code'))
    }

    const user = await User.findById(decoded.id)
    if (!user || !user.isActive) {
      return next(new ApiError(404, 'User not found'))
    }

    user.password = newPassword
    await user.save()

    res.clearCookie('change_pw_pending')

    await sendMail({
      to: user.email,
      subject: 'Carnex Admin — Password Changed Successfully',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
          <div style="background:#DC2626;padding:16px 24px;border-radius:8px 8px 0 0">
            <h2 style="color:#fff;margin:0">Carnex Auto Sales</h2>
          </div>
          <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;
                      padding:24px;border-radius:0 0 8px 8px">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p style="color:#6b7280">Your password was changed successfully.</p>
            <p style="color:#dc2626;font-size:13px">
              If this was not you, contact your administrator immediately.
            </p>
          </div>
        </div>
      `
    })

    return res.json(
      new ApiResponse(200, null, 'Password changed successfully.')
    )
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword,
  confirmChangePassword
}
