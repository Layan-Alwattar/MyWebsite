import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/admin/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/misc';
import { ENTITIES } from '@/lib/admin/entities';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Dashboard' };

// Main content types shown as dashboard tiles.
const TILE_KEYS = ['projects', 'skills', 'certificates', 'posts', 'timeline', 'analyses'];

export default async function DashboardPage() {
  const supabase = await createClient();
  const tiles = ENTITIES.filter((e) => TILE_KEYS.includes(e.key));

  const [counts, messages] = await Promise.all([
    Promise.all(
      tiles.map(async (entity) => {
        const total = await supabase.from(entity.table).select('*', { count: 'exact', head: true });
        const published = entity.hasStatus
          ? await supabase.from(entity.table).select('*', { count: 'exact', head: true }).eq('status', 'published')
          : null;
        return {
          entity,
          total: total.count ?? 0,
          published: published?.count ?? null,
          error: total.error?.message,
        };
      }),
    ),
    supabase
      .from('contact_messages')
      .select('id, name, email, subject, message, is_read, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const setupProblem = counts.find((c) => c.error)?.error;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hello, Layan ✿"
        description="Here's what's on your site right now."
        actions={<ButtonLink href="/admin/projects/new">New project</ButtonLink>}
      />

      {setupProblem && (
        <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          The database isn&apos;t fully set up: {setupProblem}. Run the migrations in <code>supabase/migrations</code> (see README).
        </p>
      )}

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {counts.map(({ entity, total, published }) => (
          <li key={entity.key}>
            <Link
              href={`/admin/${entity.key}`}
              className="group block rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-500/30"
            >
              <p className="text-sm font-medium text-muted">{entity.label}</p>
              <p className="mt-1 text-3xl font-semibold">{total}</p>
              {published !== null && (
                <p className="mt-1 text-xs text-muted">
                  {published} published · {total - published} draft
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recent messages</h2>
          <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm font-semibold text-blush-700 hover:underline">
            All messages <ArrowRight size={14} />
          </Link>
        </div>
        {!messages.data?.length ? (
          <p className="text-sm text-muted">No messages yet. They&apos;ll appear here when someone uses your contact form.</p>
        ) : (
          <ul className="divide-y divide-line">
            {messages.data.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages?open=${m.id}`} className="flex items-start gap-3 rounded-lg py-3 hover:bg-blush-50">
                  <Mail size={16} className={m.is_read ? 'mt-1 text-muted' : 'mt-1 text-blush-600'} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className={m.is_read ? 'text-sm' : 'text-sm font-semibold'}>
                      {m.name} <span className="font-normal text-muted">· {m.subject || 'No subject'}</span>
                    </p>
                    <p className="truncate text-sm text-muted">{m.message}</p>
                  </div>
                  <time className="shrink-0 text-xs text-muted" dateTime={m.created_at}>
                    {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
