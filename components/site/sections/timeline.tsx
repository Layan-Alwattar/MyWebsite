import Link from 'next/link';
import { cn } from '@/lib/cn';
import { tr, type Locale } from '@/lib/i18n';
import type { TimelineItem } from '@/lib/site/data';
import { formatRange, type Dictionary } from '@/lib/site/dictionary';
import { Icon } from '../icon';
import { Reveal } from '../motion';
import { cardClass, Section, SectionHeading } from '../ui';

const KIND_FALLBACK_ICON = { education: 'graduation-cap', achievement: 'trophy', experience: 'briefcase' } as const;

/** Vertical timeline; entries slide in from alternating sides on desktop. */
export function Timeline({ items, label, locale, dict }: { items: TimelineItem[]; label: string; locale: Locale; dict: Dictionary }) {
  if (!items.length) return null;

  return (
    <Section id="timeline">
      <SectionHeading id="timeline" eyebrow={label} title={locale === 'ar' ? 'محطات في رحلتي' : 'Milestones along the way'} />

      <ol className="relative md:mx-auto md:max-w-4xl">
        {/* The line */}
        <span aria-hidden className="absolute inset-y-0 start-5 w-0.5 rounded-full bg-[linear-gradient(var(--c-primary),var(--c-secondary),var(--c-accent))] opacity-60 md:start-1/2 md:-translate-x-1/2 rtl:md:translate-x-1/2" />

        {items.map((item, i) => {
          const sideStart = i % 2 === 0;
          const date = formatRange(
            { start: item.start_date, end: item.end_date, current: item.is_current, label: tr(item.date_label, locale) },
            locale,
          );
          const highlights = (item.highlights ?? []).map((h) => tr(h, locale)).filter(Boolean);
          const link = item.link_url ? (item.link_url.startsWith('/') && !item.link_url.startsWith('//') ? `/${locale}${item.link_url}` : item.link_url) : null;

          const body = (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[color-mix(in_srgb,var(--c-primary)_14%,transparent)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-ink">
                  {dict[item.kind]}
                </span>
                {date && <span className="text-xs font-semibold text-fg-muted">{date}</span>}
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-fg">{tr(item.title, locale)}</h3>
              {tr(item.organization, locale) && <p className="text-sm font-medium text-fg-muted">{tr(item.organization, locale)}</p>}
              {tr(item.description, locale) && <p className="mt-2 text-sm leading-relaxed text-fg">{tr(item.description, locale)}</p>}
              {highlights.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-fg marker:text-primary">
                  {highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </>
          );

          return (
            <li key={item.id} className="relative mb-8 ps-14 md:grid md:grid-cols-2 md:gap-10 md:ps-0">
              {/* Dot */}
              <span
                aria-hidden
                className="absolute start-0 top-1 grid size-10 place-items-center rounded-full bg-card text-primary-ink shadow-md ring-4 ring-[var(--c-bg)] md:start-1/2 md:-translate-x-1/2 rtl:md:translate-x-1/2"
              >
                <Icon name={item.icon || KIND_FALLBACK_ICON[item.kind]} size={18} />
              </span>

              <Reveal
                y={18}
                className={cn('md:col-span-1', sideStart ? 'md:col-start-1 md:text-end' : 'md:col-start-2')}
              >
                {link ? (
                  <Link href={link} className={`${cardClass} block p-5 transition hover:-translate-y-0.5 motion-reduce:hover:translate-y-0`}>
                    {body}
                  </Link>
                ) : (
                  <div className={`${cardClass} p-5`}>{body}</div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
