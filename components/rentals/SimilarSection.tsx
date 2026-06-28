'use client'
import { HousingListingPublic } from '@/types/housing'
import { HousingCard } from '@/components/housing/HousingCard'
import { usePrefs } from './PreferencesContext'

interface Props {
  listings: HousingListingPublic[]
}

export function SimilarSection({ listings }: Props) {
  const { currency } = usePrefs()
  if (!listings.length) return null

  return (
    <section className="mt-16 pt-10 border-t border-[#E5E7EB]">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Similar places you might like
      </h2>
      <p className="text-sm text-gray-500 mb-6">You might also like</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map(l => (
          <HousingCard key={l.id} listing={l} showVnd={currency === 'vnd'} />
        ))}
      </div>
    </section>
  )
}
