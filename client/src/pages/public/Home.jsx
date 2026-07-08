// client/src/pages/public/Home.jsx
import { useState, useEffect } from 'react'
import { ContactForm } from '../../components/forms/ContactForm'
import { Link, useNavigate } from 'react-router-dom'
import { DEALERSHIP, BUSINESS_HOURS } from '../../constants'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { VehicleCard } from '../../components/vehicles/VehicleCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useLatestVehicles } from '../../hooks/useVehicles'
import { getApprovedReviews } from '../../services/reviewService'
import { ReviewCard } from '../../components/reviews/ReviewCard'
import { ReviewForm } from '../../components/reviews/ReviewForm'

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const makeOptions = [
  { label: 'Any Make', value: '' },
  { label: 'Toyota', value: 'Toyota' },
  { label: 'Honda', value: 'Honda' },
  { label: 'Chevrolet', value: 'Chevrolet' },
  { label: 'Ford', value: 'Ford' }
]

const bodyTypeOptions = [
  { label: 'Any Type', value: '' },
  { label: 'Sedan', value: 'Sedan' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Truck', value: 'Truck' },
  { label: 'Coupe', value: 'Coupe' }
]

const yearOptions = [
  { label: 'Any Year', value: '' },
  { label: '2024+', value: '2024' },
  { label: '2022+', value: '2022' },
  { label: '2020+', value: '2020' },
  { label: '2018+', value: '2018' }
]

const STATS = [
  { num: '500+', label: 'Vehicles Sold' },
  { num: '4.9★', label: 'Customer Rating' },
  { num: '100%', label: 'Inspected' },
  { num: 'Trusted', label: 'Reputable Financing' }
]

const TRUST_ITEMS = [
  { num: '$0', label: 'Hidden dealer fees' },
  { num: '150+', label: 'Point inspection' },
  { num: 'Same', label: 'Day financing approval' },
  { num: 'Fair', label: 'Trade-in valuations' }
]

const TRUST_PILLS = [
  'Transparent Pricing',
  'No Hidden Fees',
  'Trade-Ins Welcome',
  'In-House Financing',
  'Vehicle Inspections'
]

const REVIEWS = [
  {
    name: 'D. Martin',
    location: 'Sacramento',
    date: '2 weeks ago',
    rating: 5,
    text: "Easiest car buying experience I've had. No pressure at all — they showed me options in my budget and we wrapped up financing the same afternoon.",
    vehicle: 'Honda CR-V',
    initials: 'DM'
  },
  {
    name: 'R. Patel',
    location: 'Elk Grove',
    date: '1 month ago',
    rating: 5,
    text: 'Got a fair trade-in on my old sedan and drove off in a CR-V the same day. The team was honest and the price was exactly what was listed online.',
    vehicle: 'Honda CR-V',
    initials: 'RP'
  },
  {
    name: 'T. Williams',
    location: 'Rancho Cordova',
    date: '3 weeks ago',
    rating: 5,
    text: "Found the F-150 I'd been looking for. Detailed, inspected, and ran perfectly on the test drive. I'll be back when it's time for my wife's car.",
    vehicle: 'Ford F-150',
    initials: 'TW'
  }
]

// ---------------------------------------------------------------------------
// Home page component
// ---------------------------------------------------------------------------

export function Home() {
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    make: '',
    bodyType: '',
    maxPrice: '',
    minYear: ''
  })

  const { vehicles: latestVehicles, loading: latestLoading } =
    useLatestVehicles(3)

  // ── dynamic reviews ──────────────────────────────────────────────────
  const [reviews, setReviews] = useState([])
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const fetchReviews = () => {
    getApprovedReviews()
      .then((res) => setReviews(res.data.data))
      .catch(() => {})
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // ── handlers ──────────────────────────────────────────────────────────
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuickSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.make) params.set('make', filters.make)
    if (filters.bodyType) params.set('bodyType', filters.bodyType)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.minYear) params.set('minYear', filters.minYear)
    navigate(`/inventory?${params.toString()}`)
  }

  return (
    <section className="page-content space-y-10">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════════════════════════════ */}
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] items-center">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
            Sacramento, California · Pre-Owned Vehicles
          </p>
          <h1 className="text-hero-title">
            Drive home
            <br />
            in the car you
            <br />
            <em className="not-italic relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-brand-accent">
              deserve.
            </em>
          </h1>
          <p className="text-body-muted max-w-xl text-sm sm:text-base">
            No-pressure sales, transparent pricing, and in-house financing — so
            you leave confident every time.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/inventory">
              <Button size="lg">Browse Inventory</Button>
            </Link>
            <Link to="/financing">
              <Button size="lg" variant="secondary">
                Apply for Financing
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="card-surface overflow-hidden">
            <img
              src="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Carnex Auto Sales lot in Sacramento"
              className="h-64 w-full object-cover sm:h-72 lg:h-80"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-x-4 bottom-4 rounded-md bg-black/65 p-3 text-xs text-gray-100 shadow-card">
            <p className="font-semibold">
              Sacramento&apos;s Premier Pre-Owned Dealership
            </p>
            <p>
              Trade-ins accepted · Financing available · All vehicles inspected
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS BAR
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="card-surface !rounded-none border-t border-b border-brand-accent/20">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-border/10">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="py-6 px-6 text-center flex flex-col items-center justify-center min-w-0"
            >
              <div className="font-bold text-brand-accent leading-none whitespace-nowrap text-3xl xl:text-[2.5rem]">
                {s.num}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-widest text-brand-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          QUICK SEARCH
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-section-title">Find Your Vehicle</h2>
          <p className="text-body-muted text-xs sm:text-sm max-w-md">
            Filter by make, body style, price, and year to quickly see what fits
            your needs.
          </p>
        </div>

        <form
          onSubmit={handleQuickSearch}
          className="card-surface grid gap-4 p-4 sm:p-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        >
          <Select
            id="qs-make"
            label="Make"
            options={makeOptions}
            value={filters.make}
            onChange={(e) => handleFilterChange('make', e.target.value)}
          />
          <Select
            id="qs-bodyType"
            label="Body Type"
            options={bodyTypeOptions}
            value={filters.bodyType}
            onChange={(e) => handleFilterChange('bodyType', e.target.value)}
          />
          <Input
            id="qs-maxPrice"
            label="Max Price (USD)"
            type="number"
            min="0"
            placeholder="e.g. 30000"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
          <Select
            id="qs-year"
            label="Min Year"
            options={yearOptions}
            value={filters.minYear}
            onChange={(e) => handleFilterChange('minYear', e.target.value)}
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full lg:w-auto">
              Search →
            </Button>
          </div>
        </form>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          INVENTORY
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
              Current Stock
            </p>
            <h2 className="text-section-title">Inventory</h2>
          </div>
          <Link
            to="/inventory"
            className="text-xs font-medium text-brand-primary hover:underline"
          >
            View All Inventory
          </Link>
        </div>

        {latestLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : latestVehicles.length === 0 ? (
          <div className="card-surface p-6 text-center">
            <p className="text-brand-muted text-sm">
              No vehicles in inventory yet.{' '}
              <Link
                to="/contact"
                className="text-brand-primary hover:underline"
              >
                Contact us
              </Link>{' '}
              to enquire about upcoming stock.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          READY TO DRIVE
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="card-surface rounded-card p-3 sm:p-4 text-center space-y-2 border-t-2 border-brand-accent">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
          Ready to drive home?
        </h2>
        <p className="text-body-muted text-sm max-w-lg mx-auto">
          Browse our inventory, get pre‑approved online, or stop by the lot.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link to="/inventory">
            <Button size="sm">View Inventory</Button>
          </Link>
          <Link to="/financing">
            <Button size="sm" variant="secondary">
              Apply for Financing
            </Button>
          </Link>
          <Link to="/test-drive">
            <Button
              size="sm"
              variant="ghost"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Book a Test Drive
            </Button>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          WHY CARNEX / TRUST SECTION
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="card-surface !rounded-none border-t border-brand-border/10">
        <div className="grid gap-8 lg:grid-cols-2 p-6 sm:p-8 items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
              The Carnex Difference
            </p>
            <h2 className="text-section-title">
              Why Sacramento
              <br />
              chooses us
            </h2>
            <p className="text-body-muted text-sm">
              We built Carnex on a simple idea: buying a used car should feel as
              premium as the car itself. No bait-and-switch, no hidden fees, no
              high-pressure tactics — just honest people, quality vehicles, and
              financing that works for you.
            </p>
            <div className="flex flex-wrap gap-2">
              {TRUST_PILLS.map((pill) => (
                <Badge key={pill} variant="accent">
                  {pill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-brand-border/10">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.label}
                className="bg-brand-surface p-4 text-center"
              >
                <div className="text-2xl font-bold text-brand-accent">
                  {item.num}
                </div>
                <div className="text-xs uppercase tracking-wider text-brand-muted mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          REVIEWS (hardcoded + dynamic)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
              What Customers Say
            </p>
            <h2 className="text-section-title">
              Real reviews from real buyers
            </h2>
          </div>
          <Button onClick={() => setReviewModalOpen(true)}>
            Write a Review
          </Button>
        </div>

        {/* ── Static curated reviews ─────────────────────────────── */}
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <div key={review.name} className="card-surface p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-sm shrink-0">
                  {review.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-secondary truncate">
                    {review.name}
                  </p>
                  <p className="text-xs text-brand-muted">{review.date}</p>
                </div>
                <Badge
                  variant="success"
                  className="text-xs px-2 py-0.5 ml-auto"
                >
                  Verified Buyer
                </Badge>
              </div>

              <div className="text-brand-accent text-sm tracking-widest">
                {'★'.repeat(review.rating)}{' '}
                <span className="text-brand-muted text-xs ml-1">
                  {review.rating}.0
                </span>
              </div>

              <p className="text-body-muted text-sm italic leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              {review.vehicle && (
                <div className="pt-1">
                  <Badge variant="outline" className="text-xs">
                    🚗 {review.vehicle}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div> */}

        {/* ── Dynamic approved reviews ────────────────────────────── */}
        {reviews.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-brand-secondary">
              More customer reviews
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          </div>
        )}

        {/* ── Write a Review Modal ─────────────────────────────────── */}
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-card p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-brand-secondary">
                  Submit Your Review
                </h3>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="text-brand-muted hover:text-brand-secondary text-xl leading-none"
                >
                  ✕
                </button>
              </div>
              <ReviewForm
                onSuccess={() => {
                  setReviewModalOpen(false)
                  fetchReviews()
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          LOCATION (Google Map + Address)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
            Visit Us
          </p>
          <h2 className="text-section-title">Our Dealership</h2>
        </div>

        <div className="card-surface overflow-hidden rounded-card">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3121.991613756464!2d-121.40416640000001!3d38.51090429999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ac547a236add1%3A0xd1f4ba3921d232c!2sCarnex%20Auto%20Sales%20LLC!5e0!3m2!1sen!2s!4v1783188042575!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-64 sm:h-80"
            title="Carnex Auto Sales LLC location"
          ></iframe>
        </div>

        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <span className="text-brand-accent">📍</span>
          <a
            href="https://maps.app.goo.gl/oKgPzwuNp92o5LXv9?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-primary underline underline-offset-2"
          >
            {DEALERSHIP.addressLine1}, {DEALERSHIP.addressLine2}
          </a>
        </div>
        <div className="space-y-4 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
              Get In Touch
            </p>
            <h2 className="text-section-title">Contact Us</h2>
          </div>
          <div className="card-surface p-5">
            <ContactForm />
          </div>
        </div>
      </section>
    </section>
  )
}
