// // client/src/pages/public/VehicleDetail.jsx
// import { useParams, Link } from 'react-router-dom'
// import { useVehicleById, useLatestVehicles } from '../../hooks/useVehicles'
// import { VehicleGallery } from '../../components/vehicles/VehicleGallery'
// import { PaymentCalculator } from '../../components/vehicles/PaymentCalculator'
// import { Badge } from '../../components/ui/Badge'
// import { Button } from '../../components/ui/Button'
// import { VehicleGrid } from '../../components/vehicles/VehicleGrid'
// import { Skeleton, SkeletonText } from '../../components/ui/Skeleton'
// import { StoreStatusBadge } from '../../components/ui/StoreStatusBadge'
// import { QuoteForm } from '../../components/vehicles/QuoteForm'

// export function VehicleDetail() {
//   const { id } = useParams()
//   const { vehicle, loading, error } = useVehicleById(id)
//   const { vehicles: latestVehicles, loading: relatedLoading } =
//     useLatestVehicles(6)

//   // ── Loading skeleton ─────────────────────────────────────
//   if (loading) {
//     return (
//       <section className="page-content space-y-6">
//         <Skeleton className="h-8 w-2/3" />
//         <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
//           <div className="space-y-4">
//             <Skeleton className="h-80 w-full rounded-card" />
//             <Skeleton className="h-40 w-full rounded-card" />
//           </div>
//           <div className="space-y-4">
//             <Skeleton className="h-48 w-full rounded-card" />
//             <Skeleton className="h-48 w-full rounded-card" />
//           </div>
//         </div>
//       </section>
//     )
//   }

//   // ── Error / not found ────────────────────────────────────
//   if (error || !vehicle) {
//     return (
//       <section className="page-content">
//         <div className="card-surface p-6 text-center space-y-3">
//           <h1 className="text-page-title mb-2">Vehicle not found</h1>
//           <p className="text-body-muted">
//             {error ||
//               'This vehicle might have been removed or is no longer available.'}
//           </p>
//           <Link
//             to="/inventory"
//             className="inline-flex items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-card transition hover:bg-brand-primaryHover"
//           >
//             Back to Inventory
//           </Link>
//         </div>
//       </section>
//     )
//   }

//   // Extract vehicle data
//   const {
//     _id,
//     title,
//     price,
//     originalPrice, // optional – for strikethrough
//     mileage,
//     year,
//     bodyType,
//     fuelType,
//     transmission,
//     location,
//     images,
//     imageUrl,
//     highlight,
//     specs = {},
//     features = [],
//     make,
//     model,
//     color,
//     driveType,
//     status
//   } = vehicle
//   const vehicleId = _id

//   // Normalize images
//   const galleryImages =
//     images && images.length > 0
//       ? images.map((img) => (typeof img === 'string' ? img : img.url))
//       : imageUrl
//         ? [imageUrl]
//         : []

//   // Related vehicles (same body type, exclude current)
//   const relatedVehicles = latestVehicles
//     .filter((v) => v._id !== vehicleId && v.bodyType === bodyType)
//     .slice(0, 3)

//   // Format numbers
//   const fmtCur = (val) =>
//     new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       maximumFractionDigits: 0
//     }).format(val)
//   const fmtNum = (val) =>
//     new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val)

//   return (
//     <section className="page-content space-y-6">
//       {/* ── Top header strip (like HTML vdp-top-header) ────── */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-page-title">{title}</h1>
//           <p className="text-body-muted text-sm">
//             {year} {make} {model} · {bodyType}
//           </p>
//         </div>
//         <StoreStatusBadge />
//       </div>

//       {/* ── Action bar ──────────────────────────────────────── */}
//       <div className="card-surface p-3 flex flex-wrap gap-2">
//         <a
//           href="tel:9165340971"
//           className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline"
//         >
//           📞 (916) 534-0971
//         </a>
//         <Button variant="secondary" size="sm" asChild>
//           <Link to="#quote-form">Request a Quote</Link>
//         </Button>
//         <Button variant="primary" size="sm" asChild>
//           <Link to={`/financing?vehicle=${vehicleId}`}>Get Approved</Link>
//         </Button>
//         <Button variant="secondary" size="sm" asChild>
//           <Link to={`/trade-in?vehicle=${vehicleId}`}>Value My Trade</Link>
//         </Button>
//         <Button variant="accent" size="sm" asChild>
//           <Link to={`/test-drive?vehicle=${vehicleId}`}>
//             Schedule Test Drive
//           </Link>
//         </Button>
//       </div>

//       {/* ── Main two‑column grid ────────────────────────────── */}
//       <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
//         {/* LEFT COLUMN */}
//         <div className="space-y-6">
//           {/* Gallery in mosaic layout (if multiple images) */}
//           <VehicleGallery
//             images={galleryImages}
//             title={title}
//             bodyType={bodyType}
//             layout={galleryImages.length > 1 ? 'mosaic' : 'carousel'}
//           />

//           {/* Price + summary stripe (like HTML vdp-price-header) */}
//           <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <h2 className="text-base font-semibold text-brand-secondary">
//                 {year} {make} {model}
//               </h2>
//               <p className="text-sm text-brand-muted">
//                 {title} • {fmtNum(mileage)} miles
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-brand-muted">Price</p>
//               <div>
//                 {originalPrice && originalPrice > price ? (
//                   <>
//                     <span className="line-through text-sm text-brand-muted mr-2">
//                       {fmtCur(originalPrice)}
//                     </span>
//                     <span className="text-2xl font-bold text-brand-primary">
//                       {fmtCur(price)}
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-2xl font-bold text-brand-primary">
//                     {fmtCur(price)}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Vehicle info + Description (two sub‑columns like HTML) */}
//           <div className="grid gap-4 md:grid-cols-2">
//             {/* Vehicle Info table */}
//             <div className="card-surface p-4">
//               <h3 className="text-section-title text-base mb-3">
//                 Vehicle Info
//               </h3>
//               <dl className="space-y-2 text-sm">
//                 {[
//                   ['Condition', status || 'Used'],
//                   ['Engine', specs.engine],
//                   ['Transmission', transmission],
//                   ['Fuel Type', fuelType],
//                   ['Drivetrain', driveType],
//                   ['Exterior Color', color],
//                   ['Interior Color', vehicle.intColor], // if exists
//                   ['Stock #', vehicle.stockNumber || vehicleId],
//                   ['VIN', specs.vin],
//                   ['Seating', specs.seating]
//                 ].map(
//                   ([label, value]) =>
//                     value && (
//                       <div key={label} className="flex justify-between">
//                         <dt className="text-brand-muted">{label}</dt>
//                         <dd className="font-medium text-brand-secondary">
//                           {value}
//                         </dd>
//                       </div>
//                     )
//                 )}
//               </dl>
//             </div>

//             {/* Description & Features */}
//             <div className="card-surface p-4 space-y-4">
//               <div>
//                 <h3 className="text-section-title text-base mb-2">
//                   Description
//                 </h3>
//                 <p className="text-body-muted text-sm">
//                   {highlight ||
//                     `This ${year} ${make} ${model} is fully inspected and ready for a new home. Comes with a clean title and excellent service history.`}
//                 </p>
//               </div>
//               {features.length > 0 && (
//                 <div>
//                   <h3 className="text-section-title text-base mb-2">
//                     Features
//                   </h3>
//                   <ul className="space-y-1 text-sm">
//                     {features.map((f, i) => (
//                       <li key={i} className="flex items-start gap-2">
//                         <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary flex-shrink-0" />
//                         <span>{f}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Detailed Specifications (only if backend provides them) */}
//           {specs &&
//             (specs.engineDetails ||
//               specs.dimensions ||
//               specs.transmissionDetails) && (
//               <div className="card-surface p-4 space-y-4">
//                 <h3 className="text-section-title text-base">
//                   Standard Specifications
//                 </h3>

//                 {specs.engineDetails && (
//                   <div>
//                     <h4 className="text-sm font-semibold text-brand-secondary mb-2">
//                       Engine Details
//                     </h4>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs">
//                       {Object.entries(specs.engineDetails).map(([key, val]) => (
//                         <div key={key} className="flex justify-between">
//                           <span className="text-brand-muted">{key}</span>
//                           <span className="font-medium text-brand-secondary">
//                             {val}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {specs.dimensions && (
//                   <div className="border-t border-brand-border pt-3">
//                     <h4 className="text-sm font-semibold text-brand-secondary mb-2">
//                       Measurements & Capacity
//                     </h4>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs">
//                       {Object.entries(specs.dimensions).map(([key, val]) => (
//                         <div key={key} className="flex justify-between">
//                           <span className="text-brand-muted">{key}</span>
//                           <span className="font-medium text-brand-secondary">
//                             {val}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {specs.transmissionDetails && (
//                   <div className="border-t border-brand-border pt-3">
//                     <h4 className="text-sm font-semibold text-brand-secondary mb-2">
//                       Transmission & Drivetrain
//                     </h4>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs">
//                       {Object.entries(specs.transmissionDetails).map(
//                         ([key, val]) => (
//                           <div key={key} className="flex justify-between">
//                             <span className="text-brand-muted">{key}</span>
//                             <span className="font-medium text-brand-secondary">
//                               {val}
//                             </span>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//           {/* Financing / Carfax bar (optional) */}
//           <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-3">
//             <div className="border-r border-brand-border pr-4">
//               <p className="text-sm text-brand-muted mb-1">
//                 Financing Available
//               </p>
//               <Button asChild>
//                 <Link to={`/financing?vehicle=${vehicleId}`}>Apply Now!</Link>
//               </Button>
//             </div>
//             <div>
//               <a
//                 href="https://www.carfax.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center rounded bg-white px-4 py-2 text-xs font-bold text-black shadow hover:shadow-md"
//               >
//                 SHOW ME THE <span className="text-blue-600 ml-1">CARFAX</span>
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN (sidebar) */}
//         <div className="space-y-5">
//           {/* Quote form (anchor #quote-form) */}
//           <div id="quote-form">
//             <QuoteForm vehicle={vehicle} />
//           </div>

//           {/* Enhanced payment calculator */}
//           <PaymentCalculator price={price || 0} />
//         </div>
//       </div>

//       {/* ── Related vehicles ──────────────────────────────────── */}
//       {!relatedLoading && relatedVehicles.length > 0 && (
//         <section className="space-y-3">
//           <h2 className="text-section-title">Similar Vehicles You May Like</h2>
//           <VehicleGrid vehicles={relatedVehicles} view="grid" />
//         </section>
//       )}
//     </section>
//   )
// }

// // client/src/pages/public/VehicleDetail.jsx
// import { useState } from 'react'
// import { useParams, Link } from 'react-router-dom'
// import { useVehicleById, useLatestVehicles } from '../../hooks/useVehicles'
// import { PaymentCalculator } from '../../components/vehicles/PaymentCalculator'
// import { Button } from '../../components/ui/Button'
// import { VehicleGrid } from '../../components/vehicles/VehicleGrid'
// import { Skeleton } from '../../components/ui/Skeleton'
// import { StoreStatusBadge } from '../../components/ui/StoreStatusBadge'
// import { QuoteForm } from '../../components/vehicles/QuoteForm'

// // ── Formatting helpers ───────────────────────────────
// const fmtCur = (val) =>
//   new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     maximumFractionDigits: 0
//   }).format(val)
// const fmtNum = (val) =>
//   new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val)

// // ── Lightbox Modal ────────────────────────────────────
// function Lightbox({ src, onClose }) {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
//       onClick={onClose}
//     >
//       <button
//         className="absolute top-4 right-6 text-white text-4xl hover:text-gray-300"
//         onClick={onClose}
//         aria-label="Close"
//       >
//         &times;
//       </button>
//       <img
//         src={src}
//         className="max-w-[90%] max-h-[85vh] object-contain rounded-lg shadow-2xl"
//         alt="expanded vehicle"
//         onClick={(e) => e.stopPropagation()}
//       />
//       <p className="absolute bottom-6 text-gray-300 text-xs uppercase tracking-widest">
//         Click anywhere to close
//       </p>
//     </div>
//   )
// }

// // ── Mosaic gallery (unchanged behaviour) ─────────────
// function MosaicGallery({ images, title }) {
//   const [selected, setSelected] = useState(0)
//   const [lightbox, setLightbox] = useState(false)

//   if (!images.length) return null

//   const main = images[selected] || images[0]
//   const thumbs = images.slice(0, 3)
//   const remaining = images.length - 1

//   return (
//     <>
//       <div className="card-surface overflow-hidden rounded-card shadow-card">
//         <div
//           className="relative cursor-pointer"
//           onClick={() => setLightbox(true)}
//         >
//           <img
//             src={main}
//             alt={title}
//             className="w-full aspect-[4/3] object-cover"
//             loading="lazy"
//           />
//         </div>
//         <div className="grid grid-cols-4 gap-1 mt-1">
//           {thumbs.map((src, i) => (
//             <div
//               key={i}
//               className="cursor-pointer overflow-hidden rounded"
//               onClick={() => setSelected(i)}
//             >
//               <img
//                 src={src}
//                 alt={`thumb ${i + 1}`}
//                 className="w-full h-20 object-cover opacity-70 hover:opacity-100 transition"
//                 loading="lazy"
//               />
//             </div>
//           ))}
//           {remaining > 3 && (
//             <div
//               className="relative cursor-pointer overflow-hidden rounded"
//               onClick={() => setLightbox(true)}
//             >
//               <img
//                 src={images[3] || images[0]}
//                 alt="more"
//                 className="w-full h-20 object-cover opacity-50"
//               />
//               <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-lg font-bold">
//                 +{remaining - 3}
//               </div>
//             </div>
//           )}
//           {thumbs.length < 3 &&
//             Array.from({ length: 3 - thumbs.length }).map((_, i) => (
//               <div
//                 key={`ph-${i}`}
//                 className="h-20 bg-brand-border/30 rounded"
//               />
//             ))}
//         </div>
//       </div>
//       {lightbox && <Lightbox src={main} onClose={() => setLightbox(false)} />}
//     </>
//   )
// }

// // ── Three‑column spec grid (as before) ──────────────
// function SpecGrid({ columns }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       {columns.map((col, idx) => (
//         <ul key={idx} className="space-y-1 text-sm">
//           {col.map((item, i) => {
//             if (!item.value && item.value !== 0) return null
//             return (
//               <li key={i} className="flex justify-between">
//                 <span className="text-brand-muted">{item.label}</span>
//                 <span className="font-medium text-brand-secondary">
//                   {item.value}
//                 </span>
//               </li>
//             )
//           })}
//         </ul>
//       ))}
//     </div>
//   )
// }

// // ── Feature list helper ──────────────────────────────
// function FeatureList({ items }) {
//   if (!items || items.length === 0) return null
//   return (
//     <ul className="space-y-1 text-sm ml-1">
//       {items.map((f, i) => (
//         <li key={i} className="flex items-start gap-2">
//           <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary flex-shrink-0" />
//           <span>{f}</span>
//         </li>
//       ))}
//     </ul>
//   )
// }

// export function VehicleDetail() {
//   const { id } = useParams()
//   const { vehicle, loading, error } = useVehicleById(id)
//   const { vehicles: latestVehicles, loading: relatedLoading } =
//     useLatestVehicles(6)

//   if (loading) {
//     return (
//       <section className="page-content space-y-6">
//         <Skeleton className="h-8 w-2/3" />
//         <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
//           <div className="space-y-4">
//             <Skeleton className="h-80 w-full rounded-card" />
//             <Skeleton className="h-40 w-full rounded-card" />
//           </div>
//           <div className="space-y-4">
//             <Skeleton className="h-48 w-full rounded-card" />
//             <Skeleton className="h-48 w-full rounded-card" />
//           </div>
//         </div>
//       </section>
//     )
//   }

//   if (error || !vehicle) {
//     return (
//       <section className="page-content">
//         <div className="card-surface p-6 text-center space-y-3">
//           <h1 className="text-page-title mb-2">Vehicle not found</h1>
//           <p className="text-body-muted">
//             {error ||
//               'This vehicle might have been removed or is no longer available.'}
//           </p>
//           <Link
//             to="/inventory"
//             className="inline-flex items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-card transition hover:bg-brand-primaryHover"
//           >
//             Back to Inventory
//           </Link>
//         </div>
//       </section>
//     )
//   }

//   const {
//     title,
//     price,
//     mileage,
//     year,
//     make,
//     model,
//     bodyType,
//     fuelType,
//     transmission,
//     driveType,
//     exteriorColor,
//     interiorColor,
//     condition,
//     stockNumber,
//     vin,
//     description,
//     dealerNotes,
//     specs = {},
//     features = {},
//     badges = {},
//     media = {},
//     images,
//     imageUrl
//   } = vehicle

//   const galleryImages =
//     images && images.length > 0
//       ? images.map((img) => (typeof img === 'string' ? img : img.url))
//       : imageUrl
//         ? [imageUrl]
//         : []

//   const relatedVehicles = latestVehicles
//     .filter((v) => v._id !== vehicle._id && v.bodyType === bodyType)
//     .slice(0, 3)

//   const salePrice = badges.salePrice || vehicle.salePrice
//   const showSale = salePrice && salePrice < price

//   // ── Build spec columns (same as before) ──────────────
//   const engineSpecs = specs.engine || {}
//   const engineCols = [
//     [
//       { label: 'Bore', value: engineSpecs.bore },
//       { label: 'Compression', value: engineSpecs.compressionRatio },
//       { label: 'Displacement', value: engineSpecs.size },
//       { label: 'Stroke', value: engineSpecs.stroke }
//     ],
//     [
//       {
//         label: 'Horsepower',
//         value: engineSpecs.horsepower
//           ? `${engineSpecs.horsepower} hp @ ${engineSpecs.horsepowerRpm || '—'} rpm`
//           : null
//       },
//       {
//         label: 'Torque',
//         value: engineSpecs.torque
//           ? `${engineSpecs.torque} ft-lb @ ${engineSpecs.torqueRpm || '—'} rpm`
//           : null
//       },
//       { label: 'Cylinders', value: engineSpecs.cylinders },
//       { label: 'RPM', value: engineSpecs.horsepowerRpm }
//     ],
//     [
//       { label: 'Fuel System', value: engineSpecs.fuelSystem },
//       { label: 'Valves', value: engineSpecs.valves },
//       { label: 'Cam Type', value: engineSpecs.camType || engineSpecs.type },
//       { label: 'Engine Brand', value: engineSpecs.type }
//     ]
//   ]

//   const dims = specs.dimensions || {}
//   const weight = specs.weight || {}
//   const dimCols = [
//     [
//       { label: 'Length', value: dims.length },
//       { label: 'Width', value: dims.width },
//       { label: 'Height', value: dims.height },
//       { label: 'Wheelbase', value: dims.wheelbase }
//     ],
//     [
//       { label: 'Ground Clearance', value: dims.groundClearance },
//       { label: 'Fuel Capacity', value: dims.fuelTankCapacity },
//       { label: 'Payload', value: weight.payload },
//       { label: 'Towing', value: weight.towingCapacity }
//     ],
//     [
//       { label: 'Curb Weight', value: weight.curbWeight },
//       { label: 'GVWR', value: weight.gvwr },
//       { label: 'Cargo', value: dims.cargoCapacity },
//       { label: 'Seating', value: specs.seating }
//     ]
//   ]

//   const transSpecs = specs.transmission || {}
//   const transCols = [
//     [
//       { label: 'Transmission', value: transmission },
//       { label: 'Gears', value: transSpecs.gears },
//       { label: 'Type', value: transSpecs.type }
//     ],
//     [
//       { label: 'Drive Type', value: driveType },
//       { label: 'Transfer Case', value: transSpecs.transferCase },
//       { label: 'Differential', value: transSpecs.differential }
//     ],
//     [
//       { label: 'Front Suspension', value: transSpecs.frontSuspension },
//       { label: 'Rear Suspension', value: transSpecs.rearSuspension },
//       { label: 'Brakes', value: transSpecs.brakes }
//     ]
//   ]

//   // ── Feature categories in the exact HTML order ──────
//   const featureCategories = [
//     { key: 'comfort', label: 'Air Conditioning' }, // we can rename later
//     { key: 'convenience', label: 'Convenience' },
//     { key: 'entertainment', label: 'Entertainment' },
//     { key: 'interior', label: 'Interior' },
//     { key: 'exterior', label: 'Exterior' },
//     { key: 'technology', label: 'Technology' },
//     { key: 'safety', label: 'Safety' },
//     { key: 'driverAssistance', label: 'Driver Assistance' }
//   ]

//   return (
//     <section className="page-content space-y-6">
//       {/* Header + status */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-page-title">{title}</h1>
//           <p className="text-body-muted text-sm">
//             {year} {make} {model} · {bodyType}
//           </p>
//         </div>
//         <StoreStatusBadge />
//       </div>

//       {/* Action bar */}
//       {/* <div className="card-surface p-3 flex flex-wrap gap-2">
//         <a
//           href="tel:9165340971"
//           className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline"
//         >
//           📞 (916) 534-0971
//         </a>
//         <Button variant="secondary" size="sm" asChild>
//           <Link to="#quote-form">Request a Quote</Link>
//         </Button>
//         <Button variant="primary" size="sm" asChild>
//           <Link to={`/financing?vehicle=${vehicle._id}`}>Get Approved</Link>
//         </Button>
//         <Button variant="secondary" size="sm" asChild>
//           <Link to={`/trade-in?vehicle=${vehicle._id}`}>Value My Trade</Link>
//         </Button>
//         <Button variant="accent" size="sm" asChild>
//           <Link to={`/test-drive?vehicle=${vehicle._id}`}>
//             Schedule Test Drive
//           </Link>
//         </Button>
//       </div> */}

//       {/* Main content + sidebar */}
//       <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
//         {/* Left column */}
//         <div className="space-y-6">
//           {/* Gallery */}
//           <MosaicGallery images={galleryImages} title={title} />

//           {/* ── Price card (HTML style) ───────────────────── */}
//           <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <h2 className="text-base font-semibold text-brand-secondary">
//                 {year} {make} {model}
//               </h2>
//               <p className="text-sm text-brand-muted">{specs.trim || title}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-brand-muted">Price</p>
//               <div className="mb-1">
//                 {showSale ? (
//                   <>
//                     <span className="line-through text-sm text-brand-muted mr-2">
//                       {fmtCur(price)}
//                     </span>
//                     <span className="text-2xl font-bold text-brand-primary">
//                       {fmtCur(salePrice)}
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-2xl font-bold text-brand-primary">
//                     {fmtCur(price)}
//                   </span>
//                 )}
//               </div>
//               {mileage > 0 ? (
//                 <p className="text-sm text-brand-muted">
//                   {fmtNum(mileage)} miles
//                 </p>
//               ) : condition === 'new' ? (
//                 <p className="text-sm text-brand-muted">New Vehicle</p>
//               ) : null}
//             </div>
//           </div>

//           {/* ── Vehicle Information (HTML style list) ─────── */}
//           <div className="card-surface p-4">
//             <h3 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2 mb-3">
//               Vehicle Info
//             </h3>
//             <ul className="space-y-2 text-sm">
//               {[
//                 ['Condition', condition],
//                 [
//                   'Engine',
//                   engineSpecs.size
//                     ? `${engineSpecs.size} ${engineSpecs.type || ''}`
//                     : undefined
//                 ],
//                 ['Transmission', transmission],
//                 ['Fuel Type', fuelType],
//                 ['Drivetrain', driveType],
//                 ['Trim', specs.trim],
//                 ['Exterior Color', exteriorColor],
//                 ['Interior Color', interiorColor],
//                 ['Stock #', stockNumber],
//                 ['VIN', vin]
//               ]
//                 .filter(
//                   ([, val]) => val !== undefined && val !== null && val !== ''
//                 )
//                 .map(([label, val]) => (
//                   <li
//                     key={label}
//                     className="flex justify-between border-b border-brand-border/40 pb-1.5"
//                   >
//                     <span className="text-brand-muted">{label}</span>
//                     <strong className="text-brand-secondary font-medium">
//                       {val}
//                     </strong>
//                   </li>
//                 ))}
//             </ul>
//           </div>

//           {/* ── Description + Features (one card) ─────────── */}
//           <div className="card-surface p-4">
//             {description && (
//               <>
//                 <h3 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2 mb-3">
//                   Description
//                 </h3>
//                 <p className="text-body-muted text-sm mb-4">{description}</p>
//                 {dealerNotes && (
//                   <>
//                     <h4 className="text-xs font-semibold text-brand-muted uppercase mb-1">
//                       Dealer Notes
//                     </h4>
//                     <p className="text-body-muted text-sm mb-4">
//                       {dealerNotes}
//                     </p>
//                   </>
//                 )}
//               </>
//             )}

//             {featureCategories.some(({ key }) => features[key]?.length > 0) && (
//               <>
//                 <h3 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2 mb-3">
//                   Features
//                 </h3>
//                 {featureCategories.map(({ key, label }) => {
//                   const list = features[key]
//                   if (!list || list.length === 0) return null
//                   return (
//                     <div key={key} className="mb-4">
//                       <h4 className="text-xs font-semibold text-brand-muted uppercase mb-1">
//                         {label}
//                       </h4>
//                       <FeatureList items={list} />
//                     </div>
//                   )
//                 })}
//               </>
//             )}
//           </div>

//           {/* ── Engine Specifications ─────────────────────── */}
//           {Object.values(engineSpecs).filter(Boolean).length > 0 && (
//             <div className="card-surface p-4">
//               <h3 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2 mb-3">
//                 Engine Details
//               </h3>
//               <SpecGrid columns={engineCols} />
//             </div>
//           )}

//           {/* ── Measurements & Capacity ──────────────────── */}
//           {(Object.values(dims).filter(Boolean).length > 0 ||
//             Object.values(weight).filter(Boolean).length > 0) && (
//             <div className="card-surface p-4">
//               <h3 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2 mb-3">
//                 Measurements & Capacity
//               </h3>
//               <SpecGrid columns={dimCols} />
//             </div>
//           )}

//           {/* ── Transmission & Drivetrain ────────────────── */}
//           {Object.values(transSpecs).filter(Boolean).length > 0 && (
//             <div className="card-surface p-4">
//               <h3 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2 mb-3">
//                 Transmission & Drivetrain
//               </h3>
//               <SpecGrid columns={transCols} />
//             </div>
//           )}

//           {/* ── Financing / CARFAX bar (HTML style) ──────── */}
//           <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-3">
//             <div className="border-r border-brand-border pr-4">
//               <p className="text-sm text-brand-muted mb-1">
//                 Financing Available
//               </p>
//               <Button asChild>
//                 <Link to={`/financing?vehicle=${vehicle._id}`}>Apply Now!</Link>
//               </Button>
//             </div>
//             <div>
//               {media.carfaxUrl ? (
//                 <a
//                   href={media.carfaxUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center rounded bg-white px-4 py-2 text-xs font-bold text-black shadow hover:shadow-md"
//                 >
//                   SHOW ME THE <span className="text-blue-600 ml-1">CARFAX</span>
//                 </a>
//               ) : (
//                 <p className="text-xs text-brand-muted">CARFAX not available</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right sidebar */}
//         <div className="space-y-5">
//           <div id="quote-form">
//             <QuoteForm vehicle={vehicle} />
//           </div>
//           <PaymentCalculator price={salePrice || price} />
//         </div>
//       </div>

//       {/* Similar vehicles */}
//       {!relatedLoading && relatedVehicles.length > 0 && (
//         <section className="space-y-3">
//           <h2 className="text-section-title">Similar Vehicles You May Like</h2>
//           <VehicleGrid vehicles={relatedVehicles} view="grid" />
//         </section>
//       )}
//     </section>
//   )
// }

// client/src/pages/public/VehicleDetail.jsx
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useVehicleById, useLatestVehicles } from '../../hooks/useVehicles'
import { PaymentCalculator } from '../../components/vehicles/PaymentCalculator'
import { Button } from '../../components/ui/Button'
import { VehicleGrid } from '../../components/vehicles/VehicleGrid'
import { Skeleton } from '../../components/ui/Skeleton'
import { StoreStatusBadge } from '../../components/ui/StoreStatusBadge'
import { QuoteForm } from '../../components/vehicles/QuoteForm'

// ── Formatting helpers ───────────────────────────────
const fmtCur = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val)
const fmtNum = (val) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val)

// ── Small inline icons (no external icon dependency) ─
const Icon = {
  check: (p) => (
    <svg viewBox="0 0 20 20" fill="none" className={p.className}>
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.12" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  gauge: (p) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}>
      <path
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 12l4-4M5 12h1M18 12h1M12 5v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Lightbox Modal ────────────────────────────────────
function Lightbox({ src, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-6 text-white/80 text-3xl leading-none hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <img
        src={src}
        className="max-w-[90%] max-h-[85vh] object-contain rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
        alt="expanded vehicle"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="absolute bottom-6 text-slate-400 text-[11px] uppercase tracking-[0.25em]">
        Click anywhere to close
      </p>
    </div>
  )
}

// ── Mosaic gallery — luxury showcase treatment ───────
function MosaicGallery({ images, title }) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images.length) return null

  const main = images[selected] || images[0]
  const thumbs = images.slice(0, 4)
  const remaining = images.length - 1

  return (
    <>
      <div className="rounded-3xl overflow-hidden bg-white shadow-[0_8px_40px_rgba(15,23,42,0.08)] border border-slate-100">
        <div
          className="relative cursor-zoom-in group overflow-hidden"
          onClick={() => setLightbox(true)}
        >
          <img
            src={main}
            alt={title}
            className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute bottom-4 right-4 rounded-full bg-slate-950/70 text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            View Full Size
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 p-2">
          {thumbs.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative overflow-hidden rounded-xl transition-all duration-200 ${
                selected === i
                  ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-white'
                  : 'ring-1 ring-slate-100 hover:ring-slate-300'
              }`}
            >
              <img
                src={src}
                alt={`thumb ${i + 1}`}
                className={`w-full h-20 object-cover transition-opacity duration-200 ${
                  selected === i
                    ? 'opacity-100'
                    : 'opacity-70 hover:opacity-100'
                }`}
                loading="lazy"
              />
              {i === 3 && remaining > 4 && (
                <span
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-white text-sm font-bold cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightbox(true)
                  }}
                >
                  +{remaining - 3}
                </span>
              )}
            </button>
          ))}
          {thumbs.length < 4 &&
            Array.from({ length: 4 - thumbs.length }).map((_, i) => (
              <div key={`ph-${i}`} className="h-20 bg-slate-50 rounded-xl" />
            ))}
        </div>
      </div>
      {lightbox && <Lightbox src={main} onClose={() => setLightbox(false)} />}
    </>
  )
}

// ── Premium spec tile grid ────────────────────────────
function SpecGrid({ columns }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {columns.map((col, idx) =>
        col
          .filter((item) => item.value || item.value === 0)
          .map((item, i) => (
            <div
              key={`${idx}-${i}`}
              className="group rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition-all duration-200 hover:bg-white hover:border-red-100 hover:shadow-[0_4px_20px_rgba(220,38,38,0.08)]"
            >
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 flex-shrink-0" />
                {item.label}
              </p>
              <p className="text-[15px] font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </p>
            </div>
          ))
      )}
    </div>
  )
}

// ── Feature chips ─────────────────────────────────────
function FeatureList({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((f, i) => (
        <span
          key={i}
          className="group inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50/60 pl-2 pr-3.5 py-1.5 text-[13px] font-semibold text-slate-700 transition-all duration-200 hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-md hover:-translate-y-0.5"
        >
          <Icon.check className="h-4 w-4 text-red-600 group-hover:text-white transition-colors" />
          {f}
        </span>
      ))}
    </div>
  )
}

// ── Premium section heading ───────────────────────────
const SectionHeading = ({ children, eyebrow, className = '' }) => (
  <div className={className}>
    {eyebrow && (
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-600 mb-1">
        {eyebrow}
      </p>
    )}
    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
      <span className="h-5 w-1 rounded-full bg-gradient-to-b from-red-600 to-red-700 inline-block" />
      {children}
    </h3>
  </div>
)

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-2xl shadow-[0_2px_16px_rgba(15,23,42,0.06)] border border-slate-100 ${className}`}
  >
    {children}
  </div>
)

export function VehicleDetail() {
  const { id } = useParams()
  const { vehicle, loading, error } = useVehicleById(id)
  const { vehicles: latestVehicles, loading: relatedLoading } =
    useLatestVehicles(6)

  if (loading) {
    return (
      <section className="page-content space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <div className="space-y-4">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    )
  }

  if (error || !vehicle) {
    return (
      <section className="page-content">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-10 text-center space-y-4 max-w-lg mx-auto">
          <div className="mx-auto h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
            <Icon.gauge className="h-7 w-7 text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Vehicle not found
          </h1>
          <p className="text-slate-600">
            {error ||
              'This vehicle might have been removed or is no longer available.'}
          </p>
          <Link
            to="/inventory"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-700 hover:shadow-lg"
          >
            Back to Inventory
          </Link>
        </div>
      </section>
    )
  }

  const {
    title,
    price,
    mileage,
    year,
    make,
    model,
    bodyType,
    fuelType,
    transmission,
    driveType,
    exteriorColor,
    interiorColor,
    condition,
    stockNumber,
    vin,
    description,
    dealerNotes,
    specs = {},
    features = {},
    badges = {},
    media = {},
    images,
    imageUrl
  } = vehicle

  const galleryImages =
    images && images.length > 0
      ? images.map((img) => (typeof img === 'string' ? img : img.url))
      : imageUrl
        ? [imageUrl]
        : []

  const relatedVehicles = latestVehicles
    .filter((v) => v._id !== vehicle._id && v.bodyType === bodyType)
    .slice(0, 3)

  const salePrice = badges.salePrice || vehicle.salePrice
  const showSale = salePrice && salePrice < price

  // ── Build spec columns (same data as before) ────────
  const engineSpecs = specs.engine || {}
  const engineCols = [
    [
      { label: 'Bore', value: engineSpecs.bore },
      { label: 'Compression', value: engineSpecs.compressionRatio },
      { label: 'Displacement', value: engineSpecs.size },
      { label: 'Stroke', value: engineSpecs.stroke }
    ],
    [
      {
        label: 'Horsepower',
        value: engineSpecs.horsepower
          ? `${engineSpecs.horsepower} hp @ ${engineSpecs.horsepowerRpm || '—'} rpm`
          : null
      },
      {
        label: 'Torque',
        value: engineSpecs.torque
          ? `${engineSpecs.torque} ft-lb @ ${engineSpecs.torqueRpm || '—'} rpm`
          : null
      },
      { label: 'Cylinders', value: engineSpecs.cylinders },
      { label: 'RPM', value: engineSpecs.horsepowerRpm }
    ],
    [
      { label: 'Fuel System', value: engineSpecs.fuelSystem },
      { label: 'Valves', value: engineSpecs.valves },
      { label: 'Cam Type', value: engineSpecs.camType || engineSpecs.type },
      { label: 'Engine Brand', value: engineSpecs.type }
    ]
  ]

  const dims = specs.dimensions || {}
  const weight = specs.weight || {}
  const dimCols = [
    [
      { label: 'Length', value: dims.length },
      { label: 'Width', value: dims.width },
      { label: 'Height', value: dims.height },
      { label: 'Wheelbase', value: dims.wheelbase }
    ],
    [
      { label: 'Ground Clearance', value: dims.groundClearance },
      { label: 'Fuel Capacity', value: dims.fuelTankCapacity },
      { label: 'Payload', value: weight.payload },
      { label: 'Towing', value: weight.towingCapacity }
    ],
    [
      { label: 'Curb Weight', value: weight.curbWeight },
      { label: 'GVWR', value: weight.gvwr },
      { label: 'Cargo', value: dims.cargoCapacity },
      { label: 'Seating', value: specs.seating }
    ]
  ]

  const transSpecs = specs.transmission || {}
  const transCols = [
    [
      { label: 'Transmission', value: transmission },
      { label: 'Gears', value: transSpecs.gears },
      { label: 'Type', value: transSpecs.type }
    ],
    [
      { label: 'Drive Type', value: driveType },
      { label: 'Transfer Case', value: transSpecs.transferCase },
      { label: 'Differential', value: transSpecs.differential }
    ],
    [
      { label: 'Front Suspension', value: transSpecs.frontSuspension },
      { label: 'Rear Suspension', value: transSpecs.rearSuspension },
      { label: 'Brakes', value: transSpecs.brakes }
    ]
  ]

  // ── Feature categories ──────────────────────────────
  const featureCategories = [
    { key: 'comfort', label: 'Air Conditioning' },
    { key: 'convenience', label: 'Convenience' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'interior', label: 'Interior' },
    { key: 'exterior', label: 'Exterior' },
    { key: 'technology', label: 'Technology' },
    { key: 'safety', label: 'Safety' },
    { key: 'driverAssistance', label: 'Driver Assistance' }
  ]

  const vehicleInfoRows = [
    ['Condition', condition],
    [
      'Engine',
      engineSpecs.size
        ? `${engineSpecs.size} ${engineSpecs.type || ''}`.trim()
        : undefined
    ],
    ['Transmission', transmission],
    ['Fuel Type', fuelType],
    ['Drivetrain', driveType],
    ['Trim', specs.trim],
    ['Exterior Color', exteriorColor],
    ['Interior Color', interiorColor],
    ['Stock #', stockNumber],
    ['VIN', vin]
  ].filter(([, val]) => val !== undefined && val !== null && val !== '')

  return (
    <section className="page-content space-y-8">
      {/* ── Hero header ──────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-7 sm:px-10 sm:py-9 shadow-[0_12px_50px_rgba(2,6,23,0.35)]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-red-600/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-red-500 mb-2">
              {condition === 'new' ? 'New Arrival' : 'Certified Listing'} ·
              Stock&nbsp;{stockNumber || '—'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {year} {make} {model}
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              {specs.trim ? `${specs.trim} · ` : ''}
              {bodyType}
            </p>
          </div>
          <StoreStatusBadge />
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] items-start">
        {/* Left column */}
        <div className="space-y-8">
          {/* Gallery */}
          <MosaicGallery images={galleryImages} title={title} />

          {/* Price card */}
          <Card className="p-6 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
            {showSale && (
              <span className="absolute top-0 left-0 bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-br-xl">
                Special Offer
              </span>
            )}
            <div className={showSale ? 'mt-4' : ''}>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {year} {make} {model}
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                {specs.trim || title}
              </p>
              {mileage > 0 ? (
                <span className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                  <Icon.gauge className="h-3.5 w-3.5 text-red-600" />
                  {fmtNum(mileage)} miles
                </span>
              ) : condition === 'new' ? (
                <span className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <Icon.check className="h-3.5 w-3.5" />
                  New Vehicle
                </span>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-1">
                {showSale ? 'Sale Price' : 'Price'}
              </p>
              {showSale && (
                <p className="text-sm text-slate-400 mb-0.5">
                  Was <span className="line-through">{fmtCur(price)}</span>
                </p>
              )}
              <span className="text-4xl font-black text-red-600 tracking-tight">
                {fmtCur(showSale ? salePrice : price)}
              </span>
            </div>
          </Card>

          {/* ─── Vehicle Info + Description ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Vehicle Info */}
            <Card className="p-6">
              <SectionHeading eyebrow="At a glance" className="mb-4">
                Vehicle Info
              </SectionHeading>
              <dl className="divide-y divide-slate-100">
                {vehicleInfoRows.map(([label, val]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5 group"
                  >
                    <dt className="text-slate-500 font-semibold text-[13px] uppercase tracking-wide">
                      {label}
                    </dt>
                    <dd className="text-slate-900 font-extrabold text-sm text-right">
                      {val}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* Right: Description + Features */}
            <Card className="p-6">
              {description && (
                <>
                  <SectionHeading eyebrow="Overview" className="mb-4">
                    Description
                  </SectionHeading>
                  <p className="text-slate-600 leading-relaxed text-[15px] mb-4">
                    {description}
                  </p>
                  {dealerNotes && (
                    <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 mb-4">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Dealer Notes
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {dealerNotes}
                      </p>
                    </div>
                  )}
                </>
              )}

              {featureCategories.some(
                ({ key }) => features[key]?.length > 0
              ) && (
                <>
                  <SectionHeading eyebrow="Equipped with" className="mb-4 mt-2">
                    Features
                  </SectionHeading>
                  <div className="space-y-4">
                    {featureCategories.map(({ key, label }) => {
                      const list = features[key]
                      if (!list || list.length === 0) return null
                      return (
                        <div key={key}>
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            {label}
                          </h4>
                          <FeatureList items={list} />
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Financing / CARFAX bar */}
          <Card className="p-6 flex flex-wrap items-center justify-between gap-6 bg-gradient-to-r from-white to-slate-50">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex h-12 w-12 rounded-xl bg-red-50 items-center justify-center flex-shrink-0">
                <Icon.bolt className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-900 font-bold">
                  Financing Available
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  All credit types welcome · Fast approval
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <Link to={`/financing?vehicle=${vehicle._id}`}>Apply Now</Link>
              </Button>
              {media.carfaxUrl ? (
                <a
                  href={media.carfaxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <Icon.doc className="h-4 w-4 text-slate-500" />
                  SHOW ME THE <span className="text-blue-600">CARFAX</span>
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  CARFAX not available
                </p>
              )}
            </div>
          </Card>

          {/* ─── Standard Specifications ─── */}
          <Card className="p-6 sm:p-7 space-y-7">
            <SectionHeading eyebrow="Full breakdown">
              Standard Specifications
            </SectionHeading>

            {Object.values(engineSpecs).filter(Boolean).length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Icon.bolt className="h-3.5 w-3.5 text-red-600" />
                  Engine Details
                </h4>
                <SpecGrid columns={engineCols} />
              </div>
            )}

            {(Object.values(dims).filter(Boolean).length > 0 ||
              Object.values(weight).filter(Boolean).length > 0) && (
              <>
                <div className="border-t border-slate-100" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Icon.gauge className="h-3.5 w-3.5 text-red-600" />
                    Measurements & Capacity
                  </h4>
                  <SpecGrid columns={dimCols} />
                </div>
              </>
            )}

            {Object.values(transSpecs).filter(Boolean).length > 0 && (
              <>
                <div className="border-t border-slate-100" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Icon.shield className="h-3.5 w-3.5 text-red-600" />
                    Transmission & Drivetrain
                  </h4>
                  <SpecGrid columns={transCols} />
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Card className="p-5" id="quote-form">
            <QuoteForm vehicle={vehicle} />
          </Card>
          <Card className="p-5">
            <PaymentCalculator price={salePrice || price} />
          </Card>
          <div className="rounded-2xl bg-slate-900 px-5 py-4 flex items-center gap-3">
            <Icon.shield className="h-6 w-6 text-red-500 flex-shrink-0" />
            <p className="text-xs text-slate-300 leading-snug">
              Every Carnex vehicle is inspected and backed by our dealership
              guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* Similar vehicles */}
      {!relatedLoading && relatedVehicles.length > 0 && (
        <section className="space-y-4 pt-2">
          <SectionHeading eyebrow="You may also like">
            Similar Vehicles
          </SectionHeading>
          <VehicleGrid vehicles={relatedVehicles} view="grid" />
        </section>
      )}
    </section>
  )
}
