import Link from 'next/link'
import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, CompareCards, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('car-with-driver-da-nang')!

export const metadata = guideMetadata('car-with-driver-da-nang', {
  title: 'Car With a Driver in Da Nang: What It Costs & When It Wins',
  description:
    'Hiring a car with a driver in Da Nang removes the licence problem and often costs less than self-drive once parking and fuel are counted. Pricing models, what to expect, and when to skip it.',
})

const FAQS = [
  {
    q: 'Is a car with a driver expensive in Da Nang?',
    a: 'Less than most visitors expect. Because labour is inexpensive and self-drive rentals carry deposits, fuel and parking costs of their own, the gap between the two is usually modest — and for a single full-day trip the driver often works out cheaper once you count everything.',
  },
  {
    q: 'How is a driver usually priced?',
    a: 'Three common models: a fixed price per route (airport to An Thuong, Da Nang to Hoi An), a half-day or full-day rate with a distance cap, and a per-kilometre rate for longer runs. Fixed route pricing is the easiest to compare and the hardest to be surprised by.',
  },
  {
    q: 'Do I need to tip or buy the driver lunch?',
    a: 'Neither is obligatory. On a full-day trip many people cover the driver\'s lunch or add a small tip if the day went well, but it is a courtesy rather than an expectation, and a good operator will have priced the day without assuming it.',
  },
  {
    q: 'Will the driver speak English?',
    a: 'Sometimes, but do not assume it. If you need commentary or flexible plans, book specifically for an English-speaking driver and confirm it before the day. For a point-to-point transfer, a shared address in Vietnamese is usually enough.',
  },
  {
    q: 'When is a driver the wrong choice?',
    a: 'For everyday trips inside the city, where Grab is cheaper and instant. And for anyone living here long-term who wants a car on call for weeks — at that point a self-drive rental on a Vietnamese licence is far more economical.',
  },
]

export default function CarWithDriverGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Before you book',
          items: [
            'Agree the price model — fixed, half-day or per-km',
            'Confirm what happens if the day runs long',
            'Ask explicitly if you need English',
            'Check the vehicle size against your luggage',
            'Share pickup address in Vietnamese',
            'Agree who pays tolls and parking',
          ],
        }}
      >
        <Lead>
          Hiring a car with a driver in Da Nang solves the problem that stops most
          foreigners driving here: you need no licence, no International Driving Permit and
          no deposit. For a full-day trip it frequently costs about the same as self-drive
          once fuel, parking and the deposit risk are counted — and it is the only option
          available to visitors who cannot rent a car at all.
        </Lead>

        <KeyTakeaways
          items={[
            'No licence, no IDP, no deposit — the licence rule simply does not apply.',
            'Three pricing models: fixed route, half or full day, or per kilometre.',
            'Cheapest by far for full-day trips out of the city; poor value inside it.',
            'Grab still wins for short city hops.',
            'Long-term residents with a Vietnamese licence should rent instead.',
          ]}
        />

        <Section title="Why this is the default answer for visitors" id="why">
          <p>
            Vietnam recognises International Driving Permits issued under the 1968 Vienna
            Convention only. Permits from the United States, Canada, Australia and Japan are
            issued under the 1949 Geneva Convention and are not valid here — so a large
            share of visitors cannot legally drive themselves whatever they are willing to
            pay. Rental firms add a second hurdle by declining foreigners without residency.
          </p>
          <p>
            A driver removes both at once. The{' '}
            <Link href="/guides/self-drive-car-rental-da-nang" className="text-[#1AA5D8] hover:underline">
              self-drive guide
            </Link>{' '}
            covers the licence rule in full, and the{' '}
            <Link href="/guides/vietnamese-driving-licence-da-nang" className="text-[#1AA5D8] hover:underline">
              licence conversion guide
            </Link>{' '}
            covers the route out of it for residents.
          </p>
        </Section>

        <Section title="How pricing works" id="pricing">
          <DataTable
            headers={['Model', 'Best for', 'Watch for']}
            rows={[
              ['Fixed route', 'Airport transfers, Da Nang–Hoi An', 'Confirm it covers waiting time'],
              ['Half day', 'Ba Na, Marble Mountains', 'Usually a distance or hour cap'],
              ['Full day', 'Hue, My Son, multi-stop', 'What happens if you run over'],
              ['Per kilometre', 'Long or open-ended routes', 'Whether the return leg is charged'],
            ]}
          />
          <Callout variant="tip" title="Fixed beats flexible for a first booking">
            A fixed route price is the one you can compare between operators and the one
            least likely to grow on the day. Save per-kilometre deals for when you already
            know and trust the operator.
          </Callout>
        </Section>

        <Section title="Driver, self-drive, or Grab" id="compare">
          <CompareCards
            items={[
              {
                name: 'Car with driver',
                verdict: 'Best for day trips',
                color: 'text-green-700 bg-green-50',
                notes:
                  'No licence needed, no deposit, no parking. Comes into its own the moment you leave the city — Hoi An, Ba Na, Hue, My Son. The driver also handles the traffic, which is worth more than it sounds on a first visit.',
              },
              {
                name: 'Self-drive',
                verdict: 'Residents only, realistically',
                color: 'text-amber-700 bg-amber-50',
                notes:
                  'Cheapest per day over long periods and the most freedom, but needs a Vietnamese licence or a 1968 IDP plus residency to satisfy the rental company. Makes sense for weeks and months, not days.',
              },
              {
                name: 'Grab',
                verdict: 'Best inside the city',
                color: 'text-blue-700 bg-blue-50',
                notes:
                  'Cheaper and faster than any booked car for everyday trips around Da Nang. Falls down on full days, early starts, luggage, and anywhere it cannot reliably find a return ride.',
              },
            ]}
          />
        </Section>

        <Section title="Getting a good day out of it" id="practical">
          <DoDont
            good={[
              'Send your pickup address written in Vietnamese',
              'Agree the stop list before you set off',
              'Ask for a child seat in advance if you need one',
              'Confirm whether tolls and parking are included',
              'Give a realistic return time — days always run long',
            ]}
            bad={[
              'Assuming English without asking',
              'Adding stops mid-day on a fixed-route price',
              'Booking a 4-seater for four adults plus luggage',
              'Paying the full amount up front to an unknown operator',
              'Planning Hai Van and Hoi An as one day — they are opposite directions',
            ]}
          />
          <p>
            For arrivals specifically, a pre-booked{' '}
            <Link href="/services/airport-transfer" className="text-[#1AA5D8] hover:underline">
              airport transfer
            </Link>{' '}
            with a fixed fare removes the haggling at the worst possible moment — jet-lagged,
            at night, with luggage. Where to actually go once you have a car is covered in the{' '}
            <Link href="/guides/day-trips-from-da-nang-by-car" className="text-[#1AA5D8] hover:underline">
              day trips guide
            </Link>
            .
          </p>
        </Section>

        <FAQ items={FAQS} />
      </GuideLayout>
    </>
  )
}
