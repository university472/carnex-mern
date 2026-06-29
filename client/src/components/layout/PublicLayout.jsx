// client/src/components/layout/PublicLayout.jsx
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { useAnalytics } from '../../hooks/useAnalytics'

export function PublicLayout() {
  // Track every public page navigation automatically
  useAnalytics()

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
