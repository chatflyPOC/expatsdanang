export type GuideCategory =
  | 'Banking'
  | 'Visas'
  | 'Housing'
  | 'Transport'
  | 'Lifestyle'
  | 'Health'

/** An external reference backing claims made in a guide. */
export interface GuideSource {
  title: string
  url: string
}

/** Byline for a guide. Falls back to the organisation when unset. */
export interface GuideAuthor {
  name: string
  title?: string
  bio?: string
  avatarUrl?: string
}

export interface GuideMeta {
  slug: string
  title: string
  excerpt: string
  category: GuideCategory
  readTime: string
  /** Display label for the last content update, e.g. "June 2026". */
  updated: string
  /** Original publish label, same format. Defaults to `updated` when unset. */
  published?: string
  /** Service slug this guide relates to, for cross-linking the CTA */
  service?: string
  /**
   * E-E-A-T fields. The database-backed guides under /guides/[slug] have
   * carried a byline, citations and a review date since launch; the static
   * guides below had no way to express any of them — which left the site's two
   * highest-value pages (visa options, cost of living) with none.
   */
  author?: GuideAuthor
  sources?: GuideSource[]
  /** ISO date the content was last fact-checked, e.g. "2026-09-03". */
  reviewedAt?: string
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
    sources: [
      { title: 'State Bank of Vietnam — regulations for foreign account holders', url: 'https://www.sbv.gov.vn' },
      { title: 'Vietcombank — personal account requirements', url: 'https://www.vietcombank.com.vn' },
    ],
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
    sources: [
      { title: 'Vietnam Immigration Department — official portal', url: 'https://xuatnhapcanh.gov.vn' },
    ],
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
    sources: [
      { title: 'Da Nang official tourism portal — districts and areas', url: 'https://danangfantasticity.com' },
    ],
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
    sources: [
      { title: 'Da Nang official tourism portal — getting around the city', url: 'https://danangfantasticity.com' },
    ],
  },
  {
    slug: 'cost-of-living-da-nang',
    title: 'Cost of living in Da Nang for expats (2025)',
    excerpt:
      'Realistic monthly budget breakdowns for different lifestyles — from budget backpacker to comfortable expat — plus a calculator.',
    category: 'Lifestyle',
    readTime: '8 min read',
    updated: 'June 2025',
    sources: [
      { title: 'Numbeo — Da Nang cost of living index', url: 'https://www.numbeo.com/cost-of-living/in/Da-Nang' },
    ],
  },
  {
    slug: 'healthcare-da-nang',
    title: 'Healthcare in Da Nang: hospitals, clinics, and insurance',
    excerpt:
      'Which hospitals expats trust, how to find English-speaking doctors, and what health insurance you actually need.',
    category: 'Health',
    readTime: '6 min read',
    updated: 'June 2025',
    sources: [
      { title: 'Family Medical Practice Vietnam', url: 'https://www.vietnammedicalpractice.com' },
      { title: 'Vinmec International Hospital', url: 'https://www.vinmec.com' },
    ],
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
    slug: 'self-drive-car-rental-da-nang',
    title: 'Self-Drive Car Rental in Da Nang: The Expat Guide (2026)',
    excerpt:
      'Can foreigners actually rent a self-drive car in Da Nang? The licence rule that catches out most Americans and Australians, what rentals really cost, and when a driver is the better call.',
    category: 'Transport',
    readTime: '8 min read',
    updated: 'September 2026',
    sources: [
      { title: 'International Driving Permit — 1949 and 1968 conventions compared', url: 'https://en.wikipedia.org/wiki/International_Driving_Permit' },
      { title: 'Vietnam Law Magazine — International Driving Permits for foreigners', url: 'https://vietnamlawmagazine.vn/how-can-foreigners-obtain-international-driving-permits-in-vietnam-75857.html' },
    ],
  },
  {
    slug: 'vietnamese-driving-licence-da-nang',
    title: 'How to Get a Vietnamese Driving Licence in Da Nang (2026)',
    excerpt:
      'Converting your foreign licence means no test — just a dossier, a sworn translation and a medical certificate. Who qualifies, what it costs, and why an IDP cannot be converted.',
    category: 'Transport',
    readTime: '7 min read',
    updated: 'September 2026',
    service: 'visa-documents',
    sources: [
      { title: 'Viet Nam News — driver\'s licence conversion for foreigners', url: 'https://vietnamnews.vn/life-style/expat-corner/1719797/navigating-driver-s-licence-conversion-a-guide-for-foreigners-in-viet-nam.html' },
      { title: 'Vietnam Law Magazine — converting foreign driver licenses', url: 'https://vietnamlawmagazine.vn/how-to-convert-foreign-driver-licenses-for-use-in-vietnam-73948.html' },
    ],
  },
  {
    slug: 'car-with-driver-da-nang',
    title: 'Hiring a Car With a Driver in Da Nang: Costs & When It Wins',
    excerpt:
      'A driver removes the licence problem entirely and often costs less than self-drive once parking and fuel are counted. What to expect, how pricing works, and when it is the wrong call.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    service: 'airport-transfer',
  },
  {
    slug: 'day-trips-from-da-nang-by-car',
    title: 'Day Trips From Da Nang by Car: Hoi An, Ba Na, Hue & My Son',
    excerpt:
      'The four drives worth doing from Da Nang, how long each really takes, and the one geography mistake that ruins a lot of itineraries.',
    category: 'Transport',
    readTime: '7 min read',
    updated: 'September 2026',
    sources: [
      { title: 'Da Nang official tourism portal — destinations and routes', url: 'https://danangfantasticity.com' },
    ],
  },
  {
    slug: 'da-nang-expat-groups-meetups',
    title: 'Da Nang Expat Groups & Meetups: Which Ones Are Worth Joining',
    excerpt:
      'An honest field guide to the Facebook groups, Meetup circles and paid communities in Da Nang — what each is actually good for, and which ones you can skip.',
    category: 'Lifestyle',
    readTime: '7 min read',
    updated: 'September 2026',
    sources: [
      { title: 'Expat.com — Da Nang expat network', url: 'https://www.expat.com/en/network/asia/vietnam/da-nang/' },
      { title: 'International Friends Da Nang — Meetup', url: 'https://www.meetup.com/international-friends-da-nang/' },
      { title: 'Expats in Da Nang City — Facebook group', url: 'https://www.facebook.com/groups/expatsindanangcity/' },
    ],
  },
  {
    slug: 'making-friends-in-da-nang',
    title: 'Making Friends in Da Nang: A Realistic First 90 Days',
    excerpt:
      'Why some newcomers build a circle in a month and others leave lonely after a year — the sequence that works, and the four habits that quietly prevent it.',
    category: 'Lifestyle',
    readTime: '7 min read',
    updated: 'September 2026',
    sources: [
      { title: 'RemoteClub — remote worker communities in Da Nang', url: 'https://remoteclub.com/da-nang/communities/' },
    ],
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
  // ── 30-Article SEO Content Series ─────────────────────────────────────────
  // Motorcycle Rentals (8 articles)
  {
    slug: 'motorcycle-first-timer-checklist',
    title: 'Motorcycle Rental Checklist for First-Timers: Essential Steps Before Your First Big Bike',
    excerpt:
      'Renting a big motorcycle for the first time in Vietnam? This checklist ensures you\'re prepared before pickup, confident during the ride, and protected if something goes wrong.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist', bio: 'Nam helps expats navigate Vietnam\'s transportation and housing.' },
  },
  {
    slug: 'solo-female-rider-itineraries',
    title: 'Solo Female Rider Itineraries: 3-Day Big Bike Routes Through Central Vietnam',
    excerpt:
      'Three proven itineraries designed for solo women riders aged 25–50, with safety considerations, mechanical backup, and cultural navigation built into each day.',
    category: 'Transport',
    readTime: '7 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  {
    slug: 'motorcycle-vs-guided-tours',
    title: 'Motorcycle Rental vs Guided Tours: Which Is Right for Your Vietnam Trip?',
    excerpt:
      'Both options offer Central Vietnam rides. This guide breaks cost, flexibility, safety, and experience to help you decide between renting and joining a tour.',
    category: 'Transport',
    readTime: '7 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  {
    slug: 'monsoon-motorcycle-safety',
    title: 'Monsoon Motorcycle Riding: Safety Guide for June–August Rain Season in Vietnam',
    excerpt:
      'June through August is monsoon season in Central Vietnam. Heavy rain, 50+ mph wind gusts, and 90%+ humidity create dangerous conditions. This guide keeps you safe when riding during southwest monsoon.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    author: { name: 'Minh Pham', title: 'Transport Expert' },
  },
  {
    slug: 'international-driving-permit-2026',
    title: 'International Driving Permit (IDP) for Motorcycle Rentals in Vietnam: 2026 Guide',
    excerpt:
      'Vietnam officially accepts International Driving Permits (IDP) for motorcycle rentals, but many first-timers don\'t know which format is valid, how to obtain it, or what happens if you\'re stopped without one.',
    category: 'Transport',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  {
    slug: 'best-motorcycle-seasons-vietnam',
    title: 'Best Motorcycle Riding Seasons in Vietnam: Month-by-Month Weather & Conditions',
    excerpt:
      'Vietnam has two seasons: dry and monsoon. Central Vietnam\'s best motorcycle season is September–November. Here\'s the month-by-month breakdown to help you pick the ideal time to rent.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    author: { name: 'Minh Pham', title: 'Transport Expert' },
  },
  {
    slug: 'southeast-asia-motorcycle-tour',
    title: 'Multi-Country Motorcycle Tour: Vietnam–Thailand–Laos Route & Border Crossing Guide',
    excerpt:
      'Southeast Asian motorcycle tours span 2,000+ km across three countries. This guide covers route logistics, border crossings, documentation, and 10-day itinerary planning.',
    category: 'Transport',
    readTime: '8 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  {
    slug: 'motorcycle-camping-overland',
    title: 'Motorcycle Camping & Overland Travel: Guide to Luggage, Routes & Budget',
    excerpt:
      'Extend your Vietnam motorcycle trip from 3 days to 2+ weeks by camping. This guide covers luggage solutions, overland routes, camping etiquette, and budget breakdowns.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  // Housing Rentals (11 articles)
  {
    slug: 'temporary-residence-registration-guide',
    title: 'Temporary Residence Registration (TRR) Guide: Vietnamese Police Filing for Expats',
    excerpt:
      'Vietnam\'s Temporary Residence Registration (TRR) is a mandatory police filing for foreigners staying 24+ hours in one location. This guide covers the 24-hour deadline, paperwork, costs, and common pitfalls.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'long-term-apartment-negotiation',
    title: 'Long-Term Apartment Rental Negotiation: Getting the Best Da Nang Lease Deal',
    excerpt:
      'Negotiate your Da Nang apartment lease from first viewing to signed contract. This guide covers leverage points, negotiation scripts, and common red flags.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'best-neighborhoods-expats-da-nang',
    title: 'Best Neighborhoods for Expats in Da Nang: Complete Guide to Districts, Costs & Lifestyle',
    excerpt:
      'Da Nang has five main neighborhoods for expats. Here\'s where to live based on lifestyle, budget, and community.',
    category: 'Housing',
    readTime: '7 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'unfurnished-apartment-guide',
    title: 'Unfurnished Apartment Rental: What\'s Included & What You Need to Buy',
    excerpt:
      'Unfurnished apartments in Da Nang are 20–30% cheaper than furnished. This guide explains what\'s typically included, what you need to buy, and hidden costs.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'digital-nomad-housing-monthly',
    title: 'Digital Nomad Housing: Monthly Flexibility for Remote Workers in Da Nang',
    excerpt:
      'Month-to-month apartments + co-living spaces let remote workers stay flexible. This guide covers monthly options, costs, and what to expect.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'apartment-utilities-guide',
    title: 'Apartment Utilities Explained: Electricity, Water & Backup Power in Da Nang',
    excerpt:
      'Tropical living in Da Nang means high AC usage, frequent power cuts, and water concerns. This guide covers utility costs, billing, and backup solutions.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'short-term-vs-long-term-rental',
    title: 'Short-Term vs Long-Term Apartment Rental: Cost Analysis & When to Choose Each',
    excerpt:
      'Unsure whether to book short-term (Airbnb) or commit to a long-term lease? This guide compares costs and helps you choose.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'finding-roommates-expats',
    title: 'Finding Roommates in Da Nang: Expat Edition Housing Costs & House Rules',
    excerpt:
      'Sharing a house or apartment with roommates cuts rent by 40–50%. This guide covers finding compatible roommates, splitting expenses, and setting house rules.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'apartment-rental-scams-avoid',
    title: 'Apartment Rental Scams: How to Avoid Common Fraud in Da Nang',
    excerpt:
      'Expats lose $500–5,000 annually to rental scams. This guide covers the 8 most common scams and how to avoid them.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'renovating-rental-landlord-permission',
    title: 'Renovating Your Rental: What You Can Change & Landlord Permission',
    excerpt:
      'Want to paint the walls or fix that broken cabinet? This guide explains what landlords typically allow, what requires permission, and what you can\'t touch.',
    category: 'Housing',
    readTime: '4 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  {
    slug: 'air-conditioning-humidity-tropical-tips',
    title: 'Air Conditioning & Humidity: Tropical Rental Living Tips for Da Nang',
    excerpt:
      'Da Nang\'s humidity averages 75–90% annually. Improper AC use causes mold, health issues, and high electricity costs. This guide covers AC maintenance, humidity control, and tropical adaptation.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
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
