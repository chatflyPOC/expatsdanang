'use client'
import { useState } from 'react'

type Opt = { key: string; label: string; cost: number; util?: number }

const HOUSING: Opt[] = [
  { key: 'room', label: 'Budget room', cost: 180, util: 40 },
  { key: 'studio', label: 'Studio (An Thuong)', cost: 300, util: 55 },
  { key: '1br', label: '1-bed apartment', cost: 420, util: 65 },
  { key: '2br', label: '2-bed apartment', cost: 600, util: 85 },
]
const FOOD: Opt[] = [
  { key: 'cook', label: 'Cook + local food', cost: 160 },
  { key: 'mix', label: 'Mix local & western', cost: 300 },
  { key: 'out', label: 'Mostly eat out', cost: 480 },
]
const TRANSPORT: Opt[] = [
  { key: 'own', label: 'Own bike (fuel)', cost: 20 },
  { key: 'rent', label: 'Rent a motorbike', cost: 60 },
  { key: 'grab', label: 'Grab / taxi', cost: 110 },
]
const PEOPLE: Opt[] = [
  { key: 'solo', label: 'Just me', cost: 1 },
  { key: 'couple', label: 'Couple', cost: 1.8 },
]

const EXTRAS = [
  { key: 'coworking', label: 'Coworking space', cost: 90 },
  { key: 'gym', label: 'Gym membership', cost: 35 },
  { key: 'insurance', label: 'Health insurance', cost: 55 },
]

function Segmented({ options, value, onChange }: { options: Opt[]; value: string; onChange: (k: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            value === o.key
              ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
              : 'border-[#D1D5DB] text-gray-600 hover:border-[#1D9E75]/40'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function CostCalculator() {
  const [housing, setHousing] = useState('studio')
  const [food, setFood] = useState('mix')
  const [transport, setTransport] = useState('rent')
  const [people, setPeople] = useState('solo')
  const [extras, setExtras] = useState<Record<string, boolean>>({ coworking: false, gym: false, insurance: true })
  const [social, setSocial] = useState(120)

  const h = HOUSING.find((o) => o.key === housing)!
  const f = FOOD.find((o) => o.key === food)!
  const t = TRANSPORT.find((o) => o.key === transport)!
  const peopleFactor = PEOPLE.find((o) => o.key === people)!.cost

  const sim = 6
  const foodTotal = Math.round(f.cost * peopleFactor)
  const socialTotal = Math.round(social * peopleFactor)
  const extrasTotal = EXTRAS.reduce((sum, e) => sum + (extras[e.key] ? e.cost : 0), 0)

  const rows = [
    { label: 'Rent', value: h.cost },
    { label: 'Utilities & internet', value: h.util || 0 },
    { label: 'Food & drink', value: foodTotal },
    { label: 'Transport', value: t.cost },
    { label: 'SIM / mobile', value: sim },
    { label: 'Social & fun', value: socialTotal },
    { label: 'Extras', value: extrasTotal },
  ]
  const total = rows.reduce((s, r) => s + r.value, 0)
  const max = Math.max(...rows.map((r) => r.value))

  return (
    <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white">
      <div className="bg-[#f0fdf9] px-6 py-4 border-b border-[#E1F5EE]">
        <p className="font-semibold text-gray-900">Estimate your monthly budget</p>
        <p className="text-sm text-gray-500">Rough 2025 figures for Da Nang, in USD.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Housing</p>
            <Segmented options={HOUSING} value={housing} onChange={setHousing} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Eating style</p>
            <Segmented options={FOOD} value={food} onChange={setFood} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Getting around</p>
            <Segmented options={TRANSPORT} value={transport} onChange={setTransport} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Who&apos;s living</p>
            <Segmented options={PEOPLE} value={people} onChange={setPeople} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-700">Social & fun</p>
              <span className="text-sm text-gray-500">${social}/mo</span>
            </div>
            <input
              type="range"
              min={0}
              max={400}
              step={10}
              value={social}
              onChange={(e) => setSocial(Number(e.target.value))}
              className="w-full accent-[#1D9E75]"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Add-ons</p>
            <div className="flex flex-wrap gap-2">
              {EXTRAS.map((e) => (
                <button
                  key={e.key}
                  type="button"
                  onClick={() => setExtras((prev) => ({ ...prev, [e.key]: !prev[e.key] }))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    extras[e.key]
                      ? 'bg-[#E1F5EE] text-[#085041] border-[#5DCAA5]'
                      : 'border-[#D1D5DB] text-gray-500 hover:border-[#1D9E75]/40'
                  }`}
                >
                  {extras[e.key] ? '✓ ' : '+ '}{e.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="bg-gray-50 rounded-xl p-5 flex flex-col">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Estimated total</p>
          <p className="text-4xl font-semibold text-gray-900 mb-1">
            ${total.toLocaleString()}<span className="text-base font-normal text-gray-400">/mo</span>
          </p>
          <p className="text-xs text-gray-400 mb-5">≈ {(total * 25500).toLocaleString()} VND</p>

          <div className="space-y-2.5 flex-1">
            {rows.filter((r) => r.value > 0).map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{r.label}</span>
                  <span className="font-medium text-gray-900">${r.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-[#1D9E75] rounded-full" style={{ width: `${(r.value / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
