import { MotorbikeListing, typeLabel, CONDITION_LABELS } from '@/types/motorbike'
import { Zap, Calendar, Palette, Award } from 'lucide-react'

export function MotorbikeSpecs({ listing }: { listing: MotorbikeListing }) {
  const cond = CONDITION_LABELS[listing.condition]

  const specs = [
    { icon: <Award size={16} className="text-[#1D9E75]" />, label: 'Type', value: typeLabel(listing.type) },
    { icon: <Zap size={16} className="text-[#1D9E75]" />, label: 'Engine', value: listing.engine_cc ? `${listing.engine_cc}cc` : '—' },
    { icon: <Calendar size={16} className="text-[#1D9E75]" />, label: 'Year', value: listing.year_made ? String(listing.year_made) : '—' },
    { icon: <Palette size={16} className="text-[#1D9E75]" />, label: 'Color', value: listing.color ?? '—' },
  ]

  return (
    <div className="space-y-4">
      {/* Brand / model hero */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-[#E5E7EB]">
        <div className="w-10 h-10 bg-[#E1F5EE] rounded-lg flex items-center justify-center text-lg font-bold text-[#0F6E56]">
          {listing.brand[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{listing.brand} {listing.model}</p>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${cond.color}`}>
            {cond.label}
          </span>
        </div>
      </div>

      {/* Spec grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {specs.map(s => (
          <div key={s.label} className="bg-gray-50 border border-[#E5E7EB] rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-[10px] text-gray-400 mb-0.5">{s.label}</p>
            <p className="text-sm font-semibold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
