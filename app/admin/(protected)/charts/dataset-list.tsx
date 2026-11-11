'use client';

import { Database, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteDataset } from './actions';

export function DatasetList({ datasets }: { datasets: { id: string; name: string; row_count: number; created_at: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!datasets.length) return <p className="text-sm text-muted">Datasets you upload in the chart builder appear here.</p>;

  return (
    <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
      {datasets.map((d) => (
        <li key={d.id} className="flex items-center gap-3 px-4 py-3">
          <Database size={16} className="text-blush-600" aria-hidden />
          <span className="flex-1 truncate text-sm font-medium">{d.name}</span>
          <span className="text-xs text-muted">{d.row_count.toLocaleString()} rows</span>
          <button
            type="button"
            disabled={pending}
            aria-label={`Delete dataset ${d.name}`}
            onClick={() =>
              confirm(`Delete "${d.name}"? Charts built from it will be deleted too.`) &&
              startTransition(async () => {
                const res = await deleteDataset(d.id);
                if (!res.ok) return void toast.error(res.message);
                toast.success('Dataset deleted');
                router.refresh();
              })
            }
            className="rounded-lg p-2 text-muted hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
