import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n';
import { getPublishedSlugs } from '@/lib/site/data';
import { SITE_URL } from '@/lib/site/url';

export const revalidate = 3600;

/** sitemap.xml with every page in both languages (and hreflang alternates). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, certificates, posts, analyses] = await Promise.all([
    getPublishedSlugs('projects'),
    getPublishedSlugs('certificates'),
    getPublishedSlugs('posts'),
    getPublishedSlugs('analyses'),
  ]);

  const paths = [
    '',
    '/projects',
    ...(posts.length ? ['/reflections'] : []),
    ...projects.map((s) => `/projects/${s}`),
    ...certificates.map((s) => `/certificates/${s}`),
    ...posts.map((s) => `/reflections/${s}`),
    ...analyses.map((s) => `/analyses/${s}`),
  ];

  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    })),
  );
}
