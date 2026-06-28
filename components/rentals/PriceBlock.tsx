'use client'
import { useState } from 'react'
import { HousingListingPublic, fmtPrice, USD_TO_VND } from '@/types/housing'
import { InquiryForm } from '@/components/housing/InquiryForm'
import { WishlistButton } from '@/components/housing/WishlistButton'
import { ShareButton } from '@/components/housing/ShareButton'
import { usePrefs } from './PreferencesContext'
import { ShieldCheck, Clock } from 'lucide-react'

interface Props { listing: HousingListingPublic }

export function PriceBlock({ listing }: Props) {
  const { currency, toggleCurrency } = usePrefs()
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const showVnd = currency === 'vnd'

  return (
    <>
      <div className="lg:sticky lg:top-6 space-y-3">
        {/* Price card */}
        <div className="border border-[#E5E7EB] rounded-2xl p-5 bg-white shadow-sm">
          {/* Price row */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-3xl font-bold text-[#0F6E56] leading-none">
                {fmtPrice(listing.price_usd, showVnd)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">/ month</p>
            </div>
            <div className="flex gap-1.5">
              <WishlistButton listingId={listing.id} className="border border-[#E5E7EB]" />
              <ShareButton title={listing.title_en} />
            </div>
          </div>

          {/* Currency toggle */}
          <button
            onClick={toggleCurrency}
            className="text-xs text-[#1D9E75] hover:text-[#0F6E56] underline underline-offset-2 mb-3"
          >
            {showVnd ? 'Show in USD' : `≈ ${(listing.price_usd * USD_TO_VND / 1_000_000).toFixed(0)}M ₫ — show in VND`}
          </button>

          {/* Short-term */}
          {listing.short_term_price_usd && (
            <p className="text-sm text-gray-500 mb-3">
              Short-term:{' '}
              <strong className="text-gray-800">
                {fmtPrice(listing.short_term_price_usd, showVnd)}/week
              </strong>
            </p>
          )}

          {/* Deposit */}
          <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4 text-sm text-gray-600">
            Deposit: <strong className="text-gray-900">
              {listing.deposit_months} month{listing.deposit_months !== 1 ? 's' : ''} rent
            </strong>
            {' '}({fmtPrice(listing.price_usd * listing.deposit_months, showVnd)})
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => setInquiryOpen(true)}
            className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
          >
            Request a viewing →
          </button>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <ShieldCheck size={12} className="text-[#1D9E75]" /> Free service
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} className="text-[#1D9E75]" /> Reply within 2 hrs
            </span>
          </div>
        </div>

        {/* Quick facts */}
        <div className="border border-[#E5E7EB] rounded-2xl p-4 space-y-2.5 text-sm bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">At a glance</p>
          {[
            ['Furnishing', listing.furnishing === 'full' ? 'Fully furnished' : listing.furnishing === 'partial' ? 'Partially furnished' : listing.furnishing === 'unfurnished' ? 'Unfurnished' : '—'],
            ['Views', listing.views?.join(', ') || '—'],
            ['Min. stay', listing.min_duration === '1m' ? '1 month' : listing.min_duration === '3m' ? '3 months' : listing.min_duration === '6m' ? '6 months' : listing.min_duration === '1y' ? '1 year' : 'Flexible'],
            ['Pets', listing.pets_allowed ? '✓ Allowed' : '✗ Not allowed'],
            ['English contract', listing.english_contract ? '✓ Available' : '✗ Vietnamese only'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <span className="text-gray-400">{k}</span>
              <span className="font-medium text-gray-800 text-right">{v}</span>
            </div>
          ))}
        </div>

        {/* Concierge note */}
        <div className="bg-[#E1F5EE] rounded-2xl p-4 text-sm">
          <p className="font-semibold text-[#085041] mb-1">Need help deciding?</p>
          <p className="text-xs text-[#0F6E56] leading-relaxed">
            Our bilingual concierge can arrange viewings, review the lease in Vietnamese, and negotiate on your behalf.
          </p>
        </div>
      </div>

      {inquiryOpen && (
        <InquiryForm
          listingId={listing.id}
          listingTitle={listing.title_en}
          onClose={() => setInquiryOpen(false)}
        />
      )}
    </>
  )
}
