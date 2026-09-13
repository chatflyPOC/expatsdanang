import Link from 'next/link'
import { ArrowRight, Bike, Home } from 'lucide-react'
import { HousingCard } from '@/components/housing/HousingCard'
import { MotorbikeCard } from '@/components/motorbike/MotorbikeCard'
import { Reveal } from '@/components/Reveal'
import {
  getFeaturedHousingListings,
  getFeaturedMotorbikeListings,
} from '@/lib/listings'
import type { HousingListingPublic } from '@/types/housing'
import type { MotorbikeListing } from '@/types/motorbike'

/**
 * Four-up in a 1200px container, so the cards top out at 285px. The cards'
 * own default `sizes` describes the three-column browse grid and would make
 * next/image pull a 1920px file for each of these eight slots.
 */
const CARD_IMAGE_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px'

/**
 * Live inventory on the homepage.
 *
 * The step-by-step "how it works" explainer that used to sit here told people
 * what the service does; it never showed them anything they could actually
 * rent. Real listings do both jobs — they answer "what have you got?" and they
 * give every homepage visitor a direct route into the two hubs that carry the
 * inventory, which the explainer did not.
 *
 * Four per category is deliberate: one full row on desktop for each, so the two
 * blocks stay visually balanced and the page below the fold doesn't turn into a
 * browse page. Everything else is one click away behind "View all".
 */
export async function FeaturedListings() {
  const [housing, motorbikes] = await Promise.all([
    getFeaturedHousingListings(4),
    getFeaturedMotorbikeListings(4),
  ])

  // Nothing to show (empty database, or Supabase unreachable at build time) —
  // render nothing rather than two empty headers.
  if (housing.length === 0 && motorbikes.length === 0) return null

  return (
    <section className="bg-[#f0fdf9] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        {housing.length > 0 && (
          <HousingBlock listings={housing} />
        )}

        {housing.length > 0 && motorbikes.length > 0 && (
          <hr className="my-16 border-[#B6E5D4]" />
        )}

        {motorbikes.length > 0 && (
          <MotorbikeBlock listings={motorbikes} />
        )}
      </div>
    </section>
  )
}

function HousingBlock({ listings }: { listings: HousingListingPublic[] }) {
  return (
    <div>
      <BlockHeader
        icon={<Home size={16} />}
        eyebrow="Housing"
        title="Places to live, already checked"
        subtitle="Verified apartments and houses with the deposit, minimum term and monthly price stated up front."
        href="/housing"
        linkLabel="View all housing"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {listings.map((listing, i) => (
          <Reveal key={listing.id} delay={i * 70}>
            <HousingCard listing={listing} showVnd={false} imageSizes={CARD_IMAGE_SIZES} />
          </Reveal>
        ))}
      </div>

      <BlockFooter href="/housing" label="Browse all housing listings" />
    </div>
  )
}

function MotorbikeBlock({ listings }: { listings: MotorbikeListing[] }) {
  return (
    <div>
      <BlockHeader
        icon={<Bike size={16} />}
        eyebrow="Motorbikes"
        title="Get moving from day one"
        subtitle="Daily, weekly and monthly rentals — helmet, insurance and delivery shown before you enquire."
        href="/motorbike-rental"
        linkLabel="View all motorbikes"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {listings.map((listing, i) => (
          <Reveal key={listing.id} delay={i * 70}>
            <MotorbikeCard listing={listing} imageSizes={CARD_IMAGE_SIZES} />
          </Reveal>
        ))}
      </div>

      <BlockFooter href="/motorbike-rental" label="Browse all motorbikes" />
    </div>
  )
}

interface BlockHeaderProps {
  icon: React.ReactNode
  eyebrow: string
  title: string
  subtitle: string
  href: string
  linkLabel: string
}

function BlockHeader({ icon, eyebrow, title, subtitle, href, linkLabel }: BlockHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#B6E5D4] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#1D9E75]">
          {icon} {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-medium leading-snug text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-500">{subtitle}</p>
      </div>

      {/* Desktop-only: on small screens the footer button carries the same link,
          and two identical links stacked on top of each other reads as a bug. */}
      <Link
        href={href}
        className="hidden shrink-0 items-center gap-2 text-sm font-medium text-[#1D9E75] transition-colors hover:text-[#0F6E56] sm:inline-flex"
      >
        {linkLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function BlockFooter({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75] bg-white px-6 py-2.5 text-sm font-medium text-[#0F6E56] transition-colors hover:bg-[#1D9E75] hover:text-white"
      >
        {label} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
