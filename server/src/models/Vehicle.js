// server/src/models/Vehicle.js
const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180
    },
    stockNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true
    },
    make: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: 1990,
      max: new Date().getFullYear() + 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    mileage: {
      type: Number,
      min: 0
    },
    bodyType: {
      type: String,
      trim: true
    },
    fuelType: {
      type: String,
      trim: true
    },
    transmission: {
      type: String,
      trim: true
    },
    driveType: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    // Legacy single imageUrl field for backwards compatibility
    imageUrl: {
      type: String,
      trim: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'hidden'],
      default: 'available'
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

vehicleSchema.index(
  { status: 1, make: 1, model: 1, year: -1, price: 1 },
  { name: 'vehicle_inventory_index' }
)

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = Vehicle