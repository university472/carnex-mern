// client/src/components/admin/LeadTable.jsx
import { LeadStatusBadge } from './LeadStatusBadge'
import { formatDate } from '../../utils/formatters'
import { Skeleton } from '../ui/Skeleton'
import { Button } from '../ui/Button'
import { Pagination } from '../ui/Pagination'

/**
 * Reusable admin lead table.
 *
 * @param {Array}    leads
 * @param {Array}    columns        - [{key, label, render?}]
 * @param {boolean}  loading
 * @param {string}   emptyMessage
 * @param {function} onView         - called with lead object
 * @param {Object}   pagination     - backend pagination object
 * @param {function} onPageChange
 */
export function LeadTable({
  leads = [],
  columns = [],
  loading,
  emptyMessage = 'No leads found.',
  onView,
  pagination,
  onPageChange
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (!leads.length) {
    return (
      <p className="text-sm text-brand-muted py-8 text-center">
        {emptyMessage}
      </p>
    )
  }

  // Backend returns either totalItems or total — support both
  const totalPages =
    pagination?.totalPages ||
    (pagination?.totalItems && pagination?.limit
      ? Math.ceil(pagination.totalItems / pagination.limit)
      : 1)

  const currentPage = pagination?.page || 1

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-border text-left text-brand-muted">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Phone</th>
              {columns.map((col) => (
                <th key={col.key} className="py-2 pr-4 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              {onView && <th className="py-2 font-medium">Action</th>}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const leadId = lead._id || lead.id
              const name =
                lead.name ||
                [lead.firstName, lead.lastName].filter(Boolean).join(' ') ||
                '—'

              return (
                <tr
                  key={leadId}
                  className="border-b border-brand-border/60
                             hover:bg-brand-surface/50 transition-colors"
                >
                  <td className="py-2.5 pr-4 font-medium text-brand-secondary">
                    {name}
                  </td>
                  <td className="py-2.5 pr-4 text-brand-muted">
                    {lead.email || '—'}
                  </td>
                  <td className="py-2.5 pr-4 text-brand-muted">
                    {lead.phone || '—'}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="py-2.5 pr-4 text-brand-muted">
                      {col.render ? col.render(lead) : lead[col.key] || '—'}
                    </td>
                  ))}
                  <td className="py-2.5 pr-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="py-2.5 pr-4 text-brand-muted">
                    {formatDate(lead.createdAt)}
                  </td>
                  {onView && (
                    <td className="py-2.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(lead)}
                      >
                        View
                      </Button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      )}
    </div>
  )
}
