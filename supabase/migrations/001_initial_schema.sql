-- ============================================================
-- expatsdanang.com — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Service requests (lead capture)
create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  services text[] not null,
  timeline text not null,
  details text,
  contact_pref text not null, -- 'whatsapp' | 'email' | 'telegram'
  contact_value text not null,
  status text default 'new', -- 'new' | 'in-progress' | 'done'
  admin_notes text
);

-- Listings (housing + other services)
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  service_slug text not null,
  title text not null,
  description text,
  price text,
  location text,
  area text,
  tags text[],
  image_url text,
  verified boolean default false,
  active boolean default true,
  sort_order int default 0
);

-- Reviews / testimonials
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  author_name text not null,
  author_info text,
  rating int default 5,
  quote text not null,
  status text default 'pending', -- 'pending' | 'approved' | 'rejected'
  sort_order int default 0
);

-- Site stats (trust bar numbers)
create table if not exists site_stats (
  key text primary key,
  value text not null,
  label text
);

-- ============================================================
-- Seed data
-- ============================================================

insert into site_stats (key, value, label) values
  ('expats_helped', '200+', 'Expats helped'),
  ('reply_time', '2 hours', 'Reply within'),
  ('rating', '4.9/5', 'Rating'),
  ('support', 'WhatsApp', 'Support channel')
on conflict (key) do nothing;

insert into reviews (author_name, author_info, rating, quote, status, sort_order) values
  ('Tom H.', 'UK, living in An Thuong', 5, 'Saved me days of stress finding an apartment. They knew exactly what I needed.', 'approved', 0),
  ('Sarah M.', 'Canada, digital nomad', 5, 'Airport pickup was seamless, driver spoke English. Highly recommend.', 'approved', 1),
  ('Marco R.', 'Italy, living in My Khe', 5, 'Got my bank account sorted in one afternoon. Worth every penny.', 'approved', 2),
  ('Emma L.', 'Australia, An Thuong', 5, 'Visa extension was done without me lifting a finger. These guys know their stuff.', 'approved', 3)
on conflict do nothing;

insert into listings (service_slug, title, description, price, location, area, tags, verified, active, sort_order) values
  ('housing', '2BR apartment — An Thuong', 'Modern apartment with pool access, fully furnished. English-speaking landlord.', '$450/mo', 'An Thuong, Son Tra', 'An Thuong', ARRAY['Furnished', 'Pool', 'English-speaking landlord'], true, true, 0),
  ('housing', 'Studio — My Khe beachside', 'Cosy studio 2 minutes from My Khe beach. Min 3 months.', '$280/mo', 'My Khe, Ngu Hanh Son', 'My Khe', ARRAY['Furnished', 'Sea view', 'Min 3 months'], true, true, 1),
  ('housing', '1BR — Han River view', 'Bright apartment with balcony overlooking the Han River.', '$380/mo', 'Han River, Hai Chau', 'Han River', ARRAY['Furnished', 'River view', 'Gym'], true, true, 2),
  ('motorbike-rental', 'Honda Wave — automatic', 'Reliable 110cc automatic scooter. Perfect for daily commuting.', '$5/day', 'An Thuong', 'An Thuong', ARRAY['Automatic', 'Helmet included', 'Delivery'], true, true, 0),
  ('motorbike-rental', 'Yamaha Exciter — semi-auto', '150cc semi-automatic. Great for longer rides and coastal roads.', '$7/day', 'An Thuong', 'An Thuong', ARRAY['Semi-auto', 'Helmet included', 'Insurance'], true, true, 1)
on conflict do nothing;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table service_requests enable row level security;
alter table listings enable row level security;
alter table reviews enable row level security;
alter table site_stats enable row level security;

-- Public read policies
create policy "public listings" on listings for select using (active = true);
create policy "public reviews" on reviews for select using (status = 'approved');
create policy "public stats" on site_stats for select using (true);

-- Public insert (lead capture + review submission)
create policy "insert requests" on service_requests for insert with check (true);
create policy "insert reviews" on reviews for insert with check (true);

-- Authenticated (admin) full access
create policy "admin all requests" on service_requests for all using (auth.role() = 'authenticated');
create policy "admin all listings" on listings for all using (auth.role() = 'authenticated');
create policy "admin all reviews" on reviews for all using (auth.role() = 'authenticated');
create policy "admin all stats" on site_stats for all using (auth.role() = 'authenticated');
