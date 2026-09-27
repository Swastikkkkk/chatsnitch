-- Validate before insert so bad input is dropped silently instead of echoing the row back.
create or replace function public.track(p_slug text, p_name text, p_path text default null, p_referrer_host text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare pid uuid;
begin
  if p_name is null or p_name !~ '^[a-z0-9_.:-]{1,48}$' then return; end if;
  select id into pid from public.products where slug = p_slug;
  if pid is null then return; end if;
  insert into public.events (product_id, name, path, referrer_host)
  values (pid, p_name, left(p_path, 200), left(p_referrer_host, 120));
end; $$;
revoke all on function public.track(text, text, text, text) from public;
grant execute on function public.track(text, text, text, text) to anon, authenticated;
