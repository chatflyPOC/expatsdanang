-- ============================================================
-- expatsdanang.com — Phase 0: Partners, Roles, Pool & RLS
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Depends on: 001_initial_schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. Partners (org/unit that serves one or more services)
-- ------------------------------------------------------------
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  contact_email text,
  contact_phone text,
  services text[] not null default '{}',   -- service slugs this partner can serve
  areas text[] default '{}',
  status text not null default 'active',   -- 'active' | 'suspended'
  commission_pct numeric
);

-- ------------------------------------------------------------
-- 2. Profiles (maps an auth user to a role, and to a partner)
-- ------------------------------------------------------------
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  role text not null default 'partner',    -- 'admin' | 'partner'
  partner_id uuid references partners(id) on delete set null
);

-- ------------------------------------------------------------
-- 3. Helper functions (SECURITY DEFINER bypasses RLS on profiles,
--    so policies can call them without recursion)
-- ------------------------------------------------------------
create or replace function current_role_name() returns text
  language sql stable security definer set search_path = public as $$
  select role from profiles where user_id = auth.uid()
$$;

create or replace function current_partner_id() returns uuid
  language sql stable security definer set search_path = public as $$
  select partner_id from profiles where user_id = auth.uid()
$$;

create or replace function is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce(current_role_name() = 'admin', false)
$$;

-- ------------------------------------------------------------
-- 4. Extend service_requests for the pool/claim lifecycle
-- ------------------------------------------------------------
alter table service_requests
  add column if not exists assigned_partner_id uuid references partners(id),
  add column if not exists assignment_status text not null default 'pool',
    -- 'pool' | 'claimed' | 'in_progress' | 'completed' | 'released' | 'cancelled'
  add column if not exists claimed_at timestamptz,
  add column if not exists quote text,
  add column if not exists partner_notes text;

-- ------------------------------------------------------------
-- 5. Extend listings: ownership + moderation
-- ------------------------------------------------------------
alter table listings
  add column if not exists partner_id uuid references partners(id),
  add column if not exists status text not null default 'approved';
    -- 'draft' | 'submitted' | 'approved' | 'rejected'
-- (existing seeded listings default to 'approved' so the public site is unaffected)

-- ------------------------------------------------------------
-- 6. Request timeline / audit log (one table, two jobs)
-- ------------------------------------------------------------
create table if not exists request_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  request_id uuid not null references service_requests(id) on delete cascade,
  actor_partner_id uuid references partners(id),
  actor_admin uuid references auth.users(id),
  type text not null,        -- 'claimed'|'released'|'status_changed'|'quoted'|'note'|'completed'
  payload jsonb
);

-- ============================================================
-- 7. POOL ACCESS — anonymized listing for eligible partners
--    (no PII: returns only service/timeline + a short preview)
-- ============================================================
create or replace function list_available_requests()
returns table (
  id uuid,
  created_at timestamptz,
  services text[],
  timeline text,
  details_preview text
)
language sql stable security definer set search_path = public as $$
  select r.id, r.created_at, r.services, r.timeline,
         left(coalesce(r.details, ''), 280) as details_preview
  from service_requests r
  where r.assignment_status = 'pool'
    and r.services && coalesce(
      (select services from partners where id = current_partner_id()), '{}'
    )
  order by r.created_at asc
$$;

-- ============================================================
-- 8. CLAIM — atomic; only one partner can win a pool request
-- ============================================================
create or replace function claim_request(p_request_id uuid)
returns service_requests
language plpgsql security definer set search_path = public as $$
declare
  v_partner uuid := current_partner_id();
  v_row service_requests;
begin
  if v_partner is null then
    raise exception 'Not a partner account';
  end if;

  update service_requests
     set assigned_partner_id = v_partner,
         assignment_status   = 'claimed',
         claimed_at          = now()
   where id = p_request_id
     and assignment_status = 'pool'
     and services && (select services from partners where id = v_partner)
  returning * into v_row;

  if not found then
    raise exception 'Request is no longer available';
  end if;

  insert into request_events(request_id, actor_partner_id, type)
    values (p_request_id, v_partner, 'claimed');

  return v_row;
end $$;

-- ============================================================
-- 9. RELEASE — partner hands a request back to the pool
-- ============================================================
create or replace function release_request(p_request_id uuid)
returns service_requests
language plpgsql security definer set search_path = public as $$
declare
  v_partner uuid := current_partner_id();
  v_row service_requests;
begin
  update service_requests
     set assigned_partner_id = null,
         assignment_status   = 'pool',
         claimed_at          = null
   where id = p_request_id
     and assigned_partner_id = v_partner
     and assignment_status in ('claimed', 'in_progress')
  returning * into v_row;

  if not found then
    raise exception 'Request not owned by this partner';
  end if;

  insert into request_events(request_id, actor_partner_id, type)
    values (p_request_id, v_partner, 'released');

  return v_row;
end $$;

-- ============================================================
-- 10. Row Level Security
-- ============================================================
alter table partners       enable row level security;
alter table profiles       enable row level security;
alter table request_events enable row level security;

-- --- Drop the old over-broad "any authenticated = full access" policies ---
drop policy if exists "admin all requests" on service_requests;
drop policy if exists "admin all listings" on listings;
drop policy if exists "admin all reviews"  on reviews;
drop policy if exists "admin all stats"    on site_stats;

-- --- profiles: a user reads only their own; admin reads all ---
create policy "own profile read"  on profiles for select
  using (user_id = auth.uid() or is_admin());
create policy "admin manage profiles" on profiles for all
  using (is_admin()) with check (is_admin());

-- --- partners: partner reads own row; admin full ---
create policy "partner read own" on partners for select
  using (id = current_partner_id() or is_admin());
create policy "admin manage partners" on partners for all
  using (is_admin()) with check (is_admin());

-- --- service_requests ---
--    public insert kept from 001 ("insert requests")
--    partner sees ONLY requests they have claimed (full row incl. PII)
create policy "partner read claimed" on service_requests for select
  using (assigned_partner_id = current_partner_id());
--    partner updates only their own claimed request (status/quote/notes)
create policy "partner update claimed" on service_requests for update
  using (assigned_partner_id = current_partner_id())
  with check (assigned_partner_id = current_partner_id());
--    admin full control
create policy "admin all requests" on service_requests for all
  using (is_admin()) with check (is_admin());

-- --- listings ---
--    public read kept from 001 but tighten to approved+active below
drop policy if exists "public listings" on listings;
create policy "public listings" on listings for select
  using (active = true and status = 'approved');
create policy "partner read own listings" on listings for select
  using (partner_id = current_partner_id());
create policy "partner write own listings" on listings for all
  using (partner_id = current_partner_id())
  with check (partner_id = current_partner_id());
create policy "admin all listings" on listings for all
  using (is_admin()) with check (is_admin());

-- --- reviews / stats: admin via is_admin() ---
create policy "admin all reviews" on reviews for all
  using (is_admin()) with check (is_admin());
create policy "admin all stats" on site_stats for all
  using (is_admin()) with check (is_admin());

-- --- request_events: actor partner reads own; admin all; partner inserts own ---
create policy "partner read own events" on request_events for select
  using (actor_partner_id = current_partner_id() or is_admin());
create policy "partner insert own events" on request_events for insert
  with check (actor_partner_id = current_partner_id());
create policy "admin all events" on request_events for all
  using (is_admin()) with check (is_admin());

-- ============================================================
-- 11. Grant execute on RPCs to authenticated users
-- ============================================================
grant execute on function list_available_requests() to authenticated;
grant execute on function claim_request(uuid)        to authenticated;
grant execute on function release_request(uuid)      to authenticated;

-- ============================================================
-- 12. BOOTSTRAP — promote your existing admin login to role 'admin'
--     Replace the email with the account you log in to /admin with.
-- ============================================================
-- insert into profiles (user_id, role)
-- select id, 'admin' from auth.users where email = 'YOUR_ADMIN_EMAIL@example.com'
-- on conflict (user_id) do update set role = 'admin';
