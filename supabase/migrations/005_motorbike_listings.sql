-- ============================================================
-- Motorbike listings
-- ============================================================

create table if not exists motorbike_listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  -- Bike info (public)
  title text not null,
  brand text not null,
  model text not null,
  type text not null check (type in ('scooter','semi-auto','manual','trail')),
  engine_cc int,
  year_made int,
  condition text not null default 'good' check (condition in ('new','like-new','good')),
  color text,

  -- Pickup location (district public; exact address private)
  district text not null,
  district_label text not null,

  -- Pricing (public)
  price_per_day_usd numeric not null,
  price_per_week_usd numeric,
  price_per_month_usd numeric,
  deposit_usd numeric not null default 0,

  -- Included equipment (public)
  helmet_included boolean default false,
  lock_included boolean default false,
  raincoat_included boolean default false,
  insurance_included boolean default false,

  -- Delivery (public)
  delivery_available boolean default false,
  delivery_fee_usd numeric, -- null = free delivery

  -- Optional extras (public)
  gps_tracker boolean default false,
  phone_holder boolean default false,
  usb_charger boolean default false,
  top_box boolean default false,

  -- Rental terms (public)
  min_rental_days int default 1,
  available_date date,
  notes text,

  -- Media (public)
  images text[],
  video_url text,
  cover_image_index int default 0,

  -- Admin-only (never returned in public API)
  owner_name text,
  owner_phone text,
  owner_zalo text,
  pickup_address_exact text,
  commission_note text,
  admin_notes text,

  -- Status & meta
  status text default 'available' check (status in ('available','rented','maintenance','hidden')),
  featured boolean default false,
  expires_at timestamptz,
  view_count int default 0,
  inquiry_count int default 0
);

-- Inquiries
create table if not exists motorbike_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  listing_id uuid references motorbike_listings(id) on delete set null,
  listing_title text,
  name text not null,
  contact_channel text not null check (contact_channel in ('zalo','whatsapp','telegram','email')),
  contact_value text not null,
  start_date date,
  duration_days int,
  delivery_method text not null default 'store_pickup' check (delivery_method in ('store_pickup','home_delivery')),
  delivery_address text,
  message text,
  hp text
);

-- ============================================================
-- RLS
-- ============================================================

alter table motorbike_listings enable row level security;
alter table motorbike_inquiries enable row level security;

create policy "public motorbike listings"
  on motorbike_listings for select
  using (status = 'available' and (expires_at is null or expires_at > now()));

create policy "insert motorbike inquiries"
  on motorbike_inquiries for insert with check (true);

create policy "admin all motorbike listings"
  on motorbike_listings for all using (auth.role() = 'authenticated');

create policy "admin all motorbike inquiries"
  on motorbike_inquiries for all using (auth.role() = 'authenticated');

-- ============================================================
-- Seed listings
-- ============================================================

insert into motorbike_listings (
  title, brand, model, type, engine_cc, year_made, condition, color,
  district, district_label,
  price_per_day_usd, price_per_week_usd, price_per_month_usd, deposit_usd,
  helmet_included, lock_included, raincoat_included, insurance_included,
  delivery_available, delivery_fee_usd,
  phone_holder, usb_charger,
  min_rental_days, available_date, notes,
  images, status, featured
) values
(
  'Honda Air Blade 125 — Automatic Scooter',
  'Honda', 'Air Blade 125', 'scooter', 125, 2023, 'like-new', 'Pearl White',
  'an-thuong', 'An Thuong',
  7, 40, 120, 50,
  true, true, false, true,
  true, null,
  true, true,
  1, current_date::date,
  'Great fuel-efficient scooter. Delivery to An Thuong, My Khe, and Son Tra areas.',
  ARRAY[
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80'
  ],
  'available', true
),
(
  'Yamaha Exciter 150 — Semi-automatic',
  'Yamaha', 'Exciter 150', 'semi-auto', 150, 2022, 'good', 'Matte Black',
  'my-khe', 'My Khe',
  8, 45, 130, 60,
  true, true, false, false,
  true, 3,
  true, false,
  1, current_date::date,
  'Sporty semi-auto. Good for riders who want more control. $3 delivery fee to other districts.',
  ARRAY['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80'],
  'available', false
),
(
  'Honda Wave Alpha 110 — Budget Semi-auto',
  'Honda', 'Wave Alpha 110', 'semi-auto', 110, 2021, 'good', 'Red/Black',
  'hai-chau', 'Hai Chau',
  5, 28, 80, 30,
  true, true, true, false,
  false, null,
  false, false,
  3, current_date::date,
  'Most popular budget option. Reliable for daily commuting. Min 3-day rental.',
  ARRAY['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'],
  'available', false
),
(
  'Honda Winner X 150 — Sport Manual',
  'Honda', 'Winner X 150', 'manual', 150, 2022, 'like-new', 'Racing Blue',
  'son-tra', 'Son Tra',
  10, 55, 160, 80,
  true, true, false, true,
  true, null,
  true, true,
  1, current_date::date,
  'Full manual sport bike. Experience riders only. Free delivery in Son Tra.',
  ARRAY['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80'],
  'available', false
),
(
  'Honda XR150L — Trail / Adventure',
  'Honda', 'XR 150L', 'trail', 150, 2023, 'new', 'Red',
  'ngu-hanh-son', 'Ngu Hanh Son',
  15, 80, 220, 100,
  true, true, true, true,
  true, null,
  true, true,
  2, current_date::date,
  'Perfect for Hai Van Pass, Ba Na Hills, and off-road adventures. Includes insurance & raincoat.',
  ARRAY['https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80'],
  'available', true
)
on conflict do nothing;
