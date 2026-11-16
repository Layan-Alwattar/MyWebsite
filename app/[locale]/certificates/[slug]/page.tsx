import { BadgeCheck, CalendarDays, FileText } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DetailHero, StoryBlock } from '@/components/site/detail';
import { Reveal } from '@/components/site/motion';
import { btnPrimary, btnSecondary, Chip } from '@/components/site/ui';
import { isLocale, LOCALES, tr } from '@/lib/i18n';
import { getCertificate, getPublishedSlugs } from '@/lib/site/data';
import { formatDate, getDictionary } from '@/lib/site/dictionary';

export const revalidate = 3600;
// Items published after a deploy render on first visit, then get cached.
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs('certificates');
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const c = await getCertificate(slug);
  if (!c) return {};
  return {
    title: tr(c.title, locale),
    description: tr(c.provider, locale),
    alternates: { canonical: `/${locale}/certificates/${slug}`, languages: { en: `/en/certificates/${slug}`, ar: `/ar/certificates/${slug}` } },
    ...(c.image_url ? { openGraph: { images: [{ url: c.image_url }] } } : {}),
  };
}

export default async function CertificatePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const c = await getCertificate(slug);
  if (!c) notFound();
  const dict = getDictionary(locale);
  const title = tr(c.title, locale);
  const doc = (d: typeof c.summary) => d?.[locale] ?? d?.en;

  return (
    <article>
      <DetailHero
        back={{ href: `/${locale}#certificates`, label: locale === 'ar' ? 'الدورات والشهادات' : 'Courses & certificates' }}
        eyebrow={tr(c.provider, locale)}
        title={title}
        meta={
          <>
            {c.issued_on && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted">
                <CalendarDays size={15} aria-hidden /> {dict.issued}: {formatDate(c.issued_on, locale)}
              </span>
            )}
            {c.credential_url && (
              <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                <BadgeCheck size={16} aria-hidden /> {dict.verify}
              </a>
            )}
            {c.pdf_url && (
              <a href={c.pdf_url} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                <FileText size={16} aria-hidden /> {dict.viewPdf}
              </a>
            )}
          </>
        }
      />

      <div className="mx-auto grid max-w-5xl gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        {c.image_url && (
          <Reveal className="relative self-start overflow-hidden rounded-theme bg-card p-3 shadow-xl lg:sticky lg:top-24">
            <Image src={c.image_url} alt={`${dict.certificate}: ${title}`} width={1600} height={1130} sizes="(min-width: 1024px) 540px, 100vw" className="h-auto w-full rounded-[calc(var(--radius)*0.5)]" />
          </Reveal>
        )}
        <div className="space-y-12">
          <StoryBlock id="summary" title={dict.courseSummary} doc={doc(c.summary)} />
          <StoryBlock id="learned" title={dict.whatILearned} doc={doc(c.what_i_learned)} />
          <StoryBlock id="gained" title={dict.whatIGained} doc={doc(c.what_i_gained)} />
          {c.skills.length > 0 && (
            <Reveal>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-fg-muted">{dict.skillsCovered}</h2>
              <ul className="flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <li key={s}><Chip className="px-3 py-1.5 text-sm">{s}</Chip></li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </article>
  );
}
