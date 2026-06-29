// client/src/pages/admin/AdminAuditLogs.jsx
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { AuditLogTable } from '../../components/admin/AuditLogTable'
import { Input } from '../../components/ui/Input'

export function AdminAuditLogs() {
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/admin/audit-logs', {
          params: { page, limit: 25, search: search || undefined }
        })
        if (!cancelled) {
          setLogs(data?.data?.items || data?.items || [])
          setPagination(data?.data?.pagination || data?.pagination || null)
        }
      } catch {
        // audit logs endpoint may not be wired yet; show empty gracefully
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [page, search])

  return (
    <section className="page-content space-y-6">
      <header className="space-y-1">
        <h1 className="text-page-title">Audit Logs</h1>
        <p className="text-body-muted text-sm">
          A chronological record of all administrative actions taken in this
          dashboard.
        </p>
      </header>

      <div className="card-surface p-5 space-y-4">
        <div className="max-w-sm">
          <Input
            id="audit-search"
            label="Search by action or actor email"
            placeholder="e.g. ADMIN_LOGIN"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <AuditLogTable
          logs={logs}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>
    </section>
  )
}
