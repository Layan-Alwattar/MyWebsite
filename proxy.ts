import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/session';

const LOCALES = ['en', 'ar'];

/**
 * Runs before matching requests (Next.js 16 "proxy", formerly middleware).
 *
 * /admin/*  → keeps the Supabase session fresh and sends signed-out
 *             visitors to /admin/login (requireAdmin() is the real check).
 * other     → paths without a language prefix are redirected to /en or /ar,
 *             based on the visitor's browser language.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const { response, isSignedIn } = await updateSession(request);
    if (!isSignedIn && pathname !== '/admin/login') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    return response;
  }

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const preferred = (request.headers.get('accept-language') ?? '').toLowerCase().trim().startsWith('ar') ? 'ar' : 'en';
  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except API routes, Next internals, metadata files and static files (anything with a dot).
  matcher: ['/((?!api|_next|sitemap.xml|robots.txt|.*\\..*).*)'],
};
