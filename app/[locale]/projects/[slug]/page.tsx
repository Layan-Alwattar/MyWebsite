import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, FileText } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GithubIcon } from '@/components/icons/brand';
import { ChartsBlock } from '@/components/site/charts-block';
import { DetailHero, DetailSection, StoryBlock } from '@/components/site/detail';
import { LiveBadge } from '@/components/site/live-badge';
import { Gallery, PrototypeEmbed, VideoPlayer } from '@/components/site/media';
import { Reveal } from '@/components/site/motion';
import { btnPrimary, btnSecondary, Chip } from '@/components/site/ui';
import { hasRichContent, isLocale, LOCALES, tr } from '@/lib/i18n';
import { getProject, getProjects, getPublishedSlugs } from '@/lib/site/data';
import { formatRange, getDictionary } from '@/lib/site/dictionary';

export const revalidate = 3600;
// Items published after a deploy render on first visit, then get cached.
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs('projects');
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = await getProject(slug);
  if (!p) return {};
  const title = tr(p.title, locale);
  const description = tr(p.summary, locale);
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/projects/${slug}`, languages: { en: `/en/projects/${slug}`, ar: `/ar/projects/${slug}` } },
    openGraph: { title, description, type: 'article', ...(p.cover_url ? { images: [{ url: p.cover_url }] } : {}) },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [p, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!p) notFound();
  const dict = getDictionary(locale);
  const title = tr(p.title, locale);

  const date = formatRange({ start: p.start_date, end: p.end_date, current: p.is_ongoing }, locale);
  const idx = all.findIndex((x) => x.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const gallery = p.media.filter((m) => m.url);
  const rich = (d: typeof p.description) => d?.[locale] ?? d?.en;

  return (
    <article>
      <DetailHero
        back={{ href: `/${locale}#projects`, label: dict.backToProjects }}
        eyebrow={tr(p.label, locale)}
        title={title}
        intro={tr(p.summary, locale)}
        meta={
          <>
            {p.is_ongoing && <LiveBadge label={dict.inProgress} className="py-1" />}
            {date && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted">
                <CalendarDays size={15} aria-hidden /> {date}
              </span>
            )}
            {p.demo_url && (
              <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                <ExternalLink size={16} aria-hidden /> {dict.liveDemo}
              </a>
            )}
            {p.github_url && (
              <a href={p.github_url} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                <GithubIcon size={16} /> {dict.github}
              </a>
            )}
            {p.report_url && (
              <a href={p.report_url} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                <FileText size={16} aria-hidden /> {dict.report}
              </a>
            )}
          </>
        }
      >
        {p.cover_url && (
          <Reveal delay={0.1} className="relative mt-10 overflow-hidden rounded-theme bg-card shadow-xl">
            <Image
              src={p.cover_url}
              alt={title}
              width={1600}
              height={1000}
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="h-auto max-h-[80vh] w-full object-contain"
            />
          </Reveal>
        )}
      </DetailHero>

      <div className="mx-auto grid max-w-5xl gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 space-y-14">
          <StoryBlock id="overview" title={dict.overview} doc={rich(p.description)} />
          <StoryBlock id="problem" title={dict.problem} doc={rich(p.problem)} />
          <StoryBlock id="approach" title={dict.approach} doc={rich(p.approach)} />
          <StoryBlock id="results" title={dict.results} doc={rich(p.results)} />

          {p.video_url && (
            <DetailSection title={dict.video}>
              <VideoPlayer url={p.video_url} title={title} />
            </DetailSection>
          )}
          {p.prototype_url && (
            <DetailSection title={dict.prototype}>
              <PrototypeEmbed url={p.prototype_url} title={`${title} — ${dict.prototype}`} />
            </DetailSection>
          )}
          {p.charts.length > 0 && (
            <DetailSection title={dict.dataAnalysis}>
              <ChartsBlock charts={p.charts} locale={locale} />
            </DetailSection>
          )}
          {gallery.length > 0 && (
            <DetailSection title={dict.gallery}>
              <Gallery items={gallery} locale={locale} dict={dict} />
            </DetailSection>
          )}

          <StoryBlock id="learnings" title={dict.learnings} doc={rich(p.learnings)} />
          {!hasRichContent(rich(p.description)) && !gallery.length && !p.charts.length && (
            <p className="text-fg-muted">{tr(p.summary, locale)}</p>
          )}
        </div>

        {p.tools.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-fg-muted">{dict.toolsUsed}</h2>
            <ul className="flex flex-wrap gap-2" dir="ltr">
              {p.tools.map((t) => (
                <li key={t}><Chip className="px-3 py-1.5 text-sm">{t}</Chip></li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {(prev || next) && (
        <nav aria-label={locale === 'ar' ? 'مشاريع أخرى' : 'More projects'} className="border-t border-[color-mix(in_srgb,var(--c-ink)_8%,transparent)] px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-5xl justify-between gap-4">
            {prev ? (
              <Link href={`/${locale}/projects/${prev.slug}`} className="group max-w-[45%]">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  <ArrowLeft size={14} aria-hidden className="rtl:-scale-x-100" /> {dict.previousProject}
                </span>
                <span className="mt-1 block font-display text-lg font-semibold text-fg group-hover:text-primary-ink">{tr(prev.title, locale)}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/${locale}/projects/${next.slug}`} className="group max-w-[45%] text-end">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  {dict.nextProject} <ArrowRight size={14} aria-hidden className="rtl:-scale-x-100" />
                </span>
                <span className="mt-1 block font-display text-lg font-semibold text-fg group-hover:text-primary-ink">{tr(next.title, locale)}</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
