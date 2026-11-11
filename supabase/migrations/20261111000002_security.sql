-- =============================================================================
-- 0002 — Row Level Security, admin check, contact-form RPC, storage bucket
-- -----------------------------------------------------------------------------
-- Rules in plain words:
--   * Visitors (anon) can READ published content only. They can never write,
--     except sending a contact message through submit_contact_message().
--   * The admin (a user listed in admin_users) can do everything.
--   * Nobody but the admin can read contact messages.
-- =============================================================================

-- ---------- Admin check ------------------------------------------------------

-- SECURITY DEFINER so it can read admin_users regardless of that table's RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Enable RLS everywhere --------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'admin_users', 'site_settings', 'themes', 'sections', 'project_categories',
    'projects', 'project_category_links', 'project_media', 'skill_categories',
    'skills', 'certificates', 'posts', 'timeline_items', 'analyses', 'datasets',
    'charts', 'social_links', 'contact_messages', 'media'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- ---------- Admin: full access to every content table ------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'themes', 'sections', 'project_categories', 'projects',
    'project_category_links', 'project_media', 'skill_categories', 'skills',
    'certificates', 'posts', 'timeline_items', 'analyses', 'datasets', 'charts',
    'social_links', 'contact_messages', 'media'
  ]
  loop
    execute format(
      'create policy "admin full access" on public.%I
         for all to authenticated
         using ((select public.is_admin()))
         with check ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- ---------- Public read: tables gated by status ------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'projects', 'skill_categories', 'skills', 'certificates', 'posts',
    'timeline_items', 'analyses', 'charts'
  ]
  loop
    execute format(
      'create policy "public reads published" on public.%I
         for select to anon, authenticated
         using (status = ''published'')', t);
  end loop;
end;
$$;

-- ---------- Public read: always-public tables --------------------------------

create policy "public reads settings" on public.site_settings
  for select to anon, authenticated using (true);

create policy "public reads themes" on public.themes
  for select to anon, authenticated using (true);

create policy "public reads sections" on public.sections
  for select to anon, authenticated using (true);

create policy "public reads categories" on public.project_categories
  for select to anon, authenticated using (true);

create policy "public reads category links" on public.project_category_links
  for select to anon, authenticated using (true);

create policy "public reads visible social links" on public.social_links
  for select to anon, authenticated using (visible);

create policy "public reads media index" on public.media
  for select to anon, authenticated using (true);

-- ---------- Public read: rows that inherit visibility from a parent ----------

create policy "public reads media of published projects" on public.project_media
  for select to anon, authenticated
  using (exists (
    select 1 from public.projects p
    where p.id = project_media.project_id and p.status = 'published'
  ));

-- A dataset is visible only if a published chart uses it, so draft data
-- never leaks.
create policy "public reads datasets behind published charts" on public.datasets
  for select to anon, authenticated
  using (exists (
    select 1 from public.charts c
    where c.dataset_id = datasets.id and c.status = 'published'
  ));

-- ---------- admin_users: you can see your own row only -----------------------

create policy "users read own admin row" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- Contact form -----------------------------------------------------
-- Visitors have no direct INSERT policy on contact_messages. They go through
-- this function, which validates input and rate-limits per IP hash
-- (max 3 messages per 10 minutes).

create or replace function public.submit_contact_message(
  p_name    text,
  p_email   text,
  p_subject text,
  p_message text,
  p_locale  text default 'en',
  p_ip_hash text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent int;
  new_id uuid;
begin
  if p_ip_hash is not null then
    select count(*) into recent
    from public.contact_messages
    where ip_hash = p_ip_hash
      and created_at > now() - interval '10 minutes';

    if recent >= 3 then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
  end if;

  insert into public.contact_messages (name, email, subject, message, locale, ip_hash)
  values (
    trim(p_name),
    lower(trim(p_email)),
    nullif(trim(p_subject), ''),
    trim(p_message),
    case when p_locale in ('en', 'ar') then p_locale else 'en' end,
    p_ip_hash
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text, text, text) to anon, authenticated;

-- ---------- Storage: one public "media" bucket -------------------------------
-- Files are publicly readable by URL (images, videos, PDFs on the site);
-- only the admin can upload, replace or delete.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,  -- 50 MB
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime',
    'application/pdf',
    'text/csv', 'application/json', 'text/plain'
  ]
)
on conflict (id) do nothing;

-- Listing files (media manager) needs a SELECT policy; public URLs don't.
create policy "admin lists media" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "admin uploads media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "admin updates media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "admin deletes media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
