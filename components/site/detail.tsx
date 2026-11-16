/**
 * Shared layout pieces for detail pages (project, certificate, reflection, analysis).
 */
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { hasRichContent } from '@/lib/i18n';
import { Reveal } from './motion';
import { RichText } from './rich-text';
import { Blobs } from './ui';

export function DetailHero({ back, eyebrow, title, intro, meta, children }: { back: { href: string; label: string }; eyebrow?: string; title: string; intro?: string; meta?: ReactNode; children?: ReactNode }) {
  return (
    <header className="relative isolate overflow-hidden px-4 pb-12 pt-8 sm:px-6 md:pb-16">
      <Blobs className="opacity-70" />
      <div className="mx-auto max-w-5xl">
        <Link href={back.href} className="inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1.5 text-sm font-semibold text-fg-muted backdrop-blur transition hover:text-primary-ink">
          <ArrowLeft size={15} aria-hidden className="rtl:-scale-x-100" /> {back.label}
        </Link>
        <Reveal className="mt-8">
          {eyebrow && <p className="text-sm font-bold uppercase tracking-wider text-primary-ink">{eyebrow}</p>}
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-6xl">{title}</h1>
          {intro && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-fg-muted md:text-xl">{intro}</p>}
          {meta && <div className="mt-6 flex flex-wrap items-center gap-3">{meta}</div>}
        </Reveal>
        {children}
      </div>
    </header>
  );
}

/** A titled block of rich text; renders nothing when empty. */
export function StoryBlock({ id, title, doc }: { id: string; title: string; doc: unknown }) {
  if (!hasRichContent(doc)) return null;
  const body = <RichText doc={doc} />;
  return (
    <Reveal as="section" className="scroll-mt-24">
      <h2 id={id} className="mb-4 flex items-center gap-3 font-display text-2xl font-semibold text-fg md:text-3xl">
        <span aria-hidden className="h-6 w-1.5 rounded-full bg-[linear-gradient(var(--c-primary),var(--c-secondary))]" />
        {title}
      </h2>
      {body}
    </Reveal>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal as="section">
      <h2 className="mb-5 flex items-center gap-3 font-display text-2xl font-semibold text-fg md:text-3xl">
        <span aria-hidden className="h-6 w-1.5 rounded-full bg-[linear-gradient(var(--c-primary),var(--c-secondary))]" />
        {title}
      </h2>
      {children}
    </Reveal>
  );
}
