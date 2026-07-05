// Used for both display (read-only) and interactive (form) modes
const FULL_STAR = (
  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const EMPTY_STAR = (
  <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
  </svg>
)

export function StarRating({ rating = 0, onRate, max = 5, size= 'md' }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  const handleClick = (value) => {
    if (onRate) onRate(value)
  }

  return (
    <div className="flex gap-0.5">
      {stars.map((value) => (
        <button
          key={value}
          type={onRate ? 'button' : undefined}
          onClick={() => handleClick(value)}
          disabled={!onRate}
          className={`${onRate ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} disabled:cursor-default`}
          aria-label={`${value} star${value !== 1 ? 's' : ''}`}
        >
          {value <= rating ? FULL_STAR : EMPTY_STAR}
        </button>
      ))}
    </div>
  )
}
