-- Run ONCE in the Supabase SQL editor after creating your admin user in
-- Authentication -> Users -> "Add user" (email + password, auto-confirm).
-- Replace the email below with the one you used.

insert into public.admin_users (user_id)
select id from auth.users where email = 'alwattarlayan@gmail.com'
on conflict do nothing;

-- Check: should return one row.
select u.email from public.admin_users a join auth.users u on u.id = a.user_id;
