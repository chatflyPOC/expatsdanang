import Link from 'next/link'
import { Plane, Building2, CreditCard, FileText, Languages, Bike, ArrowRight } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { Reveal } from '@/components/Reveal'

const ICON_MAP: Record<string, React.ElementType> = {
  plane: Plane,
  building: Building2,
  'credit-card': CreditCard,
  'file-text': FileText,
  languages: Languages,
  bike: Bike,
}

export function ServicesGrid() {
  return (
    <section id="services" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75] mb-3">What we help with</p>
        <h2 className="text-3xl font-semibold text-gray-900 mb-3 max-w-lg leading-snug">
          Everything you need to land and live in Da Nang
        </h2>
        <p className="text-gray-600 max-w-xl mb-10">
          Pick a service to see what&apos;s included and verified options — or just tell us your situation and we&apos;ll handle the rest.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((svc, i) => {
          const Icon = ICON_MAP[svc.icon] || Plane
          return (
            <Reveal key={svc.slug} delay={(i % 3) * 80}>
              <Link
                href={`/services/${svc.slug}`}
                className="lift group block h-full border border-[#E5E7EB] rounded-2xl p-6 bg-white hover:border-[#1D9E75]/50 hover:shadow-[0_12px_30px_-12px_rgba(29,158,117,0.35)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#E1F5EE] flex items-center justify-center group-hover:bg-[#1D9E75] transition-colors">
                    <Icon size={22} className="text-[#1D9E75] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">{svc.price}</span>
                </div>
                <p className="font-semibold text-gray-900 mb-1.5">{svc.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{svc.description}</p>
                <span className="text-sm font-medium text-[#1D9E75] inline-flex items-center gap-1">
                  Learn more
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
