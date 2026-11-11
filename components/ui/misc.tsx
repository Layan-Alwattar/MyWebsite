'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'pink' | 'green' | 'gray' | 'amber';

const tones: Record<Tone, string> = {
  pink: 'bg-blush-100 text-blush-800',
  green: 'bg-emerald-50 text-emerald-800',
  gray: 'bg-stone-100 text-stone-700',
  amber: 'bg-amber-50 text-amber-900',
};

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return status === 'published' ? <Badge tone="green">Published</Badge> : <Badge tone="amber">Draft</Badge>;
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-2xl border border-line bg-white p-5 shadow-sm', className)}>{children}</div>;
}

/**
 * Accessible modal built on the native <dialog> element
 * (focus trap, Esc to close and backdrop come for free).
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        'm-auto w-[calc(100%-2rem)] rounded-3xl bg-white p-0 text-ink shadow-2xl backdrop:bg-[#2b1b2e]/40 backdrop:backdrop-blur-sm',
        wide ? 'max-w-5xl' : 'max-w-lg',
      )}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-muted hover:bg-blush-100 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
          <div className="overflow-y-auto p-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line bg-white/60 p-10 text-center">
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}
