import Link from 'next/link'
import { ChevronRight, Clock, Check, X, AlertTriangle, ArrowRight } from 'lucide-react'
import { getGuide } from '@/lib/guides'
import { guideMetadata, articleLd, breadcrumbLd } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'
import { FaqJsonLd } from '@/components/guide/GuideLayout'

export const metadata = guideMetadata('opening-bank-account-da-nang', {
  title: 'How to Open a Bank Account in Da Nang as a Foreigner',
  description: 'Step-by-step guide to opening a Vietnamese bank account in Da Nang — which bank to choose, exact documents needed, and how to avoid common rejections.',
})

const BANK_FAQS = [
  { q: 'Can I open an account on a tourist visa?', a: 'Sometimes yes, but it depends on the bank and branch. Techcombank and VPBank are the most likely to accept a tourist e-visa. A 3-month+ visa significantly increases your chances.' },
  { q: 'Do I need a Vietnamese address?', a: 'Most banks require proof of where you are staying in Da Nang. A signed lease, hotel booking, or TRC all work. Some branches accept a signed letter from your landlord.' },
  { q: 'How long does it take?', a: 'If you have all documents, the entire process takes about 30–60 minutes. The debit card is sometimes issued immediately, or mailed within 3–5 business days.' },
  { q: 'Can I open a USD account?', a: 'Yes — most major banks offer foreign currency accounts (USD, EUR). Ask for a foreign-currency account. These have slightly different requirements.' },
  { q: 'What if I do not speak Vietnamese?', a: 'Most Techcombank branches in Da Nang have at least one English-speaking staff member. You can also bring a Vietnamese-speaking friend, or we can accompany you to the appointment.' },
]

export default function BankAccountGuidePage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '84000000000'

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd
        data={[
          articleLd(getGuide('opening-bank-account-da-nang')!),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: 'Bank account setup', path: '/guides/opening-bank-account-da-nang' },
          ]),
        ]}
      />
      <FaqJsonLd items={BANK_FAQS} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={12} />
        <Link href="/guides" className="hover:text-gray-700">Guides</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700">Bank account setup</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">

        {/* Main content */}
        <article className="min-w-0">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">Banking</span>
            <h1 className="text-3xl font-semibold text-gray-900 leading-snug mt-4 mb-3">
              How to open a bank account in Da Nang as a foreigner
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Clock size={13} /> 5 min read</span>
              <span>Updated June 2025</span>
            </div>
          </div>

          {/* Intro */}
          <p className="text-gray-600 leading-relaxed mb-4">
            Opening a bank account in Vietnam as a foreigner is completely doable — but it is not as simple as walking in with your passport. Banks have different rules, staff often do not speak English, and the required documents vary depending on your visa type and which branch you visit.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            This guide covers exactly what to bring, which banks are most foreigner-friendly in Da Nang, and the mistakes that get people rejected on the first visit.
          </p>

          {/* TL;DR box */}
          <div className="bg-[#E1F5EE] border border-[#5DCAA5] rounded-xl p-5 mb-10">
            <p className="text-sm font-semibold text-[#085041] mb-3">TL;DR — what you need</p>
            <ul className="space-y-1.5">
              {[
                'Valid passport (original)',
                'Vietnamese visa or entry stamp (minimum 3 months remaining recommended)',
                'Temporary residence registration (TRC) — or your hotel address in some cases',
                'Vietnamese phone number (SIM)',
                '200,000–500,000 VND minimum deposit (varies by bank)',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#085041]">
                  <Check size={14} className="mt-0.5 flex-shrink-0 text-[#1D9E75]" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1 */}
          <Section title="Which bank should you choose?">
            <p className="text-gray-600 leading-relaxed mb-4">
              Not all Vietnamese banks are equally foreigner-friendly. Based on experience with hundreds of expats in Da Nang, these are the most reliable options:
            </p>
            <div className="space-y-4">
              {[
                {
                  bank: 'Techcombank',
                  verdict: 'Best overall',
                  color: 'text-green-700 bg-green-50',
                  notes: 'English-language app, international transfers, foreigner-friendly staff at most branches. Most expats use this.',
                },
                {
                  bank: 'VPBank',
                  verdict: 'Good alternative',
                  color: 'text-blue-700 bg-blue-50',
                  notes: 'Decent English support, easier to open without TRC. Good for shorter-stay expats.',
                },
                {
                  bank: 'BIDV',
                  verdict: 'For longer stays',
                  color: 'text-amber-700 bg-amber-50',
                  notes: 'State-owned bank, more paperwork but widely accepted for salary payments and property deposits.',
                },
                {
                  bank: 'Vietcombank',
                  verdict: 'Not recommended for foreigners',
                  color: 'text-red-600 bg-red-50',
                  notes: 'Strictest requirements, minimal English support at branch level. Many foreigners get rejected.',
                },
              ].map(({ bank, verdict, color, notes }) => (
                <div key={bank} className="border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-gray-900">{bank}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{verdict}</span>
                  </div>
                  <p className="text-sm text-gray-600">{notes}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Section 2 */}
          <Section title="Step-by-step: how to open the account">
            <ol className="space-y-5">
              {[
                {
                  step: '1. Get a Vietnamese SIM card first',
                  detail: 'You need a local phone number to register the account. Pick up a Viettel or Vinaphone SIM at any phone shop — bring your passport. Takes 10 minutes and costs around 50,000 VND.',
                },
                {
                  step: '2. Have your passport and visa ready',
                  detail: 'Bring your original passport — not a photocopy. Make sure your visa or entry stamp is current. Banks will photocopy everything.',
                },
                {
                  step: '3. Prepare your address documentation',
                  detail: 'If you have a TRC (temporary residence card issued by your landlord), bring it. If not, some banks accept a hotel confirmation or lease agreement showing your Da Nang address. Techcombank is most flexible on this.',
                },
                {
                  step: '4. Visit the branch — not peak hours',
                  detail: 'Go on a weekday morning (9–11am). Avoid lunch hours (11:30am–1:30pm) and Saturdays. Ask for a staff member who speaks English — most branches have at least one.',
                },
                {
                  step: '5. Fill in the forms and make the minimum deposit',
                  detail: 'You will fill out a standard account opening form. Deposit 200,000–500,000 VND (approximately $10–20 USD) to activate the account. You get a debit card on the spot or within 3–5 days.',
                },
                {
                  step: '6. Set up mobile banking',
                  detail: 'Ask the teller to help you set up the mobile app before you leave. Techcombank\'s app is available in English. Enable internet banking — you will need it for transfers.',
                },
              ].map(({ step, detail }) => (
                <li key={step} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{step.slice(3)}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* Section 3 — Do / Don't */}
          <Section title="Common reasons foreigners get rejected">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-red-100 rounded-xl p-5">
                <p className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2"><X size={14} /> Common mistakes</p>
                <ul className="space-y-2">
                  {[
                    'Visa with less than 1 month remaining',
                    'Bringing a photocopy of passport instead of original',
                    'No Vietnamese phone number yet',
                    'Visiting Vietcombank or Agribank first',
                    'Going on a Saturday afternoon',
                    'No address proof at all',
                  ].map(item => (
                    <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">×</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-green-100 rounded-xl p-5">
                <p className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2"><Check size={14} /> What works</p>
                <ul className="space-y-2">
                  {[
                    'Visa with 3+ months remaining',
                    'Original passport + clear copies',
                    'Vietnamese SIM already active',
                    'Starting with Techcombank or VPBank',
                    'Weekday morning visit',
                    'Lease or TRC showing Da Nang address',
                  ].map(item => (
                    <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-[#1D9E75] mt-0.5 flex-shrink-0">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Section 4 */}
          <Section title="What about receiving international transfers?">
            <p className="text-gray-600 leading-relaxed mb-4">
              Vietnamese bank accounts can receive international transfers (USD, EUR, GBP etc.) but there are a few things to know:
            </p>
            <ul className="space-y-3">
              {[
                'Incoming transfers are converted to VND at the bank\'s exchange rate — not always the best rate.',
                'You will need your SWIFT code and branch address for the sender.',
                'Large transfers (over $10,000 USD) may require a declaration form.',
                'Wise (formerly TransferWise) is a popular alternative for receiving money in foreign currency — many expats use both.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-[#1D9E75] mt-0.5 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Warning callout */}
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-5 mt-2 mb-10 flex gap-3">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Rules change — verify before you go</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                Vietnamese banking requirements for foreigners can change without notice. Branch-level staff sometimes have different interpretations of the rules. If you are rejected once, try a different branch or bank before assuming it is impossible.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <Section title="Frequently asked questions">
            <div className="space-y-5">
              {[
                {
                  q: 'Can I open an account on a tourist visa?',
                  a: 'Sometimes yes, but it depends on the bank and branch. Techcombank and VPBank are the most likely to accept a tourist e-visa. A 3-month+ visa significantly increases your chances.',
                },
                {
                  q: 'Do I need a Vietnamese address?',
                  a: 'Most banks require proof of where you are staying in Da Nang. A signed lease, hotel booking, or TRC all work. Some branches accept a signed letter from your landlord.',
                },
                {
                  q: 'How long does it take?',
                  a: 'If you have all documents, the entire process takes about 30–60 minutes. The debit card is sometimes issued immediately, or mailed within 3–5 business days.',
                },
                {
                  q: 'Can I open a USD account?',
                  a: 'Yes — most major banks offer foreign currency accounts (USD, EUR). Ask specifically for a "ngoại tệ" (foreign currency) account. These have slightly different requirements.',
                },
                {
                  q: 'What if I do not speak Vietnamese?',
                  a: 'Most Techcombank branches in Da Nang have at least one English-speaking staff member. You can also bring a Vietnamese-speaking friend, or we can accompany you to the appointment.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-[#E5E7EB] pb-5 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-900 mb-1.5">{q}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </Section>
        </article>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Help CTA */}
          <div className="bg-[#E1F5EE] rounded-xl p-6">
            <p className="font-semibold text-[#085041] mb-1">Want us to handle this?</p>
            <p className="text-sm text-[#0F6E56] leading-relaxed mb-5">
              We accompany you to the branch, translate everything, and make sure you leave with an open account — or figure out why not.
            </p>
            <Link
              href="/services/bank-account"
              className="block text-center text-sm font-medium bg-[#1D9E75] text-white px-4 py-2.5 rounded-full hover:bg-[#0F6E56] transition-colors mb-3"
            >
              See bank account service
            </Link>
            <a
              href={`https://wa.me/${wa}?text=Hi!+I+need+help+opening+a+bank+account+in+Da+Nang.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm font-medium border border-[#5DCAA5] text-[#085041] px-4 py-2.5 rounded-full hover:bg-[#d1efe3] transition-colors"
            >
              Ask on WhatsApp
            </a>
          </div>

          {/* Quick checklist */}
          <div className="border border-[#E5E7EB] rounded-xl p-6">
            <p className="text-sm font-semibold text-gray-900 mb-4">Pre-visit checklist</p>
            <ul className="space-y-2.5">
              {[
                'Original passport',
                'Current visa (3+ months left)',
                'Vietnamese SIM card',
                'Address proof (lease / TRC)',
                '500,000 VND cash for deposit',
                'Go on a weekday morning',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-4 h-4 rounded border border-[#D1D5DB] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Related guides */}
          <div className="border border-[#E5E7EB] rounded-xl p-6">
            <p className="text-sm font-semibold text-gray-900 mb-4">Related guides</p>
            <div className="space-y-3">
              {[
                { title: 'Visa options for long-term stays', href: '/guides' },
                { title: 'Best neighborhoods for expats', href: '/guides' },
                { title: 'Cost of living in Da Nang', href: '/guides' },
              ].map(({ title, href }) => (
                <Link key={title} href={href} className="flex items-center justify-between gap-2 text-sm text-gray-600 hover:text-[#1D9E75] group">
                  <span>{title}</span>
                  <ArrowRight size={13} className="flex-shrink-0 text-gray-300 group-hover:text-[#1D9E75]" />
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}
