// client/src/pages/admin/AdminSettings.jsx
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { useToast } from '../../hooks/useToast'
import { Skeleton } from '../../components/ui/Skeleton'

export function AdminSettings() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    dealershipName: '',
    phone: '',
    email: '',
    address: '',
    notificationEmails: ''
  })

  // Password change — 2 steps
  const [pwStep, setPwStep] = useState('form') // 'form' | 'otp'
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [pwOtp, setPwOtp] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/settings')
        const s = data?.data || data
        setForm({
          dealershipName: s.dealershipName || '',
          phone: s.phone || '',
          email: s.email || '',
          address: s.address || '',
          notificationEmails: (s.notificationEmails || []).join(', ')
        })
      } catch {
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }))
  const updatePw = (f, v) => setPwForm((p) => ({ ...p, [f]: v }))

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/settings', {
        ...form,
        notificationEmails: form.notificationEmails
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
      })
      toast.success('Settings saved')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  // Step 1: submit current + new password → OTP sent to email
  const handlePasswordStep1 = async (e) => {
    e.preventDefault()
    setPwError('')

    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Passwords do not match.')
      return
    }

    setPwLoading(true)
    try {
      await api.post('/admin/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword
      })
      setPwStep('otp')
      toast.success('OTP sent to your registered email address.')
    } catch (err) {
      setPwError(
        err?.response?.data?.message || 'Failed to initiate password change.'
      )
    } finally {
      setPwLoading(false)
    }
  }

  // Step 2: confirm OTP + new password → password changed
  const handlePasswordStep2 = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwLoading(true)
    try {
      await api.post('/admin/auth/confirm-change-password', {
        code: pwOtp,
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword
      })
      toast.success('Password changed successfully. Confirmation email sent.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPwOtp('')
      setPwStep('form')
    } catch (err) {
      setPwError(err?.response?.data?.message || 'Invalid or expired OTP.')
    } finally {
      setPwLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="page-content space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </section>
    )
  }

  return (
    <section className="page-content space-y-6">
      <header className="space-y-1">
        <h1 className="text-page-title">Settings</h1>
        <p className="text-body-muted text-sm">
          Manage dealership information and your account security.
        </p>
      </header>

      {/* Dealership settings */}
      <form
        className="card-surface p-5 space-y-4"
        onSubmit={handleSaveSettings}
      >
        <h2 className="text-section-title text-base">Dealership information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="s-name"
            label="Dealership name"
            value={form.dealershipName}
            onChange={(e) => update('dealershipName', e.target.value)}
          />
          <Input
            id="s-phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
          <Input
            id="s-email"
            label="Public email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
          <Input
            id="s-address"
            label="Address"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
          />
        </div>
        <Input
          id="s-notif"
          label="Notification emails (comma-separated)"
          value={form.notificationEmails}
          onChange={(e) => update('notificationEmails', e.target.value)}
          helperText="Lead alerts will be sent to these addresses."
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" size="md" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </form>

      {/* Change password */}
      <div className="card-surface p-5 space-y-4">
        <div className="space-y-1">
          <h2 className="text-section-title text-base">Change password</h2>
          <p className="text-xs text-brand-muted">
            {pwStep === 'form'
              ? 'An OTP will be sent to your registered email to confirm the change.'
              : 'Enter the OTP sent to your registered email to confirm the password change.'}
          </p>
        </div>

        {pwError && <Alert variant="error">{pwError}</Alert>}

        {/* Step 1 */}
        {pwStep === 'form' && (
          <form
            className="grid gap-4 sm:grid-cols-3"
            onSubmit={handlePasswordStep1}
          >
            <Input
              id="pw-current"
              label="Current password"
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => updatePw('currentPassword', e.target.value)}
              required
            />
            <Input
              id="pw-new"
              label="New password"
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => updatePw('newPassword', e.target.value)}
              helperText="Min 8 characters"
              required
            />
            <Input
              id="pw-confirm"
              label="Confirm new password"
              type="password"
              value={pwForm.confirmPassword}
              onChange={(e) => updatePw('confirmPassword', e.target.value)}
              required
            />
            <div className="sm:col-span-3 flex justify-end pt-2">
              <Button type="submit" size="md" disabled={pwLoading}>
                {pwLoading ? 'Sending OTP…' : 'Send OTP to confirm'}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2 */}
        {pwStep === 'otp' && (
          <form className="space-y-4" onSubmit={handlePasswordStep2}>
            <div className="max-w-xs">
              <Input
                id="pw-otp"
                label="6-digit OTP from your email"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pwOtp}
                onChange={(e) => setPwOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPwStep('form')
                  setPwOtp('')
                  setPwError('')
                }}
              >
                ← Back
              </Button>
              <Button
                type="submit"
                size="md"
                disabled={pwLoading || pwOtp.length < 6}
              >
                {pwLoading ? 'Confirming…' : 'Confirm & Change Password'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
