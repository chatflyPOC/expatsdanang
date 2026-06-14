import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, CompareCards, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('healthcare-da-nang')!

export const metadata = guideMetadata('healthcare-da-nang', {
  title: 'Healthcare in Da Nang: Hospitals, Clinics & Insurance',
  description:
    'A practical guide to healthcare in Da Nang for expats — which hospitals and clinics to use, finding English-speaking doctors, pharmacies, and the health insurance you actually need.',
})

const FAQS = [
  {
    q: 'Where do expats go when they get sick?',
    a: 'For everyday issues, most expats use an international clinic like Family Medical Practice, where doctors speak English. For anything serious or requiring hospitalisation, private hospitals such as Vinmec, or the larger public hospitals, are the usual choice. For minor things, well-stocked pharmacies can advise and sell most medicines over the counter.',
  },
  {
    q: 'Is healthcare in Da Nang good?',
    a: 'For routine and moderate care, yes — international clinics and private hospitals offer solid, affordable treatment. For complex or critical conditions, some expats prefer to travel to Bangkok or Singapore, which is exactly why good insurance with medical evacuation matters.',
  },
  {
    q: 'Do I need health insurance?',
    a: 'Yes. Care is affordable by western standards but a serious accident, surgery or evacuation can cost thousands. At minimum carry travel insurance that covers Vietnam and motorbike use; for longer stays, an international health policy is worth it.',
  },
  {
    q: 'Can I just buy medication at a pharmacy?',
    a: 'Many medicines that need a prescription back home are available over the counter in Vietnam, and pharmacists often speak some English. Bring the generic (not brand) name of anything you take regularly. For controlled or specialist drugs, see a doctor first.',
  },
  {
    q: 'What do I do in an emergency?',
    a: 'For an ambulance, call 115. In practice, for many situations a Grab or taxi straight to a hospital is faster than waiting for an ambulance — know the name and address of your nearest hospital in Vietnamese in advance. Keep your insurance details and a translated note of any conditions or allergies on your phone.',
  },
]

export default function HealthcareGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Health prep checklist',
          items: [
            'Insurance that covers Vietnam + bikes',
            'Nearest hospital saved (in Vietnamese)',
            'Generic names of your medications',
            'Translated note of allergies/conditions',
            'A small first-aid kit at home',
            'Emergency number 115 saved',
          ],
        }}
      >
        <Lead>
          Healthcare is one of the things new arrivals worry about most — and one that turns out to be more
          manageable than expected. Da Nang has English-speaking clinics, modern private hospitals, and
          affordable everyday care. The key is knowing where to go before you need it.
        </Lead>

        <Callout variant="info" title="A quick note">
          This is general, practical information for getting oriented — not medical advice. For any health
          concern, see a qualified doctor. In an emergency, go to the nearest hospital or call 115.
        </Callout>

        <KeyTakeaways
          items={[
            'International clinics (e.g. Family Medical Practice) are the go-to for English-speaking everyday care',
            'Private hospitals like Vinmec handle more serious treatment and hospitalisation',
            'Pharmacies are widespread and sell most medicines over the counter',
            'Carry insurance that covers Vietnam, motorbike use, and medical evacuation',
            'For emergencies, a taxi to hospital is often faster than an ambulance — know your nearest one',
          ]}
        />

        <Section title="Where to go for what">
          <CompareCards
            items={[
              {
                name: 'International clinics',
                verdict: 'Everyday care',
                color: 'text-[#085041] bg-[#E1F5EE]',
                notes: 'Clinics like Family Medical Practice (FMP) are built for expats — English-speaking doctors, international standards, vaccinations, check-ups and minor treatment. Your first stop for most non-emergencies. Pricier than public hospitals but easy and reassuring.',
              },
              {
                name: 'Private hospitals',
                verdict: 'Serious & inpatient',
                color: 'text-blue-700 bg-blue-50',
                notes: 'Modern private hospitals such as Vinmec offer surgery, specialists, maternity and hospitalisation with some English support and shorter waits. The usual choice when you need more than a clinic can provide.',
              },
              {
                name: 'Public hospitals',
                verdict: 'Affordable & capable',
                color: 'text-amber-700 bg-amber-50',
                notes: 'Large public hospitals (Da Nang General, Hospital C) handle everything including emergencies and are very cheap, but are busy and English is limited. Best with a Vietnamese-speaking friend or translator alongside you.',
              },
              {
                name: 'Pharmacies',
                verdict: 'Minor issues',
                color: 'text-purple-700 bg-purple-50',
                notes: 'On nearly every block. Pharmacists can advise on minor ailments and sell most medicines without a prescription. Bring the generic drug name. Great for colds, stomach upsets, and refills.',
              },
              {
                name: 'Dental clinics',
                verdict: 'Quality & value',
                color: 'text-green-700 bg-green-50',
                notes: 'Da Nang has excellent, affordable dentistry — many expats actually get dental work done here on purpose. Modern international dental clinics offer cleanings, fillings and implants at a fraction of western prices.',
              },
            ]}
          />
        </Section>

        <Section title="Roughly what it costs">
          <DataTable
            headers={['Service', 'Typical cost', 'Notes']}
            rows={[
              ['Pharmacy consult + meds', '$3–15', 'Minor ailments'],
              ['Public hospital visit', '$5–20', 'Cheap, busy, limited English'],
              ['International clinic visit', '$40–90', 'English-speaking'],
              ['Dental cleaning', '$25–40', 'International clinic'],
              ['Travel insurance', '$40–80 / mo', 'Short stays'],
              ['International health policy', '$80–200+ / mo', 'Long-term, evacuation'],
            ]}
          />
        </Section>

        <Section title="Health insurance: what you actually need">
          <Lead>
            Three broad options, depending on how long you&apos;re staying and your risk appetite:
          </Lead>
          <CompareCards
            items={[
              {
                name: 'Travel insurance',
                verdict: 'Short stays',
                color: 'text-amber-700 bg-amber-50',
                notes: 'Cheapest and fine for trips of a few weeks to months. Crucial: confirm it covers Vietnam AND riding a motorbike (many exclude bikes, or require a licence). Good for emergencies, not routine care.',
              },
              {
                name: 'International health insurance',
                verdict: 'Long-term',
                color: 'text-[#085041] bg-[#E1F5EE]',
                notes: 'The right choice if you\'re living here. Covers routine care, hospitalisation and — importantly — medical evacuation to Bangkok or Singapore for serious cases. More expensive but genuine peace of mind.',
              },
              {
                name: 'Local Vietnamese insurance',
                verdict: 'Budget option',
                color: 'text-blue-700 bg-blue-50',
                notes: 'Cheaper local policies exist and work within Vietnam\'s hospital network. Good value for in-country care, but usually no overseas evacuation — often paired with a small travel policy for that gap.',
              },
            ]}
          />
        </Section>

        <Callout variant="warning" title="Check the motorbike clause">
          The most common insurance shock for expats: a policy that won&apos;t pay for a motorbike accident
          because you weren&apos;t licensed, or because bikes are excluded entirely. If you&apos;ll ride at
          all, read that clause carefully before you buy — it&apos;s the single most likely claim you&apos;ll make.
        </Callout>

        <Section title="Do / don't">
          <DoDont
            good={[
              'Sort insurance before you arrive',
              'Save your nearest hospital in Vietnamese',
              'Keep generic drug names handy',
              'Use international clinics for English care',
              'Carry allergy/condition info on your phone',
            ]}
            bad={[
              'Assuming travel insurance covers bikes',
              'Waiting until you\'re sick to find a clinic',
              'Relying on an ambulance in every emergency',
              'Bringing only brand drug names',
              'Skipping cover because "care is cheap"',
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
