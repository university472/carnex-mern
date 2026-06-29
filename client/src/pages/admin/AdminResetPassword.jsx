// client/src/pages/admin/AdminResetPassword.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'

export function AdminResetPassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await api.post('/admin/auth/reset-password', {
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      })
      navigate('/admin/login', {
        state: { message: 'Password reset successfully. Please sign in.' }
      })
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Session expired. Please start over.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-content flex min-h-[70vh] items-center justify-center">
      <div className="card-surface w-full max-w-md space-y-5 p-6">
        <header className="space-y-1">
          <h1 className="text-page-title text-xl">Set New Password</h1>
          <p className="text-body-muted text-xs">
            OTP verified. Enter and confirm your new password below.
          </p>
        </header>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="rp-new"
            label="New password"
            type="password"
            value={form.newPassword}
            onChange={(e) => update('newPassword', e.target.value)}
            helperText="Minimum 8 characters"
            required
            autoFocus
          />
          <Input
            id="rp-confirm"
            label="Confirm new password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            required
          />
          <Button
            type="submit"
            size="md"
            className="w-full"
            disabled={loading || !form.newPassword || !form.confirmPassword}
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </section>
  )
}
