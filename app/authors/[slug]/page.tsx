import { notFound } from 'next/navigation'
import { AUTHORS } from '@/lib/authors'
import Link from 'next/link'
import { Mail, ExternalLink, Globe } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map((id) => ({
    slug: id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const author = AUTHORS[slug]
  if (!author) return {}

  return {
    title: `${author.name} | Expats Da Nang`,
    description: author.bio,
    openGraph: {
      title: author.name,
      description: author.bio,
      type: 'profile',
      url: `/authors/${slug}`,
    },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = AUTHORS[slug]
  if (!author) notFound()

  return (
    <>
      <div className="bg-gradient-to-b from-[#f0fdf9] to-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            {author.avatar_url ? (
              <img
                src={author.avatar_url}
                alt={author.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto mb-6 border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#1D9E75] flex items-center justify-center text-white font-semibold text-4xl sm:text-5xl mx-auto mb-6 border-4 border-white shadow-lg">
                {author.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A3A5C] mb-2">{author.name}</h1>
            <p className="text-lg text-[#1D9E75] font-medium mb-4">{author.title}</p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">{author.bio}</p>

            {/* Social Links */}
            {author.social && (
              <div className="flex justify-center gap-4 flex-wrap">
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75] hover:text-white transition-colors"
                  >
                    <ExternalLink size={18} />
                    LinkedIn
                  </a>
                )}
                {author.social.website && (
                  <a
                    href={author.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75] hover:text-white transition-colors"
                  >
                    <Globe size={18} />
                    Website
                  </a>
                )}
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75] hover:text-white transition-colors"
                  >
                    <Mail size={18} />
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-[#0A3A5C] mb-3">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Get in touch with {author.name.split(' ')[0]} or our team for personalized assistance.
            </p>
            <Link
              href="/get-help"
              className="inline-flex items-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Guides */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/guides" className="text-[#1D9E75] hover:text-[#0F6E56] font-medium">
          ← Back to all guides
        </Link>
      </div>
    </>
  )
}
