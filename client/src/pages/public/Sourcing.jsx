// client/src/pages/public/Sourcing.jsx
import { SourcingForm } from '../../components/forms/SourcingForm'
import { submitSourcingRequest } from '../../services/sourcingService'
const handleSubmit = async (data) => {
  await submitSourcingRequest(data)
}
export function Sourcing() {
  return (
    <section className="page-content space-y-6">
      <header className="space-y-3">
        <h1 className="text-page-title">Vehicle sourcing request.</h1>
        <p className="text-body-muted text-sm max-w-2xl">
          We&apos;re ready to take the work out of car shopping. Simply tell us
          what you&apos;re looking for and we&apos;ll search U.S. auctions and
          partner dealers to find your perfect fit.[file:21]
        </p>
      </header>

      <SourcingForm onSubmit={handleSubmit} />
    </section>
  )
}
