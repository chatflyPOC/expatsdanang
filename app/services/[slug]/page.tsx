import { notFound } from 'next/navigation'
import { getService, SERVICES } from '@/lib/services'
import { ServiceHero } from '@/components/ServiceHero'
import { ServiceListings } from '@/components/ServiceListings'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { pageMetadata, serviceLd, breadcrumbLd } from '@/lib/seo'

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return pageMetadata({
    title: service.title,
    description: service.metaDescription,
    path: `/services/${slug}`,
    keywords: [`${service.title} Da Nang`, 'Da Nang expat services', 'expat Da Nang', service.title.toLowerCase()],
  })
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  return (
    <>
      <JsonLd
        data={[
          serviceLd(service),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/#services' },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={12} />
        <Link href="/#services" className="hover:text-gray-700">Services</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700">{service.title}</span>
      </nav>

      <ServiceHero service={service} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceListings serviceSlug={slug} />
      </div>
    </>
  )
}
