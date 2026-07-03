// // server/src/validators/formValidators.js
// const { body } = require('express-validator')

// // ── Shared reusable field validators ─────────────────────────
// const nameField = body('name')
//   .isString()
//   .trim()
//   .isLength({ min: 2, max: 120 })
//   .withMessage('Name must be between 2 and 120 characters')

// const emailField = body('email')
//   .isEmail()
//   .withMessage('Valid email is required')
//   .normalizeEmail()

// const phoneField = body('phone')
//   .isString()
//   .trim()
//   .isLength({ min: 7, max: 20 })
//   .withMessage('Valid phone number is required')

// // ── Contact message ───────────────────────────────────────────
// const contactMessageValidator = [
//   nameField,
//   emailField,
//   body('phone').optional().isString().trim().escape(),
//   body('topic').optional().isString().trim().escape(),
//   body('subject')
//     .isString()
//     .trim()
//     .escape()
//     .isLength({ min: 5, max: 200 })
//     .withMessage('Subject must be between 5 and 200 characters'),
//   body('message')
//     .isString()
//     .trim()
//     .isLength({ min: 10, max: 4000 })
//     .withMessage('Message must be between 10 and 4000 characters')
//     .escape()
// ]

// // ── Finance application ───────────────────────────────────────
// const financeApplicationValidator = [
//   body('firstName')
//     .isString()
//     .trim()
//     .escape()
//     .isLength({ min: 2, max: 80 })
//     .withMessage('First name is required'),
//   body('lastName')
//     .isString()
//     .trim()
//     .escape()
//     .isLength({ min: 2, max: 80 })
//     .withMessage('Last name is required'),
//   emailField,
//   phoneField,
//   body('monthlyIncome')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Monthly income must be a positive number'),
//   body('vehiclePrice')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Vehicle price must be a positive number'),
//   body('termMonths')
//     .optional()
//     .isInt({ min: 12, max: 96 })
//     .withMessage('Term must be between 12 and 96 months')
// ]

// // ── Trade-in request ──────────────────────────────────────────
// const tradeInRequestValidator = [
//   nameField,
//   emailField,
//   phoneField,
//   body('year')
//     .optional()
//     .isInt({ min: 1980, max: new Date().getFullYear() + 1 })
//     .withMessage('Valid year is required'),
//   body('make').optional().isString().trim().escape(),
//   body('model').optional().isString().trim().escape(),
//   body('mileage')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Mileage must be a positive number')
// ]

// // ── Test drive request ────────────────────────────────────────
// const testDriveRequestValidator = [
//   nameField,
//   emailField,
//   phoneField,
//   body('preferredDate')
//     .optional()
//     .isISO8601()
//     .toDate()
//     .withMessage('Valid date is required'),
//   body('preferredTimeSlot').optional().isString().trim().escape(),
//   body('vehicleTitle').optional().isString().trim().escape()
// ]

// // ── Sourcing request ──────────────────────────────────────────
// const sourcingRequestValidator = [
//   nameField,
//   emailField,
//   phoneField,
//   body('desiredBudgetMax')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Budget must be a positive number'),
//   body('desiredYearMin')
//     .optional()
//     .isInt({ min: 1980 })
//     .withMessage('Valid year required'),
//   body('desiredYearMax')
//     .optional()
//     .isInt({ min: 1980 })
//     .withMessage('Valid year required'),
//   body('desiredMake').optional().isString().trim().escape(),

//   body('desiredModel').optional().isString().trim().escape()
// ]

// module.exports = {
//   contactMessageValidator,
//   financeApplicationValidator,
//   tradeInRequestValidator,
//   testDriveRequestValidator,
//   sourcingRequestValidator
// }

const { body } = require('express-validator')

// Shared reusable validators
const nameField = body('name')
  .isString()
  .trim()
  .isLength({ min: 2, max: 120 })
  .withMessage('Name must be between 2 and 120 characters')

const emailField = body('email')
  .isEmail()
  .withMessage('Valid email is required')
  .normalizeEmail()

const phoneField = body('phone')
  .isString()
  .trim()
  .isLength({ min: 7, max: 20 })
  .withMessage('Valid phone number is required')

// Consent validator
const consentValidator = [
  body('consent.accepted')
    .equals('true')
    .withMessage(
      'You must accept the authorization agreement before submitting.'
    )
]

// Contact message
const contactMessageValidator = [
  nameField,
  emailField,
  body('phone').optional().isString().trim().escape(),
  body('topic').optional().isString().trim().escape(),
  body('subject')
    .isString()
    .trim()
    .escape()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 10, max: 4000 })
    .withMessage('Message must be between 10 and 4000 characters')
    .escape(),
  ...consentValidator
]

// Finance application
const financeApplicationValidator = [
  body('firstName')
    .isString()
    .trim()
    .escape()
    .isLength({ min: 2, max: 80 })
    .withMessage('First name is required'),
  body('lastName')
    .isString()
    .trim()
    .escape()
    .isLength({ min: 2, max: 80 })
    .withMessage('Last name is required'),
  emailField,
  phoneField,
  body('monthlyIncome')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly income must be a positive number'),
  body('vehiclePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Vehicle price must be a positive number'),
  body('termMonths')
    .optional()
    .isInt({ min: 12, max: 96 })
    .withMessage('Term must be between 12 and 96 months'),
  ...consentValidator
]

// Trade-in request
const tradeInRequestValidator = [
  nameField,
  emailField,
  phoneField,
  body('year')
    .optional()
    .isInt({ min: 1980, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year is required'),
  body('make').optional().isString().trim().escape(),
  body('model').optional().isString().trim().escape(),
  body('mileage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  ...consentValidator
]

// Test drive request
const testDriveRequestValidator = [
  nameField,
  emailField,
  phoneField,
  body('preferredDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid date is required'),
  body('preferredTimeSlot').optional().isString().trim().escape(),
  body('vehicleTitle').optional().isString().trim().escape(),
  ...consentValidator
]

// Sourcing request
const sourcingRequestValidator = [
  nameField,
  emailField,
  phoneField,
  body('desiredBudgetMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('desiredYearMin')
    .optional()
    .isInt({ min: 1980 })
    .withMessage('Valid year required'),
  body('desiredYearMax')
    .optional()
    .isInt({ min: 1980 })
    .withMessage('Valid year required'),
  body('desiredMake').optional().isString().trim().escape(),
  body('desiredModel').optional().isString().trim().escape(),
  ...consentValidator
]

module.exports = {
  contactMessageValidator,
  financeApplicationValidator,
  tradeInRequestValidator,
  testDriveRequestValidator,
  sourcingRequestValidator
}
