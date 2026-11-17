import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { tr, type Locale } from '@/lib/i18n';
import type { TimelineItem } from '@/lib/site/data';
import { formatRange, type Dictionary } from '@/lib/site/dictionary';
import { Icon } from '../icon';
import { LiveBadge } from '../live-badge';
import { Reveal } from '../motion';
import { btnSecondary, cardClass, Section, SectionHeading } from '../ui';

/** Entries shown before "Show more" (keeps the page short on phones). */
const FIRST = 6;

const KIND_FALLBACK_ICON = { education: 'graduation-cap', achievement: 'trophy', experience: 'briefcase' } as const;

/** Vertical timeline; entries slide in from alternating sides on desktop. */
export function Timeline({ items, label, locale, dict }: { items: TimelineItem[]; label: string; locale: Locale; dict: Dictionary }) {
  if (!items.length) return null;

  const renderItem = (item: TimelineItem, i: number) => {
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
          {item.is_current && <LiveBadge label={dict.now} />}
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
  };

  const line = (
    <span aria-hidden className="absolute inset-y-0 start-5 w-0.5 rounded-full bg-[linear-gradient(var(--c-primary),var(--c-secondary),var(--c-accent))] opacity-60 md:start-1/2 md:-translate-x-1/2 rtl:md:translate-x-1/2" />
  );
  const rest = items.slice(FIRST);

  return (
    <Section id="timeline">
      <SectionHeading id="timeline" eyebrow={label} title={locale === 'ar' ? 'محطات في رحلتي' : 'Milestones along the way'} />

      <ol className="relative md:mx-auto md:max-w-4xl">
        {line}
        {items.slice(0, FIRST).map(renderItem)}
      </ol>
      {rest.length > 0 && (
        // <details> works without JavaScript and is announced as expandable.
        <details className="group text-center">
          <summary className={`${btnSecondary} mb-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
            <span className="group-open:hidden">{dict.showMore.replace('{n}', String(rest.length))}</span>
            <span className="hidden group-open:inline">{dict.showLess}</span>
            <ChevronDown size={16} aria-hidden className="transition group-open:rotate-180" />
          </summary>
          <ol className="relative text-start md:mx-auto md:max-w-4xl" start={FIRST + 1}>
            {line}
            {rest.map((item, i) => renderItem(item, i + FIRST))}
          </ol>
        </details>
      )}
    </Section>
  );
}
