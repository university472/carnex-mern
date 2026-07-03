// // server/src/controllers/admin/authController.js
// const jwt = require('jsonwebtoken')
// const User = require('../../models/User')
// const ApiError = require('../../utils/ApiError')
// const ApiResponse = require('../../utils/ApiResponse')
// const generateToken = require('../../utils/generateToken')

// let speakeasy, qrcode, logAction

// try {
//   speakeasy = require('speakeasy')
// } catch {
//   speakeasy = null
// }
// try {
//   qrcode = require('qrcode')
// } catch {
//   qrcode = null
// }
// try {
//   logAction = require('../../services/auditService').logAction
// } catch {
//   logAction = async () => {}
// }

// const createEphemeralToken = (payload, expiresIn = '5m') =>
//   jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })

// // POST /api/admin/auth/login
// async function login(req, res, next) {
//   try {
//     const { email, password } = req.body
//     if (!email || !password)
//       return next(new ApiError(400, 'Email and password are required'))

//     const user = await User.findOne({ email: email.toLowerCase() }).select(
//       '+password +mfaSecret'
//     )
//     if (!user || !user.isActive)
//       return next(new ApiError(401, 'Invalid credentials'))

//     const isMatch = await user.comparePassword(password)
//     if (!isMatch) return next(new ApiError(401, 'Invalid credentials'))

//     user.lastLoginAt = new Date()
//     await user.save({ validateBeforeSave: false })

//     // If MFA is fully set up, require TOTP step
//     if (user.mfaEnabled && user.mfaSecret) {
//       const mfaToken = createEphemeralToken(
//         { id: user._id, type: 'mfa-pending' },
//         '5m'
//       )
//       res.cookie('mfa_pending', mfaToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 5 * 60 * 1000
//       })
//       return res.json(
//         new ApiResponse(200, { mfaRequired: true }, 'MFA code required')
//       )
//     }

//     // MFA not set up yet — send to setup flow
//     const setupToken = createEphemeralToken(
//       { id: user._id, type: 'mfa-setup' },
//       '10m'
//     )
//     res.cookie('mfa_setup', setupToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 10 * 60 * 1000
//     })
//     return res.json(
//       new ApiResponse(200, { setupRequired: true }, 'MFA setup required')
//     )
//   } catch (err) {
//     return next(err)
//   }
// }

// // POST /api/admin/auth/mfa/setup
// async function setupMfa(req, res, next) {
//   try {
//     if (!speakeasy || !qrcode)
//       return next(new ApiError(501, 'MFA not available'))

//     const token = req.cookies?.mfa_setup
//     if (!token) return next(new ApiError(401, 'MFA setup session expired'))

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     if (decoded.type !== 'mfa-setup')
//       return next(new ApiError(401, 'Invalid setup token'))

//     const user = await User.findById(decoded.id)
//     if (!user || !user.isActive)
//       return next(new ApiError(401, 'User not found'))

//     const secret = speakeasy.generateSecret({
//       name: process.env.MFA_APP_NAME || 'CarnexAdmin'
//     })
//     user.mfaSecret = secret.base32
//     await user.save({ validateBeforeSave: false })

//     const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url)
//     return res.json(
//       new ApiResponse(
//         200,
//         { qrDataUrl, otpauthUrl: secret.otpauth_url },
//         'MFA secret generated'
//       )
//     )
//   } catch (err) {
//     return next(err)
//   }
// }

// // POST /api/admin/auth/mfa/confirm
// async function confirmMfa(req, res, next) {
//   try {
//     if (!speakeasy) return next(new ApiError(501, 'MFA not available'))

//     const token = req.cookies?.mfa_setup
//     const { code } = req.body
//     if (!token) return next(new ApiError(401, 'MFA setup session expired'))

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     if (decoded.type !== 'mfa-setup')
//       return next(new ApiError(401, 'Invalid setup token'))

//     const user = await User.findById(decoded.id).select('+mfaSecret')
//     if (!user || !user.mfaSecret)
//       return next(new ApiError(401, 'MFA not initialized'))

//     const verified = speakeasy.totp.verify({
//       secret: user.mfaSecret,
//       encoding: 'base32',
//       token: code,
//       window: 1
//     })
//     if (!verified) return next(new ApiError(401, 'Invalid MFA code'))

//     user.mfaEnabled = true
//     await user.save({ validateBeforeSave: false })

//     res.clearCookie('mfa_setup')

//     const jwtToken = generateToken(user, res)
//     await logAction(
//       { id: user._id, name: user.name, email: user.email, role: user.role },
//       'MFA_ENABLED',
//       'user',
//       user._id,
//       {},
//       req
//     )

//     return res.json(
//       new ApiResponse(
//         200,
//         {
//           token: jwtToken,
//           user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role
//           }
//         },
//         'MFA enabled and logged in'
//       )
//     )
//   } catch (err) {
//     return next(err)
//   }
// }

// // POST /api/admin/auth/mfa/verify
// async function verifyMfa(req, res, next) {
//   try {
//     if (!speakeasy) return next(new ApiError(501, 'MFA not available'))

//     const token = req.cookies?.mfa_pending
//     const { code } = req.body
//     if (!token) return next(new ApiError(401, 'MFA session expired'))

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     if (decoded.type !== 'mfa-pending')
//       return next(new ApiError(401, 'Invalid MFA token'))

//     const user = await User.findById(decoded.id).select('+mfaSecret')
//     if (!user || !user.isActive || !user.mfaSecret)
//       return next(new ApiError(401, 'User not found or MFA not configured'))

//     const verified = speakeasy.totp.verify({
//       secret: user.mfaSecret,
//       encoding: 'base32',
//       token: code,
//       window: 1
//     })
//     if (!verified) return next(new ApiError(401, 'Invalid MFA code'))

//     res.clearCookie('mfa_pending')

//     const jwtToken = generateToken(user, res)
//     await logAction(
//       { id: user._id, name: user.name, email: user.email, role: user.role },
//       'ADMIN_LOGIN',
//       'user',
//       user._id,
//       {},
//       req
//     )

//     return res.json(
//       new ApiResponse(
//         200,
//         {
//           token: jwtToken,
//           user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role
//           }
//         },
//         'Logged in successfully'
//       )
//     )
//   } catch (err) {
//     return next(err)
//   }
// }

// // POST /api/admin/auth/logout
// async function logout(req, res, next) {
//   try {
//     res.clearCookie('token')
//     res.clearCookie('mfa_pending')
//     res.clearCookie('mfa_setup')
//     if (req.admin) {
//       await logAction(req.admin, 'ADMIN_LOGOUT', 'user', req.admin.id, {}, req)
//     }
//     return res.json(new ApiResponse(200, null, 'Logged out successfully'))
//   } catch (err) {
//     return next(err)
//   }
// }

// // GET /api/admin/auth/me
// async function getMe(req, res, next) {
//   try {
//     if (!req.admin) return next(new ApiError(401, 'Not authenticated'))
//     const user = await User.findById(req.admin.id)
//     if (!user) return next(new ApiError(404, 'User not found'))
//     return res.json(
//       new ApiResponse(
//         200,
//         { id: user._id, name: user.name, email: user.email, role: user.role },
//         'Profile fetched'
//       )
//     )
//   } catch (err) {
//     return next(err)
//   }
// }

// module.exports = { login, setupMfa, confirmMfa, verifyMfa, logout, getMe }

// server/src/controllers/admin/authController.js
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const OTP = require('../../models/OTP')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const generateToken = require('../../utils/generateToken')
const { sendOTPEmail } = require('../../config/nodemailer')
const { validationResult } = require('express-validator')

let logAction
try {
  logAction = require('../../services/auditService').logAction
} catch {
  logAction = async () => {}
}

// ── Helper: create short-lived pending cookie ─────────────────
const createPendingToken = (userId) =>
  jwt.sign({ id: userId, type: 'otp-pending' }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  })

// ── POST /api/admin/auth/login ────────────────────────────────
async function login(req, res, next) {
  try {

    const { email = '', password = '' } = req.body  

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail
    }).select('+password')

    if (!user || !user.isActive) {
      return next(new ApiError(401, 'Invalid credentials'))
    }

    // Check account lock
    if (user.isLocked) {
      return next(
        new ApiError(
          423,
          'Account locked due to too many failed attempts. Try again in 30 minutes.'
        )
      )
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      await user.incrementLoginAttempts()
      return next(new ApiError(401, 'Invalid credentials'))
    }

    // Reset failed attempts on successful password
    await user.resetLoginAttempts()

    // Generate OTP and send to admin email
    const code = await OTP.generateFor(user._id, 'login')

    await sendOTPEmail({
      to: user.email,
      name: user.name,
      code,
      purpose: 'login'
    })

    // Set a short-lived pending cookie so /verify-otp knows who is verifying
    const pendingToken = createPendingToken(user._id)

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000
    }

    res.cookie('otp_pending', pendingToken, cookieOptions)

    return res.json(
      new ApiResponse(
        200,
        {
          otpRequired: true,
          email: user.email.replace(/(.{2}).+(@.+)/, '$1***$2') // masked
        },
        'OTP sent to your registered email address'
      )
    )
  } catch (err) {
    return next(err)
  }
}

// ── POST /api/admin/auth/verify-otp ──────────────────────────
async function verifyLoginOTP(req, res, next) {
  try {
    const { code = '' } = req.body

    if (!code) {
      return next(new ApiError(400, 'OTP code is required'))
    }

    // Read pending cookie
    const pendingToken = req.cookies?.otp_pending
    if (!pendingToken) {
      return next(
        new ApiError(401, 'OTP session expired. Please log in again.')
      )
    }

    let decoded
    try {
      decoded = jwt.verify(pendingToken, process.env.JWT_SECRET)
    } catch {
      return next(
        new ApiError(401, 'OTP session expired. Please log in again.')
      )
    }

    if (decoded.type !== 'otp-pending') {
      return next(new ApiError(401, 'Invalid session token'))
    }

    const user = await User.findById(decoded.id)
    if (!user || !user.isActive) {
      return next(new ApiError(401, 'User not found or inactive'))
    }

    // Verify OTP
    const valid = await OTP.verifyCode(user._id, 'login', code)

    if (!valid) {
      return next(
        new ApiError(
          401,
          'Invalid or expired OTP code. Please check your email.'
        )
      )
    }

    // Clear pending cookie
    res.clearCookie('otp_pending')

    // Update last login
    user.lastLoginAt = new Date()
    await user.save({ validateBeforeSave: false })

    // Issue full JWT
    const token = generateToken(user, res)

    await logAction(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      'ADMIN_LOGIN',
      'user',
      user._id,
      {},
      req
    )

    return res.json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        },
        'Login successful'
      )
    )
  } catch (err) {
    return next(err)
  }
}

// ── POST /api/admin/auth/logout ───────────────────────────────
async function logout(req, res, next) {
  try {
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/'
    }

    res.clearCookie('token', clearOptions)
    res.clearCookie('otp_pending', clearOptions)

    if (req.admin) {
      await logAction(req.admin, 'ADMIN_LOGOUT', 'user', req.admin.id, {}, req)
    }

    return res.json(new ApiResponse(200, null, 'Logged out successfully'))
  } catch (err) {
    return next(err)
  }
}

// ── GET /api/admin/auth/me ────────────────────────────────────
async function getMe(req, res, next) {
  try {
    if (!req.admin) return next(new ApiError(401, 'Not authenticated'))

    const user = await User.findById(req.admin.id)
    if (!user) return next(new ApiError(404, 'User not found'))

    return res.json(
      new ApiResponse(
        200,
        { id: user._id, name: user.name, email: user.email, role: user.role },
        'Profile fetched'
      )
    )
  } catch (err) {
    return next(err)
  }
}

module.exports = { login, verifyLoginOTP, logout, getMe }
