import { HousingListingPublic } from '@/types/housing'
import { MapPin, Waves, Coffee, Laptop, ShoppingBag } from 'lucide-react'

// Fixed district-center color themes (no real coordinates exposed)
const DISTRICT_THEME: Record<string, { bg: string; accent: string }> = {
  'an-thuong': { bg: 'from-sky-100 via-teal-50 to-emerald-100', accent: '#0ea5e9' },
  'my-khe': { bg: 'from-cyan-100 via-blue-50 to-sky-100', accent: '#06b6d4' },
  'son-tra': { bg: 'from-green-100 via-teal-50 to-cyan-100', accent: '#10b981' },
  'hai-chau': { bg: 'from-violet-50 via-indigo-50 to-purple-100', accent: '#8b5cf6' },
  'ngu-hanh-son': { bg: 'from-amber-50 via-orange-50 to-yellow-100', accent: '#f59e0b' },
  'cam-le': { bg: 'from-rose-50 via-pink-50 to-orange-50', accent: '#f43f5e' },
}

const LANDMARK_ICON = (i: number) => {
  const icons = [Coffee, Laptop, ShoppingBag, Coffee, Waves]
  const Icon = icons[i % icons.length]
  return <Icon size={13} className="flex-none text-gray-400" />
}

export function AreaMap({ listing }: { listing: HousingListingPublic }) {
  const theme = DISTRICT_THEME[listing.district] ?? { bg: 'from-gray-100 to-gray-50', accent: '#1D9E75' }

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      {/* Visual area indicator */}
      <div className={`relative h-52 bg-gradient-to-br ${theme.bg} flex items-center justify-center overflow-hidden`}>
        {/* Outer blur ring */}
        <div className="absolute w-56 h-56 rounded-full opacity-20 blur-3xl"
          style={{ background: theme.accent }} />
        {/* Mid ring */}
        <div className="absolute w-36 h-36 rounded-full opacity-25 blur-2xl"
          style={{ background: theme.accent }} />
        {/* Inner glow */}
        <div className="absolute w-16 h-16 rounded-full opacity-30 blur-xl"
          style={{ background: theme.accent }} />

        {/* District label pin */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: theme.accent }}>
            <MapPin size={22} className="text-white" />
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-full px-4 py-1.5 shadow-sm">
            <span className="font-semibold text-gray-800 text-sm">{listing.district_label}</span>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="absolute bottom-2.5 inset-x-0 flex justify-center">
          <p className="text-[10px] text-gray-400 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 text-center max-w-[280px]">
            Exact location provided upon booking a viewing
          </p>
        </div>
      </div>

      {/* Landmarks + distances */}
      <div className="px-4 py-3 space-y-2 bg-white">
        {listing.distance_to_beach_m !== null && (
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <Waves size={14} className="text-[#1D9E75] flex-none" />
            {listing.distance_to_beach_m < 1000
              ? `${listing.distance_to_beach_m}m to beach`
              : `${(listing.distance_to_beach_m / 1000).toFixed(1)}km to beach`}
          </div>
        )}
        {listing.nearby_refs?.slice(0, 4).map((ref, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
            {LANDMARK_ICON(i)}
            {ref}
          </div>
        ))}
      </div>
    </div>
  )
}
