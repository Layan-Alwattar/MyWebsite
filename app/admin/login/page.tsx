import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdmin, safeAdminPath } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // Already signed in as admin? Skip the form.
  if (isSupabaseConfigured && (await getAdmin())) redirect(safeAdminPath(next));

  return (
    <main className="grid min-h-screen place-items-center bg-[#FFF7F9] px-4 text-[#2B1B2E]">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_20px_60px_-20px_rgba(224,90,142,0.35)]">
        <h1 className="text-2xl font-semibold">Welcome back ✿</h1>
        <p className="mt-1 text-sm text-[#6E5A70]">Sign in to manage your portfolio.</p>

        {isSupabaseConfigured ? (
          <LoginForm next={safeAdminPath(next)} />
        ) : (
          <p role="alert" className="mt-6 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            Supabase is not configured. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to <code>.env.local</code>.
          </p>
        )}
      </div>
    </main>
  );
}
