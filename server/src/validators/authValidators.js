// server/src/validators/authValidators.js
const { body } = require('express-validator')

const adminLoginValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
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

module.exports = {
  adminLoginValidator,
  changePasswordValidator,
  createAdminValidator
}
