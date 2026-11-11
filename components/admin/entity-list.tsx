'use client';

/**
 * Generic list screen: search, status filter, inline publish toggle,
 * drag-to-reorder (for sortable types), preview, edit and delete.
 */
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteEntity, reorderEntity, setEntityStatus } from '@/lib/admin/actions';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/button';
import { Input, Select, Switch } from '@/components/ui/form';
import { EmptyState } from '@/components/ui/misc';
import { SortableList } from './sortable-list';

export type ListRow = {
  id: string;
  title: string;
  subtitle: string;
  status: 'draft' | 'published' | null;
  updatedAt: string | null;
  previewPath: string | null;
};

export function EntityList({
  entityKey,
  singular,
  rows: initialRows,
  sortable,
  hasStatus,
}: {
  entityKey: string;
  singular: string;
  rows: ListRow[];
  sortable: boolean;
  hasStatus: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [, startTransition] = useTransition();

  const filtering = query.trim() !== '' || statusFilter !== 'all';
  const visible = useMemo(
    () =>
      rows.filter(
        (r) =>
          (statusFilter === 'all' || r.status === statusFilter) &&
          `${r.title} ${r.subtitle}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query, statusFilter],
  );

  function reorder(next: ListRow[]) {
    const previous = rows;
    setRows(next); // optimistic
    startTransition(async () => {
      const res = await reorderEntity(entityKey, next.map((r) => r.id));
      if (!res.ok) {
        setRows(previous);
        toast.error(res.message);
      } else toast.success('Order saved');
    });
  }

  function toggleStatus(row: ListRow, on: boolean) {
    const status = on ? 'published' : 'draft';
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
    startTransition(async () => {
      const res = await setEntityStatus(entityKey, row.id, status);
      if (!res.ok) {
        setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status: row.status } : r)));
        toast.error(res.message);
      } else toast.success(on ? 'Published' : 'Moved to drafts');
    });
  }

  function remove(row: ListRow) {
    if (!confirm(`Delete "${row.title || 'Untitled'}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deleteEntity(entityKey, row.id);
      if (!res.ok) toast.error(res.message);
      else {
        setRows((rs) => rs.filter((r) => r.id !== row.id));
        toast.success('Deleted');
        router.refresh();
      }
    });
  }

  const renderRow = (row: ListRow, handle: React.ReactNode) => (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm transition hover:shadow-md">
      {handle}
      <Link href={`/admin/${entityKey}/${row.id}`} className="min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-500/30">
        <p className="truncate font-semibold">{row.title || <span className="text-muted italic">Untitled</span>}</p>
        {row.subtitle && <p className="truncate text-sm text-muted">{row.subtitle}</p>}
      </Link>
      {hasStatus && row.status && (
        <label className="hidden items-center gap-2 text-xs font-semibold sm:flex">
          <span className={cn(row.status === 'published' ? 'text-emerald-700' : 'text-amber-700')}>
            {row.status === 'published' ? 'Published' : 'Draft'}
          </span>
          <Switch checked={row.status === 'published'} onChange={(on) => toggleStatus(row, on)} label={`Publish ${row.title}`} />
        </label>
      )}
      <div className="flex items-center">
        {row.previewPath && (
          <a
            href={`/api/draft?path=${encodeURIComponent(`/en${row.previewPath}`)}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Preview ${row.title}`}
            title="Preview"
            className="rounded-lg p-2 text-muted hover:bg-blush-100 hover:text-ink"
          >
            <Eye size={16} />
          </a>
        )}
        <Link href={`/admin/${entityKey}/${row.id}`} aria-label={`Edit ${row.title}`} title="Edit" className="rounded-lg p-2 text-muted hover:bg-blush-100 hover:text-ink">
          <Pencil size={16} />
        </Link>
        <button type="button" onClick={() => remove(row)} aria-label={`Delete ${row.title}`} title="Delete" className="rounded-lg p-2 text-muted hover:bg-rose-50 hover:text-rose-700">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input type="search" placeholder="Search…" aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
        {hasStatus && (
          <Select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="w-auto">
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </Select>
        )}
        <ButtonLink href={`/admin/${entityKey}/new`} className="ms-auto">
          <Plus size={16} /> New {singular}
        </ButtonLink>
      </div>

      {sortable && !filtering && rows.length > 1 && (
        <p className="text-xs text-muted">Drag the handle to reorder — the site uses this order.</p>
      )}

      {visible.length === 0 ? (
        <EmptyState title={rows.length ? 'Nothing matches your search' : `No ${singular}s yet`}>
          {!rows.length && (
            <Link href={`/admin/${entityKey}/new`} className="font-semibold text-blush-700 underline">
              Create the first one
            </Link>
          )}
        </EmptyState>
      ) : (
        <SortableList
          items={visible}
          getId={(r) => r.id}
          onReorder={reorder}
          disabled={!sortable || filtering}
          renderItem={renderRow}
        />
      )}
    </div>
  );
}
