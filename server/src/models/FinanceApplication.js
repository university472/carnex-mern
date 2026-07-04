// const mongoose = require('mongoose')

// const financeApplicationSchema = new mongoose.Schema(
//   {
//     // Applicant
//     firstName: { type: String, required: true, trim: true, maxlength: 80 },
//     lastName: { type: String, required: true, trim: true, maxlength: 80 },
//     email: { type: String, required: true, trim: true, lowercase: true },
//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 7,
//       maxlength: 20
//     },

//     // Address (optional fields kept simple)
//     city: { type: String, trim: true },
//     state: { type: String, trim: true },
//     postalCode: { type: String, trim: true },

//     // Employment
//     employerName: { type: String, trim: true },
//     employmentStatus: { type: String, trim: true },
//     monthlyIncome: { type: Number, min: 0 },

//     // Vehicle of interest
//     vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
//     vehicleTitle: { type: String, trim: true },
//     vehicleStockNumber: { type: String, trim: true },
//     vehiclePrice: { type: Number, min: 0 },

//     // Loan details
//     downPayment: { type: Number, min: 0 },
//     termMonths: { type: Number, min: 12, max: 96 },
//     preferredMonthlyPayment: { type: Number, min: 0 },

//     notes: { type: String, trim: true, maxlength: 2000 },

//     status: {
//       type: String,
//       enum: ['new', 'in-review', 'approved', 'rejected', 'archived'],
//       default: 'new'
//     },

//     source: { type: String, trim: true, default: 'website' },

//     // Basic metadata
//     ipHash: String,
//     userAgent: String
//   },
//   {
//     timestamps: true
//   }
// )

// financeApplicationSchema.index({ createdAt: -1, status: 1 })

// const FinanceApplication = mongoose.model(
//   'FinanceApplication',
//   financeApplicationSchema
// )

// module.exports = FinanceApplication

const mongoose = require('mongoose')

const financeApplicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    middleName: {
      type: String,
      trim: true,
      maxlength: 80
    },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20
    },
    phoneType: {
      type: String,
      trim: true
    },

    ssn: {
      type: String,
      trim: true
    },

    birthdate: {
      type: Date
    },

    driversLicense: {
      number: String,
      state: String,
      issueDate: Date,
      expiryDate: Date,
      county: String
    },
    address: {
      residenceType: String,
      monthlyPayment: Number,
      years: Number,
      months: Number,

      street: String,
      address2: String,

      city: String,
      state: String,
      zip: String
    },

    previousAddress: {
      residenceType: String,
      monthlyPayment: Number,
      years: Number,
      months: Number,

      street: String,
      address2: String,

      city: String,
      state: String,
      zip: String
    },
    employment: {
      status: String,

      employer: String,

      jobTitle: String,

      employerPhone: String,

      income: Number,

      incomeInterval: String,

      years: Number,

      months: Number,

      otherIncome: Number
    },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    vehicleTitle: { type: String, trim: true },
    vehicleStockNumber: { type: String, trim: true },
    // Vehicle Information
    vehiclePrice: { type: Number, min: 0 },
    vehicleMileage: { type: Number, min: 0 },

    vehicle: {
      vin: { type: String, trim: true },
      year: Number,
      make: { type: String, trim: true },
      model: { type: String, trim: true }
    },

    // Trade In Vehicle
    tradeIn: {
      vin: { type: String, trim: true },
      year: Number,
      make: { type: String, trim: true },
      model: { type: String, trim: true },
      mileage: Number
    },

    // Loan Details
    desiredAmount: {
      type: Number,
      min: 0
    },

    downPayment: { type: Number, min: 0 },

    termMonths: {
      type: Number,
      min: 12,
      max: 96
    },

    preferredMonthlyPayment: {
      type: Number,
      min: 0
    },
    coBuyer: {
      firstName: String,
      middleName: String,
      lastName: String,

      phone: String,
      phoneType: String,

      email: String,

      ssn: String,

      birthdate: Date,

      relationship: String
    },
    notes: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['new', 'in-review', 'approved', 'rejected', 'archived'],
      default: 'new'
    },
    source: { type: String, trim: true, default: 'website' },
    ipHash: String,
    userAgent: String,
    consent: {
      accepted: { type: Boolean, required: true, default: false },
      acceptedAt: { type: Date },
      textVersion: { type: String, default: 'v1.0' }
    }
  },
  { timestamps: true }
)

financeApplicationSchema.index({ createdAt: -1, status: 1 })

const FinanceApplication = mongoose.model(
  'FinanceApplication',
  financeApplicationSchema
)

module.exports = FinanceApplication
