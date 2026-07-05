// client/src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'

export function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, loading } = useAuth()

  const successMessage = location.state?.message || ''

  // If somehow already authenticated in this session → redirect
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const intended = location.state?.from || '/dealer-panel'
      navigate(intended, { replace: true })
    }
  }, [isAuthenticated, loading])

  const [step, setStep] = useState('credentials')
  const [form, setForm] = useState({ email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleCredentials = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data } = await api.post('/admin/auth/login', form)
      const payload = data?.data || data
      setMaskedEmail(payload?.email || '')
      setStep('otp')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data } = await api.post('/admin/auth/verify-otp', {
        code: otp
      })
      const payload = data?.data || data

      // Store in sessionStorage via AuthContext login()
      login(payload)

      // Redirect to intended page or dashboard
      const intended = location.state?.from || '/dealer-panel'
      navigate(intended, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired OTP.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setSubmitting(true)
    try {
      await api.post('/admin/auth/login', form)
      setOtp('')
    } catch {
      setError('Could not resend OTP. Please go back and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <section className="page-content flex min-h-[70vh] items-center justify-center">
      <div className="card-surface w-full max-w-md space-y-5 p-6">
        <header className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-md bg-red-600 flex items-center
                            justify-center flex-shrink-0"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-page-title text-xl">
              {step === 'credentials'
                ? 'Admin Sign In'
                : 'Verify Your Identity'}
            </h1>
          </div>
          <p className="text-body-muted text-xs">
            {step === 'credentials'
              ? 'Enter your credentials. An OTP will be sent to your email.'
              : `We sent a 6-digit code to ${maskedEmail}`}
          </p>
        </header>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

        {/* Step 1 — Credentials */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentials} className="space-y-4" noValidate>
            <Input
              id="admin-email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              required
              autoFocus
            />
            <Input
              id="admin-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              required
            />
            <div className="flex items-center justify-between pt-1">
              <Link
                to="/admin/forgot-password"
                className="text-xs text-brand-muted hover:text-brand-primary
                           transition-colors"
              >
                Forgot password?
              </Link>
              <Button
                type="submit"
                size="md"
                disabled={submitting || !form.email || !form.password}
              >
                {submitting ? 'Sending OTP…' : 'Continue'}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === 'otp' && (
          <form onSubmit={handleOTP} className="space-y-4" noValidate>
            <div>
              <Input
                id="admin-otp"
                label="6-digit OTP code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
              />
              <p className="text-xs text-brand-muted mt-1">
                Code expires in 10 minutes. Check spam if not received.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials')
                  setOtp('')
                  setError('')
                }}
                className="text-xs text-brand-muted hover:text-brand-primary
                           transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={submitting}
                  className="text-xs text-brand-primary hover:underline
                             disabled:opacity-50"
                >
                  Resend OTP
                </button>
                <Button
                  type="submit"
                  size="md"
                  disabled={submitting || otp.length < 6}
                >
                  {submitting ? 'Verifying…' : 'Verify & Sign In'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
