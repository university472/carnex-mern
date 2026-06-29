// client/src/components/vehicles/PaymentCalculator.jsx
import { useMemo, useState } from 'react'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'

export function PaymentCalculator({ price }) {
  const [downPayment, setDownPayment] = useState('3000')
  const [apr, setApr] = useState('6.5') // U.S. style APR percentage
  const [termMonths, setTermMonths] = useState('60') // 5 years

  const loanAmount = useMemo(() => {
    const dp = Number(downPayment) || 0
    const amount = price - dp
    return amount > 0 ? amount : 0
  }, [price, downPayment])

  const monthlyPayment = useMemo(() => {
    const monthlyRate = (Number(apr) || 0) / 100 / 12
    const months = Number(termMonths) || 0

    if (!monthlyRate || !months || !loanAmount) {
      return 0
    }

    const payment =
      (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))

    return payment
  }, [loanAmount, apr, termMonths])

  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(monthlyPayment || 0)

  const formattedLoan = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(loanAmount || 0)

  return (
    <section className="card-surface space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-section-title text-base">
          Estimate your monthly payment
        </h2>
        <Badge variant="default">U.S. Buyer Estimate</Badge>
      </div>

      <p className="text-body-muted text-xs">
        This simple calculator uses typical U.S. auto loan terms. Exact payment
        will depend on your credit profile, lender offers, taxes, and
        fees.[file:17]
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          id="calc-downPayment"
          label="Down payment (USD)"
          type="number"
          min="0"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
        />
        <Input
          id="calc-apr"
          label="APR (%)"
          type="number"
          min="0"
          step="0.1"
          value={apr}
          onChange={(e) => setApr(e.target.value)}
        />
        <Input
          id="calc-term"
          label="Term (months)"
          type="number"
          min="12"
          step="12"
          value={termMonths}
          onChange={(e) => setTermMonths(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border pt-3 text-sm">
        <div className="space-y-0.5">
          <p className="text-brand-muted">Estimated monthly payment</p>
          <p className="text-xl font-semibold text-brand-primary">
            {formattedMonthly}
          </p>
        </div>
        <div className="space-y-0.5 text-xs text-brand-muted">
          <p>
            Loan amount after down payment:{' '}
            <span className="font-medium text-brand-secondary">
              {formattedLoan}
            </span>
          </p>
          <p>
            Use this as a starting point when applying for financing – our U.S.
            lenders can provide precise offers and terms.
          </p>
        </div>
      </div>
    </section>
  )
}
