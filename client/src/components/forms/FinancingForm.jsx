// client/src/components/forms/FinancingForm.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConsentAgreement } from './ConsentAgreement'
import { fetchVehicles, fetchVehicleById } from '../../services/vehicleService'
import api from '../../services/api'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Alert } from '../ui/Alert'

const stateOptions = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY'
].map((s) => ({ label: s, value: s }))

const phoneTypeOptions = [
  { label: 'Home', value: 'home' },
  { label: 'Work', value: 'work' },
  { label: 'Cell', value: 'cell' }
]

const residenceTypeOptions = [
  { label: 'Rent', value: 'rent' },
  { label: 'Own', value: 'own' }
]

const employmentStatusOptions = [
  { label: 'Full Time', value: 'full-time' },
  { label: 'Part Time', value: 'part-time' },
  { label: 'Self-Employed', value: 'self-employed' },
  { label: 'Contract', value: 'contract' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Temporary', value: 'temporary' },
  { label: 'Military', value: 'military' },
  { label: 'Retired', value: 'retired' }
]

const incomeIntervalOptions = [
  { label: 'Annually', value: 'annually' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Semi-Monthly', value: 'semi-monthly' },
  { label: 'Bi-Weekly', value: 'bi-weekly' },
  { label: 'Weekly', value: 'weekly' }
]

const termOptions = [
  { label: '24 Months', value: '24' },
  { label: '36 Months', value: '36' },
  { label: '48 Months', value: '48' },
  { label: '60 Months', value: '60' },
  { label: '72 Months', value: '72' }
]

const emptyForm = {
  vehicleId: '',

  // Vehicle
  vehiclePrice: '',
  vehicleMileage: '',
  vehicleVin: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',

  // Trade In
  tradeVin: '',
  tradeYear: '',
  tradeMake: '',
  tradeModel: '',
  tradeMileage: '',
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  phoneType: '',
  email: '',
  ssn: '',
  birthdate: '',

  driversLicenseNumber: '',
  driversLicenseState: 'CA',
  driversLicenseIssueDate: '',
  driversLicenseExpiryDate: '',
  driversLicenseCounty: '',
  residenceType: '',
  monthlyHousing: '',
  yearsAtResidence: '',
  monthsAtResidence: '',

  streetAddress: '',
  address2: '',

  city: '',
  state: 'CA',
  zip: '',

  // Previous Address

  previousResidenceType: '',
  previousMonthlyHousing: '',
  previousYears: '',
  previousMonths: '',

  previousStreet: '',
  previousAddress2: '',

  previousCity: '',
  previousState: 'CA',
  previousZip: '',
  employmentStatus: '',

  employer: '',
  jobTitle: '',
  employerPhone: '',

  income: '',
  incomeInterval: '',

  yearsAtJob: '',
  monthsAtJob: '',

  otherIncome: '',
  desiredAmount: '',
  desiredTerm: '60',
  desiredMonthly: '',
  downPayment: '',
  // Co Buyer

  coFirstName: '',
  coMiddleName: '',
  coLastName: '',

  coPhone: '',
  coPhoneType: '',

  coEmail: '',

  coSSN: '',
  coBirthdate: '',

  coRelationship: '',

  acceptTerms: false
}

export function FinancingForm() {
  const [searchParams] = useSearchParams()
  const vehicleIdFromQuery = searchParams.get('vehicle')

  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState({})
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [form, setForm] = useState({
    ...emptyForm,
    vehicleId: vehicleIdFromQuery || ''
  })

  useEffect(() => {
    fetchVehicles({ limit: 50 })
      .then(({ vehicles: v }) => setVehicles(v))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!vehicleIdFromQuery) return
    fetchVehicleById(vehicleIdFromQuery)
      .then((v) => {
        if (v) {
          setSelectedVehicle(v)
          setForm((prev) => ({
            ...prev,

            vehicleId: v._id,

            vehiclePrice: v.price?.toString() || '',

            vehicleMileage: v.mileage?.toString() || '',

            vehicleVin: v.vin || '',

            vehicleYear: v.year || '',

            vehicleMake: v.make || '',

            vehicleModel: v.model || ''
          }))
        }
      })
      .catch(() => {})
  }, [vehicleIdFromQuery])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === 'vehicleId') {
      const v = vehicles.find((x) => x._id === value)
      if (v) {
        setSelectedVehicle(v)
        setForm((prev) => ({
          ...prev,

          vehicleId: value,

          vehiclePrice: v.price?.toString() || '',

          vehicleMileage: v.mileage?.toString() || '',

          vehicleVin: v.vin || '',

          vehicleYear: v.year || '',

          vehicleMake: v.make || '',

          vehicleModel: v.model || ''
        }))
      }
    }
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required.'
    if (!form.lastName.trim()) e.lastName = 'Last name is required.'
    if (!form.phone.trim()) e.phone = 'Phone is required.'
    if (!form.phoneType) e.phoneType = 'Select a phone type.'
    if (!form.email.trim()) e.email = 'Email is required.'
    if (!form.city.trim()) e.city = 'City is required.'
    if (!form.state) e.state = 'State is required.'
    if (!form.zip.trim()) e.zip = 'ZIP is required.'
    if (!form.employmentStatus) e.employmentStatus = 'Select employment status.'
    if (!form.income.trim()) e.income = 'Income is required.'
    if (!form.incomeInterval) e.incomeInterval = 'Select income interval.'
    if (!form.desiredAmount.trim())
      e.desiredAmount = 'Desired loan amount is required.'
    if (!form.desiredTerm) e.desiredTerm = 'Select term length.'
    if (!consentAccepted) {
      e.consent = 'You must accept the authorization agreement.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const payload = {
        firstName: form.firstName,
        middleName: form.middleName || undefined,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        phoneType: form.phoneType,

        ssn: form.ssn,

        birthdate: form.birthdate,

        driversLicense: {
          number: form.driversLicenseNumber,

          state: form.driversLicenseState,

          issueDate: form.driversLicenseIssueDate,

          expiryDate: form.driversLicenseExpiryDate,

          county: form.driversLicenseCounty
        },
        address: {
          residenceType: form.residenceType,
          monthlyPayment: Number(form.monthlyHousing),
          years: Number(form.yearsAtResidence),
          months: Number(form.monthsAtResidence),

          street: form.streetAddress,
          address2: form.address2,

          city: form.city,
          state: form.state,
          zip: form.zip
        },

        previousAddress: {
          residenceType: form.previousResidenceType,

          monthlyPayment: Number(form.previousMonthlyHousing),

          years: Number(form.previousYears),

          months: Number(form.previousMonths),

          street: form.previousStreet,

          address2: form.previousAddress2,

          city: form.previousCity,

          state: form.previousState,

          zip: form.previousZip
        },

        employment: {
          status: form.employmentStatus,

          employer: form.employer,

          jobTitle: form.jobTitle,

          employerPhone: form.employerPhone,

          income: Number(form.income),

          incomeInterval: form.incomeInterval,

          years: Number(form.yearsAtJob),

          months: Number(form.monthsAtJob),

          otherIncome: Number(form.otherIncome)
        },
        vehicleId: form.vehicleId || undefined,
        vehiclePrice: form.vehiclePrice ? Number(form.vehiclePrice) : undefined,
        vehicleMileage: Number(form.vehicleMileage),

        vehicle: {
          vin: form.vehicleVin,

          year: Number(form.vehicleYear),

          make: form.vehicleMake,

          model: form.vehicleModel
        },

        tradeIn: {
          vin: form.tradeVin,

          year: Number(form.tradeYear),

          make: form.tradeMake,

          model: form.tradeModel,

          mileage: Number(form.tradeMileage)
        },
        desiredAmount: form.desiredAmount
          ? Number(form.desiredAmount)
          : undefined,
        downPayment: form.downPayment ? Number(form.downPayment) : undefined,
        termMonths: form.desiredTerm ? Number(form.desiredTerm) : undefined,
        preferredMonthlyPayment: form.desiredMonthly
          ? Number(form.desiredMonthly)
          : undefined,
        coBuyer: {
          firstName: form.coFirstName,

          middleName: form.coMiddleName,

          lastName: form.coLastName,

          phone: form.coPhone,

          phoneType: form.coPhoneType,

          email: form.coEmail,

          ssn: form.coSSN,

          birthdate: form.coBirthdate,

          relationship: form.coRelationship
        },

        consent: {
          accepted: true
        }
      }
      await api.post('/finance', payload)

      setSubmitted(true)
      setForm(emptyForm)
      setConsentAccepted(false)
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          'Unable to submit your application. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="card-surface p-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
          ✓
        </div>

        <h2 className="text-section-title text-xl">
          Application Submitted Successfully
        </h2>

        <p className="text-body-muted max-w-xl mx-auto">
          Thank you for submitting your financing application. Your information
          has been received successfully. Our team will review your details and
          contact you shortly.
        </p>
      </div>
    )
  }

  return (
    <form
      className="card-surface space-y-6 p-5"
      onSubmit={handleSubmit}
      noValidate
    >
      {serverError && <Alert variant="error">{serverError}</Alert>}

      {/* Vehicle Information */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-section-title text-base">Vehicle Information</h2>
          {selectedVehicle && (
            <Badge variant="accent">
              {selectedVehicle.year} {selectedVehicle.make}{' '}
              {selectedVehicle.model}
            </Badge>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="vf-vehicleId"
            label="Select a vehicle to finance"
            options={[
              { label: 'Select a vehicle…', value: '' },
              ...vehicles.map((v) => ({
                label: `${v.year} ${v.make} ${v.model}`,
                value: v._id
              }))
            ]}
            value={form.vehicleId}
            onChange={(e) => updateField('vehicleId', e.target.value)}
          />
          <Input
            id="vf-price"
            label="Vehicle price (USD)"
            type="number"
            min="0"
            value={form.vehiclePrice}
            onChange={(e) => updateField('vehiclePrice', e.target.value)}
            helperText="Confirmed at dealership."
          />
          <Input
            id="vf-mileage"
            label="Mileage"
            type="number"
            min="0"
            value={form.vehicleMileage}
            onChange={(e) => updateField('vehicleMileage', e.target.value)}
          />
          {/* STEP 10: Already present in original code */}
          <Input
            id="vf-vin"
            label="VIN"
            value={form.vehicleVin}
            onChange={(e) => updateField('vehicleVin', e.target.value)}
          />

          <Input
            id="vf-year"
            label="Year"
            type="number"
            value={form.vehicleYear}
            onChange={(e) => updateField('vehicleYear', e.target.value)}
          />

          <Input
            id="vf-make"
            label="Make"
            value={form.vehicleMake}
            onChange={(e) => updateField('vehicleMake', e.target.value)}
          />

          <Input
            id="vf-model"
            label="Model"
            value={form.vehicleModel}
            onChange={(e) => updateField('vehicleModel', e.target.value)}
          />
        </div>
      </section>

      {/* STEP 11: Trade-In section */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base">Trade-In Vehicle</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Trade VIN"
            value={form.tradeVin}
            onChange={(e) => updateField('tradeVin', e.target.value)}
          />

          <Input
            label="Trade Year"
            type="number"
            value={form.tradeYear}
            onChange={(e) => updateField('tradeYear', e.target.value)}
          />

          <Input
            label="Trade Make"
            value={form.tradeMake}
            onChange={(e) => updateField('tradeMake', e.target.value)}
          />

          <Input
            label="Trade Model"
            value={form.tradeModel}
            onChange={(e) => updateField('tradeModel', e.target.value)}
          />

          <Input
            label="Trade Mileage"
            type="number"
            value={form.tradeMileage}
            onChange={(e) => updateField('tradeMileage', e.target.value)}
          />
        </div>
      </section>

      {/* Personal & Contact */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base">
          Personal & Contact Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-firstName"
            label="First name"
            value={form.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            error={errors.firstName}
          />
          <Input
            id="vf-middleName"
            label="Middle name (optional)"
            value={form.middleName}
            onChange={(e) => updateField('middleName', e.target.value)}
          />
          <Input
            id="vf-lastName"
            label="Last name"
            value={form.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            error={errors.lastName}
          />
          <Input
            id="vf-birthdate"
            label="Date of birth"
            type="date"
            value={form.birthdate}
            onChange={(e) => updateField('birthdate', e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            error={errors.phone}
          />
          <Select
            id="vf-phoneType"
            label="Phone type"
            options={phoneTypeOptions}
            value={form.phoneType}
            onChange={(e) => updateField('phoneType', e.target.value)}
            error={errors.phoneType}
          />
          <Input
            id="vf-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* STEP 12: Replace SSN input */}
          <Input
            id="vf-ssn"
            label="Social Security Number"
            type="text"
            value={form.ssn}
            onChange={(e) => updateField('ssn', e.target.value)}
          />
          <Input
            id="vf-dl"
            label="Driver's license number"
            value={form.driversLicenseNumber}
            onChange={(e) =>
              updateField('driversLicenseNumber', e.target.value)
            }
          />
          <Select
            id="vf-dlState"
            label="Driver's license state"
            options={stateOptions}
            value={form.driversLicenseState}
            onChange={(e) => updateField('driversLicenseState', e.target.value)}
          />
          {/* STEP 13: License dates and county */}
          <Input
            label="License Issue Date"
            type="date"
            value={form.driversLicenseIssueDate}
            onChange={(e) =>
              updateField('driversLicenseIssueDate', e.target.value)
            }
          />
          <Input
            label="License Expiry Date"
            type="date"
            value={form.driversLicenseExpiryDate}
            onChange={(e) =>
              updateField('driversLicenseExpiryDate', e.target.value)
            }
          />
          <Input
            label="License County"
            value={form.driversLicenseCounty}
            onChange={(e) =>
              updateField('driversLicenseCounty', e.target.value)
            }
          />
        </div>
      </section>

      {/* Address */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base">Address & Housing</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            id="vf-residenceType"
            label="Residence type"
            options={residenceTypeOptions}
            value={form.residenceType}
            onChange={(e) => updateField('residenceType', e.target.value)}
          />
          <Input
            id="vf-monthlyHousing"
            label="Monthly rent/mortgage (USD)"
            type="number"
            min="0"
            value={form.monthlyHousing}
            onChange={(e) => updateField('monthlyHousing', e.target.value)}
          />
          <Input
            id="vf-yearsAtResidence"
            label="Years at residence"
            type="number"
            min="0"
            value={form.yearsAtResidence}
            onChange={(e) => updateField('yearsAtResidence', e.target.value)}
          />
          {/* STEP 14: Add missing address fields */}
          <Input
            label="Months at residence"
            type="number"
            value={form.monthsAtResidence}
            onChange={(e) => updateField('monthsAtResidence', e.target.value)}
          />
          <Input
            label="Street Address"
            value={form.streetAddress}
            onChange={(e) => updateField('streetAddress', e.target.value)}
          />
          <Input
            label="Address 2"
            value={form.address2}
            onChange={(e) => updateField('address2', e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-city"
            label="City"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            error={errors.city}
          />
          <Select
            id="vf-state"
            label="State"
            options={stateOptions}
            value={form.state}
            onChange={(e) => updateField('state', e.target.value)}
            error={errors.state}
          />
          <Input
            id="vf-zip"
            label="ZIP"
            value={form.zip}
            onChange={(e) => updateField('zip', e.target.value)}
            error={errors.zip}
          />
        </div>
      </section>

      {/* STEP 15: Previous Address section */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base">Previous Address</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Residence Type"
            options={residenceTypeOptions}
            value={form.previousResidenceType}
            onChange={(e) =>
              updateField('previousResidenceType', e.target.value)
            }
          />

          <Input
            label="Monthly Rent"
            type="number"
            value={form.previousMonthlyHousing}
            onChange={(e) =>
              updateField('previousMonthlyHousing', e.target.value)
            }
          />

          <Input
            label="Years"
            type="number"
            value={form.previousYears}
            onChange={(e) => updateField('previousYears', e.target.value)}
          />

          <Input
            label="Months"
            type="number"
            value={form.previousMonths}
            onChange={(e) => updateField('previousMonths', e.target.value)}
          />
          <Input
            label="Previous Street"
            value={form.previousStreet}
            onChange={(e) => updateField('previousStreet', e.target.value)}
          />
          <Input
            label="Previous City"
            value={form.previousCity}
            onChange={(e) => updateField('previousCity', e.target.value)}
          />
          <Select
            label="Previous State"
            options={stateOptions}
            value={form.previousState}
            onChange={(e) => updateField('previousState', e.target.value)}
          />
          <Input
            label="Previous ZIP"
            value={form.previousZip}
            onChange={(e) => updateField('previousZip', e.target.value)}
          />
        </div>
      </section>

      {/* Employment */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base">Employment & Income</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            id="vf-empStatus"
            label="Employment status"
            options={employmentStatusOptions}
            value={form.employmentStatus}
            onChange={(e) => updateField('employmentStatus', e.target.value)}
            error={errors.employmentStatus}
          />
          <Input
            id="vf-employer"
            label="Employer"
            value={form.employer}
            onChange={(e) => updateField('employer', e.target.value)}
          />
          <Input
            id="vf-jobTitle"
            label="Job title"
            value={form.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-income"
            label="Primary income (USD)"
            type="number"
            min="0"
            value={form.income}
            onChange={(e) => updateField('income', e.target.value)}
            error={errors.income}
          />
          <Select
            id="vf-incomeInterval"
            label="Income interval"
            options={incomeIntervalOptions}
            value={form.incomeInterval}
            onChange={(e) => updateField('incomeInterval', e.target.value)}
            error={errors.incomeInterval}
          />
          <Input
            id="vf-yearsAtJob"
            label="Years at job"
            type="number"
            min="0"
            value={form.yearsAtJob}
            onChange={(e) => updateField('yearsAtJob', e.target.value)}
          />
          {/* STEP 16: Add employment missing fields */}
          <Input
            label="Months at job"
            type="number"
            value={form.monthsAtJob}
            onChange={(e) => updateField('monthsAtJob', e.target.value)}
          />
          <Input
            label="Employer Phone"
            value={form.employerPhone}
            onChange={(e) => updateField('employerPhone', e.target.value)}
          />
          <Input
            label="Other Monthly Income"
            type="number"
            value={form.otherIncome}
            onChange={(e) => updateField('otherIncome', e.target.value)}
          />
        </div>
      </section>

      {/* STEP 17: Co Buyer section */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base">Co Buyer Information</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="First Name"
            value={form.coFirstName}
            onChange={(e) => updateField('coFirstName', e.target.value)}
          />
          <Input
            label="Last Name"
            value={form.coLastName}
            onChange={(e) => updateField('coLastName', e.target.value)}
          />
          <Input
            label="Phone"
            value={form.coPhone}
            onChange={(e) => updateField('coPhone', e.target.value)}
          />
          <Input
            label="Middle Name"
            value={form.coMiddleName}
            onChange={(e) => updateField('coMiddleName', e.target.value)}
          />

          <Select
            label="Phone Type"
            options={phoneTypeOptions}
            value={form.coPhoneType}
            onChange={(e) => updateField('coPhoneType', e.target.value)}
          />

          <Input
            label="SSN"
            value={form.coSSN}
            onChange={(e) => updateField('coSSN', e.target.value)}
          />

          <Input
            label="Date of Birth"
            type="date"
            value={form.coBirthdate}
            onChange={(e) => updateField('coBirthdate', e.target.value)}
          />
          <Input
            label="Email"
            value={form.coEmail}
            onChange={(e) => updateField('coEmail', e.target.value)}
          />
          <Input
            label="Relationship"
            value={form.coRelationship}
            onChange={(e) => updateField('coRelationship', e.target.value)}
          />
        </div>
      </section>

      {/* Lending Terms */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base">Desired Lending Terms</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-desiredAmount"
            label="Desired amount (USD)"
            type="number"
            min="0"
            value={form.desiredAmount}
            onChange={(e) => updateField('desiredAmount', e.target.value)}
            error={errors.desiredAmount}
          />
          <Select
            id="vf-desiredTerm"
            label="Term length"
            options={termOptions}
            value={form.desiredTerm}
            onChange={(e) => updateField('desiredTerm', e.target.value)}
            error={errors.desiredTerm}
          />
          <Input
            id="vf-desiredMonthly"
            label="Desired monthly (USD)"
            type="number"
            min="0"
            value={form.desiredMonthly}
            onChange={(e) => updateField('desiredMonthly', e.target.value)}
          />
        </div>
        <Input
          id="vf-downPayment"
          label="Down payment (USD)"
          type="number"
          min="0"
          value={form.downPayment}
          onChange={(e) => updateField('downPayment', e.target.value)}
        />

        <div className="space-y-3">
          <h2 className="text-section-title text-base">Authorization</h2>

          <ConsentAgreement
            checked={consentAccepted}
            onChange={setConsentAccepted}
          />

          {errors.consent && (
            <p className="text-[11px] text-red-600">{errors.consent}</p>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="md"
          disabled={submitting || !consentAccepted}
        >
          {submitting ? 'Submitting…' : 'Submit financing request'}
        </Button>
      </div>
    </form>
  )
}
