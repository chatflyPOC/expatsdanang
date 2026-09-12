import Link from 'next/link'
import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, StepList, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('vietnamese-driving-licence-da-nang')!

export const metadata = guideMetadata('vietnamese-driving-licence-da-nang', {
  title: 'Vietnamese Driving Licence in Da Nang: Conversion Guide',
  description:
    'Convert your foreign driving licence to a Vietnamese one in Da Nang — no test required. Eligibility, documents, sworn translation, medical certificate, cost and timeline.',
})

const FAQS = [
  {
    q: 'Do I have to take a driving test to get a Vietnamese licence?',
    a: 'Not if you are converting a valid foreign licence. Conversion is a documents process — you submit a dossier with a sworn translation of your licence and a medical certificate, and no theory or practical test is required. Taking a Vietnamese test from scratch is a different, longer route, needed only if you have no licence to convert.',
  },
  {
    q: 'Can I convert my International Driving Permit?',
    a: 'No. An IDP is not a licence in its own right and cannot be converted — it only accompanies your home licence. You convert the underlying national licence. Expired, badly damaged or unofficially issued licences are also ineligible.',
  },
  {
    q: 'How long do I need to have lived in Vietnam?',
    a: 'The usual threshold is three months of residence, evidenced by a residence permit, temporary residence card, or a diplomatic or official-duty identity card. Tourists on a short visa generally cannot convert, which is the main reason visitors end up hiring a driver instead.',
  },
  {
    q: 'What does conversion cost and how long does it take?',
    a: 'Budget roughly 500,000 to 1,100,000 VND all-in, covering the fee, the sworn translation and the medical certificate. Processing is commonly quoted at about eight working days — around three for the dossier to be accepted and five for the licence to be printed — though queues vary.',
  },
  {
    q: 'Does a Vietnamese licence cover motorbikes as well as cars?',
    a: 'Only the classes your original licence covers. A car licence converts to a car class; if you also want to ride a motorbike above 50cc legally, your home licence needs to cover motorcycles too, or you take the Vietnamese motorcycle test separately.',
  },
  {
    q: 'Is the licence worth getting if I am only here a year?',
    a: 'For most residents, yes. It removes the IDP convention problem permanently, it is accepted by rental companies that refuse foreign paperwork, and it is the single document that makes an insurance claim after an accident straightforward rather than arguable.',
  },
]

export default function VietnameseDrivingLicenceGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Dossier checklist',
          items: [
            'Original foreign licence, valid and undamaged',
            'Sworn Vietnamese translation, stamped',
            'Passport with visa or residence card',
            'Medical certificate from an approved clinic',
            'Passport photos to the requested size',
            'Proof of 3+ months residence',
          ],
        }}
      >
        <Lead>
          Converting a foreign driving licence to a Vietnamese one takes no test. It is a
          documents process: a dossier, a sworn translation of your licence, a medical
          certificate, and roughly 500,000–1,100,000 VND. The catch is eligibility — you
          generally need three months of residence and a residence permit, which is why
          tourists cannot do it and residents should.
        </Lead>

        <KeyTakeaways
          items={[
            'No theory or practical test when converting a valid national licence.',
            'You need about three months of residence plus a residence card or equivalent.',
            'An International Driving Permit cannot be converted — only your home licence can.',
            'Budget 500,000–1,100,000 VND and roughly eight working days.',
            'The licence solves the 1968-versus-1949 IDP problem permanently.',
          ]}
        />

        <Section title="Why bother, if you already have an IDP" id="why">
          <p>
            Because a large share of IDPs do not work here. Vietnam recognises permits
            issued under the 1968 Vienna Convention; the 1949 Geneva Convention permits
            carried by most American, Canadian, Australian and Japanese drivers are not
            recognised, however genuine they are. Our{' '}
            <Link href="/guides/self-drive-car-rental-da-nang" className="text-[#1AA5D8] hover:underline">
              self-drive car rental guide
            </Link>{' '}
            covers that rule in detail.
          </p>
          <p>
            A Vietnamese licence ends the argument. It is also the document rental
            companies trust most — several will hand over a car to a resident with a local
            licence who would be refused on foreign paperwork alone.
          </p>
        </Section>

        <Section title="Who can convert" id="eligibility">
          <DataTable
            headers={['Requirement', 'Detail']}
            rows={[
              ['Residence', 'Around three months in Vietnam, evidenced on paper'],
              ['Status document', 'Residence permit, TRC, or diplomatic / official-duty ID'],
              ['Licence', 'Valid national licence, not expired, not badly damaged'],
              ['Issuer', 'Issued by the proper authority in your home country'],
              ['Not eligible', 'International Driving Permits; temporary or provisional licences'],
            ]}
          />
          <Callout variant="warning" title="An IDP is not a convertible licence">
            This trips people up constantly. The IDP is a translation booklet that only has
            force alongside your national licence — there is nothing in it to convert. If
            your national licence is at home in a drawer, you cannot start this process.
          </Callout>
        </Section>

        <Section title="The process, step by step" id="process">
          <StepList
            steps={[
              {
                title: 'Get a sworn translation of your licence',
                detail:
                  'It must be translated into Vietnamese by a notary or an authorised translation office, stamped, and attached to a copy of the original. This is the step most commonly done wrong — an informal translation will be rejected.',
              },
              {
                title: 'Get a medical certificate',
                detail:
                  'From a clinic authorised to issue them for driving purposes. It is a short examination covering eyesight and general fitness, not a serious hurdle, but it must be recent.',
              },
              {
                title: 'Assemble the dossier',
                detail:
                  'Original licence, stamped translation, passport with visa or residence card, proof of residence, medical certificate and photos. Bring originals as well as copies.',
              },
              {
                title: 'Submit at the provincial traffic police office',
                detail:
                  'In Da Nang this is the provincial Phòng Cảnh sát giao thông. Going in person with a Vietnamese speaker is far smoother than going alone.',
              },
              {
                title: 'Collect the licence',
                detail:
                  'Commonly quoted at around eight working days in total. You keep your foreign licence — conversion does not surrender it.',
              },
            ]}
          />
        </Section>

        <Section title="Cost and timing" id="cost">
          <DataTable
            headers={['Item', 'Typical range']}
            rows={[
              ['Official conversion fee', 'Modest — the smaller part of the total'],
              ['Sworn translation', 'Varies by office and language'],
              ['Medical certificate', 'Low, typically same-day'],
              ['All-in', '≈ 500,000–1,100,000 VND'],
              ['Processing', '≈ 8 working days'],
            ]}
          />
          <Callout variant="tip" title="Where the time actually goes">
            The eight days is processing, not your effort. The translation and the medical
            certificate can usually be done in one morning if you know where to go; the
            queue at the traffic police office is the variable.
          </Callout>
        </Section>

        <Section title="What goes wrong" id="mistakes">
          <DoDont
            good={[
              'Translate at a notary or authorised office, with the stamp',
              'Check your licence expiry before starting anything',
              'Bring originals and copies of everything',
              'Take a Vietnamese speaker to the office',
              'Confirm which classes your home licence actually covers',
            ]}
            bad={[
              'Trying to convert an IDP',
              'Using an informal or app translation',
              'Assuming a car licence also covers motorbikes',
              'Starting the process on a tourist visa',
              'Leaving it until the week you need to drive',
            ]}
          />
          <p>
            If the paperwork side is the part you would rather not handle, our{' '}
            <Link href="/services/visa-documents" className="text-[#1AA5D8] hover:underline">
              documents service
            </Link>{' '}
            deals with sworn translation and dossier preparation as a matter of routine.
          </p>
        </Section>

        <FAQ items={FAQS} />
      </GuideLayout>
    </>
  )
}
