const { body } = require('express-validator')

exports.reviewValidator = [
  body('customerName').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('reviewText').trim().notEmpty().withMessage('Review text is required'),
  body('location').optional().trim(),
  body('purchasedVehicle').optional().trim()
]
