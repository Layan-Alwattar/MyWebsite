'use client';

import { ChartRenderer } from '@/components/charts/chart-renderer';
import { tr, LOCALE_DIR, type Locale } from '@/lib/i18n';
import type { ChartWithData } from '@/lib/site/data';

/** Interactive charts attached to a project or analysis page. */
export function ChartsBlock({ charts, locale }: { charts: ChartWithData[]; locale: Locale }) {
  return (
    <div className="space-y-8">
      {charts.map((c) => (
        <div key={c.id} className="rounded-theme bg-card p-5 shadow-sm md:p-7">
          <ChartRenderer spec={c.spec} rows={c.rows} title={tr(c.title, locale)} caption={tr(c.caption, locale)} dir={LOCALE_DIR[locale]} />
        </div>
      ))}
    </div>
  );
}
