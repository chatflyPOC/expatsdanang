import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { HeroSearchPanel } from '@/components/HeroSearchPanel'

/** Aerial of My Khe beach and the city — Unsplash, free licence. */
const HERO_PHOTO =
  'https://images.unsplash.com/photo-1674296067534-0f9769040781?auto=format&fit=crop&w=2400&q=75'

export function HeroSection() {
  return (
    <section className="px-2 sm:px-4 pt-2 sm:pt-3">
      <div className="relative isolate overflow-hidden rounded-[28px] min-h-[600px] h-[calc(100svh-96px)] max-h-[780px] flex flex-col">
        <Image
          src={HERO_PHOTO}
          alt="Aerial view of My Khe beach and the Da Nang skyline"
          fill
          preload
          sizes="100vw"
          className="object-cover -z-20"
        />
        {/* Navy wash keeps white type legible over the bright sky and surf */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0A3A5C]/70 via-[#0A3A5C]/25 to-[#0A3A5C]/60" />

        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-14">
          <div className="max-w-[920px] w-full mx-auto">
            <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md mb-5">
              <MapPin size={14} />
              Da Nang, Vietnam
            </span>
            {/*
              Deliberately not animated: the h1 is the LCP candidate, and
              `.animate-fade-up` holds it at opacity 0 until the animation starts.
            */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold text-white leading-[1.06] tracking-tight mb-4 max-w-[14ch] sm:max-w-none">
              Your local assistant in <span className="text-[#9FE1CB]">Da Nang</span>
            </h1>
            <p className="text-base sm:text-lg text-white/85 mb-9 max-w-xl leading-relaxed">
              Housing, motorbikes, visas and everything in between — handled by people who actually live here.
            </p>
          </div>

          <HeroSearchPanel />
        </div>

        {/* Photo caption, top-right (bottom-right is taken by the floating chat button) */}
        <p className="absolute top-4 right-5 text-xs font-medium text-white/80 hidden sm:block">
          My Khe Beach, Da Nang
        </p>
      </div>
    </section>
  )
}
