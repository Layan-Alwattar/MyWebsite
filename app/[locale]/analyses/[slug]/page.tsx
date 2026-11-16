import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChartsBlock } from '@/components/site/charts-block';
import { DetailHero, DetailSection, StoryBlock } from '@/components/site/detail';
import { Chip } from '@/components/site/ui';
import { isLocale, LOCALES, tr } from '@/lib/i18n';
import { getAnalysis, getPublishedSlugs } from '@/lib/site/data';
import { getDictionary } from '@/lib/site/dictionary';

export const revalidate = 3600;
// Items published after a deploy render on first visit, then get cached.
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs('analyses');
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const a = await getAnalysis(slug);
  if (!a) return {};
  return {
    title: tr(a.title, locale),
    description: tr(a.summary, locale),
    alternates: { canonical: `/${locale}/analyses/${slug}`, languages: { en: `/en/analyses/${slug}`, ar: `/ar/analyses/${slug}` } },
  };
}

export default async function AnalysisPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const a = await getAnalysis(slug);
  if (!a) notFound();
  const dict = getDictionary(locale);

  return (
    <article>
      <DetailHero
        back={{ href: `/${locale}#analyses`, label: locale === 'ar' ? 'البيانات والتحليل' : 'Data & analysis' }}
        eyebrow={dict.dataAnalysis}
        title={tr(a.title, locale)}
        intro={tr(a.summary, locale)}
        meta={
          a.tools.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" dir="ltr">
              {a.tools.map((t) => (
                <li key={t}><Chip>{t}</Chip></li>
              ))}
            </ul>
          )
        }
      />
      <div className="mx-auto max-w-4xl space-y-14 px-4 pb-24 sm:px-6">
        {a.charts && a.charts.length > 0 && (
          <DetailSection title={locale === 'ar' ? 'المخططات التفاعلية' : 'Interactive charts'}>
            <ChartsBlock charts={a.charts} locale={locale} />
          </DetailSection>
        )}
        <StoryBlock id="insights" title={locale === 'ar' ? 'النتائج والرؤى' : 'Findings & insights'} doc={a.insights?.[locale] ?? a.insights?.en} />
      </div>
    </article>
  );
}
