// client/src/pages/admin/_LeadListPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LeadTable } from '../../components/admin/LeadTable'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { useLeads } from '../../hooks/useLeads'

const STATUS_OPTIONS = {
  finance: ['new', 'in-review', 'approved', 'rejected', 'archived'],
  tradeIn: ['new', 'contacted', 'appraised', 'completed', 'archived'],
  testDrive: ['new', 'confirmed', 'completed', 'cancelled', 'archived'],
  sourcing: ['new', 'searching', 'matched', 'closed', 'archived'],
  contact: ['new', 'responded', 'closed', 'archived']
}

export function LeadListPage({
  title,
  description,
  leadType,
  detailRoute,
  extraColumns = []
}) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { leads, pagination, loading, error } = useLeads(leadType, {
    search: search || undefined,
    status: status || undefined,
    page,
    limit: 20
  })

  const statusOpts = (STATUS_OPTIONS[leadType] || []).map((s) => ({
    label: s.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
    value: s
  }))

  const handleView = (lead) => {
    // detailRoute is e.g. "/admin/finance-leads"
    // lead._id is the MongoDB id
    navigate(`${detailRoute}/${lead._id}`)
  }

  return (
    <section className="page-content space-y-6">
      <header className="space-y-1">
        <h1 className="text-page-title">{title}</h1>
        {description && (
          <p className="text-body-muted text-sm">{description}</p>
        )}
      </header>

      {error && (
        <div
          className="text-sm text-red-600 bg-red-50 border border-red-100
                        rounded-md px-3 py-2"
        >
          {error}
        </div>
      )}

      <div className="card-surface p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              id="lead-search"
              label="Search"
              placeholder="Name, email, or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <div className="w-48">
            <Select
              id="lead-status"
              label="Status"
              options={[{ label: 'All statuses', value: '' }, ...statusOpts]}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        <LeadTable
          leads={leads}
          columns={extraColumns}
          loading={loading}
          emptyMessage="No leads found matching your filters."
          onView={detailRoute ? handleView : undefined}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>
    </section>
  )
}
