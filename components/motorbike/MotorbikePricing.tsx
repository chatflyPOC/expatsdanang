'use client'
import { useState } from 'react'
import { MotorbikeListing } from '@/types/motorbike'
import { MotorbikeInquiryForm } from './MotorbikeInquiryForm'
import { WishlistButton } from '@/components/housing/WishlistButton'
import { ShareButton } from '@/components/housing/ShareButton'
import { Truck, Shield, Clock } from 'lucide-react'

export function MotorbikePricing({ listing }: { listing: MotorbikeListing }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden lg:sticky lg:top-6 shadow-sm">
        {/* Price header */}
        <div className="bg-gradient-to-br from-[#E1F5EE] to-[#F0FAF6] px-5 py-4 border-b border-[#B6E5D4]">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-3xl font-bold text-[#0F6E56]">
                ${listing.price_per_day_usd}
                <span className="text-sm font-normal text-[#1D9E75]">/day</span>
              </p>
              <p className="text-xs text-[#1D9E75] mt-0.5">+ ${listing.deposit_usd} refundable deposit</p>
            </div>
            <div className="flex gap-1.5">
              <WishlistButton listingId={listing.id} />
              <ShareButton title={listing.title} />
            </div>
          </div>
        </div>

        {/* Rate table */}
        <div className="px-5 py-4 space-y-2.5 border-b border-[#E5E7EB]">
          <RateRow label="Daily rate" amount={listing.price_per_day_usd} unit="day" highlight />
          {listing.price_per_week_usd && (
            <RateRow
              label="Weekly rate"
              amount={listing.price_per_week_usd}
              unit="week"
              savings={Math.round((1 - listing.price_per_week_usd / (listing.price_per_day_usd * 7)) * 100)}
            />
          )}
          {listing.price_per_month_usd && (
            <RateRow
              label="Monthly rate"
              amount={listing.price_per_month_usd}
              unit="month"
              savings={Math.round((1 - listing.price_per_month_usd / (listing.price_per_day_usd * 30)) * 100)}
            />
          )}
        </div>

        {/* Info chips */}
        <div className="px-5 py-3 space-y-2 border-b border-[#E5E7EB] bg-gray-50">
          {listing.delivery_available && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Truck size={13} className="text-[#1D9E75] flex-none" />
              {listing.delivery_fee_usd
                ? `Delivery available — $${listing.delivery_fee_usd} fee`
                : 'Free delivery available'}
            </div>
          )}
          {listing.insurance_included && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Shield size={13} className="text-[#1D9E75] flex-none" />
              Insurance included
            </div>
          )}
          {listing.min_rental_days > 1 && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock size={13} className="text-[#1D9E75] flex-none" />
              Minimum {listing.min_rental_days} days
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-5 py-4 space-y-3">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
          >
            Book / Inquire →
          </button>
          <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400">
            <span>✓ Free to inquire</span>
            <span>✓ Reply within 2 hrs</span>
          </div>
        </div>
      </div>

      {open && (
        <MotorbikeInquiryForm
          listingId={listing.id}
          listingTitle={listing.title}
          pricePerDay={listing.price_per_day_usd}
          deliveryAvailable={listing.delivery_available}
          deliveryFeeUsd={listing.delivery_fee_usd}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function RateRow({
  label, amount, unit, highlight, savings,
}: {
  label: string; amount: number; unit: string; highlight?: boolean; savings?: number
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${highlight ? 'font-medium' : ''}`}>
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {savings && savings > 0 && (
          <span className="text-[10px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
            Save {savings}%
          </span>
        )}
        <span className={`text-sm ${highlight ? 'text-[#0F6E56] font-bold' : 'text-gray-600'}`}>
          ${amount}<span className="text-xs text-gray-400">/{unit}</span>
        </span>
      </div>
    </div>
  )
}
