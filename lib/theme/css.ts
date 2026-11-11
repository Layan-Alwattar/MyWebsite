/**
 * Converts a theme into CSS custom properties. The public site injects the
 * result into <head>, so a theme change in the admin restyles every page.
 *
 *   --c-bg, --c-surface, --c-primary, --c-primary-ink, --c-secondary,
 *   --c-accent, --c-ink, --c-muted, --radius, --font-heading, --font-body
 */
import { isHexColor } from './contrast';
import type { Palette, Theme } from './types';

const VAR_NAMES: Record<keyof Palette, string> = {
  bg: '--c-bg',
  surface: '--c-surface',
  primary: '--c-primary',
  primaryInk: '--c-primary-ink',
  secondary: '--c-secondary',
  accent: '--c-accent',
  ink: '--c-ink',
  muted: '--c-muted',
};

const MOTION_SCALE = { off: '0', subtle: '1', playful: '1.6' } as const;

/** Only allow characters that can appear in a font family name (CSS-injection safe). */
const safeFont = (name: string) => name.replace(/[^a-zA-Z0-9 \-]/g, '');
const safeRadius = (r: string) => (/^\d+(\.\d+)?(rem|px)$/.test(r) ? r : '1.25rem');

export function paletteVars(p: Palette) {
  return (Object.keys(VAR_NAMES) as (keyof Palette)[])
    .filter((k) => isHexColor(p[k]))
    .map((k) => `${VAR_NAMES[k]}:${p[k]};`)
    .join('');
}

/** Variables as a React style object (used by the admin live preview). */
export function themeStyle(theme: Theme, mode: 'light' | 'dark'): Record<string, string> {
  const p = theme.colors[mode];
  const style: Record<string, string> = {
    '--radius': safeRadius(theme.radius),
    '--font-heading': `'${safeFont(theme.fonts.heading)}', serif`,
    '--font-body': `'${safeFont(theme.fonts.body)}', sans-serif`,
  };
  for (const k of Object.keys(VAR_NAMES) as (keyof Palette)[]) if (isHexColor(p[k])) style[VAR_NAMES[k]] = p[k];
  return style;
}

/** Full stylesheet for the public site: light by default, dark via class or system preference. */
export function themeToCss(theme: Theme) {
  const shared =
    `--radius:${safeRadius(theme.radius)};` +
    `--motion:${MOTION_SCALE[theme.motion_level] ?? '1'};` +
    `--font-heading:'${safeFont(theme.fonts.heading)}',ui-serif,Georgia,serif;` +
    `--font-body:'${safeFont(theme.fonts.body)}',ui-sans-serif,system-ui,sans-serif;` +
    `--font-heading-ar:'${safeFont(theme.fonts.headingAr)}',var(--font-body);` +
    `--font-body-ar:'${safeFont(theme.fonts.bodyAr)}',Tahoma,sans-serif;`;

  return [
    `:root{${shared}${paletteVars(theme.colors.light)}color-scheme:light;}`,
    `:root.dark{${paletteVars(theme.colors.dark)}color-scheme:dark;}`,
  ].join('\n');
}
