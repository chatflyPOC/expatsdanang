'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Search } from 'lucide-react'
import { GUIDES, CATEGORY_COLORS, GuideCategory } from '@/lib/guides'

const CATEGORIES: ('All' | GuideCategory)[] = [
  'All', 'Banking', 'Visas', 'Housing', 'Transport', 'Lifestyle', 'Health',
]

export function GuidesBrowser() {
  const [active, setActive] = useState<'All' | GuideCategory>('All')
  const [query, setQuery] = useState('')

  // Initialise search from ?q= (used by the site search box / SearchAction schema)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')
    if (q) setQuery(q)
  }, [])

  const filtered = useMemo(() => {
    return GUIDES.filter((g) => {
      const matchesCat = active === 'All' || g.category === active
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q || g.title.toLowerCase().includes(q) || g.excerpt.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [active, query])

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2 flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                active === cat
                  ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
                  : 'border-[#D1D5DB] text-gray-600 hover:border-[#1D9E75]/40 hover:text-[#1D9E75]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative lg:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides…"
            className="w-full border border-[#E5E7EB] rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-1">No guides found</p>
          <p className="text-sm">Try a different category or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="lift border border-[#E5E7EB] rounded-xl p-6 bg-white hover:border-[#1D9E75]/50 hover:shadow-[0_12px_30px_-14px_rgba(29,158,117,0.4)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[guide.category]}`}>
                  {guide.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} /> {guide.readTime}
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 leading-snug mb-3">{guide.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{guide.excerpt}</p>
              <span className="text-sm font-medium text-[#1D9E75] flex items-center gap-1">
                Read guide <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
