import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/admin/sidebar';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '../actions';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin' },
  robots: { index: false, follow: false },
};

/**
 * Shell for every protected admin page. requireAdmin() redirects anyone
 * who isn't listed in admin_users.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  const supabase = await createClient();
  const { count: unread } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  return (
    <div className="min-h-screen bg-blush-50 text-ink lg:flex">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        Skip to content
      </a>
      <Sidebar email={admin.email} unread={unread ?? 0} signOut={signOut} />
      <main id="admin-main" className="min-w-0 flex-1 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
