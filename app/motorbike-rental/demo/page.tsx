import { MOCK_MOTORBIKE } from '@/lib/motorbike-mock'
import { typeLabel } from '@/types/motorbike'
import { ImageGallery } from '@/components/rentals/ImageGallery'
import { MotorbikeSpecs } from '@/components/motorbike/MotorbikeSpecs'
import { MotorbikeEquipment } from '@/components/motorbike/MotorbikeEquipment'
import { MotorbikePricing } from '@/components/motorbike/MotorbikePricing'
import { MotorbikeStickyBar } from '@/components/motorbike/MotorbikeStickyBar'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, MapPin, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Demo — Motorbike Rental | ExpatsDanang',
  robots: { index: false },
}

export default function MotorbikeDemoPage() {
  const listing = MOCK_MOTORBIKE

  return (
    <>
      {/* Demo banner */}
      <div className="bg-amber-50 border-b border-amber-200 text-center py-2 px-4 text-xs text-amber-700 font-medium">
        🎭 Demo listing — Real bikes coming soon!
      </div>

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

            {/* Left */}
            <div className="flex-1 min-w-0 space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {typeLabel(listing.type)}
                  </span>
                  <span className="text-xs font-semibold bg-[#1D9E75] text-white px-3 py-1 rounded-full">
                    ⭐ Featured
                  </span>
                  <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                    🎭 Demo
                  </span>
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

              {listing.notes && (
                <Section title="Owner notes">
                  <div className="flex gap-3 bg-gray-50 border border-[#E5E7EB] rounded-xl p-4">
                    <Info size={16} className="text-gray-400 flex-none mt-0.5" />
                    <p className="text-sm text-gray-600">{listing.notes}</p>
                  </div>
                </Section>
              )}

              <Section title="Pickup area">
                <div className="border border-[#E5E7EB] rounded-xl p-4 bg-gray-50 text-sm text-gray-600">
                  <p className="font-medium text-gray-800 mb-1">📍 {listing.district_label}</p>
                  <p className="text-xs text-gray-400">Exact pickup address confirmed after booking.</p>
                </div>
              </Section>
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
