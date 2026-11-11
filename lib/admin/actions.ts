'use server';

/**
 * Generic Server Actions behind every admin list and form.
 * Each action:
 *   1. checks the caller is the admin (requireAdmin)
 *   2. writes through the cookie-based client, so RLS double-checks it
 *   3. refreshes the public site's cache
 */
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getEntity, SETTINGS_FIELDS } from './entities';
import type { GalleryItem } from './fields';
import { normalizeValues, type FieldErrors } from './normalize';

export type SaveResult =
  | { ok: true; id: string }
  | { ok: false; message: string; errors?: FieldErrors };

type Values = Record<string, unknown>;

/** Re-render the public site so changes are visible immediately. */
function refreshSite() {
  revalidatePath('/', 'layout');
}

function entityOrThrow(key: string) {
  const entity = getEntity(key);
  if (!entity) throw new Error(`Unknown content type: ${key}`);
  return entity;
}

export async function saveEntity(key: string, id: string | null, values: Values): Promise<SaveResult> {
  await requireAdmin();
  const entity = entityOrThrow(key);
  const supabase = await createClient();

  const { row, virtual, errors } = normalizeValues(entity.fields, values);
  if (Object.keys(errors).length) {
    return { ok: false, message: 'Please fix the highlighted fields.', errors };
  }

  if (entity.hasStatus) {
    row.status = values.status === 'published' ? 'published' : 'draft';
  }

  // Stamp published_at the first time an item goes live.
  if (entity.hasPublishedAt && row.status === 'published') {
    let existing: string | null = null;
    if (id) {
      const { data } = await supabase.from(entity.table).select('published_at').eq('id', id).single();
      existing = (data?.published_at as string | null) ?? null;
    }
    row.published_at = existing ?? new Date().toISOString();
  }

  // New sortable items go to the end of the list.
  if (!id && entity.sortable) {
    const { data } = await supabase
      .from(entity.table)
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();
    row.position = ((data?.position as number | undefined) ?? -1) + 1;
  }

  const query = id
    ? supabase.from(entity.table).update(row).eq('id', id).select('id').single()
    : supabase.from(entity.table).insert(row).select('id').single();
  const { data, error } = await query;

  if (error) {
    if (error.code === '23505') {
      return { ok: false, message: 'That slug is already used.', errors: { slug: 'Already used by another item.' } };
    }
    return { ok: false, message: error.message };
  }
  const savedId = data.id as string;

  // Related rows (categories, gallery) are replaced wholesale.
  for (const field of entity.fields) {
    if (field.type === 'm2m') {
      const ids = (virtual[field.name] as string[]) ?? [];
      await supabase.from(field.linkTable).delete().eq(field.ownKey, savedId);
      if (ids.length) {
        const { error: linkError } = await supabase
          .from(field.linkTable)
          .insert(ids.map((otherId) => ({ [field.ownKey]: savedId, [field.otherKey]: otherId })));
        if (linkError) return { ok: false, message: `Saved, but ${field.label}: ${linkError.message}` };
      }
    }
    if (field.type === 'gallery') {
      const items = (virtual[field.name] as GalleryItem[]) ?? [];
      await supabase.from(field.table).delete().eq(field.foreignKey, savedId);
      if (items.length) {
        const { error: galleryError } = await supabase.from(field.table).insert(
          items.map((item, position) => ({
            [field.foreignKey]: savedId,
            kind: item.kind,
            url: item.url,
            caption: item.caption,
            position,
          })),
        );
        if (galleryError) return { ok: false, message: `Saved, but ${field.label}: ${galleryError.message}` };
      }
    }
  }

  refreshSite();
  return { ok: true, id: savedId };
}

export async function deleteEntity(key: string, id: string) {
  await requireAdmin();
  const entity = entityOrThrow(key);
  const supabase = await createClient();
  const { error } = await supabase.from(entity.table).delete().eq('id', id);
  if (error) return { ok: false as const, message: error.message };
  refreshSite();
  return { ok: true as const };
}

export async function setEntityStatus(key: string, id: string, status: 'draft' | 'published') {
  await requireAdmin();
  const entity = entityOrThrow(key);
  if (!entity.hasStatus) return { ok: false as const, message: 'This type has no status.' };
  const supabase = await createClient();

  const patch: Values = { status };
  if (status === 'published' && entity.hasPublishedAt) {
    const { data } = await supabase.from(entity.table).select('published_at').eq('id', id).single();
    if (!data?.published_at) patch.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from(entity.table).update(patch).eq('id', id);
  if (error) return { ok: false as const, message: error.message };
  refreshSite();
  return { ok: true as const };
}

/** Saves a new manual order: ids[0] gets position 0, etc. */
export async function reorderEntity(key: string, ids: string[]) {
  await requireAdmin();
  const entity = entityOrThrow(key);
  if (!entity.sortable) return { ok: false as const, message: 'Not sortable.' };
  const supabase = await createClient();

  const results = await Promise.all(
    ids.map((id, position) => supabase.from(entity.table).update({ position }).eq('id', id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false as const, message: failed.error.message };
  refreshSite();
  return { ok: true as const };
}

/** Site settings: single row with id = 1. */
export async function saveSettings(values: Values): Promise<SaveResult> {
  await requireAdmin();
  const { row, errors } = normalizeValues(SETTINGS_FIELDS, values);
  if (Object.keys(errors).length) {
    return { ok: false, message: 'Please fix the highlighted fields.', errors };
  }
  const supabase = await createClient();
  const { error } = await supabase.from('site_settings').upsert({ id: 1, ...row });
  if (error) return { ok: false, message: error.message };
  refreshSite();
  return { ok: true, id: '1' };
}
