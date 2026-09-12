import Link from 'next/link'
import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, CompareCards, StepList, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('self-drive-car-rental-da-nang')!

export const metadata = guideMetadata('self-drive-car-rental-da-nang', {
  title: 'Self-Drive Car Rental in Da Nang: The Expat Guide',
  description:
    'Can foreigners rent a self-drive car in Da Nang? The 1968 vs 1949 IDP rule that invalidates most American and Australian permits, real rental prices, deposits, and when hiring a driver costs less.',
})

const FAQS = [
  {
    q: 'Can foreigners rent a self-drive car in Da Nang?',
    a: 'Legally, only with a Vietnamese driving licence or an International Driving Permit issued under the 1968 Vienna Convention, carried with your original licence and passport. In practice many rental companies also decline foreigners who cannot show Vietnamese residency, because recovering a vehicle from someone who has left the country is close to impossible. Expats living here on a TRC or work permit have a much easier time than tourists.',
  },
  {
    q: 'Is my International Driving Permit valid in Vietnam?',
    a: 'Only if it was issued under the 1968 Vienna Convention. Permits issued under the 1949 Geneva Convention — the standard in the United States, Canada, Australia and Japan — are not recognised in Vietnam, even though they are genuine IDPs. Check the convention printed on the cover before you travel. UK and most European permits are 1968 and are accepted.',
  },
  {
    q: 'What does self-drive car rental cost in Da Nang?',
    a: 'Vietnamese rental companies advertise 4 to 7 seat cars from roughly 400,000 to 450,000 VND per day, with cheaper weekly and monthly rates. Expect a refundable deposit of about 5 to 15 million VND, or a demand to hold an original document. Prices rise sharply around Tet and the April and September public holidays.',
  },
  {
    q: 'Will my insurance cover me if I drive without a valid licence?',
    a: 'Assume it will not. Travel and health policies routinely exclude accidents where the driver was not licensed for the vehicle under local law, and that exclusion applies whether or not the police ever stop you. This is the practical reason the licence question matters more than the fine does.',
  },
  {
    q: 'Is it better to hire a car with a driver instead?',
    a: 'For most visitors, yes. A car with a driver removes the licence problem entirely, costs only modestly more than self-drive once you account for parking and fuel, and the driver handles navigation and traffic. Self-drive makes sense mainly for residents who already hold a Vietnamese licence and want a car for months rather than days.',
  },
  {
    q: 'Is Da Nang easy to drive in?',
    a: 'By Vietnamese standards, yes. Roads are wider, traffic is calmer and parking is less stressful than in Hanoi or Ho Chi Minh City, and the city grid is straightforward. That does not make the licence requirement optional — it just means the driving itself is the easy part.',
  },
]

export default function SelfDriveCarRentalGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Before you book',
          items: [
            'Check which convention your IDP says on the cover',
            'Original home licence (the IDP is not valid alone)',
            'Passport plus visa or TRC',
            'Deposit ready — 5–15 million VND is normal',
            'Confirm insurance covers a self-driven car',
            'Photograph the car from every angle at pickup',
          ],
        }}
      >
        <Lead>
          Most foreigners cannot legally rent a self-drive car in Da Nang on the permit they already
          hold. Vietnam recognises International Driving Permits issued under the 1968 Vienna
          Convention only — so the IDP carried by most Americans, Canadians, Australians and Japanese
          drivers is not valid here, even though it is a genuine document. Rental firms often decline
          foreigners for a second reason too: no Vietnamese residency.
        </Lead>

        <KeyTakeaways
          items={[
            'Vietnam accepts 1968 Vienna Convention IDPs. A 1949 Geneva Convention IDP — the US, Canadian, Australian and Japanese standard — is not recognised.',
            'An IDP is never valid on its own. Carry your original home licence with it, plus passport.',
            'Expect 400,000–450,000 VND per day for a 4–7 seater, and a 5–15 million VND deposit.',
            'Driving unlicensed usually voids your insurance. That is the real risk, not the fine.',
            'Residents with a Vietnamese licence have far more options than tourists — including monthly rates.',
          ]}
        />

        <Section title="The licence rule that catches most people out" id="licence">
          <p>
            There are two international conventions governing driving permits, and Vietnam only
            recognises one of them. This single fact invalidates the paperwork of a large share of
            the expats who arrive intending to drive.
          </p>

          <DataTable
            headers={['Your licence was issued in', 'IDP convention', 'Valid in Vietnam?']}
            rows={[
              ['United Kingdom, most of Europe', '1968 Vienna', 'Yes'],
              ['Thailand, South Korea, Philippines', '1968 Vienna', 'Yes'],
              ['United States', '1949 Geneva', 'No'],
              ['Canada', '1949 Geneva', 'No'],
              ['Australia, New Zealand', '1949 Geneva', 'No'],
              ['Japan', '1949 Geneva', 'No'],
            ]}
          />

          <Callout variant="warning" title="Check the cover, not the document">
            A 1949 permit and a 1968 permit look almost identical. The convention is printed on the
            front cover. Confirm yours before you fly — an IDP cannot be issued to you once you are
            already in Vietnam on a tourist visa; it has to come from the authority that issued your
            home licence.
          </Callout>

          <p>
            If your permit is the wrong type, you have two realistic routes:{' '}
            <Link href="/guides/vietnamese-driving-licence-da-nang" className="text-[#1AA5D8] hover:underline">
              convert your home licence to a Vietnamese one
            </Link>
            , which is open to foreigners holding a residence card and is the better option
            for anyone staying long-term, or skip self-drive and{' '}
            <Link href="/guides/car-with-driver-da-nang" className="text-[#1AA5D8] hover:underline">
              hire a car with a driver
            </Link>
            .
          </p>
        </Section>

        <Section title="Why rental companies still say no" id="residency">
          <p>
            Even with correct paperwork, expect friction. Many Da Nang rental firms will not release a
            self-drive car to a foreigner who cannot show they live here — a residence card, a work
            permit, a long-term lease. The reasoning is commercial rather than legal: a car that
            leaves the country with its driver is not coming back, and a passport held as security is
            worth far less than the vehicle.
          </p>
          <p>
            This is the single biggest practical difference between renting a motorbike and renting a
            car in Da Nang. A motorbike shop will rent to almost anyone with a passport. A car
            company is risking twenty to forty times the value.
          </p>
        </Section>

        <Section title="What it actually costs" id="cost">
          <DataTable
            headers={['Item', 'Typical range', 'Notes']}
            rows={[
              ['4-seat sedan, per day', '400,000–450,000 VND', 'Cheaper on weekly and monthly terms'],
              ['7-seat, per day', 'From ~450,000 VND', 'Common for family trips to Hoi An and Ba Na'],
              ['Refundable deposit', '5–15 million VND', 'Or an original document held as security'],
              ['Fuel', 'Renter pays', 'Return with the same level you received'],
              ['Peak periods', 'Higher', 'Tet, and the April and September holidays'],
            ]}
          />
          <Callout variant="tip" title="These are market rates, not a quote">
            The figures above are what Da Nang rental companies advertise publicly. Always confirm the
            deposit, the fuel policy and what happens after a scratch before you hand over money —
            those three terms vary far more between companies than the headline daily rate does.
          </Callout>
        </Section>

        <Section title="Self-drive, driver, or neither" id="compare">
          <CompareCards
            items={[
              {
                name: 'Self-drive',
                verdict: 'Residents only, realistically',
                color: 'text-amber-700 bg-amber-50',
                notes:
                  'Cheapest per day and the most freedom, but needs a Vietnamese licence or a 1968 IDP, plus residency to satisfy the rental company. Worth it if you want a car for weeks or months.',
              },
              {
                name: 'Car with driver',
                verdict: 'Best for most visitors',
                color: 'text-green-700 bg-green-50',
                notes:
                  'No licence problem, no deposit drama, no parking. Costs modestly more per day than self-drive once fuel and parking are counted, and the driver knows the routes to Hoi An, Ba Na and Hue.',
              },
              {
                name: 'Grab and taxis',
                verdict: 'Best in the city',
                color: 'text-blue-700 bg-blue-50',
                notes:
                  'Cheaper than any rental for everyday trips inside Da Nang. Falls down on full-day excursions and anything with luggage or an early start.',
              },
            ]}
          />
        </Section>

        <Section title="If you are going ahead" id="steps">
          <StepList
            steps={[
              {
                title: 'Confirm your permit is the 1968 type',
                detail:
                  'Look at the convention printed on the cover of your IDP. If it says 1949, it will not work here regardless of how valid it is elsewhere.',
              },
              {
                title: 'Ask about residency before you shortlist cars',
                detail:
                  'Lead with the question. It saves an afternoon of calls to companies that were never going to rent to you.',
              },
              {
                title: 'Agree the deposit and damage terms in writing',
                detail:
                  'Get the deposit amount, refund timing and the excess for a scratch in writing. This is where disputes happen, not over the daily rate.',
              },
              {
                title: 'Photograph everything at pickup',
                detail:
                  'Every panel, both bumpers, the wheels, the fuel gauge and the odometer, with the timestamp on. Do the same at return.',
              },
              {
                title: 'Check what your insurance actually covers',
                detail:
                  'Confirm your policy covers you driving a rented car in Vietnam, on the licence you hold. If it does not, the rental company insurance is doing all the work.',
              },
            ]}
          />
        </Section>

        <Section title="Driving in Da Nang itself" id="driving">
          <p>
            The good news is that Da Nang is the easiest major Vietnamese city to drive in. Roads are
            wider than Hanoi&apos;s, the traffic moves more calmly than Ho Chi Minh City&apos;s, the
            grid is legible and parking is genuinely findable. The coastal road south to Hoi An and the
            Hai Van Pass north are among the better drives in the country — the{' '}
            <Link href="/guides/day-trips-from-da-nang-by-car" className="text-[#1AA5D8] hover:underline">
              day trips guide
            </Link>{' '}
            covers which ones pair up in a single day and which do not.
          </p>

          <DoDont
            good={[
              'Drive predictably — sudden gaps get filled by motorbikes',
              'Expect bikes from every direction, including against the flow',
              'Use the horn as a short "I am here", the way locals do',
              'Park in a guarded lot and keep the ticket',
              'Plan Hai Van Pass in daylight and dry weather',
            ]}
            bad={[
              'Assuming right of way exists as it does at home',
              'Driving after any alcohol — the limit is effectively zero',
              'Leaving anything visible in a parked car',
              'Taking the pass in fog or heavy rain',
              'Relying on a 1949 IDP because "nobody checks"',
            ]}
          />
        </Section>

        <FAQ items={FAQS} />
      </GuideLayout>
    </>
  )
}
