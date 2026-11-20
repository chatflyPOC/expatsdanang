-- ============================================================
-- Drop the St. Nicholas photos: Vercel cannot fetch them
--
-- Seed 003 gave this row three real campus photos from sns.edu.vn. They
-- load fine from a machine in Vietnam — plain curl, browser UA and the
-- optimizer's own UA all return 200 — but /_next/image on production
-- returns 400 for every one of them while the eight other hosts added
-- in the same deploy return 200. The host is allowlisted, so this is
-- the origin refusing Vercel's edge, almost certainly on IP or region.
--
-- A card that points at an image the site cannot fetch is the broken
-- placeholder the directory already had once. Better to hold the
-- placeholder icon and upload these photos through the admin Directory
-- tab, where they are served from our own storage.
-- ============================================================

update businesses
set images = '{}',
    admin_notes = 'Address, phone and email read from sns.edu.vn, which the admissions email address confirms is the school''s own domain. OpenStreetMap pins the school about 2km from the address on its site — the school moved campus, so no coordinates are stored. Third-party guides disagree on the curriculum; the Common Core description is the school''s own wording. Their site has good photos of the campus, library and sports courts, but sns.edu.vn refuses Vercel''s image optimizer (400 on every /_next/image request while every other host added alongside it returns 200), so they cannot be hotlinked — upload them through the admin Directory tab instead.'
where slug = 'st-nicholas-school-da-nang';
