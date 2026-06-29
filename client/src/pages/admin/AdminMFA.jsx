// client/src/pages/admin/AdminMFA.jsx
import { useState } from 'react'
import api from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { useToast } from '../../hooks/useToast'
import { useNavigate } from 'react-router-dom'

/**
 * MFA setup/verification page shown after password login.
 * Handles two flows:
 *   1. setupRequired  → show QR → confirm code
 *   2. mfaRequired    → enter TOTP code
 */
export function AdminMFA() {
  const navigate = useNavigate()
  const toast = useToast()

  const [phase, setPhase] = useState('detect') // 'detect' | 'setup' | 'verify'
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Called on mount — determine which phase we're in from the server
  useState(() => {
    const detect = async () => {
      try {
        const { data } = await api.post('/admin/auth/mfa/setup')
        if (data?.data?.qrDataUrl) {
          setQrDataUrl(data.data.qrDataUrl)
          setPhase('setup')
        }
      } catch {
        // Cookie is mfa-pending, not mfa-setup
        setPhase('verify')
      }
    }
    detect()
  }, [])

  const handleSetupConfirm = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/admin/auth/mfa/confirm', { code })
      toast.success('MFA enabled. You are now logged in.')
      navigate('/admin')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/admin/auth/mfa/verify', { code })
      toast.success('MFA verified. Welcome back.')
      navigate('/admin')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (phase === 'detect') {
    return (
      <section className="page-content flex min-h-[70vh] items-center justify-center">
        <p className="text-brand-muted text-sm">Checking MFA status…</p>
      </section>
    )
  }

  return (
    <section className="page-content flex min-h-[70vh] items-center justify-center">
      <div className="card-surface w-full max-w-md space-y-5 p-6">
        {phase === 'setup' ? (
          <>
            <header className="space-y-1">
              <h1 className="text-page-title text-xl">
                Set up two-factor authentication
              </h1>
              <p className="text-body-muted text-xs">
                Scan the QR code with your authenticator app (Google
                Authenticator, Authy, etc.), then enter the 6-digit code below
                to confirm.
              </p>
            </header>

            {qrDataUrl && (
              <div className="flex justify-center">
                <img
                  src={qrDataUrl}
                  alt="MFA QR code"
                  className="h-48 w-48 rounded-md border border-brand-border"
                />
              </div>
            )}

            <form onSubmit={handleSetupConfirm} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}
              <Input
                id="mfa-code"
                label="6-digit code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
              <Button
                type="submit"
                size="md"
                className="w-full"
                disabled={loading || code.length < 6}
              >
                {loading ? 'Verifying…' : 'Enable MFA & sign in'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <header className="space-y-1">
              <h1 className="text-page-title text-xl">
                Two-factor authentication
              </h1>
              <p className="text-body-muted text-xs">
                Enter the 6-digit code from your authenticator app to continue.
              </p>
            </header>

            <form onSubmit={handleVerify} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}
              <Input
                id="mfa-verify-code"
                label="Authentication code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
              />
              <Button
                type="submit"
                size="md"
                className="w-full"
                disabled={loading || code.length < 6}
              >
                {loading ? 'Verifying…' : 'Verify & sign in'}
              </Button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
