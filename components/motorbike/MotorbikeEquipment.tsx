import { MotorbikeListing } from '@/types/motorbike'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Item {
  key: keyof MotorbikeListing
  label: string
  desc: string
}

const INCLUDED: Item[] = [
  { key: 'helmet_included', label: 'Helmet', desc: 'Full-face or open-face helmet' },
  { key: 'lock_included', label: 'Lock', desc: 'Disc lock or chain lock' },
  { key: 'raincoat_included', label: 'Raincoat', desc: 'Waterproof poncho' },
  { key: 'insurance_included', label: 'Insurance', desc: 'Basic damage coverage' },
]

const EXTRAS: Item[] = [
  { key: 'gps_tracker', label: 'GPS tracker', desc: 'Real-time location tracking' },
  { key: 'phone_holder', label: 'Phone holder', desc: 'Universal mount for navigation' },
  { key: 'usb_charger', label: 'USB charger', desc: 'Keep your devices charged' },
  { key: 'top_box', label: 'Top box', desc: 'Rear storage box' },
]

function Row({ label, desc, included }: { label: string; desc: string; included: boolean }) {
  return (
    <div className={`flex items-center gap-3 py-2.5 border-b border-[#E5E7EB] last:border-0 ${!included ? 'opacity-50' : ''}`}>
      {included
        ? <CheckCircle2 size={16} className="text-[#1D9E75] flex-none" />
        : <XCircle size={16} className="text-gray-300 flex-none" />
      }
      <div>
        <p className={`text-sm font-medium ${included ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      {included && <span className="ml-auto text-[10px] font-semibold text-[#0F6E56] bg-[#E1F5EE] px-2 py-0.5 rounded-full">Included</span>}
    </div>
  )
}

export function MotorbikeEquipment({ listing }: { listing: MotorbikeListing }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Standard equipment</h3>
        <div className="border border-[#E5E7EB] rounded-xl px-4 divide-y divide-[#E5E7EB]">
          {INCLUDED.map(item => (
            <Row key={item.key} label={item.label} desc={item.desc} included={!!listing[item.key]} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Optional extras</h3>
        <div className="border border-[#E5E7EB] rounded-xl px-4 divide-y divide-[#E5E7EB]">
          {EXTRAS.map(item => (
            <Row key={item.key} label={item.label} desc={item.desc} included={!!listing[item.key]} />
          ))}
        </div>
      </div>
    </div>
  )
}
