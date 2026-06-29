// client/src/components/forms/TestDriveForm.jsx
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchVehicles, fetchVehicleById } from '../../services/vehicleService'
import api from '../../services/api'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'

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

  const [form, setForm] = useState({
    vehicleId: vehicleIdFromQuery || '',
    vehicleTitle: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    consent: false
  })

  // Load vehicle dropdown
  useEffect(() => {
    fetchVehicles({ limit: 50 })
      .then(({ vehicles: v }) => setVehicles(v))
      .catch(() => {})
  }, [])

  // Pre-populate vehicle title from query param
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
    setForm((prev) => ({ ...prev, [field]: value }))

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
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        vehicleId: form.vehicleId || undefined,
        vehicleTitle: form.vehicleTitle || undefined,
        preferredDate: form.date || undefined,
        preferredTimeSlot: form.time || undefined
      }
      await api.post('/test-drive', payload)
      setSubmitted(true)
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
      <div className="card-surface space-y-3 p-5 text-sm">
        <h2 className="text-section-title text-base">
          Test drive request received
        </h2>
        <p className="text-body-muted">
          Thank you for scheduling a test drive. Our team will confirm your
          appointment time and have the vehicle ready when you arrive.
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

      <section className="space-y-2 text-xs text-brand-muted">
        <label className="inline-flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => updateField('consent', e.target.checked)}
            className="mt-0.5"
          />
          <span>
            By clicking &quot;Send Request&quot;, I consent to be contacted by
            CARNEX AUTO SALES LLC at any email address or telephone number I
            provide, including communications sent via text message or using an
            autodialer.
          </span>
        </label>
      </section>

      <div className="flex justify-end">
        <Button type="submit" size="md" disabled={loading}>
          {loading ? 'Submitting…' : 'Send request'}
        </Button>
      </div>
    </form>
  )
}
