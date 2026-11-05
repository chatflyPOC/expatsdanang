-- ============================================================
-- Expat Directory — businesses & services expats can browse
--
-- The third listing vertical after housing and motorbikes, but a different
-- shape: nothing here is rented through the site. A directory row is a real
-- business with its own public contact details, and the value we add over a
-- map search is the expat-specific attributes (English level, card payment,
-- international insurance, laptop-friendly) plus a verification date.
--
-- `claimed_by` is wired to `partners` now, unused in Phase 1. The claim flow
-- reuses the existing pool model, and backfilling the column later would mean
-- a second migration against live rows.
-- ============================================================

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Identity (public). `slug` is the URL segment, so it is unique and stable.
  slug text not null unique,
  name text not null,
  category text not null check (category in (
    'healthcare', 'cafe-coworking', 'fitness', 'restaurants',
    'education', 'beauty', 'pets', 'essentials'
  )),
  short_description text,
  description text,

  -- Location (public — a directory is useless without the address)
  district text not null,
  district_label text not null,
  address text,
  lat numeric,
  lng numeric,

  -- Contact (public business info)
  phone text,
  website text,
  maps_url text,
  facebook text,
  zalo text,
  email text,
  hours text,

  -- Expat-specific attributes — the reason this exists rather than a map search
  english_level text not null default 'basic' check (english_level in ('fluent', 'basic', 'none')),
  price_level int check (price_level between 1 and 3),
  payment_methods text[] default '{}',  -- cash | card | bank-transfer | e-wallet
  amenities text[] default '{}',        -- see AMENITIES in types/directory.ts
  good_for text[] default '{}',         -- free-form tags shown as chips

  -- Media (public)
  images text[] default '{}',
  cover_image_index int default 0,

  -- Trust layer. `verified_at` is what the public badge reads: a business
  -- verified two years ago is not a verified business, so the UI treats a
  -- stale date as unverified rather than showing an evergreen badge.
  verified boolean default false,
  verified_at date,
  verified_note text,

  -- Phase 2: owner claims the row through the partner portal
  claimed_by uuid references partners(id) on delete set null,

  -- Status & meta
  status text not null default 'draft' check (status in ('published', 'draft', 'hidden', 'closed')),
  featured boolean default false,
  sort_order int default 0,
  view_count int default 0,

  -- Admin-only (never selected by the public API)
  owner_name text,
  owner_phone text,
  owner_zalo text,
  admin_notes text
);

create index if not exists businesses_category_status_idx
  on businesses (category, status);
create index if not exists businesses_district_idx
  on businesses (district);
create index if not exists businesses_claimed_by_idx
  on businesses (claimed_by);

-- `updated_at` drives the "last updated" line on the detail page and the
-- sitemap's lastModified, so it is maintained by the database rather than
-- relying on every writer to remember it.
create or replace function businesses_touch_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists businesses_touch_updated_at on businesses;
create trigger businesses_touch_updated_at
  before update on businesses
  for each row execute function businesses_touch_updated_at();

-- ============================================================
-- RLS — same shape as the other verticals
-- ============================================================

alter table businesses enable row level security;

drop policy if exists "public businesses" on businesses;
create policy "public businesses" on businesses for select
  using (status = 'published');

drop policy if exists "partner read own business" on businesses;
create policy "partner read own business" on businesses for select
  using (claimed_by = current_partner_id());

drop policy if exists "partner update own business" on businesses;
create policy "partner update own business" on businesses for update
  using (claimed_by = current_partner_id())
  with check (claimed_by = current_partner_id());

drop policy if exists "admin all businesses" on businesses;
create policy "admin all businesses" on businesses for all
  using (is_admin()) with check (is_admin());

-- ============================================================
-- Placeholder rows
--
-- Deliberately NOT real businesses, and deliberately `draft` so none of this
-- reaches the public pages. Inventing opening hours, an English level or a
-- verification date for a real clinic would publish a fabricated record about
-- someone else's business, so these are shells for the admin to overwrite with
-- data from an actual visit or call. Replace the name/address/contact, set a
-- real `verified_at`, then flip `status` to 'published'.
-- ============================================================

insert into businesses (
  slug, name, category, short_description, district, district_label, address,
  english_level, price_level, payment_methods, amenities, good_for,
  hours, status, sort_order
) values
  ('example-dental-clinic-an-thuong', 'Example Dental Clinic', 'healthcare',
   'Placeholder row — replace with a verified clinic.',
   'an-thuong', 'An Thuong', 'Address to confirm on verification visit',
   'fluent', 2, '{cash,card}', '{english-staff,card-accepted,international-insurance,appointment-needed,air-con}',
   '{Check-ups,Fillings}', 'Mon-Sat 08:00-18:00', 'draft', 0),

  ('example-family-doctor-hai-chau', 'Example Family Clinic', 'healthcare',
   'Placeholder row — replace with a verified clinic.',
   'hai-chau', 'Hai Chau', 'Address to confirm on verification visit',
   'basic', 1, '{cash}', '{english-staff,appointment-needed}',
   '{Walk-in consults}', 'Daily 07:30-20:00', 'draft', 1),

  ('example-eye-clinic-son-tra', 'Example Eye Clinic', 'healthcare',
   'Placeholder row — replace with a verified clinic.',
   'son-tra', 'Son Tra', 'Address to confirm on verification visit',
   'basic', 2, '{cash,bank-transfer}', '{english-staff,card-accepted,parking}',
   '{Glasses,Eye tests}', 'Mon-Fri 08:00-17:00', 'draft', 2),

  ('example-specialty-coffee-an-thuong', 'Example Specialty Coffee', 'cafe-coworking',
   'Placeholder row — replace with a verified cafe.',
   'an-thuong', 'An Thuong', 'Address to confirm on verification visit',
   'fluent', 1, '{cash,card,e-wallet}', '{wifi-fast,laptop-friendly,power-outlets,english-menu,air-con,vegan-options}',
   '{Working,Flat whites}', 'Daily 07:00-22:00', 'draft', 3),

  ('example-coworking-space-my-khe', 'Example Coworking Space', 'cafe-coworking',
   'Placeholder row — replace with a verified coworking space.',
   'my-khe', 'My Khe', 'Address to confirm on verification visit',
   'fluent', 2, '{cash,card,bank-transfer}', '{wifi-fast,laptop-friendly,power-outlets,air-con,meeting-room,parking,invoice-vat}',
   '{Day passes,Monthly desks}', 'Mon-Sat 08:00-20:00', 'draft', 4),

  ('example-garden-cafe-hai-chau', 'Example Garden Cafe', 'cafe-coworking',
   'Placeholder row — replace with a verified cafe.',
   'hai-chau', 'Hai Chau', 'Address to confirm on verification visit',
   'basic', 1, '{cash,e-wallet}', '{wifi-fast,english-menu,pet-friendly,outdoor-seating}',
   '{Afternoons,Meetings}', 'Daily 07:00-21:00', 'draft', 5),

  ('example-gym-an-thuong', 'Example Gym', 'fitness',
   'Placeholder row — replace with a verified gym.',
   'an-thuong', 'An Thuong', 'Address to confirm on verification visit',
   'fluent', 2, '{cash,card,bank-transfer}', '{english-staff,air-con,parking,no-lock-in-contract,invoice-vat}',
   '{Weights,Classes}', 'Daily 06:00-22:00', 'draft', 6),

  ('example-yoga-studio-my-khe', 'Example Yoga Studio', 'fitness',
   'Placeholder row — replace with a verified studio.',
   'my-khe', 'My Khe', 'Address to confirm on verification visit',
   'fluent', 2, '{cash,bank-transfer}', '{english-staff,air-con,drop-in-welcome}',
   '{Drop-in classes}', 'Daily 07:00-19:00', 'draft', 7),

  ('example-boxing-club-ngu-hanh-son', 'Example Boxing Club', 'fitness',
   'Placeholder row — replace with a verified club.',
   'ngu-hanh-son', 'Ngu Hanh Son', 'Address to confirm on verification visit',
   'basic', 1, '{cash}', '{english-staff,parking,drop-in-welcome}',
   '{Sparring,Beginners}', 'Mon-Sat 17:00-21:00', 'draft', 8)
on conflict (slug) do nothing;
