// client/src/pages/public/Home.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { ContactForm } from '../../components/forms/ContactForm'
import { Link, useNavigate } from 'react-router-dom'
import { DEALERSHIP, BUSINESS_HOURS, DEALER_FEE_NOTE } from '../../constants'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { VehicleCard } from '../../components/vehicles/VehicleCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useVehicles } from '../../hooks/useVehicles'
// Google Reviews section is temporarily disabled (no Places API billing yet).
// Re-enable by uncommenting these two imports plus the block below marked
// "GOOGLE REVIEWS — DISABLED".
// import { getGoogleReviews } from '../../services/reviewService'
// import { GoogleReviewCard } from '../../components/reviews/GoogleReviewCard'

// ---------------------------------------------------------------------------
// Social Media URLs (replace with your actual links)
// ---------------------------------------------------------------------------
const INSTAGRAM_URL = 'https://www.instagram.com/carnex.autos/?hl=en'
const FACEBOOK_URL =
  ' https://www.facebook.com/profile.php?id=61591422665780&mibextid=wwXIfr'
const TIKTOK_URL = 'https://www.tiktok.com/@carnex.auto.sales'
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/oKgPzwuNp92o5LXv9?g_st=aw'

// ---------------------------------------------------------------------------
// Static data (some arrays will be replaced with dynamic data from API)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Home page component
// ---------------------------------------------------------------------------

export function Home() {
  const navigate = useNavigate()

  // ── Quick Search Filters ─────────────────────────────────────────────
  const [filters, setFilters] = useState({
    make: '',
    bodyType: '',
    maxPrice: '',
    minYear: ''
  })

  // ── Filter Options from API ─────────────────────────────────────────
  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    bodyTypes: [],
    fuelTypes: [],
    transmissions: []
  })

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/vehicles/filters`
        )
        const data = await res.json()
        setFilterOptions(data)
      } catch (err) {
        console.error('Failed to load filter options', err)
      }
    }
    fetchFilters()
  }, [])

  // ── Dynamic option arrays ───────────────────────────────────────────
  const makeOptions = [
    { label: 'Any Make', value: '' },
    ...(filterOptions.makes || []).map((m) => ({ label: m, value: m }))
  ]

  const bodyTypeOptions = [
    { label: 'Any Type', value: '' },
    ...(filterOptions.bodyTypes || []).map((b) => ({ label: b, value: b }))
  ]

  // ── Fetch vehicles for hero carousel (max 20 latest) ────────────────
  const {
    vehicles: heroVehicles,
    loading: heroLoading,
    error: heroError
  } = useVehicles({ limit: 20, sort: '-createdAt' })

  // ── Fetch latest vehicles for inventory section (3) ──────────────────
  const { vehicles: latestVehicles, loading: latestLoading } = useVehicles({
    limit: 3,
    sort: '-createdAt'
  })

  // ── Carousel state ────────────────────────────────────────────────────
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideInterval = useRef(null)

  const nextSlide = useCallback(() => {
    if (heroVehicles.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % heroVehicles.length)
  }, [heroVehicles.length])

  const prevSlide = useCallback(() => {
    if (heroVehicles.length === 0) return
    setCurrentSlide(
      (prev) => (prev - 1 + heroVehicles.length) % heroVehicles.length
    )
  }, [heroVehicles.length])

  // Auto-advance
  useEffect(() => {
    if (!isPaused && heroVehicles.length > 1) {
      slideInterval.current = setInterval(nextSlide, 5000)
    }
    return () => clearInterval(slideInterval.current)
  }, [isPaused, nextSlide, heroVehicles.length])

  // Pause on hover/touch
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  // Touch swipe support
  const touchStartX = useRef(null)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    setIsPaused(true)
  }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const delta = touchEndX - touchStartX.current
    if (Math.abs(delta) > 50) {
      if (delta > 0) prevSlide()
      else nextSlide()
    }
    touchStartX.current = null
    setIsPaused(false)
  }

  // ── GOOGLE REVIEWS — DISABLED (no Places API billing yet) ──────────────
  // const [googleReviews, setGoogleReviews] = useState(null)
  // const [googleReviewsLoading, setGoogleReviewsLoading] = useState(true)
  //
  // useEffect(() => {
  //   getGoogleReviews()
  //     .then((res) => {
  //       setGoogleReviews(res.data?.data || null)
  //     })
  //     .catch(() => {
  //       setGoogleReviews(null)
  //     })
  //     .finally(() => setGoogleReviewsLoading(false))
  // }, [])

  // ── Quick Search handler ─────────────────────────────────────────────
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

  // ── Helper: resolve vehicle image ────────────────────────────────────
  const getVehicleImage = (vehicle) => {
    return (
      vehicle?.images?.[0]?.url ||
      vehicle?.imageUrl ||
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200'
    )
  }

  // ── Current hero vehicle ─────────────────────────────────────────────
  const currentHeroVehicle = heroVehicles[currentSlide]

  return (
    <section className="space-y-10 page-content">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO (with vehicle carousel)
         ═══════════════════════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden rounded-2xl">
        {/* Dark automotive background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,0,0,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.05),transparent_50%)]" />
        </div>

        {/* Social media icons (left vertical) */}
        <div className="absolute z-20 flex-col hidden gap-3 -translate-y-1/2 md:flex left-5 top-1/2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Instagram"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Facebook"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-full bg-white/10 hover:bg-white/20"
            aria-label="TikTok"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-24 lg:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left: Title and minimal action */}
            <div className="space-y-6 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                Sacramento, California · Pre-Owned Vehicles
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  CarnexAutos
                </span>
                <br />
                Car Dealership
              </h1>
              <p className="max-w-lg mx-auto text-sm text-gray-300 sm:text-base lg:mx-0">
                Discover quality pre-owned vehicles with transparent pricing and
                exceptional service.
              </p>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link to="/inventory">
                  <Button
                    size="lg"
                    className="text-white bg-red-600 hover:bg-red-700"
                  >
                    Browse Inventory
                  </Button>
                </Link>
                <Link to="/financing">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-white border bg-white/10 border-white/30 hover:bg-white/20"
                  >
                    Apply for Financing
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Vehicle Carousel */}
            <div
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {heroLoading ? (
                <div className="flex items-center justify-center w-full h-64 bg-gray-800 sm:h-80 lg:h-96 rounded-xl animate-pulse">
                  <span className="text-gray-400">Loading vehicles...</span>
                </div>
              ) : heroError ? (
                <div className="flex items-center justify-center w-full h-64 bg-gray-800 sm:h-80 lg:h-96 rounded-xl">
                  <span className="text-gray-400">Unable to load vehicles</span>
                </div>
              ) : heroVehicles.length === 0 ? (
                <div className="flex items-center justify-center w-full h-64 bg-gray-800 sm:h-80 lg:h-96 rounded-xl">
                  <span className="text-gray-400">No vehicles available</span>
                </div>
              ) : (
                <div
                  className="relative h-64 overflow-hidden shadow-2xl cursor-pointer sm:h-80 lg:h-96 rounded-xl"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <Link
                    to={`/vehicles/${currentHeroVehicle._id || currentHeroVehicle.id}`}
                  >
                    <img
                      src={getVehicleImage(currentHeroVehicle)}
                      alt={currentHeroVehicle.title || 'Vehicle'}
                      className="object-cover w-full h-full transition-transform duration-500"
                    />
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Vehicle info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-left sm:p-5">
                      <p className="text-xs font-medium text-gray-300">
                        {currentHeroVehicle.year} {currentHeroVehicle.make}{' '}
                        {currentHeroVehicle.model}
                      </p>
                      <h3 className="text-xl font-bold text-white truncate sm:text-2xl">
                        {currentHeroVehicle.title}
                      </h3>
                      <p className="mt-1 text-lg font-extrabold text-red-400">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0
                        }).format(currentHeroVehicle.price || 0)}
                      </p>
                      <p className="text-xs font-bold text-white/90">
                        {DEALER_FEE_NOTE}
                      </p>
                    </div>
                  </Link>

                  {/* Carousel Controls */}
                  {heroVehicles.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          prevSlide()
                        }}
                        className="absolute flex items-center justify-center w-10 h-10 text-white transition-colors -translate-y-1/2 rounded-full left-3 top-1/2 bg-black/40 hover:bg-black/60"
                        aria-label="Previous vehicle"
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          nextSlide()
                        }}
                        className="absolute flex items-center justify-center w-10 h-10 text-white transition-colors -translate-y-1/2 rounded-full right-3 top-1/2 bg-black/40 hover:bg-black/60"
                        aria-label="Next vehicle"
                      >
                        ›
                      </button>

                      {/* Dots */}
                      <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
                        {heroVehicles.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              idx === currentSlide
                                ? 'bg-red-500 scale-125'
                                : 'bg-white/60 hover:bg-white'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile social icons */}
        <div className="flex justify-center gap-4 pb-8 md:hidden">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-white/10"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-white/10"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-white/10"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS BAR
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="card-surface !rounded-none border-t border-b border-brand-accent/20">
        <div className="grid grid-cols-2 divide-x md:grid-cols-4 divide-brand-border/10">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center min-w-0 px-6 py-6 text-center"
            >
              <div className="font-bold text-brand-accent leading-none whitespace-nowrap text-3xl xl:text-[2.5rem]">
                {s.num}
              </div>
              <div className="mt-1 text-xs font-medium tracking-widest uppercase text-brand-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          QUICK SEARCH (redesigned)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-section-title">Find Your Vehicle</h2>
          <p className="max-w-md text-xs text-body-muted sm:text-sm">
            Filter by make, body style, price, and year to quickly see what fits
            your needs.
          </p>
        </div>

        <form
          onSubmit={handleQuickSearch}
          className="p-4 bg-white border border-gray-200 shadow-lg card-surface sm:p-6 rounded-2xl"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Select
              id="qs-make"
              label="Make"
              options={makeOptions}
              value={filters.make}
              onChange={(e) => handleFilterChange('make', e.target.value)}
              className="w-full"
            />
            <Select
              id="qs-bodyType"
              label="Body Type"
              options={bodyTypeOptions}
              value={filters.bodyType}
              onChange={(e) => handleFilterChange('bodyType', e.target.value)}
              className="w-full"
            />
            <Input
              id="qs-maxPrice"
              label="Max Price (USD)"
              type="number"
              min="0"
              placeholder="e.g. 30000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full"
            />
            <Select
              id="qs-year"
              label="Min Year"
              options={yearOptions}
              value={filters.minYear}
              onChange={(e) => handleFilterChange('minYear', e.target.value)}
              className="w-full"
            />
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full text-white bg-red-600 lg:w-auto hover:bg-red-700"
              >
                Search →
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          INVENTORY (unchanged structure but integrated)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-brand-accent">
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
        ) : (latestVehicles || []).length === 0 ? (
          <div className="p-6 text-center card-surface">
            <p className="text-sm text-brand-muted">
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
            {(latestVehicles || []).map((vehicle) => (
              <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          READY TO DRIVE
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="p-3 space-y-2 text-center border-t-2 card-surface rounded-card sm:p-4 border-brand-accent">
        <h2 className="text-xl font-bold sm:text-2xl text-brand-secondary">
          Ready to drive home?
        </h2>
        <p className="max-w-lg mx-auto text-sm text-body-muted">
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
        <div className="grid items-center gap-8 p-6 lg:grid-cols-2 sm:p-8">
          <div className="space-y-5">
            <p className="text-xs font-semibold tracking-wide uppercase text-brand-accent">
              The Carnex Difference
            </p>
            <h2 className="text-section-title">
              Why Sacramento
              <br />
              chooses us
            </h2>
            <p className="text-sm text-body-muted">
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
                className="p-4 text-center bg-brand-surface"
              >
                <div className="text-2xl font-bold text-brand-accent">
                  {item.num}
                </div>
                <div className="mt-1 text-xs tracking-wider uppercase text-brand-muted">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          REVIEWS — GOOGLE REVIEWS DISABLED (no Places API billing yet).
          Re-enable by restoring this block plus the imports/state marked
          "GOOGLE REVIEWS — DISABLED" above.
         ═══════════════════════════════════════════════════════════════════ */}
      {/*
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-brand-accent">
              What Customers Say
            </p>
            <h2 className="text-section-title">Real reviews from Google</h2>
            {googleReviews?.rating != null && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-muted">
                <span className="font-semibold text-brand-secondary">
                  {googleReviews.rating.toFixed(1)}
                </span>
                <span className="text-yellow-400" aria-hidden="true">
                  {'★'.repeat(Math.round(googleReviews.rating))}
                </span>
                <span>
                  {googleReviews.totalRatings} Google review
                  {googleReviews.totalRatings !== 1 ? 's' : ''}
                </span>
              </p>
            )}
          </div>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            <Button>Write a Review</Button>
          </a>
        </div>

        {googleReviewsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : googleReviews?.reviews?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {googleReviews.reviews.map((review) => (
              <GoogleReviewCard key={review.time} review={review} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center card-surface">
            <p className="text-body-muted">
              Google reviews will appear here once connected.
            </p>
          </div>
        )}
      </section>
      */}

      {/* ═══════════════════════════════════════════════════════════════════
          LOCATION (Google Map + Address)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-brand-accent">
            Visit Us
          </p>
          <h2 className="text-section-title">Our Dealership</h2>
        </div>

        <a
          href="https://maps.app.goo.gl/oKgPzwuNp92o5LXv9?g_st=aw"
          target="_blank"
          rel="noopener noreferrer"
          className="relative block overflow-hidden transition-shadow cursor-pointer card-surface rounded-card hover:shadow-lg group"
          title="Open in Google Maps"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3121.991613756464!2d-121.40416640000001!3d38.51090429999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ac547a236add1%3A0xd1f4ba3921d232c!2sCarnex%20Auto%20Sales%20LLC!5e0!3m2!1sen!2s!4v1783188042575!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-64 pointer-events-none sm:h-80"
            title="Carnex Auto Sales LLC location"
          ></iframe>
          <div className="absolute inset-0 flex items-center justify-center transition-colors bg-black/0 group-hover:bg-black/10">
            <span className="px-4 py-2 text-sm font-medium text-white transition-opacity rounded-lg opacity-0 bg-black/70 group-hover:opacity-100">
              Open in Google Maps ↗
            </span>
          </div>
        </a>

        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <span className="text-brand-accent">📍</span>
          <a
            href="https://maps.app.goo.gl/oKgPzwuNp92o5LXv9?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-brand-primary underline-offset-2"
          >
            {DEALERSHIP.addressLine1}, {DEALERSHIP.addressLine2}
          </a>
        </div>

        <div className="pt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-brand-accent">
              Get In Touch
            </p>
            <h2 className="text-section-title">Contact Us</h2>
          </div>
          <div className="p-5 card-surface">
            <ContactForm />
          </div>
        </div>
      </section>
    </section>
  )
}
