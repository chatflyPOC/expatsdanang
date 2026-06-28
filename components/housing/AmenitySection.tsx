import { HousingListingPublic } from '@/types/housing'
import { clsx } from 'clsx'

type AmenityItem = { label: string; present: boolean }

function AmenityIcon({ present }: { present: boolean }) {
  return (
    <span className={clsx(
      'w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-none',
      present ? 'bg-[#E1F5EE] text-[#1D9E75]' : 'bg-gray-100 text-gray-300'
    )}>
      {present ? '✓' : '–'}
    </span>
  )
}

function AmenityRow({ items }: { items: AmenityItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {items.map(({ label, present }) => (
        <div key={label} className={clsx('flex items-center gap-2 text-sm', present ? 'text-gray-700' : 'text-gray-300')}>
          <AmenityIcon present={present} />
          {label}
        </div>
      ))}
    </div>
  )
}

export function AmenitySection({ listing }: { listing: HousingListingPublic }) {
  const inUnit: AmenityItem[] = [
    { label: 'Air conditioning', present: listing.has_ac },
    { label: 'Washing machine', present: listing.has_washer },
    { label: 'Water heater', present: listing.has_water_heater },
    { label: `Kitchen (${listing.kitchen_type ?? 'none'})`, present: !!listing.kitchen_type },
    { label: 'Refrigerator', present: listing.has_fridge },
    { label: 'Microwave', present: listing.has_microwave },
    { label: 'TV', present: listing.has_tv },
    { label: 'Work desk', present: listing.has_desk },
    { label: 'Balcony', present: listing.has_balcony },
  ]

  const building: AmenityItem[] = [
    { label: 'Swimming pool', present: listing.has_pool },
    { label: 'Gym', present: listing.has_gym },
    { label: 'Elevator', present: listing.has_elevator },
    { label: '24/7 security', present: listing.has_security },
    { label: 'Motorbike parking', present: listing.has_motorbike_parking },
    { label: 'Car parking', present: listing.has_car_parking },
    { label: 'Reception', present: listing.has_reception },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">In-unit</p>
        <AmenityRow items={inUnit} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Building</p>
        <AmenityRow items={building} />
      </div>
    </div>
  )
}
