-- ============================================================
-- Directory — real photos for nine listings that had none
--
-- 14 of the 29 published rows were showing the placeholder icon,
-- because seeds 001 and 002 refused every candidate photo that turned
-- out to be theme stock, a brand logo or an awards badge. This pass
-- crawled each business's own site properly — homepage plus gallery,
-- about and contact pages, reading img, data-src, srcset, og:image and
-- CSS background-image — downloaded every candidate over 700px, and
-- looked at all of them on contact sheets.
--
-- Nine rows get a photo of the actual place. Five still get none and
-- that is the right answer for them:
--   · aeon-mall-da-nang   — the site serves rotating promo banners and
--                           pink UI icons, nothing of the building
--   · mm-mega-market      — only a generic chain "about us" aisle shot,
--                           served over http
--   · laundry-tin-tin     — every image is WordPress theme stock; the
--                           one real storefront photo is the motorbike
--                           rental next door, not the laundry
--   · my-pet-animal-24h   — cartoons, a logo and stock beagles
--   · xu-bong-pet-shop    — a collage of product shots, not the shop
--
-- Three rows that did have a candidate were still refused: Missteak's
-- second photo is captioned missteakhoian — the Hoi An branch, not this
-- one; Madame Lan's exterior shot is a page background with marketing
-- text burnt into it; APU's other gallery images are all close-ups of
-- named schoolchildren.
--
-- Where a photo is the chain's rather than this branch's, admin_notes
-- says so. Re-runnable; leaves published rows an admin has since edited
-- alone only insofar as it writes images and admin_notes.
-- ============================================================

update businesses b set images = v.imgs, admin_notes = v.notes
from (values

  ('madame-lan',
   array['https://madamelan.vn/storage/20220408-madame-lan8972-mdl-web-pc-mobi-dat-ban-thuc-don-eng-vie.jpg']::text[],
   'Address, phone, email and hours read from madamelan.vn''s own contact block. No coordinates recorded. Photo is their own plated dish from the same site; their exterior shot is a page background with marketing text burnt in, and the rest of the site is Michelin badges and influencer video thumbnails. English level not established.'),

  ('missteak-da-nang',
   array['https://missteak.co/wp-content/uploads/2026/10/missteakdanang-2-1024x682.jpg']::text[],
   'Amenities from explicit OpenStreetMap payment:* and air_conditioning tags. OSM''s phone field held review-count junk, so no phone is stored. Photo is their own dining room, from the file their site names missteakdanang — the neighbouring shot on the same page is captioned missteakhoian and belongs to the Hoi An branch, so it is not used here.'),

  ('olivias-prime-da-nang',
   array['https://oliviasprime.com/web/image/833-5734fa7b/Olivia%27s%20Prime%20Steakhouse%20Team.jpg',
         'https://oliviasprime.com/web/image/677-3afb4e68/Olivias-Prime-Event-Preparation.jpg',
         'https://oliviasprime.com/web/image/674-cd99a8a8/Olivias-Prime-Steak-and-Lamb.jpg']::text[],
   'Address and phone read from oliviasprime.com; coordinates and hours from OpenStreetMap, as their site does not publish opening times. Photos are their own: the shopfront with its sign, the dining room laid for service, and a plated steak.'),

  ('shamrock-sports-bar-da-nang',
   array['https://shamrocksportsbar.com/wp-content/uploads/2025/04/PHOTO-2025-04-18-12-38-42-e1744956215193.jpg',
         'https://shamrocksportsbar.com/wp-content/uploads/2025/04/Chicken-Curry-e1745398591881.jpg']::text[],
   'Address, phone, email and the 24/7 hours read from shamrocksportsbar.com, and the 24/7 hours are also tagged in OpenStreetMap. WhatsApp line is +84 387 562 153. Photos are the bar itself and one of their own dishes; the site''s other images are a Guinness brand logo, stock pints, and group shots of identifiable customers, so none of those is used.'),

  ('st-nicholas-school-da-nang',
   array['https://sns.edu.vn/wp-content/uploads/2026/03/DSCF5097-1536x1024.jpg',
         'https://sns.edu.vn/wp-content/uploads/2026/03/DSCF5068-1536x1024.jpg',
         'https://sns.edu.vn/wp-content/uploads/2025/10/GRSNS-0007-1536x1150.jpg']::text[],
   'Address, phone and email read from sns.edu.vn, which the admissions email address confirms is the school''s own domain. OpenStreetMap pins the school about 2km from the address on its site — the school moved campus, so no coordinates are stored. Third-party guides disagree on the curriculum; the Common Core description is the school''s own wording. Photos are the campus building, the library and the sports courts — their gallery''s other images are close-ups of named pupils and are not used.'),

  ('apu-american-international-school-da-nang',
   array['https://apu.edu.vn/uploads/category/full_about-1654822974.jpg']::text[],
   'Address, phones and email read from the school''s own site. Second admissions line for grades 6–12 is (0236) 3928 664 / 3928 666. No coordinates recorded. Photo is the campus from the air, from their own site; every other gallery image is a close-up of named schoolchildren. Tuition not published.'),

  ('the-new-gym-da-nang',
   array['https://thenewgym.vn/wp-content/uploads/2025/12/d856d4f075c284491bcb005b02ace6d9d4e32f41-Copy.jpg']::text[],
   '24/7 hours and phone from OpenStreetMap. Membership pricing not confirmed. The photo is a gym floor from the chain''s own site — the chain does not caption its photos by branch, so this is not confirmed to be the Hoang Dieu room.'),

  ('family-medical-practice-da-nang',
   array['https://cdn.fmp.vn/cms/DN_07f4a05777.jpg']::text[],
   'Address, hours, phone and email read from the clinic''s own Da Nang location page. No coordinates recorded yet. English level taken from the clinic describing itself as an international practice. Photo is the clinic frontage with its signboard, filed on their CDN under a DN_ prefix for Da Nang.'),

  ('nobipet-pet-supermarket',
   array['https://cdn-kvweb.citigo.net/merchant/afadf905dea9a234efe29d535db4e47b/cropped/1760531166/crop-file.webp']::text[],
   'Hours, email, wheelchair access and Visa acceptance from OpenStreetMap tags. Photo is their own storefront, and the house number on the awning matches the address stored here.')

) as v(slug, imgs, notes)
where b.slug = v.slug;
