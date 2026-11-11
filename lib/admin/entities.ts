/**
 * Every content type the admin portal can manage through the generic
 * list + form screens. URL: /admin/<key>   (e.g. /admin/projects)
 *
 * Safe to import on both server and client (no secrets, no server APIs).
 */
import type { FieldDef } from './fields';

export type EntityConfig = {
  key: string;
  table: string;
  /** Plural label for menus and list headings. */
  label: string;
  /** Singular label for buttons ("New project"). */
  singular: string;
  description?: string;
  /** Column (i18n) used as the row title in lists. */
  titleColumn: string;
  /** Optional secondary text in lists. */
  subtitle?: (row: Record<string, unknown>) => string;
  /** Has a draft/published status column. */
  hasStatus: boolean;
  /** Has a published_at column to stamp on first publish. */
  hasPublishedAt?: boolean;
  /** Has a manual `position` column → drag-to-reorder in the list. */
  sortable: boolean;
  /** Default ordering when not sortable. */
  orderBy?: { column: string; ascending: boolean };
  /** Public URL of an item, used by the Preview button (path without locale). */
  publicPath?: (row: Record<string, unknown>) => string | null;
  fields: FieldDef[];
};

const timelineKinds = [
  { value: 'education', label: 'Education' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'experience', label: 'Experience' },
];

const formatDate = (d: unknown) => (typeof d === 'string' && d ? d.slice(0, 7) : '');

export const ENTITIES: EntityConfig[] = [
  // ---------------------------------------------------------------- Projects
  {
    key: 'projects',
    table: 'projects',
    label: 'Projects',
    singular: 'project',
    description: 'Case studies shown in the Projects grid, each with its own page.',
    titleColumn: 'title',
    subtitle: (r) => ((r.tools as string[]) ?? []).slice(0, 4).join(' · '),
    hasStatus: true,
    hasPublishedAt: true,
    sortable: true,
    publicPath: (r) => `/projects/${r.slug}`,
    fields: [
      { group: 'Basics', name: 'title', label: 'Title', type: 'i18n-text', required: true },
      { group: 'Basics', name: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true },
      { group: 'Basics', name: 'label', label: 'Label', type: 'i18n-text', help: 'Small tag above the title, e.g. "Senior Capstone".' },
      { group: 'Basics', name: 'summary', label: 'Card summary', type: 'i18n-text', multiline: true, maxLength: 400 },
      {
        group: 'Basics',
        name: 'categories',
        label: 'Categories (filters)',
        type: 'm2m',
        optionsTable: 'project_categories',
        labelColumn: 'name',
        linkTable: 'project_category_links',
        ownKey: 'project_id',
        otherKey: 'category_id',
      },
      { group: 'Basics', name: 'tools', label: 'Tools & tech', type: 'tags', placeholder: 'Python, PyTorch…' },
      { group: 'Basics', name: 'featured', label: 'Featured on homepage', type: 'boolean' },
      { group: 'Dates', name: 'start_date', label: 'Start date', type: 'date' },
      { group: 'Dates', name: 'end_date', label: 'End date', type: 'date' },
      { group: 'Dates', name: 'is_ongoing', label: 'Ongoing', type: 'boolean' },
      { group: 'Media', name: 'cover_url', label: 'Cover image', type: 'media', accept: 'image' },
      { group: 'Media', name: 'video_url', label: 'Video', type: 'media', accept: 'video', help: 'Upload a file, or paste a YouTube / Vimeo link.' },
      { group: 'Media', name: 'gallery', label: 'Photo gallery', type: 'gallery', table: 'project_media', foreignKey: 'project_id' },
      { group: 'Story', name: 'description', label: 'Overview', type: 'i18n-rich' },
      { group: 'Story', name: 'problem', label: 'Problem', type: 'i18n-rich' },
      { group: 'Story', name: 'approach', label: 'Approach', type: 'i18n-rich' },
      { group: 'Story', name: 'results', label: 'Results', type: 'i18n-rich' },
      { group: 'Story', name: 'learnings', label: 'What I learned', type: 'i18n-rich' },
      { group: 'Links', name: 'github_url', label: 'GitHub', type: 'url' },
      { group: 'Links', name: 'demo_url', label: 'Live demo', type: 'url' },
      { group: 'Links', name: 'prototype_url', label: 'Prototype embed (Figma…)', type: 'url' },
      { group: 'Links', name: 'report_url', label: 'Paper / report PDF', type: 'media', accept: 'pdf' },
    ],
  },
  {
    key: 'project-categories',
    table: 'project_categories',
    label: 'Project categories',
    singular: 'category',
    description: 'Filter chips on the Projects section (AI/ML, Full-Stack, …).',
    titleColumn: 'name',
    hasStatus: false,
    sortable: true,
    fields: [
      { name: 'name', label: 'Name', type: 'i18n-text', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', from: 'name', required: true },
    ],
  },

  // ---------------------------------------------------------------- Skills
  {
    key: 'skills',
    table: 'skills',
    label: 'Skills',
    singular: 'skill',
    titleColumn: 'name',
    hasStatus: true,
    sortable: true,
    fields: [
      { name: 'name', label: 'Name', type: 'i18n-text', required: true },
      { name: 'category_id', label: 'Category', type: 'relation', table: 'skill_categories', labelColumn: 'name', nullable: true },
      { name: 'icon', label: 'Icon', type: 'text', placeholder: 'brain, code, database…', help: 'Any icon name from lucide.dev/icons.' },
      { name: 'level', label: 'Level (0–100)', type: 'number', min: 0, max: 100, help: 'Optional. Leave empty to hide the bar.' },
      { name: 'featured', label: 'Show as a focus tag in the hero', type: 'boolean' },
    ],
  },
  {
    key: 'skill-categories',
    table: 'skill_categories',
    label: 'Skill categories',
    singular: 'category',
    titleColumn: 'name',
    hasStatus: true,
    sortable: true,
    fields: [
      { name: 'name', label: 'Name', type: 'i18n-text', required: true },
      { name: 'icon', label: 'Icon', type: 'text', placeholder: 'cpu', help: 'Any icon name from lucide.dev/icons.' },
    ],
  },

  // ---------------------------------------------------------------- Certificates
  {
    key: 'certificates',
    table: 'certificates',
    label: 'Courses & certificates',
    singular: 'certificate',
    titleColumn: 'title',
    subtitle: (r) => [(r.provider as { en?: string })?.en, formatDate(r.issued_on)].filter(Boolean).join(' · '),
    hasStatus: true,
    sortable: true,
    publicPath: (r) => `/certificates/${r.slug}`,
    fields: [
      { group: 'Basics', name: 'title', label: 'Course / certificate', type: 'i18n-text', required: true },
      { group: 'Basics', name: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true },
      { group: 'Basics', name: 'provider', label: 'Provider', type: 'i18n-text', help: 'e.g. Coursera · DeepLearning.AI' },
      { group: 'Basics', name: 'issued_on', label: 'Issued on', type: 'date' },
      { group: 'Basics', name: 'skills', label: 'Skills covered', type: 'tags' },
      { group: 'Proof', name: 'image_url', label: 'Certificate image', type: 'media', accept: 'image' },
      { group: 'Proof', name: 'pdf_url', label: 'Certificate PDF', type: 'media', accept: 'pdf' },
      { group: 'Proof', name: 'credential_id', label: 'Credential ID', type: 'text' },
      { group: 'Proof', name: 'credential_url', label: 'Verification link', type: 'url' },
      { group: 'Reflection', name: 'summary', label: 'Course summary', type: 'i18n-rich' },
      { group: 'Reflection', name: 'what_i_learned', label: 'What I learned', type: 'i18n-rich' },
      { group: 'Reflection', name: 'what_i_gained', label: 'What I gained', type: 'i18n-rich' },
    ],
  },

  // ---------------------------------------------------------------- Reflections
  {
    key: 'posts',
    table: 'posts',
    label: 'Reflections',
    singular: 'reflection',
    titleColumn: 'title',
    subtitle: (r) => ((r.tags as string[]) ?? []).join(' · '),
    hasStatus: true,
    hasPublishedAt: true,
    sortable: false,
    orderBy: { column: 'created_at', ascending: false },
    publicPath: (r) => `/reflections/${r.slug}`,
    fields: [
      { name: 'title', label: 'Title', type: 'i18n-text', required: true },
      { name: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'i18n-text', multiline: true, maxLength: 300 },
      { name: 'cover_url', label: 'Cover image', type: 'media', accept: 'image' },
      { name: 'tags', label: 'Tags', type: 'tags' },
      { name: 'reading_minutes', label: 'Reading time (min)', type: 'number', min: 1, max: 120 },
      { name: 'content', label: 'Content', type: 'i18n-rich', required: true },
    ],
  },

  // ---------------------------------------------------------------- Timeline
  {
    key: 'timeline',
    table: 'timeline_items',
    label: 'Education & achievements',
    singular: 'timeline item',
    description: 'Entries in the animated Education & Achievements timeline.',
    titleColumn: 'title',
    subtitle: (r) => [timelineKinds.find((k) => k.value === r.kind)?.label, (r.organization as { en?: string })?.en].filter(Boolean).join(' · '),
    hasStatus: true,
    sortable: true,
    fields: [
      { name: 'kind', label: 'Type', type: 'select', options: timelineKinds, required: true },
      { name: 'title', label: 'Title', type: 'i18n-text', required: true },
      { name: 'organization', label: 'Organization', type: 'i18n-text' },
      { name: 'location', label: 'Location', type: 'i18n-text' },
      { name: 'start_date', label: 'Start date', type: 'date' },
      { name: 'end_date', label: 'End date', type: 'date' },
      { name: 'is_current', label: 'Current', type: 'boolean' },
      { name: 'date_label', label: 'Custom date text', type: 'i18n-text', help: 'Optional. Replaces the dates, e.g. "Class of 2026".' },
      { name: 'description', label: 'Description', type: 'i18n-text', multiline: true },
      { name: 'highlights', label: 'Highlights', type: 'i18n-list', itemLabel: 'highlight' },
      { name: 'icon', label: 'Icon', type: 'text', placeholder: 'graduation-cap, trophy…' },
      { name: 'link_url', label: 'Link', type: 'url' },
    ],
  },

  // ---------------------------------------------------------------- Analyses
  {
    key: 'analyses',
    table: 'analyses',
    label: 'Data & analysis',
    singular: 'analysis',
    description: 'Analysis showcases. Attach charts to them in the Chart builder.',
    titleColumn: 'title',
    hasStatus: true,
    hasPublishedAt: true,
    sortable: true,
    publicPath: (r) => `/analyses/${r.slug}`,
    fields: [
      { name: 'title', label: 'Title', type: 'i18n-text', required: true },
      { name: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true },
      { name: 'summary', label: 'Summary', type: 'i18n-text', multiline: true },
      { name: 'cover_url', label: 'Cover image', type: 'media', accept: 'image' },
      { name: 'tools', label: 'Tools', type: 'tags' },
      { name: 'insights', label: 'Insights & write-up', type: 'i18n-rich' },
    ],
  },

  // ---------------------------------------------------------------- Social links
  {
    key: 'social-links',
    table: 'social_links',
    label: 'Social links',
    singular: 'link',
    titleColumn: 'label',
    subtitle: (r) => String(r.url ?? ''),
    hasStatus: false,
    sortable: true,
    fields: [
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: ['github', 'linkedin', 'email', 'x', 'instagram', 'youtube', 'kaggle', 'medium', 'website', 'other'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })),
      },
      { name: 'label', label: 'Label', type: 'i18n-text', required: true },
      { name: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https:// or mailto:' },
      { name: 'visible', label: 'Visible', type: 'boolean' },
    ],
  },
];

export function getEntity(key: string) {
  return ENTITIES.find((e) => e.key === key);
}

/**
 * Site settings (single row) reuse the same form engine.
 */
export const SETTINGS_FIELDS: FieldDef[] = [
  { group: 'Hero', name: 'full_name', label: 'Name', type: 'i18n-text', required: true },
  { group: 'Hero', name: 'headline', label: 'Title / headline', type: 'i18n-text' },
  { group: 'Hero', name: 'tagline', label: 'Tagline', type: 'i18n-text', multiline: true },
  { group: 'Hero', name: 'photo_url', label: 'Profile photo', type: 'media', accept: 'image' },
  { group: 'Hero', name: 'location', label: 'Location', type: 'i18n-text' },
  { group: 'Hero', name: 'availability', label: 'Availability badge', type: 'i18n-text' },
  { group: 'Hero', name: 'show_availability', label: 'Show availability badge', type: 'boolean' },
  { group: 'Hero', name: 'hero_tags', label: 'Focus tags', type: 'i18n-list', itemLabel: 'tag' },
  { group: 'Hero', name: 'cv_url', label: 'CV (PDF)', type: 'media', accept: 'pdf', localized: true, help: 'You can upload a different CV per language.' },
  { group: 'About', name: 'about_title', label: 'Section title', type: 'i18n-text' },
  { group: 'About', name: 'about_story', label: 'My story', type: 'i18n-rich' },
  {
    group: 'About',
    name: 'interests',
    label: 'Interests',
    type: 'repeater',
    itemLabel: 'interest',
    fields: [
      { name: 'icon', label: 'Icon', type: 'text', placeholder: 'palette' },
      { name: 'label', label: 'Label', type: 'i18n-text' },
    ],
  },
  {
    group: 'About',
    name: 'fun_facts',
    label: 'Fun facts',
    type: 'repeater',
    itemLabel: 'fun fact',
    fields: [
      { name: 'emoji', label: 'Emoji', type: 'text', placeholder: '☕' },
      { name: 'text', label: 'Fact', type: 'i18n-text' },
    ],
  },
  {
    group: 'About',
    name: 'stats',
    label: 'Animated counters',
    type: 'repeater',
    itemLabel: 'counter',
    fields: [
      { name: 'value', label: 'Number', type: 'number' },
      { name: 'suffix', label: 'Suffix', type: 'text', placeholder: '+ or %' },
      { name: 'label', label: 'Label', type: 'i18n-text' },
    ],
  },
  { group: 'Contact', name: 'contact_email', label: 'Contact email', type: 'email' },
  { group: 'Contact', name: 'contact_intro', label: 'Contact intro text', type: 'i18n-text', multiline: true },
  { group: 'SEO', name: 'seo_title', label: 'Site title (browser tab / Google)', type: 'i18n-text' },
  { group: 'SEO', name: 'seo_description', label: 'Site description', type: 'i18n-text', multiline: true, maxLength: 200 },
  { group: 'SEO', name: 'og_image_url', label: 'Social share image (1200×630)', type: 'media', accept: 'image' },
];
