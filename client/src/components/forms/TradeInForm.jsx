// client/src/components/forms/TradeInForm.jsx
import { useState } from 'react'
import api from '../../services/api'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'

const conditionOptions = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Needs work', value: 'needs-work' }
]

export function TradeInForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const [form, setForm] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    vin: '',
    condition: '',
    notes: '',
    name: '',
    phone: '',
    email: ''
  })

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setLoading(true)
    try {
      await api.post('/trade-in', {
        ...form,
        year: Number(form.year),
        mileage: form.mileage ? Number(form.mileage) : undefined
      })
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
          Trade‑in request received
        </h2>
        <p className="text-body-muted">
          Thanks for telling us about your trade‑in. We&apos;ll review its
          details and current U.S. market values, then contact you with an
          estimated offer range.
        </p>
      </div>
    )
  }

  return (
    <form className="card-surface space-y-6 p-5" onSubmit={handleSubmit}>
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <section className="space-y-3">
        <h2 className="text-section-title text-base">
          Vehicle you&apos;re trading in
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="ti-year"
            label="Year"
            type="number"
            value={form.year}
            onChange={(e) => updateField('year', e.target.value)}
          />
          <Input
            id="ti-make"
            label="Make"
            value={form.make}
            onChange={(e) => updateField('make', e.target.value)}
          />
          <Input
            id="ti-model"
            label="Model"
            value={form.model}
            onChange={(e) => updateField('model', e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="ti-mileage"
            label="Mileage"
            type="number"
            min="0"
            value={form.mileage}
            onChange={(e) => updateField('mileage', e.target.value)}
          />
          <Input
            id="ti-vin"
            label="VIN"
            value={form.vin}
            onChange={(e) => updateField('vin', e.target.value)}
          />
          <Select
            id="ti-condition"
            label="Overall condition"
            options={conditionOptions}
            value={form.condition}
            onChange={(e) => updateField('condition', e.target.value)}
          />
        </div>
        <Input
          id="ti-notes"
          label="Anything else we should know?"
          placeholder="Trim level, accident history, modifications, etc."
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title text-base">Contact information</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="ti-name"
            label="Full name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <Input
            id="ti-phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          <Input
            id="ti-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" size="md" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit trade‑in details'}
        </Button>
      </div>
    </form>
  )
}
