import { notFound } from 'next/navigation';
import { tr } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import type { ChartInput } from '../actions';
import { ChartBuilder, type DatasetSummary } from './chart-builder';

export const metadata = { title: 'Chart' };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ChartEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = rawId === 'new' ? null : rawId;
  if (id && !UUID_RE.test(id)) notFound();

  const supabase = await createClient();
  const [datasets, projects, analyses, chart] = await Promise.all([
    supabase.from('datasets').select('id, name, columns, row_count').order('created_at', { ascending: false }),
    supabase.from('projects').select('id, title').order('position'),
    supabase.from('analyses').select('id, title').order('position'),
    id ? supabase.from('charts').select('*').eq('id', id).maybeSingle() : Promise.resolve({ data: null, error: null }),
  ]);
  if (id && !chart.data) notFound();

  const c = chart.data as Record<string, unknown> | null;
  const initial: ChartInput = c
    ? {
        dataset_id: c.dataset_id as string,
        title: c.title as ChartInput['title'],
        caption: c.caption as ChartInput['caption'],
        chart_type: c.chart_type as ChartInput['chart_type'],
        x_column: c.x_column as string,
        y_columns: c.y_columns as string[],
        options: (c.options ?? {}) as ChartInput['options'],
        attach: c.project_id
          ? { kind: 'project', id: c.project_id as string }
          : c.analysis_id
            ? { kind: 'analysis', id: c.analysis_id as string }
            : { kind: 'none', id: null },
        status: c.status as ChartInput['status'],
      }
    : {
        dataset_id: '',
        title: { en: '', ar: '' },
        caption: { en: '', ar: '' },
        chart_type: 'bar',
        x_column: '',
        y_columns: [],
        options: { aggregate: 'none', sort: 'none' },
        attach: { kind: 'none', id: null },
        status: 'draft',
      };

  const toOptions = (rows: { id: string; title: unknown }[] | null) => (rows ?? []).map((r) => ({ value: r.id, label: tr(r.title) || 'Untitled' }));

  return (
    <ChartBuilder
      key={id ?? 'new'}
      id={id}
      initial={initial}
      datasets={(datasets.data ?? []) as DatasetSummary[]}
      projects={toOptions(projects.data)}
      analyses={toOptions(analyses.data)}
    />
  );
}
