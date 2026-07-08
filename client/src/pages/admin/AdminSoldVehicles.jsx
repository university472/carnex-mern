import { useEffect, useState } from 'react'
import api from '../../services/api'
import { formatPrice, formatDate } from '../../utils/formatters'

export function AdminSoldVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/admin/vehicles/sold/history')

        setVehicles(res.data?.data || [])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <section className="page-content space-y-6">
      <h1 className="text-page-title">Sold Vehicle History</h1>

      <div className="card-surface p-5">
        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-gray-700">No sold vehicles yet.</p>
        ) : (
          <table className="min-w-full text-xs text-gray-900">
            <thead className="text-gray-600">
              <tr>
                <th className="text-left py-2">Vehicle</th>

                <th>Original Price</th>

                <th>Sold Price</th>

                <th>Buyer Name</th>

                <th>Phone</th>

                <th>Email</th>

                <th>Sold Date</th>

                <th>Sold By</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id} className="border-t">
                  <td className="py-2 font-medium text-gray-900">
                    {v.year} {v.make} {v.model}
                  </td>

                  <td className="text-gray-700">{formatPrice(v.price)}</td>

                  <td className="text-red-600 font-semibold">
                    {formatPrice(v.soldPrice || v.price)}
                  </td>

                  <td className="text-gray-700">{v.buyer?.name || '—'}</td>

                  <td className="text-gray-700">{v.buyer?.phone || '—'}</td>

                  <td className="text-gray-700">{v.buyer?.email || '—'}</td>

                  <td className="text-gray-700">
                    {v.soldAt ? formatDate(v.soldAt) : '—'}
                  </td>

                  <td className="text-gray-700 font-medium">
                    {v.soldBy?.name || 'Admin'}
                  </td>
                </tr>
              ))}
            </tbody>{' '}
          </table>
        )}
      </div>
    </section>
  )
}
