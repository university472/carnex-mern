// client/src/pages/admin/AdminVehicles.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useVehicles } from '../../hooks/useVehicles'
import { Button } from '../../components/ui/Button'
// import { Badge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'
import { Pagination } from '../../components/ui/Pagination'
import { useToast } from '../../hooks/useToast'
import { formatPrice, formatMileage, formatDate } from '../../utils/formatters'

// const STATUS_BADGE = {
//   available: 'success',
//   reserved: 'accent',
//   sold: 'default',
//   hidden: 'default'
// }

export function AdminVehicles() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saleTarget, setSaleTarget] = useState(null)

  const [saleForm, setSaleForm] = useState({
    soldPrice: '',
    buyerName: '',
    buyerPhone: '',
    buyerEmail: ''
  })

  const [savingSale, setSavingSale] = useState(false)

  const { vehicles, pagination, loading, reload } = useVehicles({
    page,
    limit: 20
  })

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/admin/vehicles/${deleteTarget._id}`)
      toast.success('Vehicle removed from inventory')
      setDeleteTarget(null)
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete vehicle')
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (vehicle, newStatus) => {
    if (newStatus === 'sold') {
      setSaleTarget(vehicle)

      setSaleForm({
        soldPrice: vehicle.price || '',
        buyerName: '',
        buyerPhone: '',
        buyerEmail: ''
      })

      return
    }

    try {
      await api.patch(`/admin/vehicles/${vehicle._id}/status`, {
        status: newStatus
      })

      toast.success(`Status updated to "${newStatus}"`)

      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    }
  }

  const completeSale = async () => {
    if (!saleTarget) return

    setSavingSale(true)

    try {
      await api.patch(`/admin/vehicles/${saleTarget._id}/status`, {
        status: 'sold',

        soldPrice: saleForm.soldPrice,

        buyer: {
          name: saleForm.buyerName,
          phone: saleForm.buyerPhone,
          email: saleForm.buyerEmail
        }
      })

      toast.success('Vehicle sale recorded')

      setSaleTarget(null)

      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save sale')
    } finally {
      setSavingSale(false)
    }
  }

  return (
    <section className="page-content space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-page-title">Vehicles</h1>
          <p className="text-body-muted text-sm">
            Manage all vehicle listings. Published vehicles appear on the public
            site.
          </p>
        </div>
        <Link to="/dealer-panel/vehicles/new">
          <Button size="md">+ Add vehicle</Button>
        </Link>
      </header>

      <div className="card-surface p-5 space-y-4">
        {/* Filters */}
        {/* <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              id="v-search"
              label="Search"
              placeholder="Make, model, title, VIN"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <div className="w-44">
            <Select
              id="v-status"
              label="Status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div> */}

        {/* Table */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-brand-muted mb-3">No vehicles found.</p>
            <Link to="/dealer-panel/vehicles/new">
              <Button size="sm">Add your first vehicle</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-border text-left text-brand-muted">
                    <th className="py-2 pr-3 font-medium">Year</th>
                    <th className="py-2 pr-3 font-medium">Make</th>
                    <th className="py-2 pr-3 font-medium">Model</th>
                    <th className="py-2 pr-3 font-medium">Price</th>
                    <th className="py-2 pr-3 font-medium">Mileage</th>
                    <th className="py-2 pr-3 font-medium">Body</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Added</th>

                    <th className="py-2 pr-3 font-medium">Sold Date</th>

                    <th className="py-2 pr-3 font-medium">Sold By</th>

                    <th className="py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr
                      key={v._id}
                      className="border-b border-brand-border/60 hover:bg-brand-surface/50 transition-colors"
                    >
                      <td className="py-2 pr-3 text-gray-900 font-medium">
                        {v.year}
                      </td>
                      <td className="py-2 pr-3 font-medium text-brand-secondary">
                        {v.make}
                      </td>
                      <td className="py-2 pr-3">{v.model}</td>
                      <td className="py-2 pr-3 text-brand-primary font-medium">
                        {formatPrice(v.price)}
                      </td>
                      <td className="py-2 pr-3 text-brand-muted">
                        {formatMileage(v.mileage)}
                      </td>
                      <td className="py-2 pr-3 text-brand-muted">
                        {v.bodyType || '—'}
                      </td>
                      <td className="py-2 pr-3">
                        <select
                          value={v.status}
                          onChange={(e) =>
                            handleStatusChange(v, e.target.value)
                          }
                          className="
text-xs
font-semibold
border
border-brand-border
rounded
px-2
py-1
bg-white
text-gray-900
focus:outline-none
focus:ring-1
focus:ring-brand-primary
"
                        >
                          {['available', 'reserved', 'sold', 'hidden'].map(
                            (s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="py-2 pr-3 text-brand-muted">
                        {formatDate(v.createdAt)}
                      </td>

                      <td className="py-2 pr-3 text-brand-muted">
                        {v.status === 'sold' ? formatDate(v.soldAt) : '—'}
                      </td>

                      <td className="py-2 pr-3 text-brand-muted">
                        {v.status === 'sold' ? v.soldBy?.name || 'Admin' : '—'}
                      </td>
                      <td className="py-2 flex items-center gap-1.5">
                        <Link to={`/dealer-panel/vehicles/${v._id}/edit`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteTarget(v)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {saleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Complete Sale</h2>

            <p className="text-sm text-gray-600">
              {saleTarget.year} {saleTarget.make} {saleTarget.model}
            </p>

            <input
              className="w-full border rounded p-2 text-gray-900"
              placeholder="Final Sale Price"
              type="number"
              value={saleForm.soldPrice}
              onChange={(e) =>
                setSaleForm({
                  ...saleForm,
                  soldPrice: e.target.value
                })
              }
            />

            <input
              className="w-full border rounded p-2 text-gray-900"
              placeholder="Buyer Name"
              value={saleForm.buyerName}
              onChange={(e) =>
                setSaleForm({
                  ...saleForm,
                  buyerName: e.target.value
                })
              }
            />

            <input
              className="w-full border rounded p-2 text-gray-900"
              placeholder="Buyer Phone"
              value={saleForm.buyerPhone}
              onChange={(e) =>
                setSaleForm({
                  ...saleForm,
                  buyerPhone: e.target.value
                })
              }
            />

            <input
              className="w-full border rounded p-2 text-gray-900"
              placeholder="Buyer Email"
              value={saleForm.buyerEmail}
              onChange={(e) =>
                setSaleForm({
                  ...saleForm,
                  buyerEmail: e.target.value
                })
              }
            />

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setSaleTarget(null)}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                onClick={completeSale}
                disabled={savingSale}
              >
                {savingSale ? 'Saving...' : 'Complete Sale'}
              </Button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete vehicle?"
        description={
          deleteTarget
            ? `This will hide "${deleteTarget.year} ${deleteTarget.make} ${deleteTarget.model}" from the public site. You can restore it by changing its status back to Available.`
            : ''
        }
        confirmLabel="Delete vehicle"
        loading={deleting}
      />
    </section>
  )
}
