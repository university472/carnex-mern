// client/src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'
import { DEALERSHIP, BUSINESS_HOURS, NAV_LINKS } from '../../constants'

export function Footer() {
  return (
    <footer className="mt-10 border-t border-brand-border bg-brand-secondary text-gray-200">
      <div className="container grid gap-8 py-8 sm:py-10 md:grid-cols-3">
        {/* Dealership info */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
            {DEALERSHIP.name}
          </h4>

          <p className="text-sm text-gray-300">
            We are here to help you find your next vehicle with a transparent,
            modern buying experience.
          </p>

          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Address:</span>{' '}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${DEALERSHIP.addressLine1}, ${DEALERSHIP.addressLine2}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-brand-primary"
              >
                {DEALERSHIP.addressLine1}, {DEALERSHIP.addressLine2}
              </a>
            </p>
            <p>
              <span className="font-medium">Phone:</span>{' '}
              <a
                href={`tel:${DEALERSHIP.phone}`}
                className="hover:underline text-brand-primary"
              >
                {DEALERSHIP.phone}
              </a>
            </p>
            <p>
              <span className="font-medium">Email:</span>{' '}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${DEALERSHIP.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-brand-primary"
              >
                {DEALERSHIP.email}
              </a>
            </p>
          </div>
        </div>

        {/* Business hours */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
            Business Hours
          </h4>

          <ul className="space-y-1 text-sm">
            {BUSINESS_HOURS.map((entry, index) => (
              <li
                key={index}
                className="flex items-center justify-between border-b border-white/5 pb-1"
              >
                <span>{entry.day}</span>
                <span className="text-gray-300">{entry.hours}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
            Quick Links
          </h4>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container flex flex-col items-center justify-between gap-3 py-4 text-xs text-gray-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {DEALERSHIP.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
