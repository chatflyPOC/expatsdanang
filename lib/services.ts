import { ServiceConfig } from '@/types'

export const SERVICES: ServiceConfig[] = [
  {
    slug: 'airport-transfer',
    title: 'Airport Transfer',
    description: 'Reliable, English-speaking drivers waiting for you at Da Nang International Airport. Fixed prices, no haggling, no surprises.',
    price: 'from $12',
    icon: 'plane',
    bullets: [
      'Meet & greet inside arrivals hall',
      'Fixed fare — no meter surprises',
      'Available 24/7, all flight times',
    ],
    metaDescription: 'Book a reliable airport transfer in Da Nang. English-speaking drivers, fixed prices from $12. No haggling — trusted by 200+ expats.',
  },
  {
    slug: 'housing',
    title: 'Housing & Rental',
    description: 'We match you with verified landlords and trusted agents. No language barrier, no scams — just the right place at the right price.',
    price: 'Free matching',
    icon: 'building',
    bullets: [
      'We shortlist based on your budget & needs',
      'Accompany viewings if needed',
      'Review lease contract (Vietnamese)',
    ],
    metaDescription: 'Find apartments for rent in Da Nang as an expat or foreigner. Verified listings, English-speaking landlords, free matching service.',
  },
  {
    slug: 'bank-account',
    title: 'Bank Account Setup',
    description: 'Opening a Vietnamese bank account as a foreigner is confusing. We handle the paperwork, translation, and appointments for you.',
    price: 'from $30',
    icon: 'credit-card',
    bullets: [
      'Choose the right bank for your situation',
      'Full translation of all forms',
      'Accompany you to the branch appointment',
    ],
    metaDescription: 'How to open a bank account in Da Nang as a foreigner. We handle the process end-to-end — paperwork, translation, and appointments.',
  },
  {
    slug: 'visa-documents',
    title: 'Visa & Documents',
    description: 'Visa extensions, e-visas, temporary residence registration — we know Vietnamese bureaucracy so you don\'t have to.',
    price: 'from $25',
    icon: 'file-text',
    bullets: [
      'Visa extensions and renewals',
      'Temporary residence registration (TRC)',
      'Document notarization & apostille',
    ],
    metaDescription: 'Visa and document services for expats in Da Nang, Vietnam. Extensions, TRC registration, notarization — handled by locals who know the system.',
  },
  {
    slug: 'translation',
    title: 'Translation Services',
    description: 'Professional Vietnamese↔English translation for contracts, official documents, and everyday needs.',
    price: 'from $15',
    icon: 'languages',
    bullets: [
      'Certified translation for official documents',
      'Lease and contract review',
      'On-call interpreter for appointments',
    ],
    metaDescription: 'Vietnamese to English translation services in Da Nang. Certified translations, contract review, and on-call interpreters for expats.',
  },
  {
    slug: 'motorbike-rental',
    title: 'Motorbike Rental',
    description: 'Trusted motorbike rentals from verified local owners. Semi-automatics and scooters for any budget.',
    price: 'from $5/day',
    icon: 'bike',
    bullets: [
      'Verified, well-maintained bikes',
      'Flexible rental periods (daily, weekly, monthly)',
      'Delivery to your door available',
    ],
    metaDescription: 'Rent a motorbike in Da Nang from $5/day. Verified bikes, flexible terms, delivery available. Trusted by expats and digital nomads.',
  },
]

export function getService(slug: string): ServiceConfig | undefined {
  return SERVICES.find(s => s.slug === slug)
}
