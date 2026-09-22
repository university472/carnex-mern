const mongoose = require('mongoose')
const Vehicle = require('../../models/Vehicle')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')

/**
 * Helper: builds a case‑insensitive, escaped regex from user input
 */
function safeRegex(value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(escaped, 'i')
}

/**
 * GET /api/vehicles
 * Public inventory list with filters, search, sorting & pagination
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

    const filter = {
      status: { $in: ['available', 'sold'] }
    }

    // ── Exact‑match filters ────────────────────────────────
    if (make) {
      filter.make = { $regex: `^${make}$`, $options: 'i' }
    }
    if (model) filter.model = safeRegex(model)
    if (bodyType) {
      filter.bodyType = { $regex: `^${bodyType}$`, $options: 'i' }
    }
    if (fuelType) filter.fuelType = safeRegex(fuelType)
    if (transmission) {
      filter.transmission = new RegExp(`^${transmission}$`, 'i')
    }

    // ── Range filters ──────────────────────────────────────
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

    // ── Full‑text search across multiple fields ────────────
    if (search) {
      const regex = safeRegex(search)
      filter.$or = [
        { make: regex },
        { model: regex },
        { title: regex },
        { vin: regex }
      ]
    }

    // ── Sorting ────────────────────────────────────────────
    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'year-desc': { year: -1 },
      'mileage-asc': { mileage: 1 },
      newest: { createdAt: -1 }
    }
    const sortOption = sortMap[sort] || sortMap.newest

    // ── Execute queries ────────────────────────────────────
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
    console.error('========== VEHICLE ERROR ==========')
    console.error(err)
    console.error(err.stack)
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
    console.error('========== FEATURED ERROR ==========')
    console.error(err)
    console.error(err.stack)
    return next(err)
  }
}

/**
 * GET /api/vehicles/slideshow
 * ⬅️ NEW: Slideshow ke liye images fetch karta hai
 * Ye sirf 'available' vehicles ki images return karega
 */
async function getSlideshowImages(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50)

    const vehicles = await Vehicle.find({
      status: 'available',
      'images.0': { $exists: true } // Sirf woh vehicles jinke paas kam se kam ek image ho
    })
      .select('images make model')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Har vehicle ki pehli image collect karo
    const images = vehicles
      .filter((v) => v.images && v.images.length > 0)
      .map((v) => ({
        url: v.images[0],
        make: v.make,
        model: v.model
      }))

    return res.json(
      new ApiResponse(200, { images }, 'Slideshow images fetched successfully')
    )
  } catch (err) {
    console.error('========== SLIDESHOW ERROR ==========')
    console.error(err)
    console.error(err.stack)
    return next(err)
  }
}

/**
 * GET /api/vehicles/:id
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
    console.error('========== VEHICLE ERROR ==========')
    console.error(err)
    console.error(err.stack)
    return next(err)
  }
}

module.exports = {
  getVehicles,
  getFeaturedVehicles,
  getSlideshowImages, // ⬅️ NEW: Export karo
  getVehicleById
}
