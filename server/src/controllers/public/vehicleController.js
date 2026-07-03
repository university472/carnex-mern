// server/src/controllers/public/vehicleController.js
const mongoose = require('mongoose')
const escapeStringRegexp = require('escape-string-regexp')
const Vehicle = require('../../models/Vehicle')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')

/**
 * GET /api/vehicles
 * Public inventory list with filters + pagination
 */
async function getVehicles(req, res, next) {
  try {
    const {
      make,
      model,
      bodyType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      minMileage,
      maxMileage,
      minYear,
      maxYear,
      search,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query

    const pageNum = Math.max(Number(page) || 1, 1)
    const limitNum = Math.min(Number(limit) || 12, 60)
    const skip = (pageNum - 1) * limitNum

    const filter = { status: 'available' }

    if (make) filter.make = safeRegex(make)
    if (model) filter.model = safeRegex(model)
    if (bodyType) filter.bodyType = safeRegex(bodyType)
    if (fuelType) filter.fuelType = safeRegex(fuelType)
    if (transmission) filter.transmission = new RegExp(`^${transmission}$`, 'i')

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (minMileage || maxMileage) {
      filter.mileage = {}
      if (minMileage) filter.mileage.$gte = Number(minMileage)
      if (maxMileage) filter.mileage.$lte = Number(maxMileage)
    }
    if (minYear || maxYear) {
      filter.year = {}
      if (minYear) filter.year.$gte = Number(minYear)
      if (maxYear) filter.year.$lte = Number(maxYear)
    }
    if (search) {
      const regex = safeRegex(search)
      filter.$or = [
        { make: regex },
        { model: regex },
        { title: regex },
        { vin: regex }
      ]
    }

    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'year-desc': { year: -1 },
      'mileage-asc': { mileage: 1 },
      newest: { createdAt: -1 }
    }
    const sortOption = sortMap[sort] || sortMap.newest

    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Vehicle.countDocuments(filter)
    ])

    const totalPages = Math.ceil(total / limitNum) || 1

    return res.json(
      new ApiResponse(
        200,
        {
          data: vehicles,
          pagination: { page: pageNum, limit: limitNum, total, totalPages }
        },
        'Vehicles fetched successfully'
      )
    )
  } catch (err) {
    return next(err)
  }
}

/**
 * GET /api/vehicles/featured
 */
async function getFeaturedVehicles(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 4, 12)

    const vehicles = await Vehicle.find({
      status: 'available',
      isFeatured: true
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return res.json(
      new ApiResponse(
        200,
        { data: vehicles },
        'Featured vehicles fetched successfully'
      )
    )
  } catch (err) {
    return next(err)
  }
}

function safeRegex(value) {
  return new RegExp(escapeStringRegexp(value), 'i')
}
/**
 * GET /api/vehicles/:id
 * Supports both MongoDB ObjectId and legacy string id
 */
function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

async function getVehicleById(req, res, next) {
  try {
    const { id } = req.params
    if (!validateObjectId(id)) {
      return next(new ApiError(400, 'Invalid vehicle id'))
    }
    const vehicle = await Vehicle.findById(id).lean()

    if (!vehicle || vehicle.status === 'hidden') {
      return next(new ApiError(404, 'Vehicle not found'))
    }

    // Increment view count in background
    Vehicle.updateOne({ _id: vehicle._id }, { $inc: { viewCount: 1 } }).catch(
      () => {}
    )

    return res.json(
      new ApiResponse(200, vehicle, 'Vehicle fetched successfully')
    )
  } catch (err) {
    return next(err)
  }
}

module.exports = { getVehicles, getFeaturedVehicles, getVehicleById }
