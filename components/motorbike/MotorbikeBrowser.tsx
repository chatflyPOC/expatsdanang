'use client'
import { useState, useEffect, useCallback } from 'react'
import { MotorbikeListing, MotorbikeType, MOTORBIKE_TYPES, DISTRICTS } from '@/types/motorbike'
import { MOCK_MOTORBIKE } from '@/lib/motorbike-mock'
import { MotorbikeCard, MotorbikeCardSkeleton } from './MotorbikeCard'
import { SlidersHorizontal, X } from 'lucide-react'

const PRICE_PRESETS = [
  { label: 'Under $7', max: 7 },
  { label: 'Under $10', max: 10 },
  { label: 'Under $15', max: 15 },
]

export function MotorbikeBrowser() {
  const [listings, setListings] = useState<MotorbikeListing[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [types, setTypes] = useState<MotorbikeType[]>([])
  const [district, setDistrict] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [helmet, setHelmet] = useState(false)
  const [insurance, setInsurance] = useState(false)
  const [delivery, setDelivery] = useState(false)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const qs = new URLSearchParams({ sort })
    if (types.length === 1) qs.set('type', types[0])
    if (district) qs.set('district', district)
    if (maxPrice) qs.set('maxPricePerDay', String(maxPrice))
    if (helmet) qs.set('helmetIncluded', 'true')
    if (insurance) qs.set('insuranceIncluded', 'true')
    if (delivery) qs.set('deliveryAvailable', 'true')

    try {
      const res = await fetch(`/api/motorbike/listings?${qs}`)
      const data = await res.json()
      setListings(Array.isArray(data.listings) ? data.listings : [])
    } catch {
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [sort, types, district, maxPrice, helmet, insurance, delivery])

  useEffect(() => { fetchListings() }, [fetchListings])

  const toggleType = (t: MotorbikeType) =>
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const activeFilterCount = types.length + (district ? 1 : 0) + (maxPrice ? 1 : 0) +
    [helmet, insurance, delivery].filter(Boolean).length

  const displayListings = listings.length === 0 && !loading ? [MOCK_MOTORBIKE] : listings
  const isMock = listings.length === 0 && !loading

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB] mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(v => !v)}
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

          {/* Type chips — desktop quick filter */}
          <div className="hidden sm:flex gap-2">
            {MOTORBIKE_TYPES.map(t => (
              <button key={t.value}
                onClick={() => toggleType(t.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${types.includes(t.value) ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 hover:border-[#1D9E75]'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400 hidden sm:block">
            {loading ? 'Loading...' : `${isMock ? 0 : listings.length} bike${listings.length !== 1 ? 's' : ''}`}
          </p>
          <select
            value={sort} onChange={e => setSort(e.target.value)}
            className="text-xs border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-gray-600 bg-white outline-none focus:border-[#1D9E75]"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-[#E5E7EB] rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Type */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {MOTORBIKE_TYPES.map(t => (
                <button key={t.value} onClick={() => toggleType(t.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${types.includes(t.value) ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 bg-white hover:border-[#1D9E75]'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* District */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Pickup area</p>
            <div className="flex flex-wrap gap-2">
              {DISTRICTS.map(d => (
                <button key={d.value} onClick={() => setDistrict(prev => prev === d.value ? '' : d.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${district === d.value ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 bg-white hover:border-[#1D9E75]'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price + must-haves */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Max price / day</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_PRESETS.map(p => (
                  <button key={p.max} onClick={() => setMaxPrice(prev => prev === p.max ? null : p.max)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${maxPrice === p.max ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 bg-white hover:border-[#1D9E75]'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Must have</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'helmet', label: 'Helmet', val: helmet, set: setHelmet },
                  { key: 'insurance', label: 'Insurance', val: insurance, set: setInsurance },
                  { key: 'delivery', label: 'Delivery', val: delivery, set: setDelivery },
                ].map(f => (
                  <button key={f.key} onClick={() => f.set(v => !v)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${f.val ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'border-[#E5E7EB] text-gray-600 bg-white hover:border-[#1D9E75]'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="sm:col-span-3 flex justify-end">
              <button onClick={() => { setTypes([]); setDistrict(''); setMaxPrice(null); setHelmet(false); setInsurance(false); setDelivery(false) }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors">
                <X size={12} /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mock notice */}
      {isMock && (
        <div className="mb-4 text-xs text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-full py-1.5 px-4 inline-flex">
          Sample listing — real bikes coming soon
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <MotorbikeCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayListings.map(l => (
            <MotorbikeCard key={l.id} listing={l} isMock={isMock} />
          ))}
        </div>
      )}
    </div>
  )
}
