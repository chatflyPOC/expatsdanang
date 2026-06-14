import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { DragonBridgeArt, BeachArt, RiverArt, MountainArt } from '@/components/art/DanangScene'

const AREAS = [
  {
    name: 'An Thuong',
    blurb: 'The expat heart — cafés, co-working, walkable to My Khe beach.',
    art: BeachArt,
    tag: 'Most popular',
  },
  {
    name: 'My Khe Beach',
    blurb: 'Wake up to the sea. Quieter, resort-style living on the sand.',
    art: DragonBridgeArt,
    tag: 'Beachside',
  },
  {
    name: 'Han River',
    blurb: 'Central, lively, close to the bridges, markets and nightlife.',
    art: RiverArt,
    tag: 'City center',
  },
  {
    name: 'Ngu Hanh Son',
    blurb: 'Marble Mountains district — green, calm, more space for less.',
    art: MountainArt,
    tag: 'Best value',
  },
]

export function ExploreDanang() {
  return (
    <section className="bg-[#0A3A5C] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1AA5D8] mb-3">Where to live</p>
              <h2 className="text-3xl font-semibold text-white leading-snug max-w-md">
                Find your corner of Da Nang
              </h2>
            </div>
            <Link
              href="/guides/best-neighborhoods-da-nang-expats"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#A8D4F0] hover:text-white transition-colors"
            >
              Read the neighborhoods guide <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AREAS.map((area, i) => {
            const Art = area.art
            return (
              <Reveal key={area.name} delay={(i % 4) * 80}>
                <Link
                  href="/services/housing"
                  className="lift group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#1AA5D8]/50 h-full"
                >
                  <div className="relative h-32 overflow-hidden">
                    <Art className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5A623] text-[#5a3a00]">
                      {area.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
                      <MapPin size={14} className="text-[#1AA5D8]" /> {area.name}
                    </p>
                    <p className="text-sm text-[#A8D4F0] leading-relaxed">{area.blurb}</p>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
