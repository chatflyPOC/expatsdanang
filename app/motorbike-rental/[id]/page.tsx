import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { PUBLIC_COLUMNS, MotorbikeListing, typeLabel } from '@/types/motorbike'
import { ImageGallery } from '@/components/rentals/ImageGallery'
import { MotorbikeSpecs } from '@/components/motorbike/MotorbikeSpecs'
import { MotorbikeEquipment } from '@/components/motorbike/MotorbikeEquipment'
import { MotorbikePricing } from '@/components/motorbike/MotorbikePricing'
import { MotorbikeStickyBar } from '@/components/motorbike/MotorbikeStickyBar'
import { MotorbikeCard } from '@/components/motorbike/MotorbikeCard'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, MapPin, Info } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

async function getListing(id: string): Promise<MotorbikeListing | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('motorbike_listings')
    .select(PUBLIC_COLUMNS)
    .eq('id', id)
    .eq('status', 'available')
    .single()
  return data ? (data as unknown as MotorbikeListing) : null
}

async function getSimilar(listing: MotorbikeListing): Promise<MotorbikeListing[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('motorbike_listings')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'available')
    .neq('id', listing.id)
    .limit(12)
  if (!data) return []

  return (data as unknown as MotorbikeListing[])
    .map(c => {
      let score = 0
      if (c.district === listing.district) score += 50
      if (c.type === listing.type) score += 30
      const lo = listing.price_per_day_usd * 0.6
      const hi = listing.price_per_day_usd * 1.5
      if (c.price_per_day_usd >= lo && c.price_per_day_usd <= hi) score += 20
      return { listing: c, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ listing }) => listing)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) return { title: 'Bike not found — ExpatsDanang' }

  const title = `${listing.brand} ${listing.model} for rent — ${listing.district_label} | ExpatsDanang`
  const description = `${typeLabel(listing.type)} ${listing.engine_cc ? listing.engine_cc + 'cc' : ''} from $${listing.price_per_day_usd}/day in ${listing.district_label}, Da Nang. ${listing.helmet_included ? 'Helmet included.' : ''} ${listing.insurance_included ? 'Insured.' : ''}`
  const cover = listing.images?.[listing.cover_image_index ?? 0]

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: cover ? [{ url: cover }] : [],
    },
    alternates: { canonical: `/motorbike-rental/${id}` },
  }
}

export default async function MotorbikeDetailPage({ params }: Props) {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) notFound()

  const [similar] = await Promise.all([getSimilar(listing)])

  const isNew = Date.now() - new Date(listing.created_at).getTime() < 7 * 86400_000

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: `${typeLabel(listing.type)} for rent in ${listing.district_label}, Da Nang`,
    brand: { '@type': 'Brand', name: listing.brand },
    offers: {
      '@type': 'Offer',
      price: listing.price_per_day_usd,
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: listing.price_per_day_usd,
        priceCurrency: 'USD',
        unitText: 'DAY',
      },
      availability: 'https://schema.org/InStock',
    },
    image: listing.images ?? [],
    url: `https://expatsdanang.com/motorbike-rental/${listing.id}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/motorbike-rental" className="hover:text-gray-600 transition-colors">Motorbike Rental</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 line-clamp-1">{listing.brand} {listing.model}</span>
          </nav>

          {/* Gallery */}
          <div className="mb-6">
            <ImageGallery
              images={listing.images ?? []}
              videoUrl={listing.video_url}
              alt={listing.title}
            />
          </div>

          {/* 2-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left: main content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Title block */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {typeLabel(listing.type)}
                  </span>
                  {listing.featured && (
                    <span className="text-xs font-semibold bg-[#1D9E75] text-white px-3 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                  {isNew && (
                    <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      ✨ New listing
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>

                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={14} className="text-[#1D9E75]" />
                  <span>Pickup: {listing.district_label}</span>
                  {listing.engine_cc && <><span className="text-gray-300">·</span><span>{listing.engine_cc}cc</span></>}
                  {listing.year_made && <><span className="text-gray-300">·</span><span>{listing.year_made}</span></>}
                </div>
              </div>

              <Section title="Bike specs">
                <MotorbikeSpecs listing={listing} />
              </Section>

              <Section title="Equipment & extras">
                <MotorbikeEquipment listing={listing} />
              </Section>

              {/* Delivery info */}
              {listing.delivery_available && (
                <Section title="Delivery">
                  <div className="bg-[#E1F5EE] border border-[#B6E5D4] rounded-xl p-4 text-sm text-[#085041]">
                    🛵 {listing.delivery_fee_usd
                      ? `Delivery available for $${listing.delivery_fee_usd} fee`
                      : 'Free delivery to your location'}
                    . Contact us to arrange a pickup time.
                  </div>
                </Section>
              )}

              {/* Notes */}
              {listing.notes && (
                <Section title="Owner notes">
                  <div className="flex gap-3 bg-gray-50 border border-[#E5E7EB] rounded-xl p-4">
                    <Info size={16} className="text-gray-400 flex-none mt-0.5" />
                    <p className="text-sm text-gray-600">{listing.notes}</p>
                  </div>
                </Section>
              )}

              {/* Pickup area */}
              <Section title="Pickup area">
                <div className="border border-[#E5E7EB] rounded-xl p-4 bg-gray-50 text-sm text-gray-600">
                  <p className="font-medium text-gray-800 mb-1">📍 {listing.district_label}</p>
                  <p className="text-xs text-gray-400">Exact pickup address confirmed after booking.</p>
                </div>
              </Section>

              {/* Similar bikes */}
              {similar.length > 0 && (
                <section className="mt-8 pt-8 border-t border-[#E5E7EB]">
                  <h2 className="text-base font-semibold text-gray-900 mb-1">Similar bikes</h2>
                  <p className="text-xs text-gray-400 mb-5">You might also like</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {similar.map(b => <MotorbikeCard key={b.id} listing={b} />)}
                  </div>
                </section>
              )}
            </div>

            {/* Right: sticky pricing */}
            <div className="hidden lg:block w-[320px] flex-none">
              <MotorbikePricing listing={listing} />
            </div>
          </div>
        </div>
      </div>

      <MotorbikeStickyBar
        listingId={listing.id}
        listingTitle={listing.title}
        pricePerDay={listing.price_per_day_usd}
        deliveryAvailable={listing.delivery_available}
        deliveryFeeUsd={listing.delivery_fee_usd}
      />
    </>
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
