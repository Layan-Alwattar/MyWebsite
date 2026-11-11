/**
 * Shared language helpers (safe on server and client).
 * Content stores both languages: { en: '...', ar: '...' }.
 */
export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABEL: Record<Locale, string> = { en: 'English', ar: 'العربية' };
export const LOCALE_DIR: Record<Locale, 'ltr' | 'rtl'> = { en: 'ltr', ar: 'rtl' };

export type I18nText = Record<Locale, string>;
// Tiptap/ProseMirror JSON document, or null when empty.
export type RichDoc = { type: 'doc'; content?: unknown[] } | null;
export type I18nRich = Record<Locale, RichDoc>;

export const emptyI18n = (): I18nText => ({ en: '', ar: '' });
export const emptyRich = (): I18nRich => ({ en: null, ar: null });

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Pick the text for a locale, falling back to the other language so a
 * missing translation never shows an empty heading.
 */
export function tr(value: unknown, locale: Locale = DEFAULT_LOCALE): string {
  if (!value || typeof value !== 'object') return typeof value === 'string' ? value : '';
  const v = value as Partial<Record<Locale, unknown>>;
  const primary = v[locale];
  if (typeof primary === 'string' && primary.trim()) return primary;
  const fallback = locale === 'en' ? v.ar : v.en;
  return typeof fallback === 'string' ? fallback : '';
}

/** True when a rich-text document has any real content. */
export function hasRichContent(doc: unknown): boolean {
  if (!doc || typeof doc !== 'object') return false;
  const content = (doc as { content?: unknown[] }).content;
  if (!Array.isArray(content) || content.length === 0) return false;
  // A single empty paragraph counts as empty.
  return !(
    content.length === 1 &&
    (content[0] as { type?: string; content?: unknown[] }).type === 'paragraph' &&
    !(content[0] as { content?: unknown[] }).content?.length
  );
}
