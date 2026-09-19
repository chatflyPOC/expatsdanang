'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Home, Bike, FileText, Sparkles, ArrowRight } from 'lucide-react'

/**
 * The floating panel in the homepage hero — the tool is the hero, not a
 * paragraph about it. Each tab mirrors one route into the site, with the three
 * facts a visitor needs to decide whether to click.
 *
 * The hubs keep their filters in client state rather than the URL, so the
 * panel routes into them instead of pretending to run a search it can't pass on.
 */
const TABS = [
  {
    key: 'housing',
    label: 'Housing',
    icon: Home,
    fields: [
      { label: 'Where', value: 'An Thuong, My Khe & more' },
      { label: 'Listings', value: 'Verified, real prices' },
      { label: 'Cost to you', value: 'Free matching' },
    ],
    cta: { href: '/housing', label: 'Browse housing' },
  },
  {
    key: 'motorbike',
    label: 'Motorbikes',
    icon: Bike,
    fields: [
      { label: 'Bikes', value: 'Scooters & semi-autos' },
      { label: 'Rental period', value: 'Day, week or month' },
      { label: 'Price', value: 'From $5/day' },
    ],
    cta: { href: '/motorbike-rental', label: 'Browse bikes' },
  },
  {
    key: 'visa',
    label: 'Visa & papers',
    icon: FileText,
    fields: [
      { label: 'We handle', value: 'Extensions, TRC, e-visa' },
      { label: 'Also', value: 'Notarization & translation' },
      { label: 'Price', value: 'From $25' },
    ],
    cta: { href: '/services/visa-documents', label: 'See visa help' },
  },
  {
    key: 'other',
    label: 'Anything else',
    icon: Sparkles,
    fields: [
      { label: 'Tell us', value: 'Airport, bank, anything' },
      { label: 'Reply', value: 'Within 2 hours' },
      { label: 'Handled by', value: 'Locals who live here' },
    ],
    cta: { href: '/get-help', label: 'Tell us what you need' },
  },
] as const

export function HeroSearchPanel() {
  const [active, setActive] = useState<(typeof TABS)[number]['key']>('housing')
  const tab = TABS.find((t) => t.key === active) ?? TABS[0]

  return (
    <div className="w-full max-w-[920px] mx-auto">
      {/* Category tabs — sit on the photo, like the pills above a travel search bar */}
      <div role="tablist" aria-label="What do you need?" className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
        {TABS.map(({ key, label, icon: Icon }) => {
          const selected = key === active
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="hero-panel"
              onClick={() => setActive(key)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors backdrop-blur-md ${
                selected
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25'
              }`}
            >
              <Icon size={15} className={selected ? 'text-[#1D9E75]' : ''} />
              {label}
            </button>
          )
        })}
      </div>

      {/* The bar — three equal segments and one teal action */}
      <div
        id="hero-panel"
        role="tabpanel"
        className="bg-white rounded-3xl sm:rounded-full shadow-[0_20px_50px_-20px_rgba(10,58,92,0.55)] p-2 sm:pl-2 flex flex-col sm:flex-row sm:items-center"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 flex-1 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB]">
          {tab.fields.map((f) => (
            <div key={f.label} className="px-5 py-3 sm:py-2 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{f.label}</p>
              <p className="text-sm font-medium text-gray-900 truncate">{f.value}</p>
            </div>
          ))}
        </div>
        <Link
          href={tab.cta.href}
          className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-medium rounded-full px-6 py-3.5 transition-colors whitespace-nowrap"
        >
          {tab.cta.label}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
