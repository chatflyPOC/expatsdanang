export type GuideCategory =
  | 'Banking'
  | 'Visas'
  | 'Housing'
  | 'Transport'
  | 'Lifestyle'
  | 'Health'

export interface GuideMeta {
  slug: string
  title: string
  excerpt: string
  category: GuideCategory
  readTime: string
  updated: string
  /** Service slug this guide relates to, for cross-linking the CTA */
  service?: string
}

export const GUIDES: GuideMeta[] = [
  {
    slug: 'opening-bank-account-da-nang',
    title: 'How to open a bank account in Da Nang as a foreigner',
    excerpt:
      'Step-by-step guide to opening a Vietnamese bank account — which bank to choose, what documents you need, and common pitfalls to avoid.',
    category: 'Banking',
    readTime: '5 min read',
    updated: 'June 2025',
    service: 'bank-account',
  },
  {
    slug: 'visa-options-da-nang',
    title: 'Visa options for long-term stays in Da Nang',
    excerpt:
      'E-visa, tourist visa, business visa, or temporary residence card — which one is right for your situation and how to get it.',
    category: 'Visas',
    readTime: '7 min read',
    updated: 'June 2025',
    service: 'visa-documents',
  },
  {
    slug: 'best-neighborhoods-da-nang-expats',
    title: 'Best neighborhoods in Da Nang for expats',
    excerpt:
      'An Thuong, My Khe, Han River, Ngu Hanh Son — where to live based on your lifestyle, budget, and priorities.',
    category: 'Housing',
    readTime: '6 min read',
    updated: 'June 2025',
    service: 'housing',
  },
  {
    slug: 'getting-around-da-nang',
    title: 'Getting around Da Nang: motorbike, car, taxi, and Grab',
    excerpt:
      'The practical guide to transport in Da Nang — renting a motorbike, using Grab, and what to know about local traffic.',
    category: 'Transport',
    readTime: '5 min read',
    updated: 'June 2025',
    service: 'motorbike-rental',
  },
  {
    slug: 'cost-of-living-da-nang',
    title: 'Cost of living in Da Nang for expats (2025)',
    excerpt:
      'Realistic monthly budget breakdowns for different lifestyles — from budget backpacker to comfortable expat — plus a calculator.',
    category: 'Lifestyle',
    readTime: '8 min read',
    updated: 'June 2025',
  },
  {
    slug: 'healthcare-da-nang',
    title: 'Healthcare in Da Nang: hospitals, clinics, and insurance',
    excerpt:
      'Which hospitals expats trust, how to find English-speaking doctors, and what health insurance you actually need.',
    category: 'Health',
    readTime: '6 min read',
    updated: 'June 2025',
  },
]

export const CATEGORY_COLORS: Record<GuideCategory, string> = {
  Banking: 'bg-blue-50 text-blue-700',
  Visas: 'bg-purple-50 text-purple-700',
  Housing: 'bg-[#E1F5EE] text-[#085041]',
  Transport: 'bg-amber-50 text-amber-700',
  Lifestyle: 'bg-pink-50 text-pink-700',
  Health: 'bg-red-50 text-red-600',
}

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug)
}

/** Up to `n` other guides, preferring the same category, for the "Related" sidebar. */
export function relatedGuides(slug: string, n = 3): GuideMeta[] {
  const current = getGuide(slug)
  const others = GUIDES.filter((g) => g.slug !== slug)
  const sorted = others.sort((a, b) => {
    const aMatch = current && a.category === current.category ? 0 : 1
    const bMatch = current && b.category === current.category ? 0 : 1
    return aMatch - bMatch
  })
  return sorted.slice(0, n)
}
