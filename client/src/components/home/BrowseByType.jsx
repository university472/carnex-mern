import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { BodyTypeIcon } from './BodyTypeIcon'

/**
 * "Brands with body type" — every chip/tile is a plain link into the
 * existing inventory filters (?make= / ?bodyType=). Makes and body types
 * are the live distinct values from /vehicles/filters.
 */
export function BrowseByType({ makes = [], bodyTypes = [] }) {
  if (!makes.length && !bodyTypes.length) return null

  return (
    <section className="container py-16 sm:py-20">
      <div className="mb-8 text-center">
        <p className="eyebrow eyebrow-center justify-center">Browse Top Cars</p>
        <h2 className="section-heading mt-2">Brands With Body Type</h2>
      </div>

      {makes.length > 0 && (
        <div className="-mx-4 mb-8 overflow-x-auto px-4 no-scrollbar">
          <div className="mx-auto flex w-max gap-2.5 sm:w-auto sm:flex-wrap sm:justify-center">
            {makes.map((make) => (
              <Link
                key={make}
                to={`/inventory?make=${encodeURIComponent(make)}`}
                className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary hover:text-white"
              >
                {make}
              </Link>
            ))}
          </div>
        </div>
      )}

      {bodyTypes.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {bodyTypes.map((type) => (
            <Link
              key={type}
              to={`/inventory?bodyType=${encodeURIComponent(type)}`}
              className="group relative flex flex-col items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-6 text-center shadow-[0_6px_20px_-12px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.3)]"
            >
              <BodyTypeIcon
                bodyType={type}
                className="h-10 w-20 text-ink-800 transition-colors group-hover:text-brand-primary"
              />
              <span className="text-sm font-semibold text-ink-900">{type}</span>
              <span className="absolute -bottom-3 -right-3 flex h-7 w-7 scale-0 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-transform duration-300 group-hover:scale-100">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          to="/inventory"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-primary"
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
