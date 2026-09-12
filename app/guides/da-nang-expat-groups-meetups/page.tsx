import Link from 'next/link'
import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, CompareCards, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('da-nang-expat-groups-meetups')!

export const metadata = guideMetadata('da-nang-expat-groups-meetups', {
  title: 'Da Nang Expat Groups & Meetups: Which Are Worth Joining',
  description:
    'A field guide to Da Nang expat Facebook groups, Meetup circles, paid communities and special-interest groups — what each is genuinely useful for, and which to skip.',
})

const FAQS = [
  {
    q: 'Which Da Nang expat Facebook group should I join first?',
    a: 'Start with the largest general group — "Expats in Da Nang City" — for day-to-day questions and classifieds. Add a niche group once you know what you actually need: housing, riding, parents, or women-only. One big group plus one niche group covers most people; joining fifteen just makes the feed unusable.',
  },
  {
    q: 'Are the paid Da Nang expat communities worth the money?',
    a: 'They buy you curation and a smaller room, not information you cannot find free. If you value a vetted answer over sifting a busy feed, or you are arriving cold and want a warm introduction, they can be worth a month or two. Most people cancel once they have their own circle.',
  },
  {
    q: 'How do I find meetups that actually happen?',
    a: 'Check the last event date, not the member count. Groups that ran an event in the past fortnight are live; groups with 8,000 members and nothing since last year are archives. Meetup.com is more reliable than Facebook for this because it shows the schedule up front.',
  },
  {
    q: 'Is there a women-only expat group in Da Nang?',
    a: 'Yes, and it is substantial — reported at over 2,000 members. It functions as both a general support group and a safer space for questions people are reluctant to ask in a mixed forum. Worth joining even if you are already in the big general groups.',
  },
  {
    q: 'Do I need Vietnamese to take part?',
    a: 'Not for expat groups, which run in English. It changes what you get out of local community life, though — Vietnamese neighbours, sports teams and hobby clubs are a different and often better social layer than the expat circuit, and even basic Vietnamese opens them.',
  },
  {
    q: 'How small is the Da Nang expat scene really?',
    a: 'Small enough that the same faces recur across unrelated events, which cuts both ways. Building a circle is fast because everyone overlaps; reputations also travel, so a bad rental dispute or an unpaid debt tends to be known.',
  },
]

export default function ExpatGroupsGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'Before you join everything',
          items: [
            'One big general group, not five',
            'Check the last event date, not member count',
            'Add one niche group matching a real interest',
            'Mute notifications on the busy ones',
            'Read the pinned rules before posting',
            'Search the group before asking',
          ],
        }}
      >
        <Lead>
          Da Nang has more expat groups than it has distinct social scenes. The useful set
          is small: one large general Facebook group for day-to-day questions, one or two
          meetup circles that genuinely still run events, and a niche group matching
          something you actually do. Everything past that is feed noise.
        </Lead>

        <KeyTakeaways
          items={[
            'One general group plus one niche group covers most people.',
            'Judge a group by its last event date, not its member count.',
            'Meetup.com shows schedules up front; Facebook hides dead groups behind big numbers.',
            'Paid communities sell curation, not exclusive information.',
            'The scene is small enough that the same people recur — which speeds things up and makes reputation matter.',
          ]}
        />

        <Section title="The four kinds of group" id="types">
          <CompareCards
            items={[
              {
                name: 'Large general Facebook groups',
                verdict: 'Join one',
                color: 'text-green-700 bg-green-50',
                notes:
                  'Best for practical questions, classifieds and recommendations, answered within hours. Worst for depth — the same questions recycle weekly and the tone can be blunt. Search before posting and you will find most answers already there.',
              },
              {
                name: 'Meetup circles',
                verdict: 'Best for actually meeting people',
                color: 'text-green-700 bg-green-50',
                notes:
                  'Groups like International Friends Da Nang run scheduled in-person meetups in cafés, parks and on the beach, often fortnightly or monthly, sometimes with online sessions between. The schedule is public, which is exactly why they are more reliable than Facebook events.',
              },
              {
                name: 'Paid communities',
                verdict: 'Optional',
                color: 'text-amber-700 bg-amber-50',
                notes:
                  'Subscription groups bundle arrival help — visas, apartments, local contacts — with monthly meetups. You are paying for a smaller, curated room. Useful when arriving cold; most people stop once their own network exists.',
              },
              {
                name: 'Special-interest groups',
                verdict: 'Where friendships come from',
                color: 'text-blue-700 bg-blue-50',
                notes:
                  'Women-only groups, riding communities, sports teams, parent circles, remote-work collectives. Narrower and quieter, but shared activity produces real friendships far faster than a general forum ever does.',
              },
            ]}
          />
        </Section>

        <Section title="Reading a group before you join it" id="vetting">
          <p>
            Member count is the least useful number on the page. A group with 20,000
            members and no post since last year is an archive; a group of 400 that met last
            Thursday is a community. Two minutes of checking saves months of dead feed.
          </p>

          <DataTable
            headers={['Signal', 'What it tells you']}
            rows={[
              ['Date of the last event', 'Whether the group is alive at all'],
              ['Posts in the last week', 'Whether anyone is actually reading'],
              ['Who answers questions', 'A handful of regulars means a real core'],
              ['Pinned rules and FAQ', 'Someone is moderating; quality will be higher'],
              ['Ratio of ads to conversation', 'Above roughly half, it is a marketplace, not a community'],
            ]}
          />

          <Callout variant="tip" title="Check the archive before you post">
            Almost every newcomer question has been asked and answered in the big groups
            within the last month. Searching first gets you a better answer immediately, and
            it is the difference between being welcomed and being the fifth person this week
            to ask about visa runs.
          </Callout>
        </Section>

        <Section title="Where the expat circuit runs out" id="limits">
          <p>
            Expat groups are a bridge, not a destination. They are excellent for the first
            few months — finding a flat, a mechanic, a doctor, a dinner — and they plateau
            after that, because everyone in them is also transient. People leave. The friend
            you made in March is in Chiang Mai by November.
          </p>
          <p>
            The people who settle well tend to build a second layer alongside the expat one:
            a Vietnamese sports team, a class, neighbours, a hobby that is not expat-specific.
            It is slower and needs some language, but it does not evaporate every dry season.
          </p>
        </Section>

        <Section title="Group etiquette that keeps you welcome" id="etiquette">
          <DoDont
            good={[
              'Search the group before asking',
              'Ask specific questions — budget, area, timeframe',
              'Report back what worked; it is how groups stay useful',
              'Recommend the person who actually helped you',
              'Keep disputes out of the feed and in DMs',
            ]}
            bad={[
              'Posting "moving to Da Nang, any tips?" with no detail',
              'Asking for a visa-run workaround in a public group',
              'Naming and shaming a landlord before talking to them',
              'Promoting a business in a no-ads group',
              'Joining twelve groups and muting all of them',
            ]}
          />
          <p>
            For the wider picture of what daily life here actually looks like — sports, food,
            the social calendar — the{' '}
            <Link href="/guides/expat-life-da-nang" className="text-[#1AA5D8] hover:underline">
              expat life guide
            </Link>{' '}
            covers it, and{' '}
            <Link href="/guides/making-friends-in-da-nang" className="text-[#1AA5D8] hover:underline">
              making friends in Da Nang
            </Link>{' '}
            deals with the first ninety days specifically.
          </p>
        </Section>

        <FAQ items={FAQS} />
      </GuideLayout>
    </>
  )
}
