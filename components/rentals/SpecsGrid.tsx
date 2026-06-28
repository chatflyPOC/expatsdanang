import { HousingListingPublic, typeLabel } from '@/types/housing'
import { Bed, Bath, Ruler, Building2, Layers, Compass } from 'lucide-react'

const VIEW_LABEL: Record<string, string> = {
  sea: '🌊 Sea view',
  river: '🏞 River view',
  city: '🏙 City view',
  garden: '🌿 Garden view',
}

const FURNISHING_LABEL: Record<string, string> = {
  full: 'Fully furnished',
  partial: 'Partially furnished',
  unfurnished: 'Unfurnished',
}

interface Props { listing: HousingListingPublic }

export function SpecsGrid({ listing }: Props) {
  const items = [
    {
      icon: <Building2 size={18} className="text-[#1D9E75]" />,
      label: 'Property type',
      value: typeLabel(listing.type),
    },
    ...(listing.area_sqm ? [{
      icon: <Ruler size={18} className="text-[#1D9E75]" />,
      label: 'Area',
      value: `${listing.area_sqm} m²`,
    }] : []),
    ...(listing.bedrooms !== null ? [{
      icon: <Bed size={18} className="text-[#1D9E75]" />,
      label: 'Bedrooms',
      value: listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} bedroom${listing.bedrooms !== 1 ? 's' : ''}`,
    }] : []),
    ...(listing.bathrooms !== null ? [{
      icon: <Bath size={18} className="text-[#1D9E75]" />,
      label: 'Bathrooms',
      value: `${listing.bathrooms} bathroom${listing.bathrooms !== 1 ? 's' : ''}`,
    }] : []),
    ...(listing.floor_number ? [{
      icon: <Layers size={18} className="text-[#1D9E75]" />,
      label: 'Floor',
      value: `Floor ${listing.floor_number}`,
    }] : []),
    ...(listing.furnishing ? [{
      icon: <span className="text-[#1D9E75] text-lg leading-none">🛋</span>,
      label: 'Furnishing',
      value: FURNISHING_LABEL[listing.furnishing] ?? listing.furnishing,
    }] : []),
    ...(listing.views?.length ? [{
      icon: <Compass size={18} className="text-[#1D9E75]" />,
      label: 'Views',
      value: listing.views.map(v => VIEW_LABEL[v] ?? v).join(' · '),
    }] : []),
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-gray-50/50">
          <div className="w-9 h-9 flex-none flex items-center justify-center rounded-lg bg-[#E1F5EE]">
            {item.icon}
          </div>
          <div>
            <p className="text-[10px] text-gray-400">{item.label}</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
