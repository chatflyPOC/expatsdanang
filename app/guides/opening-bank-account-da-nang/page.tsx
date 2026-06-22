import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, CompareCards, StepList, DoDont, CheckList, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('opening-bank-account-da-nang')!

export const metadata = guideMetadata('opening-bank-account-da-nang', {
  title: 'How to Open a Bank Account in Da Nang as a Foreigner',
  description: 'Step-by-step guide to opening a Vietnamese bank account in Da Nang — which bank to choose, exact documents needed, and how to avoid common rejections.',
})

const FAQS = [
  { q: 'Can I open an account on a tourist visa?', a: 'Sometimes yes, but it depends on the bank and branch. Techcombank and VPBank are the most likely to accept a tourist e-visa. A 3-month+ visa significantly increases your chances.' },
  { q: 'Do I need a Vietnamese address?', a: 'Most banks require proof of where you are staying in Da Nang. A signed lease, hotel booking, or TRC all work. Some branches accept a signed letter from your landlord.' },
  { q: 'How long does it take?', a: 'If you have all documents, the entire process takes about 30–60 minutes. The debit card is sometimes issued immediately, or mailed within 3–5 business days.' },
  { q: 'Can I open a USD account?', a: 'Yes — most major banks offer foreign currency accounts (USD, EUR). Ask specifically for a "ngoại tệ" (foreign currency) account. These have slightly different requirements.' },
  { q: 'What if I do not speak Vietnamese?', a: 'Most Techcombank branches in Da Nang have at least one English-speaking staff member. You can also bring a Vietnamese-speaking friend, or we can accompany you to the appointment.' },
]

export default function BankAccountGuidePage() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Pre-visit checklist',
          items: [
            'Original passport',
            'Current visa (3+ months left)',
            'Vietnamese SIM card',
            'Address proof (lease / TRC)',
            '500,000 VND cash for deposit',
            'Go on a weekday morning',
          ],
        }}
      >
        <Lead>
          Opening a bank account in Vietnam as a foreigner is completely doable — but it is not as simple
          as walking in with your passport. Banks have different rules, staff often do not speak English,
          and the required documents vary depending on your visa type and which branch you visit.
        </Lead>
        <Lead>
          This guide covers exactly what to bring, which banks are most foreigner-friendly in Da Nang,
          and the mistakes that get people rejected on the first visit.
        </Lead>

        <KeyTakeaways
          title="TL;DR — what you need"
          items={[
            'Valid passport (original)',
            'Vietnamese visa or entry stamp (minimum 3 months remaining recommended)',
            'Temporary residence registration (TRC) — or your hotel address in some cases',
            'Vietnamese phone number (SIM)',
            '200,000–500,000 VND minimum deposit (varies by bank)',
          ]}
        />

        <Section title="Which bank should you choose?">
          <Lead>
            Not all Vietnamese banks are equally foreigner-friendly. Based on experience with hundreds
            of expats in Da Nang, these are the most reliable options:
          </Lead>
          <CompareCards
            items={[
              {
                name: 'Techcombank',
                verdict: 'Best overall',
                color: 'text-green-700 bg-green-50',
                notes: 'English-language app, international transfers, foreigner-friendly staff at most branches. Most expats use this.',
              },
              {
                name: 'VPBank',
                verdict: 'Good alternative',
                color: 'text-blue-700 bg-blue-50',
                notes: 'Decent English support, easier to open without TRC. Good for shorter-stay expats.',
              },
              {
                name: 'BIDV',
                verdict: 'For longer stays',
                color: 'text-amber-700 bg-amber-50',
                notes: 'State-owned bank, more paperwork but widely accepted for salary payments and property deposits.',
              },
              {
                name: 'Vietcombank',
                verdict: 'Not recommended for foreigners',
                color: 'text-red-600 bg-red-50',
                notes: 'Strictest requirements, minimal English support at branch level. Many foreigners get rejected.',
              },
            ]}
          />
        </Section>

        <Section title="Step-by-step: how to open the account">
          <StepList
            steps={[
              {
                title: 'Get a Vietnamese SIM card first',
                detail: 'You need a local phone number to register the account. Pick up a Viettel or Vinaphone SIM at any phone shop — bring your passport. Takes 10 minutes and costs around 50,000 VND.',
              },
              {
                title: 'Have your passport and visa ready',
                detail: 'Bring your original passport — not a photocopy. Make sure your visa or entry stamp is current. Banks will photocopy everything.',
              },
              {
                title: 'Prepare your address documentation',
                detail: 'If you have a TRC (temporary residence card issued by your landlord), bring it. If not, some banks accept a hotel confirmation or lease agreement showing your Da Nang address. Techcombank is most flexible on this.',
              },
              {
                title: 'Visit the branch — not peak hours',
                detail: 'Go on a weekday morning (9–11am). Avoid lunch hours (11:30am–1:30pm) and Saturdays. Ask for a staff member who speaks English — most branches have at least one.',
              },
              {
                title: 'Fill in the forms and make the minimum deposit',
                detail: 'You will fill out a standard account opening form. Deposit 200,000–500,000 VND (approximately $10–20 USD) to activate the account. You get a debit card on the spot or within 3–5 days.',
              },
              {
                title: 'Set up mobile banking',
                detail: "Ask the teller to help you set up the mobile app before you leave. Techcombank's app is available in English. Enable internet banking — you will need it for transfers.",
              },
            ]}
          />
        </Section>

        <Section title="Common reasons foreigners get rejected">
          <DoDont
            good={[
              'Visa with 3+ months remaining',
              'Original passport + clear copies',
              'Vietnamese SIM already active',
              'Starting with Techcombank or VPBank',
              'Weekday morning visit',
              'Lease or TRC showing Da Nang address',
            ]}
            bad={[
              'Visa with less than 1 month remaining',
              'Bringing a photocopy of passport instead of original',
              'No Vietnamese phone number yet',
              'Visiting Vietcombank or Agribank first',
              'Going on a Saturday afternoon',
              'No address proof at all',
            ]}
            goodTitle="What works"
            badTitle="Common mistakes"
          />
        </Section>

        <Section title="What about receiving international transfers?">
          <Lead>
            Vietnamese bank accounts can receive international transfers (USD, EUR, GBP etc.) but there
            are a few things to know:
          </Lead>
          <CheckList
            items={[
              "Incoming transfers are converted to VND at the bank's exchange rate — not always the best rate.",
              'You will need your SWIFT code and branch address for the sender.',
              'Large transfers (over $10,000 USD) may require a declaration form.',
              'Wise (formerly TransferWise) is a popular alternative for receiving money in foreign currency — many expats use both.',
            ]}
          />
        </Section>

        <Callout variant="warning" title="Rules change — verify before you go">
          Vietnamese banking requirements for foreigners can change without notice. Branch-level staff
          sometimes have different interpretations of the rules. If you are rejected once, try a
          different branch or bank before assuming it is impossible.
        </Callout>

        <Section title="Frequently asked questions">
          <FAQ items={FAQS} />
        </Section>
      </GuideLayout>
    </>
  )
}
