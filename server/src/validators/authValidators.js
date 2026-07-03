// server/src/validators/authValidators.js
const { body } = require('express-validator')

const adminLoginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage(
      'Password must contain uppercase, lowercase, number and symbol'
    )
]

const verifyOTPValidator = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only digits')
]

const changePasswordValidator = [
  body('currentPassword')
    .isLength({ min: 8 })
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
]

const createAdminValidator = [
  body('name')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role')
    .isIn(['super-admin', 'admin', 'sales', 'viewer'])
    .withMessage('Invalid role')
]

// module.exports = {
//   adminLoginValidator,
//   changePasswordValidator,
//   createAdminValidator
// }

module.exports = {
  adminLoginValidator,
  verifyOTPValidator,
  changePasswordValidator,
  createAdminValidator
}
