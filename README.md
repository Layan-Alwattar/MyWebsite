# Layan Alwattar — Portfolio & Admin Portal

All about me: my projects, courses, research, certificates and achievements.

Personal-brand website (EN/AR) with a full admin portal.
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Auth, Postgres, Storage) · Netlify.

> 🚧 Built in phases. Done so far: **(a) database + auth · (b) admin portal · (c) public site + initial content**.

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

5. **Load the initial portfolio content.** Run `supabase/seed.sql` in the SQL Editor. It adds projects,
   skills, certificates, timeline, social links, About/Hero text and the SRIP 2026 analysis (EN + AR).
   Safe to run again — it never duplicates rows or overwrites edits you made in the admin.
   To change the starting content, edit `supabase/seed/content.mjs` and run `node scripts/build-seed.mjs`.

## Public site

- Lives at `/en` and `/ar` (`/` redirects by browser language). Arabic pages are fully right-to-left.
- Sections, order, colors, fonts and animation level all come from the admin portal.
- Images for published content are in `public/content/`. Images for **draft** items are kept in
  `private-assets/` (git-ignored) — upload them in **Admin → Media** when you publish those items.
- SEO: per-page metadata, hreflang alternates, `sitemap.xml`, `robots.txt`, generated Open Graph image.

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
