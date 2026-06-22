import type { Metadata } from 'next'
import { GuideMeta, getGuide } from './guides'
import { ServiceConfig } from '@/types'

/** Central site identity used across metadata + structured data. */
export const SITE = {
  name: 'Expats Da Nang',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://expatsdanang.com').replace(/\/$/, ''),
  description:
    'Airport pickup, housing, visas, bank accounts — everything expats need to settle in Da Nang, handled by people who actually live here.',
  locale: 'en_US',
  email: 'hello@expatsdanang.com',
  sameAs: [
    'https://www.facebook.com/expatsdanang',
    'https://www.instagram.com/expatsdanang',
  ],
}

/** Default publish/modified date for content until per-article dates are set. */
const DEFAULT_DATE = '2025-06-15'

export function absoluteUrl(path = ''): string {
  if (!path) return SITE.url
  return `${SITE.url}${path.startsWith('/') ? '' : '/'}${path}`
}

const ORG_ID = `${SITE.url}/#organization`
const SITE_ID = `${SITE.url}/#website`
const LOGO_URL = absoluteUrl('/logo.svg')
const OG_URL = absoluteUrl('/og.svg')

// ── Structured data builders ──────────────────────────────────────────────

export function organizationLd() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    logo: { '@type': 'ImageObject', url: LOGO_URL, width: 64, height: 64 },
    image: OG_URL,
    description: SITE.description,
    areaServed: { '@type': 'City', name: 'Da Nang' },
    sameAs: SITE.sameAs,
  }
}

export function websiteLd() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/guides?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function localBusinessLd() {
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#localbusiness`,
    name: SITE.name,
    url: SITE.url,
    image: OG_URL,
    logo: LOGO_URL,
    description: 'Concierge services for expats and foreigners in Da Nang, Vietnam.',
    address: { '@type': 'PostalAddress', addressLocality: 'Da Nang', addressCountry: 'VN' },
    areaServed: { '@type': 'City', name: 'Da Nang' },
    priceRange: '$',
    email: SITE.email,
    sameAs: SITE.sameAs,
    parentOrganization: { '@id': ORG_ID },
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export interface AggregateRating {
  ratingValue: number
  reviewCount: number
}

export function articleLd(meta: GuideMeta, aggregateRating?: AggregateRating | null) {
  const url = absoluteUrl(`/guides/${meta.slug}`)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: meta.title,
    description: meta.excerpt,
    image: OG_URL,
    inLanguage: 'en',
    datePublished: DEFAULT_DATE,
    dateModified: DEFAULT_DATE,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: meta.category,
    isAccessibleForFree: true,
    ...(aggregateRating && aggregateRating.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.ratingValue.toFixed(1),
            reviewCount: aggregateRating.reviewCount,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  }
}

export function serviceLd(service: ServiceConfig) {
  const url = absoluteUrl(`/services/${service.slug}`)
  const priceMatch = service.price.match(/\$(\d+)/)
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url,
    areaServed: { '@type': 'City', name: 'Da Nang' },
    provider: { '@id': `${SITE.url}/#localbusiness` },
    ...(priceMatch
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: priceMatch[1],
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  }
}

// ── Metadata helpers ──────────────────────────────────────────────────────

/** Builds complete, SEO-tuned metadata for a guide article. */
export function guideMetadata(
  slug: string,
  { title, description }: { title: string; description: string }
): Metadata {
  const g = getGuide(slug)!
  const path = `/guides/${slug}`
  return {
    title,
    description,
    keywords: [
      `${g.category.toLowerCase()} Da Nang`,
      'expat Da Nang',
      'living in Da Nang',
      'Da Nang guide',
      'moving to Da Nang',
    ],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      publishedTime: DEFAULT_DATE,
      modifiedTime: DEFAULT_DATE,
      authors: [SITE.name],
      section: g.category,
      images: [{ url: '/og.svg', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.svg'],
    },
  }
}

/** Builds metadata for a standard page (canonical + OG). */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      title,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: '/og.svg', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.svg'] },
  }
}
