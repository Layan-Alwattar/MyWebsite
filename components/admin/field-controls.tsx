'use client';

/**
 * One input component per field type, plus <FieldControl> which picks
 * the right one from a FieldDef. Used by the generic admin form.
 */
import { ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import type { FieldDef, GalleryItem, MediaAccept, RepeaterSubField } from '@/lib/admin/fields';
import { cn } from '@/lib/cn';
import { emptyI18n, hasRichContent, LOCALES, LOCALE_DIR, type I18nRich, type I18nText, type Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input, Select, Switch, Textarea } from '@/components/ui/form';
import { MediaPickerModal } from './media-picker';
import { MediaThumb } from './media-library';
import { RichTextEditor } from './rich-text-editor';
import { SortableList } from './sortable-list';

export type Option = { value: string; label: string };

const LOCALE_TAG: Record<Locale, string> = { en: 'EN', ar: 'AR' };

/** Small language tag shown next to bilingual inputs. */
function LangTag({ locale }: { locale: Locale }) {
  return (
    <span className="pointer-events-none absolute end-2 top-2 rounded-md bg-blush-100 px-1.5 py-0.5 text-[10px] font-bold text-blush-800">
      {LOCALE_TAG[locale]}
    </span>
  );
}

// ---------------------------------------------------------------- i18n text

export function I18nTextInput({
  id,
  value,
  onChange,
  multiline,
  maxLength,
  invalid,
}: {
  id: string;
  value: I18nText;
  onChange: (v: I18nText) => void;
  multiline?: boolean;
  maxLength?: number;
  invalid?: boolean;
}) {
  const v = value ?? emptyI18n();
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {LOCALES.map((locale) => {
        const props = {
          id: locale === 'en' ? id : `${id}-${locale}`,
          lang: locale,
          dir: LOCALE_DIR[locale],
          value: v[locale] ?? '',
          maxLength,
          'aria-invalid': invalid,
          'aria-label': locale === 'ar' ? 'Arabic' : undefined,
          className: 'pe-10',
          onChange: (e: { target: { value: string } }) => onChange({ ...v, [locale]: e.target.value }),
        };
        return (
          <div key={locale} className="relative">
            {multiline ? <Textarea {...props} /> : <Input {...props} />}
            <LangTag locale={locale} />
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- i18n rich

export function I18nRichInput({ id, value, onChange }: { id: string; value: I18nRich; onChange: (v: I18nRich) => void }) {
  const [locale, setLocale] = useState<Locale>('en');
  const v = value ?? { en: null, ar: null };

  return (
    <div className="space-y-2">
      <div role="tablist" aria-label="Language" className="inline-flex rounded-xl bg-blush-100 p-1">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={locale === l}
            onClick={() => setLocale(l)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition',
              locale === l ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            {l === 'en' ? 'English' : 'العربية'}
            {/* Dot = this language has content */}
            <span
              aria-label={hasRichContent(v[l]) ? 'has content' : 'empty'}
              className={cn('size-1.5 rounded-full', hasRichContent(v[l]) ? 'bg-emerald-500' : 'bg-stone-300')}
            />
          </button>
        ))}
      </div>
      {/* key forces a fresh editor per language */}
      <RichTextEditor
        key={locale}
        id={id}
        locale={locale}
        value={v[locale]}
        onChange={(doc) => onChange({ ...v, [locale]: doc })}
      />
    </div>
  );
}

// ---------------------------------------------------------------- tags

export function TagsInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const tags = value ?? [];

  const add = (raw: string) => {
    const parts = raw.split(',').map((t) => t.trim()).filter(Boolean);
    const next = [...tags];
    for (const p of parts) if (!next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p);
    onChange(next);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && draft.trim()) {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-white p-1.5 focus-within:border-blush-500 focus-within:ring-4 focus-within:ring-blush-500/15">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blush-100 py-0.5 ps-2.5 pe-1 text-xs font-medium text-blush-800">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="rounded-full p-0.5 hover:bg-blush-200"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={tags.length ? '' : (placeholder ?? 'Type and press Enter')}
        className="min-w-32 flex-1 bg-transparent px-1.5 py-1 text-sm outline-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------- media

export function MediaInput({
  id,
  value,
  onChange,
  accept,
}: {
  id: string;
  value: string | null;
  onChange: (v: string | null) => void;
  accept: MediaAccept;
}) {
  const [open, setOpen] = useState(false);
  const url = value ?? '';
  const kind = accept === 'any' ? 'other' : accept;

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Choose from media library"
        className="size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-blush-50 transition hover:ring-4 hover:ring-blush-500/15"
      >
        {url ? (
          <MediaThumb item={{ kind: kind as 'image', url, alt: { en: '', ar: '' } }} />
        ) : (
          <ImagePlus className="m-auto text-blush-400" size={22} />
        )}
      </button>
      <div className="min-w-0 flex-1 space-y-1.5">
        <Input
          id={id}
          type="url"
          placeholder={accept === 'video' ? 'Upload, or paste a YouTube / Vimeo link' : 'Choose a file or paste a URL'}
          value={url}
          onChange={(e) => onChange(e.target.value || null)}
        />
        <div className="flex gap-1">
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
            Library
          </Button>
          {url && (
            <Button size="sm" variant="ghost" onClick={() => onChange(null)}>
              Remove
            </Button>
          )}
        </div>
      </div>
      <MediaPickerModal open={open} onClose={() => setOpen(false)} accept={accept} onPick={(m) => onChange(m.url)} />
    </div>
  );
}

// ---------------------------------------------------------------- i18n list

export function I18nListInput({
  value,
  onChange,
  itemLabel,
}: {
  value: I18nText[];
  onChange: (v: I18nText[]) => void;
  itemLabel: string;
}) {
  const items = value ?? [];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            <I18nTextInput
              id={`item-${i}`}
              value={item}
              onChange={(v) => onChange(items.map((it, j) => (j === i ? v : it)))}
            />
          </div>
          <RemoveButton label={`Remove ${itemLabel}`} onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <Button size="sm" variant="secondary" onClick={() => onChange([...items, emptyI18n()])}>
        <Plus size={14} /> Add {itemLabel}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------- repeater

type RepeaterItem = Record<string, unknown>;

export function RepeaterInput({
  value,
  onChange,
  fields,
  itemLabel,
}: {
  value: RepeaterItem[];
  onChange: (v: RepeaterItem[]) => void;
  fields: RepeaterSubField[];
  itemLabel: string;
}) {
  const items = value ?? [];
  const blank = () =>
    Object.fromEntries(fields.map((f) => [f.name, f.type === 'i18n-text' ? emptyI18n() : f.type === 'number' ? 0 : '']));
  const update = (i: number, name: string, v: unknown) =>
    onChange(items.map((it, j) => (j === i ? { ...it, [name]: v } : it)));

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 rounded-xl bg-blush-50/60 p-2">
          <div className="grid flex-1 gap-2 md:grid-cols-[minmax(0,10rem)_1fr]">
            {/* Short fields first, bilingual ones take the wide column */}
            <div className="flex gap-2">
              {fields
                .filter((f) => f.type !== 'i18n-text')
                .map((f) => (
                  <Input
                    key={f.name}
                    aria-label={f.label}
                    type={f.type === 'number' ? 'number' : 'text'}
                    placeholder={'placeholder' in f ? (f.placeholder ?? f.label) : f.label}
                    value={String(item[f.name] ?? '')}
                    onChange={(e) => update(i, f.name, f.type === 'number' ? e.target.valueAsNumber || 0 : e.target.value)}
                  />
                ))}
            </div>
            {fields
              .filter((f) => f.type === 'i18n-text')
              .map((f) => (
                <I18nTextInput
                  key={f.name}
                  id={`${f.name}-${i}`}
                  value={item[f.name] as I18nText}
                  onChange={(v) => update(i, f.name, v)}
                />
              ))}
          </div>
          <RemoveButton label={`Remove ${itemLabel}`} onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <Button size="sm" variant="secondary" onClick={() => onChange([...items, blank()])}>
        <Plus size={14} /> Add {itemLabel}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------- many-to-many chips

export function MultiChipInput({ value, onChange, options }: { value: string[]; onChange: (v: string[]) => void; options: Option[] }) {
  const selected = new Set(value ?? []);
  if (!options.length) return <p className="text-sm text-muted">No options yet — create some first.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.has(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? [...selected].filter((v) => v !== o.value) : [...selected, o.value])}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition',
              on ? 'border-blush-600 bg-blush-600 text-white' : 'border-line bg-white text-ink hover:bg-blush-50',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- gallery

/** Gallery items carry a client-only _key so drag-and-drop has stable ids. */
export type GalleryFormItem = GalleryItem & { _key: string };

export function GalleryInput({ value, onChange }: { value: GalleryFormItem[]; onChange: (v: GalleryFormItem[]) => void }) {
  const [open, setOpen] = useState(false);
  const items = value ?? [];

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <SortableList
          items={items}
          getId={(i) => i._key}
          onReorder={onChange}
          renderItem={(item, handle) => (
            <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-2">
              {handle}
              <div className="size-16 shrink-0 overflow-hidden rounded-lg">
                <MediaThumb item={{ kind: item.kind, url: item.url, alt: item.caption }} />
              </div>
              <div className="flex-1">
                <I18nTextInput
                  id={`caption-${item._key}`}
                  value={item.caption}
                  onChange={(caption) => onChange(items.map((it) => (it._key === item._key ? { ...it, caption } : it)))}
                />
              </div>
              <RemoveButton label="Remove from gallery" onClick={() => onChange(items.filter((it) => it._key !== item._key))} />
            </div>
          )}
        />
      )}
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <Plus size={14} /> Add photo or video
      </Button>
      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        accept="any"
        onPick={(m) =>
          (m.kind === 'image' || m.kind === 'video') &&
          onChange([...items, { _key: crypto.randomUUID(), kind: m.kind, url: m.url, caption: { ...emptyI18n(), ...m.alt } }])
        }
      />
    </div>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-lg p-2 text-muted transition hover:bg-rose-50 hover:text-rose-700"
    >
      <Trash2 size={16} />
    </button>
  );
}

// ---------------------------------------------------------------- dispatcher

export function FieldControl({
  field,
  id,
  value,
  onChange,
  options,
  invalid,
}: {
  field: FieldDef;
  id: string;
  value: unknown;
  onChange: (v: unknown) => void;
  options?: Option[];
  invalid?: boolean;
}) {
  switch (field.type) {
    case 'i18n-text':
      return <I18nTextInput id={id} value={value as I18nText} onChange={onChange} multiline={field.multiline} maxLength={field.maxLength} invalid={invalid} />;
    case 'i18n-rich':
      return <I18nRichInput id={id} value={value as I18nRich} onChange={onChange} />;
    case 'text':
      return field.multiline ? (
        <Textarea id={id} value={(value as string) ?? ''} maxLength={field.maxLength} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} />
      ) : (
        <Input id={id} value={(value as string) ?? ''} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} />
      );
    case 'url':
      return <Input id={id} type="url" inputMode="url" placeholder={field.placeholder ?? 'https://'} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} />;
    case 'email':
      return <Input id={id} type="email" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} />;
    case 'date':
      return <Input id={id} type="date" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} />;
    case 'number':
      return (
        <Input
          id={id}
          type="number"
          min={field.min}
          max={field.max}
          value={value === null || value === undefined ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? null : e.target.valueAsNumber)}
          aria-invalid={invalid}
        />
      );
    case 'slug':
      return <Input id={id} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value.toLowerCase())} aria-invalid={invalid} className="font-mono" />;
    case 'boolean':
      return <Switch id={id} checked={value === true} onChange={onChange} label={field.label} />;
    case 'tags':
      return <TagsInput id={id} value={value as string[]} onChange={onChange} placeholder={field.placeholder} />;
    case 'select':
      return (
        <Select id={id} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid}>
          <option value="">Choose…</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      );
    case 'relation':
      return (
        <Select id={id} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value || null)} aria-invalid={invalid}>
          <option value="">{field.nullable ? '— None —' : 'Choose…'}</option>
          {(options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      );
    case 'media':
      if (field.localized) {
        const v = (value ?? {}) as Partial<Record<Locale, string>>;
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {LOCALES.map((l) => (
              <div key={l} className="space-y-1">
                <span className="text-xs font-semibold text-muted">{l === 'en' ? 'English' : 'العربية'}</span>
                <MediaInput id={l === 'en' ? id : `${id}-${l}`} accept={field.accept} value={v[l] || null} onChange={(url) => onChange({ ...v, [l]: url ?? '' })} />
              </div>
            ))}
          </div>
        );
      }
      return <MediaInput id={id} accept={field.accept} value={(value as string) ?? null} onChange={onChange} />;
    case 'i18n-list':
      return <I18nListInput value={value as I18nText[]} onChange={onChange} itemLabel={field.itemLabel} />;
    case 'repeater':
      return <RepeaterInput value={value as RepeaterItem[]} onChange={onChange} fields={field.fields} itemLabel={field.itemLabel} />;
    case 'm2m':
      return <MultiChipInput value={value as string[]} onChange={onChange} options={options ?? []} />;
    case 'gallery':
      return <GalleryInput value={value as GalleryFormItem[]} onChange={onChange} />;
  }
}
