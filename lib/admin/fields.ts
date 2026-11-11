/**
 * Field definitions drive the generic admin forms, list pages and the
 * server-side save action. Add a field here and it appears in the form,
 * gets validated, and is saved — no extra code.
 */

export type MediaAccept = 'image' | 'video' | 'pdf' | 'data' | 'any';

type Base = {
  /** Column name in the table (or a virtual name for relation fields). */
  name: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Form section heading this field belongs to. */
  group?: string;
  /** Span both columns of the form grid. Defaults to true for wide field types. */
  wide?: boolean;
};

export type FieldDef =
  | (Base & { type: 'i18n-text'; multiline?: boolean; maxLength?: number })
  | (Base & { type: 'i18n-rich' })
  | (Base & { type: 'text'; multiline?: boolean; maxLength?: number; placeholder?: string })
  | (Base & { type: 'url'; placeholder?: string })
  | (Base & { type: 'email' })
  | (Base & { type: 'date' })
  | (Base & { type: 'number'; min?: number; max?: number })
  | (Base & { type: 'slug'; from: string })
  | (Base & { type: 'boolean' })
  | (Base & { type: 'tags'; placeholder?: string })
  | (Base & { type: 'select'; options: { value: string; label: string }[] })
  /** Foreign key to another table, shown as a dropdown. */
  | (Base & { type: 'relation'; table: string; labelColumn: string; nullable?: boolean })
  /** URL picked from (or uploaded to) the media library. `localized` stores { en, ar }. */
  | (Base & { type: 'media'; accept: MediaAccept; localized?: boolean })
  /** Array of { en, ar } strings (e.g. timeline highlights, hero tags). */
  | (Base & { type: 'i18n-list'; itemLabel: string })
  /** Array of small objects (e.g. fun facts, stats). */
  | (Base & { type: 'repeater'; itemLabel: string; fields: RepeaterSubField[] })
  /** Many-to-many via a link table (virtual: not a column on the main table). */
  | (Base & {
      type: 'm2m';
      optionsTable: string;
      labelColumn: string;
      linkTable: string;
      ownKey: string;
      otherKey: string;
    })
  /** Child rows with url + caption, e.g. project gallery (virtual). */
  | (Base & { type: 'gallery'; table: string; foreignKey: string });

export type RepeaterSubField =
  | { name: string; label: string; type: 'text' | 'number'; placeholder?: string }
  | { name: string; label: string; type: 'i18n-text' };

export type FieldType = FieldDef['type'];

/** Field types that are stored outside the main row. */
export const VIRTUAL_FIELD_TYPES: FieldType[] = ['m2m', 'gallery'];

export const WIDE_FIELD_TYPES: FieldType[] = [
  'i18n-text',
  'i18n-rich',
  'i18n-list',
  'repeater',
  'gallery',
  'm2m',
  'tags',
];

export function isWide(field: FieldDef) {
  return field.wide ?? WIDE_FIELD_TYPES.includes(field.type);
}

/** Gallery item as edited in the form. */
export type GalleryItem = {
  id?: string;
  kind: 'image' | 'video';
  url: string;
  caption: { en: string; ar: string };
};
