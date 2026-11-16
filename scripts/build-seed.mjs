/**
 * Generates supabase/seed.sql from supabase/seed/content.mjs.
 *
 *   node scripts/build-seed.mjs
 *
 * The SQL is safe to run more than once: rows use deterministic ids
 * (md5 of a stable key) and "on conflict do nothing", and site settings
 * are only filled while still empty — so it never overwrites edits made
 * in the admin portal.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as c from '../supabase/seed/content.mjs';

const OUT = fileURLToPath(new URL('../supabase/seed.sql', import.meta.url));

// ---------------------------------------------------------------- helpers

/** SQL string literal. */
const lit = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
/** jsonb literal. */
const json = (v) => `${lit(JSON.stringify(v ?? null))}::jsonb`;
/** text[] literal. */
const arr = (list = []) => `array[${list.map(lit).join(', ')}]::text[]`;
/** Deterministic uuid from a key. */
const uid = (key) => `md5(${lit(key)})::uuid`;
const i18n = (v) => json(v ?? { en: '', ar: '' });

/** Inline **bold** → Tiptap text nodes. */
function inline(text) {
  const nodes = [];
  for (const [i, part] of text.split('**').entries()) {
    if (!part) continue;
    nodes.push(i % 2 ? { type: 'text', text: part, marks: [{ type: 'bold' }] } : { type: 'text', text: part });
  }
  return nodes;
}

/** Tiny markdown → Tiptap doc: paragraphs, "## " headings, "- " bullet lists. */
function md(text) {
  if (!text) return null;
  const content = [];
  for (const block of text.trim().split(/\n\s*\n/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.every((l) => l.startsWith('- '))) {
      content.push({
        type: 'bulletList',
        content: lines.map((l) => ({ type: 'listItem', content: [{ type: 'paragraph', content: inline(l.slice(2)) }] })),
      });
    } else if (lines.length === 1 && lines[0].startsWith('## ')) {
      content.push({ type: 'heading', attrs: { level: 2 }, content: inline(lines[0].slice(3)) });
    } else {
      content.push({ type: 'paragraph', content: inline(lines.join(' ')) });
    }
  }
  return { type: 'doc', content };
}
const rich = (v) => json(v ? { en: md(v.en), ar: md(v.ar) } : { en: null, ar: null });

const sql = [];
const emit = (s) => sql.push(s.trim() + '\n');

// ---------------------------------------------------------------- settings

const s = c.settings;
emit(`
-- Site settings: only filled while still empty (never overwrites admin edits).
update public.site_settings set
  full_name = ${i18n(s.full_name)},
  headline = ${i18n(s.headline)},
  tagline = ${i18n(s.tagline)},
  location = ${i18n(s.location)},
  availability = ${i18n(s.availability)},
  show_availability = ${s.show_availability},
  hero_tags = ${json(s.hero_tags)},
  about_title = ${i18n(s.about_title)},
  about_story = ${rich(s.about_story)},
  interests = ${json(s.interests)},
  fun_facts = ${json(s.fun_facts)},
  stats = ${json(s.stats)},
  contact_email = ${lit(s.contact_email)},
  contact_intro = ${i18n(s.contact_intro)},
  seo_title = ${i18n(s.seo_title)},
  seo_description = ${i18n(s.seo_description)}
where id = 1 and coalesce(full_name->>'en', '') = '';`);

// ---------------------------------------------------------------- social links

emit('-- Social links');
c.socialLinks.forEach((l, i) =>
  emit(`insert into public.social_links (id, platform, label, url, visible, position)
values (${uid('social:' + l.platform)}, ${lit(l.platform)}, ${i18n(l.label)}, ${lit(l.url)}, true, ${i})
on conflict (id) do nothing;`),
);

// ---------------------------------------------------------------- projects

emit('-- Project categories');
c.projectCategories.forEach((cat, i) =>
  emit(`insert into public.project_categories (id, slug, name, position)
values (${uid('category:' + cat.slug)}, ${lit(cat.slug)}, ${i18n(cat.name)}, ${i})
on conflict (slug) do nothing;`),
);

emit('-- Projects');
c.projects.forEach((p, i) => {
  const id = uid('project:' + p.slug);
  emit(`insert into public.projects (id, slug, title, label, summary, description, problem, approach, results, learnings,
  tools, cover_url, video_url, prototype_url, github_url, demo_url, report_url, start_date, end_date, is_ongoing,
  featured, status, position, published_at)
values (${id}, ${lit(p.slug)}, ${i18n(p.title)}, ${i18n(p.label)}, ${i18n(p.summary)},
  ${rich(p.description)}, ${rich(p.problem)}, ${rich(p.approach)}, ${rich(p.results)}, ${rich(p.learnings)},
  ${arr(p.tools)}, ${lit(p.cover_url)}, ${lit(p.video_url)}, ${lit(p.prototype_url)}, ${lit(p.github_url)},
  ${lit(p.demo_url)}, ${lit(p.report_url)}, ${lit(p.start_date)}, ${lit(p.end_date)}, ${Boolean(p.is_ongoing)},
  ${Boolean(p.featured)}, ${lit(p.status)}, ${i}, ${p.status === 'published' ? 'now()' : 'null'})
on conflict (slug) do nothing;`);
  for (const cat of p.categories ?? []) {
    emit(`insert into public.project_category_links (project_id, category_id)
select p.id, c.id from public.projects p, public.project_categories c
where p.slug = ${lit(p.slug)} and c.slug = ${lit(cat)}
on conflict do nothing;`);
  }
  (p.gallery ?? []).forEach(([url, en, ar], j) =>
    emit(`insert into public.project_media (id, project_id, kind, url, caption, position)
select ${uid(`media:${p.slug}:${j}`)}, id, 'image', ${lit(url)}, ${i18n({ en, ar })}, ${j}
from public.projects where slug = ${lit(p.slug)}
on conflict (id) do nothing;`),
  );
});

// ---------------------------------------------------------------- skills

emit('-- Skills');
c.skillCategories.forEach((cat, i) => {
  emit(`insert into public.skill_categories (id, name, icon, status, position)
values (${uid('skillcat:' + cat.key)}, ${i18n(cat.name)}, ${lit(cat.icon)}, 'published', ${i})
on conflict (id) do nothing;`);
  cat.skills.forEach((skill, j) => {
    const [en, ar] = Array.isArray(skill) ? skill : [skill, skill];
    emit(`insert into public.skills (id, category_id, name, status, position)
values (${uid(`skill:${cat.key}:${en}`)}, ${uid('skillcat:' + cat.key)}, ${i18n({ en, ar })}, 'published', ${j})
on conflict (id) do nothing;`);
  });
});

// ---------------------------------------------------------------- certificates

emit('-- Certificates');
c.certificates.forEach((cert, i) =>
  emit(`insert into public.certificates (id, slug, title, provider, issued_on, credential_url, image_url, pdf_url,
  summary, what_i_learned, what_i_gained, skills, status, position)
values (${uid('cert:' + cert.slug)}, ${lit(cert.slug)}, ${i18n(cert.title)}, ${i18n(cert.provider)}, ${lit(cert.issued_on)},
  ${lit(cert.credential_url)}, ${lit(cert.image_url)}, ${lit(cert.pdf_url)}, ${rich(cert.summary)},
  ${rich(cert.what_i_learned)}, ${rich(cert.what_i_gained)}, ${arr(cert.skills)}, ${lit(cert.status)}, ${i})
on conflict (slug) do nothing;`),
);

// ---------------------------------------------------------------- timeline

emit('-- Timeline');
c.timeline.forEach((t, i) =>
  emit(`insert into public.timeline_items (id, kind, title, organization, location, start_date, end_date, is_current,
  date_label, description, highlights, icon, link_url, status, position)
values (${uid('timeline:' + t.key)}, ${lit(t.kind)}, ${i18n(t.title)}, ${i18n(t.organization)}, ${i18n(t.location)},
  ${lit(t.start_date)}, ${lit(t.end_date)}, ${Boolean(t.is_current)}, ${i18n(t.date_label)}, ${i18n(t.description)},
  ${json(t.highlights ?? [])}, ${lit(t.icon)}, ${lit(t.link_url)}, 'published', ${i})
on conflict (id) do nothing;`),
);

// ---------------------------------------------------------------- analyses + charts

emit('-- Analyses, datasets and charts');
c.analyses.forEach((a, i) => {
  emit(`insert into public.analyses (id, slug, title, summary, insights, cover_url, tools, status, position, published_at)
values (${uid('analysis:' + a.slug)}, ${lit(a.slug)}, ${i18n(a.title)}, ${i18n(a.summary)}, ${rich(a.insights)},
  ${lit(a.cover_url)}, ${arr(a.tools)}, ${lit(a.status)}, ${i}, ${a.status === 'published' ? 'now()' : 'null'})
on conflict (slug) do nothing;`);
  if (a.dataset) {
    const d = a.dataset;
    emit(`insert into public.datasets (id, name, source_format, columns, rows, row_count)
values (${uid('dataset:' + a.slug)}, ${lit(d.name)}, 'json', ${json(d.columns)}, ${json(d.rows)}, ${d.rows.length})
on conflict (id) do nothing;`);
  }
  if (a.chart) {
    const ch = a.chart;
    emit(`insert into public.charts (id, dataset_id, title, caption, chart_type, x_column, y_columns, options, analysis_id, status, position)
select ${uid('chart:' + a.slug)}, ${uid('dataset:' + a.slug)}, ${i18n(ch.title)}, ${i18n(ch.caption)}, ${lit(ch.chart_type)},
  ${lit(ch.x_column)}, ${arr(ch.y_columns)}, ${json(ch.options)}, id, 'published', 0
from public.analyses where slug = ${lit(a.slug)}
on conflict (id) do nothing;`);
  }
});

const header = `-- =============================================================================
-- Portfolio content seed — GENERATED by scripts/build-seed.mjs from
-- supabase/seed/content.mjs. Edit that file, then: node scripts/build-seed.mjs
-- Safe to run more than once (won't duplicate rows or overwrite admin edits).
-- =============================================================================
`;

writeFileSync(OUT, header + '\nbegin;\n\n' + sql.join('\n') + '\ncommit;\n');
console.log(`Wrote ${OUT} (${sql.length} statements)`);
