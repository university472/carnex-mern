// client/src/pages/public/About.jsx
import { DEALERSHIP, BUSINESS_HOURS } from '../../constants'
import { Badge } from '../../components/ui/Badge'

export function About() {
  return (
    <section className="page-content space-y-8">
      {/* Hero / intro */}
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          About {DEALERSHIP.name}
        </p>
        <h1 className="text-page-title">
          A modern pre‑owned dealership in Sacramento.
        </h1>
        <p className="text-body-muted text-sm max-w-2xl">
          Located in the heart of Sacramento, CA, {DEALERSHIP.name} is dedicated
          to providing our community with high‑quality, pre‑owned vehicles at
          competitive prices.[file:14]
        </p>
      </header>

      {/* Story & values */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface space-y-3 p-5">
          <h2 className="text-section-title text-base">
            Our approach to car buying
          </h2>
          <p className="text-body-muted text-sm">
            We understand that purchasing a vehicle is a major decision. That’s
            why we have streamlined the entire car‑buying process. From the
            moment you step onto our lot or browse our virtual showroom, our
            goal is to provide a transparent, zero‑pressure
            environment.[file:14]
          </p>
          <p className="text-body-muted text-sm">
            Whether you have excellent credit, are rebuilding your credit, or
            are a first‑time buyer, our experienced finance team works with a
            network of U.S. lenders to secure terms that fit your budget.
          </p>
        </div>

        <div className="card-surface space-y-3 p-5">
          <h2 className="text-section-title text-base">
            What sets Carnex apart
          </h2>
          <ul className="space-y-2 text-sm text-brand-muted">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              Transparent, no‑pressure sales experience.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              Curated pre‑owned inventory suited for U.S. highway and city
              driving.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              Financing options for a wide range of credit profiles.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              Trade‑in values based on current U.S. market conditions.
            </li>
          </ul>
        </div>
      </section>

      {/* Hours & location */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface space-y-3 p-5 lg:col-span-2">
          <h2 className="text-section-title text-base">Visit us in person</h2>
          <p className="text-body-muted text-sm">
            We are here to help you find your next vehicle.
          </p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Address:</span>{' '}
              {DEALERSHIP.addressLine1}, {DEALERSHIP.addressLine2}[file:15]
            </p>
            <p>
              <span className="font-medium">Phone:</span> {DEALERSHIP.phone}
            </p>
            <p>
              <span className="font-medium">Email:</span>{' '}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${DEALERSHIP.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline"
              >
                {DEALERSHIP.email}
              </a>
            </p>
          </div>
        </div>

        <div className="card-surface space-y-3 p-5">
          <h2 className="text-section-title text-base">Business hours</h2>
          <ul className="space-y-1 text-xs">
            {BUSINESS_HOURS.map((entry) => (
              <li
                key={entry.day}
                className="flex items-center justify-between border-b border-brand-border/40 pb-1"
              >
                <span>{entry.day}</span>
                <span className="text-brand-muted">{entry.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Commitment */}
      <section className="card-surface space-y-3 p-5">
        <h2 className="text-section-title text-base">
          Our commitment to Sacramento drivers
        </h2>
        <p className="text-body-muted text-sm">
          Our team lives and works in the Sacramento area, so we understand
          local driving conditions, commute patterns, and budgets. Whether
          you’re upgrading, downsizing, or buying your first vehicle in the
          United States, we&apos;re here to help you confidently make the right
          decision.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="accent">Community focused</Badge>
          <Badge variant="default">Pre‑owned specialists</Badge>
        </div>
      </section>
    </section>
  )
}
