import { PageHeader } from '@/components/admin/page-header';
import { createClient } from '@/lib/supabase/server';
import { Inbox, type Message } from './inbox';

export const metadata = { title: 'Messages' };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  const { open } = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, subject, message, locale, is_read, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Everything sent through your contact form." />
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error.message}</p>}
      <Inbox initial={(data ?? []) as Message[]} openId={open ?? null} />
    </div>
  );
}
