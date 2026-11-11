'use client';

/**
 * Chart builder: 1) pick or upload data  2) choose chart type & columns
 * 3) title, caption, attach to a page — with a live preview throughout.
 */
import { AreaChart, ArrowLeft, BarChart3, LineChart, PieChart, Save, ScatterChart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ChartRenderer } from '@/components/charts/chart-renderer';
import { Dropzone } from '@/components/admin/dropzone';
import { I18nTextInput } from '@/components/admin/field-controls';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Switch } from '@/components/ui/form';
import { Card } from '@/components/ui/misc';
import { CHART_TYPE_INFO, MAX_SERIES, parseDataFile, type ChartType, type Column, type DataRow } from '@/lib/charts/data';
import { cn } from '@/lib/cn';
import { uploadMedia } from '@/lib/media';
import { createClient } from '@/lib/supabase/client';
import { deleteChart, saveChart, type ChartInput } from '../actions';

export type DatasetSummary = { id: string; name: string; columns: Column[]; row_count: number };
type Option = { value: string; label: string };

const TYPE_ICONS: Record<ChartType, typeof BarChart3> = { bar: BarChart3, line: LineChart, area: AreaChart, pie: PieChart, scatter: ScatterChart };

export function ChartBuilder({
  id,
  initial,
  datasets: initialDatasets,
  projects,
  analyses,
}: {
  id: string | null;
  initial: ChartInput;
  datasets: DatasetSummary[];
  projects: Option[];
  analyses: Option[];
}) {
  const router = useRouter();
  const [v, setV] = useState<ChartInput>(initial);
  const [datasets, setDatasets] = useState(initialDatasets);
  const [rows, setRows] = useState<DataRow[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const dataset = datasets.find((d) => d.id === v.dataset_id);
  const columns = dataset?.columns ?? [];
  const numericColumns = columns.filter((c) => c.type === 'number');
  const maxSeries = MAX_SERIES[v.chart_type];

  // Load rows for the preview whenever the dataset changes.
  useEffect(() => {
    if (!v.dataset_id) return;
    let cancelled = false;
    createClient()
      .from('datasets')
      .select('rows')
      .eq('id', v.dataset_id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) toast.error(error.message);
        setRows((data?.rows as DataRow[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [v.dataset_id]);

  const set = <K extends keyof ChartInput>(key: K, value: ChartInput[K]) => setV((prev) => ({ ...prev, [key]: value }));
  const setOpt = (patch: Partial<ChartInput['options']>) => setV((prev) => ({ ...prev, options: { ...prev.options, ...patch } }));

  async function onUpload(files: File[]) {
    const file = files[0];
    setUploading(true);
    try {
      const parsed = await parseDataFile(file);
      if (!parsed.rows.length) throw new Error('No rows found in that file.');
      // Keep the original file in the media library too.
      const media = await uploadMedia(file);
      const { data, error } = await createClient()
        .from('datasets')
        .insert({
          name: file.name.replace(/\.(csv|json)$/i, ''),
          file_path: media.path,
          source_format: parsed.format,
          columns: parsed.columns,
          rows: parsed.rows,
          row_count: parsed.rows.length,
        })
        .select('id, name, columns, row_count')
        .single();
      if (error) throw new Error(error.message);

      const ds = data as DatasetSummary;
      setDatasets((d) => [ds, ...d]);
      // Sensible defaults: first text/date column on X, first number column on Y.
      const xCol = parsed.columns.find((c) => c.type !== 'number') ?? parsed.columns[0];
      const yCol = parsed.columns.find((c) => c.type === 'number' && c.name !== xCol?.name);
      setV((prev) => ({ ...prev, dataset_id: ds.id, x_column: xCol?.name ?? '', y_columns: yCol ? [yCol.name] : [] }));
      setRows(parsed.rows);
      toast.success(`Loaded ${parsed.rows.length.toLocaleString()} rows${parsed.truncated ? ' (first 5,000 kept)' : ''}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function toggleY(name: string) {
    const has = v.y_columns.includes(name);
    if (!has && v.y_columns.length >= maxSeries) {
      toast.message(`${CHART_TYPE_INFO[v.chart_type].label} charts show at most ${maxSeries} series so colors stay distinguishable.`);
      return;
    }
    set('y_columns', has ? v.y_columns.filter((y) => y !== name) : [...v.y_columns, name]);
  }

  function changeType(type: ChartType) {
    setV((prev) => ({ ...prev, chart_type: type, y_columns: prev.y_columns.slice(0, MAX_SERIES[type]) }));
  }

  function save() {
    startTransition(async () => {
      const res = await saveChart(id, v);
      if (!res.ok) return void toast.error(res.message);
      toast.success('Chart saved ✿');
      if (!id) router.replace(`/admin/charts/${res.id}`);
      else router.refresh();
    });
  }

  const attachOptions = v.attach.kind === 'project' ? projects : v.attach.kind === 'analysis' ? analyses : [];

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-b border-line bg-blush-50/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <Link href="/admin/charts" aria-label="Back to charts" className="rounded-lg p-1.5 text-muted hover:bg-blush-100 hover:text-ink">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="flex-1 truncate text-xl font-semibold">{v.title.en || (id ? 'Untitled chart' : 'New chart')}</h1>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Switch checked={v.status === 'published'} onChange={(on) => set('status', on ? 'published' : 'draft')} label="Published" />
          <span className={v.status === 'published' ? 'text-emerald-700' : 'text-amber-700'}>{v.status === 'published' ? 'Published' : 'Draft'}</span>
        </label>
        {id && (
          <Button
            variant="danger"
            disabled={pending}
            onClick={() =>
              confirm('Delete this chart?') &&
              startTransition(async () => {
                const res = await deleteChart(id);
                if (!res.ok) return void toast.error(res.message);
                toast.success('Chart deleted');
                router.replace('/admin/charts');
              })
            }
          >
            <Trash2 size={16} />
          </Button>
        )}
        <Button onClick={save} disabled={pending}>
          <Save size={16} /> {pending ? 'Saving…' : 'Save'}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-6">
          {/* 1. Data */}
          <Card className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blush-700">1 · Data</h2>
            <Field label="Dataset" htmlFor="dataset">
              <Select
                id="dataset"
                value={v.dataset_id}
                onChange={(e) => setV((prev) => ({ ...prev, dataset_id: e.target.value, x_column: '', y_columns: [] }))}
              >
                <option value="">Choose a dataset…</option>
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.row_count.toLocaleString()} rows)
                  </option>
                ))}
              </Select>
            </Field>
            <Dropzone accept=".csv,.json,text/csv,application/json" multiple={false} onFiles={onUpload} busy={uploading} hint="…or upload a new CSV / JSON file (first row = column names)" compact />
          </Card>

          {/* 2. Chart */}
          <Card className={cn('space-y-4', !dataset && 'pointer-events-none opacity-50')}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blush-700">2 · Chart</h2>
            <div role="radiogroup" aria-label="Chart type" className="grid grid-cols-5 gap-2">
              {(Object.keys(CHART_TYPE_INFO) as ChartType[]).map((t) => {
                const Icon = TYPE_ICONS[t];
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={v.chart_type === t}
                    title={CHART_TYPE_INFO[t].hint}
                    onClick={() => changeType(t)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-semibold transition',
                      v.chart_type === t ? 'border-blush-600 bg-blush-100 text-blush-800' : 'border-line hover:bg-blush-50',
                    )}
                  >
                    <Icon size={20} aria-hidden />
                    {CHART_TYPE_INFO[t].label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted">{CHART_TYPE_INFO[v.chart_type].hint}.</p>

            <Field label={v.chart_type === 'pie' ? 'Slices (labels)' : 'X axis'} htmlFor="x-col">
              <Select id="x-col" value={v.x_column} onChange={(e) => set('x_column', e.target.value)}>
                <option value="">Choose a column…</option>
                {(v.chart_type === 'scatter' ? numericColumns : columns).map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </Select>
            </Field>

            {v.options.aggregate !== 'count' && (
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">
                  {v.chart_type === 'pie' ? 'Slice size' : 'Values'}{' '}
                  <span className="font-normal text-muted">(up to {maxSeries})</span>
                </legend>
                {numericColumns.length ? (
                  <div className="flex flex-wrap gap-2">
                    {numericColumns
                      .filter((c) => c.name !== v.x_column)
                      .map((c) => {
                        const on = v.y_columns.includes(c.name);
                        return (
                          <button
                            key={c.name}
                            type="button"
                            aria-pressed={on}
                            onClick={() => (v.chart_type === 'pie' ? set('y_columns', [c.name]) : toggleY(c.name))}
                            className={cn('rounded-full border px-3 py-1 text-sm font-medium', on ? 'border-blush-600 bg-blush-600 text-white' : 'border-line bg-white hover:bg-blush-50')}
                          >
                            {c.name}
                          </button>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-sm text-muted">This dataset has no numeric columns — use &quot;Count rows&quot; below.</p>
                )}
              </fieldset>
            )}

            {v.chart_type !== 'scatter' && (
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Combine rows" htmlFor="agg" help="Groups rows with the same X">
                  <Select id="agg" value={v.options.aggregate ?? 'none'} onChange={(e) => setOpt({ aggregate: e.target.value as ChartInput['options']['aggregate'] })}>
                    <option value="none">Don&apos;t combine</option>
                    <option value="sum">Sum</option>
                    <option value="mean">Average</option>
                    <option value="count">Count rows</option>
                  </Select>
                </Field>
                <Field label="Sort" htmlFor="sort">
                  <Select id="sort" value={v.options.sort ?? 'none'} onChange={(e) => setOpt({ sort: e.target.value as ChartInput['options']['sort'] })}>
                    <option value="none">Original order</option>
                    <option value="desc">Largest first</option>
                    <option value="asc">Smallest first</option>
                  </Select>
                </Field>
                {v.chart_type !== 'pie' && (
                  <Field label="Show first" htmlFor="limit" help="Empty = all">
                    <Input id="limit" type="number" min={1} value={v.options.limit ?? ''} onChange={(e) => setOpt({ limit: e.target.value ? e.target.valueAsNumber : null })} />
                  </Field>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-5">
              {(v.chart_type === 'bar' || v.chart_type === 'area') && v.y_columns.length > 1 && (
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Switch checked={Boolean(v.options.stacked)} onChange={(on) => setOpt({ stacked: on })} label="Stacked" /> Stacked
                </label>
              )}
              {v.chart_type === 'bar' && (
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Switch checked={Boolean(v.options.horizontal)} onChange={(on) => setOpt({ horizontal: on })} label="Horizontal bars" /> Horizontal
                </label>
              )}
            </div>

            {v.chart_type !== 'pie' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="X axis label" htmlFor="xlabel">
                  <Input id="xlabel" value={v.options.xLabel ?? ''} onChange={(e) => setOpt({ xLabel: e.target.value })} />
                </Field>
                <Field label="Y axis label" htmlFor="ylabel">
                  <Input id="ylabel" value={v.options.yLabel ?? ''} onChange={(e) => setOpt({ yLabel: e.target.value })} />
                </Field>
              </div>
            )}
          </Card>

          {/* 3. Details */}
          <Card className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blush-700">3 · Title & placement</h2>
            <Field label="Title" htmlFor="chart-title" required>
              <I18nTextInput id="chart-title" value={v.title} onChange={(t) => set('title', t)} />
            </Field>
            <Field label="Caption / insight" htmlFor="chart-caption">
              <I18nTextInput id="chart-caption" value={v.caption} onChange={(t) => set('caption', t)} multiline />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Show on" htmlFor="attach-kind">
                <Select id="attach-kind" value={v.attach.kind} onChange={(e) => set('attach', { kind: e.target.value as ChartInput['attach']['kind'], id: null })}>
                  <option value="none">Not attached yet</option>
                  <option value="project">A project page</option>
                  <option value="analysis">A Data & Analysis page</option>
                </Select>
              </Field>
              {v.attach.kind !== 'none' && (
                <Field label="Page" htmlFor="attach-id">
                  <Select id="attach-id" value={v.attach.id ?? ''} onChange={(e) => set('attach', { ...v.attach, id: e.target.value || null })}>
                    <option value="">Choose…</option>
                    {attachOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
            </div>
          </Card>
        </div>

        {/* Live preview */}
        <div className="xl:sticky xl:top-20 xl:self-start">
          <Card>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-blush-700">Live preview</h2>
            {!dataset ? (
              <p className="py-16 text-center text-sm text-muted">Choose or upload a dataset to start.</p>
            ) : rows === null ? (
              <p className="py-16 text-center text-sm text-muted">Loading data…</p>
            ) : (
              <ChartRenderer
                spec={{ chart_type: v.chart_type, x_column: v.x_column, y_columns: v.y_columns, options: v.options }}
                rows={rows}
                title={v.title.en}
                caption={v.caption.en}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
