/**
 * Asks the server to drop the ISR caches for a public section after an admin
 * edit. The admin tabs write to Supabase directly from the browser, so without
 * this the public pages keep serving their cached copy for up to an hour and a
 * deleted listing stays visible.
 *
 * Best-effort by design: the database write has already succeeded by the time
 * this runs, so a failure here should never surface as a failed save. Worst
 * case the page refreshes on its own revalidation interval.
 */
export async function revalidatePublic(scope: 'motorbike' | 'housing' | 'guides') {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope }),
    })
  } catch {
    // Intentionally swallowed — see note above.
  }
}
