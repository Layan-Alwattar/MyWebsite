import { tr, type Locale } from '@/lib/i18n';
import type { Settings } from '@/lib/site/data';
import type { Dictionary } from '@/lib/site/dictionary';
import { Icon } from '../icon';
import { Counter, Reveal, Stagger, StaggerItem } from '../motion';
import { RichText } from '../rich-text';
import { cardClass, Chip, Section, SectionHeading } from '../ui';

export function About({ settings, label, locale, dict }: { settings: Settings; label: string; locale: Locale; dict: Dictionary }) {
  const stats = settings.stats ?? [];
  const facts = settings.fun_facts ?? [];
  const interests = settings.interests ?? [];

  return (
    <Section id="about">
      <SectionHeading id="about" eyebrow={label} title={tr(settings.about_title, locale) || label} />

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <RichText doc={settings.about_story?.[locale] ?? settings.about_story?.en} className="text-lg leading-relaxed" />
          {interests.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-muted">{dict.interests}</h3>
              <ul className="flex flex-wrap gap-2">
                {interests.map((it, i) => (
                  <li key={i}>
                    <Chip className="px-3.5 py-1.5 text-sm">
                      <Icon name={it.icon} size={15} className="text-primary-ink" />
                      {tr(it.label, locale)}
                    </Chip>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>

        <div className="space-y-6">
          {stats.length > 0 && (
            <Stagger as="ul" className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <StaggerItem as="li" key={i} className={`${cardClass} p-5`}>
                  <p className="font-display text-4xl font-semibold text-primary-ink">
                    <Counter value={Number(s.value) || 0} suffix={s.suffix} locale={locale} />
                  </p>
                  <p className="mt-1 text-sm leading-snug text-fg-muted">{tr(s.label, locale)}</p>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {facts.length > 0 && (
            <Reveal className={`${cardClass} relative p-6`}>
              <h3 className="mb-4 font-display text-xl font-semibold text-fg">{dict.funFacts}</h3>
              <ul className="space-y-3">
                {facts.map((f, i) => (
                  <li key={i} className="flex gap-3 text-fg">
                    <span aria-hidden className="text-xl leading-6">{f.emoji || '✿'}</span>
                    <span>{tr(f.text, locale)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
