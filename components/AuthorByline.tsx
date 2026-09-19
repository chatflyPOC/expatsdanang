import Link from 'next/link'
import { Authors } from 'lucide-react'

interface AuthorBylineProps {
  author_name?: string | null
  author_title?: string | null
  author_bio?: string | null
  author_avatar_url?: string | null
  published_at?: string | null
  updated_at?: string | null
  position?: 'top' | 'bottom'
}

export function AuthorByline({
  author_name,
  author_title,
  author_bio,
  author_avatar_url,
  published_at,
  updated_at,
  position = 'bottom',
}: AuthorBylineProps) {
  if (!author_name) return null

  const containerClass =
    position === 'top'
      ? 'mb-8 pb-8 border-b border-gray-200'
      : 'mt-8 pt-8 border-t border-gray-200'

  const initials = author_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={containerClass}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {author_avatar_url ? (
            <img
              src={author_avatar_url}
              alt={author_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#E1F5EE] flex items-center justify-center">
              <span className="text-sm font-semibold text-[#1D9E75]">{initials}</span>
            </div>
          )}
        </div>

        {/* Author info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/authors/${author_name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-semibold text-gray-900 hover:text-[#1D9E75] transition-colors"
              >
                {author_name}
              </Link>
              {author_title && (
                <p className="text-xs text-[#1D9E75] font-medium mt-0.5">{author_title}</p>
              )}
              {author_bio && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{author_bio}</p>
              )}
            </div>
          </div>

          {/* Publication dates */}
          {(published_at || updated_at) && (
            <div className="text-xs text-gray-500 mt-3 space-y-1">
              {published_at && (
                <p>
                  Published{' '}
                  {new Date(published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
              {updated_at && published_at !== updated_at && (
                <p>
                  Updated{' '}
                  {new Date(updated_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Author byline for service pages (service-content.tsx)
 * Simpler version for consistent display across all service pages
 */
export function ServiceAuthorByline({
  name = 'Nam Tran',
  title = 'Relocation Specialist & Founder',
  bio = 'Nam has helped 200+ expats settle in Da Nang since 2023.',
}: {
  name?: string
  title?: string
  bio?: string
}) {
  return (
    <div className="my-8 py-8 border-t border-gray-200">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#E1F5EE] flex items-center justify-center">
            <span className="text-sm font-semibold text-[#1D9E75]">NT</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-[#1D9E75] font-medium mt-0.5">{title}</p>
          <p className="text-sm text-gray-600 mt-2">{bio}</p>
        </div>
      </div>
    </div>
  )
}
