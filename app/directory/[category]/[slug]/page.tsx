import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, BadgeCheck, AlertCircle, MapPin } from 'lucide-react'
import { ImageGallery } from '@/components/rentals/ImageGallery'
import { BusinessAttributes, BusinessContact } from '@/components/directory/BusinessAttributes'
import { BusinessCard } from '@/components/directory/BusinessCard'
import { getBusinessBySlug, getRelatedBusinesses } from '@/lib/directory'
import {
  getCategory, verificationState, VERIFICATION_VALID_MONTHS,
  englishLabel,
} from '@/types/directory'
import { JsonLd } from '@/components/JsonLd'
import { absoluteUrl, breadcrumbLd } from '@/lib/seo'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const business = await getBusinessBySlug(slug)
  if (!business || business.category !== category) {
    return { title: 'Not found — Expats Da Nang' }
  }

  const config = getCategory(business.category)
  const title = `${business.name} — ${business.district_label}, Da Nang`
  const description =
    business.short_description ??
    `${config?.label ?? 'Business'} in ${business.district_label}, Da Nang.${
      englishLabel(business.english_level) ? ` ${englishLabel(business.english_level)}.` : ''
    }`
  const cover = business.images?.[business.cover_image_index ?? 0]

  return {
    title,
    description,
    alternates: { canonical: `/directory/${business.category}/${business.slug}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/directory/${business.category}/${business.slug}`,
      images: cover ? [{ url: cover }] : [{ url: '/og.svg', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BusinessDetailPage({ params }: Props) {
  const { category, slug } = await params
  const business = await getBusinessBySlug(slug)
  // A slug is unique on its own, so a mismatched category means the URL was
  // hand-edited or an old link survived a recategorisation. 404 rather than
  // serving the same record under two paths.
  if (!business || business.category !== category) notFound()

  const config = getCategory(business.category)
  const verification = verificationState(business)
  const related = await getRelatedBusinesses(business)

  const images = (business.images ?? []).map((src) =>
    /^https?:\/\//i.test(src) ? src : absoluteUrl(src)
  )
  const url = absoluteUrl(`/directory/${business.category}/${business.slug}`)

  // Every page of the business's own that we know about, so a search engine
  // can tie this entry to the real thing rather than treating it as a
  // separate business with the same name.
  const sameAs = [business.website, business.facebook].filter(
    (u): u is string => Boolean(u) && /^https?:\/\//i.test(u!)
  )

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Directory', path: '/directory' },
            { name: config?.label ?? 'Category', path: `/directory/${business.category}` },
            { name: business.name, path: `/directory/${business.category}/${business.slug}` },
          ]),
          {
            '@type': config?.schemaType ?? 'LocalBusiness',
            '@id': `${url}#business`,
            name: business.name,
            url,
            // The layout puts a site-wide LocalBusiness for Expats Da Nang on
            // every page. On a directory entry that leaves two business nodes
            // competing to be what the page is about, so say outright that
            // this one is.
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            ...(business.short_description ? { description: business.short_description } : {}),
            ...(images.length ? { image: images } : {}),
            ...(business.phone ? { telephone: business.phone } : {}),
            ...(business.email ? { email: business.email } : {}),
            ...(sameAs.length ? { sameAs } : {}),
            ...(business.maps_url ? { hasMap: business.maps_url } : {}),
            ...(business.opening_hours_spec?.length
              ? { openingHours: business.opening_hours_spec }
              : {}),
            ...(business.price_level ? { priceRange: '$'.repeat(business.price_level) } : {}),
            address: {
              '@type': 'PostalAddress',
              ...(business.address ? { streetAddress: business.address } : {}),
              addressLocality: business.district_label,
              addressRegion: 'Da Nang',
              addressCountry: 'VN',
            },
            ...(business.lat && business.lng
              ? {
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: business.lat,
                    longitude: business.lng,
                  },
                }
              : {}),
            areaServed: { '@type': 'City', name: 'Da Nang' },
          },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 flex-wrap">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/directory" className="hover:text-gray-600">Directory</Link>
          <ChevronRight size={12} />
          <Link href={`/directory/${business.category}`} className="hover:text-gray-600">
            {config?.label}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 line-clamp-1">{business.name}</span>
        </nav>

        {images.length > 0 && (
          <div className="mb-6">
            <ImageGallery
              images={business.images ?? []}
              alt={business.name}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link
                  href={`/directory/${business.category}`}
                  className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {config?.label}
                </Link>
                {verification.current && (
                  <span className="flex items-center gap-1 text-xs font-semibold bg-[#E1F5EE] text-[#0F6E56] border border-[#B6E5D4] px-3 py-1 rounded-full">
                    <BadgeCheck size={13} /> Verified {verification.label}
                  </span>
                )}
                {business.featured && (
                  <span className="text-xs font-semibold bg-[#1D9E75] text-white px-3 py-1 rounded-full">
                    ⭐ Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {business.name}
              </h1>

              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={14} className="text-[#1D9E75]" />
                <span>{business.district_label}, Da Nang</span>
              </div>

              {business.short_description && (
                <p className="text-gray-600 leading-relaxed mt-4">{business.short_description}</p>
              )}
            </div>

            {/* Stale verification is stated rather than hidden: a listing whose
                check has aged out is still useful, but the reader should know
                which parts of it may have moved on. */}
            {verification.stale && (
              <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <AlertCircle size={16} className="text-amber-500 flex-none mt-0.5" />
                <p className="text-sm text-amber-800">
                  Last checked {verification.label}. Anything older than{' '}
                  {VERIFICATION_VALID_MONTHS} months loses its badge until we visit again,
                  so treat the details below as a starting point and confirm on the phone.
                </p>
              </div>
            )}

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                What expats need to know
              </h2>
              <BusinessAttributes business={business} />
            </section>

            {business.description && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Our notes</h2>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {business.description}
                </div>
              </section>
            )}

            {business.good_for && business.good_for.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Good for</h2>
                <div className="flex flex-wrap gap-2">
                  {business.good_for.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {business.verified_note && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  From the verification visit
                </h2>
                <div className="border border-[#E5E7EB] bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  {business.verified_note}
                </div>
              </section>
            )}

            {related.length > 0 && (
              <section className="mt-8 pt-8 border-t border-[#E5E7EB]">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Other {config?.noun} in the directory
                </h2>
                <p className="text-xs text-gray-400 mb-5">Nearby first</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {related.map((b) => (
                    <BusinessCard key={b.id} business={b} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="w-full lg:w-[320px] flex-none space-y-4">
            <BusinessContact business={business} />

            <div className="border border-[#E5E7EB] rounded-2xl p-4 bg-gray-50">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Something out of date?
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Prices, hours and staff change. Tell us and we will re-check this listing.
              </p>
              <Link
                href="/get-help"
                className="inline-flex items-center justify-center w-full rounded-full bg-[#1D9E75] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F6E56] transition-colors"
              >
                Report a change
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
