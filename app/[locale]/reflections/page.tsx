import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Reflections } from '@/components/site/sections/collections';
import { isLocale, tr } from '@/lib/i18n';
import { getPosts, getSections } from '@/lib/site/data';
import { getDictionary } from '@/lib/site/dictionary';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const sections = await getSections();
  return {
    title: tr(sections.find((s) => s.key === 'reflections')?.label, locale) || 'Reflections',
    alternates: { canonical: `/${locale}/reflections`, languages: { en: '/en/reflections', ar: '/ar/reflections' } },
  };
}

export default async function ReflectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [posts, sections] = await Promise.all([getPosts(), getSections()]);
  const dict = getDictionary(locale);
  const label = tr(sections.find((s) => s.key === 'reflections')?.label, locale);
  if (!posts.length) {
    return <p className="mx-auto max-w-xl px-4 py-32 text-center text-fg-muted">{locale === 'ar' ? 'لا توجد تأملات منشورة بعد.' : 'No reflections published yet.'}</p>;
  }
  return <Reflections posts={posts} label={label} locale={locale} dict={dict} limit={posts.length} />;
}
