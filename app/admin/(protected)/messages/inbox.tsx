'use client';

import { Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/misc';
import { deleteMessage, setMessageRead } from './actions';

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  locale: string;
  is_read: boolean;
  created_at: string;
};

const fmt = (d: string) =>
  new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Two-pane inbox: list on the left, selected message on the right. */
export function Inbox({ initial, openId }: { initial: Message[]; openId: string | null }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(openId ?? initial[0]?.id ?? null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [, startTransition] = useTransition();

  const selected = messages.find((m) => m.id === selectedId) ?? null;
  const visible = messages.filter((m) => filter === 'all' || !m.is_read);

  function markRead(id: string, isRead: boolean) {
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, is_read: isRead } : m)));
    startTransition(async () => {
      const res = await setMessageRead(id, isRead);
      if (!res.ok) toast.error(res.message);
      else router.refresh();
    });
  }

  // Opening an unread message marks it read.
  function open(id: string) {
    setSelectedId(id);
    if (messages.find((m) => m.id === id)?.is_read === false) markRead(id, true);
  }

  // The message selected on first load (e.g. from the dashboard) counts as opened too.
  useEffect(() => {
    const first = initial.find((m) => m.id === (openId ?? initial[0]?.id));
    if (!first || first.is_read) return;
    setMessageRead(first.id, true).then((res) => {
      if (!res.ok) return;
      setMessages((ms) => ms.map((m) => (m.id === first.id ? { ...m, is_read: true } : m)));
      router.refresh();
    });
  }, [initial, openId, router]);

  function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    startTransition(async () => {
      const res = await deleteMessage(id);
      if (!res.ok) return void toast.error(res.message);
      setMessages((ms) => ms.filter((m) => m.id !== id));
      setSelectedId(null);
      toast.success('Deleted');
    });
  }

  if (!messages.length) return <EmptyState title="Your inbox is empty">Messages from the contact form will appear here.</EmptyState>;

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_1fr]">
      <div className="space-y-2">
        <div role="tablist" className="inline-flex rounded-xl bg-blush-100 p-1 text-sm">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn('rounded-lg px-3 py-1 font-semibold capitalize', filter === f ? 'bg-white shadow-sm' : 'text-muted')}
            >
              {f}
            </button>
          ))}
        </div>
        <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
          {visible.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => open(m.id)}
                aria-current={m.id === selectedId}
                className={cn(
                  'w-full rounded-xl border p-3 text-start transition',
                  m.id === selectedId ? 'border-blush-400 bg-white shadow-sm' : 'border-transparent hover:bg-white',
                )}
              >
                <div className="flex items-center gap-2">
                  {!m.is_read && <span className="size-2 shrink-0 rounded-full bg-blush-600" aria-label="Unread" />}
                  <span className={cn('flex-1 truncate text-sm', !m.is_read && 'font-semibold')}>{m.name}</span>
                  <time className="text-[11px] text-muted">{new Date(m.created_at).toLocaleDateString('en-GB')}</time>
                </div>
                <p className="truncate text-xs text-muted">{m.subject || m.message}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected ? (
        <article className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <header className="flex flex-wrap items-start gap-3 border-b border-line pb-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold">{selected.subject || 'No subject'}</h2>
              <p className="text-sm text-muted">
                {selected.name} · <a href={`mailto:${selected.email}`} className="text-blush-700 hover:underline">{selected.email}</a>
              </p>
              <p className="text-xs text-muted">
                {fmt(selected.created_at)} · {selected.locale === 'ar' ? 'Arabic site' : 'English site'}
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => markRead(selected.id, !selected.is_read)} aria-label={selected.is_read ? 'Mark as unread' : 'Mark as read'}>
                {selected.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(selected.id)} aria-label="Delete message">
                <Trash2 size={16} />
              </Button>
            </div>
          </header>
          <p dir="auto" className="whitespace-pre-wrap py-5 text-sm leading-relaxed">{selected.message}</p>
          <a
            href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject ?? 'Your message'}`)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blush-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blush-800"
          >
            <Reply size={16} /> Reply by email
          </a>
        </article>
      ) : (
        <EmptyState title="Select a message" />
      )}
    </div>
  );
}
