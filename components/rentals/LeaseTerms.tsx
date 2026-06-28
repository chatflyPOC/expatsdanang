import { HousingListingPublic } from '@/types/housing'
import { clsx } from 'clsx'

const DURATION_LABEL: Record<string, string> = {
  '1m': '1 month',
  '3m': '3 months',
  '6m': '6 months',
  '1y': '1 year',
}

interface TermCardProps {
  emoji: string
  label: string
  value: string
  highlight?: boolean
}

function TermCard({ emoji, label, value, highlight }: TermCardProps) {
  return (
    <div className={clsx(
      'flex flex-col items-center text-center p-4 rounded-xl border',
      highlight ? 'bg-[#E1F5EE] border-[#B6E5D4]' : 'bg-gray-50 border-[#E5E7EB]'
    )}>
      <span className="text-2xl mb-2">{emoji}</span>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={clsx('text-sm font-semibold', highlight ? 'text-[#085041]' : 'text-gray-800')}>
        {value}
      </p>
    </div>
  )
}

export function LeaseTerms({ listing }: { listing: HousingListingPublic }) {
  const dur = listing.min_duration ? DURATION_LABEL[listing.min_duration] : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        <TermCard emoji="📅" label="Min. stay" value={dur ?? 'Flexible'} />
        <TermCard
          emoji={listing.pets_allowed ? '🐾' : '🚫'}
          label="Pets"
          value={listing.pets_allowed ? 'Allowed' : 'Not allowed'}
          highlight={listing.pets_allowed}
        />
        <TermCard
          emoji={listing.english_contract ? '📄' : '📋'}
          label="English contract"
          value={listing.english_contract ? 'Available' : 'Vietnamese only'}
          highlight={listing.english_contract}
        />
        <TermCard
          emoji={listing.temp_residence_support ? '✅' : '❓'}
          label="Temp. residence"
          value={listing.temp_residence_support ? 'Supported' : 'Ask landlord'}
          highlight={listing.temp_residence_support}
        />
        {listing.available_date && (
          <TermCard
            emoji="🗝"
            label="Available from"
            value={new Date(listing.available_date).toLocaleDateString('en-US', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          />
        )}
      </div>

      {(listing.temp_residence_support || listing.english_contract) && (
        <div className="bg-[#E1F5EE] rounded-xl p-3 text-xs text-[#085041] leading-relaxed">
          💡 Temp. residence registration allows you to legally stay long-term and is required for many services in Vietnam.
          {listing.english_contract && ' This landlord provides an English contract — important for understanding your rights.'}
        </div>
      )}
    </div>
  )
}
