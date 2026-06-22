import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'

type FaqItem = { q: string; a: string }
type Source  = { title: string; url: string }

type Guide = {
  id: string; slug: string; title: string; excerpt: string; category: string
  content_html: string; meta_title: string; meta_description: string
  focus_keyword: string; og_image_url: string; read_time: string
  status: string; published_at: string | null; updated_at: string
  author_name: string; author_title: string; author_bio: string; author_avatar_url: string
  reviewed_at: string | null
  key_takeaways: string[]; faqs: FaqItem[]; sources: Source[]
}

type Props = { params: Promise<{ slug: string }> }

async function getGuide(slug: string): Promise<Guide | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guides').select('*').eq('slug', slug).eq('status', 'published').single()
  return data as Guide | null
}

// Extract H2 headings for Table of Contents
function extractToc(html: string): { id: string; label: string }[] {
  const matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  return matches.map((m, i) => ({
    id: `section-${i + 1}`,
    label: m[1].replace(/<[^>]*>/g, ''),
  }))
}

// Inject id attributes into H2 tags for anchor links
function injectHeadingIds(html: string): string {
  let i = 0
  return html.replace(/<h2([^>]*)>/gi, () => `<h2 id="section-${++i}"$1>`)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuide(slug)
  if (!guide) return {}
  return {
    title: guide.meta_title || guide.title,
    description: guide.meta_description || guide.excerpt,
    authors: guide.author_name ? [{ name: guide.author_name }] : undefined,
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

  const toc = extractToc(guide.content_html)
  const contentWithIds = injectHeadingIds(guide.content_html)
  const reviewedDate = guide.reviewed_at
    ? new Date(guide.reviewed_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null
  const updatedDate = new Date(guide.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Schema.org Article + Author + FAQ
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.published_at,
    dateModified: guide.updated_at,
    dateReviewed: guide.reviewed_at ?? undefined,
    author: guide.author_name ? {
      '@type': 'Person',
      name: guide.author_name,
      jobTitle: guide.author_title || undefined,
      description: guide.author_bio || undefined,
      worksFor: { '@type': 'Organization', name: 'Expats Da Nang' },
    } : { '@type': 'Organization', name: 'Expats Da Nang' },
    publisher: {
      '@type': 'Organization',
      name: 'Expats Da Nang',
      url: 'https://expatsdanang.com',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://expatsdanang.com/guides/${slug}` },
    image: guide.og_image_url || undefined,
  }

  const faqSchema = guide.faqs?.length >= 2 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-gray-600">Guides</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs">{guide.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-14">
          {/* ── Main content ── */}
          <article>
            {/* Category + meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">{guide.category}</span>
              {guide.read_time && <span className="text-xs text-gray-400">{guide.read_time}</span>}
              {reviewedDate && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] inline-block" />
                  Reviewed {reviewedDate}
                </span>
              )}
              {!reviewedDate && (
                <span className="text-xs text-gray-400">Updated {updatedDate}</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A3A5C] mb-6 leading-tight">{guide.title}</h1>

            {/* Author card */}
            {guide.author_name && (
              <div className="flex items-start gap-3 mb-6 pb-6 border-b border-[#E5E7EB]">
                {guide.author_avatar_url ? (
                  <img src={guide.author_avatar_url} alt={guide.author_name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1D9E75] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {guide.author_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{guide.author_name}</p>
                  {guide.author_title && <p className="text-xs text-[#1D9E75]">{guide.author_title}</p>}
                  {guide.author_bio && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{guide.author_bio}</p>}
                </div>
              </div>
            )}

            {/* Excerpt lead */}
            {guide.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8 pb-8 border-b border-[#E5E7EB]">{guide.excerpt}</p>
            )}

            {/* Key Takeaways */}
            {guide.key_takeaways?.length > 0 && (
              <div className="bg-[#f0fdf9] border border-[#1D9E75]/20 rounded-xl p-5 mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75] mb-3">Key takeaways</p>
                <ul className="space-y-2">
                  {guide.key_takeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#1D9E75] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rich text content */}
            <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: contentWithIds }} />

            {/* FAQ accordion */}
            {guide.faqs?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
                <h2 className="text-2xl font-bold text-[#0A3A5C] mb-6">Frequently asked questions</h2>
                <div className="space-y-3">
                  {guide.faqs.map((faq, i) => (
                    <details key={i} className="group border border-[#E5E7EB] rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 list-none hover:bg-gray-50">
                        {faq.q}
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-[#F3F4F6] pt-3">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {guide.sources?.length > 0 && (
              <div className="mt-10 pt-6 border-t border-[#E5E7EB]">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Sources & references</p>
                <ul className="space-y-1.5">
                  {guide.sources.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-gray-300 flex-shrink-0 mt-0.5">[{i + 1}]</span>
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="text-[#1AA5D8] hover:underline">{s.title || s.url}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Author footer */}
            {guide.author_name && (
              <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex items-start gap-4 bg-[#f7f8fc] rounded-xl p-5">
                {guide.author_avatar_url ? (
                  <img src={guide.author_avatar_url} alt={guide.author_name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1D9E75] flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {guide.author_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Written by</p>
                  <p className="font-semibold text-gray-900">{guide.author_name}</p>
                  {guide.author_title && <p className="text-xs text-[#1D9E75]">{guide.author_title}</p>}
                  {guide.author_bio && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{guide.author_bio}</p>}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <aside className="mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-5">

              {/* Table of Contents */}
              {toc.length > 1 && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">In this guide</p>
                  <nav className="space-y-1">
                    {toc.map(item => (
                      <a key={item.id} href={`#${item.id}`}
                        className="block text-sm text-gray-600 hover:text-[#1D9E75] py-1 border-l-2 border-transparent hover:border-[#1D9E75] pl-3 transition-colors leading-snug">
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* CTA */}
              <div className="bg-[#0A3A5C] rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1AA5D8] mb-3">Need help?</p>
                <p className="font-semibold text-lg leading-snug mb-2">Talk to someone who actually lives here</p>
                <p className="text-sm text-[#A8D4F0] mb-5">We handle everything from airport to apartment.</p>
                <Link href="/get-help"
                  className="block text-center bg-[#1D9E75] text-white font-medium px-4 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors text-sm">
                  Get help →
                </Link>
              </div>

              <Link href="/guides" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1D9E75] transition-colors">
                ← All guides
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
