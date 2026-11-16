'use client';

/**
 * Interactive site chrome: header (sticky, mobile menu), theme toggle,
 * language switch and the optional cursor glow.
 */
import { Menu, Moon, Sun, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import type { Dictionary } from '@/lib/site/dictionary';

export type NavItem = { href: string; label: string };

// ---------------------------------------------------------------- theme toggle

function subscribeTheme(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => obs.disconnect();
}
const isDarkNow = () => document.documentElement.classList.contains('dark');

export function ThemeToggle({ dict }: { dict: Dictionary }) {
  const dark = useSyncExternalStore(subscribeTheme, isDarkNow, () => false);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* private mode: preference just isn't remembered */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? dict.themeLight : dict.themeDark}
      title={dark ? dict.themeLight : dict.themeDark}
      className="grid size-10 place-items-center rounded-full text-fg transition hover:bg-[color-mix(in_srgb,var(--c-primary)_15%,transparent)]"
    >
      {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}

// ---------------------------------------------------------------- language switch

export function LanguageSwitch({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const other: Locale = locale === 'en' ? 'ar' : 'en';
  const href = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) || `/${other}`;
  return (
    <Link
      href={href}
      hrefLang={other}
      lang={other}
      aria-label={dict.switchLanguageLabel}
      className="rounded-full border border-[color-mix(in_srgb,var(--c-ink)_15%,transparent)] px-3 py-1.5 text-sm font-semibold text-fg transition hover:border-primary-ink hover:text-primary-ink"
    >
      {dict.switchLanguage}
    </Link>
  );
}

// ---------------------------------------------------------------- header

export function SiteHeader({
  locale,
  dict,
  brand,
  nav,
}: {
  locale: Locale;
  dict: Dictionary;
  brand: string;
  nav: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation and with Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-[background,box-shadow,backdrop-filter] duration-300',
        scrolled || open ? 'bg-[color-mix(in_srgb,var(--c-bg)_82%,transparent)] shadow-[0_1px_0_color-mix(in_srgb,var(--c-ink)_8%,transparent)] backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="font-display text-xl font-semibold tracking-tight text-fg">
          {brand}
          <span className="text-primary">.</span>
        </Link>

        <nav aria-label="Main" className="ms-auto hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-fg-muted transition hover:bg-[color-mix(in_srgb,var(--c-primary)_12%,transparent)] hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5 lg:ms-2">
          <LanguageSwitch locale={locale} dict={dict} />
          <ThemeToggle dict={dict} />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-fg lg:hidden"
            aria-label={open ? dict.closeMenu : dict.menu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-[color-mix(in_srgb,var(--c-ink)_8%,transparent)] px-4 pb-5 pt-2 lg:hidden">
          <ul className="grid gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium text-fg hover:bg-[color-mix(in_srgb,var(--c-primary)_12%,transparent)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

// ---------------------------------------------------------------- cursor glow

/** Soft radial glow following the pointer (desktop, motion allowed only). */
export function CursorGlow() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  if (!pos) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, color-mix(in srgb, var(--c-primary) 14%, transparent), transparent 70%)`,
      }}
    />
  );
}
