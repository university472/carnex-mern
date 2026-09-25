// server/src/services/googleReviewService.js
const axios = require('axios')

// Simple in-memory cache — Google Places Details data is fine to cache for
// a few hours; this also keeps us well under API quota/cost.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000
let cache = { data: null, fetchedAt: 0 }

/**
 * Fetches the business's Google reviews via the Places API (Place Details).
 * Returns null if GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID aren't configured
 * so the caller can respond gracefully instead of erroring.
 */
async function fetchGoogleReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return null
  }

  const now = Date.now()
  if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data
  }

  try {
    const { data } = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'name,rating,user_ratings_total,url,reviews',
          key: apiKey
        }
      }
    )

    if (data.status !== 'OK') {
      throw new Error(
        `Google Places API error: ${data.status} ${data.error_message || ''}`.trim()
      )
    }

    const result = data.result || {}
    const normalized = {
      name: result.name,
      rating: result.rating,
      totalRatings: result.user_ratings_total,
      mapsUrl: result.url,
      reviews: (result.reviews || [])
        .slice()
        .sort((a, b) => b.time - a.time)
        .map((r) => ({
          authorName: r.author_name,
          authorPhoto: r.profile_photo_url,
          authorUrl: r.author_url,
          rating: r.rating,
          text: r.text,
          relativeTime: r.relative_time_description,
          time: r.time
        }))
    }

    cache = { data: normalized, fetchedAt: now }
    return normalized
  } catch (err) {
    // Serve stale cache rather than a broken homepage if Google is
    // temporarily unavailable / quota is exhausted.
    if (cache.data) return cache.data
    throw err
  }
}

module.exports = { fetchGoogleReviews }
