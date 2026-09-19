import Link from 'next/link'
import type { Metadata } from 'next'
import { MotorbikeBrowser } from '@/components/motorbike/MotorbikeBrowser'
import { getInitialMotorbikeListings } from '@/lib/listings'
import { JsonLd } from '@/components/JsonLd'
import { absoluteUrl, breadcrumbLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Motorbike Rental in Da Nang — From $5/day',
  description:
    'Rent a motorbike in Da Nang from $5/day. Verified scooters, semi-autos, manuals and trail bikes with helmet included and delivery available. Daily, weekly and monthly rates.',
  path: '/motorbike-rental',
  keywords: [
    'motorbike rental Da Nang',
    'scooter rental Da Nang',
    'rent a motorbike Da Nang',
    'monthly motorbike rental Da Nang',
    'Honda Air Blade rental Da Nang',
    'motorbike hire Da Nang expats',
  ],
})

export const revalidate = 3600

export default async function MotorbikeRentalPage() {
  const initialListings = await getInitialMotorbikeListings()

  const prices = initialListings
    .map((l) => l.price_per_day_usd)
    .filter((p): p is number => typeof p === 'number')
  const from = prices.length ? Math.min(...prices) : null

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Motorbike Rental', path: '/motorbike-rental' },
          ]),
          {
            '@type': 'ItemList',
            name: 'Motorbikes for rent in Da Nang',
            description:
              'Verified scooters, semi-automatics, manuals and trail bikes available to rent in Da Nang.',
            url: absoluteUrl('/motorbike-rental'),
            numberOfItems: initialListings.length,
            itemListElement: initialListings.map((l, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: l.title,
                url: absoluteUrl(`/motorbike-rental/${l.id}`),
                ...(l.images?.[0]
                  ? {
                      image: /^https?:\/\//i.test(l.images[0])
                        ? l.images[0]
                        : absoluteUrl(l.images[0]),
                    }
                  : {}),
                ...(l.engine_cc
                  ? {
                      additionalProperty: {
                        '@type': 'PropertyValue',
                        name: 'Engine displacement',
                        value: `${l.engine_cc} cc`,
                      },
                    }
                  : {}),
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'USD',
                  price: String(l.price_per_day_usd),
                  availability: 'https://schema.org/InStock',
                  url: absoluteUrl(`/motorbike-rental/${l.id}`),
                  areaServed: { '@type': 'City', name: 'Da Nang' },
                },
              },
            })),
          },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#E1F5EE] via-white to-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <span className="text-gray-700">Motorbike Rental</span>
          </nav>

          <span className="inline-block text-xs font-semibold text-[#1D9E75] bg-[#E1F5EE] border border-[#B6E5D4] px-3 py-1 rounded-full mb-4">
            🏍️ Motorbike Rental
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Motorbike rental in Da Nang
          </h1>
          <p className="text-gray-500 max-w-xl mb-6">
            Verified scooters, semi-autos, manuals and trail bikes from local owners
            {from ? ` from $${from}/day` : ''}. Helmets included, delivery to your door,
            flexible daily to monthly rates.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              '✓ Verified, well-maintained bikes',
              '✓ Helmet always included',
              '✓ Delivery available',
              '✓ Daily, weekly & monthly rates',
            ].map((b) => (
              <span key={b} className="text-xs text-[#085041] bg-white border border-[#B6E5D4] px-3 py-1.5 rounded-full shadow-sm">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <MotorbikeBrowser initialListings={initialListings} />

      {/* Supporting copy. Kept below the listings so the inventory stays the
          first thing a visitor sees, while giving the page the substance a
          commercial landing page needs. */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4 space-y-10">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Which motorbike should you rent in Da Nang?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Most expats end up on an automatic scooter. It is the easiest to ride in city
            traffic, the cheapest to rent, and you can park it anywhere. A semi-automatic
            costs a little less to run and handles the coast road well. Manual and trail
            bikes make sense if you plan on the Hai Van Pass or longer rides out of the
            city — they are heavier and less convenient for daily errands.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Engine size matters more than it looks. Anything above 50cc requires the
            appropriate licence class, and bikes at 150cc and up are noticeably harder to
            handle in dense traffic if you have not ridden before.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Daily, weekly or monthly?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Daily rates suit short stays and test rides. If you are here for more than a
            couple of weeks, the monthly rate is almost always the better deal — the
            per-day cost drops sharply, and you avoid renegotiating every few days. Every
            listing above shows its weekly and monthly price where the owner offers one,
            so you can compare before contacting anyone.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            What you need to rent legally
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            To ride legally you need either a Vietnamese licence covering the bike, or an
            International Driving Permit issued under the 1968 Vienna Convention carried
            together with your original home licence. Permits issued under the 1949 Geneva
            Convention — the standard in the United States, Canada, Australia and Japan —
            are not recognised in Vietnam.
          </p>
          <p className="text-gray-600 leading-relaxed">
            This matters beyond the fine: most travel and health policies will not pay out
            for an accident on a bike you were not licensed to ride. Our{' '}
            <Link href="/guides/motorbike-rental-da-nang" className="text-[#1AA5D8] hover:underline">
              motorbike rental guide
            </Link>{' '}
            covers the licence question, deposits and what to check before you ride, and
            the{' '}
            <Link href="/guides/getting-around-da-nang" className="text-[#1AA5D8] hover:underline">
              transport guide
            </Link>{' '}
            compares renting against Grab and taxis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Deposits and paperwork
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Rental shops in Da Nang commonly ask to hold a passport or a cash deposit as
            security. Handing over your original passport is worth avoiding — you need it
            for hotels, banks and visa work, and getting it back can become leverage in a
            dispute. Agree the deposit, the fuel policy and who pays for a scratch before
            money changes hands, and photograph the bike from every angle at pickup.
          </p>
        </section>
      </div>
    </div>
  )
}
