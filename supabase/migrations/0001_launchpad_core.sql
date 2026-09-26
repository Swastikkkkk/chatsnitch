-- Launchpad: one shared Supabase project for every launch site.
-- Applied to project "launchpad" (ref oceaylrebzflgyxfjqfb, ap-south-1).
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,40}$'),
  name text not null,
  url text,
  created_at timestamptz not null default now()
);
create table public.waitlist (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source text check (char_length(source) <= 80),
  created_at timestamptz not null default now()
);
create unique index waitlist_product_email_key on public.waitlist (product_id, lower(email));
create table public.events (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null check (name ~ '^[a-z0-9_.:-]{1,48}$'),
  path text check (char_length(path) <= 200),
  referrer_host text check (char_length(referrer_host) <= 120),
  created_at timestamptz not null default now()
);
create index events_product_created_idx on public.events (product_id, created_at desc);
create index events_product_name_idx on public.events (product_id, name);
alter table public.products enable row level security;
alter table public.waitlist enable row level security;
alter table public.events enable row level security;
revoke all on public.products, public.waitlist, public.events from anon, authenticated;

create or replace function public.join_waitlist(p_slug text, p_email text, p_source text default null)
returns text language plpgsql security definer set search_path = '' as $$
declare pid uuid; e text := lower(trim(coalesce(p_email, '')));
begin
  if char_length(e) > 254 or e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email' using errcode = '22023';
  end if;
  select id into pid from public.products where slug = p_slug;
  if pid is null then raise exception 'unknown product' using errcode = '22023'; end if;
  insert into public.waitlist (product_id, email, source)
  values (pid, e, nullif(left(p_source, 80), ''))
  on conflict (product_id, lower(email)) do nothing;
  return 'ok';
end; $$;

create or replace function public.track(p_slug text, p_name text, p_path text default null, p_referrer_host text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare pid uuid;
begin
  select id into pid from public.products where slug = p_slug;
  if pid is null then return; end if;
  insert into public.events (product_id, name, path, referrer_host)
  values (pid, p_name, left(p_path, 200), left(p_referrer_host, 120));
end; $$;

revoke all on function public.join_waitlist(text, text, text) from public;
revoke all on function public.track(text, text, text, text) from public;
grant execute on function public.join_waitlist(text, text, text) to anon, authenticated;
grant execute on function public.track(text, text, text, text) to anon, authenticated;

create view public.product_stats with (security_invoker = true) as
select p.slug,
  (select count(*) from public.waitlist w where w.product_id = p.id) as waitlist,
  (select count(*) from public.events e where e.product_id = p.id and e.name = 'pageview') as pageviews,
  (select count(*) from public.events e where e.product_id = p.id and e.name like 'cta%') as cta_clicks
from public.products p;
revoke all on public.product_stats from anon, authenticated;

-- New product? One line:
insert into public.products (slug, name, url) values ('chatsnitch', 'ChatSnitch', null);
