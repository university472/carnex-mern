// // client/src/pages/public/Home.jsx
// import { useState, useEffect } from 'react'
// import { ContactForm } from '../../components/forms/ContactForm'
// import { Link, useNavigate } from 'react-router-dom'
// import { DEALERSHIP, BUSINESS_HOURS } from '../../constants'
// import { Button } from '../../components/ui/Button'
// import { Input } from '../../components/ui/Input'
// import { Select } from '../../components/ui/Select'
// import { Badge } from '../../components/ui/Badge'
// import { VehicleCard } from '../../components/vehicles/VehicleCard'
// import { SkeletonCard } from '../../components/ui/Skeleton'
// import { useLatestVehicles } from '../../hooks/useVehicles'
// import { getApprovedReviews } from '../../services/reviewService'
// import { ReviewCard } from '../../components/reviews/ReviewCard'
// import { ReviewForm } from '../../components/reviews/ReviewForm'

// // ---------------------------------------------------------------------------
// // Static data (some arrays will be replaced with dynamic data from API)
// // ---------------------------------------------------------------------------

// const yearOptions = [
//   { label: 'Any Year', value: '' },
//   { label: '2024+', value: '2024' },
//   { label: '2022+', value: '2022' },
//   { label: '2020+', value: '2020' },
//   { label: '2018+', value: '2018' }
// ]

// const STATS = [
//   { num: '500+', label: 'Vehicles Sold' },
//   { num: '4.9★', label: 'Customer Rating' },
//   { num: '100%', label: 'Inspected' },
//   { num: 'Trusted', label: 'Reputable Financing' }
// ]

// const TRUST_ITEMS = [
//   { num: '$0', label: 'Hidden dealer fees' },
//   { num: '150+', label: 'Point inspection' },
//   { num: 'Same', label: 'Day financing approval' },
//   { num: 'Fair', label: 'Trade-in valuations' }
// ]

// const TRUST_PILLS = [
//   'Transparent Pricing',
//   'No Hidden Fees',
//   'Trade-Ins Welcome',
//   'In-House Financing',
//   'Vehicle Inspections'
// ]

// const REVIEWS = [
//   {
//     name: 'D. Martin',
//     location: 'Sacramento',
//     date: '2 weeks ago',
//     rating: 5,
//     text: "Easiest car buying experience I've had. No pressure at all — they showed me options in my budget and we wrapped up financing the same afternoon.",
//     vehicle: 'Honda CR-V',
//     initials: 'DM'
//   },
//   {
//     name: 'R. Patel',
//     location: 'Elk Grove',
//     date: '1 month ago',
//     rating: 5,
//     text: 'Got a fair trade-in on my old sedan and drove off in a CR-V the same day. The team was honest and the price was exactly what was listed online.',
//     vehicle: 'Honda CR-V',
//     initials: 'RP'
//   },
//   {
//     name: 'T. Williams',
//     location: 'Rancho Cordova',
//     date: '3 weeks ago',
//     rating: 5,
//     text: "Found the F-150 I'd been looking for. Detailed, inspected, and ran perfectly on the test drive. I'll be back when it's time for my wife's car.",
//     vehicle: 'Ford F-150',
//     initials: 'TW'
//   }
// ]

// // ---------------------------------------------------------------------------
// // Home page component
// // ---------------------------------------------------------------------------

// export function Home() {
//   const navigate = useNavigate()

//   const [filters, setFilters] = useState({
//     make: '',
//     bodyType: '',
//     maxPrice: '',
//     minYear: ''
//   })

//   // ============================================================
//   // 🔄 NEW: state to hold filter options fetched from API
//   // ============================================================
//   const [filterOptions, setFilterOptions] = useState({
//     makes: [],
//     bodyTypes: [],
//     fuelTypes: [],
//     transmissions: []
//   })

//   // ============================================================
//   // 🔄 NEW: useEffect – fetch filter options on mount
//   // Runs once when component mounts; populates the dropdowns
//   // ============================================================
//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/vehicles/filters`
//         )
//         const data = await res.json()
//         // Expected response shape: { makes: [], bodyTypes: [], fuelTypes: [], transmissions: [] }
//         setFilterOptions(data)
//       } catch (err) {
//         console.error('Failed to load filter options', err)
//       }
//     }
//     fetchFilters()
//   }, [])

//   // ============================================================
//   // 🔄 NEW: dynamic arrays built from API data (replaces old static arrays)
//   // ============================================================
//   const makeOptions = [
//     { label: 'Any Make', value: '' },
//     ...(filterOptions.makes || []).map((m) => ({ label: m, value: m }))
//   ]

//   const bodyTypeOptions = [
//     { label: 'Any Type', value: '' },
//     ...(filterOptions.bodyTypes || []).map((b) => ({ label: b, value: b }))
//   ]

//   // (optional) fuel & transmission options ready if ever needed in quick search
//   const fuelOptions = [
//     { label: 'Any Fuel', value: '' },
//     ...(filterOptions.fuelTypes || []).map((f) => ({ label: f, value: f }))
//   ]

//   const transmissionOptions = [
//     { label: 'Any Transmission', value: '' },
//     ...(filterOptions.transmissions || []).map((t) => ({ label: t, value: t }))
//   ]

//   const { vehicles: latestVehicles, loading: latestLoading } =
//     useLatestVehicles(3)

//   // ── dynamic reviews ──────────────────────────────────────────────────
//   const [reviews, setReviews] = useState([])
//   const [reviewModalOpen, setReviewModalOpen] = useState(false)

//   const fetchReviews = () => {
//     getApprovedReviews()
//       .then((res) => {
//         setReviews(res.data?.data || [])
//       })
//       .catch(() => {
//         setReviews([])
//       })
//   }

//   useEffect(() => {
//     fetchReviews()
//   }, [])

//   // ── handlers ──────────────────────────────────────────────────────────
//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleQuickSearch = (e) => {
//     e.preventDefault()
//     const params = new URLSearchParams()
//     if (filters.make) params.set('make', filters.make)
//     if (filters.bodyType) params.set('bodyType', filters.bodyType)
//     if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
//     if (filters.minYear) params.set('minYear', filters.minYear)
//     navigate(`/inventory?${params.toString()}`)
//   }

//   return (
//     <section className="page-content space-y-10">
//       {/* ═══════════════════════════════════════════════════════════════════
//           HERO
//          ═══════════════════════════════════════════════════════════════════ */}
//       <header className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] items-center">
//         <div className="space-y-5">
//           <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
//             Sacramento, California · Pre-Owned Vehicles
//           </p>
//           <h1 className="text-hero-title">
//             Drive home
//             <br />
//             in the car you
//             <br />
//             <em className="not-italic relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-brand-accent">
//               deserve.
//             </em>
//           </h1>
//           <p className="text-body-muted max-w-xl text-sm sm:text-base">
//             No-pressure sales, transparent pricing, and in-house financing — so
//             you leave confident every time.
//           </p>
//           <div className="flex flex-wrap gap-3">
//             <Link to="/inventory">
//               <Button size="lg">Browse Inventory</Button>
//             </Link>
//             <Link to="/financing">
//               <Button size="lg" variant="secondary">
//                 Apply for Financing
//               </Button>
//             </Link>
//           </div>
//         </div>

//         <div className="relative">
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
//               Sacramento&apos;s Premier Pre-Owned Dealership
//             </p>
//             <p>
//               Trade-ins accepted · Financing available · All vehicles inspected
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* ═══════════════════════════════════════════════════════════════════
//           STATS BAR
//          ═══════════════════════════════════════════════════════════════════ */}
//       <div className="card-surface !rounded-none border-t border-b border-brand-accent/20">
//         <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-border/10">
//           {STATS.map((s) => (
//             <div
//               key={s.label}
//               className="py-6 px-6 text-center flex flex-col items-center justify-center min-w-0"
//             >
//               <div className="font-bold text-brand-accent leading-none whitespace-nowrap text-3xl xl:text-[2.5rem]">
//                 {s.num}
//               </div>
//               <div className="mt-1 text-xs font-medium uppercase tracking-widest text-brand-muted">
//                 {s.label}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════════
//           QUICK SEARCH
//          ═══════════════════════════════════════════════════════════════════ */}
//       <section className="space-y-4">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <h2 className="text-section-title">Find Your Vehicle</h2>
//           <p className="text-body-muted text-xs sm:text-sm max-w-md">
//             Filter by make, body style, price, and year to quickly see what fits
//             your needs.
//           </p>
//         </div>

//         <form
//           onSubmit={handleQuickSearch}
//           className="card-surface grid gap-4 p-4 sm:p-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
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
//             label="Min Year"
//             options={yearOptions}
//             value={filters.minYear}
//             onChange={(e) => handleFilterChange('minYear', e.target.value)}
//           />
//           <div className="flex items-end">
//             <Button type="submit" className="w-full lg:w-auto">
//               Search →
//             </Button>
//           </div>
//         </form>
//       </section>

//       {/* ═══════════════════════════════════════════════════════════════════
//           INVENTORY
//          ═══════════════════════════════════════════════════════════════════ */}
//       <section className="space-y-4">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
//               Current Stock
//             </p>
//             <h2 className="text-section-title">Inventory</h2>
//           </div>
//           <Link
//             to="/inventory"
//             className="text-xs font-medium text-brand-primary hover:underline"
//           >
//             View All Inventory
//           </Link>
//         </div>

//         {latestLoading ? (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         ) : (latestVehicles || []).length === 0 ? (
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
//             {(latestVehicles || []).map((vehicle) => (
//               <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ═══════════════════════════════════════════════════════════════════
//           READY TO DRIVE
//          ═══════════════════════════════════════════════════════════════════ */}
//       <div className="card-surface rounded-card p-3 sm:p-4 text-center space-y-2 border-t-2 border-brand-accent">
//         <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
//           Ready to drive home?
//         </h2>
//         <p className="text-body-muted text-sm max-w-lg mx-auto">
//           Browse our inventory, get pre‑approved online, or stop by the lot.
//         </p>
//         <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
//           <Link to="/inventory">
//             <Button size="sm">View Inventory</Button>
//           </Link>
//           <Link to="/financing">
//             <Button size="sm" variant="secondary">
//               Apply for Financing
//             </Button>
//           </Link>
//           <Link to="/test-drive">
//             <Button
//               size="sm"
//               variant="ghost"
//               className="text-white border-white/30 hover:bg-white/10"
//             >
//               Book a Test Drive
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════════
//           WHY CARNEX / TRUST SECTION
//          ═══════════════════════════════════════════════════════════════════ */}
//       <div className="card-surface !rounded-none border-t border-brand-border/10">
//         <div className="grid gap-8 lg:grid-cols-2 p-6 sm:p-8 items-center">
//           <div className="space-y-5">
//             <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
//               The Carnex Difference
//             </p>
//             <h2 className="text-section-title">
//               Why Sacramento
//               <br />
//               chooses us
//             </h2>
//             <p className="text-body-muted text-sm">
//               We built Carnex on a simple idea: buying a used car should feel as
//               premium as the car itself. No bait-and-switch, no hidden fees, no
//               high-pressure tactics — just honest people, quality vehicles, and
//               financing that works for you.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {TRUST_PILLS.map((pill) => (
//                 <Badge key={pill} variant="accent">
//                   {pill}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-px bg-brand-border/10">
//             {TRUST_ITEMS.map((item) => (
//               <div
//                 key={item.label}
//                 className="bg-brand-surface p-4 text-center"
//               >
//                 <div className="text-2xl font-bold text-brand-accent">
//                   {item.num}
//                 </div>
//                 <div className="text-xs uppercase tracking-wider text-brand-muted mt-1">
//                   {item.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════════
//           REVIEWS (hardcoded + dynamic)
//          ═══════════════════════════════════════════════════════════════════ */}
//       <section className="space-y-4">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
//               What Customers Say
//             </p>
//             <h2 className="text-section-title">
//               Real reviews from real buyers
//             </h2>
//           </div>
//           <Button onClick={() => setReviewModalOpen(true)}>
//             Write a Review
//           </Button>
//         </div>

//         {/* ── Static curated reviews ─────────────────────────────── */}
//         {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {REVIEWS.map((review) => (
//             <div key={review.name} className="card-surface p-5 space-y-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-sm shrink-0">
//                   {review.initials}
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="text-sm font-semibold text-brand-secondary truncate">
//                     {review.name}
//                   </p>
//                   <p className="text-xs text-brand-muted">{review.date}</p>
//                 </div>
//                 <Badge
//                   variant="success"
//                   className="text-xs px-2 py-0.5 ml-auto"
//                 >
//                   Verified Buyer
//                 </Badge>
//               </div>

//               <div className="text-brand-accent text-sm tracking-widest">
//                 {'★'.repeat(review.rating)}{' '}
//                 <span className="text-brand-muted text-xs ml-1">
//                   {review.rating}.0
//                 </span>
//               </div>

//               <p className="text-body-muted text-sm italic leading-relaxed">
//                 &ldquo;{review.text}&rdquo;
//               </p>

//               {review.vehicle && (
//                 <div className="pt-1">
//                   <Badge variant="outline" className="text-xs">
//                     🚗 {review.vehicle}
//                   </Badge>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div> */}

//         {/* ── Dynamic approved reviews ────────────────────────────── */}
//         {reviews?.length > 0 && (
//           <div className="mt-6 space-y-4">
//             <h3 className="text-lg font-semibold text-brand-secondary">
//               More customer reviews
//             </h3>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {reviews.map((review) => (
//                 <ReviewCard key={review._id} review={review} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── Write a Review Modal ─────────────────────────────────── */}
//         {reviewModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//             <div className="bg-white rounded-card p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-bold text-brand-secondary">
//                   Submit Your Review
//                 </h3>
//                 <button
//                   onClick={() => setReviewModalOpen(false)}
//                   className="text-brand-muted hover:text-brand-secondary text-xl leading-none"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <ReviewForm
//                 onSuccess={() => {
//                   setReviewModalOpen(false)
//                   fetchReviews()
//                 }}
//               />
//             </div>
//           </div>
//         )}
//       </section>

//       {/* ═══════════════════════════════════════════════════════════════════
//           LOCATION (Google Map + Address)
//          ═══════════════════════════════════════════════════════════════════ */}
//       {/* ═══════════════════════════════════════════════════════════════════
//     LOCATION (Google Map + Address)
//    ═══════════════════════════════════════════════════════════════════ */}
//       <section className="space-y-4">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
//             Visit Us
//           </p>
//           <h2 className="text-section-title">Our Dealership</h2>
//         </div>

//         {/* ═══ CLICKABLE MAP ═══ */}
//         <a
//           href="https://maps.app.goo.gl/oKgPzwuNp92o5LXv9?g_st=aw"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="block card-surface overflow-hidden rounded-card hover:shadow-lg transition-shadow cursor-pointer group relative"
//           title="Open in Google Maps"
//         >
//           {/* Map iframe - pointer-events-none so click passes through to the anchor */}
//           <iframe
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3121.991613756464!2d-121.40416640000001!3d38.51090429999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ac547a236add1%3A0xd1f4ba3921d232c!2sCarnex%20Auto%20Sales%20LLC!5e0!3m2!1sen!2s!4v1783188042575!5m2!1sen!2s"
//             width="100%"
//             height="100%"
//             style={{ border: 0 }}
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="strict-origin-when-cross-origin"
//             className="w-full h-64 sm:h-80 pointer-events-none"
//             title="Carnex Auto Sales LLC location"
//           ></iframe>

//           {/* Overlay with "Open in Google Maps" hint - shows on hover */}
//           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
//             <span className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
//               Open in Google Maps ↗
//             </span>
//           </div>
//         </a>

//         {/* Address line - also clickable */}
//         <div className="flex items-center gap-2 text-sm text-brand-muted">
//           <span className="text-brand-accent">📍</span>
//           <a
//             href="https://maps.app.goo.gl/oKgPzwuNp92o5LXv9?g_st=aw"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-brand-primary underline underline-offset-2"
//           >
//             {DEALERSHIP.addressLine1}, {DEALERSHIP.addressLine2}
//           </a>
//         </div>

//         {/* Contact Form */}
//         <div className="space-y-4 pt-4">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
//               Get In Touch
//             </p>
//             <h2 className="text-section-title">Contact Us</h2>
//           </div>
//           <div className="card-surface p-5">
//             <ContactForm />
//           </div>
//         </div>
//       </section>
//     </section>
//   )
// }

// client/src/pages/public/Home.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { ContactForm } from '../../components/forms/ContactForm'
import { Link, useNavigate } from 'react-router-dom'
import { DEALERSHIP, BUSINESS_HOURS } from '../../constants'
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
const INSTAGRAM_URL = 'https://www.instagram.com/yourhandle'
const FACEBOOK_URL = 'https://www.facebook.com/yourpage'
const TIKTOK_URL = 'https://www.tiktok.com/@yourhandle'
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
    <section className="page-content space-y-10">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO (with vehicle carousel)
         ═══════════════════════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden rounded-2xl">
        {/* Dark automotive background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,0,0,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.05),transparent_50%)]" />
        </div>

        {/* Social media icons (left vertical) */}
        <div className="hidden md:flex flex-col gap-3 absolute left-5 top-1/2 -translate-y-1/2 z-20">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
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
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
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
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="TikTok"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            {/* Left: Title and minimal action */}
            <div className="space-y-6 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                Sacramento, California · Pre-Owned Vehicles
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  CarnexAutos
                </span>
                <br />
                Car Dealership
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-lg mx-auto lg:mx-0">
                Discover quality pre-owned vehicles with transparent pricing and
                exceptional service.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <Link to="/inventory">
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Browse Inventory
                  </Button>
                </Link>
                <Link to="/financing">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white/10 text-white border border-white/30 hover:bg-white/20"
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
                <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-800 rounded-xl animate-pulse flex items-center justify-center">
                  <span className="text-gray-400">Loading vehicles...</span>
                </div>
              ) : heroError ? (
                <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-800 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">Unable to load vehicles</span>
                </div>
              ) : heroVehicles.length === 0 ? (
                <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-800 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">No vehicles available</span>
                </div>
              ) : (
                <div
                  className="relative h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl cursor-pointer"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <Link
                    to={`/vehicles/${currentHeroVehicle._id || currentHeroVehicle.id}`}
                  >
                    <img
                      src={getVehicleImage(currentHeroVehicle)}
                      alt={currentHeroVehicle.title || 'Vehicle'}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Vehicle info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left">
                      <p className="text-xs font-medium text-gray-300">
                        {currentHeroVehicle.year} {currentHeroVehicle.make}{' '}
                        {currentHeroVehicle.model}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-white truncate">
                        {currentHeroVehicle.title}
                      </h3>
                      <p className="text-lg font-extrabold text-red-400 mt-1">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0
                        }).format(currentHeroVehicle.price || 0)}
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors flex items-center justify-center"
                        aria-label="Previous vehicle"
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          nextSlide()
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors flex items-center justify-center"
                        aria-label="Next vehicle"
                      >
                        ›
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
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
        <div className="md:hidden flex justify-center gap-4 pb-8">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
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
          QUICK SEARCH (redesigned)
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
          className="card-surface p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 bg-white"
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
                className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white"
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
        ) : (latestVehicles || []).length === 0 ? (
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
            {(latestVehicles || []).map((vehicle) => (
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
          REVIEWS — GOOGLE REVIEWS DISABLED (no Places API billing yet).
          Re-enable by restoring this block plus the imports/state marked
          "GOOGLE REVIEWS — DISABLED" above.
         ═══════════════════════════════════════════════════════════════════ */}
      {/*
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
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
          <div className="card-surface p-6 text-center">
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
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
            Visit Us
          </p>
          <h2 className="text-section-title">Our Dealership</h2>
        </div>

        <a
          href="https://maps.app.goo.gl/oKgPzwuNp92o5LXv9?g_st=aw"
          target="_blank"
          rel="noopener noreferrer"
          className="block card-surface overflow-hidden rounded-card hover:shadow-lg transition-shadow cursor-pointer group relative"
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
            className="w-full h-64 sm:h-80 pointer-events-none"
            title="Carnex Auto Sales LLC location"
          ></iframe>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
