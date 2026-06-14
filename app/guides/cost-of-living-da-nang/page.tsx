import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, DataTable, CheckList, Callout, FAQ,
} from '@/components/guide/parts'
import { CostCalculator } from '@/components/guide/CostCalculator'

const meta = getGuide('cost-of-living-da-nang')!

export const metadata = guideMetadata('cost-of-living-da-nang', {
  title: 'Cost of Living in Da Nang for Expats (2025)',
  description:
    'Realistic monthly budgets for living in Da Nang — rent, food, transport and more — for budget, comfortable and premium lifestyles. Includes an interactive calculator.',
})

const FAQS = [
  {
    q: 'How much do I need per month to live comfortably in Da Nang?',
    a: 'Most single expats live comfortably on $900–1,300/month — a nice 1-bed apartment, a mix of local and western food, a motorbike, gym and a decent social life. You can do it on $600–700 if you live local and cook, or spend $1,800+ for a premium beachfront lifestyle.',
  },
  {
    q: 'Is Da Nang cheaper than Hanoi or Ho Chi Minh City?',
    a: 'Roughly similar on food and transport, but Da Nang rent is generally cheaper than central Saigon and comparable to Hanoi — while giving you the beach. Your biggest lever everywhere is rent and how often you eat western food.',
  },
  {
    q: 'What\'s the single biggest expense?',
    a: 'Rent, followed by food if you eat western often. A bowl of local pho is around $1.50–2.50; a western restaurant meal can be $8–15. Where you eat moves your budget more than almost anything else.',
  },
  {
    q: 'How much does electricity cost?',
    a: 'Modest in cool months, but air-conditioning in the hot season (May–August) can push a single person\'s electricity bill to $40–70. Always check whether your landlord charges the government rate or a marked-up rate.',
  },
  {
    q: 'Can I pay for everything by card?',
    a: 'Increasingly yes in cafés, supermarkets and malls, but cash and QR transfers (via your Vietnamese bank app) still rule for markets, street food, rent and small shops. Most expats keep some cash and use bank-app QR for the rest.',
  },
]

export default function CostOfLivingGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout meta={meta}>
        <Lead>
          Da Nang is one of the best-value coastal cities in Asia — you can live well, near a clean beach,
          for a fraction of what it costs back home. But &ldquo;cheap&rdquo; depends entirely on your
          lifestyle: rent and how often you eat western food swing the numbers more than anything else.
        </Lead>
        <Lead>
          Below are realistic 2025 budgets for three lifestyles, a category-by-category breakdown, and an
          interactive calculator so you can build your own estimate.
        </Lead>

        <KeyTakeaways
          items={[
            'Budget local lifestyle: ~$600–750/month',
            'Comfortable expat lifestyle: ~$900–1,300/month',
            'Premium / beachfront lifestyle: $1,800+/month',
            'Rent and western food are your biggest levers',
            'Cooking, a motorbike and local eating cut costs dramatically',
          ]}
        />

        <Section title="Three realistic monthly budgets">
          <DataTable
            headers={['Category', 'Budget', 'Comfortable', 'Premium']}
            rows={[
              ['Rent', '$200', '$420', '$750'],
              ['Utilities & internet', '$45', '$65', '$100'],
              ['Food & drink', '$170', '$320', '$550'],
              ['Transport', '$25', '$60', '$150'],
              ['Social & fun', '$60', '$150', '$300'],
              ['Health insurance', '$30', '$55', '$120'],
              ['Total / month', '≈ $530', '≈ $1,070', '≈ $1,970'],
            ]}
          />
          <p className="text-xs text-gray-400 mt-3">
            Single person, in USD. A couple sharing one apartment typically adds ~50–70% (mostly food and social), not 100%.
          </p>
        </Section>

        <Section title="Build your own estimate" id="calculator">
          <Lead>
            Adjust the options to match your lifestyle and see a live monthly estimate:
          </Lead>
          <CostCalculator />
          <p className="text-xs text-gray-400 mt-3">
            Estimates only — real costs vary with the season, your habits and the exchange rate.
          </p>
        </Section>

        <Section title="Where the money actually goes">
          <Lead>A few notes from living here that the table doesn&apos;t capture:</Lead>
          <CheckList
            items={[
              'Local food is astonishingly cheap — a full meal of pho, banh mi or com tam is $1.50–3.',
              'Western restaurants and imported groceries are where budgets quietly balloon.',
              'Coffee culture is huge and cheap: a great Vietnamese coffee is under $1; specialty western cafés $2–3.',
              'Air-con in the hot season is the one bill that surprises people — budget extra May to August.',
              'A monthly gym is $25–40; coworking $80–120; both far below western prices.',
            ]}
          />
        </Section>

        <Callout variant="tip" title="The fastest way to halve your budget">
          Eat like a local and ride a motorbike. The expats spending $2,000+ a month are almost always
          paying for western food, frequent taxis, and a beachfront apartment. Shift those three and the
          same lifestyle drops below $1,000 without feeling like a sacrifice.
        </Callout>

        <Section title="Frequently asked questions">
          <FAQ items={FAQS} />
        </Section>
      </GuideLayout>
    </>
  )
}
