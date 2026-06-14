'use client'
import { useState, useEffect } from 'react'
import { FilterSidebar } from '@/components/FilterSidebar'
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard'
import { Listing } from '@/types'

const PER_PAGE = 6

export function ServiceListings({ serviceSlug }: { serviceSlug: string }) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    const qs = new URLSearchParams({ service_slug: serviceSlug })
    if (filters.area) qs.set('area', filters.area)
    fetch(`/api/listings?${qs}`)
      .then(r => r.json())
      .then(d => { setListings(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [serviceSlug, filters])

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => prev[key] === value ? { ...prev, [key]: '' } : { ...prev, [key]: value })
    setPage(1)
  }

  const paginated = listings.slice(0, page * PER_PAGE)
  const hasMore = paginated.length < listings.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-0 border-t border-[#E5E7EB]">
      <div className="py-8 pr-0 lg:pr-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${listings.length} verified listing${listings.length !== 1 ? 's' : ''}`}
          </p>
          <select className="text-xs border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-gray-500 bg-gray-50 outline-none">
            <option>Sort: Newest</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium mb-2">No listings yet</p>
            <p className="text-sm">Send us your requirements and we&apos;ll find the right match.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paginated.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
            {hasMore && (
              <button
                onClick={() => setPage(p => p + 1)}
                className="mt-6 w-full py-2.5 border border-[#E5E7EB] rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Load more
              </button>
            )}
          </>
        )}
      </div>

      <FilterSidebar serviceSlug={serviceSlug} activeFilters={filters} onFilter={handleFilter} />
    </div>
  )
}
