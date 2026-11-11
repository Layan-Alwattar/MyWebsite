-- =============================================================================
-- 0001 — Core schema for the portfolio CMS
-- -----------------------------------------------------------------------------
-- Conventions
--   * Every visitor-facing text field is bilingual and stored as jsonb:
--       {"en": "Hello", "ar": "مرحبا"}            (plain text  -> type i18n_text)
--       {"en": <tiptap doc>, "ar": <tiptap doc>}  (rich text   -> type i18n_rich)
--   * Content tables share: status (draft|published), position (manual order),
--     created_at, updated_at.
--   * Access rules live in 0002_security.sql (Row Level Security).
-- =============================================================================

-- ---------- Shared types -----------------------------------------------------

create domain public.i18n_text as jsonb
  default '{"en": "", "ar": ""}'::jsonb
  check (jsonb_typeof(value) = 'object');

create domain public.i18n_rich as jsonb
  default '{"en": null, "ar": null}'::jsonb
  check (jsonb_typeof(value) = 'object');

create type public.content_status as enum ('draft', 'published');
create type public.timeline_kind  as enum ('education', 'achievement', 'experience');
create type public.chart_type     as enum ('bar', 'line', 'area', 'pie', 'scatter');
create type public.media_kind     as enum ('image', 'video', 'pdf', 'data', 'other');
create type public.motion_level   as enum ('off', 'subtle', 'playful');

-- Keeps updated_at fresh on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Admin ------------------------------------------------------------

-- Users listed here may manage content. Sign-ups are disabled in Supabase Auth,
-- so this will only ever contain the site owner.
create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------- Site-wide settings (single row) ----------------------------------

create table public.site_settings (
  id                 smallint primary key default 1 check (id = 1),
  -- Hero
  full_name          public.i18n_text not null default '{"en": "", "ar": ""}',
  headline           public.i18n_text not null default '{"en": "", "ar": ""}',
  tagline            public.i18n_text not null default '{"en": "", "ar": ""}',
  location           public.i18n_text not null default '{"en": "", "ar": ""}',
  availability       public.i18n_text not null default '{"en": "", "ar": ""}',
  show_availability  boolean not null default true,
  photo_url          text,
  hero_tags          jsonb not null default '[]',   -- [{ "en": "...", "ar": "..." }]
  cv_url             jsonb not null default '{}',   -- { "en": url, "ar": url }
  -- About
  about_title        public.i18n_text not null default '{"en": "", "ar": ""}',
  about_story        public.i18n_rich not null default '{"en": null, "ar": null}',
  interests          jsonb not null default '[]',   -- [{ icon, label: i18n }]
  fun_facts          jsonb not null default '[]',   -- [{ emoji, text: i18n }]
  stats              jsonb not null default '[]',   -- [{ value, suffix, label: i18n }] animated counters
  -- Contact & SEO
  contact_email      text,
  contact_intro      public.i18n_text not null default '{"en": "", "ar": ""}',
  seo_title          public.i18n_text not null default '{"en": "", "ar": ""}',
  seo_description    public.i18n_text not null default '{"en": "", "ar": ""}',
  og_image_url       text,
  updated_at         timestamptz not null default now()
);

-- ---------- Theme ------------------------------------------------------------

create table public.themes (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  is_preset    boolean not null default false,
  is_active    boolean not null default false,
  -- { "light": { bg, surface, primary, primaryInk, secondary, accent, ink, muted },
  --   "dark":  { ...same keys } }
  colors       jsonb not null,
  -- { "heading": "Fraunces", "body": "Plus Jakarta Sans",
  --   "headingAr": "El Messiri", "bodyAr": "IBM Plex Sans Arabic" }
  fonts        jsonb not null,
  radius       text not null default '1.25rem',
  motion_level public.motion_level not null default 'subtle',
  cursor_glow  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
-- At most one active theme.
create unique index themes_one_active on public.themes (is_active) where is_active;

-- ---------- Homepage sections ------------------------------------------------

create table public.sections (
  key        text primary key,          -- 'hero', 'about', 'skills', ...
  label      public.i18n_text not null default '{"en": "", "ar": ""}',
  visible    boolean not null default true,
  position   integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- Projects ---------------------------------------------------------

create table public.project_categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       public.i18n_text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         public.i18n_text not null,
  label         public.i18n_text not null default '{"en": "", "ar": ""}', -- e.g. "Senior Capstone"
  summary       public.i18n_text not null default '{"en": "", "ar": ""}', -- card text
  description   public.i18n_rich not null default '{"en": null, "ar": null}',
  problem       public.i18n_rich not null default '{"en": null, "ar": null}',
  approach      public.i18n_rich not null default '{"en": null, "ar": null}',
  results       public.i18n_rich not null default '{"en": null, "ar": null}',
  learnings     public.i18n_rich not null default '{"en": null, "ar": null}',
  tools         text[] not null default '{}',
  cover_url     text,
  video_url     text,          -- uploaded file URL or YouTube/Vimeo link
  prototype_url text,          -- Figma / prototype embed
  github_url    text,
  demo_url      text,
  report_url    text,          -- paper / report PDF
  start_date    date,
  end_date      date,
  is_ongoing    boolean not null default false,
  featured      boolean not null default false,
  status        public.content_status not null default 'draft',
  position      integer not null default 0,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index projects_public_idx on public.projects (status, position);

create table public.project_category_links (
  project_id  uuid not null references public.projects (id) on delete cascade,
  category_id uuid not null references public.project_categories (id) on delete cascade,
  primary key (project_id, category_id)
);
create index project_category_links_category_idx on public.project_category_links (category_id);

create table public.project_media (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  kind       public.media_kind not null default 'image',
  url        text not null,
  caption    public.i18n_text not null default '{"en": "", "ar": ""}',
  position   integer not null default 0,
  created_at timestamptz not null default now()
);
create index project_media_project_idx on public.project_media (project_id, position);

-- ---------- Skills -----------------------------------------------------------

create table public.skill_categories (
  id         uuid primary key default gen_random_uuid(),
  name       public.i18n_text not null,
  icon       text,                       -- lucide icon name
  status     public.content_status not null default 'published',
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references public.skill_categories (id) on delete set null,
  name        public.i18n_text not null,
  icon        text,
  level       smallint check (level between 0 and 100),
  featured    boolean not null default false,   -- shown as hero/focus tag
  status      public.content_status not null default 'published',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index skills_category_idx on public.skills (category_id, position);

-- ---------- Courses & certificates -------------------------------------------

create table public.certificates (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title          public.i18n_text not null,
  provider       public.i18n_text not null default '{"en": "", "ar": ""}',
  issued_on      date,
  credential_id  text,
  credential_url text,
  image_url      text,
  pdf_url        text,
  summary        public.i18n_rich not null default '{"en": null, "ar": null}',
  what_i_learned public.i18n_rich not null default '{"en": null, "ar": null}',
  what_i_gained  public.i18n_rich not null default '{"en": null, "ar": null}',
  skills         text[] not null default '{}',
  status         public.content_status not null default 'draft',
  position       integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------- Reflections / blog -----------------------------------------------

create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           public.i18n_text not null,
  excerpt         public.i18n_text not null default '{"en": "", "ar": ""}',
  content         public.i18n_rich not null default '{"en": null, "ar": null}',
  cover_url       text,
  tags            text[] not null default '{}',
  reading_minutes smallint,
  status          public.content_status not null default 'draft',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index posts_public_idx on public.posts (status, published_at desc);

-- ---------- Education / achievements / experience timeline -------------------

create table public.timeline_items (
  id           uuid primary key default gen_random_uuid(),
  kind         public.timeline_kind not null,
  title        public.i18n_text not null,
  organization public.i18n_text not null default '{"en": "", "ar": ""}',
  location     public.i18n_text not null default '{"en": "", "ar": ""}',
  start_date   date,
  end_date     date,
  is_current   boolean not null default false,
  date_label   public.i18n_text not null default '{"en": "", "ar": ""}', -- overrides formatted dates
  description  public.i18n_text not null default '{"en": "", "ar": ""}',
  highlights   jsonb not null default '[]',   -- [{ "en": "...", "ar": "..." }]
  icon         text,
  link_url     text,
  status       public.content_status not null default 'draft',
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index timeline_items_public_idx on public.timeline_items (status, kind, position);

-- ---------- Data & analysis --------------------------------------------------

create table public.analyses (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        public.i18n_text not null,
  summary      public.i18n_text not null default '{"en": "", "ar": ""}',
  insights     public.i18n_rich not null default '{"en": null, "ar": null}',
  cover_url    text,
  tools        text[] not null default '{}',
  status       public.content_status not null default 'draft',
  position     integer not null default 0,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Parsed CSV/JSON uploads. Rows are stored as jsonb so charts render without
-- re-downloading the file. Keep datasets small (a few thousand rows).
create table public.datasets (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  file_path     text,                          -- original file in Storage
  source_format text not null check (source_format in ('csv', 'json')),
  columns       jsonb not null default '[]',   -- [{ name, type: 'number'|'string'|'date' }]
  rows          jsonb not null default '[]',
  row_count     integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.charts (
  id          uuid primary key default gen_random_uuid(),
  dataset_id  uuid not null references public.datasets (id) on delete cascade,
  title       public.i18n_text not null,
  caption     public.i18n_text not null default '{"en": "", "ar": ""}',
  chart_type  public.chart_type not null,
  x_column    text not null,
  y_columns   text[] not null default '{}',
  options     jsonb not null default '{}',     -- stacked, colors, axis labels, aggregation...
  project_id  uuid references public.projects (id) on delete cascade,
  analysis_id uuid references public.analyses (id) on delete cascade,
  status      public.content_status not null default 'draft',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- A chart belongs to at most one page.
  constraint charts_single_parent check (num_nonnulls(project_id, analysis_id) <= 1)
);
create index charts_project_idx  on public.charts (project_id, position);
create index charts_analysis_idx on public.charts (analysis_id, position);
create index charts_dataset_idx  on public.charts (dataset_id);

-- ---------- Social links -----------------------------------------------------

create table public.social_links (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,                    -- 'github', 'linkedin', 'email', ...
  label      public.i18n_text not null default '{"en": "", "ar": ""}',
  url        text not null,
  icon       text,
  visible    boolean not null default true,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Contact messages -------------------------------------------------

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  subject    text check (char_length(subject) <= 200),
  message    text not null check (char_length(message) between 1 and 5000),
  locale     text not null default 'en' check (locale in ('en', 'ar')),
  ip_hash    text,                             -- hashed, used only for rate limiting
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index contact_messages_inbox_idx on public.contact_messages (is_read, created_at desc);
create index contact_messages_ratelimit_idx on public.contact_messages (ip_hash, created_at desc);

-- ---------- Media library index ----------------------------------------------

create table public.media (
  id         uuid primary key default gen_random_uuid(),
  bucket     text not null default 'media',
  path       text not null,
  url        text not null,
  kind       public.media_kind not null,
  mime_type  text,
  size_bytes bigint,
  width      integer,
  height     integer,
  alt        public.i18n_text not null default '{"en": "", "ar": ""}',
  created_at timestamptz not null default now(),
  unique (bucket, path)
);
create index media_kind_idx on public.media (kind, created_at desc);

-- ---------- updated_at triggers ----------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'themes', 'sections', 'project_categories', 'projects',
    'skill_categories', 'skills', 'certificates', 'posts', 'timeline_items',
    'analyses', 'datasets', 'charts', 'social_links'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;
