'use client';

/**
 * Media library: upload (drag & drop), browse, preview, edit alt text,
 * copy URL and delete. In "pick" mode (onPick set) it's used inside the
 * media picker modal and clicking a file selects it.
 */
import { Check, Copy, FileText, Film, Database, File as FileIcon, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { MediaAccept } from '@/lib/admin/fields';
import { cn } from '@/lib/cn';
import {
  ACCEPT_ATTR,
  deleteMedia,
  displayName,
  formatBytes,
  listMedia,
  matchesAccept,
  updateMediaAlt,
  uploadMedia,
  type MediaKind,
  type MediaRow,
} from '@/lib/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { EmptyState } from '@/components/ui/misc';
import { Dropzone } from './dropzone';

const FILTERS: { value: MediaKind | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'pdf', label: 'PDFs' },
  { value: 'data', label: 'Data' },
];

export function MediaThumb({ item, className }: { item: Pick<MediaRow, 'kind' | 'url' | 'alt'>; className?: string }) {
  if (item.kind === 'image') {
    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnails from Storage; no optimization needed
    return <img src={item.url} alt={item.alt?.en ?? ''} loading="lazy" className={cn('h-full w-full object-cover', className)} />;
  }
  const Icon = item.kind === 'video' ? Film : item.kind === 'pdf' ? FileText : item.kind === 'data' ? Database : FileIcon;
  return (
    <div className={cn('grid h-full w-full place-items-center bg-blush-50 text-blush-600', className)}>
      <Icon size={32} aria-hidden />
    </div>
  );
}

export function MediaLibrary({ accept = 'any', onPick }: { accept?: MediaAccept; onPick?: (item: MediaRow) => void }) {
  const [items, setItems] = useState<MediaRow[] | null>(null);
  const [filter, setFilter] = useState<MediaKind | 'all'>(accept === 'any' ? 'all' : accept);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await listMedia());
    } catch (e) {
      toast.error((e as Error).message);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    load();
  }, [load]);

  const visible = useMemo(
    () =>
      (items ?? []).filter(
        (m) =>
          (filter === 'all' || m.kind === filter) &&
          matchesAccept(m.kind, accept) &&
          displayName(m.path).toLowerCase().includes(query.toLowerCase()),
      ),
    [items, filter, accept, query],
  );
  const selected = items?.find((m) => m.id === selectedId) ?? null;

  async function onFiles(files: File[]) {
    setBusy(true);
    const uploaded: MediaRow[] = [];
    for (const file of files) {
      try {
        uploaded.push(await uploadMedia(file));
      } catch (e) {
        toast.error((e as Error).message);
      }
    }
    setBusy(false);
    if (uploaded.length) {
      toast.success(`Uploaded ${uploaded.length} file${uploaded.length > 1 ? 's' : ''}`);
      setItems((prev) => [...uploaded, ...(prev ?? [])]);
      // A single upload in pick mode is almost always the file you wanted.
      if (onPick && uploaded.length === 1) onPick(uploaded[0]);
      else setSelectedId(uploaded[0].id);
    }
  }

  async function onDelete(item: MediaRow) {
    if (!confirm(`Delete "${displayName(item.path)}"? Pages using it will show a broken link.`)) return;
    try {
      await deleteMedia(item);
      setItems((prev) => (prev ?? []).filter((m) => m.id !== item.id));
      setSelectedId(null);
      toast.success('Deleted');
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      <Dropzone
        accept={ACCEPT_ATTR[accept]}
        onFiles={onFiles}
        busy={busy}
        hint="Images, videos, PDFs, CSV/JSON — up to 50 MB each"
        compact={Boolean(onPick)}
      />

      <div className="flex flex-wrap items-center gap-2">
        {accept === 'any' && (
          <div role="tablist" aria-label="Filter by type" className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm font-medium transition',
                  filter === f.value ? 'bg-blush-700 text-white' : 'text-muted hover:bg-blush-100',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
        <Input
          type="search"
          placeholder="Search files…"
          aria-label="Search files"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ms-auto max-w-56"
        />
      </div>

      {items === null ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <EmptyState title="No files yet">Upload something above to get started.</EmptyState>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => (onPick ? onPick(item) : setSelectedId(item.id))}
                className={cn(
                  'group w-full overflow-hidden rounded-2xl border bg-white text-start transition hover:shadow-md',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-500/30',
                  selectedId === item.id ? 'border-blush-500 ring-2 ring-blush-500/40' : 'border-line',
                )}
              >
                <div className="aspect-square overflow-hidden">
                  <MediaThumb item={item} className="transition group-hover:scale-105" />
                </div>
                <div className="px-2.5 py-2">
                  <p className="truncate text-xs font-medium" title={displayName(item.path)}>
                    {displayName(item.path)}
                  </p>
                  <p className="text-[11px] text-muted">{formatBytes(item.size_bytes)}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!onPick && selected && <MediaDetails key={selected.id} item={selected} onDelete={onDelete} onSaved={load} />}
    </div>
  );
}

function MediaDetails({ item, onDelete, onSaved }: { item: MediaRow; onDelete: (m: MediaRow) => void; onSaved: () => void }) {
  const [alt, setAlt] = useState(item.alt ?? { en: '', ar: '' });
  const [copied, setCopied] = useState(false);

  return (
    <section aria-label="File details" className="grid gap-5 rounded-2xl border border-line bg-white p-5 md:grid-cols-[240px_1fr]">
      <div className="overflow-hidden rounded-xl bg-blush-50">
        {item.kind === 'video' ? (
          <video src={item.url} controls className="w-full" />
        ) : (
          <div className="aspect-square">
            <MediaThumb item={item} className="object-contain" />
          </div>
        )}
      </div>
      <div className="space-y-3 text-sm">
        <p className="font-semibold">{displayName(item.path)}</p>
        <p className="text-muted">
          {item.mime_type} · {formatBytes(item.size_bytes)}
          {item.width ? ` · ${item.width}×${item.height}` : ''}
        </p>
        <div className="flex gap-2">
          <Input readOnly value={item.url} aria-label="File URL" onFocus={(e) => e.target.select()} />
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(item.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        {item.kind === 'image' && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Alt text (English)" aria-label="Alt text English" value={alt.en} onChange={(e) => setAlt({ ...alt, en: e.target.value })} />
            <Input placeholder="النص البديل (عربي)" aria-label="Alt text Arabic" lang="ar" dir="rtl" value={alt.ar} onChange={(e) => setAlt({ ...alt, ar: e.target.value })} />
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          {item.kind === 'image' && (
            <Button
              size="sm"
              onClick={async () => {
                try {
                  await updateMediaAlt(item.id, alt);
                  toast.success('Alt text saved');
                  onSaved();
                } catch (e) {
                  toast.error((e as Error).message);
                }
              }}
            >
              Save alt text
            </Button>
          )}
          <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-semibold text-blush-700 hover:bg-blush-100">
            Open
          </a>
          <Button variant="danger" size="sm" onClick={() => onDelete(item)} className="ms-auto">
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>
    </section>
  );
}
