-- ============================================================
-- Guides Table Migration
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Create guides table with full schema
create table if not exists guides (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  category text not null, -- 'Banking', 'Visas', 'Housing', 'Transport', 'Lifestyle', 'Health'
  content_html text not null,
  meta_title text,
  meta_description text,
  focus_keyword text,
  og_image_url text,
  read_time text,
  status text default 'draft', -- 'draft' | 'published'
  published_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now(),

  -- Author E-E-A-T signals
  author_name text,
  author_title text,
  author_bio text,
  author_avatar_url text,

  -- Content quality signals
  reviewed_at timestamptz,
  key_takeaways text[], -- JSONB array of strings
  faqs jsonb, -- Array of {q: string, a: string}
  sources jsonb -- Array of {title: string, url: string}
);

-- Create index on slug for fast lookups
create index if not exists guides_slug_idx on guides(slug);
create index if not exists guides_status_idx on guides(status);
create index if not exists guides_category_idx on guides(category);
create index if not exists guides_updated_at_idx on guides(updated_at desc);

-- Enable Row Level Security
alter table guides enable row level security;

-- Public read policy (published guides only)
create policy "public_guides_read" on guides
  for select
  using (status = 'published');

-- Authenticated admin full access
create policy "admin_guides_all" on guides
  for all
  using (auth.role() = 'authenticated');
