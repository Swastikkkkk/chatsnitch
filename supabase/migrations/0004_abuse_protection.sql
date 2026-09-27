-- Rate limits for the public RPCs. Key: salted SHA-256 of the caller's network block
-- (/24 IPv4, /48 IPv6) from cf-connecting-ip (set by Cloudflare, not spoofable by the
-- client). Salt rotates daily; buckets and salts are pruned after a day.
create table public.rate_limits (
  bucket text not null, key text not null, window_start timestamptz not null, hits int not null default 0,
  primary key (bucket, key, window_start)
);
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;
create table public.rate_salt (day date primary key, salt text not null);
alter table public.rate_salt enable row level security;
revoke all on public.rate_salt from anon, authenticated;

create or replace function public.rl_allow(p_bucket text, p_limit int, p_window interval)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  ip text := coalesce(nullif(current_setting('request.headers', true), '')::json ->> 'cf-connecting-ip', 'unknown');
  net text; s text; k text; n int;
  w timestamptz := to_timestamp(floor(extract(epoch from now()) / extract(epoch from p_window)) * extract(epoch from p_window));
begin
  begin
    if position(':' in ip) > 0 then net := host(network(set_masklen(ip::inet, 48)));
    else net := host(network(set_masklen(ip::inet, 24))); end if;
  exception when others then net := ip; end;
  insert into public.rate_salt (day, salt) values (current_date, encode(extensions.gen_random_bytes(16), 'hex')) on conflict (day) do nothing;
  select salt into s from public.rate_salt where day = current_date;
  k := encode(extensions.digest(s || net, 'sha256'), 'hex');
  insert into public.rate_limits (bucket, key, window_start, hits) values (p_bucket, k, w, 1)
  on conflict (bucket, key, window_start) do update set hits = public.rate_limits.hits + 1 returning hits into n;
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
    delete from public.rate_salt where day < current_date - 1;
  end if;
  return n <= p_limit;
end; $$;
revoke all on function public.rl_allow(text, int, interval) from public, anon, authenticated;

create or replace function public.rl_global(p_bucket text, p_limit int, p_window interval)
returns boolean language plpgsql security definer set search_path = '' as $$
declare n int; w timestamptz := to_timestamp(floor(extract(epoch from now()) / extract(epoch from p_window)) * extract(epoch from p_window));
begin
  insert into public.rate_limits (bucket, key, window_start, hits) values (p_bucket, 'global', w, 1)
  on conflict (bucket, key, window_start) do update set hits = public.rate_limits.hits + 1 returning hits into n;
  return n <= p_limit;
end; $$;
revoke all on function public.rl_global(text, int, interval) from public, anon, authenticated;

-- Signups: 10 per network block per hour, 300/hour overall. Over the limit returns 'ok'
-- (no signal for a bot to tune against) but writes nothing.
create or replace function public.join_waitlist(p_slug text, p_email text, p_source text default null)
returns text language plpgsql security definer set search_path = '' as $$
declare pid uuid; e text := lower(trim(coalesce(p_email, '')));
begin
  if char_length(e) > 254 or e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'invalid email' using errcode = '22023'; end if;
  select id into pid from public.products where slug = p_slug;
  if pid is null then raise exception 'unknown product' using errcode = '22023'; end if;
  if not public.rl_allow('waitlist', 10, interval '1 hour') then return 'ok'; end if;
  if not public.rl_global('waitlist', 300, interval '1 hour') then return 'ok'; end if;
  insert into public.waitlist (product_id, email, source) values (pid, e, nullif(left(p_source, 80), ''))
  on conflict (product_id, lower(email)) do nothing;
  return 'ok';
end; $$;
revoke all on function public.join_waitlist(text, text, text) from public;
grant execute on function public.join_waitlist(text, text, text) to anon, authenticated;

-- Events: 300 per network block per hour, 20k/hour overall.
create or replace function public.track(p_slug text, p_name text, p_path text default null, p_referrer_host text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare pid uuid;
begin
  if p_name is null or p_name !~ '^[a-z0-9_.:-]{1,48}$' then return; end if;
  select id into pid from public.products where slug = p_slug;
  if pid is null then return; end if;
  if not public.rl_allow('events', 300, interval '1 hour') then return; end if;
  if not public.rl_global('events', 20000, interval '1 hour') then return; end if;
  insert into public.events (product_id, name, path, referrer_host) values (pid, p_name, left(p_path, 200), left(p_referrer_host, 120));
end; $$;
revoke all on function public.track(text, text, text, text) from public;
grant execute on function public.track(text, text, text, text) to anon, authenticated;
