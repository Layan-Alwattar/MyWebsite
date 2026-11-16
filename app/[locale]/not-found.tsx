'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { getDictionary } from '@/lib/site/dictionary';
import { btnPrimary } from '@/components/site/styles';

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale) ? params.locale : 'en';
  const dict = getDictionary(locale);
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p aria-hidden className="font-display text-8xl font-semibold text-gradient">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-fg">{dict.notFoundTitle}</h1>
      <p className="mt-3 text-fg-muted">{dict.notFoundText}</p>
      <Link href={`/${locale}`} className={`${btnPrimary} mt-8`}>
        {dict.goHome}
      </Link>
    </div>
  );
}
