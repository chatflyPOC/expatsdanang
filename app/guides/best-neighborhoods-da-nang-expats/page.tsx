import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, CompareCards, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('best-neighborhoods-da-nang-expats')!

export const metadata = guideMetadata('best-neighborhoods-da-nang-expats', {
  title: 'Best Neighborhoods in Da Nang for Expats',
  description:
    'An Thuong, My Khe, Han River, Ngu Hanh Son and Son Tra compared — vibe, rent, and who each Da Nang neighborhood suits best, from a local perspective.',
})

const FAQS = [
  {
    q: 'Which area is best for digital nomads?',
    a: 'An Thuong, hands down. It has the highest density of cafés with fast wifi, coworking spaces, western food, gyms and other foreigners — all walkable, and two minutes from My Khe beach.',
  },
  {
    q: 'Where do families with kids tend to live?',
    a: 'Families often choose the quieter streets of My Khe / Ngu Hanh Son or further into Son Tra, where there\'s more space, houses with gardens, and proximity to international schools. Han River (Hai Chau) also works for families who want to be central.',
  },
  {
    q: 'How much should I budget for rent?',
    a: 'A furnished studio in An Thuong runs roughly $250–350/month, a 1-bedroom $350–500, and a 2-bedroom apartment $500–800. You\'ll pay a premium for sea views and brand-new buildings, and less the further you go from the beach.',
  },
  {
    q: 'Is it better to be near the beach or the river?',
    a: 'The beach side (An Thuong, My Khe) is more relaxed, greener and popular with expats; the river side (Hai Chau) is more urban, central and convenient for errands, markets and nightlife. Many people start beach-side and never leave.',
  },
  {
    q: 'Should I sign a lease before arriving?',
    a: 'No. Book a hotel or short-stay for 1–2 weeks, view places in person, and feel out the area first. Photos hide noise, construction, and how walkable a street really is. We can line up viewings for your arrival week.',
  },
]

export default function NeighborhoodsGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Before you sign a lease',
          items: [
            'View in person (not just photos)',
            'Visit the street at night too',
            'Check water pressure & AC',
            'Confirm what bills are included',
            'Ask about the deposit (usually 1 month)',
            'Get the contract translated',
          ],
        }}
      >
        <Lead>
          Da Nang is compact — you can drive from the mountains to the beach in 20 minutes — but where you
          base yourself shapes your whole experience. The difference between a café-lined expat street and
          a quiet local lane is just a few blocks, and the rent can swing by hundreds of dollars.
        </Lead>
        <Lead>
          Here&apos;s an honest, local breakdown of the main areas, what each is actually like to live in,
          and who they suit.
        </Lead>

        <KeyTakeaways
          items={[
            'An Thuong is the expat hub — walkable, social, beach-side, the easy default',
            'My Khe is quieter and more residential, still steps from the sand',
            'Han River / Hai Chau is central and urban — markets, nightlife, convenience',
            'Ngu Hanh Son (Marble Mountains) gives you more space for less money',
            'Always view in person and check the street at night before committing',
          ]}
        />

        <Section title="The neighborhoods, area by area">
          <CompareCards
            items={[
              {
                name: 'An Thuong',
                verdict: 'Expat hub',
                color: 'text-[#085041] bg-[#E1F5EE]',
                notes: 'The beating heart of expat Da Nang. Cafés, coworking, western restaurants, bars, gyms and mini-marts packed into walkable blocks, two minutes from My Khe beach. Most newcomers start here — it\'s social and easy, though it can feel touristy and a touch pricier.',
              },
              {
                name: 'My Khe / Bac My An',
                verdict: 'Beachside calm',
                color: 'text-blue-700 bg-blue-50',
                notes: 'Just north and around An Thuong — same beach, calmer streets. More long-term residents and families, a mix of apartments and houses. You keep the beach lifestyle with fewer crowds and slightly better value.',
              },
              {
                name: 'Han River / Hai Chau',
                verdict: 'Central & urban',
                color: 'text-purple-700 bg-purple-50',
                notes: 'The city centre on the river\'s west bank. Big markets (Han Market), the famous bridges, nightlife, hospitals and offices. Best if you want convenience and city energy over beach calm. Less "expat bubble", more real Vietnamese city.',
              },
              {
                name: 'Ngu Hanh Son (Marble Mountains)',
                verdict: 'Best value',
                color: 'text-amber-700 bg-amber-50',
                notes: 'South of the beach areas, around the Marble Mountains. Greener, quieter and noticeably cheaper — you get more space for your money. Trade-off: you\'ll rely on a motorbike for most things, as it\'s more spread out.',
              },
              {
                name: 'Son Tra Peninsula',
                verdict: 'Nature & space',
                color: 'text-green-700 bg-green-50',
                notes: 'The forested peninsula at the north end of the beach. Quiet, scenic, more upscale villas and resorts. Great for families or anyone wanting nature and space — but it\'s the least walkable and furthest from the action.',
              },
            ]}
          />
        </Section>

        <Section title="Quick comparison">
          <DataTable
            headers={['Area', 'Vibe', 'Studio rent', 'Best for']}
            rows={[
              ['An Thuong', 'Social, walkable', '$280–380', 'Newcomers, nomads'],
              ['My Khe', 'Calm, beachy', '$250–350', 'Long-termers, couples'],
              ['Hai Chau', 'Central, urban', '$250–400', 'City lovers, convenience'],
              ['Ngu Hanh Son', 'Quiet, green', '$180–280', 'Budget, more space'],
              ['Son Tra', 'Nature, upscale', '$350–600+', 'Families, villas'],
            ]}
          />
          <p className="text-xs text-gray-400 mt-3">
            Furnished, monthly. Sea views and new buildings cost more; longer leases (6–12 months) get better rates.
          </p>
        </Section>

        <Section title="How to choose the right area for you">
          <Lead>A simple way to narrow it down:</Lead>
          <ul className="space-y-2.5 mb-2">
            {[
              'Want it easy and social on day one? → An Thuong.',
              'Here long-term and value calm? → My Khe / Bac My An.',
              'Love a buzzing city over the beach? → Hai Chau.',
              'Watching the budget or want a house? → Ngu Hanh Son.',
              'Family with kids, want space and nature? → Son Tra or My Khe.',
            ].map((line) => (
              <li key={line} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-[#1D9E75] mt-0.5">›</span> {line}
              </li>
            ))}
          </ul>
        </Section>

        <Callout variant="tip" title="Start beach-side, then decide">
          If you&apos;re unsure, base yourself in An Thuong for the first month. It&apos;s the easiest place
          to land, meet people and get oriented — and from there you&apos;ll quickly learn whether you want
          to stay or move somewhere quieter or cheaper once you know the city.
        </Callout>

        <Section title="Renting do / don't">
          <DoDont
            good={[
              'View several places in person',
              'Negotiate — listed prices have room',
              'Walk the street at night for noise',
              'Get the lease translated before signing',
              'Pay deposit + rent via traceable transfer',
            ]}
            bad={[
              'Signing a 12-month lease sight-unseen',
              'Assuming photos reflect reality',
              'Ignoring nearby construction sites',
              'Handing over a big cash deposit with no contract',
              'Overlooking who pays electricity (it adds up with AC)',
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
