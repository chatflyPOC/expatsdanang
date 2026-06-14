import Link from 'next/link'
import { ChevronRight, Clock, ArrowRight } from 'lucide-react'
import { GuideMeta, CATEGORY_COLORS, relatedGuides } from '@/lib/guides'
import { getService } from '@/lib/services'
import { ReadingProgress } from '@/components/guide/ReadingProgress'
import { JsonLd } from '@/components/JsonLd'
import { articleLd, breadcrumbLd } from '@/lib/seo'

interface GuideLayoutProps {
  meta: GuideMeta
  /** Optional pre-visit / quick checklist shown in the sidebar */
  checklist?: { title: string; items: string[] }
  /** Optional extra sidebar content (e.g. a calculator) rendered above related guides */
  sidebarExtra?: React.ReactNode
  children: React.ReactNode
}

export function GuideLayout({ meta, checklist, sidebarExtra, children }: GuideLayoutProps) {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84000000000'
  const service = meta.service ? getService(meta.service) : undefined
  const related = relatedGuides(meta.slug)

  return (
    <>
      <JsonLd
        data={[
          articleLd(meta),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: meta.title, path: `/guides/${meta.slug}` },
          ]),
        ]}
      />
      <ReadingProgress />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <ChevronRight size={12} />
          <Link href="/guides" className="hover:text-gray-700">Guides</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700">{meta.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-12">
          {/* Main content */}
          <article className="min-w-0">
            <div className="mb-8">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[meta.category]}`}>
                {meta.category}
              </span>
              <h1 className="text-3xl font-semibold text-gray-900 leading-snug mt-4 mb-3">{meta.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Clock size={13} /> {meta.readTime}</span>
                {meta.updated && <span>Updated {meta.updated}</span>}
              </div>
            </div>
            {children}
          </article>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Help CTA */}
            <div className="bg-[#E1F5EE] rounded-xl p-6">
              <p className="font-semibold text-[#085041] mb-1">Want us to handle this?</p>
              <p className="text-sm text-[#0F6E56] leading-relaxed mb-5">
                Skip the trial and error. We&apos;ll guide you through it or do it for you end-to-end.
              </p>
              {service && (
                <Link
                  href={`/services/${service.slug}`}
                  className="block text-center text-sm font-medium bg-[#1D9E75] text-white px-4 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors mb-3"
                >
                  See {service.title.toLowerCase()} service
                </Link>
              )}
              <a
                href={`https://wa.me/${wa}?text=Hi!+I+have+a+question+after+reading+your+guide.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm font-medium border border-[#5DCAA5] text-[#085041] px-4 py-2.5 rounded-full hover:bg-[#d1efe3] transition-colors"
              >
                Ask on WhatsApp
              </a>
            </div>

            {checklist && (
              <div className="border border-[#E5E7EB] rounded-xl p-6">
                <p className="text-sm font-semibold text-gray-900 mb-4">{checklist.title}</p>
                <ul className="space-y-2.5">
                  {checklist.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-4 h-4 mt-0.5 rounded border border-[#D1D5DB] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sidebarExtra}

            {/* Related guides */}
            <div className="border border-[#E5E7EB] rounded-xl p-6">
              <p className="text-sm font-semibold text-gray-900 mb-4">Related guides</p>
              <div className="space-y-3">
                {related.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="flex items-center justify-between gap-2 text-sm text-gray-600 hover:text-[#1D9E75] group"
                  >
                    <span className="leading-snug">{g.title}</span>
                    <ArrowRight size={13} className="flex-shrink-0 text-gray-300 group-hover:text-[#1D9E75]" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

/** Builds FAQ JSON-LD for SEO rich results. */
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
