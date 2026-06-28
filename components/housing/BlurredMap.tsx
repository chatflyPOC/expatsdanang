import { MapPin, Waves, Coffee, Wifi } from 'lucide-react'
import { HousingListingPublic } from '@/types/housing'

const DISTRICT_BG: Record<string, string> = {
  'an-thuong': 'from-blue-50 to-teal-50',
  'my-khe': 'from-cyan-50 to-blue-50',
  'son-tra': 'from-green-50 to-teal-50',
  'hai-chau': 'from-purple-50 to-indigo-50',
  'ngu-hanh-son': 'from-orange-50 to-amber-50',
  'cam-le': 'from-rose-50 to-pink-50',
}

interface Props {
  listing: HousingListingPublic
}

export function BlurredMap({ listing }: Props) {
  const bg = DISTRICT_BG[listing.district] ?? 'from-gray-50 to-gray-100'

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      {/* Stylised area map */}
      <div className={`relative h-44 bg-gradient-to-br ${bg} flex items-center justify-center`}>
        {/* Blurred zone indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-[#1D9E75]/10 blur-2xl" />
          <div className="absolute w-16 h-16 rounded-full bg-[#1D9E75]/20 blur-lg" />
        </div>
        {/* Pin */}
        <div className="relative flex flex-col items-center">
          <div className="w-10 h-10 bg-[#1D9E75] rounded-full flex items-center justify-center shadow-lg">
            <MapPin size={20} className="text-white" />
          </div>
          <div className="mt-2 bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-full px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
            {listing.district_label}
          </div>
        </div>

        {/* Privacy notice */}
        <div className="absolute bottom-2.5 right-2.5 bg-white/80 backdrop-blur-sm text-[10px] text-gray-400 px-2.5 py-1 rounded-full border border-[#E5E7EB]">
          Approximate zone · exact address on request
        </div>
      </div>

      {/* Reference points */}
      {listing.nearby_refs && listing.nearby_refs.length > 0 && (
        <div className="px-4 py-3 space-y-2">
          {listing.distance_to_beach_m !== null && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Waves size={14} className="text-[#1D9E75] flex-none" />
              {listing.distance_to_beach_m < 1000
                ? `${listing.distance_to_beach_m}m to beach`
                : `${(listing.distance_to_beach_m / 1000).toFixed(1)}km to beach`}
            </div>
          )}
          {listing.nearby_refs.slice(0, 3).map((ref, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
              {i % 2 === 0 ? <Coffee size={14} className="flex-none" /> : <Wifi size={14} className="flex-none" />}
              {ref}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
