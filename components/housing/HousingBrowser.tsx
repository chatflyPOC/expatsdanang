'use client'
import { useState, useEffect, useCallback } from 'react'
import { HousingListingPublic, HousingFilters as FiltersType, HousingSortKey } from '@/types/housing'
import { HousingCard, HousingCardSkeleton } from './HousingCard'
import { HousingFilters } from './HousingFilters'
import { CustomSearchForm } from './CustomSearchForm'
import { SlidersHorizontal, X, DollarSign } from 'lucide-react'
import { clsx } from 'clsx'

// Shown when DB has no listings yet (demo / seed not yet applied)
const MOCK_LISTING: HousingListingPublic = {
  id: 'mock-001',
  created_at: new Date().toISOString(),
  title_vn: '3BR Garden House — Ngu Hanh Son / Marble Mountains',
  title_en: '3BR Garden House — Ngu Hanh Son / Marble Mountains',
  type: 'house',
  area_sqm: 130,
  bedrooms: 3,
  bathrooms: 2,
  floor_number: 1,
  furnishing: 'partial',
  views: ['garden'],
  district: 'ngu-hanh-son',
  district_label: 'Ngu Hanh Son',
  distance_to_beach_m: 1400,
  nearby_refs: ['Near Marble Mountains', 'Near Non Nuoc beach', 'Quiet residential street'],
  price_usd: 650,
  price_vnd: 16250000,
  short_term_price_usd: null,
  deposit_months: 2,
  electricity_note: 'Government rate',
  water_included: true,
  internet_included: false,
  management_fee_usd: null,
  cleaning_fee_usd: null,
  parking_note: 'Free motorbike + car parking',
  min_duration: '6m',
  pets_allowed: true,
  temp_residence_support: false,
  english_contract: false,
  available_date: null,
  has_ac: true, has_washer: true, has_water_heater: true,
  kitchen_type: 'gas', has_fridge: true, has_microwave: false,
  has_tv: true, has_desk: true, has_balcony: false,
  has_pool: false, has_gym: false, has_elevator: false,
  has_security: false, has_motorbike_parking: true, has_car_parking: true, has_reception: false,
  images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'],
  video_url: null,
  cover_image_index: 0,
  status: 'available',
  featured: false,
  view_count: 0,
  inquiry_count: 0,
}

const DEFAULT_FILTERS: FiltersType = {
  districts: [],
  priceMin: 0,
  priceMax: 9999,
  types: [],
  minBedrooms: null,
  minDuration: null,
  petsAllowed: false,
  hasPool: false,
  hasSeaview: false,
  fullyFurnished: false,
}

const PER_PAGE = 9

export function HousingBrowser() {
  const [listings, setListings] = useState<HousingListingPublic[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FiltersType>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<HousingSortKey>('newest')
  const [showVnd, setShowVnd] = useState(false)
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const qs = new URLSearchParams({ sort })
    if (filters.districts.length === 1) qs.set('district', filters.districts[0])
    if (filters.types.length === 1) qs.set('type', filters.types[0])
    if (filters.priceMin > 0) qs.set('price_min', String(filters.priceMin))
    if (filters.priceMax < 9999) qs.set('price_max', String(filters.priceMax))
    if (filters.minBedrooms) qs.set('min_bedrooms', String(filters.minBedrooms))
    if (filters.petsAllowed) qs.set('pets_allowed', 'true')
    if (filters.hasPool) qs.set('has_pool', 'true')
    if (filters.hasSeaview) qs.set('has_seaview', 'true')
    if (filters.fullyFurnished) qs.set('fully_furnished', 'true')

    try {
      const res = await fetch(`/api/housing/listings?${qs}`)
      const data = await res.json()
      // Client-side filter for multi-value fields the API can't handle cleanly
      let result: HousingListingPublic[] = Array.isArray(data) ? data : []
      if (filters.districts.length > 1) {
        result = result.filter(l => filters.districts.includes(l.district))
      }
      if (filters.types.length > 1) {
        result = result.filter(l => filters.types.includes(l.type))
      }
      setListings(result)
      setPage(1)
    } finally {
      setLoading(false)
    }
  }, [filters, sort])

  useEffect(() => { fetchListings() }, [fetchListings])

  const paginated = listings.slice(0, page * PER_PAGE)
  const hasMore = paginated.length < listings.length

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 py-4 border-b border-[#E5E7EB] mb-6 flex-wrap">
        <p className="text-sm text-gray-500 flex-1">
          {loading ? 'Loading…' : `${listings.length} listing${listings.length !== 1 ? 's' : ''}`}
        </p>

        {/* Currency toggle */}
        <button
          onClick={() => setShowVnd(v => !v)}
          className={clsx(
            'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors',
            showVnd
              ? 'bg-[#E1F5EE] border-[#5DCAA5] text-[#085041]'
              : 'border-[#E5E7EB] text-gray-500 hover:bg-gray-50'
          )}
        >
          <DollarSign size={12} />
          {showVnd ? 'VND' : 'USD'} — click to switch
        </button>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as HousingSortKey)}
          className="text-xs border border-[#E5E7EB] rounded-full px-3 py-1.5 text-gray-600 bg-white outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low → high</option>
          <option value="price_desc">Price: high → low</option>
          <option value="nearest_beach">Nearest to beach</option>
        </select>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(o => !o)}
          className="lg:hidden flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
        >
          <SlidersHorizontal size={13} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-0">
        {/* Listings grid */}
        <div className="pr-0 lg:pr-8 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <HousingCardSkeleton key={i} />)}
            </div>
          ) : listings.length === 0 ? (
            <div>
              {/* Show mock listing so the page never looks empty */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                  Sample listing — more coming soon
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <HousingCard listing={MOCK_LISTING} showVnd={showVnd} />
                </div>
              </div>
              {/* Only show "no results" message when filters are actively applied */}
              {Object.values(filters).some(v =>
                Array.isArray(v) ? v.length > 0 : v !== null && v !== false && v !== 0 && v !== 9999
              ) && (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm mb-3">No listings match your current filters.</p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="text-sm text-[#1D9E75] underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginated.map(l => (
                  <HousingCard key={l.id} listing={l} showVnd={showVnd} />
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="mt-8 w-full py-2.5 border border-[#E5E7EB] rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Load more ({listings.length - paginated.length} remaining)
                </button>
              )}
            </>
          )}

          {/* Custom search CTA */}
          <div id="custom-search" className="mt-16 scroll-mt-8">
            <CustomSearchForm />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <HousingFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <p className="font-semibold text-gray-900">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <HousingFilters filters={filters} onChange={f => { setFilters(f); setMobileFiltersOpen(false) }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
