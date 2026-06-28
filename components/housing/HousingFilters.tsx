'use client'
import { clsx } from 'clsx'
import { DISTRICTS, HOUSING_TYPES, type HousingFilters } from '@/types/housing'
import { X } from 'lucide-react'

const PRICE_PRESETS = [
  { label: 'Under $300', min: 0, max: 300 },
  { label: '$300–500', min: 300, max: 500 },
  { label: '$500–800', min: 500, max: 800 },
  { label: '$800+', min: 800, max: 9999 },
]

const DURATION_OPTIONS = [
  { value: '1m', label: '1 month+' },
  { value: '3m', label: '3 months+' },
  { value: '6m', label: '6 months+' },
  { value: '1y', label: '1 year+' },
]

interface Props {
  filters: HousingFilters
  onChange: (f: HousingFilters) => void
}

export function HousingFilters({ filters, onChange }: Props) {
  const set = <K extends keyof HousingFilters>(key: K, value: HousingFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const toggleArr = (key: 'districts' | 'types', val: string) => {
    const arr = filters[key] as string[]
    set(key, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const activePricePreset = PRICE_PRESETS.find(
    p => p.min === filters.priceMin && p.max === filters.priceMax
  )

  const selectPreset = (p: typeof PRICE_PRESETS[number]) => {
    if (activePricePreset?.label === p.label) {
      onChange({ ...filters, priceMin: 0, priceMax: 9999 })
    } else {
      onChange({ ...filters, priceMin: p.min, priceMax: p.max })
    }
  }

  const activeCount = [
    filters.districts.length > 0,
    filters.priceMin > 0 || filters.priceMax < 9999,
    filters.types.length > 0,
    filters.minBedrooms !== null,
    filters.petsAllowed,
    filters.hasPool,
    filters.hasSeaview,
    filters.fullyFurnished,
  ].filter(Boolean).length

  const reset = () => onChange({
    districts: [], priceMin: 0, priceMax: 9999,
    types: [], minBedrooms: null, minDuration: null,
    petsAllowed: false, hasPool: false, hasSeaview: false, fullyFurnished: false,
  })

  return (
    <aside className="border-l border-[#E5E7EB] p-6 bg-gray-50/60 space-y-6 lg:sticky lg:top-4 lg:self-start">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Filters</p>
        {activeCount > 0 && (
          <button onClick={reset} className="text-xs text-[#1D9E75] flex items-center gap-1 hover:text-[#0F6E56]">
            <X size={12} /> Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* District */}
      <FilterGroup title="Area">
        <div className="flex flex-wrap gap-1.5">
          {DISTRICTS.map(d => (
            <Chip
              key={d.value}
              active={filters.districts.includes(d.value)}
              onClick={() => toggleArr('districts', d.value)}
            >
              {d.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Budget / month">
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map(p => (
            <Chip
              key={p.label}
              active={activePricePreset?.label === p.label}
              onClick={() => selectPreset(p)}
            >
              {p.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      {/* Type */}
      <FilterGroup title="Property type">
        <div className="flex flex-wrap gap-1.5">
          {HOUSING_TYPES.map(t => (
            <Chip
              key={t.value}
              active={filters.types.includes(t.value)}
              onClick={() => toggleArr('types', t.value)}
            >
              {t.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      {/* Bedrooms */}
      <FilterGroup title="Min. bedrooms">
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3].map(n => (
            <Chip
              key={n}
              active={filters.minBedrooms === n}
              onClick={() => set('minBedrooms', filters.minBedrooms === n ? null : n)}
            >
              {n}+
            </Chip>
          ))}
        </div>
      </FilterGroup>

      {/* Must-haves */}
      <FilterGroup title="Must-haves">
        <div className="space-y-2">
          {([
            ['petsAllowed', 'Pets allowed'],
            ['hasPool', 'Swimming pool'],
            ['hasSeaview', 'Sea view'],
            ['fullyFurnished', 'Fully furnished'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={e => set(key, e.target.checked)}
                className="accent-[#1D9E75] w-3.5 h-3.5"
              />
              {label}
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Min rental duration */}
      <FilterGroup title="Rental duration">
        <div className="flex flex-wrap gap-1.5">
          {DURATION_OPTIONS.map(d => (
            <Chip
              key={d.value}
              active={filters.minDuration === d.value}
              onClick={() => set('minDuration', filters.minDuration === d.value ? null : d.value)}
            >
              {d.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      {/* CTA */}
      <div className="bg-[#E1F5EE] rounded-xl p-4">
        <p className="text-sm font-semibold text-[#085041] mb-1">Don&apos;t see what you need?</p>
        <p className="text-xs text-[#0F6E56] leading-relaxed mb-3">
          Tell us your requirements and we&apos;ll search for you.
        </p>
        <a
          href="#custom-search"
          className="block text-center text-xs font-medium bg-[#1D9E75] text-white px-4 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors"
        >
          Send your wishlist →
        </a>
      </div>
    </aside>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-900 mb-2.5">{title}</p>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'text-xs px-3 py-1.5 rounded-full border transition-colors',
        active
          ? 'bg-[#E1F5EE] text-[#085041] border-[#5DCAA5]'
          : 'border-[#D1D5DB] text-gray-500 hover:bg-gray-100'
      )}
    >
      {children}
    </button>
  )
}
