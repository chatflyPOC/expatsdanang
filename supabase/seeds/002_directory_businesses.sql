-- ============================================================
-- Expat Directory seed 002 — 9 more real Da Nang places
--
-- Follows on from 001. Overpass was down across all three public
-- mirrors while this was built, so discovery ran through Nominatim
-- search instead and every row was then verified against the
-- business's own website. Sources are recorded per row in admin_notes.
--
-- Same rules as 001, and they are worth restating because they are
-- what the badge on this site is for:
--   · every row is status='draft' and verified=false — nobody has been
--   · english_level is null, not 'basic': unchecked is not a level
--   · price_level, amenities and payment methods are set only where the
--     business states the fact outright
--   · opening_hours_spec carries the schema.org strings; `hours` is the
--     display copy
--
-- Images: only two rows carry one. Every other candidate photo was
-- pulled, looked at, and rejected — WordPress theme stock (the laundry),
-- a Michelin badge and influencer video thumbnails (Madame Lan), a
-- Guinness brand logo and stock pints (Shamrock), a product collage
-- (the pet shop), a rock texture (the climbing gym's second shot). A
-- card with the placeholder icon is more honest than a card showing
-- someone else's stock photo.
--
-- Five candidates were dropped rather than guessed: Chula Spa and
-- Beach Kids (domains no longer resolve), Queen Spa (sources disagree
-- on both the domain and the hours), Thai Market (its own site lists
-- only a Ho Chi Minh City address) and Odyssey International School
-- (its campus is in Dien Ban Dong, outside every area in DISTRICTS).
--
-- Re-runnable: upserts on slug, and leaves any row an admin has already
-- edited to published alone.
-- ============================================================

insert into businesses (
  slug, name, category, short_description, description,
  district, district_label, address, lat, lng,
  phone, website, maps_url, email, hours, opening_hours_spec,
  english_level, amenities, payment_methods, images,
  verified, status, admin_notes
) values
('madame-lan', 'Madame Lan', 'restaurants', 'Large Vietnamese restaurant on Bach Dang by the river, open 06:30–21:30 daily.', 'A long-running Vietnamese restaurant in a colonial-style building on the Bach Dang river front, serving dishes from across the country. Open from breakfast through to late evening, which is unusual for a kitchen of this size.', 'hai-chau', 'Hai Chau', '04 Bach Dang, Hai Chau, Da Nang', null, null, '0905 697 555', 'https://madamelan.vn/', null, 'sales@madamelan.com', 'Mon–Sun 06:30–21:30', array['Mo-Su 06:30-21:30']::text[], null, '{}', '{}', '{}', false, 'draft', 'Address, phone, email and hours read from madamelan.vn''s own contact block. No coordinates recorded. Their site carries a Michelin badge, a marketing banner and influencer video thumbnails but no photograph of the room, so no image is stored. English level not established.'),

('apu-american-international-school-da-nang', 'APU American International School — Da Nang', 'education', 'American-curriculum K–12 school on Tran Dai Nghia in Ngu Hanh Son.', 'The Da Nang campus of APU, teaching an American curriculum from kindergarten through grade 12. Primary and secondary run separate admissions lines.', 'ngu-hanh-son', 'Ngu Hanh Son', '299 Tran Dai Nghia, Ngu Hanh Son, Da Nang', null, null, '+84 236 3928 665', 'https://apu.edu.vn/', null, 'info@apu.edu.vn', null, null, null, '{}', '{}', '{}', false, 'draft', 'Address, phones and email read from the school''s own site. Second admissions line for grades 6–12 is (0236) 3928 664 / 3928 666. No coordinates recorded. The only og:image is their logo, so no photo is stored. Tuition not published.'),

('st-nicholas-school-da-nang', 'The St. Nicholas School', 'education', 'Pre-K to high school in Hoa Xuan teaching to US Common Core standards.', 'A private school in the Hoa Xuan area, south-east of the centre, running from pre-kindergarten to high school against US Common Core standards.', 'cam-le', 'Cam Le', 'Lot A2-15, Khu E, Tran Nam Trung, Hoa Xuan, Da Nang', null, null, '+84 931 972 972', 'https://sns.edu.vn/', null, 'admissions1@sns.edu.vn', null, null, null, '{}', '{}', '{}', false, 'draft', 'Address, phone and email read from sns.edu.vn, which the admissions email address confirms is the school''s own domain. OpenStreetMap pins the school about 2km from the address on its site — the school moved campus, so no coordinates are stored. Third-party guides disagree on the curriculum; the Common Core description is the school''s own wording.'),

('cardi-pizzeria-bach-dang', 'Cardi Pizzeria — Bach Dang', 'restaurants', 'Italian kitchen on Bach Dang, open 11:00–23:00 daily.', 'The Bach Dang branch of Cardi Pizzeria, serving pizza and pasta near the river front. The group also has branches on Vo Van Kiet and Duong 2/9; this row is the Bach Dang one.', 'hai-chau', 'Hai Chau', '124 Bach Dang, Hai Chau, Da Nang', 16.06775, 108.22485, '0989 232 315', 'https://cardipizzeria.com/', 'https://www.google.com/maps/search/?api=1&query=16.06775,108.22485', null, 'Mon–Sun 11:00–23:00', array['Mo-Su 11:00-23:00']::text[], null, '{}', '{}', array['https://cardipizzeria.com/wp-content/uploads/elementor/thumbs/DSC2037-scaled-pz7pxy1h70fd0438x94zcctj1lp59vs3hgxaxl4iyq.jpg']::text[], false, 'draft', 'Branch address and hours from cardipizzeria.com''s own branch list; coordinates and the 11:00–23:00 confirmation from OpenStreetMap. Phone is the group hotline, not a branch line. The stored photo is their own plated dish; the site''s other large image is a stock tomato-sauce shot and was rejected.'),

('olivias-prime-da-nang', 'Olivia''s Prime', 'restaurants', 'Steak and grill restaurant in Indochina Mall on Bach Dang, Michelin Guide selected.', 'A steakhouse on the ground floor of Indochina Mall on Bach Dang. Their own site shows a Michelin Guide "Selected" badge for 2024–2026.', 'hai-chau', 'Hai Chau', 'Indochina Mall, 74 Bach Dang, Lot G1-G4, Ground Floor, Hai Chau, Da Nang', 16.07013, 108.22417, '+84 90 816 3352', 'https://oliviasprime.com', 'https://www.google.com/maps/search/?api=1&query=16.07013,108.22417', null, 'Mon–Sun 11:00–23:00', array['Mo-Su 11:00-23:00']::text[], null, '{}', '{}', '{}', false, 'draft', 'Address and phone read from oliviasprime.com; coordinates and hours from OpenStreetMap, as their site does not publish opening times. The only large image on their site is the Michelin badge, so no photo is stored.'),

('danang-climbing-gym', 'Danang Climbing Gym', 'fitness', 'Bouldering gym on Mai Am in Thuan Phuoc, 08:00–22:00 daily, 150k day pass.', 'An indoor bouldering gym in Thuan Phuoc, north of the centre. The day pass is 150,000 VND and includes shoe and chalk rental, so it works as a drop-in; multi-visit punch cards and monthly passes are sold alongside, with a lower student rate for under-18s.', 'hai-chau', 'Hai Chau', '119 Mai Am, Thuan Phuoc, Hai Chau, Da Nang', 16.08336, 108.21692, null, 'https://www.danangclimbing.com/', 'https://www.google.com/maps/search/?api=1&query=16.08336,108.21692', 'climbdanang@gmail.com', 'Mon–Sun 08:00–22:00', array['Mo-Su 08:00-22:00']::text[], null, array['drop-in-welcome']::text[], '{}', array['https://static.wixstatic.com/media/977306_00744fa0fc8246a5887eda4c75ebb410~mv2.jpg']::text[], false, 'draft', 'Address, email, hours and the full price list read from danangclimbing.com; coordinates from OpenStreetMap. Drop-in welcome follows from the advertised day pass. No phone published. The stored photo is their own wall, shot from inside the gym. price_level is left null: 150k a day is a real figure but the site''s 1-to-4 bands were not set by anyone who has compared it against other gyms here.'),

('xu-bong-pet-shop', 'Xu Bong Pet Shop', 'pets', 'Pet supply shop on Do Ba in the An Thuong area.', 'A pet shop on Do Ba, inside the An Thuong blocks, stocking food, bedding and carriers. They run a second branch on Tran Van Du.', 'an-thuong', 'An Thuong', '110 Do Ba, Da Nang', 16.04080, 108.24351, '0934 894 634', 'https://petshopdanang.com/', 'https://www.google.com/maps/search/?api=1&query=16.04080,108.24351', null, null, null, null, '{}', '{}', '{}', false, 'draft', 'Both branch addresses and phones read from petshopdanang.com (the second is 32 Tran Van Du, 0934 930 002); coordinates from OpenStreetMap. Hours not published. Their banner image is a collage of product shots rather than the shop, so no image is stored.'),

('laundry-tin-tin', 'Laundry TIN TIN', 'essentials', 'Laundry on Phuoc Truong 9, 08:00–20:00 daily, with posted per-kilo prices and delivery.', 'A laundry in An Hai on the Son Tra side with its prices published: 30,000 VND/kg wash-dry-fold, 40,000 VND/kg for a four-hour turnaround booked before 3pm, 20,000 VND an item for ironing, and shoe cleaning from 50,000 VND a pair. Pickup and delivery from 20,000 VND.', 'son-tra', 'Son Tra', '04 Phuoc Truong 9, An Hai, Da Nang', 16.06368, 108.23884, '0964 140 723', 'https://www.laundrydanang.com/', 'https://www.google.com/maps/search/?api=1&query=16.06368,108.23884', null, 'Mon–Sun 08:00–20:00', array['Mo-Su 08:00-20:00']::text[], null, array['delivery']::text[], '{}', '{}', false, 'draft', 'Address, phone, hours and the whole price list read from laundrydanang.com; coordinates and hours also in OpenStreetMap. Delivery follows from their published pickup-and-delivery charge. Every image on the site is WordPress theme stock from /themes/laundry-anan/assets/ — not this shop — so none is stored.'),

('shamrock-sports-bar-da-nang', 'Shamrock Sports Bar', 'restaurants', 'Irish-style sports bar on An Thuong 32, open 24 hours.', 'A sports bar in the An Thuong blocks showing live matches, open around the clock.', 'an-thuong', 'An Thuong', '11 An Thuong 32, Bac My Phu, Ngu Hanh Son, Da Nang', 16.05095, 108.24637, '+84 333 314 600', 'https://shamrocksportsbar.com/', 'https://www.google.com/maps/search/?api=1&query=16.05095,108.24637', 'shamrocksportsbardanang@gmail.com', 'Open 24/7', array['Mo-Su 00:00-24:00']::text[], null, '{}', '{}', '{}', false, 'draft', 'Address, phone, email and the 24/7 hours read from shamrocksportsbar.com, and the 24/7 hours are also tagged in OpenStreetMap. WhatsApp line is +84 387 562 153. Their only large images are a Guinness brand logo and stock photographs of pints and a whisky glass, so none is stored.')

on conflict (slug) do update set
  name               = excluded.name,
  category           = excluded.category,
  short_description  = excluded.short_description,
  description        = excluded.description,
  district           = excluded.district,
  district_label     = excluded.district_label,
  address            = excluded.address,
  lat                = excluded.lat,
  lng                = excluded.lng,
  phone              = excluded.phone,
  website            = excluded.website,
  maps_url           = excluded.maps_url,
  email              = excluded.email,
  hours              = excluded.hours,
  opening_hours_spec = excluded.opening_hours_spec,
  english_level      = excluded.english_level,
  amenities          = excluded.amenities,
  payment_methods    = excluded.payment_methods,
  images             = excluded.images,
  admin_notes        = excluded.admin_notes
where businesses.status = 'draft';
