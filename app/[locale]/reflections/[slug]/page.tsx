import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DetailHero } from '@/components/site/detail';
import { Reveal } from '@/components/site/motion';
import { RichText } from '@/components/site/rich-text';
import { Chip } from '@/components/site/ui';
import { isLocale, LOCALES, tr } from '@/lib/i18n';
import { getPost, getPublishedSlugs } from '@/lib/site/data';
import { formatDate, getDictionary } from '@/lib/site/dictionary';

export const revalidate = 3600;
// Items published after a deploy render on first visit, then get cached.
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs('posts');
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = await getPost(slug);
  if (!p) return {};
  return {
    title: tr(p.title, locale),
    description: tr(p.excerpt, locale),
    alternates: { canonical: `/${locale}/reflections/${slug}`, languages: { en: `/en/reflections/${slug}`, ar: `/ar/reflections/${slug}` } },
    openGraph: { type: 'article', publishedTime: p.published_at ?? undefined, ...(p.cover_url ? { images: [{ url: p.cover_url }] } : {}) },
  };
}

export default async function ReflectionPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const p = await getPost(slug);
  if (!p) notFound();
  const dict = getDictionary(locale);

  return (
    <article>
      <DetailHero
        back={{ href: `/${locale}/reflections`, label: dict.allReflections }}
        eyebrow={`${formatDate(p.published_at ?? p.created_at, locale)}${p.reading_minutes ? ` · ${p.reading_minutes} ${dict.minRead}` : ''}`}
        title={tr(p.title, locale)}
        intro={tr(p.excerpt, locale)}
        meta={
          p.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <li key={t}><Chip>{t}</Chip></li>
              ))}
            </ul>
          )
        }
      >
        {p.cover_url && (
          <Reveal className="relative mt-10 aspect-[16/8] overflow-hidden rounded-theme shadow-xl">
            <Image src={p.cover_url} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </Reveal>
        )}
      </DetailHero>
      <Reveal className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <RichText doc={p.content?.[locale] ?? p.content?.en} className="text-lg leading-loose" />
      </Reveal>
    </article>
  );
}
