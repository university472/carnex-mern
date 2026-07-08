// server/src/models/Vehicle.js
const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema(
  {
    // ---------- Basic Information ----------
    title: {
      type: String,
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
      sparse: true,
      minlength: 17,
      maxlength: 17
    },
    make: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      min: 1990,
      max: new Date().getFullYear() + 1
    },
    price: {
      type: Number,
      min: 0
    },
    mileage: {
      type: Number,
      min: 0
    },
    condition: {
      type: String,
      enum: ['new', 'used', 'certified'],
      default: 'used'
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
    exteriorColor: {
      type: String,
      trim: true
    },
    interiorColor: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },

    // ---------- Specs (nested) ----------
    specs: {
      engine: {
        size: { type: String, trim: true },
        type: { type: String, trim: true },
        horsepower: { type: Number },
        horsepowerRpm: { type: Number },
        torque: { type: Number },
        torqueRpm: { type: Number },
        cylinders: { type: Number },
        valves: { type: Number },
        compressionRatio: { type: String, trim: true },
        fuelSystem: { type: String, trim: true }
      },
      transmission: {
  type: { type: String, trim: true },

  gears: {
    type: String,
    trim: true
  },

  description: { 
    type: String, 
    trim: true 
  }
},
      fuelEconomy: {
        cityMpg: { type: Number },
        highwayMpg: { type: Number },
        combinedMpg: { type: Number }
      },
      dimensions: {
        length: { type: String, trim: true },
        width: { type: String, trim: true },
        height: { type: String, trim: true },
        wheelbase: { type: String, trim: true },
        groundClearance: { type: String, trim: true },
        cargoCapacity: { type: String, trim: true },
        fuelTankCapacity: { type: String, trim: true }
      },
      weight: {
        curbWeight: { type: String, trim: true },
        gvwr: { type: String, trim: true },
        payload: { type: String, trim: true },
        towingCapacity: { type: String, trim: true }
      },
      performance: {
        zeroToSixty: { type: String, trim: true },
        topSpeed: { type: String, trim: true }
      },
      doors: { type: Number },
      seating: { type: Number },
      trim: { type: String, trim: true }
    },

    // ---------- Features (categorised) ----------
    features: {
      comfort: [{ type: String, trim: true }],
      convenience: [{ type: String, trim: true }],
      entertainment: [{ type: String, trim: true }],
      interior: [{ type: String, trim: true }],
      exterior: [{ type: String, trim: true }],
      technology: [{ type: String, trim: true }],
      safety: [{ type: String, trim: true }],
      driverAssistance: [{ type: String, trim: true }]
    },

    // ---------- Description & Notes ----------
    description: {
      type: String,
      trim: true,
      maxlength: 5000
    },
    dealerNotes: {
      type: String,
      trim: true,
      maxlength: 5000
    },
    warranty: {
      type: String,
      trim: true
    },

    // ---------- Media ----------
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
    media: {
      videoUrl: { type: String, trim: true },
      view360Url: { type: String, trim: true },
      carfaxUrl: { type: String, trim: true }
    },

    // ---------- Pricing & Badges ----------
    badges: {
      salePrice: { type: Number },
      discountPrice: { type: Number }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },

    // ---------- Status & Visibility ----------
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'hidden'],
      default: 'available'
    },
    viewCount: {
      type: Number,
      default: 0
    },

    // ---------- Sale History ----------
    soldAt: {
      type: Date
    },

    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    soldPrice: {
      type: Number,
      min: 0
    },

    buyer: {
      name: {
        type: String,
        trim: true
      },

      phone: {
        type: String,
        trim: true
      },

      email: {
        type: String,
        lowercase: true,
        trim: true
      }
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
