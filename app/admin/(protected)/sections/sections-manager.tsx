'use client';

import { Eye, EyeOff, Save } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';
import { SortableList } from '@/components/admin/sortable-list';
import { Button } from '@/components/ui/button';
import { Input, Switch } from '@/components/ui/form';
import { saveSections, type SectionRow } from './actions';

export function SectionsManager({ initial }: { initial: SectionRow[] }) {
  const [rows, setRows] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  const update = (next: SectionRow[]) => {
    setRows(next);
    setDirty(true);
  };
  const patch = (key: string, p: Partial<SectionRow>) => update(rows.map((r) => (r.key === key ? { ...r, ...p } : r)));

  return (
    <div className="space-y-4">
      <SortableList
        items={rows}
        getId={(r) => r.key}
        onReorder={update}
        renderItem={(row, handle) => (
          <div className={cn('flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm', !row.visible && 'opacity-60')}>
            {handle}
            <span className="w-24 font-mono text-xs text-muted">{row.key}</span>
            <Input aria-label={`${row.key} label (English)`} value={row.label.en} onChange={(e) => patch(row.key, { label: { ...row.label, en: e.target.value } })} className="max-w-48 flex-1" />
            <Input aria-label={`${row.key} label (Arabic)`} lang="ar" dir="rtl" value={row.label.ar} onChange={(e) => patch(row.key, { label: { ...row.label, ar: e.target.value } })} className="max-w-48 flex-1" />
            <span className="ms-auto flex items-center gap-2 text-xs font-semibold">
              {row.visible ? <Eye size={15} className="text-emerald-700" /> : <EyeOff size={15} className="text-muted" />}
              <Switch checked={row.visible} onChange={(v) => patch(row.key, { visible: v })} label={`Show ${row.key} section`} disabled={row.key === 'hero'} />
            </span>
          </div>
        )}
      />
      <div className="flex items-center gap-3">
        <Button
          disabled={!dirty || pending}
          onClick={() =>
            startTransition(async () => {
              const res = await saveSections(rows);
              if (!res.ok) return void toast.error(res.message);
              setDirty(false);
              toast.success('Homepage updated ✿');
            })
          }
        >
          <Save size={16} /> {pending ? 'Saving…' : 'Save'}
        </Button>
        {dirty && <span className="text-xs font-medium text-amber-700">Unsaved changes</span>}
      </div>
      <p className="text-xs text-muted">The Hero section always stays visible. Keyboard: focus a handle, press Space, move with the arrow keys, press Space to drop.</p>
    </div>
  );
}
