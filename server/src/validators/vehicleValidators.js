// server/src/validators/vehicleValidators.js
const { body } = require('express-validator')

exports.createVehicleValidator = [
  body('title').optional({ checkFalsy: true }).trim(),

  body('make').optional({ checkFalsy: true }).trim(),

  body('model').optional({ checkFalsy: true }).trim(),
  body('year')
    .optional({ checkFalsy: true })
    .isInt({
      min: 1990,
      max: new Date().getFullYear() + 1
    }),
  body('price').optional({ checkFalsy: true }).isFloat({ min: 0 }),
  body('mileage')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Mileage must be a non-negative number'),
  body('condition')
    .optional()
    .isIn(['new', 'used', 'certified'])
    .withMessage('Condition must be new, used, or certified'),
  // Custom validation: if condition is 'used', mileage must be >=1
  // body('mileage').custom((value, { req }) => {
  //   const condition = req.body.condition || 'used' // default to used
  //   if (
  //     condition === 'used' &&
  //     (value === undefined ||
  //       value === null ||
  //       value === '' ||
  //       Number(value) < 1)
  //   ) {
  //     throw new Error(
  //       'Mileage is required for used vehicles and must be at least 1'
  //     )
  //   }
  //   // For new vehicles, allow missing/empty and later default to 0
  //   return true
  // }),
  body('stockNumber').optional().trim(),
  body('vin')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({
      min: 17,
      max: 17
    })
    .withMessage('VIN must be 17 characters'),
  body('exteriorColor').optional().trim(),
  body('interiorColor').optional().trim(),
  body('bodyType')
    .optional({ checkFalsy: true })
    .isIn([
      'Sedan',
      'SUV',
      'Coupe',
      'Convertible',
      'Hatchback',
      'Wagon',
      'Pickup Truck',
      'Van',
      'Minivan',
      'Crossover',
      'Luxury',
      'Sports Car',
      'Electric',
      'Hybrid',
      'Diesel',
      'Other'
    ])
    .withMessage('Invalid body type'),
  body('fuelType').optional().trim(),
  body('transmission').optional().trim(),
  body('driveType').optional().trim(),
  body('location').optional().trim(),
  body('description').optional().trim(),
  body('dealerNotes').optional().trim(),
  body('warranty').optional().trim(),
  body('status').optional().isIn(['available', 'reserved', 'sold', 'hidden']),
  body('isFeatured').optional().isBoolean(),
  body('badges.salePrice').optional().isFloat({ min: 0 }),
  body('badges.discountPrice').optional().isFloat({ min: 0 }),
  body('media.videoUrl').optional().trim(),
  body('media.view360Url').optional().trim(),
  body('media.carfaxUrl').optional().trim()
]

exports.updateVehicleValidator = [
  body('title').optional({ checkFalsy: true }).trim(),
  body('make').optional({ checkFalsy: true }).trim(),
  body('model').optional({ checkFalsy: true }).trim(),
  body('year')
    .optional({ checkFalsy: true })
    .isInt({
      min: 1990,
      max: new Date().getFullYear() + 1
    }),
  body('price').optional({ checkFalsy: true }).isFloat({ min: 0 }),
  body('mileage').optional({ checkFalsy: true }).isInt({ min: 0 }),
  body('condition').optional().isIn(['new', 'used', 'certified']),
  // body('mileage').custom((value, { req }) => {
  //   const condition = req.body.condition || 'used'
  //   if (
  //     condition === 'used' &&
  //     (value === undefined ||
  //       value === null ||
  //       value === '' ||
  //       Number(value) < 1)
  //   ) {
  //     throw new Error(
  //       'Mileage is required for used vehicles and must be at least 1'
  //     )
  //   }
  //   return true
  // }),
  body('stockNumber').optional().trim(),
  body('vin').optional({ checkFalsy: true }).trim().isLength({
    min: 17,
    max: 17
  }),
  body('exteriorColor').optional().trim(),
  body('interiorColor').optional().trim(),
  body('bodyType')
    .optional({ checkFalsy: true })
    .isIn([
      'Sedan',
      'SUV',
      'Coupe',
      'Convertible',
      'Hatchback',
      'Wagon',
      'Pickup Truck',
      'Van',
      'Minivan',
      'Crossover',
      'Luxury',
      'Sports Car',
      'Electric',
      'Hybrid',
      'Diesel',
      'Other'
    ]),
  body('fuelType').optional().trim(),
  body('transmission').optional().trim(),
  body('driveType').optional().trim(),
  body('location').optional().trim(),
  body('description').optional().trim(),
  body('dealerNotes').optional().trim(),
  body('warranty').optional().trim(),
  body('status').optional().isIn(['available', 'reserved', 'sold', 'hidden']),
  body('isFeatured').optional().isBoolean(),
  body('badges.salePrice').optional().isFloat({ min: 0 }),
  body('badges.discountPrice').optional().isFloat({ min: 0 }),
  body('media.videoUrl').optional().trim(),
  body('media.view360Url').optional().trim(),
  body('media.carfaxUrl').optional().trim()
]
