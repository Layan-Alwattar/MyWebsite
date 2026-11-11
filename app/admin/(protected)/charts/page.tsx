import { BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/admin/page-header';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState, StatusBadge } from '@/components/ui/misc';
import { tr } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import { DatasetList } from './dataset-list';

export const metadata = { title: 'Chart builder' };

export default async function ChartsPage() {
  const supabase = await createClient();
  const [charts, datasets] = await Promise.all([
    supabase
      .from('charts')
      .select('id, title, chart_type, status, datasets(name), projects(title), analyses(title)')
      .order('created_at', { ascending: false }),
    supabase.from('datasets').select('id, name, row_count, columns, created_at').order('created_at', { ascending: false }),
  ]);

  type ChartRow = {
    id: string;
    title: unknown;
    chart_type: string;
    status: string;
    datasets: { name: string } | null;
    projects: { title: unknown } | null;
    analyses: { title: unknown } | null;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Chart builder"
        description="Upload a CSV or JSON file, design a chart, and attach it to a project or analysis page."
        actions={
          <ButtonLink href="/admin/charts/new">
            <Plus size={16} /> New chart
          </ButtonLink>
        }
      />

      {charts.error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{charts.error.message}</p>}

      {!charts.data?.length ? (
        <EmptyState title="No charts yet">
          <Link href="/admin/charts/new" className="font-semibold text-blush-700 underline">Build your first chart</Link>
        </EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {(charts.data as unknown as ChartRow[]).map((c) => {
            const page = c.projects ? `Project: ${tr(c.projects.title)}` : c.analyses ? `Analysis: ${tr(c.analyses.title)}` : 'Not attached';
            return (
              <li key={c.id}>
                <Link href={`/admin/charts/${c.id}`} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:shadow-md">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blush-100 text-blush-700">
                    <BarChart3 size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{tr(c.title) || 'Untitled chart'}</span>
                    <span className="block truncate text-sm text-muted">
                      {c.chart_type} · {c.datasets?.name ?? 'missing dataset'} · {page}
                    </span>
                  </span>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Datasets</h2>
        <DatasetList datasets={(datasets.data ?? []) as { id: string; name: string; row_count: number; created_at: string }[]} />
      </section>
    </div>
  );
}
