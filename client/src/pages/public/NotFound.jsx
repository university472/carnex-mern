// client/src/pages/public/NotFound.jsx
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function NotFound() {
  return (
    <section className="page-content">
      <div className="card-surface mx-auto max-w-lg p-6 space-y-4 text-center">
        <p className="text-small text-brand-muted uppercase tracking-wide">
          404 — Page not found
        </p>
        <h1 className="text-page-title">We couldn’t find that page</h1>
        <p className="text-body-muted text-sm">
          The link you followed may be broken, expired, or typed incorrectly.
          Let’s get you back to browsing vehicles or contacting the
          dealership.[web:90][web:93]
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button as={Link} to="/" size="md">
            Back to Home
          </Button>
          <Button as={Link} to="/inventory" variant="secondary" size="md">
            View Inventory
          </Button>
          <Button as={Link} to="/contact" variant="ghost" size="md">
            Contact Us
          </Button>
        </div>

        <p className="text-small text-brand-muted pt-2">
          If you reached this page from a bookmark, you may want to update it
          after navigating back to the correct section.[web:90]
        </p>
      </div>
    </section>
  )
}
