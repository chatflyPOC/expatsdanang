import Link from 'next/link'
import { pageMetadata, SITE } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'

export const metadata = pageMetadata({
  title: 'FAQ — Frequently Asked Questions',
  description: 'Answers to the most common questions about our expat services in Da Nang: airport transfers, housing, bank accounts, visa, motorbike rental, and translation.',
  path: '/faq',
  keywords: ['expat Da Nang FAQ', 'living in Da Nang questions', 'Da Nang expat services help'],
})

const FAQS: { category: string; slug: string; items: { q: string; a: string }[] }[] = [
  {
    category: 'General',
    slug: 'general',
    items: [
      {
        q: 'Who is Expats Da Nang?',
        a: 'We are a small team of expats and Da Nang locals who help foreigners settle into the city. We handle the tasks that are confusing without local knowledge — airport pickups, finding apartments, opening bank accounts, visa paperwork, and more. Our company is registered in Vietnam as CHATFLY COMPANY LIMITED (MST 0402211642).',
      },
      {
        q: 'How quickly do you respond?',
        a: 'We reply within 2 hours, every day including weekends. For airport transfers and urgent requests, we respond within 30 minutes. You can reach us via WhatsApp or the contact form on this site.',
      },
      {
        q: 'Do you charge a fee for consultations?',
        a: 'Initial consultations and advice are always free. We only charge when you hire us for a specific service. Prices are listed clearly on each service page — no hidden fees.',
      },
      {
        q: 'Can I pay in USD or VND?',
        a: 'We accept both USD and VND. For services priced in USD, the equivalent VND amount is calculated at the current exchange rate on the day of service. We accept cash and bank transfer.',
      },
      {
        q: 'Do you offer packages for new arrivals?',
        a: 'Yes — many clients bundle airport transfer + housing search + bank account setup when they first arrive. Contact us and we will put together a package tailored to what you need.',
      },
    ],
  },
  {
    category: 'Airport Transfer',
    slug: 'airport-transfer',
    items: [
      {
        q: 'How do I book an airport transfer?',
        a: 'Send us your flight number, arrival date and time, and destination address via WhatsApp or the Get Help form. We confirm within 30 minutes. Booking at least 24 hours in advance is recommended, though last-minute bookings are often possible.',
      },
      {
        q: 'What happens if my flight is delayed?',
        a: 'We monitor your flight in real time. Your driver will adjust automatically — you will not be charged extra for delays. If the delay is significant, we will message you with an update.',
      },
      {
        q: 'Where will my driver meet me?',
        a: 'Your driver will be waiting inside the arrivals hall with a sign showing your name. You do not need to go outside or look for a taxi rank.',
      },
      {
        q: 'What vehicle types are available?',
        a: 'Standard sedan (1–3 passengers), 7-seat MPV for groups or extra luggage, and minivan for large groups. All vehicles are air-conditioned and well-maintained.',
      },
      {
        q: 'Is the price fixed or metered?',
        a: 'Fixed price, agreed before your trip. No meter, no surge pricing, no surprises at the destination. The price you see is the price you pay.',
      },
    ],
  },
  {
    category: 'Housing & Rental',
    slug: 'housing',
    items: [
      {
        q: 'Is the housing matching service really free?',
        a: 'Yes, completely free for renters. We earn a small referral fee from landlords when a lease is signed. This does not affect the rent you pay — landlords factor it into their listings either way.',
      },
      {
        q: 'How long does it take to find a place?',
        a: 'Most clients view suitable options within 3–5 days of contacting us and sign a lease within 1–2 weeks. If you have specific or unusual requirements, it may take a little longer.',
      },
      {
        q: 'Can you help me review my lease contract?',
        a: 'Yes. We review Vietnamese-language lease contracts, translate key clauses, and flag anything unusual or unfair before you sign. This is included in our housing matching service at no extra cost.',
      },
      {
        q: 'Do you have listings in An Thuong, My Khe, and Son Tra?',
        a: 'Yes, we cover all major expat-friendly neighbourhoods including An Thuong, My Khe Beach, Son Tra Peninsula, Hai Chau, and Ngu Hanh Son. Tell us your preferred area and budget and we will shortlist options accordingly.',
      },
      {
        q: 'What is the minimum rental period?',
        a: 'Most landlords prefer a minimum of 3 months, though 1-month rentals are available in some buildings and serviced apartments. Let us know your intended stay and we will find options that fit.',
      },
    ],
  },
  {
    category: 'Bank Account',
    slug: 'bank-account',
    items: [
      {
        q: 'Can foreigners open a bank account in Vietnam?',
        a: 'Yes. Foreigners with a valid passport and a visa of at least 1 month remaining can open a personal account at most major Vietnamese banks. Having a temporary residence card (TRC) or work permit makes the process smoother, but is not always required.',
      },
      {
        q: 'Which bank do you recommend for expats?',
        a: 'Vietcombank and Techcombank are the most foreigner-friendly: English-speaking staff, good mobile apps, and wide ATM networks. We help you choose the right bank based on your specific needs (receiving foreign transfers, accessing abroad, etc.).',
      },
      {
        q: 'How long does it take to open an account?',
        a: 'The branch appointment itself takes 1–2 hours. We handle all paperwork and translation in advance so the appointment goes smoothly. Your card typically arrives within 3–7 business days.',
      },
      {
        q: 'Do I need to be present at the bank?',
        a: 'Yes, you need to attend the branch appointment in person to sign documents and verify your identity. We accompany you throughout the appointment and handle all communication with bank staff.',
      },
      {
        q: 'What documents do I need to bring?',
        a: 'Original passport, a photocopy of your passport and visa page, and (if applicable) your work permit or TRC. We send you a complete checklist after you book the service.',
      },
    ],
  },
  {
    category: 'Visa & Documents',
    slug: 'visa-documents',
    items: [
      {
        q: 'Can you extend my tourist visa inside Vietnam?',
        a: 'Yes. We handle visa extensions for tourists, business visitors, and long-stay residents. We also assist with e-visa applications and renewals for eligible nationalities. Contact us at least 2 weeks before your current visa expires.',
      },
      {
        q: 'What is a Temporary Residence Card (TRC)?',
        a: 'A TRC (Thẻ tạm trú) is a multi-year residence document for foreigners who qualify — typically those with a work permit, married to a Vietnamese citizen, or investing in Vietnam. It replaces the need for repeated visa runs. We assess your eligibility and handle the application.',
      },
      {
        q: 'Do you handle document notarization?',
        a: 'Yes. We arrange certified translation of Vietnamese documents (birth certificates, marriage certificates, contracts) and facilitate notarization and apostille for use abroad.',
      },
      {
        q: 'How far in advance should I contact you for a visa extension?',
        a: 'At least 2 weeks before your current visa expires. Processing times vary and some extensions require waiting in a queue. Last-minute requests are sometimes possible but we cannot guarantee them.',
      },
      {
        q: 'What nationalities can get a Vietnam e-visa?',
        a: 'Vietnam e-visa is available to citizens of over 80 countries for a maximum stay of 90 days (single or multiple entry). We can confirm your eligibility and handle the application for you.',
      },
    ],
  },
  {
    category: 'Translation',
    slug: 'translation',
    items: [
      {
        q: 'What types of documents can you translate?',
        a: 'We translate lease contracts, employment contracts, official certificates (birth, marriage, divorce), business documents, medical records, and general correspondence — all Vietnamese↔English.',
      },
      {
        q: 'Is your translation certified?',
        a: 'Yes. We provide certified translations accepted by Vietnamese government offices, embassies, and international institutions. Certified translations include the translator\'s credentials and stamp.',
      },
      {
        q: 'How quickly can you turn around a translation?',
        a: 'Standard documents (1–5 pages) are typically completed within 1–2 business days. Urgent same-day service is available for an additional fee. Larger documents are quoted case by case.',
      },
      {
        q: 'Can you provide an interpreter for appointments?',
        a: 'Yes. We offer on-call interpreters for bank appointments, government office visits, medical consultations, property viewings, and meetings. Interpreters are booked hourly with a 2-hour minimum.',
      },
    ],
  },
  {
    category: 'Motorbike Rental',
    slug: 'motorbike-rental',
    items: [
      {
        q: 'Do I need a Vietnamese driving licence to rent a motorbike?',
        a: 'You do not need a Vietnamese licence to rent. However, to ride legally on Vietnamese roads you need either a valid Vietnamese driving licence or an International Driving Permit (IDP) from your home country. Riding without a valid licence puts you at risk of fines and invalidates travel insurance. We strongly recommend checking your IDP eligibility before renting.',
      },
      {
        q: 'What types of bikes are available?',
        a: 'Semi-automatic (Honda Wave, Yamaha Sirius) for beginners, scooters (Honda Vision, Yamaha NMax) for city riding, and larger automatics for longer trips. All bikes are inspected before each rental.',
      },
      {
        q: 'Can I rent by the month?',
        a: 'Yes. Monthly rates are significantly cheaper than daily rates. We offer daily, weekly, and monthly rentals with flexible extensions.',
      },
      {
        q: 'Is delivery available?',
        a: 'Yes. We deliver bikes to your address in Da Nang city at no extra charge. Delivery to locations outside the city centre may incur a small fee.',
      },
      {
        q: 'What happens if the bike breaks down?',
        a: 'We provide 24/7 roadside assistance. If the bike breaks down through no fault of yours, we will repair or replace it at no cost to you. Damage caused by accidents is covered by a refundable deposit.',
      },
    ],
  },
]

function faqSchemaLd() {
  const allItems = FAQS.flatMap((c) => c.items)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchemaLd()} />

      {/* Hero */}
      <section className="bg-[#f0fdf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75] mb-4">FAQ</p>
          <h1 className="text-4xl font-semibold text-gray-900 leading-tight mb-5">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Everything you need to know about our services. Can&apos;t find your answer?{' '}
            <Link href="/get-help" className="text-[#1D9E75] underline underline-offset-2 hover:text-[#0F6E56]">
              Send us a message
            </Link>{' '}
            — we reply within 2 hours.
          </p>
        </div>
      </section>

      {/* Jump links */}
      <div className="border-b border-[#E5E7EB] bg-white sticky top-[67px] z-10">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {FAQS.map((cat) => (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              className="flex-shrink-0 text-xs font-medium text-gray-500 hover:text-[#1D9E75] border border-[#E5E7EB] hover:border-[#1D9E75] px-3 py-1.5 rounded-full transition-colors"
            >
              {cat.category}
            </a>
          ))}
        </div>
      </div>

      {/* FAQ sections */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {FAQS.map((cat) => (
          <section key={cat.slug} id={cat.slug}>
            <h2 className="text-xl font-semibold text-[#0A3A5C] mb-6 pb-3 border-b border-[#E5E7EB]">
              {cat.category}
            </h2>
            <div className="space-y-0 divide-y divide-[#E5E7EB]">
              {cat.items.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="bg-[#0F6E56] py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold text-[#9FE1CB] mb-3">Still have questions?</h2>
        <p className="text-[#5DCAA5] mb-8">We reply within 2 hours, every day.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/get-help"
            className="inline-flex items-center bg-[#E1F5EE] text-[#085041] font-medium px-6 py-3 rounded-full hover:bg-white transition-colors"
          >
            Send us a message →
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center border border-[#5DCAA5] text-[#9FE1CB] font-medium px-6 py-3 rounded-full hover:bg-[#0a5a44] transition-colors"
          >
            Read our free guides
          </Link>
        </div>
      </section>
    </>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-5">
      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
        <span className="text-sm font-semibold text-gray-900 leading-snug">{q}</span>
        <span className="flex-shrink-0 w-5 h-5 rounded-full border border-[#E5E7EB] flex items-center justify-center text-gray-400 group-open:bg-[#E1F5EE] group-open:border-[#1D9E75] group-open:text-[#1D9E75] transition-colors mt-0.5">
          <svg
            viewBox="0 0 12 12"
            width="10"
            height="10"
            className="transition-transform group-open:rotate-180"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </summary>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed pr-9">{a}</p>
    </details>
  )
}
