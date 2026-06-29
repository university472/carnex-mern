// client/src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../hooks/useToast'
import { formatDate } from '../../utils/formatters'

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Sales', value: 'sales' },
  { label: 'Viewer', value: 'viewer' }
]

const ROLE_COLORS = {
  'super-admin': 'accent',
  admin: 'accent',
  sales: 'success',
  viewer: 'default'
}

const emptyForm = { name: '', email: '', password: '', role: 'admin' }

export function AdminUsers() {
  const toast = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data?.data || data || [])
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/admin/users', form)
      toast.success(`User ${form.email} created`)
      setForm(emptyForm)
      await loadUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create user')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/admin/users/${deleteTarget._id}`)
      toast.success('User removed')
      setDeleteTarget(null)
      await loadUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="page-content space-y-6">
      <header className="space-y-1">
        <h1 className="text-page-title">Admin Users</h1>
        <p className="text-body-muted text-sm">
          Manage staff accounts and their access levels.
        </p>
      </header>

      {/* Create user form */}
      <div className="card-surface p-5 space-y-4">
        <h2 className="text-section-title text-base">Add new user</h2>
        <form
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={handleCreate}
        >
          <Input
            id="u-name"
            label="Full name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
          <Input
            id="u-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
          <Input
            id="u-password"
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
          />
          <Select
            id="u-role"
            label="Role"
            options={ROLE_OPTIONS}
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
          />
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <Button type="submit" size="md" disabled={creating}>
              {creating ? 'Creating…' : 'Create user'}
            </Button>
          </div>
        </form>
      </div>

      {/* User list */}
      <div className="card-surface p-5">
        <h2 className="text-section-title text-base mb-4">Current users</h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-brand-muted">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-left text-brand-muted">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Created</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-brand-border/60">
                    <td className="py-2 pr-4 font-medium text-brand-secondary">
                      {u.name}
                    </td>
                    <td className="py-2 pr-4 text-brand-muted">{u.email}</td>
                    <td className="py-2 pr-4">
                      <Badge variant={ROLE_COLORS[u.role] || 'default'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4 text-brand-muted">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-2">
                      {u.role !== 'super-admin' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteTarget(u)}
                        >
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove user?"
        description={`This will permanently remove ${deleteTarget?.email} from the admin panel.`}
        confirmLabel="Remove user"
        loading={deleting}
      />
    </section>
  )
}
