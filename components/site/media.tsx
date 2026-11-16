'use client';

/**
 * Media on project pages: video (YouTube / Vimeo / uploaded file),
 * prototype embed (Figma or any https demo), and a photo gallery
 * with an accessible lightbox (Esc, arrow keys, focus handling).
 */
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { tr, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/site/dictionary';

/** Converts a YouTube/Vimeo page link into an embeddable URL, or null for direct files. */
export function toVideoEmbed(url: string): string | null {
  try {
    const u = new URL(url, 'https://x.invalid');
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') ?? u.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.match(/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const embed = toVideoEmbed(url);
  return (
    <div className="aspect-video overflow-hidden rounded-theme bg-black shadow-lg">
      {embed ? (
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="size-full"
        />
      ) : (
        <video src={url} controls preload="metadata" className="size-full" />
      )}
    </div>
  );
}

export function PrototypeEmbed({ url, title }: { url: string; title: string }) {
  if (!/^https:\/\//i.test(url)) return null;
  const src = /figma\.com/i.test(url) ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}` : url;
  return (
    <div className="aspect-[16/10] overflow-hidden rounded-theme border border-[color-mix(in_srgb,var(--c-ink)_10%,transparent)] bg-card shadow-lg">
      <iframe src={src} title={title} loading="lazy" allowFullScreen sandbox="allow-scripts allow-same-origin allow-popups allow-forms" className="size-full" />
    </div>
  );
}

type GalleryItem = { kind: 'image' | 'video'; url: string; caption: { en: string; ar: string } };

export function Gallery({ items, locale, dict }: { items: GalleryItem[]; locale: Locale; dict: Dictionary }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (index !== null && !dlg.open) dlg.showModal();
    if (index === null && dlg.open) {
      dlg.close();
      openerRef.current?.focus();
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const rtl = document.documentElement.dir === 'rtl';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
      if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, step]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.url + i}>
            <button
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setIndex(i);
              }}
              aria-label={`${dict.openImage}: ${tr(item.caption, locale) || i + 1}`}
              className="group block w-full overflow-hidden rounded-[calc(var(--radius)*0.7)] bg-card text-start shadow-sm"
            >
              <span className="relative block aspect-[4/5] overflow-hidden bg-[color-mix(in_srgb,var(--c-secondary)_18%,var(--c-surface))]">
                {item.kind === 'video' ? (
                  <video src={item.url} muted preload="metadata" className="size-full object-cover" />
                ) : (
                  <Image src={item.url} alt="" fill sizes="(min-width: 768px) 30vw, 45vw" className="object-cover object-top transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100" />
                )}
              </span>
              {tr(item.caption, locale) && <span className="block px-3 py-2 text-xs text-fg-muted">{tr(item.caption, locale)}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === dialogRef.current && close()}
        aria-label={current ? tr(current.caption, locale) || dict.gallery : dict.gallery}
        className="m-auto max-h-[92vh] w-[min(1100px,94vw)] bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        {current && (
          <figure className="relative flex max-h-[92vh] flex-col items-center gap-3">
            {current.kind === 'video' ? (
              <video src={current.url} controls autoPlay className="max-h-[80vh] rounded-xl" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- natural-size lightbox image
              <img src={current.url} alt={tr(current.caption, locale)} className="max-h-[80vh] w-auto rounded-xl object-contain" />
            )}
            {tr(current.caption, locale) && <figcaption className="text-center text-sm text-white">{tr(current.caption, locale)}</figcaption>}
            <div className="flex gap-2">
              {items.length > 1 && (
                <button type="button" onClick={() => step(-1)} aria-label={dict.previous} className="grid size-11 place-items-center rounded-full bg-white/90 text-black">
                  <ChevronLeft size={20} aria-hidden className="rtl:-scale-x-100" />
                </button>
              )}
              <button type="button" onClick={close} aria-label={dict.close} className="grid size-11 place-items-center rounded-full bg-white/90 text-black">
                <X size={20} aria-hidden />
              </button>
              {items.length > 1 && (
                <button type="button" onClick={() => step(1)} aria-label={dict.next} className="grid size-11 place-items-center rounded-full bg-white/90 text-black">
                  <ChevronRight size={20} aria-hidden className="rtl:-scale-x-100" />
                </button>
              )}
            </div>
          </figure>
        )}
      </dialog>
    </>
  );
}
