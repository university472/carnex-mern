// client/src/components/forms/FinancingForm.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  vehiclePrice: '',
  vehicleMileage: '',
  firstName: '',
  lastName: '',
  phone: '',
  phoneType: '',
  email: '',
  ssnLast4: '',
  birthdate: '',
  driversLicenseNumber: '',
  driversLicenseState: 'CA',
  residenceType: '',
  monthlyHousing: '',
  yearsAtResidence: '',
  city: '',
  state: 'CA',
  zip: '',
  employmentStatus: '',
  employer: '',
  jobTitle: '',
  income: '',
  incomeInterval: '',
  yearsAtJob: '',
  desiredAmount: '',
  desiredTerm: '60',
  desiredMonthly: '',
  downPayment: '',
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
            vehicleMileage: v.mileage?.toString() || ''
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
          vehicleMileage: v.mileage?.toString() || ''
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
    if (!form.acceptTerms)
      e.acceptTerms = 'You must accept the terms to submit.'
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
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        state: form.state,
        postalCode: form.zip,
        employerName: form.employer,
        employmentStatus: form.employmentStatus,
        monthlyIncome: form.income ? Number(form.income) : undefined,
        vehicleId: form.vehicleId || undefined,
        vehiclePrice: form.vehiclePrice ? Number(form.vehiclePrice) : undefined,
        downPayment: form.downPayment ? Number(form.downPayment) : undefined,
        termMonths: form.desiredTerm ? Number(form.desiredTerm) : undefined,
        preferredMonthlyPayment: form.desiredMonthly
          ? Number(form.desiredMonthly)
          : undefined
      }
      await api.post('/finance', payload)
      setSubmitted(true)
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
      <div className="card-surface space-y-3 p-5 text-sm">
        <h2 className="text-section-title text-base">Application received</h2>
        <p className="text-body-muted">
          Thank you for submitting your financing request. Our U.S. financing
          team will review your details and contact you by phone or email with
          next steps and lender options.
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
          <Input
            id="vf-ssn"
            label="SSN last 4 digits"
            type="text"
            maxLength={4}
            value={form.ssnLast4}
            onChange={(e) => updateField('ssnLast4', e.target.value)}
            helperText="For pre‑qualification only."
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

        <div className="space-y-2 text-xs text-brand-muted">
          <p>
            Alimony, child support, or separate maintenance income need not be
            revealed if you do not wish to have it considered.
          </p>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => updateField('acceptTerms', e.target.checked)}
            />
            <span>
              I confirm the information provided is accurate and authorize
              Carnex Auto Sales and its U.S. lending partners to review my
              application.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-[11px] text-red-600">{errors.acceptTerms}</p>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" size="md" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit financing request'}
        </Button>
      </div>
    </form>
  )
}
