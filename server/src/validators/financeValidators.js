// server/src/validators/financeValidators.js
const { body } = require('express-validator')

const optionalAmount = (field) =>
  body(field).optional({ checkFalsy: true }).isFloat({ min: 0 })

exports.updateVehicleFinanceValidator = [
  optionalAmount('purchasePrice'),
  optionalAmount('listedFor'),
  optionalAmount('listedAmount'),
  optionalAmount('minimumPrice'),
  optionalAmount('soldFor'),
  optionalAmount('collectedAmount'),
  optionalAmount('dmvFeePaid'),

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
