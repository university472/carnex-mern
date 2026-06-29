// client/src/components/admin/AuditLogTable.jsx
import { formatDateTime } from '../../utils/formatters'
import { Skeleton } from '../ui/Skeleton'
import { Pagination } from '../ui/Pagination'
import { Badge } from '../ui/Badge'

const ACTION_COLORS = {
  ADMIN_LOGIN: 'accent',
  ADMIN_LOGOUT: 'default',
  MFA_ENABLED: 'success',
  PASSWORD_CHANGED: 'accent',
  SETTINGS_UPDATED: 'accent',
  DEFAULT: 'default'
}

export function AuditLogTable({
  logs = [],
  loading,
  pagination,
  onPageChange
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    )
  }

  if (!logs.length) {
    return (
      <p className="text-sm text-brand-muted py-6 text-center">
        No audit log entries found.
      </p>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-border text-left text-brand-muted">
              <th className="py-2 pr-4 font-medium">Action</th>
              <th className="py-2 pr-4 font-medium">Actor</th>
              <th className="py-2 pr-4 font-medium">Entity</th>
              <th className="py-2 pr-4 font-medium">IP</th>
              <th className="py-2 pr-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((entry) => (
              <tr
                key={entry._id}
                className="border-b border-brand-border/60 hover:bg-brand-surface/50 transition-colors"
              >
                <td className="py-2 pr-4">
                  <Badge
                    variant={
                      ACTION_COLORS[entry.action] || ACTION_COLORS.DEFAULT
                    }
                  >
                    {entry.action?.replace(/_/g, ' ')}
                  </Badge>
                </td>
                <td className="py-2 pr-4">
                  {/* Enhanced actor display (merged from new version) */}
                  <p className="font-medium text-brand-secondary">
                    {entry.actor?.name || '—'}
                  </p>
                  <p className="text-brand-muted">{entry.actor?.email || ''}</p>
                </td>
                <td className="py-2 pr-4 text-brand-muted">
                  {entry.entity || '—'}
                  {entry.entityId
                    ? ` #${String(entry.entityId).slice(-6)}`
                    : ''}
                </td>
                <td className="py-2 pr-4 text-brand-muted font-mono">
                  {entry.ip || '—'}
                </td>
                <td className="py-2 pr-4 text-brand-muted">
                  {formatDateTime(entry.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={onPageChange}
        />
      )}
    </div>
  )
}
