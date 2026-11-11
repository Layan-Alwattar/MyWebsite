import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '@/lib/auth';

/**
 * Preview button target: /api/draft?path=/en/projects/my-slug
 * Turns on Next.js draft mode (admin only), so public pages also show drafts,
 * then sends the admin to the page. Turn off with /api/draft/disable.
 */
export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return new NextResponse('Not allowed', { status: 401 });

  const path = request.nextUrl.searchParams.get('path') ?? '/';
  // Same-site paths only (blocks open redirects like //evil.com).
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/';

  (await draftMode()).enable();
  redirect(safePath);
}
