// // client/src/components/vehicles/PaymentCalculator.jsx
// import { useMemo, useState } from 'react'
// import { Input } from '../ui/Input'
// import { Badge } from '../ui/Badge'

// export function PaymentCalculator({ price }) {
//   const [downPayment, setDownPayment] = useState('3000')
//   const [apr, setApr] = useState('6.5') // U.S. style APR percentage
//   const [termMonths, setTermMonths] = useState('60') // 5 years

//   const loanAmount = useMemo(() => {
//     const dp = Number(downPayment) || 0
//     const amount = price - dp
//     return amount > 0 ? amount : 0
//   }, [price, downPayment])

//   const monthlyPayment = useMemo(() => {
//     const monthlyRate = (Number(apr) || 0) / 100 / 12
//     const months = Number(termMonths) || 0

//     if (!monthlyRate || !months || !loanAmount) {
//       return 0
//     }

//     const payment =
//       (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))

//     return payment
//   }, [loanAmount, apr, termMonths])

//   const formattedMonthly = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     maximumFractionDigits: 0
//   }).format(monthlyPayment || 0)

//   const formattedLoan = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     maximumFractionDigits: 0
//   }).format(loanAmount || 0)

//   return (
//     <section className="card-surface space-y-4 p-5">
//       <div className="flex items-center justify-between gap-3">
//         <h2 className="text-section-title text-base">
//           Estimate your monthly payment
//         </h2>
//         <Badge variant="default">U.S. Buyer Estimate</Badge>
//       </div>

//       <p className="text-body-muted text-xs">
//         This simple calculator uses typical U.S. auto loan terms. Exact payment
//         will depend on your credit profile, lender offers, taxes, and
//         fees.[file:17]
//       </p>

//       <div className="grid gap-4 sm:grid-cols-3">
//         <Input
//           id="calc-downPayment"
//           label="Down payment (USD)"
//           type="number"
//           min="0"
//           value={downPayment}
//           onChange={(e) => setDownPayment(e.target.value)}
//         />
//         <Input
//           id="calc-apr"
//           label="APR (%)"
//           type="number"
//           min="0"
//           step="0.1"
//           value={apr}
//           onChange={(e) => setApr(e.target.value)}
//         />
//         <Input
//           id="calc-term"
//           label="Term (months)"
//           type="number"
//           min="12"
//           step="12"
//           value={termMonths}
//           onChange={(e) => setTermMonths(e.target.value)}
//         />
//       </div>

//       <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border pt-3 text-sm">
//         <div className="space-y-0.5">
//           <p className="text-brand-muted">Estimated monthly payment</p>
//           <p className="text-xl font-semibold text-brand-primary">
//             {formattedMonthly}
//           </p>
//         </div>
//         <div className="space-y-0.5 text-xs text-brand-muted">
//           <p>
//             Loan amount after down payment:{' '}
//             <span className="font-medium text-brand-secondary">
//               {formattedLoan}
//             </span>
//           </p>
//           <p>
//             Use this as a starting point when applying for financing – our U.S.
//             lenders can provide precise offers and terms.
//           </p>
//         </div>
//       </div>
//     </section>
//   )
// }

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
    const priceNum = price || 0
    const trade = Number(tradeIn) || 0
    const down = Number(downPayment) || 0
    const amount = priceNum - trade - down
    return amount > 0 ? amount : 0
  }, [price, tradeIn, downPayment])

  const monthlyPayment = useMemo(() => {
    const monthlyRate = (Number(apr) || 0) / 100 / 12
    const months = Number(termMonths) || 0
    if (!monthlyRate || !months || !loanAmount) return 0
    const payment =
      (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    return payment
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
          label="Trade‑In Value"
          type="number"
          value={tradeIn}
          onChange={(e) => setTradeIn(e.target.value)}
        />
        <Input
          label="Down Payment"
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
        />
        <Input
          label="APR (%)"
          type="number"
          step="0.1"
          value={apr}
          onChange={(e) => {
            setApr(e.target.value)
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

      <Button variant="primary" size="md" className="w-full" asChild>
        <a href="/financing">Apply for Financing</a>
      </Button>
    </section>
  )
}
