const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100
    },
    purchasedVehicle: {
      type: String,
      trim: true,
      maxlength: 200
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

reviewSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('Review', reviewSchema)
