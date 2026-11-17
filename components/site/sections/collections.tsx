/**
 * Projects, Data & Analysis, Certificates and Reflections sections.
 */
import { ArrowRight, Award, BarChart3, BookOpenText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { tr, type Locale } from '@/lib/i18n';
import type { Analysis, Category, Certificate, Post, ProjectCard } from '@/lib/site/data';
import { formatDate, formatMonth, formatRange, type Dictionary } from '@/lib/site/dictionary';
import { Stagger, StaggerItem } from '../motion';
import { ProjectGrid } from '../project-grid';
import { btnSecondary, cardClass, Chip, railItem, railScroller, railTrack, Section, SectionHeading, SwipeHint } from '../ui';

export function Projects({
  projects,
  categories,
  label,
  locale,
  dict,
  limit,
}: {
  projects: ProjectCard[];
  categories: Category[];
  label: string;
  locale: Locale;
  dict: Dictionary;
  limit?: number;
}) {
  if (!projects.length) return null;
  // Featured first, then manual order.
  const sorted = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
  const shown = limit ? sorted.slice(0, limit) : sorted;
  const dateLabels = Object.fromEntries(
    shown.map((p) => [p.id, formatRange({ start: p.start_date, end: p.end_date, current: p.is_ongoing }, locale)]),
  );

  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        eyebrow={label}
        title={locale === 'ar' ? 'أشياء بنيتها' : 'Things I’ve built'}
        intro={locale === 'ar' ? 'من نماذج تعلّم الآلة إلى تطبيقات الجوال اللحظية.' : 'From machine-learning models to real-time mobile apps.'}
      />
      <ProjectGrid projects={shown} categories={categories} locale={locale} dict={dict} dateLabels={dateLabels} />
      {limit && projects.length > limit && (
        <div className="mt-10 text-center sm:mt-12">
          <Link href={`/${locale}/projects`} className={btnSecondary}>
            {dict.viewAllProjects} ({projects.length}) <ArrowRight size={16} aria-hidden className="rtl:-scale-x-100" />
          </Link>
        </div>
      )}
    </Section>
  );
}

export function Analyses({ analyses, label, locale, dict }: { analyses: Analysis[]; label: string; locale: Locale; dict: Dictionary }) {
  if (!analyses.length) return null;
  return (
    <Section id="analyses">
      <SectionHeading
        id="analyses"
        eyebrow={label}
        title={locale === 'ar' ? 'قصص ترويها البيانات' : 'Stories told with data'}
      />
      <Stagger className="grid gap-6 md:grid-cols-2">
        {analyses.map((a) => (
          <StaggerItem key={a.id}>
            <Link href={`/${locale}/analyses/${a.slug}`} className={`${cardClass} group flex h-full flex-col p-6 transition hover:-translate-y-1 motion-reduce:hover:translate-y-0`}>
              <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--c-secondary)_30%,transparent)] text-primary-ink">
                <BarChart3 size={20} aria-hidden />
              </span>
              <h3 className="font-display text-2xl font-semibold leading-snug text-fg">{tr(a.title, locale)}</h3>
              <p className="mt-3 flex-1 text-fg-muted">{tr(a.summary, locale)}</p>
              {a.tools.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5" dir="ltr">
                  {a.tools.slice(0, 4).map((t) => (
                    <li key={t}><Chip>{t}</Chip></li>
                  ))}
                </ul>
              )}
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
                {dict.readAnalysis} <ArrowRight size={15} aria-hidden className="transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export function Certificates({ certificates, label, locale }: { certificates: Certificate[]; label: string; locale: Locale }) {
  if (!certificates.length) return null;
  return (
    <Section id="certificates">
      <SectionHeading
        id="certificates"
        eyebrow={label}
        title={locale === 'ar' ? 'أتعلّم باستمرار' : 'Always learning'}
      />
      {certificates.length > 1 && <SwipeHint locale={locale} />}
      <div className={railScroller} tabIndex={0} role="region" aria-label={label}>
        <Stagger className={`${railTrack} sm:grid-cols-2 lg:grid-cols-3`}>
          {certificates.map((c) => (
            <StaggerItem key={c.id} className={`${railItem} self-stretch`}>
              <Link href={`/${locale}/certificates/${c.slug}`} className={`${cardClass} group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 motion-reduce:hover:translate-y-0`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-[color-mix(in_srgb,var(--c-accent)_18%,var(--c-surface))]">
                  {c.image_url ? (
                    <Image src={c.image_url} alt="" fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw" className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100" />
                  ) : (
                    <Award aria-hidden className="absolute inset-0 m-auto text-primary-ink" size={40} />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug text-fg">{tr(c.title, locale)}</h3>
                  <p className="mt-1 text-sm text-fg-muted">{tr(c.provider, locale)}</p>
                  {c.issued_on && <p className="mt-auto pt-3 text-xs font-semibold text-primary-ink">{formatMonth(c.issued_on, locale)}</p>}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

export function Reflections({ posts, label, locale, dict, limit = 3 }: { posts: Post[]; label: string; locale: Locale; dict: Dictionary; limit?: number }) {
  if (!posts.length) return null;
  return (
    <Section id="reflections">
      <SectionHeading id="reflections" eyebrow={label} title={locale === 'ar' ? 'أفكار وتأملات' : 'Notes & reflections'} />
      <Stagger className="grid gap-6 md:grid-cols-3">
        {posts.slice(0, limit).map((p) => (
          <StaggerItem key={p.id}>
            <PostCard post={p} locale={locale} dict={dict} />
          </StaggerItem>
        ))}
      </Stagger>
      {posts.length > limit && (
        <div className="mt-10 text-center">
          <Link href={`/${locale}/reflections`} className="inline-flex items-center gap-2 font-semibold text-primary-ink underline-offset-4 hover:underline">
            {dict.allReflections} <ArrowRight size={16} aria-hidden className="rtl:-scale-x-100" />
          </Link>
        </div>
      )}
    </Section>
  );
}

export function PostCard({ post: p, locale, dict }: { post: Post; locale: Locale; dict: Dictionary }) {
  return (
    <Link href={`/${locale}/reflections/${p.slug}`} className={`${cardClass} group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 motion-reduce:hover:translate-y-0`}>
      <div className="relative aspect-[16/9] bg-[color-mix(in_srgb,var(--c-secondary)_22%,var(--c-surface))]">
        {p.cover_url ? (
          <Image src={p.cover_url} alt="" fill sizes="(min-width: 768px) 33vw, 92vw" className="object-cover" />
        ) : (
          <BookOpenText aria-hidden className="absolute inset-0 m-auto text-primary-ink" size={36} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-fg-muted">
          {formatDate(p.published_at ?? p.created_at, locale)}
          {p.reading_minutes ? ` · ${p.reading_minutes} ${dict.minRead}` : ''}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-fg">{tr(p.title, locale)}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-fg-muted">{tr(p.excerpt, locale)}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
          {dict.readMore} <ArrowRight size={15} aria-hidden className="rtl:-scale-x-100" />
        </span>
      </div>
    </Link>
  );
}
