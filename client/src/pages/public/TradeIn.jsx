// client/src/pages/public/TradeIn.jsx
import { TradeInForm } from '../../components/forms/TradeInForm'
import { submitTradeInRequest } from '../../services/tradeInService'
const handleSubmit = async (data) => {
  await submitTradeInRequest(data)
}
export function TradeIn() {
  return (
    <section className="page-content space-y-6">
      <header className="space-y-3">
        <h1 className="text-page-title">Value your trade‑in.</h1>
        <p className="text-body-muted text-sm max-w-2xl">
          Tell us about your trade‑in, and we will provide an estimated value
          based on current U.S. market conditions. This helps you plan how much
          equity you can apply toward your next vehicle.
        </p>
      </header>

      <TradeInForm onSubmit={handleSubmit} />
    </section>
  )
}
