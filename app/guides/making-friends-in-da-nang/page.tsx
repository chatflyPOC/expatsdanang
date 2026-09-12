import Link from 'next/link'
import { getGuide } from '@/lib/guides'
import { guideMetadata } from '@/lib/seo'
import { GuideLayout, FaqJsonLd } from '@/components/guide/GuideLayout'
import {
  Section, Lead, KeyTakeaways, StepList, DataTable, DoDont, Callout, FAQ,
} from '@/components/guide/parts'

const meta = getGuide('making-friends-in-da-nang')!

export const metadata = guideMetadata('making-friends-in-da-nang', {
  title: 'Making Friends in Da Nang: A Realistic First 90 Days',
  description:
    'Why some newcomers build a circle in a month and others leave lonely after a year in Da Nang — the sequence that works, the habits that quietly prevent it, and what to expect by week.',
})

const FAQS = [
  {
    q: 'How long does it take to make friends in Da Nang?',
    a: 'Acquaintances come fast — often within the first fortnight, because the scene is small and newcomers are common. Actual friendships take roughly two to three months, and they almost always come from repeated contact through an activity rather than from one-off social events.',
  },
  {
    q: 'Is it harder to make friends if I am not a digital nomad?',
    a: 'Different, not harder. The nomad circuit is the most visible layer because it clusters in coworking spaces and cafés, but it is also the most transient. People on longer timelines — teachers, business owners, retirees, families — form slower and considerably more durable circles.',
  },
  {
    q: 'Where do people actually meet each other?',
    a: 'Repeat-attendance settings, overwhelmingly: a gym or sports team, a class, a coworking space, a regular meetup, a neighbourhood café. One-off events produce contacts; recurring ones produce friends. The difference is simply how many times the same faces appear.',
  },
  {
    q: 'Should I live in An Thuong to meet people?',
    a: 'It is the easiest starting point — highest density of expats, cafés and walkable nightlife, so the least effort for the most contact. The trade is that it is also the least Vietnamese part of the city and the most expensive per square metre. Many people start there and move once they have a circle.',
  },
  {
    q: 'What if I am older, or here with a family?',
    a: 'Skip the nomad circuit and go straight to activity-based groups — sports clubs, parent circles, language classes, volunteering. The general expat groups skew young and short-stay, which is why people over forty often report the scene feeling thin until they find the layer that matches them.',
  },
  {
    q: 'Do I need Vietnamese to have a social life?',
    a: 'No, and that is the trap. An entirely English-speaking life is completely possible here, which is why many people never learn any — and then find their circle is made only of people who also leave. Even basic Vietnamese opens neighbours, teams and clubs that do not rotate out every six months.',
  },
]

export default function MakingFriendsGuide() {
  return (
    <>
      <FaqJsonLd items={FAQS} />
      <GuideLayout
        meta={meta}
        checklist={{
          title: 'First month, practically',
          items: [
            'Pick one recurring activity and commit to it',
            'Join one general group, one niche group',
            'Say yes to everything for the first three weeks',
            'Learn ten words of Vietnamese',
            'Get a regular café, gym or coworking spot',
            'Follow up within 48 hours or the contact dies',
          ],
        }}
      >
        <Lead>
          Meeting people in Da Nang is easy; keeping a circle is the hard part. Acquaintances
          arrive within a fortnight because the scene is small and everyone was new
          recently. Real friendships take two to three months and come almost entirely from
          repeated contact through one activity — not from the events people assume they
          should be attending.
        </Lead>

        <KeyTakeaways
          items={[
            'Acquaintances in two weeks; friendships in two to three months.',
            'Recurring activities produce friends. One-off events produce contacts.',
            'The expat circuit rotates constantly — build a second, non-expat layer early.',
            'Following up within 48 hours is the single highest-leverage habit.',
            'An entirely English-speaking life is possible here, and that is the trap.',
          ]}
        />

        <Section title="What the first 90 days actually look like" id="timeline">
          <StepList
            steps={[
              {
                title: 'Weeks 1–2 — say yes to everything',
                detail:
                  'Volume matters at this stage, not selectivity. Go to the meetups, accept the coffee, join the group ride. You are mapping the scene and finding which layer fits, and you cannot do that from a shortlist.',
              },
              {
                title: 'Weeks 3–4 — pick one recurring thing',
                detail:
                  'A gym, a team, a class, a coworking desk, a weekly meetup. One is enough. This is the single decision that determines whether you have friends by month three, because it is the only mechanism that puts the same faces in front of you repeatedly.',
              },
              {
                title: 'Weeks 5–8 — start initiating',
                detail:
                  'The shift from being invited to inviting. Most newcomers stall here and quietly wonder why nothing deepened. Suggest the second coffee. Organise the thing. Nobody minds, and almost nobody else is doing it.',
              },
              {
                title: 'Weeks 9–12 — build the second layer',
                detail:
                  'By now the expat layer is working, and you will have watched at least one person you liked leave. Add something that does not rotate: Vietnamese classes, a local team, neighbours, volunteering. This is what stops the circle resetting every dry season.',
              },
            ]}
          />
        </Section>

        <Section title="Where people actually meet" id="where">
          <DataTable
            headers={['Setting', 'Speed', 'Durability']}
            rows={[
              ['Sports team or gym class', 'Medium', 'High — shared effort, fixed schedule'],
              ['Coworking space', 'Fast', 'Medium — strong, but highly transient'],
              ['Recurring meetup', 'Fast', 'Medium — depends on who keeps showing up'],
              ['Language class', 'Medium', 'High — mixed nationality, longer timelines'],
              ['Facebook group', 'Fast', 'Low — contacts, rarely friendships'],
              ['Bars and one-off events', 'Fast', 'Low — high volume, little repetition'],
            ]}
          />
          <Callout variant="tip" title="The pattern behind the table">
            Everything durable involves showing up to the same place on the same day.
            Everything low-durability is a one-off. If you only change one thing about how
            you are approaching this, make it that.
          </Callout>
        </Section>

        <Section title="The four habits that quietly stop it working" id="mistakes">
          <DoDont
            good={[
              'Commit to one recurring activity for a full month',
              'Follow up within 48 hours — messages decay fast',
              'Be the one who organises the second meeting',
              'Learn enough Vietnamese to be a neighbour, not a guest',
              'Accept that some friends will leave and keep going anyway',
            ]}
            bad={[
              'Joining ten groups and attending none of them',
              'Treating An Thuong as the whole city',
              'Waiting to be invited a second time',
              'Building a circle entirely from people on six-month visas',
              'Deciding after three weeks that the scene is not for you',
            ]}
          />
          <p>
            The last one matters more than it looks. Three weeks is roughly when the novelty
            has worn off and the friendships have not landed yet, and it is the point at
            which people conclude Da Nang is unfriendly. It is not — the curve is just
            slower than the arrival buzz suggests.
          </p>
        </Section>

        <Section title="The transience problem" id="transience">
          <p>
            Da Nang has an unusually high turnover, even by expat-city standards. A large
            share of the visible community is on tourist or three-month visas, which means
            a meaningful part of any circle you build in the first year will leave within
            it. This is the most common reason people who did everything right still feel
            isolated at month ten.
          </p>
          <p>
            There is no way to prevent it, only to plan around it: keep meeting new arrivals
            rather than closing the circle, and deliberately invest in the people whose
            timelines are long — business owners, teachers, families, anyone on a residence
            card. The{' '}
            <Link href="/guides/visa-options-da-nang" className="text-[#1AA5D8] hover:underline">
              visa guide
            </Link>{' '}
            explains which statuses imply which timelines, which is more socially useful
            information than it sounds.
          </p>
          <p>
            For the map of which groups and meetups are worth your time, see{' '}
            <Link href="/guides/da-nang-expat-groups-meetups" className="text-[#1AA5D8] hover:underline">
              Da Nang expat groups and meetups
            </Link>
            , and for the broader picture of daily life, the{' '}
            <Link href="/guides/expat-life-da-nang" className="text-[#1AA5D8] hover:underline">
              expat life guide
            </Link>
            .
          </p>
        </Section>

        <FAQ items={FAQS} />
      </GuideLayout>
    </>
  )
}
