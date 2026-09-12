import Link from 'next/link'
import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('day-trips-from-da-nang-by-car')!

export const metadata = guideMetadata('day-trips-from-da-nang-by-car', {
  title: 'Day Trips From Da Nang by Car: Hoi An, Ba Na, Hue, My Son',
  description:
    'The four drives worth doing from Da Nang, how long each really takes, which pair up in one day and which do not — plus the geography mistake that ruins a lot of itineraries.',
})

const FAQS = [
  {
    q: 'How far is Hoi An from Da Nang by car?',
    a: 'About 30 kilometres, which is a 40 to 50 minute drive depending on traffic. It is the easiest trip from Da Nang and the one most people do first. The coastal route is slower but far more scenic than the inland road.',
  },
  {
    q: 'Can I do Hai Van Pass and Hoi An in the same day?',
    a: 'Not sensibly. Hai Van Pass is north of Da Nang and Hoi An is south, so they sit in opposite directions with the city in between. Pairing them means driving through Da Nang twice and spending most of the day in the car. Pick one.',
  },
  {
    q: 'Is Hue doable as a day trip?',
    a: 'Yes, at roughly 100 kilometres each way, but it is a long day. Going via Hai Van Pass rather than the tunnel adds scenery and time. Leaving at first light and accepting a late return makes it comfortable; a lazy start does not.',
  },
  {
    q: 'Do I need a car, or is Grab enough?',
    a: 'Grab works fine for Hoi An and back. For Ba Na, Hue or My Son the problem is the return leg — you are relying on finding a ride from somewhere with far less coverage, often at the end of the day. A booked car waits for you.',
  },
  {
    q: 'What is the best single day trip if I only do one?',
    a: 'Hoi An, for most people — closest, most to see on arrival, and it works whether you leave at nine or at two. If you have already seen it, the Hai Van Pass drive north is the more memorable piece of road.',
  },
]

export default function DayTripsGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Day trip kit',
          items: [
            'Leave early — heat and crowds both build',
            'Cash for entry tickets and parking',
            'Sun protection, the coast is exposed',
            'Offline map, signal drops on the pass',
            'Agreed return time with your driver',
            'Rain layer in the October–November season',
          ],
        }}
      >
        <Lead>
          Four drives are worth the day from Da Nang: Hoi An at about 30 kilometres and
          under an hour, Ba Na Hills roughly an hour west, My Son to the south-west, and
          Hue about 100 kilometres north over the Hai Van Pass. The mistake that wrecks
          itineraries is assuming the pass is on the way to Hoi An. It is not — the pass is
          north, Hoi An is south.
        </Lead>

        <KeyTakeaways
          items={[
            'Hoi An: ~30 km, 40–50 minutes. The easy one, and the best single choice.',
            'Hai Van Pass is north of Da Nang; Hoi An is south. They do not combine.',
            'Hue is ~100 km each way — a genuine full day, not an afternoon.',
            'Ba Na Hills is a full day in practice, not a half day.',
            'The return leg is why a booked car beats Grab outside the city.',
          ]}
        />

        <Section title="The four trips at a glance" id="overview">
          <DataTable
            headers={['Destination', 'Direction', 'Rough distance', 'Plan for']}
            rows={[
              ['Hoi An', 'South', '~30 km', 'Half day, or a long lazy one'],
              ['Ba Na Hills', 'West', 'About an hour', 'Full day'],
              ['My Son Sanctuary', 'South-west', 'Beyond Hoi An', 'Half to full day'],
              ['Hue via Hai Van Pass', 'North', '~100 km each way', 'Full day, early start'],
            ]}
          />
          <Callout variant="warning" title="The geography mistake">
            Plenty of itineraries pair the Hai Van Pass with Hoi An because both are famous
            and both are near Da Nang. They are on opposite sides of the city. Driving the
            pass and then doubling back south to Hoi An turns two good half-days into one
            long day mostly spent in traffic.
          </Callout>
        </Section>

        <Section title="Hoi An" id="hoi-an">
          <p>
            The default trip, and rightly so. Thirty kilometres and forty to fifty minutes
            on the coastal road, which is worth taking over the inland route for the beach
            views. The old town is closed to cars, so you will be dropped at the edge and
            walk in — agree a pickup point and time before your driver leaves.
          </p>
          <p>
            Late afternoon into evening is the better half of the day: the heat drops, the
            lanterns come on, and the tour buses have gone. If you can only leave in the
            morning, go early enough to be somewhere shaded by midday.
          </p>
        </Section>

        <Section title="Ba Na Hills" id="ba-na">
          <p>
            About an hour west of the city and up into the mountains. Treat it as a full
            day rather than a half — the cable car queue alone can absorb a chunk of the
            morning, and there is more at the top than a quick look at the Golden Bridge.
          </p>
          <p>
            It sits meaningfully higher than Da Nang, so it is cooler and often in cloud
            when the coast is clear. That can be a relief in summer and a disappointment if
            you came for the view; check conditions before committing the day.
          </p>
        </Section>

        <Section title="My Son Sanctuary" id="my-son">
          <p>
            The Cham temple complex south-west of the city, beyond Hoi An. Quieter and
            older than anything else on this list, and a genuinely different kind of day
            out. It pairs naturally with Hoi An if you start early, since they lie in
            broadly the same direction.
          </p>
          <p>
            Go first thing. It is exposed, there is little shade among the ruins, and by
            late morning both the heat and the tour groups have arrived.
          </p>
        </Section>

        <Section title="Hue over the Hai Van Pass" id="hue">
          <p>
            The big one: roughly 100 kilometres north, with the option of the Hai Van Pass
            rather than the tunnel. Take the pass. It is the drive people remember — a
            climb over the headland with the coast falling away on both sides, and the old
            French and American fortifications at the top.
          </p>
          <p>
            The trade is time and weather. The pass adds an hour or so against the tunnel,
            and it is genuinely unpleasant in fog or heavy rain, which the headland attracts
            even when Da Nang is clear. In poor conditions take the tunnel and keep the pass
            for another trip.
          </p>
          <Callout variant="tip" title="Make it one-way if you can">
            Da Nang to Hue over the pass, then back through the tunnel, gives you the
            scenery without driving the same road twice at the end of a long day.
          </Callout>
        </Section>

        <Section title="Practical notes" id="practical">
          <DoDont
            good={[
              'Start early — heat, cloud and crowds all build through the day',
              'Agree the full stop list with your driver before setting off',
              'Carry cash for entry tickets and parking',
              'Check the forecast before committing to the pass',
              'Build in more return time than you think you need',
            ]}
            bad={[
              'Pairing Hai Van with Hoi An',
              'Treating Ba Na as a half day',
              'Relying on Grab for the leg home from Hue or My Son',
              'Driving the pass at night or in fog',
              'Arriving at My Son at midday',
            ]}
          />
          <p>
            For any of these beyond Hoi An, a{' '}
            <Link href="/guides/car-with-driver-da-nang" className="text-[#1AA5D8] hover:underline">
              car with a driver
            </Link>{' '}
            is usually the practical answer — the return leg is the weak point of every
            other option. If you hold a Vietnamese licence and would rather drive yourself,
            the{' '}
            <Link href="/guides/self-drive-car-rental-da-nang" className="text-[#1AA5D8] hover:underline">
              self-drive guide
            </Link>{' '}
            covers what that takes.
          </p>
        </Section>

        <FAQ items={FAQS} />
      </GuideLayout>
    </>
  )
}
