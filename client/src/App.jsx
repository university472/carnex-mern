// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { AdminSessionWatcher } from './components/auth/AdminSessionWatcher'
import { AdminReviews } from './pages/admin/AdminReviews'
import { ProtectedRoute } from './utils/ProtectedRoute'

import { Home } from './pages/public/Home'
import { Inventory } from './pages/public/Inventory'
import { VehicleDetail } from './pages/public/VehicleDetail'
import { Financing } from './pages/public/Financing'
import { TradeIn } from './pages/public/TradeIn'
import { TestDrive } from './pages/public/TestDrive'
import { Sourcing } from './pages/public/Sourcing'
import { About } from './pages/public/About'
import { Contact } from './pages/public/Contact'
import { NotFound } from './pages/public/NotFound'

import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminForgotPassword } from './pages/admin/AdminForgotPassword'
import { AdminResetPassword } from './pages/admin/AdminResetPassword'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminVehicles } from './pages/admin/AdminVehicles'
import { AdminSoldVehicles } from './pages/admin/AdminSoldVehicles'
import { AdminVehicleEditor } from './pages/admin/AdminVehicleEditor'
import { AdminFinanceLeads } from './pages/admin/AdminFinanceLeads'
import { AdminTradeInLeads } from './pages/admin/AdminTradeInLeads'
import { AdminTestDriveLeads } from './pages/admin/AdminTestDriveLeads'
import { AdminSourcingLeads } from './pages/admin/AdminSourcingLeads'
import { AdminContactLeads } from './pages/admin/AdminContactLeads'
import { AdminLeadDetail } from './pages/admin/AdminLeadDetail'
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs'
import { AdminSettings } from './pages/admin/AdminSettings'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminAnalytics } from './pages/admin/AdminAnalytics'

export function App() {
  return (
    <BrowserRouter>
      <AdminSessionWatcher />

      <Routes>
        {/* ── Public ──────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/trade-in" element={<TradeIn />} />
          <Route path="/test-drive" element={<TestDrive />} />
          <Route path="/sourcing" element={<Sourcing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ── Admin auth (unprotected) ─────────────────────── */}
        <Route path="/dealer-panel/login" element={<AdminLogin />} />
        <Route
          path="/dealer-panel/forgot-password"
          element={<AdminForgotPassword />}
        />
        <Route
          path="/dealer-panel/reset-password"
          element={<AdminResetPassword />}
        />

        {/* ── Protected admin area ─────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dealer-panel" element={<AdminDashboard />} />
            <Route path="/dealer-panel/vehicles" element={<AdminVehicles />} />
            <Route
              path="/dealer-panel/sold-history"
              element={<AdminSoldVehicles />}
            />
            <Route path="/dealer-panel/reviews" element={<AdminReviews />} />
            <Route
              path="/dealer-panel/vehicles/new"
              element={<AdminVehicleEditor />}
            />
            <Route
              path="/dealer-panel/vehicles/:id/edit"
              element={<AdminVehicleEditor />}
            />
            <Route
              path="/dealer-panel/finance-leads"
              element={<AdminFinanceLeads />}
            />
            <Route
              path="/dealer-panel/finance-leads/:id"
              element={<AdminLeadDetail />}
            />
            <Route
              path="/dealer-panel/trade-in-leads"
              element={<AdminTradeInLeads />}
            />
            <Route
              path="/dealer-panel/trade-in-leads/:id"
              element={<AdminLeadDetail />}
            />
            <Route
              path="/dealer-panel/test-drive-leads"
              element={<AdminTestDriveLeads />}
            />
            <Route
              path="/dealer-panel/test-drive-leads/:id"
              element={<AdminLeadDetail />}
            />
            <Route
              path="/dealer-panel/sourcing-leads"
              element={<AdminSourcingLeads />}
            />
            <Route
              path="/dealer-panel/sourcing-leads/:id"
              element={<AdminLeadDetail />}
            />
            <Route
              path="/dealer-panel/contact-leads"
              element={<AdminContactLeads />}
            />
            <Route
              path="/dealer-panel/contact-leads/:id"
              element={<AdminLeadDetail />}
            />
            <Route
              path="/dealer-panel/analytics"
              element={<AdminAnalytics />}
            />
            <Route
              path="/dealer-panel/audit-logs"
              element={<AdminAuditLogs />}
            />
            <Route path="/dealer-panel/settings" element={<AdminSettings />} />
            <Route path="/dealer-panel/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
