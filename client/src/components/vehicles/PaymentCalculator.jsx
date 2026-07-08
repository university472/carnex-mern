// client/src/components/vehicles/PaymentCalculator.jsx
import { useState, useMemo } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const creditTiers = [
  { label: 'Rebuild', range: '0‑620', apr: 14.9 },
  { label: 'Fair', range: '621‑699', apr: 10.9 },
  { label: 'Good', range: '700‑759', apr: 7.9 },
  { label: 'Great', range: '760‑850', apr: 4.0 }
]

const termOptions = [36, 48, 60, 72, 84]

export function PaymentCalculator({ price }) {
  const [tradeIn, setTradeIn] = useState('0')
  const [downPayment, setDownPayment] = useState('3000')
  const [apr, setApr] = useState('4.0') // in percentage
  const [termMonths, setTermMonths] = useState('60')
  const [activeTier, setActiveTier] = useState(creditTiers[3].apr) // 'Great'

  // When a credit tier is selected, update APR to its preset
  const handleTierSelect = (tier) => {
    setActiveTier(tier.apr)
    setApr(String(tier.apr))
  }

  const loanAmount = useMemo(() => {
    const priceNum = Number(price) || 0

    const trade = Math.max(Number(tradeIn) || 0, 0)
    const down = Math.max(Number(downPayment) || 0, 0)

    const amount = priceNum - trade - down

    return Math.max(amount, 0)
  }, [price, tradeIn, downPayment])

  const monthlyPayment = useMemo(() => {
    const months = Number(termMonths) || 0

    if (!months || !loanAmount) {
      return 0
    }

    const rate = Math.max(Number(apr) || 0, 0)
    const monthlyRate = rate / 100 / 12

    // 0% APR case
    if (monthlyRate === 0) {
      return loanAmount / months
    }

    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
  }, [loanAmount, apr, termMonths])

  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(monthlyPayment)
  const formattedLoan = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(loanAmount)

  return (
    <section className="card-surface space-y-4 p-5">
      <h2 className="text-section-title text-base">Payment Calculator</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Vehicle Price"
          type="number"
          value={price}
          disabled
          className="bg-gray-50"
        />
        <Input
          label="Trade-In Value"
          type="number"
          min="0"
          value={tradeIn}
          onChange={(e) => setTradeIn(Math.max(Number(e.target.value), 0))}
        />
        <Input
          label="Down Payment"
          type="number"
          min="0"
          value={downPayment}
          onChange={(e) => setDownPayment(Math.max(Number(e.target.value), 0))}
        />
        <Input
          label="APR (%)"
          type="number"
          min="0"
          step="0.1"
          value={apr}
          onChange={(e) => {
            setApr(Math.max(Number(e.target.value), 0))
            setActiveTier(null)
          }}
        />
      </div>

      {/* Credit score tiers */}
      <div>
        <p className="text-xs font-medium text-brand-secondary mb-2">
          Estimated Credit Score
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {creditTiers.map((tier) => (
            <button
              key={tier.label}
              type="button"
              onClick={() => handleTierSelect(tier)}
              className={`flex flex-col items-center rounded-md border px-3 py-2 text-xs transition-all
                ${
                  activeTier === tier.apr
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-brand-border hover:border-brand-primary/60'
                }`}
            >
              <span className="font-semibold">{tier.label}</span>
              <span className="text-[10px]">{tier.range}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Term selector */}
      <div>
        <p className="text-xs font-medium text-brand-secondary mb-2">
          Term Length (months)
        </p>
        <div className="flex flex-wrap gap-2">
          {termOptions.map((months) => (
            <button
              key={months}
              type="button"
              onClick={() => setTermMonths(String(months))}
              className={`rounded-md border px-3 py-1.5 text-xs transition-all
                ${
                  termMonths === String(months)
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-brand-border hover:border-brand-primary/60'
                }`}
            >
              {months}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="border-t border-brand-border pt-3 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-0.5">
          <p className="text-brand-muted">Estimated Monthly</p>
          <p className="text-xl font-semibold text-brand-primary">
            {formattedMonthly}
          </p>
        </div>
        <div className="space-y-0.5 border-l border-brand-border pl-4">
          <p className="text-brand-muted">Loan Amount</p>
          <p className="text-lg font-semibold text-brand-secondary">
            {formattedLoan}
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
        <p className="text-[11px] leading-relaxed text-yellow-800">
          <strong>Payment Estimate Note:</strong> Payment estimates are for
          reference only and are not an offer of credit or request for specific
          credit terms. Actual APR, terms and payment vary based on credit,
          vehicle and state. Tag, title and document fees may vary and will be
          calculated at the time of purchase.
        </p>
      </div>

      <Button variant="primary" size="md" className="w-full" asChild>
        <a href="/financing">Apply for Financing</a>
      </Button>
    </section>
  )
}
