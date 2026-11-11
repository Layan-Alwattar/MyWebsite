'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export type SectionRow = { key: string; label: { en: string; ar: string }; visible: boolean };

/** Saves order (array order = position), visibility and labels in one go. */
export async function saveSections(rows: SectionRow[]) {
  await requireAdmin();
  const supabase = await createClient();

  const results = await Promise.all(
    rows.map((row, position) =>
      supabase
        .from('sections')
        .update({
          position,
          visible: Boolean(row.visible),
          label: { en: String(row.label?.en ?? '').trim().slice(0, 60), ar: String(row.label?.ar ?? '').trim().slice(0, 60) },
        })
        .eq('key', row.key),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false as const, message: failed.error.message };

  revalidatePath('/', 'layout');
  return { ok: true as const };
}
