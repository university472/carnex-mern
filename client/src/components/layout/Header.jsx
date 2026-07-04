import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { DEALERSHIP } from '../../constants'
import logo from '../../assets/logo1.png'

// ── Icons (inline SVG, no dependency needed) ──────────────────
function PhoneIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.3a16 16 0 0 0 5.82 5.82l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16l.5.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17H5v-5l2-6h10l2 6v5z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
      <path d="M5 12h14" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

// ── Nav links with dropdown support ───────────────────────────
const MAIN_NAV = [
  { label: 'Home', path: '/' },
  {
    label: 'Inventory',
    path: '/inventory',
    children: [
      { label: 'All Vehicles', path: '/inventory' },
      { label: 'Sedans', path: '/inventory?bodyType=Sedan' },
      { label: 'SUVs', path: '/inventory?bodyType=SUV' },
      { label: 'Pickup Trucks', path: '/inventory?bodyType=Truck' },
      { label: 'Hatchbacks', path: '/inventory?bodyType=Hatchback' }
    ]
  },
  { label: 'Financing', path: '/financing' },
  { label: 'Trade-In', path: '/trade-in' },
  { label: 'Test Drive', path: '/test-drive' },
  { label: 'Sourcing', path: '/sourcing' },
  { label: 'About', path: '/about' },
  { label: 'Get in Touch', path: '/contact' }
]

// ── Dropdown component ─────────────────────────────────────────
function NavDropdown({ item, onClose }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const location = useLocation()

  // close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // close on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const isActive =
    location.pathname === item.path ||
    item.children?.some((c) => location.pathname === c.path)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150',
          isActive
            ? 'text-brand-primary bg-brand-primary/10'
            : 'text-gray-700 hover:text-brand-primary hover:bg-brand-primary/10'
        ].join(' ')}
      >
        {item.label}
        <span
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg
                        border border-gray-200 shadow-lg z-50 py-1 animate-fade-in-down"
        >
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={() => {
                setOpen(false)
                onClose?.()
              }}
              className="block px-4 py-2.5 text-sm text-gray-600
                         hover:text-brand-primary hover:bg-brand-primary/10
                         transition-colors duration-150"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Header component ──────────────────────────────────────
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const mobileMenuRef = useRef(null)

  // shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // trap body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50">
      {/* ── Top Info Bar (PakWheels style dark red) ──────── */}
      <div className="hidden md:block bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-xs">
          {/* Left — tagline */}
          <span className="flex items-center gap-1.5 text-red-200">
            <CarIcon />
            <span className="hidden lg:inline font-medium">
              {DEALERSHIP.tagline}
            </span>
          </span>

          {/* Right — contact info */}
          <div className="flex items-center gap-4 text-red-100">
            <a
              href={`tel:${DEALERSHIP.phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneIcon />
              <span>{DEALERSHIP.phone}</span>
            </a>

            <span className="text-red-400/40">|</span>

            {/* <a
              href={`mailto:${DEALERSHIP.email}`}
              className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MailIcon />
              <span>{DEALERSHIP.email}</span>
            </a> */}
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${DEALERSHIP.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MailIcon />
              <span>{DEALERSHIP.email}</span>
            </a>

            <span className="hidden lg:block text-red-400/40">|</span>

            <span className="hidden lg:flex items-center gap-1.5">
              <ClockIcon />
              <span>Mon–Sat: 9 AM – 5 PM</span>
            </span>

            <span className="hidden xl:block text-red-400/40">|</span>

            <a
              href="https://maps.google.com/?q=8193+Elder+Creek+Road,+Sacramento,+CA+95824"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MapPinIcon />
              <span>Sacramento, CA 95824</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ───────────────────────────── */}
      <nav
        className={[
          'bg-white border-b border-gray-200 transition-shadow duration-200',
          scrolled ? 'shadow-md' : ''
        ].join(' ')}
      >
        {/* <div className="max-w-7xl mx-auto px-4 flex items-center h-20 gap-4"> */}
        <div className="max-w-7xl mx-auto px-4 flex items-center h-24 gap-4">
          {/* ── Logo ────────────────────────────────────── */}
          <Link
            to="/"
            className="
    flex 
    items-center 
    flex-shrink-0 
    mr-8
  "
          >
            <img
              src={logo}
              alt="Carnex Auto Sales"
              className="
      h-[85px]
      w-auto
      object-contain
      transition-transform
      duration-300
      hover:scale-105
      drop-shadow-md
    "
            />
          </Link>
          {/* ── Desktop Nav Links ────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-end">
            {MAIN_NAV.map((item) =>
              item.children ? (
                <NavDropdown key={item.path} item={item} />
              ) : (
                // <NavLink
                //   key={item.path}
                //   to={item.path}
                //   className={({ isActive }) =>
                //     `px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                //       isActive
                //         ? 'text-brand-primary bg-red-50'
                //         : 'text-gray-700 hover:text-brand-primary hover:bg-red-50'
                //     }`
                //   }
                // >
                //   {item.label}
                // </NavLink>
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => {
                    // Special styling for Get in Touch
                    if (item.label === 'Get in Touch') {
                      return `ml-2 px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 shadow-sm ${
                        isActive
                          ? 'bg-brand-primaryHover text-white'
                          : 'bg-red-700 text-white hover:bg-brand-primaryHover'
                      }`
                    }

                    return `px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                      isActive
                        ? 'text-brand-primary bg-brand-primary/10'
                        : 'text-gray-700 hover:text-brand-primary hover:bg-brand-primary/10'
                    }`
                  }}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* ── Tablet middle nav (md only) ──────────────── */}
          <div className="hidden md:flex lg:hidden items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar ml-1">
            {MAIN_NAV.slice(0, 5).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-2.5 py-2 text-xs font-medium rounded-md flex-shrink-0 transition-all duration-150 ${
                    isActive
                      ? 'text-brand-primary bg-brand-primary/10'
                      : 'text-gray-600 hover:text-brand-primary hover:bg-brand-primary/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* ── Mobile: CTA + Hamburger ───────────────────── */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <Link
              to="/inventory"
              className="px-3 py-1.5 text-xs font-semibold text-white
                         bg-red-700 rounded-md
                         hover:bg-brand-primaryHover transition-colors
                         flex items-center gap-1"
            >
              <PlusIcon />
              <span>Inventory</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="w-9 h-9 flex items-center justify-center rounded-md
                         border border-gray-300 text-gray-600
                         hover:bg-gray-50 hover:text-gray-800
                         transition-colors duration-150"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* ── Tablet CTA ───────────────────────────────── */}
          <div className="hidden md:flex lg:hidden items-center ml-1">
            <Link
              to="/inventory"
              className="px-3 py-1.5 text-xs font-semibold text-white
                         bg-red-700 rounded-md
                         hover:bg-brand-primaryHover transition-colors
                         flex items-center gap-1 flex-shrink-0"
            >
              <PlusIcon />
              <span>Inventory</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Panel ─────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-down panel */}
          <div
            ref={mobileMenuRef}
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-200
                       shadow-2xl z-50 lg:hidden animate-fade-in-down
                       max-h-[calc(100vh-120px)] overflow-y-auto"
          >
            {/* Mobile contact bar */}
            <div className="bg-[#8B0000] px-4 py-3 flex flex-col gap-2 text-xs text-red-100">
              <a
                href={`tel:${DEALERSHIP.phone}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <PhoneIcon />
                {DEALERSHIP.phone}
              </a>
              <span className="flex items-center gap-1.5">
                <ClockIcon />
                Mon–Sat: 9 AM – 5 PM
              </span>
            </div>

            {/* Nav links */}
            <nav className="px-2 py-3 space-y-0.5">
              {MAIN_NAV.map((item) => (
                <div key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 text-sm font-medium
                       rounded-md transition-colors duration-150
                       ${
                         isActive
                           ? 'bg-brand-primary/10 text-brand-primary'
                           : 'text-gray-700 hover:bg-brand-primary/10 hover:text-brand-primary'
                       }`
                    }
                  >
                    {item.label}
                    {item.children && (
                      <span className="text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    )}
                  </NavLink>

                  {/* Mobile sub-links */}
                  {item.children && (
                    <div className="ml-4 mt-0.5 space-y-0.5 pb-1 border-l-2 border-red-200">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-600
                                     hover:text-brand-primary hover:bg-brand-primary/10
                                     rounded-md transition-colors duration-150"
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile bottom CTAs */}
            <div className="px-4 pb-5 pt-2 border-t border-gray-200 space-y-2.5">
              <Link
                to="/inventory"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 text-sm font-semibold text-white
                           bg-red-700 rounded-md
                           hover:bg-brand-primaryHover transition-colors
                           flex items-center justify-center gap-2"
              >
                <PlusIcon />
                Browse All Inventory
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 text-sm font-medium text-gray-700
                           border border-gray-300 rounded-md
                           hover:border-brand-primary hover:text-brand-primary
                           transition-all duration-150
                           flex items-center justify-center"
              >
                Contact Dealership
              </Link>
              <a
                href={`tel:${DEALERSHIP.phone}`}
                className="w-full py-3 text-sm font-medium text-gray-600
                           bg-gray-50 rounded-md
                           hover:bg-gray-100 hover:text-brand-primary
                           transition-colors
                           flex items-center justify-center gap-2"
              >
                <PhoneIcon />
                {DEALERSHIP.phone}
              </a>
            </div>

            {/* Address */}
            <div className="px-4 pb-5 text-xs text-gray-400 text-center">
              <span className="flex items-center justify-center gap-1">
                <MapPinIcon />
                {DEALERSHIP.addressLine1}, {DEALERSHIP.addressLine2}
              </span>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
