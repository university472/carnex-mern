// server/src/middleware/auth.js
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')

const auth =
  (requireActive = true) =>
  async (req, res, next) => {
    try {
      let token = req.cookies?.token

      if (!token) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.slice(7)
        }
      }

      if (!token) {
        return next(new ApiError(401, 'Not authenticated'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: 'carnex',
        audience: 'carnex-admin'
      })

      const user = await User.findById(decoded.id).select('+password')

      if (!user) return next(new ApiError(401, 'User not found'))
      if (requireActive && !user.isActive)
        return next(new ApiError(403, 'Account is inactive'))

      if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
        return next(
          new ApiError(401, 'Password recently changed, please log in again')
        )
      }

      req.admin = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

      return next()
    } catch (err) {
      return next(new ApiError(401, 'Invalid or expired authentication token'))
    }
  }

module.exports = auth
