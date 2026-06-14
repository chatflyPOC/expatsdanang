import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, CompareCards, StepList, DoDont, DataTable, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('visa-options-da-nang')!

export const metadata = guideMetadata('visa-options-da-nang', {
  title: 'Visa Options for Long-Term Stays in Da Nang',
  description:
    'E-visa, tourist visa, business visa or temporary residence card — a clear comparison of every Vietnam visa option for expats in Da Nang, with costs and how to extend.',
})

const FAQS = [
  {
    q: 'Can I extend my e-visa without leaving Vietnam?',
    a: 'The 90-day e-visa is generally single or multiple entry but not designed for in-country extension. In practice, most long-stayers either do a visa run (exit and re-enter) or convert to a sponsored business visa through an agent before it expires.',
  },
  {
    q: 'What is a "visa run" and do I still need one?',
    a: 'A visa run means leaving Vietnam (usually a quick trip to Bangkok, Phnom Penh or Vientiane) and coming back on a fresh visa. Since the 90-day multiple-entry e-visa launched, visa runs are far less common, but they are still used by people on shorter visas or between sponsorships.',
  },
  {
    q: 'Do I need a sponsor for a business visa?',
    a: 'Yes. A business (DN) visa requires a Vietnamese company to sponsor you. If you don\'t have an employer, agents can arrange a sponsoring company for a fee — this is common and legal for the visa itself.',
  },
  {
    q: 'How long can I realistically stay in Da Nang as an expat?',
    a: 'Indefinitely, with planning. Many expats cycle 90-day e-visas or hold a 1-year business visa. For true long-term residence, a Temporary Residence Card (TRC) tied to a work permit, marriage, or investment lets you stay 2–3 years without re-applying.',
  },
  {
    q: 'What happens if I overstay?',
    a: 'Overstaying results in a fine (roughly 500,000 VND per day, negotiated at the airport or immigration office) and can complicate future entries. Never let your visa lapse — start any extension or run at least a week before expiry.',
  },
]

export default function VisaGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Before you apply',
          items: [
            'Passport valid 6+ months',
            'Passport photo (4x6, white background)',
            'Onward/return ticket (sometimes asked)',
            'Address in Da Nang for the form',
            'Credit card for the e-visa fee',
          ],
        }}
      >
        <Lead>
          Vietnam has quietly become one of Southeast Asia&apos;s easier countries to stay in long-term — but
          only if you pick the right visa from the start. The wrong choice means visa runs every month;
          the right one means a year (or more) of not thinking about immigration at all.
        </Lead>
        <Lead>
          This guide breaks down every realistic option for expats in Da Nang, what each actually costs,
          and how to move from a short tourist stay to genuine long-term residence.
        </Lead>

        <KeyTakeaways
          items={[
            'The 90-day multiple-entry e-visa is the default for most expats and digital nomads',
            'Business (DN) visas of 3–12 months need a sponsoring company — agents can arrange this',
            'A Temporary Residence Card (TRC) lets you stay 2–3 years without re-applying',
            'Always act 1+ week before expiry — overstaying brings daily fines',
            'Da Nang Immigration is at 7 Tran Quy Cap; most expats use an agent to avoid the queues',
          ]}
        />

        <Section title="The main visa options, compared">
          <Lead>
            Here are the options that actually matter for someone planning to live in Da Nang, ordered
            roughly from shortest to longest commitment:
          </Lead>
          <CompareCards
            items={[
              {
                name: '90-day e-visa (DL)',
                verdict: 'Best for most',
                color: 'text-green-700 bg-green-50',
                notes: 'Applied for online in ~3 working days. Single or multiple entry. Ideal for digital nomads and anyone testing the waters. Renew by applying again (often with a short exit).',
              },
              {
                name: 'Business visa (DN) 3–12 months',
                verdict: 'For long stays',
                color: 'text-blue-700 bg-blue-50',
                notes: 'Requires a Vietnamese company sponsor. The standard route for staying 6–12 months without visa runs. Agents arrange the sponsor and paperwork for a fee.',
              },
              {
                name: 'Temporary Residence Card (TRC)',
                verdict: 'True residency',
                color: 'text-[#085041] bg-[#E1F5EE]',
                notes: 'A 2–3 year card tied to a work permit, marriage to a Vietnamese citizen, or investment. No re-application during its validity. The goal for committed long-termers.',
              },
              {
                name: 'Tourist visa (paper, at embassy)',
                verdict: 'Mostly replaced',
                color: 'text-amber-700 bg-amber-50',
                notes: 'Largely superseded by the e-visa. Only worth it for nationalities not eligible for the e-visa, or specific multi-entry needs.',
              },
              {
                name: 'Visa exemption (some nationalities)',
                verdict: 'Short stays only',
                color: 'text-gray-600 bg-gray-100',
                notes: 'Citizens of certain countries get 15–45 days visa-free. Fine for a first scouting trip, useless for living here.',
              },
            ]}
          />
        </Section>

        <Section title="Rough costs (2025)">
          <DataTable
            headers={['Option', 'Typical cost', 'Validity', 'Notes']}
            rows={[
              ['E-visa (official)', '$25–55 USD', '90 days', 'Single vs multiple entry'],
              ['E-visa via agent', '$50–90 USD', '90 days', 'They handle the form & follow-up'],
              ['Business visa 3 months', '$150–250 USD', '3 months', 'Includes sponsor fee'],
              ['Business visa 1 year', '$500–700 USD', '12 months', 'Multiple entry, sponsor included'],
              ['TRC (with work permit)', '$300+ USD', '2–3 years', 'Plus work-permit costs'],
            ]}
          />
          <p className="text-xs text-gray-400 mt-3">
            Prices vary by agent, nationality and season. Always confirm the current official fee before paying an agent markup.
          </p>
        </Section>

        <Section title="How to apply for the e-visa (the DIY route)">
          <StepList
            steps={[
              { title: 'Use only the official portal', detail: 'Apply at evisa.xuatnhapcanh.gov.vn (the official government site). Many lookalike sites charge extra for the same thing — bookmark the real one.' },
              { title: 'Prepare a photo and passport scan', detail: 'You need a passport data-page scan and a passport-style photo with a white background, both as clear image files under the size limit.' },
              { title: 'Choose single or multiple entry', detail: 'If you plan any trips out of Vietnam (or a future visa run), pick multiple entry — it costs a little more but saves a re-application.' },
              { title: 'Pay and wait ~3 working days', detail: 'Pay by card. You\'ll receive a reference code, then the approved e-visa PDF by email. Print two copies.' },
              { title: 'Show the printout on arrival', detail: 'Present the printed e-visa with your passport at immigration. Keep a digital copy on your phone too.' },
            ]}
          />
        </Section>

        <Section title="Moving from short-term to long-term">
          <Lead>
            Most expats follow a predictable path: arrive on an e-visa or visa exemption, decide they want
            to stay, then convert to something longer. The cleanest sequence is:
          </Lead>
          <StepList
            steps={[
              { title: 'Land on a 90-day e-visa', detail: 'Gives you three months to find housing, open a bank account and decide if Da Nang is for you.' },
              { title: 'Engage a reputable visa agent', detail: 'Around 3–4 weeks before expiry, talk to an agent about a 6 or 12-month business visa. They\'ll need a passport scan and your current visa.' },
              { title: 'Decide on a TRC if you\'re committed', detail: 'If you have a job, a Vietnamese spouse, or an investment, a TRC removes the renewal treadmill entirely for 2–3 years.' },
            ]}
          />
        </Section>

        <Callout variant="warning" title="Rules change — and agents vary">
          Vietnamese visa policy shifts regularly, and different agents quote wildly different prices for
          identical services. Always confirm the current official fee, get the full price in writing, and
          never hand your passport to an agent you can&apos;t verify. When in doubt, ask us who locals actually use.
        </Callout>

        <Section title="Do / don't">
          <DoDont
            good={[
              'Apply on the official government e-visa site',
              'Pick multiple-entry if you might travel',
              'Start renewals 1–3 weeks early',
              'Keep printed + digital copies of everything',
              'Use an agent other expats vouch for',
            ]}
            bad={[
              'Booking through a lookalike "e-visa" site',
              'Letting a visa lapse to "save" a few days',
              'Paying an agent before seeing written terms',
              'Assuming last year\'s rules still apply',
              'Handing your passport to an unknown middleman',
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
