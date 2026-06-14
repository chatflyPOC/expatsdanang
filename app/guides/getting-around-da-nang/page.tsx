import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, CompareCards, StepList, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('getting-around-da-nang')!

export const metadata = guideMetadata('getting-around-da-nang', {
  title: 'Getting Around Da Nang: Motorbike, Grab, Taxi & More',
  description:
    'How to get around Da Nang as an expat — renting vs buying a motorbike, using Grab, taxi tips, the licence question, and staying safe in local traffic.',
})

const FAQS = [
  {
    q: 'Do I legally need a licence to ride a motorbike?',
    a: 'To ride legally you need a Vietnamese licence or a valid International Driving Permit (IDP) under the 1968 Convention, plus your home licence covering motorcycles. Many expats ride without one, but be aware: you can be fined, and your travel insurance will usually NOT pay out for an accident if you weren\'t licensed for the bike.',
  },
  {
    q: 'Is Grab cheaper than owning a motorbike?',
    a: 'If you ride daily, owning or renting a bike is far cheaper — a rental is around $45–60/month all-in. Grab makes sense if you ride occasionally, can\'t drive, or want comfort in the rain. Many expats keep a bike and use Grab when it pours.',
  },
  {
    q: 'How safe is the traffic really?',
    a: 'Da Nang is calmer than Hanoi or Saigon, but traffic still flows on different "rules" — go slowly, be predictable, expect bikes from all directions, and always wear a proper helmet. Most expat accidents involve gravel, wet roads, or night-time riding after drinks.',
  },
  {
    q: 'Should I rent or buy a motorbike?',
    a: 'Rent if you\'re staying under ~6 months — it\'s hassle-free and includes help if it breaks down. Buy if you\'re here long-term and want to save money; a used automatic costs around $300–500 and you can usually resell it for a similar price.',
  },
  {
    q: 'Can I use Grab from the airport?',
    a: 'Yes. Grab works at Da Nang airport, though drivers sometimes meet you just outside the pickup zone. For a guaranteed English-speaking driver and a fixed price with no waiting, a pre-booked transfer is the smoother option for your first arrival.',
  },
]

export default function TransportGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Before you ride',
          items: [
            'A proper helmet that fits',
            'IDP + home licence (to ride legally)',
            'Grab app installed as backup',
            'Travel/health insurance that covers bikes',
            'Phone holder for navigation',
            'Know your address in Vietnamese',
          ],
        }}
      >
        <Lead>
          Da Nang is built for two wheels. It&apos;s flat, compact and scenic, and the motorbike is the
          default way locals and expats get around. But you have options — and which you choose depends on
          your confidence, your budget, and how long you&apos;re staying.
        </Lead>

        <KeyTakeaways
          items={[
            'A rented automatic motorbike (~$45–60/month) is the cheapest, freest way to get around',
            'Grab (car & bike) is your reliable backup — cashless, no haggling, English-friendly app',
            'To ride legally you need an IDP or Vietnamese licence — it also matters for insurance',
            'Traffic is calmer than the big cities, but ride slowly, predictably and always helmeted',
            'Rent if staying under 6 months; buy a used bike if you\'re here long-term',
          ]}
        />

        <Section title="Your options, compared">
          <CompareCards
            items={[
              {
                name: 'Motorbike (rent or own)',
                verdict: 'Best for daily life',
                color: 'text-[#085041] bg-[#E1F5EE]',
                notes: 'Total freedom and the cheapest per-trip cost. Automatics (Honda Vision, Air Blade) are easy to ride. Rentals include delivery and breakdown help. The downside is exposure to traffic and weather.',
              },
              {
                name: 'Grab — bike & car',
                verdict: 'Reliable backup',
                color: 'text-green-700 bg-green-50',
                notes: 'The super-app for rides, food and delivery. Fixed prices shown upfront, cashless, no language barrier. GrabBike is cheap; GrabCar is comfortable in the rain. The everyday fallback for non-riders.',
              },
              {
                name: 'Taxi (Mai Linh, Vinasun, Xanh SM)',
                verdict: 'Easy to hail',
                color: 'text-amber-700 bg-amber-50',
                notes: 'Metered taxis are everywhere. Stick to reputable companies (Xanh SM electric taxis are clean and app-bookable). Slightly pricier than Grab but handy when you can\'t get the app working.',
              },
              {
                name: 'Bicycle / walking',
                verdict: 'Short hops',
                color: 'text-blue-700 bg-blue-50',
                notes: 'The beach promenade and An Thuong are pleasant on foot or by bike. Fine for local errands, but the heat and distances make it impractical as your only transport.',
              },
              {
                name: 'Private car + driver',
                verdict: 'Trips & comfort',
                color: 'text-purple-700 bg-purple-50',
                notes: 'Hire a car with driver for day trips (Hoi An, Ba Na Hills, Hue) or when you have guests. Booked by the half-day or day — comfortable, air-conditioned, no parking hassle.',
              },
            ]}
          />
        </Section>

        <Section title="Rough costs (2025)">
          <DataTable
            headers={['Option', 'Typical cost', 'Notes']}
            rows={[
              ['Motorbike rental', '$45–60 / month', 'Automatic, delivered'],
              ['Used motorbike to buy', '$300–500', 'Often resells for similar'],
              ['Petrol', '~$1 / fill', 'Lasts most of a week'],
              ['GrabBike', '$0.80–2 / trip', 'Within the city'],
              ['GrabCar / taxi', '$2–6 / trip', 'City distances'],
              ['Car + driver (day)', '$50–80', 'Day trips out of town'],
            ]}
          />
        </Section>

        <Section title="Renting a motorbike: how it works">
          <StepList
            steps={[
              { title: 'Pick automatic unless you can ride manual', detail: 'Automatics (Honda Vision, Air Blade, Yamaha Janus) are the easiest. Semi-autos and manuals are cheaper but only if you\'re confident.' },
              { title: 'Rent from a verified shop, not a stranger', detail: 'Use a shop other expats recommend. They deliver the bike, provide a helmet, and help if it breaks down. Avoid leaving your passport as deposit — a copy plus a cash deposit is normal.' },
              { title: 'Check the bike before you accept it', detail: 'Test the brakes, lights, horn and indicators. Photograph any existing scratches so you\'re not charged for them later.' },
              { title: 'Know how to refuel', detail: 'Fill up at proper petrol stations (look for "Petrolimex"). A full tank is around 25,000–40,000 VND and lasts most of a week.' },
              { title: 'Park in guarded lots', detail: 'Use staffed parking (you\'ll get a ticket) at markets and malls — it costs a few thousand dong and prevents theft or fines.' },
            ]}
          />
        </Section>

        <Callout variant="warning" title="The licence question — read this">
          To ride legally in Vietnam you need a Vietnamese licence, or an International Driving Permit issued
          under the 1968 Vienna Convention together with a home motorcycle licence. This isn&apos;t just about
          fines: if you have an accident while riding unlicensed, most travel and health insurance policies
          will refuse to pay. If you plan to ride a lot, getting properly licensed is worth it.
        </Callout>

        <Section title="Staying safe in the traffic">
          <DoDont
            good={[
              'Wear a proper helmet, always',
              'Ride slowly and predictably',
              'Use mirrors and indicate clearly',
              'Assume others won\'t stop — yield early',
              'Avoid riding at night after drinks',
            ]}
            bad={[
              'A flimsy "fashion" helmet',
              'Weaving fast through gaps',
              'Riding in flip-flops in the rain',
              'Checking your phone while moving',
              'Drinking and riding — police do breathalyse',
            ]}
          />
        </Section>

        <Section title="Frequently asked questions">
          <FAQ items={FAQS} />
        </Section>
      </GuideLayout>
    </>
  )
}
