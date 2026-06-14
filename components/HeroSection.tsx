import Link from 'next/link'
import { MapPin, ShieldCheck, Clock, Star } from 'lucide-react'
import { DanangScene } from '@/components/art/DanangScene'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0fdf9] via-[#f5fdfb] to-white">
      {/* Soft decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#5DCAA5]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 w-80 h-80 rounded-full bg-[#1AA5D8]/10 blur-3xl" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-[#E1F5EE] text-[#085041] mb-6 animate-fade-up">
              <MapPin size={14} />
              Da Nang, Vietnam
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold text-gray-900 leading-[1.08] mb-5 animate-fade-up delay-100">
              Your local assistant in{' '}
              <span className="text-[#1D9E75]">Da Nang</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed animate-fade-up delay-200">
              Airport pickup, housing, visas, bank accounts — everything you need to
              settle in, handled by people who actually live here.
            </p>

            <div className="flex flex-wrap gap-3 mb-10 animate-fade-up delay-300">
              <Link
                href="/get-help"
                className="inline-flex items-center bg-[#1D9E75] text-white font-medium px-6 py-3 rounded-full hover:bg-[#0F6E56] transition-colors shadow-sm hover:shadow-md"
              >
                Tell us what you need →
              </Link>
              <a
                href="#services"
                className="inline-flex items-center border border-[#D1D5DB] text-gray-600 font-medium px-6 py-3 rounded-full hover:bg-white hover:border-[#1D9E75]/40 transition-colors"
              >
                Browse services
              </a>
            </div>

            {/* Inline trust signals */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 animate-fade-up delay-400">
              {[
                { icon: ShieldCheck, text: '200+ expats helped' },
                { icon: Clock, text: 'Reply within 2 hours' },
                { icon: Star, text: '4.9/5 rating' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon size={16} className="text-[#1D9E75]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Da Nang illustration */}
          <div className="relative animate-fade-in delay-200">
            <div className="animate-float">
              <DanangScene className="w-full h-auto drop-shadow-xl rounded-[28px]" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-6 sm:left-10 bg-white rounded-2xl shadow-lg border border-[#E5E7EB] px-4 py-3 flex items-center gap-3 animate-float-2">
              <div className="w-9 h-9 rounded-full bg-[#E1F5EE] flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#1D9E75]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-tight">Verified local partners</p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">No scams, no surprises</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
