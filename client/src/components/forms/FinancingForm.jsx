// client/src/components/forms/FinancingForm.jsx
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConsentAgreement } from './ConsentAgreement'
import { fetchVehicles, fetchVehicleById } from '../../services/vehicleService'
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
  vehicleVin: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
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

// ── Complete Field ID Mapping ──────────────────────
const FIELD_IDS = {
  vehicleId: 'vf-vehicleId',
  vehiclePrice: 'vf-price',
  vehicleMileage: 'vf-mileage',
  vehicleVin: 'vf-vin',
  vehicleYear: 'vf-year',
  vehicleMake: 'vf-make',
  vehicleModel: 'vf-model',
  tradeVin: 'vf-tradeVin',
  tradeYear: 'vf-tradeYear',
  tradeMake: 'vf-tradeMake',
  tradeModel: 'vf-tradeModel',
  tradeMileage: 'vf-tradeMileage',
  firstName: 'vf-firstName',
  middleName: 'vf-middleName',
  lastName: 'vf-lastName',
  phone: 'vf-phone',
  phoneType: 'vf-phoneType',
  email: 'vf-email',
  ssn: 'vf-ssn',
  birthdate: 'vf-birthdate',
  driversLicenseNumber: 'vf-dl',
  driversLicenseState: 'vf-dlState',
  driversLicenseIssueDate: 'vf-dlIssue',
  driversLicenseExpiryDate: 'vf-dlExpiry',
  driversLicenseCounty: 'vf-dlCounty',
  residenceType: 'vf-residenceType',
  monthlyHousing: 'vf-monthlyHousing',
  yearsAtResidence: 'vf-yearsAtResidence',
  monthsAtResidence: 'vf-monthsAtResidence',
  streetAddress: 'vf-street',
  address2: 'vf-address2',
  city: 'vf-city',
  state: 'vf-state',
  zip: 'vf-zip',
  previousResidenceType: 'vf-prevResType',
  previousMonthlyHousing: 'vf-prevRent',
  previousYears: 'vf-prevYears',
  previousMonths: 'vf-prevMonths',
  previousStreet: 'vf-prevStreet',
  previousAddress2: 'vf-prevAddress2',
  previousCity: 'vf-prevCity',
  previousState: 'vf-prevState',
  previousZip: 'vf-prevZip',
  employmentStatus: 'vf-empStatus',
  employer: 'vf-employer',
  jobTitle: 'vf-jobTitle',
  employerPhone: 'vf-empPhone',
  income: 'vf-income',
  incomeInterval: 'vf-incomeInterval',
  yearsAtJob: 'vf-yearsAtJob',
  monthsAtJob: 'vf-monthsAtJob',
  otherIncome: 'vf-otherIncome',
  desiredAmount: 'vf-desiredAmount',
  desiredTerm: 'vf-desiredTerm',
  desiredMonthly: 'vf-desiredMonthly',
  downPayment: 'vf-downPayment',
  coFirstName: 'vf-coFirstName',
  coMiddleName: 'vf-coMiddleName',
  coLastName: 'vf-coLastName',
  coPhone: 'vf-coPhone',
  coPhoneType: 'vf-coPhoneType',
  coEmail: 'vf-coEmail',
  coSSN: 'vf-coSSN',
  coBirthdate: 'vf-coBirthdate',
  coRelationship: 'vf-coRelationship',
  consent: 'consent-checkbox'
}

// Fields in TRADE-IN section (only required when hasTradeIn=true)
const TRADE_FIELDS = [
  'tradeVin',
  'tradeYear',
  'tradeMake',
  'tradeModel',
  'tradeMileage'
]

// Fields in PREVIOUS ADDRESS section (only required when hasPrevAddress=true)
const PREV_ADDRESS_FIELDS = [
  'previousResidenceType',
  'previousMonthlyHousing',
  'previousYears',
  'previousMonths',
  'previousStreet',
  'previousCity',
  'previousState',
  'previousZip'
]

// Fields in CO-BUYER section (only required when hasCoBuyer=true)
const CO_BUYER_FIELDS = [
  'coFirstName',
  'coLastName',
  'coPhone',
  'coPhoneType',
  'coEmail',
  'coSSN',
  'coBirthdate',
  'coRelationship'
]

// Fields that are ALWAYS optional (regardless of section toggles)
const OPTIONAL_FIELDS = [
  'middleName',
  'address2',
  'previousAddress2',
  'otherIncome',
  'desiredMonthly',
  'downPayment',
  'vehicleId',
  'coMiddleName'
]

export function FinancingForm({ onSubmit }) {
  const [searchParams] = useSearchParams()
  const vehicleIdFromQuery = searchParams.get('vehicle')
  const formRef = useRef(null)

  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState({})
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [hasTradeIn, setHasTradeIn] = useState(false)
  const [hasPrevAddress, setHasPrevAddress] = useState(false) // 🔥 NEW toggle
  const [hasCoBuyer, setHasCoBuyer] = useState(false) // 🔥 NEW toggle
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
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
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

  // ── Validation ──────────────────────────────────
  const validate = () => {
    const e = {}

    const isRequired = (fieldName) => {
      if (OPTIONAL_FIELDS.includes(fieldName)) return false
      if (TRADE_FIELDS.includes(fieldName) && !hasTradeIn) return false
      if (PREV_ADDRESS_FIELDS.includes(fieldName) && !hasPrevAddress)
        return false
      if (CO_BUYER_FIELDS.includes(fieldName) && !hasCoBuyer) return false
      return true
    }

    const getLabel = (fieldName) => {
      const labels = {
        vehicleId: 'Vehicle',
        vehiclePrice: 'Vehicle price',
        vehicleMileage: 'Mileage',
        vehicleVin: 'VIN',
        vehicleYear: 'Year',
        vehicleMake: 'Make',
        vehicleModel: 'Model',
        tradeVin: 'Trade VIN',
        tradeYear: 'Trade year',
        tradeMake: 'Trade make',
        tradeModel: 'Trade model',
        tradeMileage: 'Trade mileage',
        firstName: 'First name',
        middleName: 'Middle name',
        lastName: 'Last name',
        phone: 'Phone',
        phoneType: 'Phone type',
        email: 'Email',
        ssn: 'SSN',
        birthdate: 'Date of birth',
        driversLicenseNumber: "Driver's license number",
        driversLicenseState: "Driver's license state",
        driversLicenseIssueDate: 'License issue date',
        driversLicenseExpiryDate: 'License expiry date',
        driversLicenseCounty: 'License county',
        residenceType: 'Residence type',
        monthlyHousing: 'Monthly rent/mortgage',
        yearsAtResidence: 'Years at residence',
        monthsAtResidence: 'Months at residence',
        streetAddress: 'Street address',
        address2: 'Address line 2',
        city: 'City',
        state: 'State',
        zip: 'ZIP code',
        previousResidenceType: 'Previous residence type',
        previousMonthlyHousing: 'Previous monthly rent',
        previousYears: 'Previous years',
        previousMonths: 'Previous months',
        previousStreet: 'Previous street',
        previousAddress2: 'Previous address line 2',
        previousCity: 'Previous city',
        previousState: 'Previous state',
        previousZip: 'Previous ZIP',
        employmentStatus: 'Employment status',
        employer: 'Employer',
        jobTitle: 'Job title',
        employerPhone: 'Employer phone',
        income: 'Income',
        incomeInterval: 'Income interval',
        yearsAtJob: 'Years at job',
        monthsAtJob: 'Months at job',
        otherIncome: 'Other income',
        desiredAmount: 'Desired amount',
        desiredTerm: 'Term length',
        desiredMonthly: 'Desired monthly',
        downPayment: 'Down payment',
        coFirstName: 'Co-buyer first name',
        coMiddleName: 'Co-buyer middle name',
        coLastName: 'Co-buyer last name',
        coPhone: 'Co-buyer phone',
        coPhoneType: 'Co-buyer phone type',
        coEmail: 'Co-buyer email',
        coSSN: 'Co-buyer SSN',
        coBirthdate: 'Co-buyer date of birth',
        coRelationship: 'Co-buyer relationship',
        consent: 'Authorization agreement'
      }
      return labels[fieldName] || fieldName
    }

    Object.keys(form).forEach((field) => {
      if (field === 'acceptTerms' || field === 'vehicleId') return
      if (!isRequired(field)) return

      const value = form[field]
      if (value === '' || value === null || value === undefined) {
        e[field] = `⚠ Please fill this — ${getLabel(field)}`
      }
    })

    if (!consentAccepted) {
      e.consent = 'You must accept the authorization agreement to continue.'
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address.'
    }

    if (form.phone && form.phone.replace(/\D/g, '').length < 10) {
      e.phone = 'Please enter a valid 10-digit phone number.'
    }

    if (form.zip && !/^\d{5}(-\d{4})?$/.test(form.zip)) {
      e.zip = 'Please enter a valid ZIP code (e.g., 12345).'
    }

    if (
      hasPrevAddress &&
      form.previousZip &&
      !/^\d{5}(-\d{4})?$/.test(form.previousZip)
    ) {
      e.previousZip = 'Please enter a valid ZIP code.'
    }

    if (
      form.ssn &&
      !/^\d{3}-?\d{2}-?\d{4}$/.test(form.ssn.replace(/\s/g, ''))
    ) {
      e.ssn = 'Please enter a valid SSN (e.g., 123-45-6789).'
    }

    if (
      hasCoBuyer &&
      form.coSSN &&
      !/^\d{3}-?\d{2}-?\d{4}$/.test(form.coSSN.replace(/\s/g, ''))
    ) {
      e.coSSN = 'Please enter a valid SSN.'
    }

    setErrors(e)

    if (Object.keys(e).length > 0) {
      const firstErrorKey = Object.keys(e)[0]
      const targetId = FIELD_IDS[firstErrorKey]

      if (targetId) {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setTimeout(() => {
            el.focus()
            if (el.tagName === 'SELECT') {
              el.click()
            }
          }, 400)
        }
      }
    }

    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) {
      const errorCount = Object.keys(errors).length
      setServerError(
        `⚠ Please fill all required fields. ${errorCount} field${errorCount > 1 ? 's' : ''} need${errorCount === 1 ? 's' : ''} attention.`
      )
      return
    }

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
          address2: form.address2 || undefined,
          city: form.city,
          state: form.state,
          zip: form.zip
        },
        // 🔥 Only send previous address if user has one
        previousAddress: hasPrevAddress
          ? {
              residenceType: form.previousResidenceType,
              monthlyPayment: Number(form.previousMonthlyHousing),
              years: Number(form.previousYears),
              months: Number(form.previousMonths),
              street: form.previousStreet,
              address2: form.previousAddress2 || undefined,
              city: form.previousCity,
              state: form.previousState,
              zip: form.previousZip
            }
          : undefined,
        employment: {
          status: form.employmentStatus,
          employer: form.employer,
          jobTitle: form.jobTitle,
          employerPhone: form.employerPhone,
          income: Number(form.income),
          incomeInterval: form.incomeInterval,
          years: Number(form.yearsAtJob),
          months: Number(form.monthsAtJob),
          otherIncome: Number(form.otherIncome) || undefined
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
        tradeIn: hasTradeIn
          ? {
              vin: form.tradeVin,
              year: Number(form.tradeYear),
              make: form.tradeMake,
              model: form.tradeModel,
              mileage: Number(form.tradeMileage)
            }
          : undefined,
        desiredAmount: form.desiredAmount
          ? Number(form.desiredAmount)
          : undefined,
        downPayment: form.downPayment ? Number(form.downPayment) : undefined,
        termMonths: form.desiredTerm ? Number(form.desiredTerm) : undefined,
        preferredMonthlyPayment: form.desiredMonthly
          ? Number(form.desiredMonthly)
          : undefined,
        // 🔥 Only send co-buyer if user has one
        coBuyer: hasCoBuyer
          ? {
              firstName: form.coFirstName,
              middleName: form.coMiddleName || undefined,
              lastName: form.coLastName,
              phone: form.coPhone,
              phoneType: form.coPhoneType,
              email: form.coEmail,
              ssn: form.coSSN,
              birthdate: form.coBirthdate,
              relationship: form.coRelationship
            }
          : undefined,
        consent: { accepted: true }
      }

      if (onSubmit) {
        await onSubmit(payload)
      }
      setSubmitted(true)
      setForm(emptyForm)
      setConsentAccepted(false)
      setHasTradeIn(false)
      setHasPrevAddress(false)
      setHasCoBuyer(false)
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          'Unable to submit your application. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const getError = (fieldName) => errors[fieldName] || ''

  // ── Toggle Button Component ──────────────────
  const ToggleSection = ({ label, description, value, onChange, name }) => (
    <div className="space-y-2">
      <p className="text-sm text-brand-muted">{description}</p>
      <div className="flex gap-6 mt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === true}
            onChange={() => onChange(true)}
            className="h-5 w-5 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm font-medium">Yes</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === false}
            onChange={() => {
              onChange(false)
              // Clear errors for this section's fields
              setErrors((prev) => {
                const next = { ...prev }
                const fieldsToClear =
                  name === 'tradeIn'
                    ? TRADE_FIELDS
                    : name === 'prevAddress'
                      ? PREV_ADDRESS_FIELDS
                      : CO_BUYER_FIELDS
                fieldsToClear.forEach((f) => delete next[f])
                return next
              })
            }}
            className="h-5 w-5 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm font-medium">No</span>
        </label>
      </div>
    </div>
  )

  if (submitted) {
    return (
      <div className="card-surface p-8 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
          ✓
        </div>
        <h2 className="text-section-title text-xl font-bold">
          Application Submitted Successfully!
        </h2>
        <p className="text-body-muted max-w-xl mx-auto">
          Thank you for submitting your financing application. Our team will
          review your details and contact you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      className="card-surface space-y-6 p-5 sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Error summary banner */}
      {serverError && (
        <Alert variant="error">
          <span className="font-bold">{serverError}</span>
        </Alert>
      )}

      {/* ─── Vehicle Information ─────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-section-title text-base font-bold">
            Vehicle Information
          </h2>
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
            label="Vehicle price (USD) *"
            type="number"
            min="0"
            value={form.vehiclePrice}
            onChange={(e) => updateField('vehiclePrice', e.target.value)}
            readOnly={!!selectedVehicle}
            error={getError('vehiclePrice')}
            helperText={
              selectedVehicle
                ? 'Locked from inventory'
                : 'Confirmed at dealership'
            }
          />
          <Input
            id="vf-mileage"
            label="Mileage *"
            type="number"
            min="0"
            value={form.vehicleMileage}
            onChange={(e) => updateField('vehicleMileage', e.target.value)}
            readOnly={!!selectedVehicle}
            error={getError('vehicleMileage')}
          />
          <Input
            id="vf-vin"
            label="VIN *"
            value={form.vehicleVin}
            onChange={(e) => updateField('vehicleVin', e.target.value)}
            readOnly={!!selectedVehicle}
            error={getError('vehicleVin')}
          />
          <Input
            id="vf-year"
            label="Year *"
            type="number"
            value={form.vehicleYear}
            onChange={(e) => updateField('vehicleYear', e.target.value)}
            readOnly={!!selectedVehicle}
            error={getError('vehicleYear')}
          />
          <Input
            id="vf-make"
            label="Make *"
            value={form.vehicleMake}
            onChange={(e) => updateField('vehicleMake', e.target.value)}
            readOnly={!!selectedVehicle}
            error={getError('vehicleMake')}
          />
          <Input
            id="vf-model"
            label="Model *"
            value={form.vehicleModel}
            onChange={(e) => updateField('vehicleModel', e.target.value)}
            readOnly={!!selectedVehicle}
            error={getError('vehicleModel')}
          />
        </div>
      </section>

      {/* ─── TRADE-IN TOGGLE ────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base font-bold">Trade-In</h2>
        <ToggleSection
          name="tradeIn"
          description="Do you have a vehicle to trade in?"
          value={hasTradeIn}
          onChange={setHasTradeIn}
        />
      </section>

      {hasTradeIn && (
        <section className="space-y-3">
          <h2 className="text-section-title text-base font-bold">
            Trade-In Vehicle Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              id="vf-tradeVin"
              label="Trade VIN *"
              value={form.tradeVin}
              onChange={(e) => updateField('tradeVin', e.target.value)}
              error={getError('tradeVin')}
            />
            <Input
              id="vf-tradeYear"
              label="Trade Year *"
              type="number"
              value={form.tradeYear}
              onChange={(e) => updateField('tradeYear', e.target.value)}
              error={getError('tradeYear')}
            />
            <Input
              id="vf-tradeMake"
              label="Trade Make *"
              value={form.tradeMake}
              onChange={(e) => updateField('tradeMake', e.target.value)}
              error={getError('tradeMake')}
            />
            <Input
              id="vf-tradeModel"
              label="Trade Model *"
              value={form.tradeModel}
              onChange={(e) => updateField('tradeModel', e.target.value)}
              error={getError('tradeModel')}
            />
            <Input
              id="vf-tradeMileage"
              label="Trade Mileage *"
              type="number"
              value={form.tradeMileage}
              onChange={(e) => updateField('tradeMileage', e.target.value)}
              error={getError('tradeMileage')}
            />
          </div>
        </section>
      )}

      {/* ─── Personal & Contact ─────────────────── */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base font-bold">
          Personal & Contact Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-firstName"
            label="First name *"
            value={form.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            error={getError('firstName')}
          />
          <Input
            id="vf-middleName"
            label="Middle name"
            value={form.middleName}
            onChange={(e) => updateField('middleName', e.target.value)}
          />
          <Input
            id="vf-lastName"
            label="Last name *"
            value={form.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            error={getError('lastName')}
          />
          <Input
            id="vf-birthdate"
            label="Date of birth *"
            type="date"
            value={form.birthdate}
            onChange={(e) => updateField('birthdate', e.target.value)}
            error={getError('birthdate')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-phone"
            label="Phone *"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            error={getError('phone')}
          />
          <Select
            id="vf-phoneType"
            label="Phone type *"
            options={phoneTypeOptions}
            value={form.phoneType}
            onChange={(e) => updateField('phoneType', e.target.value)}
            error={getError('phoneType')}
          />
          <Input
            id="vf-email"
            label="Email *"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={getError('email')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-ssn"
            label="Social Security Number *"
            type="text"
            placeholder="123-45-6789"
            value={form.ssn}
            onChange={(e) => updateField('ssn', e.target.value)}
            error={getError('ssn')}
          />
          <Input
            id="vf-dl"
            label="Driver's license number *"
            value={form.driversLicenseNumber}
            onChange={(e) =>
              updateField('driversLicenseNumber', e.target.value)
            }
            error={getError('driversLicenseNumber')}
          />
          <Select
            id="vf-dlState"
            label="Driver's license state *"
            options={stateOptions}
            value={form.driversLicenseState}
            onChange={(e) => updateField('driversLicenseState', e.target.value)}
            error={getError('driversLicenseState')}
          />
          <Input
            id="vf-dlIssue"
            label="License Issue Date *"
            type="date"
            value={form.driversLicenseIssueDate}
            onChange={(e) =>
              updateField('driversLicenseIssueDate', e.target.value)
            }
            error={getError('driversLicenseIssueDate')}
          />
          <Input
            id="vf-dlExpiry"
            label="License Expiry Date *"
            type="date"
            value={form.driversLicenseExpiryDate}
            onChange={(e) =>
              updateField('driversLicenseExpiryDate', e.target.value)
            }
            error={getError('driversLicenseExpiryDate')}
          />
          <Input
            id="vf-dlCounty"
            label="License County *"
            value={form.driversLicenseCounty}
            onChange={(e) =>
              updateField('driversLicenseCounty', e.target.value)
            }
            error={getError('driversLicenseCounty')}
          />
        </div>
      </section>

      {/* ─── Current Address ────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base font-bold">
          Current Address & Housing
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            id="vf-residenceType"
            label="Residence type *"
            options={residenceTypeOptions}
            value={form.residenceType}
            onChange={(e) => updateField('residenceType', e.target.value)}
            error={getError('residenceType')}
          />
          <Input
            id="vf-monthlyHousing"
            label="Monthly rent/mortgage (USD) *"
            type="number"
            min="0"
            value={form.monthlyHousing}
            onChange={(e) => updateField('monthlyHousing', e.target.value)}
            error={getError('monthlyHousing')}
          />
          <Input
            id="vf-yearsAtResidence"
            label="Years at residence *"
            type="number"
            min="0"
            value={form.yearsAtResidence}
            onChange={(e) => updateField('yearsAtResidence', e.target.value)}
            error={getError('yearsAtResidence')}
          />
          <Input
            id="vf-monthsAtResidence"
            label="Months at residence *"
            type="number"
            min="0"
            value={form.monthsAtResidence}
            onChange={(e) => updateField('monthsAtResidence', e.target.value)}
            error={getError('monthsAtResidence')}
          />
          <Input
            id="vf-street"
            label="Street Address *"
            value={form.streetAddress}
            onChange={(e) => updateField('streetAddress', e.target.value)}
            error={getError('streetAddress')}
          />
          <Input
            id="vf-address2"
            label="Address Line 2"
            value={form.address2}
            onChange={(e) => updateField('address2', e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-city"
            label="City *"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            error={getError('city')}
          />
          <Select
            id="vf-state"
            label="State *"
            options={stateOptions}
            value={form.state}
            onChange={(e) => updateField('state', e.target.value)}
            error={getError('state')}
          />
          <Input
            id="vf-zip"
            label="ZIP code *"
            value={form.zip}
            onChange={(e) => updateField('zip', e.target.value)}
            error={getError('zip')}
          />
        </div>
      </section>

      {/* ─── 🔥 PREVIOUS ADDRESS TOGGLE ─────────── */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base font-bold">
          Previous Address
        </h2>
        <ToggleSection
          name="prevAddress"
          description="Have you lived at a different address in the last 2 years?"
          value={hasPrevAddress}
          onChange={setHasPrevAddress}
        />
      </section>

      {hasPrevAddress && (
        <section className="space-y-3">
          <h2 className="text-section-title text-base font-bold">
            Previous Address Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              id="vf-prevResType"
              label="Residence Type *"
              options={residenceTypeOptions}
              value={form.previousResidenceType}
              onChange={(e) =>
                updateField('previousResidenceType', e.target.value)
              }
              error={getError('previousResidenceType')}
            />
            <Input
              id="vf-prevRent"
              label="Monthly Rent/Mortgage (USD) *"
              type="number"
              min="0"
              value={form.previousMonthlyHousing}
              onChange={(e) =>
                updateField('previousMonthlyHousing', e.target.value)
              }
              error={getError('previousMonthlyHousing')}
            />
            <Input
              id="vf-prevYears"
              label="Years *"
              type="number"
              min="0"
              value={form.previousYears}
              onChange={(e) => updateField('previousYears', e.target.value)}
              error={getError('previousYears')}
            />
            <Input
              id="vf-prevMonths"
              label="Months *"
              type="number"
              min="0"
              value={form.previousMonths}
              onChange={(e) => updateField('previousMonths', e.target.value)}
              error={getError('previousMonths')}
            />
            <Input
              id="vf-prevStreet"
              label="Previous Street *"
              value={form.previousStreet}
              onChange={(e) => updateField('previousStreet', e.target.value)}
              error={getError('previousStreet')}
            />
            <Input
              id="vf-prevAddress2"
              label="Previous Address Line 2"
              value={form.previousAddress2}
              onChange={(e) => updateField('previousAddress2', e.target.value)}
            />
            <Input
              id="vf-prevCity"
              label="Previous City *"
              value={form.previousCity}
              onChange={(e) => updateField('previousCity', e.target.value)}
              error={getError('previousCity')}
            />
            <Select
              id="vf-prevState"
              label="Previous State *"
              options={stateOptions}
              value={form.previousState}
              onChange={(e) => updateField('previousState', e.target.value)}
              error={getError('previousState')}
            />
            <Input
              id="vf-prevZip"
              label="Previous ZIP *"
              value={form.previousZip}
              onChange={(e) => updateField('previousZip', e.target.value)}
              error={getError('previousZip')}
            />
          </div>
        </section>
      )}

      {/* ─── Employment & Income ────────────────── */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base font-bold">
          Employment & Income
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            id="vf-empStatus"
            label="Employment status *"
            options={employmentStatusOptions}
            value={form.employmentStatus}
            onChange={(e) => updateField('employmentStatus', e.target.value)}
            error={getError('employmentStatus')}
          />
          <Input
            id="vf-employer"
            label="Employer *"
            value={form.employer}
            onChange={(e) => updateField('employer', e.target.value)}
            error={getError('employer')}
          />
          <Input
            id="vf-jobTitle"
            label="Job title *"
            value={form.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            error={getError('jobTitle')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-income"
            label="Primary income (USD) *"
            type="number"
            min="0"
            value={form.income}
            onChange={(e) => updateField('income', e.target.value)}
            error={getError('income')}
          />
          <Select
            id="vf-incomeInterval"
            label="Income interval *"
            options={incomeIntervalOptions}
            value={form.incomeInterval}
            onChange={(e) => updateField('incomeInterval', e.target.value)}
            error={getError('incomeInterval')}
          />
          <Input
            id="vf-yearsAtJob"
            label="Years at job *"
            type="number"
            min="0"
            value={form.yearsAtJob}
            onChange={(e) => updateField('yearsAtJob', e.target.value)}
            error={getError('yearsAtJob')}
          />
          <Input
            id="vf-monthsAtJob"
            label="Months at job *"
            type="number"
            min="0"
            value={form.monthsAtJob}
            onChange={(e) => updateField('monthsAtJob', e.target.value)}
            error={getError('monthsAtJob')}
          />
          <Input
            id="vf-empPhone"
            label="Employer Phone *"
            value={form.employerPhone}
            onChange={(e) => updateField('employerPhone', e.target.value)}
            error={getError('employerPhone')}
          />
          <Input
            id="vf-otherIncome"
            label="Other Monthly Income"
            type="number"
            min="0"
            value={form.otherIncome}
            onChange={(e) => updateField('otherIncome', e.target.value)}
          />
        </div>
      </section>

      {/* ─── 🔥 CO-BUYER TOGGLE ─────────────────── */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base font-bold">
          Co-Buyer Information
        </h2>
        <ToggleSection
          name="coBuyer"
          description="Is there a co-buyer for this application?"
          value={hasCoBuyer}
          onChange={setHasCoBuyer}
        />
      </section>

      {hasCoBuyer && (
        <section className="space-y-3">
          <h2 className="text-section-title text-base font-bold">
            Co-Buyer Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              id="vf-coFirstName"
              label="First Name *"
              value={form.coFirstName}
              onChange={(e) => updateField('coFirstName', e.target.value)}
              error={getError('coFirstName')}
            />
            <Input
              id="vf-coMiddleName"
              label="Middle Name"
              value={form.coMiddleName}
              onChange={(e) => updateField('coMiddleName', e.target.value)}
            />
            <Input
              id="vf-coLastName"
              label="Last Name *"
              value={form.coLastName}
              onChange={(e) => updateField('coLastName', e.target.value)}
              error={getError('coLastName')}
            />
            <Input
              id="vf-coPhone"
              label="Phone *"
              value={form.coPhone}
              onChange={(e) => updateField('coPhone', e.target.value)}
              error={getError('coPhone')}
            />
            <Select
              id="vf-coPhoneType"
              label="Phone Type *"
              options={phoneTypeOptions}
              value={form.coPhoneType}
              onChange={(e) => updateField('coPhoneType', e.target.value)}
              error={getError('coPhoneType')}
            />
            <Input
              id="vf-coSSN"
              label="SSN *"
              placeholder="123-45-6789"
              value={form.coSSN}
              onChange={(e) => updateField('coSSN', e.target.value)}
              error={getError('coSSN')}
            />
            <Input
              id="vf-coBirthdate"
              label="Date of Birth *"
              type="date"
              value={form.coBirthdate}
              onChange={(e) => updateField('coBirthdate', e.target.value)}
              error={getError('coBirthdate')}
            />
            <Input
              id="vf-coEmail"
              label="Email *"
              type="email"
              value={form.coEmail}
              onChange={(e) => updateField('coEmail', e.target.value)}
              error={getError('coEmail')}
            />
            <Input
              id="vf-coRelationship"
              label="Relationship *"
              value={form.coRelationship}
              onChange={(e) => updateField('coRelationship', e.target.value)}
              error={getError('coRelationship')}
            />
          </div>
        </section>
      )}

      {/* ─── Desired Lending Terms ──────────────── */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base font-bold">
          Desired Lending Terms
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="vf-desiredAmount"
            label="Desired amount (USD) *"
            type="number"
            min="0"
            value={form.desiredAmount}
            onChange={(e) => updateField('desiredAmount', e.target.value)}
            error={getError('desiredAmount')}
          />
          <Select
            id="vf-desiredTerm"
            label="Term length *"
            options={termOptions}
            value={form.desiredTerm}
            onChange={(e) => updateField('desiredTerm', e.target.value)}
            error={getError('desiredTerm')}
          />
          <Input
            id="vf-desiredMonthly"
            label="Desired monthly payment (USD)"
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
      </section>

      {/* ─── Authorization ──────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-section-title text-base font-bold">
          Authorization
        </h2>
        <ConsentAgreement
          id="consent-checkbox"
          checked={consentAccepted}
          onChange={setConsentAccepted}
        />
        {errors.consent && (
          <p className="text-xs text-red-600 font-medium mt-1">
            ⚠ {errors.consent}
          </p>
        )}
      </section>

      {/* ─── Submit Button ──────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2 border-t border-slate-100">
        <p className="text-[11px] text-slate-500 self-center">
          * All fields marked with asterisk are required
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Submitting…
            </span>
          ) : (
            'Submit Financing Application'
          )}
        </Button>
      </div>
    </form>
  )
}
