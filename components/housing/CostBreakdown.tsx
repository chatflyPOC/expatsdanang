import { HousingListingPublic, fmtPrice, USD_TO_VND } from '@/types/housing'
import { CheckCircle, Info } from 'lucide-react'

interface Props {
  listing: HousingListingPublic
  showVnd: boolean
}

type Row = { label: string; value: string; included: boolean }

export function CostBreakdown({ listing, showVnd }: Props) {
  const fmt = (usd: number) => fmtPrice(usd, showVnd)
  const vnd = (usd: number) =>
    showVnd
      ? `${(usd * USD_TO_VND / 1_000_000).toFixed(1).replace('.0', '')}M ₫`
      : `$${usd}`

  const rows: Row[] = [
    { label: 'Monthly rent', value: fmt(listing.price_usd), included: true },
    {
      label: 'Electricity',
      value: listing.electricity_note ?? 'By usage',
      included: false,
    },
    {
      label: 'Water',
      value: listing.water_included ? 'Included' : 'By usage',
      included: listing.water_included,
    },
    {
      label: 'Internet',
      value: listing.internet_included ? 'Included' : 'Extra ~$10/mo',
      included: listing.internet_included,
    },
    ...(listing.management_fee_usd
      ? [{ label: 'Management fee', value: vnd(listing.management_fee_usd), included: false }]
      : []),
    ...(listing.cleaning_fee_usd
      ? [{ label: 'Cleaning fee', value: vnd(listing.cleaning_fee_usd) + '/clean', included: false }]
      : []),
    {
      label: 'Parking',
      value: listing.parking_note ?? 'Ask landlord',
      included: false,
    },
  ]

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-[#E5E7EB]">
        <p className="text-sm font-semibold text-gray-900">What you pay</p>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(row => (
            <tr key={row.label} className="border-b border-[#F3F4F6] last:border-0">
              <td className="px-4 py-3 text-gray-600 flex items-center gap-2">
                {row.included ? (
                  <CheckCircle size={14} className="text-[#1D9E75] flex-none" />
                ) : (
                  <Info size={14} className="text-gray-300 flex-none" />
                )}
                {row.label}
              </td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-[#E1F5EE] px-4 py-3">
        <p className="text-xs text-[#085041]">
          <strong>Deposit:</strong> {listing.deposit_months} month{listing.deposit_months !== 1 ? 's' : ''} rent
          {' '}({fmt(listing.price_usd * listing.deposit_months)})
        </p>
      </div>
    </div>
  )
}
