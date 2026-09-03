import type { Metadata } from 'next'
import { GuideMeta, getGuide } from './guides'
import { WHATSAPP_E164 } from './contact'
import { ServiceConfig } from '@/types'

/**
 * The host we actually serve on. Vercel treats www as primary and 308s the
 * apex to it, so every canonical, og:url, sitemap <loc> and JSON-LD @id has to
 * agree with it — a canonical pointing at the apex resolves to a redirect back
 * to the page that declared it.
 */
const CANONICAL_ORIGIN = 'https://www.expatsdanang.com'

/**
 * Honours NEXT_PUBLIC_SITE_URL for local and preview hosts, but pins the
 * production origin so a stale dashboard value can't desynchronise canonicals
 * from the host that actually serves the response.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return CANONICAL_ORIGIN
  try {
    const host = new URL(raw).hostname
    if (host === 'expatsdanang.com' || host.endsWith('.expatsdanang.com')) {
      return CANONICAL_ORIGIN
    }
    return raw.replace(/\/$/, '')
  } catch {
    return CANONICAL_ORIGIN
  }
}

/** Central site identity used across metadata + structured data. */
export const SITE = {
  name: 'Expats Da Nang',
  url: resolveSiteUrl(),
  description:
    'Airport pickup, housing, visas, bank accounts — everything expats need to settle in Da Nang, handled by people who actually live here.',
  locale: 'en_US',
  email: 'hello@expatsdanang.com',
  sameAs: [
    'https://www.facebook.com/expatsdanang',
    'https://www.instagram.com/expatsdanang',
  ],
}

/** Fallback used only when a guide's `updated` string can't be parsed. */
const DEFAULT_DATE = '2025-06-15'

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

/**
 * Turns a guide's human `updated` label ("June 2026") into an ISO date for
 * structured data. Guides carry a display string rather than a timestamp, so
 * this keeps schema dates tracking the date shown on the page instead of a
 * hardcoded constant that never moves when content is edited.
 */
export function guideDateIso(value?: string): string {
  if (!value) return DEFAULT_DATE
  const match = value.trim().match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (!match) return DEFAULT_DATE
  const month = MONTHS.indexOf(match[1].toLowerCase())
  if (month === -1) return DEFAULT_DATE
  return `${match[2]}-${String(month + 1).padStart(2, '0')}-01`
}

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
    legalName: 'CHATFLY COMPANY LIMITED',
    taxID: '0402211642',
    url: SITE.url,
    email: SITE.email,
    telephone: WHATSAPP_E164,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: WHATSAPP_E164,
      email: SITE.email,
      availableLanguage: ['English', 'Vietnamese'],
    },
    logo: { '@type': 'ImageObject', url: LOGO_URL, width: 64, height: 64 },
    image: OG_URL,
    description: SITE.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Floor 6, PvcomBank Building, 2 30/4 Street',
      addressLocality: 'Hai Chau District',
      addressRegion: 'Da Nang City',
      addressCountry: 'VN',
    },
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
    legalName: 'CHATFLY COMPANY LIMITED',
    taxID: '0402211642',
    url: SITE.url,
    image: OG_URL,
    logo: LOGO_URL,
    description: 'Concierge services for expats and foreigners in Da Nang, Vietnam.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Floor 6, PvcomBank Building, 2 30/4 Street',
      addressLocality: 'Hai Chau District',
      addressRegion: 'Da Nang City',
      postalCode: '550000',
      addressCountry: 'VN',
    },
    areaServed: { '@type': 'City', name: 'Da Nang' },
    priceRange: '$',
    email: SITE.email,
    telephone: WHATSAPP_E164,
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
    datePublished: guideDateIso(meta.published ?? meta.updated),
    dateModified: guideDateIso(meta.updated),
    // A named person is a stronger authorship signal than the organisation,
    // so use one whenever the guide supplies a byline.
    author: meta.author
      ? {
          '@type': 'Person',
          name: meta.author.name,
          ...(meta.author.title ? { jobTitle: meta.author.title } : {}),
          ...(meta.author.bio ? { description: meta.author.bio } : {}),
          worksFor: { '@id': ORG_ID },
        }
      : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(meta.reviewedAt ? { dateReviewed: meta.reviewedAt } : {}),
    ...(meta.sources && meta.sources.length > 0
      ? { citation: meta.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })) }
      : {}),
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
      publishedTime: guideDateIso(g.published ?? g.updated),
      modifiedTime: guideDateIso(g.updated),
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
