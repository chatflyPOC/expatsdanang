import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Zap, Shield, Truck, Star, ImageIcon } from 'lucide-react'
import { MotorbikeListing, typeLabel, CONDITION_LABELS } from '@/types/motorbike'

interface Props {
  listing: MotorbikeListing
  isMock?: boolean
  /**
   * `sizes` for the cover image. Defaults to the three-column browse grid.
   * The homepage renders these four-up in a narrower container, where the
   * default makes next/image fetch a 1920px file for a 285px slot.
   */
  imageSizes?: string
}

const DEFAULT_IMAGE_SIZES = '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'

export function MotorbikeCard({ listing, isMock, imageSizes = DEFAULT_IMAGE_SIZES }: Props) {
  const cover = listing.images?.[listing.cover_image_index ?? 0] ?? listing.images?.[0]
  const isNew = Date.now() - new Date(listing.created_at).getTime() < 7 * 86400_000
  const cond = CONDITION_LABELS[listing.condition]

  const inner = (
    <div className={`group relative block border border-[#E5E7EB] rounded-xl overflow-hidden bg-white transition-all ${isMock ? 'opacity-80 cursor-default' : 'hover:border-[#1D9E75]/50 hover:shadow-[0_12px_30px_-14px_rgba(29,158,117,0.4)]'}`}>
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden border-b border-[#E5E7EB]">
        {cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes={imageSizes}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={28} className="text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {listing.featured && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#1D9E75] text-white px-2 py-0.5 rounded-full">
              <Star size={9} fill="white" /> Featured
            </span>
          )}
          {isNew && !listing.featured && (
            <span className="text-[10px] font-semibold bg-white text-gray-700 px-2 py-0.5 rounded-full border border-[#E5E7EB]">New</span>
          )}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#E5E7EB]">
          <span className="text-sm font-bold text-[#0F6E56]">${listing.price_per_day_usd}</span>
          <span className="text-[10px] text-gray-400">/day</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {typeLabel(listing.type)}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cond.color}`}>
            {cond.label}
          </span>
        </div>

        <p className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {listing.title}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <MapPin size={11} />
          <span>{listing.district_label}</span>
          {listing.engine_cc && (
            <>
              <span className="text-gray-300">·</span>
              <Zap size={11} />
              <span>{listing.engine_cc}cc</span>
            </>
          )}
        </div>

        {/* Longer-term rates. The monthly figure is the one expats decide on —
            renting by the month is materially cheaper than by the day — so it
            gets the emphasis rather than sitting in the same grey as the week. */}
        <div className="flex items-baseline gap-3 mb-3">
          {listing.price_per_month_usd && (
            <span className="text-sm font-semibold text-gray-900">
              ${listing.price_per_month_usd}
              <span className="text-xs font-normal text-gray-400">/month</span>
            </span>
          )}
          {listing.price_per_week_usd && (
            <span className="text-xs text-gray-400">${listing.price_per_week_usd}/week</span>
          )}
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5">
          {listing.helmet_included && <Chip><Shield size={9} /> Helmet</Chip>}
          {listing.insurance_included && <Chip><Shield size={9} /> Insured</Chip>}
          {listing.delivery_available && <Chip><Truck size={9} /> Delivery</Chip>}
          {listing.gps_tracker && <Chip>GPS</Chip>}
        </div>

        {!isMock && (
          <Link
            href={`/motorbike-rental/${listing.id}#inquire`}
            className="relative z-20 mt-4 block w-full rounded-full bg-[#1D9E75] px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#0F6E56]"
          >
            Inquire
          </Link>
        )}
      </div>
    </div>
  )

  const href = isMock ? '/motorbike-rental/demo' : `/motorbike-rental/${listing.id}`
  // The card used to be one big <Link>. An Inquire button cannot live inside an
  // anchor, so the card link is now an overlay that fills the card and sits
  // under the button, which carries its own link to the enquiry form.
  return (
    <div className="relative">
      {inner}
      <Link href={href} className="absolute inset-0 z-10" aria-label={listing.title} />
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] border border-[#B6E5D4]">
      {children}
    </span>
  )
}

export function MotorbikeCardSkeleton() {
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-1.5 mt-2">
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}
