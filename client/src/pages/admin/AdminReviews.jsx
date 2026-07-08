import { useState, useEffect, useCallback } from 'react'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Pagination } from '../../components/ui/Pagination'
import { Skeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../hooks/useToast'
import { formatDate } from '../../utils/formatters'
import {
  getReviews,
  approveReview,
  rejectReview,
  toggleVerified,
  deleteReview
} from '../../services/reviewService'

const STATUS_TABS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' }
]

export function AdminReviews() {
  const toast = useToast()
  const [statusFilter, setStatusFilter] = useState('pending')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ items: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getReviews({ status: statusFilter, page, limit: 20 })
      setData(res.data.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, page, toast])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleAction = async (id, action) => {
    setActionLoading(id)
    try {
      if (action === 'approve') await approveReview(id)
      else if (action === 'reject') await rejectReview(id)
      else if (action === 'toggle-verify') await toggleVerified(id)
      else if (action === 'delete') await deleteReview(id)

      toast.success(`Review ${action === 'delete' ? 'deleted' : 'updated'}`)
      fetchReviews()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <section className="page-content space-y-6">
      <header>
        <h1 className="text-page-title">Customer Reviews</h1>
        <p className="text-body-muted text-sm">
          Approve, reject, or manage customer reviews.
        </p>
      </header>

      <div className="card-surface p-5 space-y-4">
        {/* Status Tabs */}
        <div className="flex gap-2">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setStatusFilter(tab.value)
                setPage(1)
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <p className="text-sm text-brand-muted py-6 text-center">
            No {statusFilter} reviews found.
          </p>
        ) : (
          <div className="space-y-3">
            {data.items.map((review) => (
              <div
                key={review._id}
                className="border border-brand-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {review.customerName}
                    </span>
                    {review.isVerifiedBuyer && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {review.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-500 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  {review.purchasedVehicle && (
                    <p className="text-sm text-gray-600">
                      Vehicle: {review.purchasedVehicle}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-line text-gray-700">
                    {review.reviewText}
                  </p>
                  {review.images?.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {review.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt="review"
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 self-end sm:self-center">
                  {statusFilter === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAction(review._id, 'approve')}
                        disabled={actionLoading === review._id}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(review._id, 'reject')}
                        disabled={actionLoading === review._id}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAction(review._id, 'toggle-verify')}
                    disabled={actionLoading === review._id}
                  >
                    {review.isVerifiedBuyer ? 'Unverify' : 'Verify'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      if (window.confirm('Delete this review permanently?')) {
                        handleAction(review._id, 'delete')
                      }
                    }}
                    disabled={actionLoading === review._id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.pagination && data.pagination.totalPages > 1 && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onChange={setPage}
          />
        )}
      </div>
    </section>
  )
}
