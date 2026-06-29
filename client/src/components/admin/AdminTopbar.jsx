// client/src/components/admin/AdminTopbar.jsx
import { useAuth } from '../../hooks/useAuth'

export function AdminTopbar({ title }) {
  const { user } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-brand-border bg-brand-bg px-4 py-3">
      <div>
        <h1 className="text-sm font-semibold text-brand-secondary">
          {title || 'Dashboard'}
        </h1>
        <p className="text-[11px] text-brand-muted">
          Manage inventory and leads
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-brand-muted">
        <div className="text-right">
          <p className="font-medium text-brand-secondary">
            {user?.name || 'Admin'}
          </p>
          <p>{user?.email || 'admin@carnex.com'}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-secondary text-[11px] font-semibold text-gray-100">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
      </div>
    </header>
  )
}
