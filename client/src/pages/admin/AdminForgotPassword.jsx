// client/src/pages/admin/AdminForgotPassword.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'

export function AdminForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/admin/auth/forgot-password', { email })
      setStep('otp')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/admin/auth/verify-reset-otp', { code: otp })
      navigate('/admin/reset-password')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-content flex min-h-[70vh] items-center justify-center">
      <div className="card-surface w-full max-w-md space-y-5 p-6">
        <header className="space-y-1">
          <h1 className="text-page-title text-xl">
            {step === 'email' ? 'Forgot Password' : 'Enter OTP'}
          </h1>
          <p className="text-body-muted text-xs">
            {step === 'email'
              ? 'Enter your admin email. We will send a 6-digit OTP to reset your password.'
              : `We sent a 6-digit code to your registered email address.`}
          </p>
        </header>

        {error && <Alert variant="error">{error}</Alert>}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
            <Input
              id="fp-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <div className="flex items-center justify-between">
              <Link
                to="/admin/login"
                className="text-xs text-brand-muted hover:text-brand-primary"
              >
                Back to sign in
              </Link>
              <Button type="submit" size="md" disabled={loading || !email}>
                {loading ? 'Sending…' : 'Send OTP'}
              </Button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOTPSubmit} className="space-y-4" noValidate>
            <div>
              <Input
                id="fp-otp"
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
                Code expires in 10 minutes.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setError('')
                }}
                className="text-xs text-brand-muted hover:text-brand-primary"
              >
                ← Back
              </button>
              <Button
                type="submit"
                size="md"
                disabled={loading || otp.length < 6}
              >
                {loading ? 'Verifying…' : 'Verify OTP'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
