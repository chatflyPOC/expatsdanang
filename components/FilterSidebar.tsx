'use client'
import Link from 'next/link'
import { clsx } from 'clsx'

interface FilterGroup {
  title: string
  key: string
  options: string[]
}

const HOUSING_FILTERS: FilterGroup[] = [
  { title: 'Budget / month', key: 'price_range', options: ['Under $300', '$300–500', '$500–800', '$800+'] },
  { title: 'Area', key: 'area', options: ['An Thuong', 'My Khe', 'Han River', 'Ngu Hanh Son'] },
  { title: 'Type', key: 'type', options: ['Studio', '1BR', '2BR', 'House'] },
]

interface FilterSidebarProps {
  serviceSlug: string
  activeFilters: Record<string, string>
  onFilter: (key: string, value: string) => void
}

export function FilterSidebar({ serviceSlug, activeFilters, onFilter }: FilterSidebarProps) {
  const isHousing = serviceSlug === 'housing'

  return (
    <aside className="border-l border-[#E5E7EB] p-6 bg-gray-50 space-y-6">
      {isHousing ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Filter</p>
          {HOUSING_FILTERS.map((group) => (
            <div key={group.key}>
              <p className="text-sm font-medium text-gray-900 mb-3">{group.title}</p>
              <div className="flex flex-wrap gap-2">
                {group.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onFilter(group.key, opt)}
                    className={clsx(
                      'text-xs px-3 py-1.5 rounded-full border transition-colors',
                      activeFilters[group.key] === opt
                        ? 'bg-[#E1F5EE] text-[#085041] border-[#5DCAA5]'
                        : 'border-[#D1D5DB] text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">What&apos;s included</p>
          <p className="text-sm text-gray-600">Get in touch to discuss your specific needs and we&apos;ll tailor a solution for you.</p>
        </div>
      )}

      <div className="bg-[#E1F5EE] rounded-xl p-5">
        <p className="text-sm font-semibold text-[#085041] mb-1">Can&apos;t find what you need?</p>
        <p className="text-xs text-[#0F6E56] leading-relaxed mb-4">Tell us your requirements and we&apos;ll search for you.</p>
        <Link
          href="/get-help"
          className="block text-center text-xs font-medium bg-[#1D9E75] text-white px-4 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors"
        >
          Send your wishlist →
        </Link>
      </div>
    </aside>
  )
}
