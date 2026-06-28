import type { Metadata } from 'next'
import { MotorbikeBrowser } from '@/components/motorbike/MotorbikeBrowser'

export const metadata: Metadata = {
  title: 'Motorbike Rental Da Nang — from $5/day | ExpatsDanang',
  description: 'Rent a motorbike in Da Nang from $5/day. Verified scooters, semi-autos and trail bikes. Helmet included, delivery available. Trusted by expats and digital nomads.',
  alternates: { canonical: '/motorbike-rental' },
  openGraph: {
    title: 'Motorbike Rental Da Nang — from $5/day',
    description: 'Rent a motorbike in Da Nang from $5/day. Verified bikes, flexible terms, delivery available.',
    type: 'website',
  },
}

export default function MotorbikeRentalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#E1F5EE] via-white to-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <span className="inline-block text-xs font-semibold text-[#1D9E75] bg-[#E1F5EE] border border-[#B6E5D4] px-3 py-1 rounded-full mb-4">
            🏍️ Motorbike Rental
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Explore Da Nang on two wheels
          </h1>
          <p className="text-gray-500 max-w-xl mb-6">
            Verified scooters, semi-autos, and trail bikes from local owners. Helmets included,
            delivery to your door, flexible daily to monthly rates.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              '✓ Verified, well-maintained bikes',
              '✓ Helmet always included',
              '✓ Delivery available',
              '✓ Daily, weekly & monthly rates',
            ].map(b => (
              <span key={b} className="text-xs text-[#085041] bg-white border border-[#B6E5D4] px-3 py-1.5 rounded-full shadow-sm">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <MotorbikeBrowser />
    </div>
  )
}
