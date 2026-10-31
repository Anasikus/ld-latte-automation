-- Apply in Supabase SQL Editor for the EXISTING LD LATTE project.
-- Admins may delete their OWN requests; all users still see only their own requests.
-- Admins may delete catalog services. No application secret or service_role key is used.
-- Review permissions and take a database backup before applying a destructive-capability migration.

begin;

grant delete on table public.requests to authenticated;
grant delete on table public.services to authenticated;

drop policy if exists "Admins can delete own requests" on public.requests;
create policy "Admins can delete own requests"
on public.requests for delete to authenticated
using (
    user_id = (select auth.uid())
    and (select public.is_app_admin())
);

drop policy if exists "Admins can delete services" on public.services;
create policy "Admins can delete services"
on public.services for delete to authenticated
using ((select public.is_app_admin()));

commit;
