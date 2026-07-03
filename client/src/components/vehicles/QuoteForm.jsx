// client/src/components/vehicles/QuoteForm.jsx
import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export function QuoteForm({ vehicle }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [hasTradeIn, setHasTradeIn] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would POST to your backend contact endpoint.
    // For now we just alert (you can replace with actual API call)
    alert(`Quote request sent for ${vehicle?.title || 'vehicle'}`)
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface space-y-4 p-5">
      <h3 className="text-section-title text-base">Request a Quote</h3>

      <Input
        label="First Name *"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <Input
        label="Last Name *"
        required
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Input
        label="Email *"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className="flex items-center gap-2 text-xs text-brand-muted">
        <input
          type="checkbox"
          checked={hasTradeIn}
          onChange={(e) => setHasTradeIn(e.target.checked)}
        />
        Do you have a trade‑in?
      </label>

      <Button type="submit" variant="primary" size="md" className="w-full">
        Send Quote Request
      </Button>

      <div className="flex flex-col gap-2 pt-2">
        <a
          href="/trade-in"
          className="text-xs text-brand-primary hover:underline"
        >
          Free Trade‑In Quote
        </a>
        <a
          href="/financing"
          className="text-xs text-brand-primary hover:underline"
        >
          Apply for Financing
        </a>
      </div>
    </form>
  )
}
