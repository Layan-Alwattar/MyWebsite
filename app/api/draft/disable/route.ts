import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

/** Leaves preview mode and returns to the given page. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const path = request.nextUrl.searchParams.get('path') ?? '/';
  redirect(path.startsWith('/') && !path.startsWith('//') ? path : '/');
}
