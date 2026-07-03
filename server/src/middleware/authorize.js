// server/src/middleware/authorize.js
const ApiError = require('../utils/ApiError')

function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.admin) {
      return next(ApiError.unauthorized('Not authenticated'))
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return next(
        ApiError.forbidden('You do not have permission to perform this action')
      )
    }

    return next()
  }
}

module.exports = authorize
