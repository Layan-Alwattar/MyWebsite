import 'server-only';
/**
 * Data access for the public site.
 *
 * Normal visitors: anonymous, cookie-free client → pages can be statically
 * cached, and RLS only returns published rows.
 * Preview (draft mode, admin only): cookie-based client → drafts included.
 */
import { draftMode } from 'next/headers';
import { cache } from 'react';
import type { ChartSpec, DataRow } from '@/lib/charts/data';
import type { I18nRich, I18nText } from '@/lib/i18n';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createPublicClient } from '@/lib/supabase/public';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_THEME } from '@/lib/theme/presets';
import type { Theme } from '@/lib/theme/types';

// ---------------------------------------------------------------- types

export type Settings = {
  full_name: I18nText;
  headline: I18nText;
  tagline: I18nText;
  location: I18nText;
  availability: I18nText;
  show_availability: boolean;
  photo_url: string | null;
  hero_tags: I18nText[];
  cv_url: Partial<Record<'en' | 'ar', string>>;
  about_title: I18nText;
  about_story: I18nRich;
  interests: { icon: string; label: I18nText }[];
  fun_facts: { emoji: string; text: I18nText }[];
  stats: { value: number; suffix: string; label: I18nText }[];
  contact_email: string | null;
  contact_intro: I18nText;
  seo_title: I18nText;
  seo_description: I18nText;
  og_image_url: string | null;
};

export type Section = { key: string; label: I18nText; visible: boolean };
export type SocialLink = { id: string; platform: string; label: I18nText; url: string };
export type Category = { id: string; slug: string; name: I18nText };

export type ProjectCard = {
  id: string;
  slug: string;
  title: I18nText;
  label: I18nText;
  summary: I18nText;
  tools: string[];
  cover_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_ongoing: boolean;
  featured: boolean;
  status: string;
  categories: string[]; // category slugs
};

export type ChartWithData = {
  id: string;
  title: I18nText;
  caption: I18nText;
  spec: ChartSpec;
  rows: DataRow[];
};

export type ProjectDetail = ProjectCard & {
  description: I18nRich;
  problem: I18nRich;
  approach: I18nRich;
  results: I18nRich;
  learnings: I18nRich;
  video_url: string | null;
  prototype_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  report_url: string | null;
  media: { kind: 'image' | 'video'; url: string; caption: I18nText }[];
  charts: ChartWithData[];
};

export type SkillCategory = { id: string; name: I18nText; icon: string | null; skills: { id: string; name: I18nText; icon: string | null; level: number | null }[] };

export type Certificate = {
  id: string;
  slug: string;
  title: I18nText;
  provider: I18nText;
  issued_on: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  pdf_url: string | null;
  summary: I18nRich;
  what_i_learned: I18nRich;
  what_i_gained: I18nRich;
  skills: string[];
};

export type Post = {
  id: string;
  slug: string;
  title: I18nText;
  excerpt: I18nText;
  content: I18nRich;
  cover_url: string | null;
  tags: string[];
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string;
};

export type TimelineItem = {
  id: string;
  kind: 'education' | 'achievement' | 'experience';
  title: I18nText;
  organization: I18nText;
  location: I18nText;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  date_label: I18nText;
  description: I18nText;
  highlights: I18nText[];
  icon: string | null;
  link_url: string | null;
};

export type Analysis = {
  id: string;
  slug: string;
  title: I18nText;
  summary: I18nText;
  insights: I18nRich;
  cover_url: string | null;
  tools: string[];
  published_at: string | null;
  charts?: ChartWithData[];
};

// ---------------------------------------------------------------- client

async function db() {
  const { isEnabled } = await draftMode();
  return isEnabled ? await createClient() : createPublicClient();
}

type Row = Record<string, unknown>;

function toChart(c: Row): ChartWithData {
  return {
    id: c.id as string,
    title: c.title as I18nText,
    caption: c.caption as I18nText,
    spec: {
      chart_type: c.chart_type as ChartSpec['chart_type'],
      x_column: c.x_column as string,
      y_columns: c.y_columns as string[],
      options: (c.options ?? {}) as ChartSpec['options'],
    },
    rows: ((c.datasets as { rows?: DataRow[] } | null)?.rows ?? []) as DataRow[],
  };
}

const CARD_COLUMNS = 'id, slug, title, label, summary, tools, cover_url, start_date, end_date, is_ongoing, featured, status, project_category_links(project_categories(slug))';

function toCard(r: Row): ProjectCard {
  const links = (r.project_category_links as { project_categories: { slug: string } | null }[] | null) ?? [];
  const { project_category_links: _links, ...rest } = r;
  void _links;
  return { ...(rest as unknown as ProjectCard), categories: links.map((l) => l.project_categories?.slug).filter(Boolean) as string[] };
}

// ---------------------------------------------------------------- queries

export const getSettings = cache(async (): Promise<Settings | null> => {
  if (!isSupabaseConfigured) return null;
  const { data } = await (await db()).from('site_settings').select('*').eq('id', 1).maybeSingle();
  return (data as Settings | null) ?? null;
});

export const getActiveTheme = cache(async (): Promise<Theme> => {
  if (!isSupabaseConfigured) return DEFAULT_THEME;
  const { data } = await (await db())
    .from('themes')
    .select('name, colors, fonts, radius, motion_level, cursor_glow')
    .eq('is_active', true)
    .maybeSingle();
  return (data as Theme | null) ?? DEFAULT_THEME;
});

export const getSections = cache(async (): Promise<Section[]> => {
  const { data } = await (await db()).from('sections').select('key, label, visible').order('position');
  return (data ?? []) as Section[];
});

export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const { data } = await (await db()).from('social_links').select('id, platform, label, url').eq('visible', true).order('position');
  return (data ?? []) as SocialLink[];
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data } = await (await db()).from('project_categories').select('id, slug, name').order('position');
  return (data ?? []) as Category[];
});

export const getProjects = cache(async (): Promise<ProjectCard[]> => {
  const { data } = await (await db()).from('projects').select(CARD_COLUMNS).order('position');
  return ((data ?? []) as Row[]).map(toCard);
});

export const getProject = cache(async (slug: string): Promise<ProjectDetail | null> => {
  const client = await db();
  const { data } = await client
    .from('projects')
    .select(`*, project_category_links(project_categories(slug)), project_media(kind, url, caption, position), charts(id, title, caption, chart_type, x_column, y_columns, options, position, status, datasets(rows))`)
    .eq('slug', slug)
    .maybeSingle();
  if (!data) return null;
  const r = data as Row;
  const card = toCard(r);
  const media = ((r.project_media as (Row & { position: number })[]) ?? []).sort((a, b) => a.position - b.position);
  const charts = ((r.charts as (Row & { position: number })[]) ?? []).sort((a, b) => a.position - b.position).map(toChart);
  return { ...(r as unknown as ProjectDetail), ...card, media: media as unknown as ProjectDetail['media'], charts };
});

export const getSkills = cache(async (): Promise<SkillCategory[]> => {
  const { data } = await (await db())
    .from('skill_categories')
    .select('id, name, icon, position, skills(id, name, icon, level, position, status)')
    .order('position');
  return ((data ?? []) as Row[]).map((c) => ({
    ...(c as unknown as SkillCategory),
    skills: ((c.skills as (Row & { position: number })[]) ?? []).sort((a, b) => a.position - b.position) as unknown as SkillCategory['skills'],
  }));
});

export const getCertificates = cache(async (): Promise<Certificate[]> => {
  const { data } = await (await db()).from('certificates').select('*').order('position');
  return (data ?? []) as Certificate[];
});

export const getCertificate = cache(async (slug: string): Promise<Certificate | null> => {
  const { data } = await (await db()).from('certificates').select('*').eq('slug', slug).maybeSingle();
  return (data as Certificate | null) ?? null;
});

export const getPosts = cache(async (): Promise<Post[]> => {
  const { data } = await (await db()).from('posts').select('*').order('published_at', { ascending: false, nullsFirst: true });
  return (data ?? []) as Post[];
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const { data } = await (await db()).from('posts').select('*').eq('slug', slug).maybeSingle();
  return (data as Post | null) ?? null;
});

export const getTimeline = cache(async (): Promise<TimelineItem[]> => {
  const { data } = await (await db()).from('timeline_items').select('*').order('position');
  return (data ?? []) as TimelineItem[];
});

export const getAnalyses = cache(async (): Promise<Analysis[]> => {
  const { data } = await (await db()).from('analyses').select('id, slug, title, summary, insights, cover_url, tools, published_at').order('position');
  return (data ?? []) as Analysis[];
});

export const getAnalysis = cache(async (slug: string): Promise<Analysis | null> => {
  const { data } = await (await db())
    .from('analyses')
    .select('*, charts(id, title, caption, chart_type, x_column, y_columns, options, position, status, datasets(rows))')
    .eq('slug', slug)
    .maybeSingle();
  if (!data) return null;
  const r = data as Row;
  const charts = ((r.charts as (Row & { position: number })[]) ?? []).sort((a, b) => a.position - b.position).map(toChart);
  return { ...(r as unknown as Analysis), charts };
});

/** Slugs for static generation (published only, anonymous client — no cookies at build time). */
export async function getPublishedSlugs(table: 'projects' | 'certificates' | 'posts' | 'analyses') {
  if (!isSupabaseConfigured) return [];
  const { data } = await createPublicClient().from(table).select('slug');
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
}
