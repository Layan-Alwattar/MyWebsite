import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Projects } from '@/components/site/sections/collections';
import { isLocale, tr } from '@/lib/i18n';
import { getCategories, getProjects, getSections } from '@/lib/site/data';
import { getDictionary } from '@/lib/site/dictionary';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const sections = await getSections();
  return {
    title: tr(sections.find((s) => s.key === 'projects')?.label, locale) || 'Projects',
    alternates: { canonical: `/${locale}/projects`, languages: { en: '/en/projects', ar: '/ar/projects' } },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [projects, categories, sections] = await Promise.all([getProjects(), getCategories(), getSections()]);
  const label = tr(sections.find((s) => s.key === 'projects')?.label, locale);
  return <Projects projects={projects} categories={categories} label={label} locale={locale} dict={getDictionary(locale)} />;
}
