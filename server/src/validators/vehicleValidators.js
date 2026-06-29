// server/src/validators/vehicleValidators.js
const { body } = require('express-validator')

const createVehicleValidator = [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage('Title must be between 2 and 180 characters'),
  body('make').isString().trim().notEmpty().withMessage('Make is required'),
  body('model').isString().trim().notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('mileage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  body('status')
    .optional()
    .isIn(['available', 'reserved', 'sold', 'hidden'])
    .withMessage('Invalid status value')
]

const updateVehicleValidator = [
  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage('Title must be between 2 and 180 characters'),
  body('year')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year is required'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('mileage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  body('status')
    .optional()
    .isIn(['available', 'reserved', 'sold', 'hidden'])
    .withMessage('Invalid status value')
]

module.exports = { createVehicleValidator, updateVehicleValidator }

// import { query, param } from 'express-validator'

// export const listVehiclesValidator = [
//   query('make').optional().isString().trim(),
//   query('model').optional().isString().trim(),
//   query('category')
//     .optional()
//     .isIn([
//       'sedan',
//       'suv',
//       'pickup',
//       'coupe',
//       'hatchback',
//       'convertible',
//       'van',
//       'wagon'
//     ])
//     .withMessage('Invalid category'),
//   query('condition')
//     .optional()
//     .isIn(['new', 'used', 'certified'])
//     .withMessage('Invalid condition'),
//   query('minPrice').optional().isFloat({ min: 0 }),
//   query('maxPrice').optional().isFloat({ min: 0 }),
//   query('minMileage').optional().isFloat({ min: 0 }),
//   query('maxMileage').optional().isFloat({ min: 0 }),
//   query('minYear').optional().isInt({ min: 1980 }),
//   query('maxYear').optional().isInt({ min: 1980 }),
//   query('exteriorColor').optional().isString().trim(),
//   query('drivetrain').optional().isString().trim(),
//   query('fuelType').optional().isString().trim(),
//   query('search').optional().isString().trim().isLength({ min: 2 }),
//   query('sort')
//     .optional()
//     .isIn(['price_asc', 'price_desc', 'year_desc', 'mileage_asc', 'newest'])
//     .withMessage('Invalid sort option'),
//   query('page').optional().isInt({ min: 1 }),
//   query('limit').optional().isInt({ min: 1, max: 60 })
// ]

// export const slugParamValidator = [
//   param('slug')
//     .isString()
//     .trim()
//     .notEmpty()
//     .withMessage('Vehicle slug is required')
// ]
