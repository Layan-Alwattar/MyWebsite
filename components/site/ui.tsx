/**
 * Server-rendered building blocks for the public site.
 */
import { MoveHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { tr, type Locale } from '@/lib/i18n';
import type { SocialLink } from '@/lib/site/data';
import type { Dictionary } from '@/lib/site/dictionary';
import { SocialIcon } from './icon';
import { Reveal } from './motion';
import { btnPrimary, btnSecondary, cardClass, railItem, railScroller, railTrack } from './styles';

export { btnPrimary, btnSecondary, cardClass, railItem, railScroller, railTrack };

/** Phone-only hint above a swipeable rail. */
export function SwipeHint({ locale }: { locale: Locale }) {
  return (
    <p className="-mt-4 mb-4 flex items-center gap-1.5 text-xs font-medium text-fg-muted sm:hidden">
      <MoveHorizontal size={14} aria-hidden /> {locale === 'ar' ? 'اسحب لرؤية المزيد' : 'Swipe to see more'}
    </p>
  );
}

/** A homepage section with an anchor id and consistent spacing. */
export function Section({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('relative scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20 md:py-28', className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({ id, eyebrow, title, intro }: { id: string; eyebrow?: string; title: string; intro?: string }) {
  return (
    <Reveal className="mb-8 max-w-2xl sm:mb-12">
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary-ink">
          <span aria-hidden className="text-primary">✿</span>
          {eyebrow}
        </p>
      )}
      <h2 id={`${id}-title`} className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-fg-muted">{intro}</p>}
    </Reveal>
  );
}

/** Soft drifting gradient blobs (pure CSS; pauses for reduced motion). */
export function Blobs({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      <div className="blob absolute -top-24 -end-24 size-[26rem] rounded-full opacity-45 blur-3xl" style={{ background: 'var(--c-primary)' }} />
      <div className="blob absolute top-1/3 -start-32 size-[22rem] rounded-full opacity-35 blur-3xl [animation-delay:-7s]" style={{ background: 'var(--c-secondary)' }} />
      <div className="blob absolute -bottom-24 end-1/4 size-[18rem] rounded-full opacity-35 blur-3xl [animation-delay:-14s]" style={{ background: 'var(--c-accent)' }} />
    </div>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-fg',
        'bg-[color-mix(in_srgb,var(--c-secondary)_28%,var(--c-surface))]',
        className,
      )}
    >
      {children}
    </span>
  );
}



export function SocialLinks({ links, locale, className }: { links: SocialLink[]; locale: Locale; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {links.map((l) => {
        const external = /^https?:/.test(l.url);
        return (
          <li key={l.id}>
            <a
              href={l.url}
              aria-label={tr(l.label, locale)}
              title={tr(l.label, locale)}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="grid size-11 place-items-center rounded-full bg-card text-fg shadow-sm transition hover:-translate-y-0.5 hover:text-primary-ink motion-reduce:hover:translate-y-0"
            >
              <SocialIcon platform={l.platform} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteFooter({ name, links, locale, dict }: { name: string; links: SocialLink[]; locale: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-[color-mix(in_srgb,var(--c-ink)_8%,transparent)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-fg-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {name} · {dict.builtWith} <span className="text-primary">♡</span>
        </p>
        <SocialLinks links={links} locale={locale} />
      </div>
    </footer>
  );
}

export function PreviewBanner({ dict, path }: { dict: Dictionary; path: string }) {
  return (
    <div role="status" className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-amber-300 px-4 py-2 text-sm font-semibold text-amber-950">
      {dict.previewMode}
      {/* Plain <a>: leaving preview must hit the route handler, not client navigation. */}
      <a href={`/api/draft/disable?path=${encodeURIComponent(path)}`} className="underline underline-offset-2">
        {dict.exitPreview}
      </a>
    </div>
  );
}

