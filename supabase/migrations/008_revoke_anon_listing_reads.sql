-- ============================================================
-- Close anon read access to the three listing tables.
--
-- The RLS policies on these tables filter ROWS ("status = 'published'"),
-- which is what they were written to do. They say nothing about COLUMNS,
-- so a published row was readable in full with the publishable key — and
-- that key ships inside the frontend bundle. A plain
--
--   GET /rest/v1/housing_listings?select=*
--
-- returned landlord_phone and admin_notes for every published listing.
-- PUBLIC_COLUMNS in types/*.ts kept our own queries clean, but it is a
-- client-side convention, not an access control.
--
-- The fix is to take the grants away rather than to add column grants,
-- because the app never reads these tables as `anon`: every read goes
-- through createAdminClient() (service role) in lib/listings.ts and
-- lib/directory.ts. createPublicClient() touches only site_stats and
-- reviews. A column allow-list would have to be kept in step with
-- PUBLIC_COLUMNS by hand, and drifting it would leak again in silence.
--
-- `authenticated` is deliberately untouched: the admin and partner panels
-- query these tables from the browser as that role, and admins do need
-- owner_phone and admin_notes. Row access there stays governed by the
-- is_admin() and partner-own policies from migration 002.
-- ============================================================

revoke all on housing_listings   from anon;
revoke all on motorbike_listings from anon;
revoke all on businesses         from anon;
