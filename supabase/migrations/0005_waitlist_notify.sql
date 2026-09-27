-- Record when each person got the launch email, so nobody is emailed twice.
alter table public.waitlist add column if not exists notified_at timestamptz;
create view public.waitlist_pending with (security_invoker = true) as
select p.slug, w.email, w.created_at, w.source
from public.waitlist w join public.products p on p.id = w.product_id
where w.notified_at is null
order by w.created_at;
revoke all on public.waitlist_pending from anon, authenticated;
