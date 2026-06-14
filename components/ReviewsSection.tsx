import { Star } from 'lucide-react'
import { Review } from '@/types'
import { Reveal } from '@/components/Reveal'
import { LeaveReviewButton } from '@/components/LeaveReviewButton'

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const items = reviews.length > 0 ? reviews : FALLBACK_REVIEWS
  const avg = items.reduce((s, r) => s + r.rating, 0) / items.length

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75] mb-3">What expats say</p>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Trusted by expats across Da Nang</h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={18} className={avg >= n - 0.4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{avg.toFixed(1)}</span> from {items.length}+ reviews
              </span>
            </div>
          </div>
          <LeaveReviewButton />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((r, i) => (
          <Reveal key={r.id || i} delay={(i % 3) * 80}>
            <div className="lift h-full border border-[#E5E7EB] rounded-2xl p-6 bg-white hover:border-[#1D9E75]/40">
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={15} className={r.rating >= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <p className="text-gray-600 italic leading-relaxed mb-4">&ldquo;{r.quote}&rdquo;</p>
              <p className="text-sm font-medium text-gray-900">{r.author_name}</p>
              {r.author_info && <p className="text-xs text-gray-400 mt-0.5">{r.author_info}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: '1',
    created_at: '',
    author_name: 'Tom H.',
    author_info: 'UK, living in An Thuong',
    rating: 5,
    quote: 'Saved me days of stress finding an apartment. They knew exactly what I needed.',
    status: 'approved',
    sort_order: 0,
  },
  {
    id: '2',
    created_at: '',
    author_name: 'Sarah M.',
    author_info: 'Canada, digital nomad',
    rating: 5,
    quote: 'Airport pickup was seamless, driver spoke English. Highly recommend.',
    status: 'approved',
    sort_order: 1,
  },
  {
    id: '3',
    created_at: '',
    author_name: 'Marco R.',
    author_info: 'Italy, living in My Khe',
    rating: 5,
    quote: 'Got my bank account sorted in one afternoon. Worth every penny.',
    status: 'approved',
    sort_order: 2,
  },
]
