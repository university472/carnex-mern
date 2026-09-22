// // client/src/pages/admin/AdminLeadDetail.jsx
// import { useParams, useNavigate, useLocation } from 'react-router-dom'
// import { useState, useEffect } from 'react'
// import api from '../../services/api'
// import { LeadStatusBadge } from '../../components/admin/LeadStatusBadge'
// import { LeadNotes } from '../../components/admin/LeadNotes'
// import { Button } from '../../components/ui/Button'
// import { Select } from '../../components/ui/Select'
// import { Skeleton } from '../../components/ui/Skeleton'
// import { formatDateTime } from '../../utils/formatters'
// import { useToast } from '../../hooks/useToast'

// // Map URL path segment → backend API type param
// // URL:     /admin/finance-leads/:id
// // API:     /admin/leads/finance/:id
// const URL_TO_API_TYPE = {
//   'finance-leads': 'finance',
//   'trade-in-leads': 'trade-in',
//   'test-drive-leads': 'test-drive',
//   'sourcing-leads': 'sourcing',
//   'contact-leads': 'contact'
// }

// // Map API type → human label
// const TYPE_LABELS = {
//   finance: 'Financing Application',
//   'trade-in': 'Trade-In Request',
//   'test-drive': 'Test Drive Request',
//   sourcing: 'Sourcing Request',
//   contact: 'Contact Message'
// }

// // Available statuses per lead type
// const STATUS_OPTIONS = {
//   finance: ['new', 'in-review', 'approved', 'rejected', 'archived'],
//   'trade-in': ['new', 'contacted', 'appraised', 'completed', 'archived'],
//   'test-drive': ['new', 'confirmed', 'completed', 'cancelled', 'archived'],
//   sourcing: ['new', 'searching', 'matched', 'closed', 'archived'],
//   contact: ['new', 'responded', 'closed', 'archived']
// }

// // Fields to always hide in the detail view
// const HIDDEN_FIELDS = new Set([
//   '_id',
//   '__v',
//   'ip',
//   'userAgent',
//   'createdAt',
//   'updatedAt',
//   'status',
//   'notes',
//   'source'
// ])

// // Format a field key into a readable label
// function formatKey(key) {
//   return key
//     .replace(/([A-Z])/g, ' $1')
//     .replace(/_/g, ' ')
//     .replace(/^./, (c) => c.toUpperCase())
//     .trim()
// }

// // Format a field value for display
// function formatValue(val) {
//   if (val === null || val === undefined || val === '') return '—'
//   if (typeof val === 'boolean') return val ? 'Yes' : 'No'
//   if (Array.isArray(val)) return val.length ? val.join(', ') : '—'
//   if (typeof val === 'object') return JSON.stringify(val)
//   return String(val)
// }

// export function AdminLeadDetail() {
//   // const { type, id } = useParams()
//   const { id } = useParams()
//   const location = useLocation()

//   const pathSegment = location.pathname.split('/')[2]

//   const apiType = URL_TO_API_TYPE[pathSegment]
//   const navigate = useNavigate()
//   const toast = useToast()

//   // Resolve API type from URL segment
//   // const apiType = URL_TO_API_TYPE[type]

//   const [lead, setLead] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [updating, setUpdating] = useState(false)
//   const [savingNotes, setSavingNotes] = useState(false)

//   useEffect(() => {
//     if (!apiType) {
//       setError(`Unknown lead type: "${pathSegment}"`)
//       setLoading(false)
//       return
//     }

//     if (!id) {
//       setError('No lead ID provided')
//       setLoading(false)
//       return
//     }

//     let cancelled = false

//     const load = async () => {
//       setLoading(true)
//       setError(null)
//       try {
//         const { data } = await api.get(`/admin/leads/${apiType}/${id}`)
//         if (!cancelled) {
//           // Support both wrapped and unwrapped responses
//           setLead(data?.data || data)
//         }
//       } catch (err) {
//         if (!cancelled) {
//           const msg =
//             err?.response?.data?.message ||
//             err?.message ||
//             'Failed to load lead'
//           setError(msg)
//         }
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     load()
//     return () => {
//       cancelled = true
//     }
//   }, [apiType, id])

//   const handleStatusChange = async (newStatus) => {
//     if (!lead || !apiType) return
//     setUpdating(true)
//     try {
//       const { data } = await api.patch(`/admin/leads/${apiType}/${lead._id}`, {
//         status: newStatus
//       })
//       setLead((prev) => ({
//         ...prev,
//         status: (data?.data || data)?.status || newStatus
//       }))
//       toast.success('Status updated')
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Failed to update status')
//     } finally {
//       setUpdating(false)
//     }
//   }

//   const handleSaveNotes = async (notes) => {
//     if (!lead || !apiType) return
//     setSavingNotes(true)
//     try {
//       await api.patch(`/admin/leads/${apiType}/${lead._id}`, { notes })
//       setLead((prev) => ({ ...prev, notes }))
//       toast.success('Notes saved')
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Failed to save notes')
//     } finally {
//       setSavingNotes(false)
//     }
//   }

//   // ── Loading ────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <section className="page-content space-y-5">
//         <Skeleton className="h-7 w-48" />
//         <div className="grid gap-5 lg:grid-cols-3">
//           <div className="lg:col-span-2 space-y-3">
//             <Skeleton className="h-64 w-full" />
//           </div>
//           <div className="space-y-3">
//             <Skeleton className="h-40 w-full" />
//             <Skeleton className="h-40 w-full" />
//           </div>
//         </div>
//       </section>
//     )
//   }

//   // ── Error ──────────────────────────────────────────────────
//   if (error || !lead) {
//     return (
//       <section className="page-content">
//         <div className="card-surface p-6 text-center space-y-4">
//           <p className="text-sm font-medium text-red-600">
//             {error || 'Lead not found'}
//           </p>
//           <p className="text-xs text-brand-muted">
//             Type:{' '}
//             <code className="bg-gray-100 px-1 rounded">{pathSegment}</code>
//             {' → '}
//             API:{' '}
//             <code className="bg-gray-100 px-1 rounded">
//               {apiType || 'unknown'}
//             </code>
//             {' → '}
//             ID: <code className="bg-gray-100 px-1 rounded">{id}</code>
//           </p>
//           <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
//             ← Go Back
//           </Button>
//         </div>
//       </section>
//     )
//   }

//   // ── Build display fields (exclude hidden ones) ─────────────
//   const displayFields = Object.entries(lead).filter(
//     ([key]) => !HIDDEN_FIELDS.has(key)
//   )

//   const statusOptions = (STATUS_OPTIONS[apiType] || []).map((s) => ({
//     label: s.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
//     value: s
//   }))

//   const leadName =
//     lead.name ||
//     [lead.firstName, lead.lastName].filter(Boolean).join(' ') ||
//     '—'

//   return (
//     <section className="page-content space-y-6">
//       {/* ── Header ──────────────────────────────────────────── */}
//       <header className="flex flex-wrap items-start justify-between gap-3">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2 text-xs text-brand-muted">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="hover:text-brand-primary transition-colors"
//             >
//               ← Back
//             </button>
//             <span>/</span>
//             <span>{TYPE_LABELS[apiType] || pathSegment}</span>
//           </div>
//           <h1 className="text-page-title text-xl">{leadName}</h1>
//           <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
//             <LeadStatusBadge status={lead.status} />
//             <span>•</span>
//             <span>Submitted {formatDateTime(lead.createdAt)}</span>
//             {lead.source && (
//               <>
//                 <span>•</span>
//                 <span>via {lead.source}</span>
//               </>
//             )}
//           </div>
//         </div>
//       </header>

//       <div className="grid gap-5 lg:grid-cols-3">
//         {/* ── Left: lead details ──────────────────────────────── */}
//         <div className="lg:col-span-2 space-y-5">
//           <div className="card-surface p-5 space-y-4">
//             <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
//               Submission Details
//             </h2>

//             <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
//               {displayFields.map(([key, val]) => (
//                 <div key={key} className="space-y-0.5">
//                   <dt className="text-xs text-brand-muted font-medium">
//                     {formatKey(key)}
//                   </dt>
//                   <dd className="text-brand-secondary break-words">
//                     {formatValue(val)}
//                   </dd>
//                 </div>
//               ))}
//             </dl>
//           </div>

//           {/* Raw meta */}
//           <div className="card-surface p-4 space-y-2">
//             <h2 className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
//               Submission Metadata
//             </h2>
//             <div className="grid gap-2 sm:grid-cols-2 text-xs">
//               <div>
//                 <p className="text-brand-muted">Lead ID</p>
//                 <p className="font-mono text-brand-secondary break-all">
//                   {lead._id}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-brand-muted">Submitted</p>
//                 <p className="text-brand-secondary">
//                   {formatDateTime(lead.createdAt)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-brand-muted">Last updated</p>
//                 <p className="text-brand-secondary">
//                   {formatDateTime(lead.updatedAt)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-brand-muted">Source</p>
//                 <p className="text-brand-secondary">
//                   {lead.source || 'website'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Right: status + notes ──────────────────────────── */}
//         <div className="space-y-4">
//           {/* Status card */}
//           <div className="card-surface p-4 space-y-3">
//             <h2 className="text-sm font-semibold text-brand-secondary">
//               Lead Status
//             </h2>

//             <div className="flex items-center gap-2">
//               <LeadStatusBadge status={lead.status} />
//               <span className="text-xs text-brand-muted">current</span>
//             </div>

//             {statusOptions.length > 0 && (
//               <Select
//                 id="lead-status-select"
//                 label="Update status"
//                 options={statusOptions}
//                 value={lead.status || ''}
//                 onChange={(e) => handleStatusChange(e.target.value)}
//                 disabled={updating}
//               />
//             )}

//             {updating && <p className="text-xs text-brand-muted">Updating…</p>}
//           </div>

//           {/* Notes card */}
//           <div className="card-surface p-4">
//             <LeadNotes
//               notes={lead.notes || ''}
//               onSave={handleSaveNotes}
//               saving={savingNotes}
//             />
//           </div>

//           {/* Quick contact */}
//           {(lead.email || lead.phone) && (
//             <div className="card-surface p-4 space-y-2">
//               <h2 className="text-sm font-semibold text-brand-secondary">
//                 Quick Contact
//               </h2>
//               {lead.email && (
//                 <a
//                   href={`mailto:${lead.email}`}
//                   className="flex items-center gap-2 text-xs text-brand-primary hover:underline"
//                 >
//                   <svg
//                     width="12"
//                     height="12"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   >
//                     <rect width="20" height="16" x="2" y="4" rx="2" />
//                     <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//                   </svg>
//                   {lead.email}
//                 </a>
//               )}
//               {lead.phone && (
//                 <a
//                   href={`tel:${lead.phone}`}
//                   className="flex items-center gap-2 text-xs text-brand-primary hover:underline"
//                 >
//                   <svg
//                     width="12"
//                     height="12"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   >
//                     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.3a16 16 0 0 0 5.82 5.82l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
//                   </svg>
//                   {lead.phone}
//                 </a>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   )
// }

// client/src/pages/admin/AdminLeadDetail.jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { LeadStatusBadge } from '../../components/admin/LeadStatusBadge'
import { LeadNotes } from '../../components/admin/LeadNotes'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDateTime, formatPrice } from '../../utils/formatters'
import { useToast } from '../../hooks/useToast'

// Map URL path segment → backend API type param
const URL_TO_API_TYPE = {
  'finance-leads': 'finance',
  'trade-in-leads': 'trade-in',
  'test-drive-leads': 'test-drive',
  'sourcing-leads': 'sourcing',
  'contact-leads': 'contact'
}

const TYPE_LABELS = {
  finance: 'Financing Application',
  'trade-in': 'Trade-In Request',
  'test-drive': 'Test Drive Request',
  sourcing: 'Sourcing Request',
  contact: 'Contact Message'
}

const STATUS_OPTIONS = {
  finance: ['new', 'in-review', 'approved', 'rejected', 'archived'],
  'trade-in': ['new', 'contacted', 'appraised', 'completed', 'archived'],
  'test-drive': ['new', 'confirmed', 'completed', 'cancelled', 'archived'],
  sourcing: ['new', 'searching', 'matched', 'closed', 'archived'],
  contact: ['new', 'responded', 'closed', 'archived']
}

// Fields to always hide in the generic detail view
const HIDDEN_FIELDS = new Set([
  '_id',
  '__v',
  'ip',
  'userAgent',
  'createdAt',
  'updatedAt',
  'status',
  'notes',
  'source',
  'consent' // handled separately in custom sections
])

// Format a field key into a readable label
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

// Generic fallback value formatter (safe for simple values)
function formatValue(val) {
  if (val === null || val === undefined || val === '') return '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (Array.isArray(val)) return val.length ? val.join(', ') : '—'
  if (typeof val === 'object') return JSON.stringify(val) // fallback
  return String(val)
}

// Helper to safely get a nested value from an object
function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// Finance-specific formatter for a field label + value
function FinanceField({
  label,
  value,
  isDate = false,
  isPrice = false,
  formatter
}) {
  let display = value
  if (display === null || display === undefined || display === '') {
    display = '—'
  } else if (formatter) {
    display = formatter(display)
  } else if (isDate) {
    display = formatDateTime(display)
  } else if (isPrice) {
    display = formatPrice(display)
  } else if (typeof display === 'boolean') {
    display = display ? 'Yes' : 'No'
  } else if (typeof display === 'object') {
    display = JSON.stringify(display) // fallback for unexpected nested objects
  } else {
    display = String(display)
  }

  return (
    <div>
      <dt className="text-xs text-brand-muted font-medium">{label}</dt>
      <dd className="text-brand-secondary break-words">{display}</dd>
    </div>
  )
}

export function AdminLeadDetail() {
  const { id } = useParams()
  const location = useLocation()
  const pathSegment = location.pathname.split('/')[2]
  const apiType = URL_TO_API_TYPE[pathSegment]
  const navigate = useNavigate()
  const toast = useToast()

  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    if (!apiType) {
      setError(`Unknown lead type: "${pathSegment}"`)
      setLoading(false)
      return
    }

    if (!id) {
      setError('No lead ID provided')
      setLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get(`/admin/leads/${apiType}/${id}`)
        if (!cancelled) {
          setLead(data?.data || data)
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to load lead'
          setError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [apiType, id])

  const handleStatusChange = async (newStatus) => {
    if (!lead || !apiType) return
    setUpdating(true)
    try {
      const { data } = await api.patch(`/admin/leads/${apiType}/${lead._id}`, {
        status: newStatus
      })
      setLead((prev) => ({
        ...prev,
        status: (data?.data || data)?.status || newStatus
      }))
      toast.success('Status updated')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveNotes = async (notes) => {
    if (!lead || !apiType) return
    setSavingNotes(true)
    try {
      await api.patch(`/admin/leads/${apiType}/${lead._id}`, { notes })
      setLead((prev) => ({ ...prev, notes }))
      toast.success('Notes saved')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="page-content space-y-5">
        <Skeleton className="h-7 w-48" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </section>
    )
  }

  // ── Error ──────────────────────────────────────────────────
  if (error || !lead) {
    return (
      <section className="page-content">
        <div className="card-surface p-6 text-center space-y-4">
          <p className="text-sm font-medium text-red-600">
            {error || 'Lead not found'}
          </p>
          <p className="text-xs text-brand-muted">
            Type:{' '}
            <code className="bg-gray-100 px-1 rounded">{pathSegment}</code>
            {' → '}
            API:{' '}
            <code className="bg-gray-100 px-1 rounded">
              {apiType || 'unknown'}
            </code>
            {' → '}
            ID: <code className="bg-gray-100 px-1 rounded">{id}</code>
          </p>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← Go Back
          </Button>
        </div>
      </section>
    )
  }

  const statusOptions = (STATUS_OPTIONS[apiType] || []).map((s) => ({
    label: s.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
    value: s
  }))

  const leadName =
    lead.name ||
    [lead.firstName, lead.lastName].filter(Boolean).join(' ') ||
    '—'

  // ── Determine rendering mode ───────────────────────────────
  const isFinance = apiType === 'finance'
  const isContact = apiType === 'contact'
  const isTradeIn = apiType === 'trade-in'
  const isTestDrive = apiType === 'test-drive'
  const isSourcing = apiType === 'sourcing'

  // Build generic fields (for non-finance, non-contact, non-trade-in, non-test-drive, non-sourcing)
  const genericDisplayFields = Object.entries(lead).filter(
    ([key]) => !HIDDEN_FIELDS.has(key)
  )

  return (
    <section className="page-content space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="hover:text-brand-primary transition-colors"
            >
              ← Back
            </button>
            <span>/</span>
            <span>{TYPE_LABELS[apiType] || pathSegment}</span>
          </div>
          <h1 className="text-page-title text-xl">{leadName}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
            <LeadStatusBadge status={lead.status} />
            <span>•</span>
            <span>Submitted {formatDateTime(lead.createdAt)}</span>
            {lead.source && (
              <>
                <span>•</span>
                <span>via {lead.source}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ── Left: lead details ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {isFinance ? (
            /* ============ FINANCE SPECIFIC LAYOUT ============ */
            <>
              {/* Personal Information */}
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Personal Information
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <FinanceField label="First Name" value={lead.firstName} />
                  <FinanceField label="Last Name" value={lead.lastName} />
                  <FinanceField label="Email" value={lead.email} />
                  <FinanceField label="Phone" value={lead.phone} />
                  <FinanceField
                    label="Birthdate"
                    value={lead.birthdate}
                    isDate
                  />
                  <FinanceField label="SSN" value={lead.ssn} />
                </dl>
              </div>

              {/* Driver's License */}
              {lead.driverLicense && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Driver's License
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField
                      label="Number"
                      value={lead.driverLicense.number}
                    />
                    <FinanceField
                      label="State"
                      value={lead.driverLicense.state}
                    />
                    <FinanceField
                      label="Issue Date"
                      value={lead.driverLicense.issueDate}
                      isDate
                    />
                    <FinanceField
                      label="Expiry Date"
                      value={lead.driverLicense.expiryDate}
                      isDate
                    />
                    <FinanceField
                      label="County"
                      value={lead.driverLicense.county}
                    />
                  </dl>
                </div>
              )}

              {/* Address */}
              {lead.address && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Address
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField
                      label="Residence Type"
                      value={lead.address.residenceType}
                    />
                    <FinanceField
                      label="Monthly Payment"
                      value={lead.address.monthlyPayment}
                      isPrice
                    />
                    <FinanceField label="Years" value={lead.address.years} />
                    <FinanceField label="Months" value={lead.address.months} />
                    <div className="sm:col-span-2">
                      <FinanceField
                        label="Street"
                        value={lead.address.street}
                      />
                    </div>
                    <FinanceField label="City" value={lead.address.city} />
                    <FinanceField label="State" value={lead.address.state} />
                    <FinanceField label="ZIP" value={lead.address.zip} />
                  </dl>
                </div>
              )}

              {/* Employment */}
              {lead.employment && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Employment
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField
                      label="Status"
                      value={lead.employment.status}
                    />
                    <FinanceField
                      label="Employer"
                      value={lead.employment.employer}
                    />
                    <FinanceField
                      label="Job Title"
                      value={lead.employment.jobTitle}
                    />
                    <FinanceField
                      label="Employer Phone"
                      value={lead.employment.employerPhone}
                    />
                    <FinanceField
                      label="Income"
                      value={lead.employment.income}
                      isPrice
                    />
                    <FinanceField
                      label="Income Interval"
                      value={lead.employment.incomeInterval}
                    />
                    <FinanceField label="Years" value={lead.employment.years} />
                    <FinanceField
                      label="Months"
                      value={lead.employment.months}
                    />
                    <FinanceField
                      label="Other Income"
                      value={lead.employment.otherIncome}
                      isPrice
                    />
                  </dl>
                </div>
              )}

              {/* Vehicle */}
              {lead.vehicle && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Vehicle
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField label="VIN" value={lead.vehicle.vin} />
                    <FinanceField label="Year" value={lead.vehicle.year} />
                    <FinanceField label="Make" value={lead.vehicle.make} />
                    <FinanceField label="Model" value={lead.vehicle.model} />
                    <FinanceField
                      label="Price"
                      value={lead.vehicle.price}
                      isPrice
                    />
                    <FinanceField
                      label="Mileage"
                      value={lead.vehicle.mileage}
                    />
                  </dl>
                </div>
              )}

              {/* Desired Loan */}
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Desired Loan
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <FinanceField
                    label="Loan Amount"
                    value={lead.desiredAmount}
                    isPrice
                  />
                  <FinanceField
                    label="Down Payment"
                    value={lead.downPayment}
                    isPrice
                  />
                  <FinanceField label="Term (months)" value={lead.termMonths} />
                  <FinanceField
                    label="Preferred Monthly Payment"
                    value={lead.preferredMonthlyPayment}
                    isPrice
                  />
                </dl>
              </div>

              {/* Authorization Agreement */}
              {lead.consent && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Authorization Agreement
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField
                      label="Accepted"
                      value={lead.consent.accepted}
                    />
                    <FinanceField
                      label="Accepted At"
                      value={lead.consent.acceptedAt}
                      isDate
                    />
                    <div className="sm:col-span-2">
                      <FinanceField
                        label="Text Version"
                        value={lead.consent.textVersion}
                      />
                    </div>
                  </dl>
                </div>
              )}
            </>
          ) : isContact ? (
            /* ============ CONTACT SPECIFIC LAYOUT ============ */
            <>
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Message
                </h2>
                <p className="text-brand-secondary whitespace-pre-line break-words">
                  {lead.message || '—'}
                </p>
              </div>
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Contact Information
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="text-xs text-brand-muted font-medium">
                      Name
                    </dt>
                    <dd className="text-brand-secondary break-words">
                      {lead.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-brand-muted font-medium">
                      Email
                    </dt>
                    <dd className="text-brand-secondary break-words">
                      {lead.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-brand-muted font-medium">
                      Phone
                    </dt>
                    <dd className="text-brand-secondary break-words">
                      {lead.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-brand-muted font-medium">
                      Topic
                    </dt>
                    <dd className="text-brand-secondary break-words">
                      {lead.topic || '—'}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-brand-muted font-medium">
                      Subject
                    </dt>
                    <dd className="text-brand-secondary break-words">
                      {lead.subject || '—'}
                    </dd>
                  </div>
                </dl>
              </div>
              {lead.consent && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Authorization Agreement
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField
                      label="Accepted"
                      value={lead.consent.accepted}
                    />
                    <FinanceField
                      label="Accepted At"
                      value={lead.consent.acceptedAt}
                      isDate
                    />
                    <div className="sm:col-span-2">
                      <FinanceField
                        label="Text Version"
                        value={lead.consent.textVersion}
                      />
                    </div>
                  </dl>
                </div>
              )}
            </>
          ) : isTradeIn ? (
            /* ============ TRADE-IN SPECIFIC LAYOUT ============ */
            <>
              {/* Contact Information */}
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Contact Information
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <FinanceField label="Name" value={lead.name} />
                  <FinanceField label="Email" value={lead.email} />
                  <FinanceField label="Phone" value={lead.phone} />
                </dl>
              </div>

              {/* Trade-In Vehicle */}
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Trade-In Vehicle
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <FinanceField label="Year" value={lead.year} />
                  <FinanceField label="Make" value={lead.make} />
                  <FinanceField label="Model" value={lead.model} />
                  <FinanceField
                    label="Mileage"
                    value={lead.mileage}
                    formatter={(val) =>
                      Number(val).toLocaleString('en-US') + ' mi'
                    }
                  />
                  <FinanceField label="VIN" value={lead.vin} />
                  <FinanceField
                    label="Condition"
                    value={lead.condition}
                    formatter={(val) =>
                      val
                        ? val.charAt(0).toUpperCase() +
                          val.slice(1).toLowerCase()
                        : '—'
                    }
                  />
                </dl>
              </div>

              {/* Authorization Agreement */}
              {lead.consent && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Authorization Agreement
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField
                      label="Accepted"
                      value={lead.consent.accepted}
                    />
                    <FinanceField
                      label="Accepted At"
                      value={lead.consent.acceptedAt}
                      isDate
                    />
                    <div className="sm:col-span-2">
                      <FinanceField
                        label="Text Version"
                        value={lead.consent.textVersion}
                      />
                    </div>
                  </dl>
                </div>
              )}
            </>
          ) : isTestDrive ? (
            /* ============ TEST DRIVE SPECIFIC LAYOUT ============ */
            <>
              {/* Contact Information */}
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Contact Information
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <FinanceField label="Name" value={lead.name} />
                  <FinanceField label="Email" value={lead.email} />
                  <FinanceField label="Phone" value={lead.phone} />
                </dl>
              </div>

              {/* Test Drive Details */}
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Test Drive Details
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <FinanceField label="Vehicle" value={lead.vehicleTitle} />
                  <FinanceField
                    label="Preferred Date"
                    value={lead.preferredDate}
                    isDate
                  />
                  <FinanceField
                    label="Preferred Time Slot"
                    value={lead.preferredTimeSlot}
                  />
                </dl>
              </div>

              {/* Authorization Agreement */}
              {lead.consent && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Authorization Agreement
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField
                      label="Accepted"
                      value={lead.consent.accepted}
                    />
                    <FinanceField
                      label="Accepted At"
                      value={lead.consent.acceptedAt}
                      isDate
                    />
                    <div className="sm:col-span-2">
                      <FinanceField
                        label="Text Version"
                        value={lead.consent.textVersion}
                      />
                    </div>
                  </dl>
                </div>
              )}
            </>
          ) : isSourcing ? (
            /* ============ SOURCING SPECIFIC LAYOUT ============ */
            <>
              {/* Contact Information */}
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Contact Information
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <FinanceField label="Name" value={lead.name} />
                  <FinanceField label="Email" value={lead.email} />
                  <FinanceField label="Phone" value={lead.phone} />
                </dl>
              </div>

              {/* Sourcing Request Details */}
              <div className="card-surface p-5 space-y-4">
                <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                  Sourcing Request Details
                </h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <FinanceField label="Desired Make" value={lead.desiredMake} />
                  <FinanceField
                    label="Desired Model"
                    value={lead.desiredModel}
                  />
                  <FinanceField
                    label="Max Budget"
                    value={lead.desiredBudgetMax}
                    isPrice
                  />
                  <FinanceField
                    label="Desired Body Type"
                    value={lead.desiredBodyType}
                  />
                  {/* You can add more fields if they exist, e.g., desiredYear, desiredMileage, etc. */}
                </dl>
              </div>

              {/* Authorization Agreement */}
              {lead.consent && (
                <div className="card-surface p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                    Authorization Agreement
                  </h2>
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                    <FinanceField
                      label="Accepted"
                      value={lead.consent.accepted}
                    />
                    <FinanceField
                      label="Accepted At"
                      value={lead.consent.acceptedAt}
                      isDate
                    />
                    <div className="sm:col-span-2">
                      <FinanceField
                        label="Text Version"
                        value={lead.consent.textVersion}
                      />
                    </div>
                  </dl>
                </div>
              )}
            </>
          ) : (
            /* ============ GENERIC FALLBACK ============ */
            <div className="card-surface p-5 space-y-4">
              <h2 className="text-sm font-semibold text-brand-secondary border-b border-brand-border pb-2">
                Submission Details
              </h2>
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                {genericDisplayFields.map(([key, val]) => (
                  <div key={key} className="space-y-0.5">
                    <dt className="text-xs text-brand-muted font-medium">
                      {formatKey(key)}
                    </dt>
                    <dd className="text-brand-secondary break-words whitespace-pre-line">
                      {formatValue(val)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Raw meta (shared by all lead types) */}
          <div className="card-surface p-4 space-y-2">
            <h2 className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
              Submission Metadata
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              <div>
                <p className="text-brand-muted">Lead ID</p>
                <p className="font-mono text-brand-secondary break-all">
                  {lead._id}
                </p>
              </div>
              <div>
                <p className="text-brand-muted">Submitted</p>
                <p className="text-brand-secondary">
                  {formatDateTime(lead.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-brand-muted">Last updated</p>
                <p className="text-brand-secondary">
                  {formatDateTime(lead.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-brand-muted">Source</p>
                <p className="text-brand-secondary">
                  {lead.source || 'website'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: status + notes ──────────────────────────── */}
        <div className="space-y-4">
          {/* Status card */}
          <div className="card-surface p-4 space-y-3">
            <h2 className="text-sm font-semibold text-brand-secondary">
              Lead Status
            </h2>

            <div className="flex items-center gap-2">
              <LeadStatusBadge status={lead.status} />
              <span className="text-xs text-brand-muted">current</span>
            </div>

            {statusOptions.length > 0 && (
              <Select
                id="lead-status-select"
                label="Update status"
                options={statusOptions}
                value={lead.status || ''}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
              />
            )}

            {updating && <p className="text-xs text-brand-muted">Updating…</p>}
          </div>

          {/* Notes card */}
          <div className="card-surface p-4">
            <LeadNotes
              notes={lead.notes || ''}
              onSave={handleSaveNotes}
              saving={savingNotes}
            />
          </div>

          {/* Quick contact */}
          {(lead.email || lead.phone) && (
            <div className="card-surface p-4 space-y-2">
              <h2 className="text-sm font-semibold text-brand-secondary">
                Quick Contact
              </h2>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 text-xs text-brand-primary hover:underline"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {lead.email}
                </a>
              )}
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2 text-xs text-brand-primary hover:underline"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.3a16 16 0 0 0 5.82 5.82l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {lead.phone}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
