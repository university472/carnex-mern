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
