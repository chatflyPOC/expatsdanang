import Link from 'next/link'
import { ArrowRight, BadgeCheck, MapPin } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { BusinessCard } from '@/components/directory/BusinessCard'
import { getBusinesses } from '@/lib/directory'
import { Business, CATEGORIES, CategoryConfig, VERIFICATION_VALID_MONTHS } from '@/types/directory'

/** Card width in the strip; also the `sizes` hint for the cover image. */
const CARD_WIDTH = 260

/**
 * Enough cards to span a wide viewport before the loop repeats.
 *
 * The strip animates by translating a track that holds the list twice, so a
 * short list would visibly repeat within one screen. Padding the list out to
 * this many entries first keeps the repeat off-screen.
 */
const MIN_ITEMS = 8

/** Repeats a short list until it is long enough to fill the strip. */
function padToFill<T>(items: T[], min = MIN_ITEMS): T[] {
  if (items.length === 0) return []
  const out: T[] = []
  while (out.length < min) out.push(...items)
  return out
}

/**
 * The homepage's directory strip.
 *
 * A server component on purpose: the scroll is a CSS animation on a duplicated
 * track, so the whole section ships without a line of client JavaScript, and
 * the cards are in the server HTML where crawlers can follow them.
 *
 * With nothing published yet the strip falls back to the eight categories, so
 * the section still says what the directory covers instead of rendering an
 * empty rail on the homepage.
 */
export async function DirectoryMarquee() {
  const businesses = await getBusinesses()
  const showing: 'businesses' | 'categories' = businesses.length > 0 ? 'businesses' : 'categories'

  const items =
    showing === 'businesses'
      ? padToFill(businesses.slice(0, 12))
      : padToFill(CATEGORIES)

  // Longer lists take proportionally longer, so cards always cross the screen
  // at the same speed no matter how much is in the directory.
  const duration = Math.max(32, items.length * 6)

  return (
    <section id="directory" className="py-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75] mb-3">
                Directory
              </p>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3 max-w-lg leading-snug">
                Places in Da Nang that work for foreigners
              </h2>
              <p className="text-gray-600 max-w-xl">
                Clinics, cafes, gyms and everyday services we have visited or called —
                English level, payment methods and prices checked, and re-checked every{' '}
                {VERIFICATION_VALID_MONTHS} months.
              </p>
            </div>

            <Link
              href="/directory"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1D9E75] hover:text-[#0F6E56] transition-colors whitespace-nowrap"
            >
              Browse the directory
              <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Full-bleed strip: it runs past the 1200px container to the window edge,
          which is what makes it read as moving across the screen rather than
          inside a box. */}
      <div className="marquee-viewport no-scrollbar relative">
        <div
          className="marquee-track flex gap-4 px-4"
          style={{ ['--marquee-duration' as string]: `${duration}s` }}
        >
          {/* Two passes of the same list: the first is the real content, the
              second exists only so the loop has somewhere to scroll to, and is
              hidden from assistive tech to avoid announcing it twice. */}
          {[0, 1].map((pass) => (
            <div key={pass} className="flex gap-4" aria-hidden={pass === 1}>
              {items.map((item, i) =>
                showing === 'businesses' ? (
                  <div key={`${(item as Business).id}-${i}`} style={{ width: CARD_WIDTH }} className="flex-none">
                    <BusinessCard
                      business={item as Business}
                      imageSizes={`${CARD_WIDTH}px`}
                    />
                  </div>
                ) : (
                  <CategoryTile key={`${(item as CategoryConfig).slug}-${i}`} category={item as CategoryConfig} />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {showing === 'categories' && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <BadgeCheck size={13} className="text-[#1D9E75]" />
            Nothing listed yet. The badge goes on a listing once someone has been
            there.
          </p>
        </div>
      )}
    </section>
  )
}

function CategoryTile({ category }: { category: CategoryConfig }) {
  const Icon = category.icon
  return (
    <Link
      href={`/directory/${category.slug}`}
      style={{ width: CARD_WIDTH }}
      className="lift group flex-none border border-[#E5E7EB] rounded-2xl p-5 bg-white hover:border-[#1D9E75]/50 hover:shadow-[0_12px_30px_-12px_rgba(29,158,117,0.35)]"
    >
      <span className="w-11 h-11 rounded-xl bg-[#E1F5EE] flex items-center justify-center mb-4 group-hover:bg-[#1D9E75] transition-colors">
        <Icon size={20} className="text-[#1D9E75] group-hover:text-white transition-colors" />
      </span>
      <p className="font-semibold text-gray-900 mb-1.5">{category.label}</p>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{category.blurb}</p>
      <span className="text-xs text-gray-400 inline-flex items-center gap-1.5">
        <MapPin size={12} /> Da Nang
      </span>
    </Link>
  )
}
