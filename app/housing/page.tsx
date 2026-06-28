import { HousingBrowser } from '@/components/housing/HousingBrowser'
import { JsonLd } from '@/components/JsonLd'
import { pageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = pageMetadata({
  title: 'Apartments & Houses for Rent in Da Nang',
  description:
    'Browse verified apartments and houses for rent in Da Nang. Expat-friendly listings with transparent pricing in USD and VND. No hidden fees, English-speaking landlords.',
  path: '/housing',
  keywords: [
    'apartments for rent Da Nang', 'Da Nang housing expats', 'An Thuong apartment rent',
    'My Khe apartment', 'Da Nang rental listings', 'expat housing Da Nang',
  ],
})

export default function HousingPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Apartments and Houses for Rent in Da Nang',
          description: 'Verified rental listings in Da Nang for expats and digital nomads',
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/housing`,
        }}
      />

      {/* Breadcrumb */}
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={12} />
        <Link href="/services/housing" className="hover:text-gray-700">Housing</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700">Listings</span>
      </nav>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero */}
        <div className="py-8 border-b border-[#E5E7EB] mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Apartments &amp; Houses for Rent in Da Nang
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
            Every listing is verified by our team. Prices shown are the real price — including what's
            included and what's extra. No bait-and-switch.
          </p>
        </div>

        <HousingBrowser />
      </div>
    </>
  )
}
