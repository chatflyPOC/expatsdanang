'use client'
import { useState } from 'react'
import { InquiryForm } from '@/components/housing/InquiryForm'

interface Props {
  listingId: string
  listingTitle: string
  priceUsd: number
  priceVnd: number | null
}

export function StickyMobileBar({ listingId, listingTitle, priceUsd, priceVnd }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Only visible on mobile (hidden on lg+) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 leading-none mb-0.5">from</p>
            <p className="text-xl font-bold text-[#0F6E56] leading-none">
              ${priceUsd.toLocaleString()}
              <span className="text-xs font-normal text-gray-400">/mo</span>
            </p>
            {priceVnd && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                ≈ {(priceVnd / 1_000_000).toFixed(0)}M ₫
              </p>
            )}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex-none bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-semibold px-5 py-3 rounded-full text-sm transition-colors whitespace-nowrap"
          >
            Request a viewing →
          </button>
        </div>
      </div>

      {open && (
        <InquiryForm
          listingId={listingId}
          listingTitle={listingTitle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
