// server/src/validators/financeValidators.js
const { body } = require('express-validator')

const optionalAmount = (field) =>
  body(field).optional({ checkFalsy: true }).isFloat({ min: 0 })

exports.updateVehicleFinanceValidator = [
  optionalAmount('purchasePrice'),
  body('purchaseDate').optional({ checkFalsy: true }).isISO8601(),
  body('acquisitionSource')
    .optional({ checkFalsy: true })
    .isIn(['auction', 'trade-in', 'wholesale', 'private-party', 'other']),
  optionalAmount('acquisitionTax'),
  optionalAmount('acquisitionFees'),
  optionalAmount('transportationCost'),
  optionalAmount('auctionFees'),
  optionalAmount('otherAcquisitionCost'),

  optionalAmount('reconditioningCost'),
  optionalAmount('otherPrepCost'),

  optionalAmount('customerSalesTax'),
  optionalAmount('registrationFee'),
  optionalAmount('titleFee'),
  optionalAmount('discountGiven'),
  optionalAmount('otherSaleCost'),

  optionalAmount('taxRemittedByCompany'),
  optionalAmount('otherTaxesFees'),

  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 3000 })
]
