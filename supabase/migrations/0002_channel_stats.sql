-- Per-channel funnel for every product, from ?ref= tags. Owner-only.
create view public.channel_stats with (security_invoker = true) as
with ev as (
  select e.product_id,
         coalesce(nullif(substring(e.path from 'ref=([a-z0-9_.:-]+)'), ''), 'direct') as channel,
         e.name
  from public.events e
), wl as (
  select w.product_id,
         coalesce(nullif(split_part(coalesce(w.source, ''), '|', 2), ''), 'direct') as channel
  from public.waitlist w
)
select p.slug, c.channel,
  count(*) filter (where c.name = 'pageview')            as visits,
  count(*) filter (where c.name like 'cta_download%')    as downloads,
  count(*) filter (where c.name like 'cta_star%')        as star_clicks,
  (select count(*) from wl where wl.product_id = p.id and wl.channel = c.channel) as signups
from public.products p
join ev c on c.product_id = p.id
group by p.id, p.slug, c.channel;
revoke all on public.channel_stats from anon, authenticated;
