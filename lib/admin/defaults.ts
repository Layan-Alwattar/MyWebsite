import type { FieldDef } from './fields';
import { emptyI18n, emptyRich } from '@/lib/i18n';

/** Empty starting values for a "New …" form. */
export function defaultValues(fields: FieldDef[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const f of fields) {
    switch (f.type) {
      case 'i18n-text':
        values[f.name] = emptyI18n();
        break;
      case 'i18n-rich':
        values[f.name] = emptyRich();
        break;
      case 'boolean':
        // Social links are visible by default; everything else starts off.
        values[f.name] = f.name === 'visible';
        break;
      case 'tags':
      case 'i18n-list':
      case 'repeater':
      case 'm2m':
      case 'gallery':
        values[f.name] = [];
        break;
      case 'media':
        values[f.name] = f.localized ? { en: '', ar: '' } : null;
        break;
      case 'number':
        values[f.name] = null;
        break;
      default:
        values[f.name] = '';
    }
  }
  return values;
}

/** Groups fields by their `group`, keeping first-seen order. */
export function groupFields(fields: FieldDef[]) {
  const groups = new Map<string, FieldDef[]>();
  for (const f of fields) {
    const g = f.group ?? 'Details';
    groups.set(g, [...(groups.get(g) ?? []), f]);
  }
  return [...groups.entries()];
}
