// client/src/pages/public/Financing.jsx
import { FinancingForm } from '../../components/forms/FinancingForm'
import { submitFinanceApplication } from '../../services/financeService'

const handleSubmit = async (data) => {
  await submitFinanceApplication(data)
}
export function Financing() {
  return (
    <section className="page-content space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          Auto loan financing • Sacramento, California
        </p>
        <h1 className="text-page-title">Apply for financing.</h1>
        <p className="text-body-muted text-sm max-w-2xl">
          Complete this secure financing form to start the pre‑approval process
          for your next vehicle. Our U.S. financing team will review your
          information and contact you with options tailored to your
          budget.[file:18]
        </p>
      </header>

      <FinancingForm onSubmit={handleSubmit} />
    </section>
  )
}
