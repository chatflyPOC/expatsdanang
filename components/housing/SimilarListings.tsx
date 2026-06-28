'use client'
import { useEffect, useState } from 'react'
import { HousingListingPublic } from '@/types/housing'
import { HousingCard } from './HousingCard'

interface Props {
  currentId: string
  district: string
  type: string
}

export function SimilarListings({ currentId, district, type }: Props) {
  const [listings, setListings] = useState<HousingListingPublic[]>([])

  useEffect(() => {
    // Try same district first, fall back to same type
    fetch(`/api/housing/listings?district=${district}`)
      .then(r => r.json())
      .then((data: HousingListingPublic[]) => {
        const filtered = (Array.isArray(data) ? data : [])
          .filter(l => l.id !== currentId)
          .slice(0, 3)
        if (filtered.length < 3) {
          return fetch(`/api/housing/listings?type=${type}`)
            .then(r => r.json())
            .then((more: HousingListingPublic[]) => {
              const ids = new Set([currentId, ...filtered.map(l => l.id)])
              const extra = (Array.isArray(more) ? more : [])
                .filter(l => !ids.has(l.id))
                .slice(0, 3 - filtered.length)
              setListings([...filtered, ...extra])
            })
        }
        setListings(filtered)
      })
      .catch(() => {})
  }, [currentId, district, type])

  if (!listings.length) return null

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {listings.map(l => (
          <HousingCard key={l.id} listing={l} showVnd={false} />
        ))}
      </div>
    </section>
  )
}
