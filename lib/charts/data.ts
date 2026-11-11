/**
 * Chart data helpers: parsing uploaded CSV/JSON, detecting column types,
 * and shaping rows for each chart type. Safe on server and client.
 */
import Papa from 'papaparse';

export type ColumnType = 'number' | 'string' | 'date';
export type Column = { name: string; type: ColumnType };
export type DataRow = Record<string, string | number | null>;

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter';
export type Aggregation = 'none' | 'sum' | 'mean' | 'count';

export type ChartOptions = {
  aggregate?: Aggregation;
  sort?: 'none' | 'asc' | 'desc';
  limit?: number | null;
  stacked?: boolean;
  horizontal?: boolean;
  xLabel?: string;
  yLabel?: string;
};

export type ChartSpec = {
  chart_type: ChartType;
  x_column: string;
  y_columns: string[];
  options: ChartOptions;
};

export const MAX_ROWS = 5000;
/** Series caps keep colors distinguishable (validated palette, see chart-renderer). */
export const MAX_SERIES: Record<ChartType, number> = { bar: 6, line: 6, area: 6, pie: 1, scatter: 3 };
export const MAX_PIE_SLICES = 6;

export const CHART_TYPE_INFO: Record<ChartType, { label: string; hint: string }> = {
  bar: { label: 'Bar', hint: 'Compare amounts across categories' },
  line: { label: 'Line', hint: 'Show change over time' },
  area: { label: 'Area', hint: 'Change over time, emphasising volume' },
  pie: { label: 'Pie', hint: 'Parts of a whole (few slices)' },
  scatter: { label: 'Scatter', hint: 'Relationship between two numbers' },
};

const DATE_RE = /^\d{4}-\d{2}(-\d{2})?([T ][\d:.]+Z?)?$/;

function inferType(values: unknown[]): ColumnType {
  const present = values.filter((v) => v !== null && v !== undefined && v !== '');
  if (!present.length) return 'string';
  if (present.every((v) => typeof v === 'number' && Number.isFinite(v))) return 'number';
  if (present.every((v) => typeof v === 'string' && DATE_RE.test(v))) return 'date';
  return 'string';
}

function cleanRows(raw: Record<string, unknown>[]): { columns: Column[]; rows: DataRow[] } {
  const rows = raw.slice(0, MAX_ROWS);
  const names = Array.from(new Set(rows.flatMap((r) => Object.keys(r)))).filter((n) => n.trim() !== '');
  const columns = names.map((name) => ({ name, type: inferType(rows.map((r) => r[name])) }));
  const clean = rows.map((r) =>
    Object.fromEntries(
      columns.map(({ name, type }) => {
        const v = r[name];
        if (v === null || v === undefined || v === '') return [name, null];
        if (type === 'number') return [name, Number(v)];
        return [name, String(v)];
      }),
    ),
  );
  return { columns, rows: clean };
}

/** Parses a CSV or JSON file in the browser. JSON must be an array of objects. */
export async function parseDataFile(file: File): Promise<{ columns: Column[]; rows: DataRow[]; format: 'csv' | 'json'; truncated: boolean }> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.json')) {
    const json = JSON.parse(await file.text());
    const arr = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : null;
    if (!arr || !arr.every((r: unknown) => r && typeof r === 'object' && !Array.isArray(r))) {
      throw new Error('JSON must be an array of objects, e.g. [{"year": 2024, "sales": 10}]');
    }
    return { ...cleanRows(arr), format: 'json', truncated: arr.length > MAX_ROWS };
  }

  const text = await file.text();
  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  });
  if (result.errors.length && !result.data.length) throw new Error(result.errors[0].message);
  return { ...cleanRows(result.data), format: 'csv', truncated: result.data.length > MAX_ROWS };
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Turns raw dataset rows into the shape Recharts needs for a given spec.
 * Returns rows keyed by x_column + each y column.
 */
export function shapeData(rows: DataRow[], spec: ChartSpec): DataRow[] {
  const { chart_type: type, x_column: x, options } = spec;
  const ys = spec.y_columns.slice(0, MAX_SERIES[type]);
  const agg: Aggregation = type === 'scatter' ? 'none' : (options.aggregate ?? 'none');

  let out: DataRow[];

  if (type === 'scatter') {
    out = rows.filter((r) => typeof r[x] === 'number').map((r) => Object.fromEntries([[x, r[x]], ...ys.map((y) => [y, r[y]])]));
  } else if (agg === 'none') {
    out = rows.filter((r) => r[x] !== null).map((r) => Object.fromEntries([[x, r[x]], ...ys.map((y) => [y, r[y]])]));
  } else {
    // Group by x and aggregate each y.
    const groups = new Map<string | number, DataRow[]>();
    for (const r of rows) {
      const key = r[x];
      if (key === null) continue;
      groups.set(key, [...(groups.get(key) ?? []), r]);
    }
    const series = agg === 'count' ? ['count'] : ys;
    out = [...groups.entries()].map(([key, group]) => {
      const row: DataRow = { [x]: key };
      for (const y of series) {
        if (agg === 'count') row[y] = group.length;
        else {
          const nums = group.map((g) => g[y]).filter((v): v is number => typeof v === 'number');
          const sum = nums.reduce((a, b) => a + b, 0);
          row[y] = nums.length ? round(agg === 'sum' ? sum : sum / nums.length) : null;
        }
      }
      return row;
    });
  }

  // Sorting: by first series value, or naturally by x for time-like data.
  const firstY = agg === 'count' ? 'count' : ys[0];
  if (options.sort === 'asc' || options.sort === 'desc') {
    const dir = options.sort === 'asc' ? 1 : -1;
    out.sort((a, b) => (((a[firstY] as number) ?? 0) - ((b[firstY] as number) ?? 0)) * dir);
  } else if (type === 'line' || type === 'area' || type === 'scatter') {
    out.sort((a, b) => (a[x]! < b[x]! ? -1 : a[x]! > b[x]! ? 1 : 0));
  }

  if (type === 'pie') {
    // Largest slices first; fold the rest into "Other" so colors stay distinct.
    out.sort((a, b) => ((b[firstY] as number) ?? 0) - ((a[firstY] as number) ?? 0));
    if (out.length > MAX_PIE_SLICES) {
      const rest = out.slice(MAX_PIE_SLICES - 1);
      const other = rest.reduce((s, r) => s + ((r[firstY] as number) ?? 0), 0);
      out = [...out.slice(0, MAX_PIE_SLICES - 1), { [x]: 'Other', [firstY]: round(other) }];
    }
  }

  if (options.limit && options.limit > 0 && type !== 'pie') out = out.slice(0, options.limit);
  return out;
}

/** Series keys actually plotted for a spec (count aggregation creates "count"). */
export function seriesKeys(spec: ChartSpec) {
  if (spec.chart_type !== 'scatter' && spec.options.aggregate === 'count') return ['count'];
  return spec.y_columns.slice(0, MAX_SERIES[spec.chart_type]);
}
