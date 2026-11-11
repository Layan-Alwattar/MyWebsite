import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/session';

/**
 * Runs before every /admin request (Next.js 16 "proxy", formerly middleware).
 *  - keeps the Supabase session fresh
 *  - sends signed-out visitors to /admin/login
 * The real admin check (is this user in admin_users?) happens server-side in
 * requireAdmin(), so this is a fast first gate, not the only one.
 */
export async function proxy(request: NextRequest) {
  const { response, isSignedIn } = await updateSession(request);
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  if (!isSignedIn && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
