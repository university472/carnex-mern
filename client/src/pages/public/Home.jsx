// // client/src/pages/public/Home.jsx
// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { DEALERSHIP, BUSINESS_HOURS } from '../../constants'
// import { Button } from '../../components/ui/Button'
// import { Input } from '../../components/ui/Input'
// import { Select } from '../../components/ui/Select'
// import { Badge } from '../../components/ui/Badge'
// import { VehicleCard } from '../../components/vehicles/VehicleCard'
// import { SkeletonCard } from '../../components/ui/Skeleton'
// import { useFeaturedVehicles, useLatestVehicles } from '../../hooks/useVehicles'

// const makeOptions = [
//   { label: 'Any Make', value: '' },
//   { label: 'Toyota', value: 'Toyota' },
//   { label: 'Honda', value: 'Honda' },
//   { label: 'Chevrolet', value: 'Chevrolet' },
//   { label: 'Ford', value: 'Ford' }
// ]

// const bodyTypeOptions = [
//   { label: 'Any Body Type', value: '' },
//   { label: 'Sedan', value: 'Sedan' },
//   { label: 'SUV', value: 'SUV' },
//   { label: 'Truck', value: 'Truck' },
//   { label: 'Coupe', value: 'Coupe' }
// ]

// const yearOptions = [
//   { label: 'Any Year', value: '' },
//   { label: '2024 & Newer', value: '2024' },
//   { label: '2022+', value: '2022' },
//   { label: '2020+', value: '2020' },
//   { label: '2018+', value: '2018' }
// ]

// export function Home() {
//   const navigate = useNavigate()
//   const [filters, setFilters] = useState({
//     make: '',
//     bodyType: '',
//     maxPrice: '',
//     minYear: ''
//   })

//   const { vehicles: featuredVehicles, loading: featuredLoading } =
//     useFeaturedVehicles(3)
//   const { vehicles: latestVehicles, loading: latestLoading } =
//     useLatestVehicles(3)

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleQuickSearch = (event) => {
//     event.preventDefault()
//     const params = new URLSearchParams()
//     if (filters.make) params.set('make', filters.make)
//     if (filters.bodyType) params.set('bodyType', filters.bodyType)
//     if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
//     if (filters.minYear) params.set('minYear', filters.minYear)
//     navigate(`/inventory?${params.toString()}`)
//   }

//   return (
//     <section className="page-content space-y-10">
//       {/* ── Hero ───────────────────────────────────────────────── */}
//       <motion.header
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, ease: 'easeOut' }}
//         className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] items-center"
//       >
//         <div className="space-y-5">
//           <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
//             Sacramento, California • Pre-Owned Vehicles
//           </p>

//           <h1 className="text-hero-title">
//             Find your next car at Carnex Auto Sales.
//           </h1>

//           <p className="text-body-muted max-w-xl text-sm sm:text-base">
//             The easiest car buying experience you&apos;ve had – no pressure,
//             straightforward pricing, and financing handled in‑house so you can
//             drive home confident.
//           </p>

//           <div className="flex flex-wrap gap-3">
//             <Link to="/inventory">
//               <Button size="lg">Browse Inventory</Button>
//             </Link>
//             <Link to="/financing">
//               <Button
//                 size="lg"
//                 variant="secondary"
//                 className="flex items-center gap-2"
//               >
//                 Apply for Financing
//                 <span className="text-xs opacity-80">
//                   Get pre‑qualified online
//                 </span>
//               </Button>
//             </Link>
//           </div>

//           <div className="flex flex-wrap gap-2 pt-2 text-xs text-brand-muted">
//             <Badge variant="success">No Pressure Sales</Badge>
//             <Badge variant="accent">Trade‑In Welcome</Badge>
//             <Badge variant="default">Local Sacramento Dealership</Badge>
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, scale: 0.98 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
//           className="relative"
//         >
//           <div className="card-surface overflow-hidden">
//             <img
//               src="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200"
//               alt="Carnex Auto Sales lot in Sacramento"
//               className="h-64 w-full object-cover sm:h-72 lg:h-80"
//               loading="lazy"
//             />
//           </div>
//           <div className="absolute inset-x-4 bottom-4 rounded-md bg-black/65 p-3 text-xs text-gray-100 shadow-card">
//             <p className="font-semibold">
//               Sacramento, CA • Pre‑Owned Cars, SUVs, and Trucks
//             </p>
//             <p>
//               Trade‑ins accepted, financing available, inspections completed on
//               every vehicle.
//             </p>
//           </div>
//         </motion.div>
//       </motion.header>

//       {/* ── Quick Search ───────────────────────────────────────── */}
//       <section className="space-y-4">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <h2 className="text-section-title">Quick Search Inventory</h2>
//           <p className="text-body-muted text-xs sm:text-sm max-w-md">
//             Filter by make, body style, price, and year to quickly narrow down
//             vehicles that fit your budget and lifestyle.
//           </p>
//         </div>

//         <form
//           onSubmit={handleQuickSearch}
//           className="card-surface grid gap-4 p-4 sm:p-5 sm:grid-cols-2 lg:grid-cols-4"
//         >
//           <Select
//             id="qs-make"
//             label="Make"
//             options={makeOptions}
//             value={filters.make}
//             onChange={(e) => handleFilterChange('make', e.target.value)}
//           />
//           <Select
//             id="qs-bodyType"
//             label="Body Type"
//             options={bodyTypeOptions}
//             value={filters.bodyType}
//             onChange={(e) => handleFilterChange('bodyType', e.target.value)}
//           />
//           <Input
//             id="qs-maxPrice"
//             label="Max Price (USD)"
//             type="number"
//             min="0"
//             placeholder="e.g. 30000"
//             value={filters.maxPrice}
//             onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
//           />
//           <Select
//             id="qs-year"
//             label="Minimum Year"
//             options={yearOptions}
//             value={filters.minYear}
//             onChange={(e) => handleFilterChange('minYear', e.target.value)}
//           />

//           <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center justify-between gap-3 pt-1">
//             <p className="text-[11px] text-brand-muted">
//               Tip: getting pre‑approved before visiting the lot helps you move
//               faster and understand your budget clearly.
//             </p>
//             <Button type="submit" size="md" className="px-6">
//               Search Inventory
//             </Button>
//           </div>
//         </form>
//       </section>

//       {/* ── Featured Vehicles ──────────────────────────────────── */}
//       <section className="space-y-4">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <h2 className="text-section-title">Featured Vehicles</h2>
//           <Link
//             to="/inventory"
//             className="text-xs font-medium text-brand-primary hover:underline"
//           >
//             View all vehicles
//           </Link>
//         </div>

//         {featuredLoading ? (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         ) : featuredVehicles.length === 0 ? (
//           <div className="card-surface p-6 text-center">
//             <p className="text-brand-muted text-sm">
//               No featured vehicles at the moment.{' '}
//               <Link
//                 to="/inventory"
//                 className="text-brand-primary hover:underline"
//               >
//                 Browse all inventory
//               </Link>
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {featuredVehicles.map((vehicle) => (
//               <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ── Why Choose Carnex ─────────────────────────────────── */}
//       <section className="space-y-4">
//         <h2 className="text-section-title">Why Choose Carnex Auto Sales</h2>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <div className="card-surface p-4 space-y-2">
//             <h3 className="text-card-title">Transparent Pricing</h3>
//             <p className="text-body-muted text-sm">
//               Straightforward pricing with no hidden dealer add‑ons or surprise
//               fees. What you see is what you pay.
//             </p>
//           </div>
//           <div className="card-surface p-4 space-y-2">
//             <h3 className="text-card-title">Local Sacramento Focus</h3>
//             <p className="text-body-muted text-sm">
//               We serve drivers across Sacramento and Northern California with
//               vehicles suited for U.S. highways, commuting, and weekend trips.
//             </p>
//           </div>
//           <div className="card-surface p-4 space-y-2">
//             <h3 className="text-card-title">Financing & Trade‑Ins</h3>
//             <p className="text-body-muted text-sm">
//               On‑site financing and competitive trade‑in valuations so you can
//               upgrade vehicles with confidence.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ── Financing & Trade-In CTAs ─────────────────────────── */}
//       <section className="grid gap-4 lg:grid-cols-2">
//         <div className="card-surface p-5 space-y-3">
//           <h2 className="text-section-title">Get Pre‑Approved for Financing</h2>
//           <p className="text-body-muted text-sm">
//             Understanding your credit and getting pre‑approved is the smartest
//             first step to buying a car. Start your application online, then
//             finalize at the dealership.
//           </p>
//           <div className="flex flex-wrap gap-3">
//             <Link to="/financing">
//               <Button size="md">Apply for Financing</Button>
//             </Link>
//             <Link to="/contact">
//               <Button size="md" variant="ghost">
//                 Ask a financing question
//               </Button>
//             </Link>
//           </div>
//         </div>

//         <div className="card-surface p-5 space-y-3">
//           <h2 className="text-section-title">Value Your Trade‑In</h2>
//           <p className="text-body-muted text-sm">
//             Thinking of upgrading? Share details about your current vehicle to
//             see what it&apos;s worth in today&apos;s U.S. market and how it can
//             reduce your new payment.
//           </p>
//           <div className="flex flex-wrap gap-3">
//             <Link to="/trade-in">
//               <Button size="md" variant="secondary">
//                 Start Trade‑In Request
//               </Button>
//             </Link>
//             <Link to="/test-drive">
//               <Button size="md" variant="ghost">
//                 Book a test drive instead
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── Testimonials ──────────────────────────────────────── */}
//       <section className="space-y-4">
//         <h2 className="text-section-title">Customer Testimonials</h2>
//         <div className="grid gap-4 lg:grid-cols-3">
//           <div className="card-surface p-4 space-y-2 text-sm">
//             <p className="text-body-muted italic">
//               &quot;The easiest car buying experience I&apos;ve ever had. No
//               pressure, great pricing, and they handled all my financing
//               seamlessly.&quot;
//             </p>
//             <p className="text-xs text-brand-muted">
//               — U.S. customer, Sacramento
//             </p>
//           </div>
//           <div className="card-surface p-4 space-y-2 text-sm">
//             <p className="text-body-muted italic">
//               &quot;Traded in my old sedan and got an incredible value. The team
//               at Carnex is honest and straightforward. Highly recommended!&quot;
//             </p>
//             <p className="text-xs text-brand-muted">
//               — Trade‑in client from Elk Grove
//             </p>
//           </div>
//           <div className="card-surface p-4 space-y-2 text-sm">
//             <p className="text-body-muted italic">
//               &quot;Found the exact truck I needed. The vehicle was detailed and
//               ran great during the test drive.&quot;
//             </p>
//             <p className="text-xs text-brand-muted">
//               — Silverado owner in Rancho Cordova
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ── Latest Inventory ──────────────────────────────────── */}
//       <section className="space-y-4">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <h2 className="text-section-title">Latest Inventory</h2>
//           <Link
//             to="/inventory"
//             className="text-xs font-medium text-brand-primary hover:underline"
//           >
//             View all vehicles
//           </Link>
//         </div>

//         {latestLoading ? (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         ) : latestVehicles.length === 0 ? (
//           <div className="card-surface p-6 text-center">
//             <p className="text-brand-muted text-sm">
//               No vehicles in inventory yet.{' '}
//               <Link
//                 to="/contact"
//                 className="text-brand-primary hover:underline"
//               >
//                 Contact us
//               </Link>{' '}
//               to enquire about upcoming stock.
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {latestVehicles.map((vehicle) => (
//               <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ── Our Story ─────────────────────────────────────────── */}
//       <section className="space-y-4">
//         <h2 className="text-section-title">Our Story</h2>
//         <div className="card-surface p-6 space-y-3">
//           <p className="text-body-muted text-sm">
//             Founded with the goal of making used‑car buying straightforward and
//             stress‑free, Carnex Auto Sales has built its reputation on honesty,
//             quality inventory, and personalised service.
//           </p>
//           <p className="text-body-muted text-sm">
//             From first‑time buyers to seasoned enthusiasts, we take the time to
//             understand your needs, budget, and preferences. Our team guides you
//             through inventory, financing options, trade‑ins, and test drives so
//             you can make confident decisions at every step.
//           </p>
//           <p className="text-body-muted text-sm">
//             Located in the heart of Sacramento, we serve drivers from across the
//             region who want a professional, premium experience without the
//             pressure and confusion often associated with traditional
//             dealerships.
//           </p>
//         </div>
//       </section>

//       {/* ── Visit & Business Hours ────────────────────────────── */}
//       <section className="grid gap-6 sm:grid-cols-2">
//         <div className="card-surface p-5 space-y-3">
//           <h2 className="text-card-title">Visit Our Showroom</h2>
//           <p className="text-body-muted text-sm">
//             Stop by during business hours to see vehicles in person, take test
//             drives, and discuss financing or trade‑in options with our team.
//           </p>
//           <div className="text-sm text-brand-secondary">
//             <p className="font-medium">Address:</p>
//             <p>
//               {DEALERSHIP.addressLine1}
//               <br />
//               {DEALERSHIP.addressLine2}
//             </p>
//           </div>
//           <div className="text-sm text-brand-secondary">
//             <p className="font-medium">Phone:</p>
//             <a
//               href={`tel:${DEALERSHIP.phone}`}
//               className="hover:text-brand-primary"
//             >
//               {DEALERSHIP.phone}
//             </a>
//           </div>
//           <div className="text-sm text-brand-secondary">
//             <p className="font-medium">Email:</p>
//             <a
//               href={`mailto:${DEALERSHIP.email}`}
//               className="hover:text-brand-primary break-all"
//             >
//               {DEALERSHIP.email}
//             </a>
//           </div>
//         </div>

//         <div className="card-surface p-5 space-y-3">
//           <h2 className="text-card-title">Business Hours</h2>
//           <ul className="space-y-2 text-sm">
//             {BUSINESS_HOURS.map((h) => (
//               <li
//                 key={h.day}
//                 className="flex justify-between border-b border-brand-border pb-2 last:border-b-0"
//               >
//                 <span className="text-brand-muted">{h.day}</span>
//                 <span className="font-medium text-brand-secondary">
//                   {h.hours}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* ── Final CTA Banner ──────────────────────────────────── */}
//       <div className="bg-brand-secondary rounded-card p-6 text-center text-white space-y-3">
//         <h2 className="text-2xl font-bold">Ready to Find Your Next Car?</h2>
//         <p className="text-gray-200 max-w-xl mx-auto">
//           Browse our latest inventory or get in touch – we&apos;re here to help.
//         </p>
//         <div className="flex flex-wrap items-center justify-center gap-3">
//           <Link to="/inventory">
//             <Button variant="primary" size="lg">
//               View Inventory
//             </Button>
//           </Link>
//           <Link to="/contact">
//             <Button variant="secondary" size="lg">
//               Contact Us
//             </Button>
//           </Link>
//           <a href={`tel:${DEALERSHIP.phone}`}>
//             <Button variant="ghost" size="lg">
//               Call {DEALERSHIP.phone}
//             </Button>
//           </a>
//         </div>
//       </div>
//     </section>
//   )
// }

/// client/src/pages/public/Home.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEALERSHIP, BUSINESS_HOURS } from '../../constants'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { VehicleCard } from '../../components/vehicles/VehicleCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useFeaturedVehicles, useLatestVehicles } from '../../hooks/useVehicles'

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
  { num: 'In-House', label: 'Financing Available' }
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

const TESTIMONIALS = [
  {
    text: "Easiest car buying experience I've had. No pressure at all — they showed me options in my budget and we wrapped up financing the same afternoon.",
    name: 'D. Martin, Sacramento'
  },
  {
    text: 'Got a fair trade-in on my old sedan and drove off in a CR-V the same day. The team was honest and the price was exactly what was listed online.',
    name: 'R. Patel, Elk Grove'
  },
  {
    text: "Found the F-150 I'd been looking for. Detailed, inspected, and ran perfectly on the test drive. I'll be back when it's time for my wife's car.",
    name: 'T. Williams, Rancho Cordova'
  }
]

export function Home() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    make: '',
    bodyType: '',
    maxPrice: '',
    minYear: ''
  })

  const { vehicles: featuredVehicles, loading: featuredLoading } =
    useFeaturedVehicles(3)
  const { vehicles: latestVehicles, loading: latestLoading } =
    useLatestVehicles(3)

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
      {/* ── Hero ───────────────────────────────────────────────── */}
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

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <div className="card-surface !rounded-none border-t border-b border-brand-accent/20">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-border/10">
          {STATS.map((s) => (
            <div key={s.label} className="py-6 px-4 text-center">
              <div className="text-3xl font-bold text-brand-accent leading-none">
                {s.num}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-widest text-brand-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Search ───────────────────────────────────────── */}
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

      {/* ── Featured Vehicles ──────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
              Hand‑Picked
            </p>
            <h2 className="text-section-title">Featured Vehicles</h2>
          </div>
          <Link
            to="/inventory"
            className="text-xs font-medium text-brand-primary hover:underline"
          >
            View All Inventory
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featuredVehicles.length === 0 ? (
          <div className="card-surface p-6 text-center">
            <p className="text-brand-muted text-sm">
              No featured vehicles at the moment.{' '}
              <Link
                to="/inventory"
                className="text-brand-primary hover:underline"
              >
                Browse all inventory
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* ── Why Carnex / Trust Section ────────────────────────── */}
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

      {/* ── Latest Inventory ──────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
              Fresh Stock
            </p>
            <h2 className="text-section-title">Latest Inventory</h2>
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

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
            What Customers Say
          </p>
          <h2 className="text-section-title">Real reviews from real buyers</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="card-surface p-5 relative before:content-['\201C'] before:font-serif before:text-6xl before:text-brand-accent/15 before:absolute before:top-2 before:left-4 before:leading-none"
            >
              <div className="text-brand-accent text-sm tracking-widest mb-2">
                ★★★★★
              </div>
              <p className="text-body-muted text-sm italic pt-6 mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Info Bar ──────────────────────────────────── */}
      <div className="card-surface !rounded-none border-t border-b border-brand-accent/20 p-5 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 border border-brand-accent/30 flex items-center justify-center text-brand-accent text-lg">
            📍
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-brand-muted">
              Visit Us
            </p>
            <p className="text-sm font-medium text-brand-secondary">
              {DEALERSHIP.addressLine1}, {DEALERSHIP.addressLine2}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-9 h-9 border border-brand-accent/30 flex items-center justify-center text-brand-accent text-lg">
            📞
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-brand-muted">
              Call Us
            </p>
            <a
              href={`tel:${DEALERSHIP.phone}`}
              className="text-sm font-medium text-brand-secondary hover:text-brand-primary"
            >
              {DEALERSHIP.phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-9 h-9 border border-brand-accent/30 flex items-center justify-center text-brand-accent text-lg">
            🕐
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-brand-muted">
              Hours
            </p>
            {BUSINESS_HOURS.slice(0, 1).map((h) => (
              <p
                key={h.day}
                className="text-sm font-medium text-brand-secondary"
              >
                {h.day}: {h.hours}
              </p>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-9 h-9 border border-brand-accent/30 flex items-center justify-center text-brand-accent text-lg">
            ✉️
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-brand-muted">
              Email
            </p>
            <a
              href={`mailto:${DEALERSHIP.email}`}
              className="text-sm font-medium text-brand-secondary hover:text-brand-primary break-all"
            >
              {DEALERSHIP.email}
            </a>
          </div>
        </div>
      </div>

      {/* ── Final CTA Banner ──────────────────────────────────── */}
      <div className="bg-brand-secondary rounded-card p-6 text-center text-white space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          Ready to Drive?
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold">
          Your next car is
          <br />
          waiting at Carnex.
        </h2>
        <p className="text-gray-200 max-w-xl mx-auto text-sm">
          Browse our inventory, get pre-approved online, or stop by the lot.
          We&apos;re here to make it easy.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/inventory">
            <Button size="lg">View Inventory</Button>
          </Link>
          <Link to="/financing">
            <Button size="lg" variant="secondary">
              Apply for Financing
            </Button>
          </Link>
          <Link to="/test-drive">
            {/* 👇 Text color now forced to white for visibility on dark background */}
            <Button
              size="lg"
              variant="ghost"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Book a Test Drive
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Footer Strip ──────────────────────────────────────── */}
      {/* <div className="bg-brand-secondary/50 border-t border-brand-border/10 py-4 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-muted">
        <p>
          © {new Date().getFullYear()} Carnex Auto Sales. Sacramento,
          California. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-brand-primary">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-brand-primary">
            Contact
          </Link>
        </div>
      </div> */}
    </section>
  )
}
