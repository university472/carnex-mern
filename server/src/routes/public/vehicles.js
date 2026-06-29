// // server/src/routes/public/vehicles.js
// const express = require('express')
// const {
//   getVehicles,
//   getVehicleById
// } = require('../../controllers/public/vehicleController')

// const router = express.Router()

// // Inventory list with filters & pagination
// router.get('/', getVehicles)

// // Vehicle detail
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
