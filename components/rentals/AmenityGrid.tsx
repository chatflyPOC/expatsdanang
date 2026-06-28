import { HousingListingPublic } from '@/types/housing'
import { clsx } from 'clsx'

interface AmenityItem {
  label: string
  present: boolean
  emoji: string
}

function AmenityRow({ item }: { item: AmenityItem }) {
  return (
    <div className={clsx(
      'flex items-center gap-2.5 py-2 text-sm',
      item.present ? 'text-gray-800' : 'text-gray-300'
    )}>
      <span className={clsx(
        'w-6 h-6 rounded-full flex items-center justify-center text-[11px] flex-none font-bold',
        item.present ? 'bg-[#E1F5EE] text-[#1D9E75]' : 'bg-gray-100 text-gray-300'
      )}>
        {item.present ? '✓' : '–'}
      </span>
      <span className="leading-tight">
        <span>{item.emoji} </span>
        <span className={item.present ? '' : 'line-through decoration-gray-200'}>
          {item.label}
        </span>
      </span>
    </div>
  )
}

export function AmenityGrid({ listing }: { listing: HousingListingPublic }) {
  const inUnit: AmenityItem[] = [
    { emoji: '❄️', label: 'Air conditioning', present: listing.has_ac },
    { emoji: '🫧', label: 'Washing machine', present: listing.has_washer },
    { emoji: '🚿', label: 'Water heater', present: listing.has_water_heater },
    { emoji: '🍳', label: listing.kitchen_type ? `Kitchen (${listing.kitchen_type})` : 'Kitchen', present: !!listing.kitchen_type },
    { emoji: '🧊', label: 'Refrigerator', present: listing.has_fridge },
    { emoji: '📡', label: 'Microwave', present: listing.has_microwave },
    { emoji: '📺', label: 'TV', present: listing.has_tv },
    { emoji: '🖥', label: 'Work desk', present: listing.has_desk },
    { emoji: '🌿', label: 'Balcony', present: listing.has_balcony },
  ]

  const building: AmenityItem[] = [
    { emoji: '🏊', label: 'Swimming pool', present: listing.has_pool },
    { emoji: '🏋️', label: 'Gym', present: listing.has_gym },
    { emoji: '🛗', label: 'Elevator', present: listing.has_elevator },
    { emoji: '🔒', label: '24/7 security', present: listing.has_security },
    { emoji: '🛵', label: 'Motorbike parking', present: listing.has_motorbike_parking },
    { emoji: '🚗', label: 'Car parking', present: listing.has_car_parking },
    { emoji: '🧑‍💼', label: 'Reception', present: listing.has_reception },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          In-unit
        </p>
        <div className="divide-y divide-gray-100">
          {inUnit.map(item => <AmenityRow key={item.label} item={item} />)}
        </div>
      </div>
      <div className="mt-6 sm:mt-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Building
        </p>
        <div className="divide-y divide-gray-100">
          {building.map(item => <AmenityRow key={item.label} item={item} />)}
        </div>
      </div>
    </div>
  )
}
