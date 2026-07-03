// // client/src/components/forms/SourcingForm.jsx
// import { useState } from 'react'
// import api from '../../services/api'
// import { Input } from '../ui/Input'
// import { Select } from '../ui/Select'
// import { Button } from '../ui/Button'
// import { Alert } from '../ui/Alert'

// const bodyTypeOptions = [
//   { label: 'Any', value: '' },
//   { label: 'Sedan', value: 'Sedan' },
//   { label: 'SUV', value: 'SUV' },
//   { label: 'Truck', value: 'Truck' },
//   { label: 'Coupe', value: 'Coupe' }
// ]

// export function SourcingForm() {
//   const [submitted, setSubmitted] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [serverError, setServerError] = useState('')

//   const [form, setForm] = useState({
//     yearRange: '',
//     make: '',
//     model: '',
//     bodyType: '',
//     maxBudget: '',
//     mustHaves: '',
//     timeline: '',
//     name: '',
//     phone: '',
//     email: ''
//   })

//   const updateField = (field, value) =>
//     setForm((prev) => ({ ...prev, [field]: value }))

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setServerError('')
//     setLoading(true)
//     try {
//       // Map frontend fields → backend model fields
//       const payload = {
//         name: form.name,
//         phone: form.phone,
//         email: form.email,
//         desiredMake: form.make,
//         desiredModel: form.model,
//         desiredBodyType: form.bodyType,
//         desiredBudgetMax: form.maxBudget ? Number(form.maxBudget) : undefined,
//         mustHaveFeatures: form.mustHaves,
//         // Parse year range e.g. "2020-2024" or "2020–2024"
//         desiredYearMin: form.yearRange
//           ? Number(form.yearRange.split(/[-–]/)[0]?.trim()) || undefined
//           : undefined,
//         desiredYearMax: form.yearRange
//           ? Number(form.yearRange.split(/[-–]/)[1]?.trim()) || undefined
//           : undefined
//       }
//       await api.post('/sourcing', payload)
//       setSubmitted(true)
//     } catch (err) {
//       setServerError(
//         err?.response?.data?.message ||
//           'Unable to submit your request. Please try again.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (submitted) {
//     return (
//       <div className="card-surface space-y-3 p-5 text-sm">
//         <h2 className="text-section-title text-base">
//           Sourcing request received
//         </h2>
//         <p className="text-body-muted">
//           We&apos;re ready to take the work out of car shopping. Our team will
//           review your ideal specs and begin searching U.S. auctions and partner
//           dealers to find the right fit.
//         </p>
//       </div>
//     )
//   }

//   return (
//     <form className="card-surface space-y-6 p-5" onSubmit={handleSubmit}>
//       {serverError && <Alert variant="error">{serverError}</Alert>}

//       <section className="space-y-3">
//         <h2 className="text-section-title text-base">Your ideal vehicle</h2>
//         <div className="grid gap-4 sm:grid-cols-3">
//           <Input
//             id="src-yearRange"
//             label="Year range"
//             placeholder="e.g. 2020–2024"
//             value={form.yearRange}
//             onChange={(e) => updateField('yearRange', e.target.value)}
//           />
//           <Input
//             id="src-make"
//             label="Preferred make"
//             value={form.make}
//             onChange={(e) => updateField('make', e.target.value)}
//           />
//           <Input
//             id="src-model"
//             label="Preferred model"
//             value={form.model}
//             onChange={(e) => updateField('model', e.target.value)}
//           />
//         </div>
//         <div className="grid gap-4 sm:grid-cols-3">
//           <Select
//             id="src-bodyType"
//             label="Body type"
//             options={bodyTypeOptions}
//             value={form.bodyType}
//             onChange={(e) => updateField('bodyType', e.target.value)}
//           />
//           <Input
//             id="src-maxBudget"
//             label="Max budget (USD)"
//             type="number"
//             min="0"
//             value={form.maxBudget}
//             onChange={(e) => updateField('maxBudget', e.target.value)}
//           />
//           <Input
//             id="src-timeline"
//             label="Timeline"
//             placeholder="e.g. within 30 days"
//             value={form.timeline}
//             onChange={(e) => updateField('timeline', e.target.value)}
//           />
//         </div>
//         <Input
//           id="src-mustHaves"
//           label="Must‑have features"
//           placeholder="Safety tech, AWD, seat count, towing, interior color, etc."
//           value={form.mustHaves}
//           onChange={(e) => updateField('mustHaves', e.target.value)}
//         />
//       </section>

//       <section className="space-y-3">
//         <h2 className="text-section-title text-base">Contact details</h2>
//         <div className="grid gap-4 sm:grid-cols-3">
//           <Input
//             id="src-name"
//             label="Full name"
//             value={form.name}
//             onChange={(e) => updateField('name', e.target.value)}
//           />
//           <Input
//             id="src-phone"
//             label="Phone"
//             value={form.phone}
//             onChange={(e) => updateField('phone', e.target.value)}
//           />
//           <Input
//             id="src-email"
//             label="Email"
//             type="email"
//             value={form.email}
//             onChange={(e) => updateField('email', e.target.value)}
//           />
//         </div>
//       </section>

//       <div className="flex justify-end">
//         <Button type="submit" size="md" disabled={loading}>
//           {loading ? 'Submitting…' : 'Submit sourcing request'}
//         </Button>
//       </div>
//     </form>
//   )
// }

// client/src/components/forms/SourcingForm.jsx
import { useState } from 'react'
import api from '../../services/api'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { ConsentAgreement } from './ConsentAgreement'

const bodyTypeOptions = [
  { label: 'Any', value: '' },
  { label: 'Sedan', value: 'Sedan' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Truck', value: 'Truck' },
  { label: 'Coupe', value: 'Coupe' }
]

const emptyForm = {
  yearRange: '',
  make: '',
  model: '',
  bodyType: '',
  maxBudget: '',
  mustHaves: '',
  timeline: '',
  name: '',
  phone: '',
  email: ''
}

export function SourcingForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  // Authorization state
  const [consentAccepted, setConsentAccepted] = useState(false)

  const [form, setForm] = useState(emptyForm)

  const updateField = (field, value) =>
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))

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

        desiredMake: form.make,
        desiredModel: form.model,
        desiredBodyType: form.bodyType,

        desiredBudgetMax: form.maxBudget ? Number(form.maxBudget) : undefined,

        mustHaveFeatures: form.mustHaves,

        desiredYearMin: form.yearRange
          ? Number(form.yearRange.split(/[-–]/)[0]?.trim()) || undefined
          : undefined,

        desiredYearMax: form.yearRange
          ? Number(form.yearRange.split(/[-–]/)[1]?.trim()) || undefined
          : undefined,

        // authorization payload
        consent: {
          accepted: true
        }
      }

      await api.post('/sourcing', payload)

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
          Sourcing Request Submitted Successfully
        </h2>

        <p className="text-body-muted max-w-xl mx-auto">
          Thank you for submitting your vehicle sourcing request. Our team has
          received your requirements and will contact you shortly with the best
          available options.
        </p>
      </div>
    )
  }

  return (
    <form className="card-surface space-y-6 p-5" onSubmit={handleSubmit}>
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <section className="space-y-3">
        <h2 className="text-section-title text-base">Your ideal vehicle</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="src-yearRange"
            label="Year range"
            placeholder="e.g. 2020–2024"
            value={form.yearRange}
            onChange={(e) => updateField('yearRange', e.target.value)}
          />

          <Input
            id="src-make"
            label="Preferred make"
            value={form.make}
            onChange={(e) => updateField('make', e.target.value)}
          />

          <Input
            id="src-model"
            label="Preferred model"
            value={form.model}
            onChange={(e) => updateField('model', e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            id="src-bodyType"
            label="Body type"
            options={bodyTypeOptions}
            value={form.bodyType}
            onChange={(e) => updateField('bodyType', e.target.value)}
          />

          <Input
            id="src-maxBudget"
            label="Max budget (USD)"
            type="number"
            min="0"
            value={form.maxBudget}
            onChange={(e) => updateField('maxBudget', e.target.value)}
          />

          <Input
            id="src-timeline"
            label="Timeline"
            placeholder="e.g. within 30 days"
            value={form.timeline}
            onChange={(e) => updateField('timeline', e.target.value)}
          />
        </div>

        <Input
          id="src-mustHaves"
          label="Must-have features"
          placeholder="Safety tech, AWD, seat count, towing, interior color, etc."
          value={form.mustHaves}
          onChange={(e) => updateField('mustHaves', e.target.value)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title text-base">Contact details</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="src-name"
            label="Full name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />

          <Input
            id="src-phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />

          <Input
            id="src-email"
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
          {loading ? 'Submitting…' : 'Submit sourcing request'}
        </Button>
      </div>
    </form>
  )
}
