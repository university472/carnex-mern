// const { validationResult } = require('express-validator')
// const Vehicle = require('../../models/Vehicle')
// const ApiError = require('../../utils/ApiError')
// const ApiResponse = require('../../utils/ApiResponse')
// const { getPaginationParams } = require('../../utils/pagination')

// // GET /api/admin/vehicles
// // Admin inventory list with filters, search, pagination.
// async function adminGetVehicles(req, res, next) {
//   try {
//     const { page, limit, skip } = getPaginationParams(req.query, 20, 100)

//     const {
//       status,
//       make,
//       model,
//       bodyType,
//       fuelType,
//       minPrice,
//       maxPrice,
//       minYear,
//       maxYear,
//       search,
//       sort = 'newest'
//     } = req.query

//     const query = {}

//     if (status) query.status = status
//     if (make) query.make = new RegExp(make, 'i')
//     if (model) query.model = new RegExp(model, 'i')
//     if (bodyType) query.bodyType = new RegExp(bodyType, 'i')
//     if (fuelType) query.fuelType = new RegExp(fuelType, 'i')

//     if (minPrice || maxPrice) {
//       query.price = {}
//       if (minPrice) query.price.$gte = Number(minPrice)
//       if (maxPrice) query.price.$lte = Number(maxPrice)
//     }

//     if (minYear || maxYear) {
//       query.year = {}
//       if (minYear) query.year.$gte = Number(minYear)
//       if (maxYear) query.year.$lte = Number(maxYear)
//     }

//     if (search) {
//       const regex = new RegExp(search, 'i')
//       query.$or = [
//         { title: regex },
//         { make: regex },
//         { model: regex },
//         { stockNumber: regex },
//         { vin: regex }
//       ]
//     }

//     let sortOption = { createdAt: -1 } // newest first
//     if (sort === 'price-asc') sortOption = { price: 1 }
//     if (sort === 'price-desc') sortOption = { price: -1 }
//     if (sort === 'year-desc') sortOption = { year: -1 }
//     if (sort === 'year-asc') sortOption = { year: 1 }

//     const [items, totalItems] = await Promise.all([
//       Vehicle.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
//       Vehicle.countDocuments(query)
//     ])

//     const totalPages = Math.ceil(totalItems / limit) || 1

//     const response = new ApiResponse(
//       200,
//       {
//         items,
//         pagination: {
//           page,
//           limit,
//           totalItems,
//           totalPages,
//           hasNextPage: page < totalPages
//         }
//       },
//       'Vehicles fetched successfully'
//     )

//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// // GET /api/admin/vehicles/:id
// async function adminGetVehicleById(req, res, next) {
//   try {
//     const { id } = req.params
//     const vehicle = await Vehicle.findById(id).lean()
//     if (!vehicle) {
//       return next(ApiError.notFound('Vehicle not found'))
//     }
//     const response = new ApiResponse(
//       200,
//       vehicle,
//       'Vehicle fetched successfully'
//     )
//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// // POST /api/admin/vehicles
// async function adminCreateVehicle(req, res, next) {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return next(ApiError.badRequest('Validation failed', errors.array()))
//     }

//     const vehicle = await Vehicle.create(req.body)

//     const response = new ApiResponse(
//       201,
//       vehicle,
//       'Vehicle created successfully'
//     )
//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     // Handle unique index errors for vin/stockNumber gracefully.
//     if (err.code === 11000) {
//       return next(
//         ApiError.badRequest('Duplicate VIN or stock number', [
//           { msg: 'Duplicate key', param: Object.keys(err.keyPattern)[0] }
//         ])
//       )
//     }
//     return next(ApiError.internal(err.message))
//   }
// }

// // PATCH /api/admin/vehicles/:id
// async function adminUpdateVehicle(req, res, next) {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return next(ApiError.badRequest('Validation failed', errors.array()))
//     }

//     const { id } = req.params

//     const updated = await Vehicle.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true
//     })

//     if (!updated) {
//       return next(ApiError.notFound('Vehicle not found'))
//     }

//     const response = new ApiResponse(
//       200,
//       updated,
//       'Vehicle updated successfully'
//     )
//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     if (err.code === 11000) {
//       return next(
//         ApiError.badRequest('Duplicate VIN or stock number', [
//           { msg: 'Duplicate key', param: Object.keys(err.keyPattern)[0] }
//         ])
//       )
//     }
//     return next(ApiError.internal(err.message))
//   }
// }

// // PATCH /api/admin/vehicles/:id/status
// async function adminUpdateVehicleStatus(req, res, next) {
//   try {
//     const { id } = req.params
//     const { status } = req.body

//     if (!['available', 'reserved', 'sold', 'hidden'].includes(status)) {
//       return next(ApiError.badRequest('Invalid status value'))
//     }

//     const updated = await Vehicle.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     )

//     if (!updated) {
//       return next(ApiError.notFound('Vehicle not found'))
//     }

//     const response = new ApiResponse(
//       200,
//       updated,
//       'Vehicle status updated successfully'
//     )
//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// // DELETE /api/admin/vehicles/:id  (soft delete -> hidden)
// async function adminSoftDeleteVehicle(req, res, next) {
//   try {
//     const { id } = req.params

//     const updated = await Vehicle.findByIdAndUpdate(
//       id,
//       { status: 'hidden' },
//       { new: true }
//     )

//     if (!updated) {
//       return next(ApiError.notFound('Vehicle not found'))
//     }

//     const response = new ApiResponse(
//       200,
//       updated,
//       'Vehicle hidden (soft-deleted) successfully'
//     )
//     return res.status(response.statusCode).json(response)
//   } catch (err) {
//     return next(ApiError.internal(err.message))
//   }
// }

// module.exports = {
//   adminGetVehicles,
//   adminGetVehicleById,
//   adminCreateVehicle,
//   adminUpdateVehicle,
//   adminUpdateVehicleStatus,
//   adminSoftDeleteVehicle
// }

// server/src/controllers/admin/vehicleController.js
const { validationResult } = require('express-validator')
const Vehicle = require('../../models/Vehicle')
const ApiError = require('../../utils/ApiError')
const ApiResponse = require('../../utils/ApiResponse')
const { getPaginationParams } = require('../../utils/pagination')

// Lazy-load upload util so app doesn't crash if cloudinary env vars are absent
let uploadToCloudinary, deleteFromCloudinary
try {
  const uploadModule = require('../../middleware/upload')
  uploadToCloudinary = uploadModule.uploadToCloudinary
  deleteFromCloudinary = uploadModule.deleteFromCloudinary
} catch {
  uploadToCloudinary = null
  deleteFromCloudinary = null
}

// ── Helper: upload req.files to Cloudinary ───────────────────
async function processUploadedFiles(files) {
  if (!files || !files.length || !uploadToCloudinary) return []
  const results = await Promise.all(
    files.map((f) => uploadToCloudinary(f.buffer, 'carnex/vehicles'))
  )
  return results.map(({ url, publicId }) => ({ url, publicId }))
}

// GET /api/admin/vehicles
async function adminGetVehicles(req, res, next) {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 20, 100)
    const {
      status,
      make,
      model,
      bodyType,
      fuelType,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      search,
      sort = 'newest'
    } = req.query

    const query = {}
    if (status) query.status = status
    if (make) query.make = new RegExp(make, 'i')
    if (model) query.model = new RegExp(model, 'i')
    if (bodyType) query.bodyType = new RegExp(bodyType, 'i')
    if (fuelType) query.fuelType = new RegExp(fuelType, 'i')
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (minYear || maxYear) {
      query.year = {}
      if (minYear) query.year.$gte = Number(minYear)
      if (maxYear) query.year.$lte = Number(maxYear)
    }
    if (search) {
      const regex = new RegExp(search, 'i')
      query.$or = [
        { title: regex },
        { make: regex },
        { model: regex },
        { vin: regex },
        { stockNumber: regex }
      ]
    }

    let sortOption = { createdAt: -1 }
    if (sort === 'price-asc') sortOption = { price: 1 }
    if (sort === 'price-desc') sortOption = { price: -1 }
    if (sort === 'year-desc') sortOption = { year: -1 }
    if (sort === 'year-asc') sortOption = { year: 1 }

    const [items, totalItems] = await Promise.all([
      Vehicle.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      Vehicle.countDocuments(query)
    ])

    const totalPages = Math.ceil(totalItems / limit) || 1

    return res.json(
      new ApiResponse(
        200,
        {
          items,
          pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages
          }
        },
        'Vehicles fetched successfully'
      )
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// GET /api/admin/vehicles/:id
async function adminGetVehicleById(req, res, next) {
  try {
    const vehicle = await Vehicle.findById(req.params.id).lean()
    if (!vehicle) return next(ApiError.notFound('Vehicle not found'))
    return res.json(
      new ApiResponse(200, vehicle, 'Vehicle fetched successfully')
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// POST /api/admin/vehicles
async function adminCreateVehicle(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return next(ApiError.badRequest('Validation failed', errors.array()))

    const uploadedImages = await processUploadedFiles(req.files)

    const payload = {
      ...req.body,
      year: Number(req.body.year),
      price: Number(req.body.price),
      mileage: req.body.mileage ? Number(req.body.mileage) : undefined
    }

    if (uploadedImages.length > 0) {
      payload.images = uploadedImages
    }

    const vehicle = await Vehicle.create(payload)
    return res
      .status(201)
      .json(new ApiResponse(201, vehicle, 'Vehicle created successfully'))
  } catch (err) {
    if (err.code === 11000) {
      return next(
        ApiError.badRequest('Duplicate VIN or stock number', [
          { msg: 'Duplicate key', param: Object.keys(err.keyPattern)[0] }
        ])
      )
    }
    return next(ApiError.internal(err.message))
  }
}

// PATCH /api/admin/vehicles/:id
async function adminUpdateVehicle(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return next(ApiError.badRequest('Validation failed', errors.array()))

    const uploadedImages = await processUploadedFiles(req.files)

    const payload = { ...req.body }
    if (req.body.year) payload.year = Number(req.body.year)
    if (req.body.price) payload.price = Number(req.body.price)
    if (req.body.mileage) payload.mileage = Number(req.body.mileage)
    if (uploadedImages.length > 0) payload.images = uploadedImages

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    })
    if (!updated) return next(ApiError.notFound('Vehicle not found'))

    return res.json(
      new ApiResponse(200, updated, 'Vehicle updated successfully')
    )
  } catch (err) {
    if (err.code === 11000) {
      return next(
        ApiError.badRequest('Duplicate VIN or stock number', [
          { msg: 'Duplicate key', param: Object.keys(err.keyPattern)[0] }
        ])
      )
    }
    return next(ApiError.internal(err.message))
  }
}

// PATCH /api/admin/vehicles/:id/status
async function adminUpdateVehicleStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!['available', 'reserved', 'sold', 'hidden'].includes(status)) {
      return next(ApiError.badRequest('Invalid status value'))
    }
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!updated) return next(ApiError.notFound('Vehicle not found'))
    return res.json(
      new ApiResponse(200, updated, 'Vehicle status updated successfully')
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

// DELETE /api/admin/vehicles/:id (soft delete)
async function adminSoftDeleteVehicle(req, res, next) {
  try {
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: 'hidden' },
      { new: true }
    )
    if (!updated) return next(ApiError.notFound('Vehicle not found'))
    return res.json(
      new ApiResponse(200, updated, 'Vehicle hidden successfully')
    )
  } catch (err) {
    return next(ApiError.internal(err.message))
  }
}

module.exports = {
  adminGetVehicles,
  adminGetVehicleById,
  adminCreateVehicle,
  adminUpdateVehicle,
  adminUpdateVehicleStatus,
  adminSoftDeleteVehicle
}
