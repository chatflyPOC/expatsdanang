-- ============================================================
-- Housing listings — rich data model for the housing service
-- ============================================================

create table if not exists housing_listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  -- Basic info
  title_vn text not null,
  title_en text not null,
  type text not null check (type in ('studio','1br','2br','3br','house','villa')),
  area_sqm numeric,
  bedrooms int,
  bathrooms int,
  floor_number int,
  furnishing text check (furnishing in ('full','partial','unfurnished')),
  views text[],

  -- Location (district public; coords internal)
  district text not null,
  district_label text not null,
  lat numeric,
  lng numeric,
  distance_to_beach_m int,
  nearby_refs text[],

  -- Pricing
  price_usd numeric not null,
  price_vnd numeric,
  short_term_price_usd numeric,
  deposit_months int default 2,
  electricity_note text,
  water_included boolean default false,
  internet_included boolean default false,
  management_fee_usd numeric,
  cleaning_fee_usd numeric,
  parking_note text,

  -- Terms
  min_duration text check (min_duration in ('1m','3m','6m','1y')),
  pets_allowed boolean default false,
  temp_residence_support boolean default false,
  english_contract boolean default false,
  available_date date,

  -- Amenities — in-unit
  has_ac boolean default false,
  has_washer boolean default false,
  has_water_heater boolean default false,
  kitchen_type text check (kitchen_type in ('gas','electric','induction')),
  has_fridge boolean default false,
  has_microwave boolean default false,
  has_tv boolean default false,
  has_desk boolean default false,
  has_balcony boolean default false,

  -- Amenities — building
  has_pool boolean default false,
  has_gym boolean default false,
  has_elevator boolean default false,
  has_security boolean default false,
  has_motorbike_parking boolean default false,
  has_car_parking boolean default false,
  has_reception boolean default false,

  -- Media
  images text[],
  video_url text,
  cover_image_index int default 0,

  -- Admin-only (never returned in public API)
  landlord_name text,
  landlord_phone text,
  landlord_zalo text,
  exact_address text,
  commission_note text,
  admin_notes text,
  listing_source text,

  -- Status & meta
  status text default 'available' check (status in ('available','pending','rented','hidden','expired')),
  featured boolean default false,
  expires_at timestamptz,
  view_count int default 0,
  inquiry_count int default 0
);

-- Housing inquiries (anonymous, no auth required)
create table if not exists housing_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  listing_id uuid references housing_listings(id) on delete set null,
  listing_title text,
  name text not null,
  contact_channel text not null check (contact_channel in ('zalo','whatsapp','telegram','email')),
  contact_value text not null,
  rental_duration text,
  preferred_viewing_date date,
  message text,
  hp text -- honeypot, must be empty
);

-- Custom housing search requests ("find me a place")
create table if not exists housing_search_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  contact_channel text not null,
  contact_value text not null,
  budget_usd_max numeric,
  districts text[],
  type_preferences text[],
  min_bedrooms int,
  move_in_date date,
  duration text,
  notes text,
  hp text
);

-- ============================================================
-- RLS
-- ============================================================

alter table housing_listings enable row level security;
alter table housing_inquiries enable row level security;
alter table housing_search_requests enable row level security;

create policy "public housing listings"
  on housing_listings for select
  using (status = 'available' and (expires_at is null or expires_at > now()));

create policy "insert housing inquiries"
  on housing_inquiries for insert with check (true);

create policy "insert housing search requests"
  on housing_search_requests for insert with check (true);

create policy "admin all housing listings"
  on housing_listings for all using (auth.role() = 'authenticated');

create policy "admin all housing inquiries"
  on housing_inquiries for all using (auth.role() = 'authenticated');

create policy "admin all housing search requests"
  on housing_search_requests for all using (auth.role() = 'authenticated');

-- ============================================================
-- Seed listings
-- ============================================================

insert into housing_listings (
  title_vn, title_en, type, area_sqm, bedrooms, bathrooms, floor_number,
  furnishing, views, district, district_label, distance_to_beach_m, nearby_refs,
  price_usd, price_vnd, deposit_months, electricity_note,
  water_included, internet_included, min_duration,
  pets_allowed, temp_residence_support, english_contract, available_date,
  has_ac, has_washer, has_water_heater, kitchen_type, has_fridge, has_microwave,
  has_tv, has_desk, has_balcony,
  has_pool, has_gym, has_elevator, has_security, has_motorbike_parking, has_car_parking,
  images, status, featured
) values
(
  'Căn hộ 1PN view biển An Thượng',
  '1BR Seaview Apartment — An Thuong',
  '1br', 45, 1, 1, 8, 'full', ARRAY['sea','city'],
  'an-thuong', 'An Thuong', 400,
  ARRAY['5 min walk to My Khe beach','Near Cong Viet coworking','Near Big C supermarket'],
  450, 11250000, 2, 'Government rate (≈3,000 VND/kWh)',
  true, true, '3m',
  false, true, true, (current_date + interval '7 days')::date,
  true, true, true, 'electric', true, true, true, true, true,
  true, true, true, true, true, false,
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
  ],
  'available', true
),
(
  'Studio gần biển Mỹ Khê',
  'Cosy Studio — My Khe beachside',
  'studio', 28, 0, 1, 3, 'full', ARRAY['sea'],
  'my-khe', 'My Khe', 120,
  ARRAY['2 min walk to My Khe beach','Near Ohana beach clubs'],
  280, 7000000, 1, 'Flat rate — 3,500 VND/kWh',
  false, false, '3m',
  false, false, false, (current_date + interval '1 days')::date,
  true, false, true, 'electric', true, false, true, true, true,
  false, false, true, false, true, false,
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
  'available', false
),
(
  'Căn hộ 2PN view sông Hàn',
  '2BR Han River View — Hai Chau',
  '2br', 70, 2, 2, 12, 'full', ARRAY['river','city'],
  'hai-chau', 'Hai Chau', 2000,
  ARRAY['Han River views','Near Vincom plaza','Near Con Market'],
  550, 13750000, 2, 'Government rate',
  true, true, '6m',
  false, true, true, (current_date + interval '14 days')::date,
  true, true, true, 'gas', true, true, true, true, true,
  true, true, true, true, true, true,
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80'
  ],
  'available', false
),
(
  'Nhà nguyên căn Ngũ Hành Sơn',
  'Full House — Ngu Hanh Son / Marble Mountains',
  'house', 120, 3, 2, 1, 'partial', ARRAY['garden'],
  'ngu-hanh-son', 'Ngu Hanh Son', 1500,
  ARRAY['Near Marble Mountains','Near Non Nuoc beach','Quiet residential street'],
  650, 16250000, 2, 'Government rate',
  true, false, '6m',
  true, false, false, (current_date + interval '30 days')::date,
  true, true, true, 'gas', true, false, true, true, false,
  false, false, false, false, true, true,
  ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'],
  'available', false
),
(
  'Căn hộ Studio Sơn Trà hiện đại',
  'Modern Studio — Son Tra Peninsula',
  'studio', 32, 0, 1, 5, 'full', ARRAY['sea','city'],
  'son-tra', 'Son Tra', 800,
  ARRAY['Quiet peninsula area','Near Helio Night Market','Near Burger Bros'],
  320, 8000000, 1, 'Government rate',
  false, true, '1m',
  false, false, true, (current_date + interval '3 days')::date,
  true, true, true, 'electric', true, false, true, true, true,
  false, false, true, true, true, false,
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
  'available', false
)
on conflict do nothing;
