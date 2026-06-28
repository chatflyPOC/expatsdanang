'use client'
import { HousingListingPublic, fmtPrice } from '@/types/housing'
import { usePrefs } from './PreferencesContext'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface FeeRow {
  label: string
  included: boolean
  detail: string
}

function buildRows(listing: HousingListingPublic, showVnd: boolean): FeeRow[] {
  const fmt = (usd: number) => fmtPrice(usd, showVnd)
  return [
    { label: 'Monthly rent', included: true, detail: fmt(listing.price_usd) },
    { label: 'Electricity', included: false, detail: listing.electricity_note ?? 'By usage' },
    { label: 'Water', included: listing.water_included, detail: listing.water_included ? 'Included in rent' : 'By usage (metered)' },
    { label: 'Internet / WiFi', included: listing.internet_included, detail: listing.internet_included ? 'Included in rent' : 'Separate ~$10/mo' },
    ...(listing.management_fee_usd ? [{ label: 'Management fee', included: false, detail: fmt(listing.management_fee_usd) + '/mo' }] : []),
    ...(listing.cleaning_fee_usd ? [{ label: 'Cleaning fee', included: false, detail: fmt(listing.cleaning_fee_usd) + '/clean' }] : []),
    { label: 'Parking', included: false, detail: listing.parking_note ?? 'Ask landlord' },
  ]
}

export function FeeTable({ listing }: { listing: HousingListingPublic }) {
  const { currency } = usePrefs()
  const showVnd = currency === 'vnd'
  const rows = buildRows(listing, showVnd)

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-[#E5E7EB]">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">
              Fee
            </th>
            <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 w-28">
              Status
            </th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500">
              Detail
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F3F4F6]">
          {rows.map(row => (
            <tr key={row.label}>
              <td className="px-4 py-3">
                <p className="font-medium text-gray-800">{row.label}</p>
              </td>
              <td className="px-4 py-3 text-center">
                {row.included ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F6E56] bg-[#E1F5EE] px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} /> Included
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    <AlertCircle size={10} /> Extra
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-gray-600 text-xs">{row.detail}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#E1F5EE] border-t border-[#B6E5D4]">
            <td className="px-4 py-2.5 text-xs font-semibold text-[#085041]" colSpan={3}>
              Deposit: {listing.deposit_months} month{listing.deposit_months !== 1 ? 's' : ''} rent
              {' '}= {fmtPrice(listing.price_usd * listing.deposit_months, showVnd)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
