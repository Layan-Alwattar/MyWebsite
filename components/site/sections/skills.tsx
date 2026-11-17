import { tr, type Locale } from '@/lib/i18n';
import type { SkillCategory } from '@/lib/site/data';
import { Icon } from '../icon';
import { Stagger, StaggerItem } from '../motion';
import { cardClass, railItem, railScroller, railTrack, Section, SectionHeading, SwipeHint } from '../ui';

/** Skill cards grouped by category; badges wiggle gently on hover. */
export function Skills({ categories, label, locale }: { categories: SkillCategory[]; label: string; locale: Locale }) {
  const visible = categories.filter((c) => c.skills.length);
  if (!visible.length) return null;

  return (
    <Section id="skills">
      <SectionHeading
        id="skills"
        eyebrow={label}
        title={locale === 'ar' ? 'أدوات أحب العمل بها' : 'Tools I love working with'}
      />
      {visible.length > 1 && <SwipeHint locale={locale} />}
      <div className={railScroller} tabIndex={0} role="region" aria-label={label}>
        <Stagger className={`${railTrack} sm:grid-cols-2`}>
          {visible.map((cat) => (
            <StaggerItem key={cat.id} className={`${cardClass} ${railItem} p-5 sm:p-6`}>
              <h3 className="mb-4 flex items-center gap-3 font-display text-lg font-semibold text-fg sm:text-xl">
                <span className="grid size-10 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--c-primary)_16%,transparent)] text-primary-ink">
                  <Icon name={cat.icon} size={20} />
                </span>
                {tr(cat.name, locale)}
              </h3>
              <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                {cat.skills.map((s) => (
                  <li key={s.id}>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--c-ink)_10%,transparent)] px-2.5 py-1 text-[13px] font-medium text-fg transition sm:px-3 sm:py-1.5 sm:text-sm duration-200 hover:-rotate-2 hover:scale-105 hover:border-primary hover:bg-[color-mix(in_srgb,var(--c-primary)_10%,transparent)] motion-reduce:hover:rotate-0 motion-reduce:hover:scale-100"
                    >
                      {s.icon && <Icon name={s.icon} size={14} className="text-primary-ink" />}
                      {tr(s.name, locale)}
                    </span>
                    {typeof s.level === 'number' && (
                      <span className="mt-1 block h-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--c-ink)_8%,transparent)]" role="meter" aria-valuenow={s.level} aria-valuemin={0} aria-valuemax={100} aria-label={tr(s.name, locale)}>
                        <span className="block h-full rounded-full bg-primary" style={{ width: `${s.level}%` }} />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
