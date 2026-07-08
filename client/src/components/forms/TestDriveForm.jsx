

// client/src/components/forms/TestDriveForm.jsx
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchVehicles, fetchVehicleById } from '../../services/vehicleService'
import api from '../../services/api'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { ConsentAgreement } from './ConsentAgreement'

const timeOptions = [
  '10:00 AM',
  '11:30 AM',
  '1:00 PM',
  '2:30 PM',
  '4:00 PM'
].map((t) => ({ label: t, value: t }))

export function TestDriveForm() {
  const [searchParams] = useSearchParams()
  const vehicleIdFromQuery = searchParams.get('vehicle')

  const [vehicles, setVehicles] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const [consentAccepted, setConsentAccepted] = useState(false)

  const emptyForm = {
    vehicleId: vehicleIdFromQuery || '',
    vehicleTitle: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  }

  const [form, setForm] = useState(emptyForm)

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
          setForm((prev) => ({
            ...prev,

            vehicleId: v._id,

            vehicleTitle: `${v.year} ${v.make} ${v.model}`
          }))
        }
      })

      .catch(() => {})
  }, [vehicleIdFromQuery])

  const updateField = (field, value) =>
    setForm((prev) => ({
      ...prev,

      [field]: value
    }))

  const handleVehicleChange = (vehicleId) => {
    const v = vehicles.find((x) => x._id === vehicleId)

    setForm((prev) => ({
      ...prev,

      vehicleId,

      vehicleTitle: v ? `${v.year} ${v.make} ${v.model}` : ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setServerError('')

    if (!consentAccepted) {
      setServerError(
        'You must accept the authorization agreement before submitting.'
      )

      return
    }

    setLoading(true)

    try {
      const payload = {
        name: form.name,

        phone: form.phone,

        email: form.email,

        vehicleId: form.vehicleId || undefined,

        vehicleTitle: form.vehicleTitle || undefined,

        preferredDate: form.date || undefined,

        preferredTimeSlot: form.time || undefined,

        consent: {
          accepted: true
        }
      }

      await api.post('/test-drive', payload)

      setSubmitted(true)

      setForm(emptyForm)

      setConsentAccepted(false)
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          'Unable to submit your request. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="card-surface p-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
          ✓
        </div>

        <h2 className="text-section-title text-xl">
          Test Drive Request Submitted Successfully
        </h2>

        <p className="text-body-muted max-w-xl mx-auto">
          Thank you for scheduling your test drive. Your request has been
          received successfully. Our team will contact you shortly to confirm
          your appointment.
        </p>
      </div>
    )
  }

  return (
    <form className="card-surface space-y-6 p-5" onSubmit={handleSubmit}>
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <section className="space-y-3">
        <h2 className="text-section-title text-base">
          Vehicle & preferred time
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            id="td-vehicleId"
            label="Vehicle"
            options={[
              { label: 'Select a vehicle…', value: '' },

              ...vehicles.map((v) => ({
                label: `${v.year} ${v.make} ${v.model}`,

                value: v._id
              }))
            ]}
            value={form.vehicleId}
            onChange={(e) => handleVehicleChange(e.target.value)}
          />

          <Input
            id="td-date"
            label="Preferred date"
            type="date"
            value={form.date}
            onChange={(e) => updateField('date', e.target.value)}
          />

          <Select
            id="td-time"
            label="Preferred time"
            options={timeOptions}
            value={form.time}
            onChange={(e) => updateField('time', e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title text-base">Contact details</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="td-name"
            label="Full name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />

          <Input
            id="td-phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />

          <Input
            id="td-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>
      </section>

      {/* Authorization */}

      <section className="space-y-3">
        <h2 className="text-section-title text-base">Authorization</h2>

        <ConsentAgreement
          checked={consentAccepted}
          onChange={setConsentAccepted}
        />
      </section>

      <div className="flex justify-end">
        <Button type="submit" size="md" disabled={loading || !consentAccepted}>
          {loading ? 'Submitting…' : 'Send request'}
        </Button>
      </div>
    </form>
  )
}
