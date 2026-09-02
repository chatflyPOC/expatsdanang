import { createAdminClient } from '@/lib/supabase/server'
import { PUBLIC_COLUMNS, HousingListingPublic } from '@/types/housing'
import {
  PUBLIC_COLUMNS as MOTORBIKE_PUBLIC_COLUMNS,
  MotorbikeListing,
} from '@/types/motorbike'

/**
 * Unfiltered listing queries used to server-render the browse pages.
 *
 * The browser components fetch `/api/*` on every filter change, which is fine
 * for interaction but left the first paint empty — crawlers that don't execute
 * JS saw a shell with no listings, and no listing detail links to follow.
 * These mirror the API's default (no-filter) query so the initial set is in the
 * server HTML; the client takes over from the first filter or sort change.
 */
export async function getInitialHousingListings(): Promise<HousingListingPublic[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('housing_listings')
      .select(PUBLIC_COLUMNS)
      .eq('status', 'available')
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    return (data as HousingListingPublic[] | null) ?? []
  } catch {
    return []
  }
}

export async function getInitialMotorbikeListings(): Promise<MotorbikeListing[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('motorbike_listings')
      .select(MOTORBIKE_PUBLIC_COLUMNS)
      .eq('status', 'available')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    return (data as MotorbikeListing[] | null) ?? []
  } catch {
    return []
  }
}
