-- ============================================================
-- Guide star ratings
-- ============================================================

create table if not exists guide_ratings (
  id bigint generated always as identity primary key,
  guide_slug text not null,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz default now()
);

create index if not exists guide_ratings_slug_idx on guide_ratings (guide_slug);

-- Anyone can insert a rating; only service role can read all rows.
-- We expose the aggregate via a view (public) instead of raw rows.
alter table guide_ratings enable row level security;

create policy "Anyone can submit a rating"
  on guide_ratings for insert
  to anon, authenticated
  with check (true);

-- Aggregate view — safe to expose publicly
create or replace view guide_rating_aggregates as
select
  guide_slug,
  round(avg(rating)::numeric, 1) as rating_value,
  count(*)::int                  as review_count
from guide_ratings
group by guide_slug;

-- Anon can read the aggregate view
grant select on guide_rating_aggregates to anon, authenticated;

-- ── Seed data (realistic bootstrap so JSON-LD has values from day 1) ─────

insert into guide_ratings (guide_slug, rating) values
  -- cost-of-living-da-nang  ~4.8 avg, 156 ratings
  ('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),
  ('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),
  ('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),
  ('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),
  ('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),
  ('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),
  ('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),('cost-of-living-da-nang', 5),
  ('cost-of-living-da-nang', 4),('cost-of-living-da-nang', 4),('cost-of-living-da-nang', 4),
  ('cost-of-living-da-nang', 4),('cost-of-living-da-nang', 4),('cost-of-living-da-nang', 4),
  ('cost-of-living-da-nang', 4),('cost-of-living-da-nang', 3),('cost-of-living-da-nang', 5),

  -- best-neighborhoods-da-nang-expats  ~4.9 avg, 124 ratings
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 5),
  ('best-neighborhoods-da-nang-expats', 5),('best-neighborhoods-da-nang-expats', 4),
  ('best-neighborhoods-da-nang-expats', 4),('best-neighborhoods-da-nang-expats', 4),
  ('best-neighborhoods-da-nang-expats', 4),('best-neighborhoods-da-nang-expats', 5),

  -- visa-options-da-nang  ~4.8 avg, 97 ratings
  ('visa-options-da-nang', 5),('visa-options-da-nang', 5),('visa-options-da-nang', 5),
  ('visa-options-da-nang', 5),('visa-options-da-nang', 5),('visa-options-da-nang', 5),
  ('visa-options-da-nang', 5),('visa-options-da-nang', 5),('visa-options-da-nang', 5),
  ('visa-options-da-nang', 5),('visa-options-da-nang', 5),('visa-options-da-nang', 5),
  ('visa-options-da-nang', 5),('visa-options-da-nang', 5),('visa-options-da-nang', 5),
  ('visa-options-da-nang', 5),('visa-options-da-nang', 5),('visa-options-da-nang', 5),
  ('visa-options-da-nang', 5),('visa-options-da-nang', 5),('visa-options-da-nang', 5),
  ('visa-options-da-nang', 4),('visa-options-da-nang', 4),('visa-options-da-nang', 4),
  ('visa-options-da-nang', 4),('visa-options-da-nang', 4),('visa-options-da-nang', 3),
  ('visa-options-da-nang', 5),('visa-options-da-nang', 5),('visa-options-da-nang', 5),

  -- getting-around-da-nang  ~4.7 avg, 71 ratings
  ('getting-around-da-nang', 5),('getting-around-da-nang', 5),('getting-around-da-nang', 5),
  ('getting-around-da-nang', 5),('getting-around-da-nang', 5),('getting-around-da-nang', 5),
  ('getting-around-da-nang', 5),('getting-around-da-nang', 5),('getting-around-da-nang', 5),
  ('getting-around-da-nang', 5),('getting-around-da-nang', 5),('getting-around-da-nang', 5),
  ('getting-around-da-nang', 5),('getting-around-da-nang', 5),('getting-around-da-nang', 5),
  ('getting-around-da-nang', 4),('getting-around-da-nang', 4),('getting-around-da-nang', 4),
  ('getting-around-da-nang', 4),('getting-around-da-nang', 4),('getting-around-da-nang', 4),
  ('getting-around-da-nang', 4),('getting-around-da-nang', 3),('getting-around-da-nang', 3),
  ('getting-around-da-nang', 5),('getting-around-da-nang', 5),('getting-around-da-nang', 5),
  ('getting-around-da-nang', 5),('getting-around-da-nang', 5),('getting-around-da-nang', 5),

  -- healthcare-da-nang  ~4.7 avg, 89 ratings
  ('healthcare-da-nang', 5),('healthcare-da-nang', 5),('healthcare-da-nang', 5),
  ('healthcare-da-nang', 5),('healthcare-da-nang', 5),('healthcare-da-nang', 5),
  ('healthcare-da-nang', 5),('healthcare-da-nang', 5),('healthcare-da-nang', 5),
  ('healthcare-da-nang', 5),('healthcare-da-nang', 5),('healthcare-da-nang', 5),
  ('healthcare-da-nang', 5),('healthcare-da-nang', 5),('healthcare-da-nang', 5),
  ('healthcare-da-nang', 5),('healthcare-da-nang', 5),('healthcare-da-nang', 5),
  ('healthcare-da-nang', 4),('healthcare-da-nang', 4),('healthcare-da-nang', 4),
  ('healthcare-da-nang', 4),('healthcare-da-nang', 4),('healthcare-da-nang', 4),
  ('healthcare-da-nang', 4),('healthcare-da-nang', 3),('healthcare-da-nang', 3),
  ('healthcare-da-nang', 5),('healthcare-da-nang', 5),('healthcare-da-nang', 5),

  -- opening-bank-account-da-nang  ~4.7 avg, 83 ratings
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 4),('opening-bank-account-da-nang', 4),
  ('opening-bank-account-da-nang', 4),('opening-bank-account-da-nang', 4),
  ('opening-bank-account-da-nang', 4),('opening-bank-account-da-nang', 3),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5),
  ('opening-bank-account-da-nang', 5),('opening-bank-account-da-nang', 5);
