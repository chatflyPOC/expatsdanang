-- ============================================================
-- Machine-readable opening hours, for structured data.
--
-- `hours` is written for a person: "Mon–Sun 06:30–22:30", and on a
-- couple of rows a whole sentence carrying an after-hours number. The
-- detail page was handing that straight to schema.org `openingHours`,
-- which wants two-letter days and plain hyphens ("Mo-Su 06:30-22:30").
-- Everything we emitted was therefore unparseable, so the hours never
-- reached a search result.
--
-- This column holds one schema.org-valid string per rule, so a business
-- open mornings and afternoons gets two entries. `hours` stays as the
-- display string — a sentence about ambulance cover is useful to a
-- reader and meaningless to a parser, and the two should not fight.
-- Null means we have no machine-readable source, and the page then
-- emits no openingHours at all rather than a guess.
-- ============================================================

alter table businesses add column if not exists opening_hours_spec text[];

comment on column businesses.opening_hours_spec is
  'schema.org openingHours strings, e.g. {"Mo-Fr 08:00-18:00","Sa 08:00-17:00"}. Display copy lives in hours.';

-- Populate opening_hours_spec from each row's machine-readable source.
update businesses b
set opening_hours_spec = v.spec
from (values
  ('aeon-mall-da-nang', array['Mo-Fr 10:00-22:00', 'Sa-Su 09:00-22:00']::text[]),
  ('coworking-danang', array['Mo-Fr 08:00-22:30']::text[]),
  ('family-medical-practice-da-nang', array['Mo-Fr 08:00-18:00', 'Sa 08:00-17:00', 'Su 08:00-12:00']::text[]),
  ('herbal-spa-an-thuong', array['Mo-Su 09:00-22:30']::text[]),
  ('hoan-my-da-nang-hospital', array['Mo-Sa 07:00-11:30', 'Mo-Sa 12:30-16:00', 'Su 07:00-11:30']::text[]),
  ('le-comptoir-da-nang', array['Mo-Su 17:00-21:00']::text[]),
  ('missteak-da-nang', array['Mo-Su 11:30-23:00']::text[]),
  ('mm-mega-market-da-nang', array['Mo-Su 06:00-22:30']::text[]),
  ('nobipet-pet-supermarket', array['Mo-Su 07:30-21:00']::text[]),
  ('roots-plant-based-cafe', array['Mo-Su 08:30-22:45']::text[]),
  ('spanda-yoga-cafe', array['Mo-Sa 08:00-17:00']::text[]),
  ('the-new-gym-da-nang', array['Mo-Su 00:00-23:59']::text[]),
  ('vincom-plaza-ngo-quyen', array['Su 09:30-22:00', 'Mo-Sa 10:00-22:00']::text[]),
  ('xliii-specialty-coffee', array['Mo-Su 06:30-22:30']::text[])
) as v(slug, spec)
where b.slug = v.slug;
