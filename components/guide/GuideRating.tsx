'use client'

import { useState, useEffect } from 'react'

interface Props {
  slug: string
  initialRating: number | null
  initialCount: number
}

export function GuideRating({ slug, initialRating, initialCount }: Props) {
  const storageKey = `guide_rated_${slug}`

  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [ratingValue, setRatingValue] = useState(initialRating)
  const [reviewCount, setReviewCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Read localStorage after mount only — avoids SSR/hydration mismatch
  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) setSubmitted(true)
    } catch {}
  }, [storageKey])

  async function handleRate(star: number) {
    if (submitted || loading) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/guides/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, rating: star }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setRatingValue(data.ratingValue ?? star)
      setReviewCount(data.reviewCount ?? reviewCount + 1)
      setSubmitted(true)
      try { localStorage.setItem(storageKey, '1') } catch {}
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const displayRating = ratingValue ?? 0
  const fullStars = Math.floor(displayRating)
  const hasHalf = displayRating - fullStars >= 0.5

  return (
    <div className="mt-12 border-t border-[#E5E7EB] pt-8">
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        {submitted ? (
          <>
            <p className="text-sm font-semibold text-[#085041] mb-2">Thanks for your rating!</p>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} filled={s <= fullStars} half={s === fullStars + 1 && hasHalf} size={22} />
              ))}
            </div>
            {displayRating > 0 && (
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{displayRating.toFixed(1)}</span>
                {' '}/ 5 · {reviewCount.toLocaleString()} rating{reviewCount !== 1 ? 's' : ''}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-800 mb-1">Was this guide helpful?</p>
            <p className="text-xs text-gray-400 mb-4">Rate this article to help others find it</p>
            <div
              className="flex items-center justify-center gap-1.5 mb-3"
              onMouseLeave={() => !loading && setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleRate(s)}
                  onMouseEnter={() => !loading && setHovered(s)}
                  disabled={loading}
                  aria-label={`Rate ${s} out of 5 stars`}
                  className="transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <StarIcon filled={s <= (hovered || fullStars)} size={28} />
                </button>
              ))}
            </div>
            {error && (
              <p className="text-xs text-red-500 mb-2">Something went wrong — please try again.</p>
            )}
            {displayRating > 0 && reviewCount > 0 && (
              <p className="text-xs text-gray-400">
                {displayRating.toFixed(1)} / 5 · {reviewCount.toLocaleString()} rating{reviewCount !== 1 ? 's' : ''}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StarIcon({ filled, half = false, size = 20 }: { filled: boolean; half?: boolean; size?: number }) {
  const id = `hg-${size}`
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#F5A623" />
            <stop offset="50%" stopColor="#E5E7EB" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={`url(#${id})`}
          stroke="#E09415"
          strokeWidth="0.5"
        />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? '#F5A623' : '#E5E7EB'}
        stroke={filled ? '#E09415' : '#D1D5DB'}
        strokeWidth="0.5"
      />
    </svg>
  )
}
