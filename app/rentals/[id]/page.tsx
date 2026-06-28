import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import {
  PUBLIC_COLUMNS,
  HousingListingPublic,
  typeLabel,
  fmtPrice,
} from '@/types/housing'
import { PreferencesProvider } from '@/components/rentals/PreferencesContext'
import { ImageGallery } from '@/components/rentals/ImageGallery'
import { PriceBlock } from '@/components/rentals/PriceBlock'
import { SpecsGrid } from '@/components/rentals/SpecsGrid'
import { AmenityGrid } from '@/components/rentals/AmenityGrid'
import { FeeTable } from '@/components/rentals/FeeTable'
import { LeaseTerms } from '@/components/rentals/LeaseTerms'
import { AreaMap } from '@/components/rentals/AreaMap'
import { TitleBlock } from '@/components/rentals/TitleBlock'
import { StickyMobileBar } from '@/components/rentals/StickyMobileBar'
import { SimilarSection } from '@/components/rentals/SimilarSection'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

// ── Security: PUBLIC_COLUMNS never includes lat, lng, owner_name, owner_phone,
//             owner_zalo, exact_address, commission_note, admin_notes, listing_source

interface Props {
  params: Promise<{ id: string }>
}

async function getListing(id: string): Promise<HousingListingPublic | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('housing_listings')
    .select(PUBLIC_COLUMNS)
    .eq('id', id)
    .in('status', ['available', 'pending'])
    .single()
  return data ? (data as unknown as HousingListingPublic) : null
}

function scoreSimilar(
  candidate: HousingListingPublic,
  target: HousingListingPublic
): number {
  let score = 0
  if (candidate.district === target.district) score += 50
  if (candidate.type === target.type) score += 25
  if (
    candidate.bedrooms !== null &&
    target.bedrooms !== null &&
    candidate.bedrooms === target.bedrooms
  ) score += 15
  const lo = target.price_usd * 0.75
  const hi = target.price_usd * 1.25
  if (candidate.price_usd >= lo && candidate.price_usd <= hi) score += 10
  return score
}

async function getSimilar(
  listing: HousingListingPublic
): Promise<HousingListingPublic[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('housing_listings')
    .select(PUBLIC_COLUMNS)
    .in('status', ['available', 'pending'])
    .neq('id', listing.id)
    .limit(20)
  if (!data) return []

  const candidates = data as unknown as HousingListingPublic[]
  return candidates
    .map(c => ({ listing: c, score: scoreSimilar(c, listing) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ listing }) => listing)
}

async function incrementViewCount(id: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('housing_listings')
    .select('view_count')
    .eq('id', id)
    .single()
  if (data) {
    const current = (data as unknown as { view_count: number }).view_count
    await supabase
      .from('housing_listings')
      .update({ view_count: current + 1 })
      .eq('id', id)
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) return { title: 'Listing not found — ExpatsDanang' }

  const title = `${listing.title_en} — Rental in ${listing.district_label} | ExpatsDanang`
  const description = [
    typeLabel(listing.type),
    listing.bedrooms !== null
      ? `${listing.bedrooms === 0 ? 'Studio' : listing.bedrooms + ' bed'}`
      : null,
    listing.area_sqm ? `${listing.area_sqm}m²` : null,
    listing.district_label,
    `from ${fmtPrice(listing.price_usd, false)}/mo`,
  ]
    .filter(Boolean)
    .join(' · ')

  const cover = listing.images?.[listing.cover_image_index ?? 0]

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: cover ? [{ url: cover, width: 1200, height: 630 }] : [],
      type: 'article',
    },
    alternates: { canonical: `/rentals/${id}` },
  }
}

export default async function RentalDetailPage({ params }: Props) {
  const { id } = await params

  const [listing] = await Promise.all([getListing(id)])
  if (!listing) notFound()

  const [similar] = await Promise.all([
    getSimilar(listing),
    // Fire-and-forget view count (non-blocking to rendering)
    incrementViewCount(id),
  ])

  const isNew = Date.now() - new Date(listing.created_at).getTime() < 7 * 86400_000
  const isPending = listing.status === 'pending'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': listing.type === 'house' || listing.type === 'villa' ? 'House' : 'Apartment',
    name: listing.title_en,
    description: `${typeLabel(listing.type)} for rent in ${listing.district_label}, Da Nang`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.district_label,
      addressRegion: 'Da Nang',
      addressCountry: 'VN',
    },
    numberOfRooms: listing.bedrooms ?? undefined,
    floorSize: listing.area_sqm
      ? { '@type': 'QuantitativeValue', value: listing.area_sqm, unitCode: 'MTK' }
      : undefined,
    offers: {
      '@type': 'Offer',
      price: listing.price_usd,
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: listing.price_usd,
        priceCurrency: 'USD',
        unitText: 'MONTH',
      },
    },
    image: listing.images?.slice(0, 5) ?? [],
    url: `https://expatsdanang.com/rentals/${listing.id}`,
  }

  return (
    <PreferencesProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white pb-28 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/housing" className="hover:text-gray-600 transition-colors">Rentals</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 line-clamp-1">{listing.title_en}</span>
          </nav>

          {/* Gallery — full width */}
          <div className="mb-6">
            <ImageGallery
              images={listing.images ?? []}
              videoUrl={listing.video_url}
              alt={listing.title_en}
            />
          </div>

          {/* 2-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Left: main content */}
            <div className="flex-1 min-w-0 space-y-8">
              <TitleBlock listing={listing} isNew={isNew} isPending={isPending} />
              <SpecsGrid listing={listing} />

              <Section title="Amenities">
                <AmenityGrid listing={listing} />
              </Section>

              <Section title="Cost breakdown">
                <FeeTable listing={listing} />
              </Section>

              <Section title="Lease terms">
                <LeaseTerms listing={listing} />
              </Section>

              <Section title="Area">
                <AreaMap listing={listing} />
              </Section>

              {similar.length > 0 && (
                <SimilarSection listings={similar} />
              )}
            </div>

            {/* ── Right: sticky price block (desktop only) */}
            <div className="hidden lg:block w-[340px] flex-none">
              <PriceBlock listing={listing} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <StickyMobileBar
        listingId={listing.id}
        listingTitle={listing.title_en}
        priceUsd={listing.price_usd}
        priceVnd={listing.price_vnd}
      />
    </PreferencesProvider>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  )
}
