import { ContactForm } from '../../components/forms/ContactForm'
import { submitContactMessage } from '../../services/contactService'
import { DEALERSHIP, BUSINESS_HOURS } from '../../constants'

export function Contact() {
  const handleSubmit = async (formData) => {
    await submitContactMessage(formData)
  }

  return (
    <section className="page-content space-y-6">
      <header className="space-y-2">
        <h1 className="text-page-title">Contact Carnex Auto Sales</h1>

        <p className="text-body-muted max-w-2xl">
          Have a question about inventory, financing, or trade-ins? Use the form
          below or reach us via phone or email.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="card-surface p-5">
          {/* THIS IS THE IMPORTANT CHANGE */}

          <ContactForm onSubmit={handleSubmit} />
        </div>

        <aside className="space-y-4">
          <div className="card-surface p-4 space-y-2 text-sm">
            <h2 className="text-section-title text-base">Dealership details</h2>

            <p className="text-body-muted">
              {DEALERSHIP.name}
              <br />
              {DEALERSHIP.addressLine1}
              <br />
              {DEALERSHIP.addressLine2}
            </p>

            <p className="text-body-muted">
              Phone: {DEALERSHIP.phone}
              <br />
              Email:{' '}
              <a
                href={`mailto:${DEALERSHIP.email}`}
                className="text-brand-primary hover:underline"
              >
                {DEALERSHIP.email}
              </a>
            </p>
          </div>

          <div className="card-surface p-4 space-y-2">
            <h2 className="text-section-title text-base">Business hours</h2>

            <ul className="space-y-1 text-xs text-brand-muted">
              {BUSINESS_HOURS.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between border-b border-brand-border/40 pb-1 last:border-b-0 last:pb-0"
                >
                  <span>{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
