// // server/src/routes/public/vehicles.js
// const express = require('express')
// const validateRequest = require('../../middleware/validateRequest')
// const {
//   getVehicles,
//   getFeaturedVehicles,
//   getVehicleById
// } = require('../../controllers/public/vehicleController')

// const router = express.Router()
// router.post('/', contactMessageValidator, validateRequest, submitContactMessage)
// // GET /api/vehicles
// router.get('/', getVehicles)

// // GET /api/vehicles/featured
// router.get('/featured', getFeaturedVehicles)

// // GET /api/vehicles/:id
// router.get('/:id', getVehicleById)

// module.exports = router

// server/src/routes/public/vehicles.js

const express = require('express')

const {
  getVehicles,
  getFeaturedVehicles,
  getVehicleById
} = require('../../controllers/public/vehicleController')

const router = express.Router()

// GET /api/vehicles
router.get('/', getVehicles)

// GET /api/vehicles/featured
router.get('/featured', getFeaturedVehicles)

// GET /api/vehicles/:id
router.get('/:id', getVehicleById)

module.exports = router
