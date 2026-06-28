import Link from 'next/link'
import { MapPin, Bed, Bath, Ruler, Waves, Star, ImageIcon } from 'lucide-react'
import { HousingListingPublic, fmtPrice, typeLabel } from '@/types/housing'
import { WishlistButton } from './WishlistButton'
import { clsx } from 'clsx'

interface Props {
  listing: HousingListingPublic
  showVnd: boolean
}

export function HousingCard({ listing, showVnd }: Props) {
  const cover = listing.images?.[listing.cover_image_index ?? 0] ?? listing.images?.[0]
  const isNew = Date.now() - new Date(listing.created_at).getTime() < 7 * 86400_000

  return (
    <Link
      href={`/rentals/${listing.id}`}
      className="group block border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#1D9E75]/50 hover:shadow-[0_12px_30px_-14px_rgba(29,158,117,0.4)] bg-white transition-all"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden border-b border-[#E5E7EB]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={listing.title_en}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
            <span className="text-[10px] font-semibold bg-white text-gray-700 px-2 py-0.5 rounded-full border border-[#E5E7EB]">
              New
            </span>
          )}
        </div>
        {/* Wishlist */}
        <div className="absolute top-2.5 right-2.5">
          <WishlistButton listingId={listing.id} />
        </div>
        {/* Price overlay */}
        <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#E5E7EB]">
          <span className="text-sm font-bold text-[#0F6E56]">{fmtPrice(listing.price_usd, showVnd)}</span>
          <span className="text-[10px] text-gray-400">/mo</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Type badge + district */}
        <div className="flex items-center justify-between mb-1.5">
          <span className={clsx(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
            'bg-gray-100 text-gray-500'
          )}>
            {typeLabel(listing.type)}
          </span>
          <p className="text-[11px] text-gray-400 flex items-center gap-0.5">
            <MapPin size={10} /> {listing.district_label}
          </p>
        </div>

        <p className="font-semibold text-gray-900 text-sm leading-snug mb-3 line-clamp-2">
          {listing.title_en}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {listing.bedrooms !== null && (
            <span className="flex items-center gap-1">
              <Bed size={12} /> {listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}
            </span>
          )}
          {listing.bathrooms !== null && (
            <span className="flex items-center gap-1">
              <Bath size={12} /> {listing.bathrooms}
            </span>
          )}
          {listing.area_sqm && (
            <span className="flex items-center gap-1">
              <Ruler size={12} /> {listing.area_sqm}m²
            </span>
          )}
          {listing.distance_to_beach_m !== null && (
            <span className="flex items-center gap-1 ml-auto text-[#0F6E56]">
              <Waves size={12} /> {listing.distance_to_beach_m < 1000
                ? `${listing.distance_to_beach_m}m`
                : `${(listing.distance_to_beach_m / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>

        {/* Key amenity chips */}
        <div className="flex flex-wrap gap-1.5">
          {listing.furnishing === 'full' && (
            <Chip>Fully furnished</Chip>
          )}
          {listing.has_pool && <Chip>Pool</Chip>}
          {listing.pets_allowed && <Chip>Pets OK</Chip>}
          {listing.views?.includes('sea') && <Chip>Sea view</Chip>}
          {listing.english_contract && <Chip>English contract</Chip>}
        </div>
      </div>
    </Link>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] border border-[#B6E5D4]">
      {children}
    </span>
  )
}

export function HousingCardSkeleton() {
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-1.5 mt-2">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-12 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}
