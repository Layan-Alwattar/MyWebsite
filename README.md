# Layan Alwattar — Portfolio & Admin Portal


All about me: my projects, courses, research, certificates and achievements.
Personal-brand website (EN/AR) with a full admin portal.
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Auth, Postgres, Storage) · Netlify.

> 🚧 Built in phases. Done so far: **(a) database + auth**. This README grows with each phase.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL + publishable key
npm run dev                  # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` · `npm run typecheck` | Code checks |

## Supabase setup (one time)

1. **Apply the database migrations.** In the Supabase dashboard → **SQL Editor**, run each file in
   `supabase/migrations/` **in filename order**:
   1. `…_schema.sql` — tables
   2. `…_security.sql` — Row Level Security, contact-form function, `media` storage bucket
   3. `…_defaults.sql` — homepage sections + 3 theme presets
2. **Disable public sign-ups.** Authentication → Sign In / Providers → turn **off** "Allow new users to sign up".
3. **Create your admin account.** Authentication → Users → **Add user** → email + password, tick *Auto Confirm User*.
4. **Grant admin rights.** Run `supabase/make-admin.sql` in the SQL Editor (edit the email first if needed).

Then open `/admin`, sign in, and the dashboard should show counts (3 themes, 9 sections).

## How security works

- Visitors read **published** content only; drafts are invisible to them (enforced in the database by RLS).
- Only users in the `admin_users` table can create, edit or delete anything, or read contact messages.
- The contact form writes through the `submit_contact_message()` function (validated, max 3 messages / 10 min per visitor).
- Uploaded files live in the public `media` bucket; only the admin can upload or delete.

## Project structure

```
app/
  admin/login/          admin sign-in
  admin/(protected)/    everything behind the admin check
lib/
  auth.ts               requireAdmin() guard
  supabase/             server, browser, public (cacheable) clients + session refresh
components/             shared UI
proxy.ts                refreshes the session and redirects signed-out users away from /admin
supabase/migrations/    database schema, security, defaults
```
