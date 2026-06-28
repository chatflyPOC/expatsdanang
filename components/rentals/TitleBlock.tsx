import { HousingListingPublic } from '@/types/housing'
import { WishlistButton } from '@/components/housing/WishlistButton'
import { ShareButton } from '@/components/housing/ShareButton'
import { MapPin, Bed, Bath, Ruler, Waves, Star } from 'lucide-react'

interface Props {
  listing: HousingListingPublic
  isNew: boolean
  isPending: boolean
}

export function TitleBlock({ listing, isNew, isPending }: Props) {
  return (
    <div>
      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {listing.featured && (
          <span className="flex items-center gap-1 text-xs font-semibold bg-[#1D9E75] text-white px-3 py-1 rounded-full">
            <Star size={11} fill="white" /> Featured
          </span>
        )}
        {isPending && (
          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full animate-pulse">
            👁 Being viewed
          </span>
        )}
        {isNew && !isPending && (
          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            ✨ New listing
          </span>
        )}
        <div className="ml-auto flex gap-1.5">
          <WishlistButton listingId={listing.id} />
          <ShareButton title={listing.title_en} />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-4">
        {listing.title_en}
      </h1>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="text-[#1D9E75]" />
          {listing.district_label}{listing.floor_number ? `, Floor ${listing.floor_number}` : ''}
        </span>
        {listing.bedrooms !== null && (
          <span className="flex items-center gap-1.5">
            <Bed size={14} className="text-[#1D9E75]" />
            {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} bedroom${listing.bedrooms !== 1 ? 's' : ''}`}
          </span>
        )}
        {listing.bathrooms !== null && (
          <span className="flex items-center gap-1.5">
            <Bath size={14} className="text-[#1D9E75]" />
            {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}
          </span>
        )}
        {listing.area_sqm && (
          <span className="flex items-center gap-1.5">
            <Ruler size={14} className="text-[#1D9E75]" />
            {listing.area_sqm} m²
          </span>
        )}
        {listing.distance_to_beach_m !== null && (
          <span className="flex items-center gap-1.5 text-[#0F6E56] font-medium">
            <Waves size={14} />
            {listing.distance_to_beach_m < 1000
              ? `${listing.distance_to_beach_m}m to beach`
              : `${(listing.distance_to_beach_m / 1000).toFixed(1)}km to beach`}
          </span>
        )}
      </div>
    </div>
  )
}
