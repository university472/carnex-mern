// client/src/components/layout/AdminLayout.jsx
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

const NAV = [
  { label: 'Dashboard', path: '/admin', end: true },
  { label: 'Vehicles', path: '/admin/vehicles' },
  { label: '— Leads', disabled: true },
  { label: 'Financing', path: '/admin/finance-leads' },
  { label: 'Trade-In', path: '/admin/trade-in-leads' },
  { label: 'Test Drive', path: '/admin/test-drive-leads' },
  { label: 'Sourcing', path: '/admin/sourcing-leads' },
  { label: 'Contact', path: '/admin/contact-leads' },
  { label: '— Insights', disabled: true },
  { label: 'Analytics', path: '/admin/analytics' },
  { label: '— Admin', disabled: true },
  { label: 'Users', path: '/admin/users' },
  { label: 'Audit Logs', path: '/admin/audit-logs' },
  { label: 'Settings', path: '/admin/settings' }
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-brand-secondary text-gray-100">
      <div className="flex min-h-screen">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside
          className={`flex flex-col border-r border-white/10
                      bg-brand-secondary/95 transition-all duration-200
                      ${collapsed ? 'w-14' : 'w-56'}`}
        >
          <div
            className="flex items-center justify-between px-3 py-4
                          border-b border-white/10"
          >
            {!collapsed && (
              <Link
                to="/admin"
                className="text-xs font-semibold tracking-wide text-white"
              >
                Carnex Admin
              </Link>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="text-gray-400 hover:text-white text-sm ml-auto"
              aria-label="Toggle sidebar"
            >
              {collapsed ? '›' : '‹'}
            </button>
          </div>

          <nav
            className="flex-1 px-2 py-3 space-y-0.5 text-xs
                          overflow-y-auto"
          >
            {NAV.map((item, i) => {
              if (item.disabled) {
                return collapsed ? null : (
                  <p
                    key={i}
                    className="px-3 pt-3 pb-1 text-[10px] uppercase
                               tracking-widest text-gray-500"
                  >
                    {item.label.replace('— ', '')}
                  </p>
                )
              }
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2
                     font-medium transition-colors ${
                       isActive
                         ? 'bg-white/10 text-white'
                         : 'text-gray-300 hover:bg-white/8 hover:text-white'
                     }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  {!collapsed && item.label}
                  {collapsed && item.label.charAt(0)}
                </NavLink>
              )
            })}
          </nav>

          {/* User info + logout */}
          <div className="border-t border-white/10 px-3 py-3 space-y-2">
            {!collapsed && user && (
              <div className="px-1 py-1">
                <p className="text-[11px] font-medium text-gray-200 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {user.email}
                </p>
                <span
                  className="inline-block mt-1 text-[9px] uppercase
                                 tracking-wide text-red-400 font-semibold"
                >
                  {user.role}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-xs text-gray-300
                         hover:text-white border-white/20"
              onClick={handleLogout}
            >
              {collapsed ? '→' : 'Sign out'}
            </Button>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────── */}
        <main className="flex-1 bg-brand-bg overflow-auto">
          <header
            className="flex items-center justify-between border-b
                       border-brand-border bg-white px-4 py-2.5 text-xs
                       text-brand-muted sticky top-0 z-10"
          >
            <span className="font-medium text-brand-secondary">
              Carnex Auto Sales — Admin
            </span>
            {user && (
              <span className="text-brand-muted">
                Signed in as{' '}
                <span className="font-medium text-brand-secondary">
                  {user.name}
                </span>{' '}
                <span className="text-red-500">({user.role})</span>
              </span>
            )}
          </header>
          <div className="py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
