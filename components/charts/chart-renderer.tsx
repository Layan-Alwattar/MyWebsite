'use client';

/**
 * Renders any saved chart (admin preview + public site).
 *
 * Accessibility & legibility rules baked in:
 *  - Series colors come from a validated, colorblind-checked palette
 *    (--viz-1…6 in globals.css), assigned in fixed order — never cycled.
 *  - ≥2 series always get a legend; single series are named by the title.
 *  - Hover tooltips everywhere, plus a "Show data table" toggle (needed
 *    because two light-mode colors sit below 3:1 contrast).
 *  - One y-axis only; thin 2px lines; 4px rounded bar ends.
 */
import { useId, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { seriesKeys, shapeData, type ChartSpec, type DataRow } from '@/lib/charts/data';

const SERIES = [1, 2, 3, 4, 5, 6].map((i) => `var(--viz-${i})`);
const OTHER = 'var(--viz-other)';

const axisProps = {
  stroke: 'var(--viz-axis)',
  // Physical (ltr) anchoring + "plaintext": each label picks its own reading order, so "25–34" or "65+"
  // keep their order inside right-to-left pages while Arabic labels stay RTL.
  tick: { fill: 'var(--viz-muted)', fontSize: 12, direction: 'ltr', unicodeBidi: 'plaintext' },
  tickLine: false,
} as const;

const tooltipProps = {
  contentStyle: {
    background: 'var(--viz-surface)',
    border: '1px solid var(--viz-grid)',
    borderRadius: 12,
    color: 'var(--viz-ink)',
    fontSize: 13,
    boxShadow: '0 8px 24px -12px rgba(0,0,0,.25)',
  },
  labelStyle: { color: 'var(--viz-ink)', fontWeight: 600 },
  itemStyle: { color: 'var(--viz-ink)' },
} as const;

const formatNumber = (v: unknown) =>
  typeof v === 'number' ? new Intl.NumberFormat('en', { maximumFractionDigits: 2, notation: Math.abs(v) >= 1e6 ? 'compact' : 'standard' }).format(v) : String(v ?? '');

export function ChartRenderer({
  spec,
  rows,
  title,
  caption,
  height = 320,
  dir = 'ltr',
}: {
  spec: ChartSpec;
  rows: DataRow[];
  title?: string;
  caption?: string;
  height?: number;
  dir?: 'ltr' | 'rtl';
}) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  const data = shapeData(rows, spec);
  const keys = seriesKeys(spec);
  const x = spec.x_column;
  const multi = keys.length > 1;
  const opts = spec.options ?? {};

  if (!data.length || !keys.length) {
    return <p className="viz-root rounded-xl p-6 text-center text-sm" style={{ color: 'var(--viz-muted)' }}>Choose columns to see a chart.</p>;
  }

  const xAxis = <XAxis dataKey={x} {...axisProps} reversed={dir === 'rtl'} label={opts.xLabel ? { value: opts.xLabel, position: 'insideBottom', offset: -4, fill: 'var(--viz-muted)', fontSize: 12 } : undefined} />;
  // Wide enough for the longest tick (the axis may round up past the max), plus the axis title.
  const maxValue = Math.max(0, ...data.flatMap((r) => keys.map((k) => (typeof r[k] === 'number' ? Math.abs(r[k] as number) : 0))));
  const yWidth = Math.max(44, formatNumber(maxValue * 1.25).length * 7.5 + 12) + (opts.yLabel ? 20 : 0);
  const yAxis = (
    <YAxis
      {...axisProps}
      orientation={dir === 'rtl' ? 'right' : 'left'}
      tickFormatter={formatNumber}
      width={yWidth}
      label={
        opts.yLabel
          ? { value: opts.yLabel, angle: -90, position: dir === 'rtl' ? 'insideRight' : 'insideLeft', style: { textAnchor: 'middle' }, fill: 'var(--viz-muted)', fontSize: 12 }
          : undefined
      }
    />
  );
  const grid = <CartesianGrid stroke="var(--viz-grid)" vertical={false} />;
  const legend = multi ? <Legend wrapperStyle={{ fontSize: 13, color: 'var(--viz-ink)' }} iconType="circle" /> : null;
  const margin = { top: 8, right: 12, bottom: opts.xLabel ? 16 : 4, left: 0 };

  let chart: React.ReactElement;
  switch (spec.chart_type) {
    case 'bar': {
      const horizontal = Boolean(opts.horizontal);
      chart = (
        <BarChart data={data} margin={margin} layout={horizontal ? 'vertical' : 'horizontal'} barGap={2}>
          {grid}
          {horizontal ? (
            <>
              <XAxis type="number" {...axisProps} tickFormatter={formatNumber} reversed={dir === 'rtl'} />
              <YAxis
                type="category"
                dataKey={x}
                {...axisProps}
                orientation={dir === 'rtl' ? 'right' : 'left'}
                // Fit the longest label (≈6.5px per character at 12px), within limits.
                width={Math.min(220, Math.max(60, Math.max(...data.map((r) => String(r[x] ?? '').length)) * 6.5 + 12))}
              />
            </>
          ) : (
            <>
              {xAxis}
              {yAxis}
            </>
          )}
          <Tooltip {...tooltipProps} cursor={{ fill: 'var(--viz-grid)', opacity: 0.5 }} formatter={formatNumber} />
          {legend}
          {keys.map((k, i) => (
            <Bar
              key={k}
              dataKey={k}
              fill={SERIES[i]}
              stackId={opts.stacked ? 'stack' : undefined}
              // Rounded data-end only; surface stroke = 2px gap between stacked segments.
              radius={opts.stacked && i < keys.length - 1 ? 0 : horizontal ? (dir === 'rtl' ? [4, 0, 0, 4] : [0, 4, 4, 0]) : [4, 4, 0, 0]}
              stroke={opts.stacked ? 'var(--viz-surface)' : undefined}
              strokeWidth={opts.stacked ? 2 : 0}
              maxBarSize={48}
            />
          ))}
        </BarChart>
      );
      break;
    }
    case 'line':
      chart = (
        <LineChart data={data} margin={margin}>
          {grid}
          {xAxis}
          {yAxis}
          <Tooltip {...tooltipProps} cursor={{ stroke: 'var(--viz-axis)' }} formatter={formatNumber} />
          {legend}
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={SERIES[i]} strokeWidth={2} dot={data.length <= 24 ? { r: 4, strokeWidth: 2, stroke: 'var(--viz-surface)', fill: SERIES[i] } : false} activeDot={{ r: 5, stroke: 'var(--viz-surface)', strokeWidth: 2 }} />
          ))}
        </LineChart>
      );
      break;
    case 'area':
      chart = (
        <AreaChart data={data} margin={margin}>
          {grid}
          {xAxis}
          {yAxis}
          <Tooltip {...tooltipProps} cursor={{ stroke: 'var(--viz-axis)' }} formatter={formatNumber} />
          {legend}
          {keys.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k} stroke={SERIES[i]} strokeWidth={2} fill={SERIES[i]} fillOpacity={0.18} stackId={opts.stacked ? 'stack' : undefined} />
          ))}
        </AreaChart>
      );
      break;
    case 'pie':
      chart = (
        <PieChart>
          <Tooltip {...tooltipProps} formatter={formatNumber} />
          <Legend wrapperStyle={{ fontSize: 13, color: 'var(--viz-ink)' }} iconType="circle" />
          <Pie
            data={data}
            dataKey={keys[0]}
            nameKey={x}
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={1}
            stroke="var(--viz-surface)"
            strokeWidth={2}
            label={({ percent }) => ((percent ?? 0) >= 0.06 ? `${Math.round((percent ?? 0) * 100)}%` : '')}
            labelLine={false}
          >
            {data.map((d, i) => (
              <Cell key={String(d[x])} fill={d[x] === 'Other' ? OTHER : SERIES[i]} />
            ))}
          </Pie>
        </PieChart>
      );
      break;
    case 'scatter':
      chart = (
        <ScatterChart margin={margin}>
          {grid}
          <XAxis type="number" dataKey={x} name={x} {...axisProps} tickFormatter={formatNumber} label={opts.xLabel ? { value: opts.xLabel, position: 'insideBottom', offset: -4, fill: 'var(--viz-muted)', fontSize: 12 } : undefined} />
          <YAxis type="number" {...axisProps} tickFormatter={formatNumber} width={56} />
          <Tooltip {...tooltipProps} cursor={{ strokeDasharray: '3 3', stroke: 'var(--viz-axis)' }} formatter={formatNumber} />
          {legend}
          {keys.map((k, i) => (
            <Scatter key={k} name={k} data={data.map((d) => ({ [x]: d[x], y: d[k] }))} dataKey="y" fill={SERIES[i]} stroke="var(--viz-surface)" strokeWidth={2} />
          ))}
        </ScatterChart>
      );
      break;
  }

  return (
    <figure className="viz-root space-y-2" dir={dir}>
      {title && <figcaption className="text-base font-semibold" style={{ color: 'var(--viz-ink)' }}>{title}</figcaption>}
      <div style={{ height }} role="img" aria-label={`${title ?? 'Chart'}: ${spec.chart_type} chart of ${keys.join(', ')} by ${x}`}>
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
      {caption && <p className="text-sm" style={{ color: 'var(--viz-muted)' }}>{caption}</p>}
      <button
        type="button"
        onClick={() => setShowTable((s) => !s)}
        aria-expanded={showTable}
        aria-controls={tableId}
        className="-ms-1 inline-flex min-h-10 items-center px-1 text-xs font-semibold underline underline-offset-2"
        style={{ color: 'var(--viz-muted)' }}
      >
        {dir === 'rtl' ? (showTable ? 'إخفاء جدول البيانات' : 'إظهار جدول البيانات') : showTable ? 'Hide data table' : 'Show data table'}
      </button>
      {showTable && (
        <div id={tableId} className="max-h-72 overflow-auto rounded-xl border" style={{ borderColor: 'var(--viz-grid)' }}>
          <table className="w-full text-sm tabular-nums" style={{ color: 'var(--viz-ink)' }}>
            <thead className="sticky top-0" style={{ background: 'var(--viz-surface)' }}>
              <tr>
                {[x, ...keys].map((k) => (
                  <th key={k} scope="col" className="px-3 py-2 text-start font-semibold">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--viz-grid)' }}>
                  {[x, ...keys].map((k) => (
                    <td key={k} className="px-3 py-1.5">{formatNumber(row[k])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}
