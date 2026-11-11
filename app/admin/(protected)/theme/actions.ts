'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { isHexColor } from '@/lib/theme/contrast';
import { BODY_FONTS, BODY_FONTS_AR, HEADING_FONTS, HEADING_FONTS_AR } from '@/lib/theme/fonts';
import { findPreset } from '@/lib/theme/presets';
import { COLOR_KEYS, type Theme } from '@/lib/theme/types';

type Result = { ok: true; id?: string } | { ok: false; message: string };

/** Validates a theme coming from the browser; returns a clean copy or an error. */
function clean(theme: Theme): { theme?: Omit<Theme, 'id' | 'is_active' | 'is_preset'>; error?: string } {
  const name = theme.name?.trim().slice(0, 60);
  if (!name) return { error: 'Theme name is required.' };

  for (const mode of ['light', 'dark'] as const) {
    for (const key of COLOR_KEYS) {
      if (!isHexColor(theme.colors?.[mode]?.[key] ?? '')) return { error: `Invalid ${mode} color: ${key}` };
    }
  }
  const f = theme.fonts;
  if (
    !HEADING_FONTS.includes(f?.heading) ||
    !BODY_FONTS.includes(f?.body) ||
    !HEADING_FONTS_AR.includes(f?.headingAr) ||
    !BODY_FONTS_AR.includes(f?.bodyAr)
  ) {
    return { error: 'Unknown font.' };
  }
  if (!/^\d+(\.\d+)?rem$/.test(theme.radius)) return { error: 'Invalid border radius.' };
  if (!['off', 'subtle', 'playful'].includes(theme.motion_level)) return { error: 'Invalid animation level.' };

  const pick = (p: Theme['colors']['light']) => Object.fromEntries(COLOR_KEYS.map((k) => [k, p[k].toUpperCase()])) as Theme['colors']['light'];

  return {
    theme: {
      name,
      colors: { light: pick(theme.colors.light), dark: pick(theme.colors.dark) },
      fonts: { heading: f.heading, body: f.body, headingAr: f.headingAr, bodyAr: f.bodyAr },
      radius: theme.radius,
      motion_level: theme.motion_level,
      cursor_glow: Boolean(theme.cursor_glow),
    },
  };
}

function refresh() {
  revalidatePath('/', 'layout');
}

export async function saveTheme(id: string, input: Theme): Promise<Result> {
  await requireAdmin();
  const { theme, error } = clean(input);
  if (!theme) return { ok: false, message: error! };
  const supabase = await createClient();
  const { error: dbError } = await supabase.from('themes').update(theme).eq('id', id);
  if (dbError) return { ok: false, message: dbError.code === '23505' ? 'A theme with that name already exists.' : dbError.message };
  refresh();
  return { ok: true, id };
}

export async function createTheme(input: Theme): Promise<Result> {
  await requireAdmin();
  const { theme, error } = clean(input);
  if (!theme) return { ok: false, message: error! };
  const supabase = await createClient();
  const { data, error: dbError } = await supabase
    .from('themes')
    .insert({ ...theme, is_preset: false, is_active: false })
    .select('id')
    .single();
  if (dbError) return { ok: false, message: dbError.code === '23505' ? 'A theme with that name already exists.' : dbError.message };
  return { ok: true, id: data.id };
}

/** Makes one theme live on the public site. */
export async function activateTheme(id: string): Promise<Result> {
  await requireAdmin();
  const supabase = await createClient();
  // Only one theme can be active (unique index), so switch the old one off first.
  const { error: offError } = await supabase.from('themes').update({ is_active: false }).eq('is_active', true);
  if (offError) return { ok: false, message: offError.message };
  const { error } = await supabase.from('themes').update({ is_active: true }).eq('id', id);
  if (error) return { ok: false, message: error.message };
  refresh();
  return { ok: true, id };
}

export async function deleteTheme(id: string): Promise<Result> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from('themes').select('is_preset, is_active').eq('id', id).single();
  if (data?.is_preset) return { ok: false, message: 'Presets can be reset but not deleted.' };
  if (data?.is_active) return { ok: false, message: 'Activate another theme before deleting this one.' };
  const { error } = await supabase.from('themes').delete().eq('id', id);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

/** Restores a preset's original values. */
export async function resetPreset(id: string, name: string): Promise<Result> {
  const preset = findPreset(name);
  if (!preset) return { ok: false, message: 'Not a built-in preset.' };
  return saveTheme(id, preset);
}
