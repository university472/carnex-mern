import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Gauge, Settings2 } from 'lucide-react'
import { DEALER_FEE_NOTE } from '../../constants'

const INSTAGRAM_URL = 'https://www.instagram.com/yourhandle'
const FACEBOOK_URL = 'https://www.facebook.com/yourpage'
const TIKTOK_URL = 'https://www.tiktok.com/@yourhandle'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200'

const SOCIALS = [
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'
  },
  {
    label: 'Facebook',
    href: FACEBOOK_URL,
    path: 'M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z'
  },
  {
    label: 'TikTok',
    href: TIKTOK_URL,
    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z'
  }
]

const pad = (n) => String(n).padStart(2, '0')

const fmtPrice = (price) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price || 0)

const getVehicleImage = (vehicle) =>
  vehicle?.images?.[0]?.url || vehicle?.imageUrl || FALLBACK_IMAGE

/**
 * Dark hero with the live inventory carousel. Vehicles come from the
 * database (passed in by Home) and rotate automatically every 5 seconds.
 */
export function HeroShowcase({ vehicles: heroVehicles, loading, error }) {
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

  useEffect(() => {
    if (!isPaused && heroVehicles.length > 1) {
      slideInterval.current = setInterval(nextSlide, 5000)
    }
    return () => clearInterval(slideInterval.current)
  }, [isPaused, nextSlide, heroVehicles.length])

  // Warm the next image so the transition doesn't flash
  useEffect(() => {
    if (heroVehicles.length < 2) return
    const next = heroVehicles[(currentSlide + 1) % heroVehicles.length]
    const img = new Image()
    img.src = getVehicleImage(next)
  }, [currentSlide, heroVehicles])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

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

  const currentHeroVehicle = heroVehicles[currentSlide]
  const hasVehicle = !loading && !error && !!currentHeroVehicle
  const vehicleId = currentHeroVehicle?._id || currentHeroVehicle?.id
  const total = heroVehicles.length

  return (
    <section className="relative overflow-hidden bg-grain text-white">
      <h1 className="sr-only">
        Welcome to CarnexAutos Car Dealership — quality pre-owned vehicles in
        Sacramento, California
      </h1>

      {/* Giant year watermark (Dribbble "2022") */}
      {hasVehicle && currentHeroVehicle.year && (
        <span
          key={`yr-${currentSlide}`}
          aria-hidden="true"
          className="text-outline pointer-events-none absolute left-1/2 top-8 hidden -translate-x-[15%] select-none font-display text-[13rem] font-extrabold leading-none animate-fade-in-up lg:block xl:text-[16rem]"
        >
          {currentHeroVehicle.year}
        </span>
      )}

      {/* Social rail (left) */}
      <div className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex xl:left-6">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-brand-primary hover:text-white"
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
              <path d={s.path} />
            </svg>
          </a>
        ))}
        <span className="mt-2 h-14 w-px bg-white/20" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 [writing-mode:vertical-rl] rotate-180">
          Follow us
        </span>
      </div>

      {/* Slide counter rail (right) */}
      {hasVehicle && total > 1 && (
        <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 xl:right-6 xl:flex">
          <span className="font-display text-sm font-semibold">
            {pad(currentSlide + 1)}
          </span>
          <span className="relative h-32 w-px overflow-hidden bg-white/15">
            <span
              className="absolute inset-x-0 top-0 bg-brand-primary transition-[height] duration-500"
              style={{ height: `${((currentSlide + 1) / total) * 100}%` }}
            />
          </span>
          <span className="font-display text-sm text-gray-500">{pad(total)}</span>
        </div>
      )}

      <div className="container relative z-10 pb-36 pt-10 sm:pb-40 sm:pt-14 lg:pb-44 lg:pt-16 md:px-16 xl:px-20">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr),minmax(0,1.25fr)] lg:gap-6">
          {/* Left: copy */}
          <div
            key={`copy-${hasVehicle ? currentSlide : 'static'}`}
            className="order-2 space-y-5 text-center animate-fade-in-up lg:order-1 lg:text-left"
          >
            <p className="eyebrow justify-center lg:justify-start">
              Welcome to CarnexAutos
            </p>

            {hasVehicle ? (
              <>
                <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">
                  {currentHeroVehicle.title ||
                    `${currentHeroVehicle.year} ${currentHeroVehicle.make} ${currentHeroVehicle.model}`}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-400 lg:justify-start">
                  <span>
                    {currentHeroVehicle.year} {currentHeroVehicle.make}{' '}
                    {currentHeroVehicle.model}
                  </span>
                  {currentHeroVehicle.mileage > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Gauge className="h-4 w-4 text-brand-primary" />
                      {new Intl.NumberFormat('en-US').format(
                        currentHeroVehicle.mileage
                      )}{' '}
                      mi
                    </span>
                  )}
                  {currentHeroVehicle.transmission && (
                    <span className="flex items-center gap-1.5">
                      <Settings2 className="h-4 w-4 text-brand-primary" />
                      {currentHeroVehicle.transmission}
                    </span>
                  )}
                </div>
                <p className="font-display text-3xl font-bold text-brand-primary">
                  {fmtPrice(currentHeroVehicle.price)}
                </p>
                <p className="-mt-1 text-sm font-bold text-white/90">
                  {DEALER_FEE_NOTE}
                </p>
              </>
            ) : (
              <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Welcome to{' '}
                <span className="text-brand-primary">CarnexAutos</span>
                <br />
                Car Dealership
              </h2>
            )}

            <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-400 sm:text-base lg:mx-0">
              Discover quality pre-owned vehicles with transparent pricing and
              exceptional service.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 lg:justify-start">
              <Link
                to="/inventory"
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(220,38,38,0.7)] transition-all hover:-translate-y-0.5 hover:bg-brand-primaryHover"
              >
                Browse Inventory
              </Link>
              <Link
                to="/financing"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Apply for Financing
              </Link>
            </div>

            {hasVehicle && (
              <Link
                to={`/vehicles/${vehicleId}`}
                className="group inline-flex items-center gap-3 pt-2 text-sm font-semibold text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
                Explore this vehicle
              </Link>
            )}
          </div>

          {/* Right: live vehicle carousel */}
          <div
            className="relative order-1 lg:order-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {loading ? (
              <div className="flex aspect-[16/10] w-full items-center justify-center rounded-3xl bg-white/5 animate-pulse">
                <span className="text-gray-400">Loading vehicles...</span>
              </div>
            ) : error ? (
              <div className="flex aspect-[16/10] w-full items-center justify-center rounded-3xl bg-white/5">
                <span className="text-gray-400">Unable to load vehicles</span>
              </div>
            ) : heroVehicles.length === 0 ? (
              <div className="flex aspect-[16/10] w-full items-center justify-center rounded-3xl bg-white/5">
                <span className="text-gray-400">No vehicles available</span>
              </div>
            ) : (
              <div
                className="relative"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* red glow under the car */}
                <div className="pointer-events-none absolute inset-x-[10%] bottom-2 h-16 rounded-[100%] bg-brand-primary/40 blur-3xl" />

                <Link
                  to={`/vehicles/${vehicleId}`}
                  className="relative block cursor-pointer"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl [mask-image:radial-gradient(ellipse_85%_85%_at_55%_50%,black_62%,transparent_100%)]">
                    <img
                      key={vehicleId || currentSlide}
                      src={getVehicleImage(currentHeroVehicle)}
                      alt={currentHeroVehicle.title || 'Vehicle'}
                      className="h-full w-full object-cover animate-hero-in"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE
                      }}
                    />
                  </div>
                </Link>

                {/* Carousel Controls */}
                {heroVehicles.length > 1 && (
                  <div className="relative mt-5 flex items-center justify-center gap-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        prevSlide()
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-primary hover:bg-brand-primary"
                      aria-label="Previous vehicle"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Dots */}
                    <div className="flex max-w-[60vw] flex-wrap items-center justify-center gap-2 sm:max-w-xs">
                      {heroVehicles.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`rounded-full transition-all ${
                            idx === currentSlide
                              ? 'h-3 w-3 bg-brand-primary ring-4 ring-brand-primary/25'
                              : 'h-2 w-2 bg-white/40 hover:bg-white'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        nextSlide()
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-primary hover:bg-brand-primary"
                      aria-label="Next vehicle"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile social icons */}
        <div className="mt-8 flex justify-center gap-3 md:hidden">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
