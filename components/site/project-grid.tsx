'use client';

/**
 * Filterable grid of "polaroid" project cards with washi tape.
 * Cards tilt slightly and straighten on hover; filtering animates layout.
 */
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { tr, type Locale } from '@/lib/i18n';
import type { Category, ProjectCard } from '@/lib/site/data';
import type { Dictionary } from '@/lib/site/dictionary';
import { LiveBadge } from './live-badge';
import { useMotionScale } from './motion';

const TILTS = ['-rotate-[1.5deg]', 'rotate-[1deg]', '-rotate-[0.5deg]', 'rotate-[1.5deg]'];

export function ProjectGrid({
  projects,
  categories,
  locale,
  dict,
  dateLabels,
}: {
  projects: ProjectCard[];
  categories: Category[];
  locale: Locale;
  dict: Dictionary;
  /** Pre-formatted date ranges by project id (formatted on the server). */
  dateLabels: Record<string, string>;
}) {
  const [filter, setFilter] = useState<string>('all');
  const scale = useMotionScale();
  const used = categories.filter((c) => projects.some((p) => p.categories.includes(c.slug)));
  const visible = filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <div>
      {used.length > 1 && (
        <div role="group" aria-label={locale === 'ar' ? 'تصفية المشاريع' : 'Filter projects'} className="mb-8 flex flex-wrap gap-2 sm:mb-10">
          {[{ slug: 'all', name: { en: dict.all, ar: dict.all } }, ...used].map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={filter === c.slug}
              onClick={() => setFilter(c.slug)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                filter === c.slug
                  ? 'bg-primary-ink text-[var(--c-on-primary)] shadow-md'
                  : 'bg-card text-fg shadow-sm hover:bg-[color-mix(in_srgb,var(--c-primary)_12%,var(--c-surface))]',
              )}
            >
              {tr(c.name, locale)}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-fg-muted">{dict.noProjects}</p>
      ) : (
        <motion.ul layout={scale > 0} className="grid gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout={scale > 0}
                initial={scale ? { opacity: 0, y: 20 * scale } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={scale ? { opacity: 0, scale: 0.95 } : undefined}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <PolaroidCard project={p} locale={locale} dict={dict} tilt={TILTS[i % TILTS.length]} date={dateLabels[p.id]} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

function PolaroidCard({ project: p, locale, dict, tilt, date }: { project: ProjectCard; locale: Locale; dict: Dictionary; tilt: string; date?: string }) {
  const title = tr(p.title, locale);
  return (
    <Link
      href={`/${locale}/projects/${p.slug}`}
      className={cn(
        'polaroid group relative block rounded-[calc(var(--radius)*0.7)] bg-card p-3 pb-5 transition duration-300',
        tilt,
        'hover:rotate-0 hover:-translate-y-1.5 focus-visible:rotate-0 motion-reduce:rotate-0 motion-reduce:hover:translate-y-0',
      )}
    >
      <span className="washi" aria-hidden />
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3] rounded-[calc(var(--radius)*0.45)] bg-[color-mix(in_srgb,var(--c-secondary)_22%,var(--c-surface))]">
        {p.cover_url ? (
          <Image
            src={p.cover_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            aria-hidden
            className="grid size-full place-items-center font-display text-4xl font-semibold text-primary-ink sm:text-5xl"
            style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--c-primary) 22%, var(--c-surface)), color-mix(in srgb, var(--c-accent) 28%, var(--c-surface)))' }}
          >
            {title.charAt(0)}
          </div>
        )}
        {p.featured && (
          <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[11px] font-bold text-primary-ink backdrop-blur">
            <Star size={11} aria-hidden fill="currentColor" /> {dict.featured}
          </span>
        )}
        {p.is_ongoing && <LiveBadge label={dict.inProgress} className="absolute end-2 top-2 shadow-sm" />}
      </div>
      <div className="px-1.5 pt-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-ink">{tr(p.label, locale)}</p>
          {date && <p className="shrink-0 text-xs text-fg-muted">{date}</p>}
        </div>
        <h3 className="mt-1 flex items-start gap-1 font-display text-xl font-semibold leading-snug text-fg">
          {title}
          <ArrowUpRight size={18} aria-hidden className="mt-1 shrink-0 opacity-0 transition group-hover:opacity-100 rtl:-scale-x-100" />
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">{tr(p.summary, locale)}</p>
        {p.tools.length > 0 && (
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-fg-muted" dir="ltr">
            {p.tools.slice(0, 5).join(' · ')}
          </p>
        )}
      </div>
    </Link>
  );
}
