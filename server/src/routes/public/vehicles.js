const express = require('express')
const Vehicle = require('../../models/Vehicle') // ← zaroori line

const {
  getVehicles,
  getFeaturedVehicles,
  getSlideshowImages,
  getVehicleById
} = require('../../controllers/public/vehicleController')

const router = express.Router()

router.get('/slideshow', getSlideshowImages)
// Order important: pehle specific routes, phir parameterized route
router.get('/', getVehicles)
router.get('/featured', getFeaturedVehicles)

// Filters endpoint — isey /:id se pehle rakho
router.get('/filters', async (req, res) => {
  try {
    const [makes, bodyTypes, fuelTypes, transmissions] = await Promise.all([
      Vehicle.distinct('make', { status: 'available' }),
      Vehicle.distinct('bodyType', { status: 'available' }),
      Vehicle.distinct('fuelType', { status: 'available' }),
      Vehicle.distinct('transmission', { status: 'available' })
    ])
    res.json({ makes, bodyTypes, fuelTypes, transmissions })
  } catch (err) {
    console.error('Error fetching filter options:', err)
    res.status(500).json({ message: 'Failed to load filter options' })
  }
})

// Parameterized route sab se aakhir mein rakho
router.get('/:id', getVehicleById)

module.exports = router
