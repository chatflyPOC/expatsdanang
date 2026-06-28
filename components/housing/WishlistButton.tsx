'use client'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { clsx } from 'clsx'

const KEY = 'housing_wishlist'

function getWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function WishlistButton({ listingId, className }: { listingId: string; className?: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(getWishlist().includes(listingId))
  }, [listingId])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const list = getWishlist()
    const next = list.includes(listingId)
      ? list.filter(id => id !== listingId)
      : [...list, listingId]
    localStorage.setItem(KEY, JSON.stringify(next))
    setSaved(!saved)
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={clsx(
        'p-1.5 rounded-full transition-colors',
        saved
          ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
          : 'text-gray-300 bg-white/80 hover:text-rose-400 hover:bg-rose-50',
        className
      )}
    >
      <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
    </button>
  )
}
