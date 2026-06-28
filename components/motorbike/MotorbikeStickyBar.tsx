'use client'
import { useState } from 'react'
import { MotorbikeInquiryForm } from './MotorbikeInquiryForm'

interface Props {
  listingId: string
  listingTitle: string
  pricePerDay: number
  deliveryAvailable?: boolean
  deliveryFeeUsd?: number | null
}

export function MotorbikeStickyBar({ listingId, listingTitle, pricePerDay, deliveryAvailable, deliveryFeeUsd }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 leading-none mb-0.5">from</p>
            <p className="text-xl font-bold text-[#0F6E56] leading-none">
              ${pricePerDay}
              <span className="text-xs font-normal text-gray-400">/day</span>
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex-none bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-semibold px-5 py-3 rounded-full text-sm transition-colors whitespace-nowrap"
          >
            Book / Inquire →
          </button>
        </div>
      </div>

      {open && (
        <MotorbikeInquiryForm
          listingId={listingId}
          listingTitle={listingTitle}
          pricePerDay={pricePerDay}
          deliveryAvailable={deliveryAvailable}
          deliveryFeeUsd={deliveryFeeUsd}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
