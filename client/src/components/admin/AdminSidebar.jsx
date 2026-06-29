// client/src/components/admin/AdminSidebar.jsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const baseLink =
  'flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors'
const activeLink = 'bg-brand-primary text-white'
const inactiveLink =
  'text-brand-muted hover:bg-brand-surface hover:text-brand-secondary'

export function AdminSidebar() {
  const { logout } = useAuth()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-brand-border bg-brand-secondary text-gray-100">
      <div className="px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
          Carnex Admin
        </p>
        <p className="text-[11px] text-gray-300">Dealership control panel</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 text-xs">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/vehicles"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Vehicles
        </NavLink>
        <NavLink
          to="/admin/finance-leads"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Financing Leads
        </NavLink>
        <NavLink
          to="/admin/trade-in-leads"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Trade-In Leads
        </NavLink>
        <NavLink
          to="/admin/test-drive-leads"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Test Drive Leads
        </NavLink>
        <NavLink
          to="/admin/sourcing-leads"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Sourcing Leads
        </NavLink>
        <NavLink
          to="/admin/contact-leads"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Contact Leads
        </NavLink>
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-md border border-white/15 bg-transparent px-3 py-2 text-xs font-medium text-gray-200 hover:bg-white/5"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
