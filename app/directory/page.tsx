import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronRight, BadgeCheck } from 'lucide-react'
import { DirectoryBrowser } from '@/components/directory/DirectoryBrowser'
import { getBusinesses, getCategoryCounts } from '@/lib/directory'
import { CATEGORIES, VERIFICATION_VALID_MONTHS } from '@/types/directory'
import { JsonLd } from '@/components/JsonLd'
import { absoluteUrl, breadcrumbLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Expat Directory — Businesses & Services in Da Nang',
  description:
    'Clinics, cafes, gyms, schools and everyday services in Da Nang, with English level, card payment and prices recorded. Listings carry a verified badge once someone who lives here has been.',
  path: '/directory',
  keywords: [
    'Da Nang expat directory',
    'English speaking services Da Nang',
    'foreigner friendly Da Nang',
    'Da Nang business directory expats',
    'where to go Da Nang expat',
  ],
})

export const revalidate = 3600

export default async function DirectoryPage() {
  const [businesses, counts] = await Promise.all([getBusinesses(), getCategoryCounts()])

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Directory', path: '/directory' },
          ]),
          {
            '@type': 'ItemList',
            name: 'Expat directory — Da Nang',
            description:
              'Businesses and services in Da Nang useful to foreigners, with English level, payment methods and pricing recorded where they have been checked.',
            url: absoluteUrl('/directory'),
            numberOfItems: CATEGORIES.length,
            itemListElement: CATEGORIES.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: c.label,
              url: absoluteUrl(`/directory/${c.slug}`),
            })),
          },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#E1F5EE] via-white to-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700">Directory</span>
          </nav>

          <span className="inline-block text-xs font-semibold text-[#1D9E75] bg-[#E1F5EE] border border-[#B6E5D4] px-3 py-1 rounded-full mb-4">
            📍 Expat Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Places in Da Nang that work for foreigners
          </h1>
          <p className="text-gray-500 max-w-2xl mb-6">
            A map search tells you where a clinic is. It does not tell you whether anyone
            there speaks English, whether they take a card, or whether the price on the
            wall is the price you pay. That is what the verified badge on a listing
            stands for.
          </p>
          <p className="text-xs text-gray-400 mb-2">A verified badge means someone went and checked:</p>
          <div className="flex flex-wrap gap-3">
            {[
              'English level recorded, not guessed',
              'Payment methods confirmed',
              'Prices posted or quoted',
              `Re-checked every ${VERIFICATION_VALID_MONTHS} months`,
            ].map((b) => (
              <span
                key={b}
                className="text-xs text-[#085041] bg-white border border-[#B6E5D4] px-3 py-1.5 rounded-full shadow-sm"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category grid */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Browse by category</h2>
        <p className="text-xs text-gray-400 mb-5">
          Each category page carries the attributes that matter for it.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
          {CATEGORIES.map((c) => {
            const Icon = c.icon
            const count = counts[c.slug] ?? 0
            return (
              <Link
                key={c.slug}
                href={`/directory/${c.slug}`}
                className="group border border-[#E5E7EB] rounded-xl p-4 hover:border-[#1D9E75]/60 hover:shadow-[0_12px_30px_-18px_rgba(29,158,117,0.45)] transition-all bg-white"
              >
                <span className="w-9 h-9 rounded-full bg-[#E1F5EE] text-[#0F6E56] flex items-center justify-center mb-3">
                  <Icon size={17} />
                </span>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#0F6E56] transition-colors">
                  {c.label}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{c.blurb}</p>
                <p className="text-[11px] text-gray-400 mt-2">
                  {count > 0 ? `${count} listed` : 'Nothing listed yet'}
                </p>
              </Link>
            )
          })}
        </div>

        {/* Everything, filterable */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1">All places</h2>
        <p className="text-xs text-gray-400">
          Filter across every category at once. Switch on <strong>Verified</strong> to
          see only the ones somebody has been to.
        </p>
        <DirectoryBrowser initialBusinesses={businesses} />

        {/* How verification works — the badge is the product, so it gets explained */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BadgeCheck size={20} className="text-[#1D9E75]" />
            What “verified” means here
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Someone from our team visits or calls the business, in Vietnamese, and records
            the same set of facts every time: whether a member of staff can hold a
            conversation in English, which payment methods are actually accepted, whether
            prices are posted, and anything an expat would otherwise find out the hard way
            — appointment-only hours, insurance the clinic cannot bill, a gym contract you
            cannot leave.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            The date of that check is shown on every listing. After{' '}
            {VERIFICATION_VALID_MONTHS} months the badge drops off on its own until the
            place is re-checked, because businesses change hands and staff move on. A
            badge with no date behind it is worth nothing.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Listings are free and nobody pays to be verified. If something has changed,{' '}
            <Link href="/get-help" className="text-[#1AA5D8] hover:underline">
              tell us
            </Link>{' '}
            and we will re-check it. For the longer background on each area of life here,
            start with the{' '}
            <Link href="/guides" className="text-[#1AA5D8] hover:underline">
              guides
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
