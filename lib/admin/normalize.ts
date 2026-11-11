/**
 * Turns raw form values into a clean database row, driven by field
 * definitions. Runs on the server before every save, so the database
 * never receives malformed data even if the browser is tampered with.
 */
import type { FieldDef, GalleryItem, RepeaterSubField } from './fields';
import { VIRTUAL_FIELD_TYPES } from './fields';
import { hasRichContent, type I18nRich, type I18nText } from '@/lib/i18n';

export type FieldErrors = Record<string, string>;

type Values = Record<string, unknown>;

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Absolute http(s), mailto:, or a site-relative path.
const URL_RE = /^(https?:\/\/[^\s]+|mailto:[^\s]+|\/[^\s]*)$/i;

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

function i18nText(v: unknown, maxLength?: number): I18nText {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const clip = (s: string) => (maxLength ? s.slice(0, maxLength) : s);
  return { en: clip(str(o.en)), ar: clip(str(o.ar)) };
}

function richDoc(v: unknown) {
  return v && typeof v === 'object' && (v as { type?: unknown }).type === 'doc' && hasRichContent(v)
    ? (v as I18nRich['en'])
    : null;
}

function cleanRepeaterItem(item: unknown, fields: RepeaterSubField[]) {
  const o = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === 'i18n-text') out[f.name] = i18nText(o[f.name], 300);
    else if (f.type === 'number') {
      const n = Number(o[f.name]);
      out[f.name] = Number.isFinite(n) ? n : 0;
    } else out[f.name] = str(o[f.name]).slice(0, 300);
  }
  return out;
}

/** Converts a title to a URL slug: "Brain Tumor AI!" -> "brain-tumor-ai". */
export function slugify(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function normalizeValues(fields: FieldDef[], values: Values) {
  const row: Values = {};
  const virtual: Values = {};
  const errors: FieldErrors = {};

  for (const field of fields) {
    const raw = values[field.name];
    const fail = (msg: string) => (errors[field.name] = msg);

    if (VIRTUAL_FIELD_TYPES.includes(field.type)) {
      if (field.type === 'm2m') {
        virtual[field.name] = Array.isArray(raw) ? raw.filter((id) => typeof id === 'string' && UUID_RE.test(id)) : [];
      } else if (field.type === 'gallery') {
        virtual[field.name] = (Array.isArray(raw) ? raw : [])
          .map((item): GalleryItem | null => {
            const o = (item ?? {}) as Record<string, unknown>;
            const url = str(o.url);
            if (!URL_RE.test(url)) return null;
            return { kind: o.kind === 'video' ? 'video' : 'image', url, caption: i18nText(o.caption, 300) };
          })
          .filter(Boolean);
      }
      continue;
    }

    switch (field.type) {
      case 'i18n-text': {
        const v = i18nText(raw, field.maxLength);
        if (field.required && !v.en && !v.ar) fail('Required (at least one language).');
        row[field.name] = v;
        break;
      }
      case 'i18n-rich': {
        const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
        const v = { en: richDoc(o.en), ar: richDoc(o.ar) };
        if (field.required && !v.en && !v.ar) fail('Required (at least one language).');
        row[field.name] = v;
        break;
      }
      case 'text':
      case 'select': {
        const v = str(raw);
        if (field.type === 'text' && field.maxLength && v.length > field.maxLength) fail(`Max ${field.maxLength} characters.`);
        if (field.type === 'select' && v && !field.options.some((o) => o.value === v)) fail('Invalid choice.');
        if (field.required && !v) fail('Required.');
        row[field.name] = v || null;
        break;
      }
      case 'url': {
        const v = str(raw);
        if (v && !URL_RE.test(v)) fail('Must start with https://, mailto: or /');
        if (field.required && !v) fail('Required.');
        row[field.name] = v || null;
        break;
      }
      case 'email': {
        const v = str(raw).toLowerCase();
        if (v && !EMAIL_RE.test(v)) fail('Invalid email.');
        if (field.required && !v) fail('Required.');
        row[field.name] = v || null;
        break;
      }
      case 'date': {
        const v = str(raw);
        if (v && !DATE_RE.test(v)) fail('Use YYYY-MM-DD.');
        if (field.required && !v) fail('Required.');
        row[field.name] = v || null;
        break;
      }
      case 'number': {
        if (raw === '' || raw === null || raw === undefined) {
          if (field.required) fail('Required.');
          row[field.name] = null;
          break;
        }
        const n = Number(raw);
        if (!Number.isFinite(n)) fail('Must be a number.');
        else if (field.min !== undefined && n < field.min) fail(`Minimum ${field.min}.`);
        else if (field.max !== undefined && n > field.max) fail(`Maximum ${field.max}.`);
        row[field.name] = Number.isFinite(n) ? n : null;
        break;
      }
      case 'slug': {
        const v = str(raw).toLowerCase();
        if (!v) fail('Required.');
        else if (!SLUG_RE.test(v)) fail('Lowercase letters, numbers and dashes only.');
        row[field.name] = v;
        break;
      }
      case 'boolean':
        row[field.name] = raw === true;
        break;
      case 'tags':
        row[field.name] = Array.from(
          new Set((Array.isArray(raw) ? raw : []).map(str).filter(Boolean).map((t) => t.slice(0, 60))),
        );
        break;
      case 'relation': {
        const v = str(raw);
        if (v && !UUID_RE.test(v)) fail('Invalid choice.');
        if (field.required && !v) fail('Required.');
        row[field.name] = v || null;
        break;
      }
      case 'media': {
        const check = (v: string) => {
          if (v && !URL_RE.test(v)) fail('Invalid URL.');
          return v;
        };
        if (field.localized) {
          const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
          row[field.name] = { en: check(str(o.en)), ar: check(str(o.ar)) };
        } else {
          const v = check(str(raw));
          if (field.required && !v) fail('Required.');
          row[field.name] = v || null;
        }
        break;
      }
      case 'i18n-list':
        row[field.name] = (Array.isArray(raw) ? raw : [])
          .map((v) => i18nText(v, 300))
          .filter((v) => v.en || v.ar);
        break;
      case 'repeater':
        row[field.name] = (Array.isArray(raw) ? raw : []).slice(0, 50).map((item) => cleanRepeaterItem(item, field.fields));
        break;
    }
  }

  return { row, virtual, errors };
}
