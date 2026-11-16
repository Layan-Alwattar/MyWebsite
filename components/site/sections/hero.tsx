import { ArrowDown, Download, MapPin, Send } from 'lucide-react';
import Image from 'next/image';
import { tr, type Locale } from '@/lib/i18n';
import type { Settings, SocialLink } from '@/lib/site/data';
import type { Dictionary } from '@/lib/site/dictionary';
import { Reveal } from '../motion';
import { Blobs, btnPrimary, btnSecondary, Chip, SocialLinks } from '../ui';

/** Animated intro: name, title, tagline, photo in a soft blob frame, CTAs. */
export function Hero({
  settings,
  socials,
  locale,
  dict,
  hasContact,
}: {
  settings: Settings;
  socials: SocialLink[];
  locale: Locale;
  dict: Dictionary;
  hasContact: boolean;
}) {
  const name = tr(settings.full_name, locale);
  const firstName = name.split(' ')[0];
  const cv = settings.cv_url?.[locale] || settings.cv_url?.en || settings.cv_url?.ar;
  const tags = (settings.hero_tags ?? []).map((t) => tr(t, locale)).filter(Boolean);

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden px-4 pb-20 pt-10 sm:px-6 md:pb-28 md:pt-16">
      <Blobs />
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.25fr_1fr]">
        <div>
          {settings.show_availability && tr(settings.availability, locale) && (
            <Reveal>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-1.5 text-sm font-semibold text-fg shadow-sm backdrop-blur">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                </span>
                {tr(settings.availability, locale)}
              </span>
            </Reveal>
          )}

          <Reveal delay={0.05}>
            <h1 id="hero-title" className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-7xl">
              {locale === 'ar' ? 'أهلاً، أنا ' : 'Hi, I’m '}
              <span className="text-gradient">{firstName}</span>
              <span className="text-primary">.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-4 font-display text-2xl text-fg sm:text-3xl">{tr(settings.headline, locale)}</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">{tr(settings.tagline, locale)}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-3">
              {hasContact && (
                <a href="#contact" className={btnPrimary}>
                  <Send size={16} aria-hidden className="rtl:-scale-x-100" /> {dict.contactMe}
                </a>
              )}
              {cv ? (
                <a href={cv} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                  <Download size={16} aria-hidden /> {dict.downloadCv}
                </a>
              ) : (
                <a href="#projects" className={btnSecondary}>
                  <ArrowDown size={16} aria-hidden /> {dict.viewProjects}
                </a>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <SocialLinks links={socials} locale={locale} />
              {tr(settings.location, locale) && (
                <span className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
                  <MapPin size={15} aria-hidden /> {tr(settings.location, locale)}
                </span>
              )}
            </div>
          </Reveal>
        </div>

        {/* Photo (or monogram) in a blob frame with floating focus tags */}
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-square">
            <div
              aria-hidden
              className="blob absolute inset-0 rounded-[42%_58%_63%_37%/45%_40%_60%_55%] opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--c-primary), var(--c-secondary) 55%, var(--c-accent))' }}
            />
            <div className="absolute inset-3 overflow-hidden rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-card">
              {settings.photo_url ? (
                <Image src={settings.photo_url} alt={name} fill priority sizes="(min-width: 768px) 384px, 80vw" className="object-cover" />
              ) : (
                <div className="grid size-full place-items-center font-display text-8xl font-semibold text-primary-ink">
                  {firstName.charAt(0)}
                </div>
              )}
            </div>
          </div>
          {tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label={locale === 'ar' ? 'مجالات التركيز' : 'Focus areas'}>
              {tags.map((t, i) => (
                <li key={t} className="float" style={{ animationDelay: `${i * -0.9}s` }}>
                  <Chip className="bg-card shadow-sm">{t}</Chip>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
