import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { params: Promise<{ slug: string }> }

async function getGuide(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuide(slug)
  if (!guide) return {}
  return {
    title: guide.meta_title || guide.title,
    description: guide.meta_description || guide.excerpt,
    openGraph: {
      title: guide.meta_title || guide.title,
      description: guide.meta_description || guide.excerpt,
      type: 'article',
      images: guide.og_image_url ? [{ url: guide.og_image_url }] : [],
      publishedTime: guide.published_at ?? undefined,
      modifiedTime: guide.updated_at,
    },
  }
}

export default async function DynamicGuidePage({ params }: Props) {
  const { slug } = await params
  const guide = await getGuide(slug)
  if (!guide) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.published_at,
    dateModified: guide.updated_at,
    author: { '@type': 'Organization', name: 'Expats Da Nang' },
    publisher: { '@type': 'Organization', name: 'Expats Da Nang', url: 'https://expatsdanang.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://expatsdanang.com/guides/${slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-gray-600">Guides</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{guide.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Main content */}
          <article>
            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">{guide.category}</span>
              {guide.read_time && (
                <span className="text-xs text-gray-400">{guide.read_time}</span>
              )}
              {guide.published_at && (
                <span className="text-xs text-gray-400">
                  Updated {new Date(guide.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A3A5C] mb-6 leading-tight">{guide.title}</h1>

            {guide.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8 pb-8 border-b border-[#E5E7EB]">{guide.excerpt}</p>
            )}

            {/* Rich text content */}
            <div
              className="ProseMirror"
              dangerouslySetInnerHTML={{ __html: guide.content_html }}
            />
          </article>

          {/* Sidebar */}
          <aside className="mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              {/* CTA card */}
              <div className="bg-[#0A3A5C] rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1AA5D8] mb-3">Need help?</p>
                <p className="font-semibold text-lg mb-2">Talk to someone who actually lives here</p>
                <p className="text-sm text-[#A8D4F0] mb-5">We handle everything from airport to apartment.</p>
                <Link
                  href="/get-help"
                  className="block text-center bg-[#1D9E75] text-white font-medium px-4 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors text-sm"
                >
                  Get help →
                </Link>
              </div>

              {/* Back to guides */}
              <Link
                href="/guides"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1D9E75] transition-colors"
              >
                ← All guides
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
