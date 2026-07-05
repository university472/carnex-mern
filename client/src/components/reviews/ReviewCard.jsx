import { StarRating } from '../ui/StarRating'
import { formatDate } from '../../utils/formatters'

export function ReviewCard({ review }) {
  // Extract first initial for avatar fallback
  const initial = review.customerName?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="bg-white rounded-lg border border-brand-border/60 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* ── Header: avatar, name, verified badge ──── */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-sm shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brand-secondary truncate">
            {review.customerName}
          </p>
          {review.location && (
            <p className="text-xs text-brand-muted">{review.location}</p>
          )}
        </div>
        {review.isVerifiedBuyer && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 shrink-0">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified Buyer
          </span>
        )}
      </div>

      {/* ── Star rating + value ──── */}
      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={review.rating} />
        <span className="text-xs text-brand-muted font-medium">
          {review.rating}/5
        </span>
      </div>

      {/* ── Purchased vehicle (if any) ──── */}
      {review.purchasedVehicle && (
        <div className="mb-2">
          <span className="text-xs bg-brand-surface text-brand-muted px-2 py-0.5 rounded-full">
            🚗 {review.purchasedVehicle}
          </span>
        </div>
      )}

      {/* ── Review text ──── */}
      <p className="text-sm text-brand-secondary leading-relaxed flex-1 whitespace-pre-line">
        &ldquo;{review.reviewText}&rdquo;
      </p>

      {/* ── Images (if any) ──── */}
      {review.images && review.images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {review.images.slice(0, 6).map((img, i) => (
            <div
              key={i}
              className="aspect-square rounded-md overflow-hidden border border-brand-border/60"
            >
              <img
                src={img.url}
                alt={`Review image ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Date ──── */}
      <p className="text-xs text-brand-muted mt-3 text-right">
        {formatDate(review.createdAt)}
      </p>
    </div>
  )
}
