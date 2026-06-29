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
  {
    slug: 'apartment-for-rent-da-nang',
    title: 'Apartment for Rent in Da Nang: 2026 Guide for Expats',
    excerpt:
      'Everything you need to find and rent an apartment in Da Nang as a foreigner — neighborhoods, prices, what to watch out for, and how to get a fair deal.',
    category: 'Housing',
    readTime: '8 min read',
    updated: 'June 2026',
    service: 'housing',
  },
  {
    slug: 'house-for-rent-da-nang',
    title: 'House for Rent in Da Nang: 2026 Guide for Expats',
    excerpt:
      'Looking for a house to rent in Da Nang? Prices, best areas, what to look for, and how to find a house that actually matches the photos.',
    category: 'Housing',
    readTime: '6 min read',
    updated: 'June 2026',
    service: 'housing',
  },
  {
    slug: 'furnished-apartment-da-nang-long-term',
    title: 'Furnished Apartment Da Nang: Long-Term Rental Guide (2026)',
    excerpt:
      'How to find the right furnished apartment in Da Nang for a long-term stay — what\'s included, how to negotiate, and which areas offer the best value.',
    category: 'Housing',
    readTime: '7 min read',
    updated: 'June 2026',
    service: 'housing',
  },
  {
    slug: 'motorbike-rental-da-nang',
    title: 'Motorbike Rental Da Nang: Complete 2026 Guide',
    excerpt:
      'How to rent a motorbike in Da Nang — prices, best rental shops, what documents you need, insurance, and tips for riding safely as a foreigner.',
    category: 'Transport',
    readTime: '7 min read',
    updated: 'June 2026',
    service: 'motorbike-rental',
  },
  {
    slug: 'scooter-rental-da-nang',
    title: 'Scooter Rental Da Nang: What to Know Before You Ride',
    excerpt:
      'Renting a scooter in Da Nang is easy and affordable — if you know what to look for. Prices, best bikes, licence rules and practical riding tips for expats.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'June 2026',
    service: 'motorbike-rental',
  },
  {
    slug: 'monthly-motorbike-rental-da-nang',
    title: 'Monthly Motorbike Rental Da Nang: Expat Guide (2026)',
    excerpt:
      'Renting a motorbike by the month in Da Nang saves 30–40% vs daily rates. Prices, best bikes, what\'s included, and how to get the best deal.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'June 2026',
    service: 'motorbike-rental',
  },
  {
    slug: 'living-in-da-nang',
    title: 'Living in Da Nang: Complete Expat Guide (2026)',
    excerpt:
      'Everything you need to know about living in Da Nang as an expat — cost, housing, healthcare, community, visas and daily life on Vietnam\'s best beach city.',
    category: 'Lifestyle',
    readTime: '10 min read',
    updated: 'June 2026',
  },
  {
    slug: 'digital-nomad-da-nang',
    title: 'Da Nang Digital Nomad Guide 2026: Work, Live & Thrive',
    excerpt:
      'Da Nang is one of Asia\'s top digital nomad cities. Fast internet, low cost, a strong remote-work community and a beach on your doorstep.',
    category: 'Lifestyle',
    readTime: '9 min read',
    updated: 'June 2026',
  },
  {
    slug: 'moving-to-da-nang',
    title: 'Moving to Da Nang: Complete Checklist for Expats (2026)',
    excerpt:
      'Everything you need to plan and execute a smooth move to Da Nang — what to sort before you arrive, first-week essentials, and common mistakes to avoid.',
    category: 'Lifestyle',
    readTime: '8 min read',
    updated: 'June 2026',
  },
  {
    slug: 'coworking-da-nang',
    title: 'Best Coworking Spaces in Da Nang 2026 (Honest Guide)',
    excerpt:
      'Honest reviews of the best coworking spaces and work-friendly cafés in Da Nang — speed, atmosphere, desk quality and value for remote workers.',
    category: 'Lifestyle',
    readTime: '7 min read',
    updated: 'June 2026',
  },
  {
    slug: 'expat-life-da-nang',
    title: 'Expat Life in Da Nang: Community, Social Life & Settling In',
    excerpt:
      'What expat life in Da Nang is really like — the community, social scene, sports clubs, events and how to build a real life here, not just survive.',
    category: 'Lifestyle',
    readTime: '7 min read',
    updated: 'June 2026',
  },
  {
    slug: 'is-da-nang-safe',
    title: 'Is Da Nang Safe? Honest Safety Guide for Expats (2026)',
    excerpt:
      'Da Nang is one of Vietnam\'s safest cities — but here\'s an honest breakdown of real risks, what to watch for, and how to stay safe as an expat.',
    category: 'Lifestyle',
    readTime: '6 min read',
    updated: 'June 2026',
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
