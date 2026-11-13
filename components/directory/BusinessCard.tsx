import Link from 'next/link'
import Image from 'next/image'
import { MapPin, BadgeCheck, Globe, ImageIcon, Star } from 'lucide-react'
import {
  Business, amenityLabel, priceLevelLabel, verificationState,
  englishLabel,
} from '@/types/directory'

interface Props {
  business: Business
  /** `sizes` for the cover image; defaults to the three-up browse grid. */
  imageSizes?: string
}

const DEFAULT_IMAGE_SIZES = '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'

/** Attributes worth showing on a card, in the order an expat scans for them. */
const CARD_AMENITIES = [
  'english-staff',
  'international-insurance',
  'card-accepted',
  'wifi-fast',
  'laptop-friendly',
  'english-menu',
  'pet-friendly',
  'no-lock-in-contract',
]

export function BusinessCard({ business, imageSizes = DEFAULT_IMAGE_SIZES }: Props) {
  const cover =
    business.images?.[business.cover_image_index ?? 0] ?? business.images?.[0]
  const price = priceLevelLabel(business.price_level)
  const english = englishLabel(business.english_level)
  const verification = verificationState(business)
  const chips = CARD_AMENITIES.filter((key) => business.amenities?.includes(key)).slice(0, 3)

  return (
    <Link
      href={`/directory/${business.category}/${business.slug}`}
      className="group flex flex-col border border-[#E5E7EB] rounded-xl overflow-hidden bg-white transition-all hover:border-[#1D9E75]/50 hover:shadow-[0_12px_30px_-14px_rgba(29,158,117,0.4)]"
    >
      <div className="relative h-40 bg-gray-100 overflow-hidden border-b border-[#E5E7EB]">
        {cover ? (
          <Image
            src={cover}
            alt={business.name}
            fill
            sizes={imageSizes}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={26} className="text-gray-300" />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {verification.current && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-white text-[#0F6E56] px-2 py-0.5 rounded-full border border-[#B6E5D4]">
              <BadgeCheck size={10} /> Verified {verification.label}
            </span>
          )}
          {business.featured && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#1D9E75] text-white px-2 py-0.5 rounded-full">
              <Star size={9} fill="white" /> Featured
            </span>
          )}
        </div>

        {price && (
          <span className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-[#E5E7EB] text-xs font-semibold text-gray-700">
            {price}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {business.name}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          <MapPin size={11} />
          <span>{business.district_label}</span>
          {english && (
            <>
              <span className="text-gray-300">·</span>
              <Globe size={11} />
              <span>{english}</span>
            </>
          )}
        </div>

        {business.short_description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
            {business.short_description}
          </p>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {chips.map((key) => (
              <span
                key={key}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] border border-[#B6E5D4]"
              >
                {amenityLabel(key)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export function BusinessCardSkeleton() {
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="flex gap-1.5 mt-2">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}
