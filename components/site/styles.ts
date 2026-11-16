/**
 * Shared class strings for the public site. Kept dependency-free so both
 * server and client components can import them cheaply.
 */
import { cn } from '@/lib/cn';

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-theme px-5 py-3 text-sm font-semibold transition duration-200 ' +
  'hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0';

/** Filled button; label color is checked for contrast in the theme editor. */
export const btnPrimary = cn(
  btnBase,
  'bg-primary-ink text-[var(--c-on-primary)] shadow-[0_10px_30px_-12px_var(--c-primary)] hover:shadow-[0_14px_34px_-10px_var(--c-primary)]',
);

export const btnSecondary = cn(btnBase, 'border-[1.5px] border-primary-ink text-primary-ink hover:bg-[color-mix(in_srgb,var(--c-primary)_10%,transparent)]');

/** Cards share this surface style. */
export const cardClass =
  'rounded-theme bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_14px_40px_-22px_color-mix(in_srgb,var(--c-primary)_55%,transparent)]';
