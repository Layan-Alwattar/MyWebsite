import 'server-only';
import { tr } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import type { Option } from '@/components/admin/field-controls';
import type { ListRow } from '@/components/admin/entity-list';
import { defaultValues } from './defaults';
import type { EntityConfig } from './entities';
import type { FieldDef } from './fields';

type Row = Record<string, unknown>;

/** Rows for the list screen, trimmed to what the list needs. */
export async function loadListRows(entity: EntityConfig): Promise<{ rows: ListRow[]; error?: string }> {
  const supabase = await createClient();
  const order = entity.sortable ? { column: 'position', ascending: true } : (entity.orderBy ?? { column: 'created_at', ascending: false });

  const { data, error } = await supabase.from(entity.table).select('*').order(order.column, { ascending: order.ascending });
  if (error) return { rows: [], error: error.message };

  return {
    rows: (data as Row[]).map((row) => ({
      id: row.id as string,
      title: tr(row[entity.titleColumn], 'en'),
      subtitle: entity.subtitle?.(row) ?? '',
      status: entity.hasStatus ? (row.status as ListRow['status']) : null,
      updatedAt: (row.updated_at as string) ?? null,
      previewPath: entity.publicPath?.(row) ?? null,
    })),
  };
}

/** Dropdown/chip options for relation and many-to-many fields. */
export async function loadFieldOptions(fields: FieldDef[]) {
  const supabase = await createClient();
  const options: Record<string, Option[]> = {};

  await Promise.all(
    fields.map(async (f) => {
      if (f.type !== 'relation' && f.type !== 'm2m') return;
      const table = f.type === 'relation' ? f.table : f.optionsTable;
      const { data } = await supabase.from(table).select(`id, ${f.labelColumn}`).order('position');
      options[f.name] = ((data ?? []) as unknown as Row[]).map((r) => ({
        value: r.id as string,
        label: tr(r[f.labelColumn], 'en') || 'Untitled',
      }));
    }),
  );
  return options;
}

/** Values for the edit form, including virtual (m2m, gallery) fields. Null = not found. */
export async function loadFormValues(entity: EntityConfig, id: string | null) {
  if (!id) return { ...defaultValues(entity.fields), ...(entity.hasStatus ? { status: 'draft' } : {}) };

  const supabase = await createClient();
  const { data: row, error } = await supabase.from(entity.table).select('*').eq('id', id).maybeSingle();
  if (error || !row) return null;

  const values: Row = { ...defaultValues(entity.fields), ...stripNulls(row as Row, entity.fields) };

  for (const f of entity.fields) {
    if (f.type === 'm2m') {
      const { data } = await supabase.from(f.linkTable).select(f.otherKey).eq(f.ownKey, id);
      values[f.name] = ((data ?? []) as unknown as Row[]).map((r) => r[f.otherKey]);
    }
    if (f.type === 'gallery') {
      const { data } = await supabase.from(f.table).select('kind, url, caption').eq(f.foreignKey, id).order('position');
      values[f.name] = ((data ?? []) as Row[]).map((r) => ({ ...r, _key: crypto.randomUUID() }));
    }
  }
  return values;
}

/** Keep defaults for columns that are null in the DB (e.g. i18n objects). */
function stripNulls(row: Row, fields: FieldDef[]) {
  const out: Row = { ...row };
  for (const f of fields) if (out[f.name] === null && f.type !== 'number' && f.type !== 'media') delete out[f.name];
  return out;
}
