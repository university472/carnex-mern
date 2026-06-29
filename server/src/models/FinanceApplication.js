const mongoose = require('mongoose')

const financeApplicationSchema = new mongoose.Schema(
  {
    // Applicant
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },

    // Address (optional fields kept simple)
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },

    // Employment
    employerName: { type: String, trim: true },
    employmentStatus: { type: String, trim: true },
    monthlyIncome: { type: Number, min: 0 },

    // Vehicle of interest
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    vehicleTitle: { type: String, trim: true },
    vehicleStockNumber: { type: String, trim: true },
    vehiclePrice: { type: Number, min: 0 },

    // Loan details
    downPayment: { type: Number, min: 0 },
    termMonths: { type: Number, min: 12, max: 96 },
    preferredMonthlyPayment: { type: Number, min: 0 },

    notes: { type: String, trim: true, maxlength: 2000 },

    status: {
      type: String,
      enum: ['new', 'in-review', 'approved', 'rejected', 'archived'],
      default: 'new'
    },

    source: { type: String, trim: true, default: 'website' },

    // Basic metadata
    ip: String,
    userAgent: String
  },
  {
    timestamps: true
  }
)

financeApplicationSchema.index({ createdAt: -1, status: 1 })

const FinanceApplication = mongoose.model(
  'FinanceApplication',
  financeApplicationSchema
)

module.exports = FinanceApplication
