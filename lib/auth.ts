import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Returns the signed-in user's id/email when they are an admin, else null.
 * Cached per request so layouts and pages can both call it cheaply.
 */
export const getAdmin = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error || !isAdmin) return null;

  return { id: claims.sub, email: (claims.email as string | undefined) ?? '' };
});

/**
 * Guard for admin pages and Server Actions. Redirects to the login page
 * unless the current user is listed in admin_users.
 */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

/** Only allow redirects back into the admin area (prevents open redirects). */
export function safeAdminPath(next: unknown): string {
  return typeof next === 'string' && /^\/admin(\/|$|\?)/.test(next) && !next.startsWith('//')
    ? next
    : '/admin';
}
