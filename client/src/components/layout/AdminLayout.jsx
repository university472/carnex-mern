// client/src/components/layout/AdminLayout.jsx
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Bell } from 'lucide-react'

const NAV = [
  // { label: 'Dashboard', path: '/dealer-panel', end: true },
  // { label: 'Vehicles', path: '/dealer-panel/vehicles' },
  { label: 'Dashboard', path: '/dealer-panel', end: true },

  { label: '— Inventory', disabled: true },

  {
    label: 'Vehicles',
    path: '/dealer-panel/vehicles'
  },

  {
    label: 'Sold History',
    path: '/dealer-panel/sold-history'
  },
  { label: '— Leads', disabled: true },
  { label: 'Financing', path: '/dealer-panel/finance-leads' },
  { label: 'Trade-In', path: '/dealer-panel/trade-in-leads' },
  { label: 'Test Drive', path: '/dealer-panel/test-drive-leads' },
  { label: 'Sourcing', path: '/dealer-panel/sourcing-leads' },
  { label: 'Contact', path: '/dealer-panel/contact-leads' },
  { label: '— Insights', disabled: true },
  { label: 'Analytics', path: '/dealer-panel/analytics' },
  { label: '— Admin', disabled: true },
  { label: 'Users', path: '/dealer-panel/users' },
  { label: 'Audit Logs', path: '/dealer-panel/audit-logs' },
  { label: 'Settings', path: '/dealer-panel/settings' }
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const loadNotifications = async () => {
    try {
      const res = await api.get('/admin/notifications')

      setNotifications(
        (res.data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      )
    } catch (err) {
      console.log('Notification error', err)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const openNotification = async (item) => {
    try {
      await api.patch(`/admin/notifications/${item._id}/read`)

      await loadNotifications()

      setShowNotifications(false)

      navigate(item.link)
    } catch (err) {
      console.log(err)
    }
  }
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const handleLogout = async () => {
    await logout()
    navigate('/dealer-panel/login', { replace: true })
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
                to="/dealer-panel"
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
            <div className="flex items-center gap-5 relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="
  relative 
  text-xl
  text-gray-700
  "
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span
                    className="
   absolute
   -top-2
   -right-3
   bg-red-600
   text-white
   text-[10px]
   rounded-full
   px-1.5
   "
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="
absolute
right-20
top-8
w-80
bg-white
shadow-xl
rounded-lg
border
z-50
"
                >
                  <div className="p-3 font-bold text-gray-900 border-b">
                    Notifications
                  </div>

                  {notifications.length === 0 ? (
                    <p className="p-3 text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => openNotification(item)}
                        className={`
p-3
cursor-pointer
border-b
hover:bg-gray-100

${!item.isRead ? 'bg-red-50' : ''}
`}
                      >
                        <p className="font-semibold text-gray-900">
                          {item.title}
                        </p>

                        <p className="text-xs text-gray-600">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {user && (
                <span className="text-brand-muted">
                  Signed in as{' '}
                  <span className="font-medium text-brand-secondary">
                    {user.name}
                  </span>{' '}
                  <span className="text-red-500">({user.role})</span>
                </span>
              )}
            </div>
          </header>
          <div className="py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
