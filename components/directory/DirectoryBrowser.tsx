'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Business, BusinessCategory, BusinessSortKey, CATEGORIES, DISTRICTS,
  amenityLabel, getCategory,
} from '@/types/directory'
import { BusinessCard, BusinessCardSkeleton } from './BusinessCard'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { clsx } from 'clsx'

/** Attributes offered as filters on every category. */
const BASE_AMENITIES = ['english-staff', 'card-accepted', 'parking', 'air-con']

const PRICE_LEVELS = [
  { value: 1, label: '$' },
  { value: 2, label: '$$' },
  { value: 3, label: '$$$' },
]

interface Props {
  initialBusinesses?: Business[]
  /** Set on a category page: locks the category and hides the category filter. */
  category?: BusinessCategory
}

export function DirectoryBrowser({ initialBusinesses = [], category }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses)
  const [loading, setLoading] = useState(false)
  /** Skips the mount-time refetch when the server already supplied the default set. */
  const skipInitialFetch = useRef(initialBusinesses.length > 0)

  const [sort, setSort] = useState<BusinessSortKey>('recommended')
  const [showFilters, setShowFilters] = useState(false)
  const [activeCategory, setActiveCategory] = useState<BusinessCategory | ''>(category ?? '')
  const [district, setDistrict] = useState('')
  const [englishFluent, setEnglishFluent] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [maxPriceLevel, setMaxPriceLevel] = useState<number | null>(null)
  const [amenities, setAmenities] = useState<string[]>([])
  const [query, setQuery] = useState('')
  /** Debounced copy of `query`, so typing doesn't fire a request per keystroke. */
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  const amenityOptions = [
    ...(category ? getCategory(category)?.highlightAmenities ?? [] : []),
    ...BASE_AMENITIES,
  ].filter((key, i, all) => all.indexOf(key) === i)

  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    const qs = new URLSearchParams({ sort })
    const effectiveCategory = category ?? activeCategory
    if (effectiveCategory) qs.set('category', effectiveCategory)
    if (district) qs.set('district', district)
    if (englishFluent) qs.set('englishFluent', 'true')
    if (verifiedOnly) qs.set('verifiedOnly', 'true')
    if (maxPriceLevel) qs.set('maxPriceLevel', String(maxPriceLevel))
    amenities.forEach((a) => qs.append('amenity', a))
    if (debouncedQuery) qs.set('q', debouncedQuery)

    try {
      const res = await fetch(`/api/directory/businesses?${qs}`)
      const data = await res.json()
      setBusinesses(Array.isArray(data.businesses) ? data.businesses : [])
    } catch {
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }, [sort, category, activeCategory, district, englishFluent, verifiedOnly, maxPriceLevel, amenities, debouncedQuery])

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false
      return
    }
    fetchBusinesses()
  }, [fetchBusinesses])

  const toggleAmenity = (key: string) =>
    setAmenities((prev) => (prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]))

  const activeFilterCount =
    (activeCategory && !category ? 1 : 0) +
    (district ? 1 : 0) +
    (englishFluent ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (maxPriceLevel ? 1 : 0) +
    amenities.length

  const clearAll = () => {
    if (!category) setActiveCategory('')
    setDistrict('')
    setEnglishFluent(false)
    setVerifiedOnly(false)
    setMaxPriceLevel(null)
    setAmenities([])
  }

  const noun = category ? getCategory(category)?.noun ?? 'places' : 'places'

  return (
    <div>
      {/* Search + toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-[#E5E7EB] mb-6">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${noun} by name, area or street`}
            aria-label="Search the directory"
            className="w-full border border-[#E5E7EB] rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-[#E5E7EB] px-3 py-1.5 rounded-full hover:border-[#1D9E75] transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#1D9E75] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <p className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">
            {loading ? 'Loading…' : `${businesses.length} ${businesses.length === 1 ? 'place' : 'places'}`}
          </p>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as BusinessSortKey)}
            aria-label="Sort results"
            className="text-xs border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-gray-600 bg-white outline-none focus:border-[#1D9E75]"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-[#E5E7EB] rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!category && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Chip
                    key={c.slug}
                    active={activeCategory === c.slug}
                    onClick={() => setActiveCategory((prev) => (prev === c.slug ? '' : c.slug))}
                  >
                    {c.label}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Area</p>
            <div className="flex flex-wrap gap-2">
              {DISTRICTS.map((d) => (
                <Chip
                  key={d.value}
                  active={district === d.value}
                  onClick={() => setDistrict((prev) => (prev === d.value ? '' : d.value))}
                >
                  {d.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Price</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_LEVELS.map((p) => (
                  <Chip
                    key={p.value}
                    active={maxPriceLevel === p.value}
                    onClick={() => setMaxPriceLevel((prev) => (prev === p.value ? null : p.value))}
                  >
                    {p.label} and under
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Trust</p>
              <div className="flex flex-wrap gap-2">
                <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
                  Verified only
                </Chip>
                <Chip active={englishFluent} onClick={() => setEnglishFluent((v) => !v)}>
                  Fluent English
                </Chip>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Must have</p>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((key) => (
                <Chip key={key} active={amenities.includes(key)} onClick={() => toggleAmenity(key)}>
                  {amenityLabel(key)}
                </Chip>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X size={12} /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <BusinessCardSkeleton key={i} />
          ))}
        </div>
      ) : businesses.length === 0 ? (
        <div className="border border-dashed border-[#E5E7EB] rounded-xl py-16 px-6 text-center">
          <p className="text-sm font-medium text-gray-700 mb-1">
            {activeFilterCount > 0 || debouncedQuery
              ? 'Nothing matches those filters yet'
              : 'This part of the directory is still being verified'}
          </p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Every place here is visited or called before it is listed, so the directory
            fills up slowly on purpose. Tell us what you were looking for and we will
            check it next.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            {(activeFilterCount > 0 || debouncedQuery) && (
              <button
                onClick={() => {
                  clearAll()
                  setQuery('')
                }}
                className="text-xs border border-[#E5E7EB] px-4 py-2 rounded-full text-gray-600 hover:border-[#1D9E75] transition-colors"
              >
                Clear filters
              </button>
            )}
            <a
              href="/get-help"
              className="text-xs bg-[#1D9E75] text-white px-4 py-2 rounded-full hover:bg-[#0F6E56] transition-colors"
            >
              Ask us to find one
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {businesses.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        'text-xs px-3 py-1.5 rounded-full border transition-colors',
        active
          ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
          : 'border-[#E5E7EB] text-gray-600 bg-white hover:border-[#1D9E75]'
      )}
    >
      {children}
    </button>
  )
}
