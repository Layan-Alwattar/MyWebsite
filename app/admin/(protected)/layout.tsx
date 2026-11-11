import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { signOut } from '../actions';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin' },
  robots: { index: false, follow: false },
};

/**
 * Shell for every protected admin page. requireAdmin() redirects anyone who
 * isn't in admin_users. The full sidebar navigation arrives in phase (b).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#FFF7F9] text-[#2B1B2E]">
      <header className="flex items-center justify-between border-b border-[#F1DDE7] bg-white px-6 py-3">
        <span className="font-semibold">Portfolio Admin</span>
        <div className="flex items-center gap-4 text-sm text-[#6E5A70]">
          <span>{admin.email}</span>
          <form action={signOut}>
            <button type="submit" className="rounded-lg px-3 py-1.5 hover:bg-[#FCE8F0]">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
