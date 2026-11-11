-- =============================================================================
-- 0003 — Default rows: settings singleton, homepage sections, theme presets
-- (Your actual portfolio content is migrated separately in phase (e).)
-- =============================================================================

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

insert into public.sections (key, label, visible, position) values
  ('hero',         '{"en": "Home",                        "ar": "الرئيسية"}',             true, 0),
  ('about',        '{"en": "About Me",                    "ar": "نبذة عني"}',              true, 1),
  ('skills',       '{"en": "Skills",                      "ar": "المهارات"}',              true, 2),
  ('projects',     '{"en": "Projects",                    "ar": "المشاريع"}',              true, 3),
  ('analyses',     '{"en": "Data & Analysis",             "ar": "البيانات والتحليل"}',     true, 4),
  ('certificates', '{"en": "Courses & Certificates",      "ar": "الدورات والشهادات"}',     true, 5),
  ('reflections',  '{"en": "Reflections",                 "ar": "تأملات"}',                true, 6),
  ('timeline',     '{"en": "Education & Achievements",    "ar": "التعليم والإنجازات"}',    true, 7),
  ('contact',      '{"en": "Contact",                     "ar": "تواصل معي"}',             true, 8)
on conflict (key) do nothing;

-- Color keys:
--   bg / surface      page and card backgrounds
--   primary           fills, gradients, buttons
--   primaryInk        primary-colored TEXT (meets WCAG AA on bg)
--   secondary/accent  supporting pastels
--   ink / muted       body text / secondary text
insert into public.themes (name, is_preset, is_active, colors, fonts, radius, motion_level, cursor_glow) values
(
  'Blush Pink', true, true,
  '{
    "light": {"bg": "#FFF7F9", "surface": "#FFFFFF", "primary": "#E05A8E", "primaryInk": "#A8275E",
              "secondary": "#B9A3F5", "accent": "#FFB38A", "ink": "#2B1B2E", "muted": "#6E5A70"},
    "dark":  {"bg": "#1A1220", "surface": "#251A2D", "primary": "#FF8DB8", "primaryInk": "#FFB3CF",
              "secondary": "#B9A3F5", "accent": "#FFB38A", "ink": "#F7EDF3", "muted": "#C3B2C6"}
  }',
  '{"heading": "Fraunces", "body": "Plus Jakarta Sans", "headingAr": "El Messiri", "bodyAr": "IBM Plex Sans Arabic"}',
  '1.25rem', 'subtle', false
),
(
  'Lavender Dream', true, false,
  '{
    "light": {"bg": "#F8F6FF", "surface": "#FFFFFF", "primary": "#8B6CF0", "primaryInk": "#5B3FC4",
              "secondary": "#F2A7D0", "accent": "#9EE6CF", "ink": "#1F1A33", "muted": "#625C78"},
    "dark":  {"bg": "#16132A", "surface": "#211C3A", "primary": "#A992FF", "primaryInk": "#C9BBFF",
              "secondary": "#F2A7D0", "accent": "#9EE6CF", "ink": "#F1EEFF", "muted": "#B7B1D1"}
  }',
  '{"heading": "Fraunces", "body": "Plus Jakarta Sans", "headingAr": "El Messiri", "bodyAr": "IBM Plex Sans Arabic"}',
  '1.25rem', 'subtle', false
),
(
  'Peach Sunset', true, false,
  '{
    "light": {"bg": "#FFF8F2", "surface": "#FFFFFF", "primary": "#FF8A65", "primaryInk": "#B4441F",
              "secondary": "#F7A8C4", "accent": "#FFD976", "ink": "#2E1D16", "muted": "#715D55"},
    "dark":  {"bg": "#1F1512", "surface": "#2B1E19", "primary": "#FFA382", "primaryInk": "#FFC3AC",
              "secondary": "#F7A8C4", "accent": "#FFD976", "ink": "#FBF0EA", "muted": "#C9B5AC"}
  }',
  '{"heading": "Fraunces", "body": "Plus Jakarta Sans", "headingAr": "El Messiri", "bodyAr": "IBM Plex Sans Arabic"}',
  '1.25rem', 'subtle', false
)
on conflict (name) do nothing;
