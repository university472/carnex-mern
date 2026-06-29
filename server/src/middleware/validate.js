// import { validationResult } from 'express-validator'
// import ApiError from '../utils/ApiError.js'

// const validate = (req, res, next) => {
//   const errors = validationResult(req)
//   if (errors.isEmpty()) return next()

//   const extracted = errors.array().map((err) => ({
//     field: err.param,
//     message: err.msg
//   }))

//   return next(new ApiError(422, 'Validation failed', extracted))
// }

// export default validate

// server/src/middleware/validate.js
const { validationResult } = require('express-validator')
const ApiError = require('../utils/ApiError')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  const extracted = errors.array().map((err) => ({
    field: err.param || err.path,
    message: err.msg
  }))

  return next(new ApiError(422, 'Validation failed', extracted))
}

module.exports = validate
