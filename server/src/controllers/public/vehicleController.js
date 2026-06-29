// import Vehicle from '../../models/Vehicle.js'
// import ApiError from '../../utils/ApiError.js'
// import ApiResponse from '../../utils/ApiResponse.js'

// /**
//  * GET /api/vehicles
//  * Public inventory list with filters + pagination
//  */
// export const getVehicles = async (req, res, next) => {
//   try {
//     const {
//       make,
//       model,
//       category,
//       condition,
//       minPrice,
//       maxPrice,
//       minMileage,
//       maxMileage,
//       minYear,
//       maxYear,
//       exteriorColor,
//       drivetrain,
//       fuelType,
//       search,
//       sort = 'newest',
//       page = 1,
//       limit = 12
//     } = req.query

//     const pageNum = Number(page) || 1
//     const limitNum = Number(limit) || 12
//     const skip = (pageNum - 1) * limitNum

//     const filter = {
//       status: 'published'
//     }

//     if (make) filter.make = new RegExp(`^${make}$`, 'i')
//     if (model) filter.model = new RegExp(`^${model}$`, 'i')
//     if (category) filter.category = category
//     if (condition) filter.condition = condition

//     if (minPrice || maxPrice) {
//       filter.price = {}
//       if (minPrice) filter.price.$gte = Number(minPrice)
//       if (maxPrice) filter.price.$lte = Number(maxPrice)
//     }

//     if (minMileage || maxMileage) {
//       filter.mileage = {}
//       if (minMileage) filter.mileage.$gte = Number(minMileage)
//       if (maxMileage) filter.mileage.$lte = Number(maxMileage)
//     }

//     if (minYear || maxYear) {
//       filter.year = {}
//       if (minYear) filter.year.$gte = Number(minYear)
//       if (maxYear) filter.year.$lte = Number(maxYear)
//     }

//     if (exteriorColor) {
//       filter.exteriorColor = new RegExp(exteriorColor, 'i')
//     }

//     if (drivetrain) {
//       filter.drivetrain = new RegExp(drivetrain, 'i')
//     }

//     if (fuelType) {
//       filter.fuelType = new RegExp(fuelType, 'i')
//     }

//     if (search) {
//       const regex = new RegExp(search, 'i')
//       filter.$or = [
//         { make: regex },
//         { model: regex },
//         { trim: regex },
//         { stockNumber: regex },
//         { vin: regex }
//       ]
//     }

//     const sortMap = {
//       price_asc: { price: 1 },
//       price_desc: { price: -1 },
//       year_desc: { year: -1 },
//       mileage_asc: { mileage: 1 },
//       newest: { createdAt: -1 }
//     }

//     const sortOption = sortMap[sort] || sortMap.newest

//     const [vehicles, total] = await Promise.all([
//       Vehicle.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
//       Vehicle.countDocuments(filter)
//     ])

//     const totalPages = Math.ceil(total / limitNum) || 1

//     return res.json(
//       new ApiResponse(
//         200,
//         {
//           data: vehicles,
//           pagination: {
//             page: pageNum,
//             limit: limitNum,
//             total,
//             totalPages
//           }
//         },
//         'Vehicles fetched successfully'
//       )
//     )
//   } catch (err) {
//     return next(err)
//   }
// }

// /**
//  * GET /api/vehicles/featured
//  */
// export const getFeaturedVehicles = async (req, res, next) => {
//   try {
//     const limit = Number(req.query.limit) || 4

//     const vehicles = await Vehicle.find({
//       status: 'published',
//       isFeatured: true
//     })
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .lean()

//     return res.json(
//       new ApiResponse(
//         200,
//         { data: vehicles },
//         'Featured vehicles fetched successfully'
//       )
//     )
//   } catch (err) {
//     return next(err)
//   }
// }

// /**
//  * GET /api/vehicles/:slug
//  */
// export const getVehicleBySlug = async (req, res, next) => {
//   try {
//     const { slug } = req.params

//     const vehicle = await Vehicle.findOne({
//       slug,
//       status: { $ne: 'archived' }
//     }).lean()

//     if (!vehicle) {
//       return next(new ApiError(404, 'Vehicle not found'))
//     }

//     // increment viewCount in background (no need to await for response)
//     Vehicle.updateOne({ _id: vehicle._id }, { $inc: { viewCount: 1 } }).catch(
//       () => {}
//     )

//     return res.json(
//       new ApiResponse(200, vehicle, 'Vehicle fetched successfully')
//     )
//   } catch (err) {
//     return next(err)
//   }
// }


// server/src/controllers/public/vehicleController.js
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

    if (make) filter.make = new RegExp(`^${make}$`, 'i')
    if (model) filter.model = new RegExp(`^${model}$`, 'i')
    if (bodyType) filter.bodyType = new RegExp(`^${bodyType}$`, 'i')
    if (fuelType) filter.fuelType = new RegExp(`^${fuelType}$`, 'i')
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
      const regex = new RegExp(search, 'i')
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

/**
 * GET /api/vehicles/:id
 * Supports both MongoDB ObjectId and legacy string id
 */
async function getVehicleById(req, res, next) {
  try {
    const { id } = req.params

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
