import { Link } from 'react-router-dom'
import { Phone, Mail, Clock, ShieldCheck } from 'lucide-react'
import { DEALERSHIP } from '../../constants'
import { PageHero } from './PageHero'

// Shared frame for the public form pages (financing, trade-in, test drive,
// sourcing): dark banner, the form, and a help sidebar.
export function FormPageLayout({ eyebrow, title, intro, watermark, children }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} watermark={watermark}>
        {intro}
      </PageHero>

      <section className="page-content">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr),320px]">
          <div className="relative z-10 -mt-14 min-w-0">{children}</div>

          <aside className="space-y-4 lg:sticky lg:top-32 lg:-mt-14">
            <div className="relative z-10 overflow-hidden rounded-2xl bg-ink-900 p-6 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-primary/30 blur-2xl" />
              <p className="relative font-display text-lg font-semibold">
                Need a hand?
              </p>
              <p className="relative mt-1 text-sm text-gray-400">
                Our team is happy to help you through every step.
              </p>
              <ul className="relative mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href={`tel:${DEALERSHIP.phone}`}
                    className="flex items-center gap-3 hover:text-brand-primary transition-colors"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                      <Phone className="h-4 w-4" />
                    </span>
                    {DEALERSHIP.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${DEALERSHIP.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 break-all hover:text-brand-primary transition-colors"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Mail className="h-4 w-4" />
                    </span>
                    {DEALERSHIP.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <Clock className="h-4 w-4" />
                  </span>
                  Mon–Sat: 9 AM – 5 PM
                </li>
              </ul>
              <Link
                to="/contact"
                className="relative mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryHover"
              >
                Contact Dealership
              </Link>
            </div>

            <div className="public-card flex items-start gap-3 p-5">
              <ShieldCheck className="h-6 w-6 flex-shrink-0 text-brand-primary" />
              <p className="text-xs leading-relaxed text-slate-500">
                Every Carnex vehicle is carefully inspected by our dealership
                team, so you can shop with confidence.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
