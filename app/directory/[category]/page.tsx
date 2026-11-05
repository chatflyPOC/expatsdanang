import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { DirectoryBrowser } from '@/components/directory/DirectoryBrowser'
import { getBusinesses } from '@/lib/directory'
import { CATEGORIES, getCategory } from '@/types/directory'
import { JsonLd } from '@/components/JsonLd'
import { absoluteUrl, breadcrumbLd, pageMetadata } from '@/lib/seo'

interface Props {
  params: Promise<{ category: string }>
}

/** The eight categories are a fixed config, so every category page prerenders. */
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const config = getCategory(category)
  if (!config) return { title: 'Not found — Expats Da Nang' }

  return pageMetadata({
    title: config.metaTitle,
    description: config.metaDescription,
    path: `/directory/${config.slug}`,
    keywords: config.keywords,
  })
}

export default async function DirectoryCategoryPage({ params }: Props) {
  const { category } = await params
  const config = getCategory(category)
  if (!config) notFound()

  const businesses = await getBusinesses(config.slug)
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Directory', path: '/directory' },
            { name: config.label, path: `/directory/${config.slug}` },
          ]),
          {
            '@type': 'ItemList',
            name: config.metaTitle,
            description: config.metaDescription,
            url: absoluteUrl(`/directory/${config.slug}`),
            numberOfItems: businesses.length,
            itemListElement: businesses.map((b, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': config.schemaType,
                name: b.name,
                url: absoluteUrl(`/directory/${b.category}/${b.slug}`),
                ...(b.address
                  ? {
                      address: {
                        '@type': 'PostalAddress',
                        streetAddress: b.address,
                        addressLocality: b.district_label,
                        addressRegion: 'Da Nang',
                        addressCountry: 'VN',
                      },
                    }
                  : {}),
              },
            })),
          },
        ]}
      />

      <div className="bg-gradient-to-br from-[#E1F5EE] via-white to-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight size={12} />
            <Link href="/directory" className="hover:text-gray-700">Directory</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700">{config.label}</span>
          </nav>

          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D9E75] bg-[#E1F5EE] border border-[#B6E5D4] px-3 py-1 rounded-full mb-4">
            <Icon size={13} /> {config.label}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{config.metaTitle}</h1>
          <p className="text-gray-500 max-w-2xl">{config.metaDescription}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DirectoryBrowser initialBusinesses={businesses} category={config.slug} />

        <div className="mt-12 flex flex-wrap gap-2">
          <p className="text-xs text-gray-400 w-full mb-1">Other categories</p>
          {CATEGORIES.filter((c) => c.slug !== config.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/directory/${c.slug}`}
              className="text-xs border border-[#E5E7EB] px-3 py-1.5 rounded-full text-gray-600 hover:border-[#1D9E75] hover:text-[#0F6E56] transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
