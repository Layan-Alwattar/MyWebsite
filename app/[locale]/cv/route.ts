import { NextResponse, type NextRequest } from 'next/server';
import { cvUrl } from '@/components/site/cv-qr';
import { isLocale } from '@/lib/i18n';
import { getSettings } from '@/lib/site/data';

// Always look up the current file, so the CV QR code never goes stale.
export const dynamic = 'force-dynamic';

/** Stable CV link (used by the QR code): redirects to the uploaded CV. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new NextResponse('Not found', { status: 404 });
  const cv = cvUrl(await getSettings(), locale);
  return NextResponse.redirect(new URL(cv ?? `/${locale}`, request.url), 307);
}
