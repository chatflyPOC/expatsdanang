import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ServiceConfig } from '@/types'

export function ServiceHero({ service }: { service: ServiceConfig }) {
  return (
    <div className="bg-gray-50 border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-[1200px] mx-auto">
        <Badge className="mb-4">{service.title}</Badge>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">{getHeroTitle(service.slug)}</h1>
        <p className="text-gray-600 leading-relaxed max-w-xl mb-8">{service.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {service.bullets.map((b) => (
            <div key={b} className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex items-start gap-3">
              <Check size={16} className="text-[#1D9E75] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getHeroTitle(slug: string): string {
  const titles: Record<string, string> = {
    'airport-transfer': 'Arrive stress-free in Da Nang',
    'housing': 'Find your home in Da Nang',
    'bank-account': 'Open your Vietnamese bank account',
    'visa-documents': 'Sort your visa & documents',
    'translation': 'Professional translation services',
    'motorbike-rental': 'Explore Da Nang on two wheels',
  }
  return titles[slug] || 'Service details'
}
