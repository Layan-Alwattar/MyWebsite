'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { MAX_SERIES, type ChartOptions, type ChartType, type Column } from '@/lib/charts/data';
import { createClient } from '@/lib/supabase/server';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TYPES: ChartType[] = ['bar', 'line', 'area', 'pie', 'scatter'];

export type ChartInput = {
  dataset_id: string;
  title: { en: string; ar: string };
  caption: { en: string; ar: string };
  chart_type: ChartType;
  x_column: string;
  y_columns: string[];
  options: ChartOptions;
  attach: { kind: 'none' | 'project' | 'analysis'; id: string | null };
  status: 'draft' | 'published';
};

type Result = { ok: true; id: string } | { ok: false; message: string };

const text = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function saveChart(id: string | null, input: ChartInput): Promise<Result> {
  await requireAdmin();
  const supabase = await createClient();

  if (!UUID_RE.test(input.dataset_id)) return { ok: false, message: 'Choose a dataset.' };
  if (!TYPES.includes(input.chart_type)) return { ok: false, message: 'Choose a chart type.' };
  const title = { en: text(input.title?.en), ar: text(input.title?.ar) };
  if (!title.en && !title.ar) return { ok: false, message: 'Give the chart a title.' };

  // Columns must exist in the dataset.
  const { data: dataset, error: dsError } = await supabase.from('datasets').select('columns').eq('id', input.dataset_id).single();
  if (dsError || !dataset) return { ok: false, message: 'Dataset not found.' };
  const names = new Set((dataset.columns as Column[]).map((c) => c.name));
  if (!names.has(input.x_column)) return { ok: false, message: 'Choose the X column.' };
  const yColumns = (input.y_columns ?? []).filter((y) => names.has(y)).slice(0, MAX_SERIES[input.chart_type]);
  if (!yColumns.length && input.options?.aggregate !== 'count') return { ok: false, message: 'Choose at least one value column.' };

  const o = input.options ?? {};
  const options: ChartOptions = {
    aggregate: ['none', 'sum', 'mean', 'count'].includes(o.aggregate ?? '') ? o.aggregate : 'none',
    sort: ['none', 'asc', 'desc'].includes(o.sort ?? '') ? o.sort : 'none',
    limit: typeof o.limit === 'number' && o.limit > 0 ? Math.min(Math.round(o.limit), 500) : null,
    stacked: Boolean(o.stacked),
    horizontal: Boolean(o.horizontal),
    xLabel: text(o.xLabel, 60),
    yLabel: text(o.yLabel, 60),
  };

  const attachId = input.attach?.id && UUID_RE.test(input.attach.id) ? input.attach.id : null;
  const row = {
    dataset_id: input.dataset_id,
    title,
    caption: { en: text(input.caption?.en, 400), ar: text(input.caption?.ar, 400) },
    chart_type: input.chart_type,
    x_column: input.x_column,
    y_columns: yColumns,
    options,
    project_id: input.attach?.kind === 'project' ? attachId : null,
    analysis_id: input.attach?.kind === 'analysis' ? attachId : null,
    status: input.status === 'published' ? 'published' : 'draft',
  };

  const { data, error } = id
    ? await supabase.from('charts').update(row).eq('id', id).select('id').single()
    : await supabase.from('charts').insert(row).select('id').single();
  if (error) return { ok: false, message: error.message };

  revalidatePath('/', 'layout');
  return { ok: true, id: data.id };
}

export async function deleteChart(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('charts').delete().eq('id', id);
  if (error) return { ok: false as const, message: error.message };
  revalidatePath('/', 'layout');
  return { ok: true as const };
}

/** Deletes a dataset and every chart built from it. */
export async function deleteDataset(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('datasets').delete().eq('id', id);
  if (error) return { ok: false as const, message: error.message };
  revalidatePath('/', 'layout');
  return { ok: true as const };
}
