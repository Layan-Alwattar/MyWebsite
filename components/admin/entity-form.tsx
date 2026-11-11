'use client';

/**
 * Generic create/edit form for any content type in lib/admin/entities.ts,
 * and for Site settings. Features: grouped sections, bilingual inputs,
 * draft/publish toggle, Preview button, Ctrl/Cmd+S to save, and a warning
 * before leaving with unsaved changes.
 */
import { ArrowLeft, Eye, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { saveEntity, saveSettings, type SaveResult } from '@/lib/admin/actions';
import { groupFields } from '@/lib/admin/defaults';
import { getEntity, SETTINGS_FIELDS } from '@/lib/admin/entities';
import { isWide, type FieldDef } from '@/lib/admin/fields';
import { slugify } from '@/lib/admin/normalize';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Field, Switch } from '@/components/ui/form';
import { Card } from '@/components/ui/misc';
import { FieldControl, type Option } from './field-controls';

type Values = Record<string, unknown>;

export type FormMode = { kind: 'entity'; key: string; id: string | null } | { kind: 'settings' };

export function EntityForm({
  mode,
  initialValues,
  options = {},
  title,
}: {
  mode: FormMode;
  initialValues: Values;
  options?: Record<string, Option[]>;
  title: string;
}) {
  const router = useRouter();
  const entity = mode.kind === 'entity' ? getEntity(mode.key)! : null;
  const fields: FieldDef[] = entity ? entity.fields : SETTINGS_FIELDS;
  const isNew = mode.kind === 'entity' && !mode.id;

  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  // Slugs follow the title until edited by hand (only for new items).
  const slugTouched = useRef(!isNew);
  const formRef = useRef<HTMLFormElement>(null);

  const groups = groupFields(fields);

  function set(name: string, value: unknown) {
    setDirty(true);
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // Auto-slug from the English title.
      const slugField = fields.find((f) => f.type === 'slug' && f.from === name);
      if (slugField && !slugTouched.current) {
        next[slugField.name] = slugify((value as { en?: string })?.en ?? '');
      }
      return next;
    });
    if (fields.some((f) => f.type === 'slug' && f.name === name)) slugTouched.current = true;
  }

  function save() {
    startTransition(async () => {
      // Strip the client-only gallery keys before sending.
      const payload: Values = { ...values };
      for (const f of fields) {
        if (f.type === 'gallery') {
          payload[f.name] = ((values[f.name] as Values[]) ?? []).map((item) =>
            Object.fromEntries(Object.entries(item).filter(([k]) => k !== '_key')),
          );
        }
      }

      let result: SaveResult;
      try {
        result =
          mode.kind === 'settings' ? await saveSettings(payload) : await saveEntity(mode.key, mode.id, payload);
      } catch {
        toast.error('Could not save. Check your connection and try again.');
        return;
      }

      if (!result.ok) {
        setErrors(result.errors ?? {});
        toast.error(result.message);
        // Bring the first problem into view.
        requestAnimationFrame(() =>
          formRef.current?.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        );
        return;
      }

      setDirty(false);
      toast.success('Saved ✿');
      if (mode.kind === 'entity' && !mode.id) router.replace(`/admin/${mode.key}/${result.id}`);
      else router.refresh();
    });
  }

  // Ctrl/Cmd + S saves.
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const published = values.status === 'published';
  const previewPath =
    entity?.publicPath && mode.kind === 'entity' && mode.id ? entity.publicPath(values) : mode.kind === 'settings' ? '/' : null;

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6"
      noValidate
    >
      {/* Sticky action bar */}
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-b border-line bg-blush-50/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        {entity && (
          <Link href={`/admin/${entity.key}`} aria-label={`Back to ${entity.label}`} className="rounded-lg p-1.5 text-muted hover:bg-blush-100 hover:text-ink">
            <ArrowLeft size={18} />
          </Link>
        )}
        <h1 className="min-w-0 flex-1 truncate text-xl font-semibold">{title}</h1>
        {dirty && <span className="text-xs font-medium text-amber-700">Unsaved changes</span>}
        {entity?.hasStatus && (
          <label className="flex items-center gap-2 text-sm font-medium">
            <Switch checked={published} onChange={(on) => set('status', on ? 'published' : 'draft')} label="Published" />
            <span className={cn(published ? 'text-emerald-700' : 'text-amber-700')}>{published ? 'Published' : 'Draft'}</span>
          </label>
        )}
        {previewPath && (
          <a
            href={`/api/draft?path=${encodeURIComponent(`/en${previewPath === '/' ? '' : previewPath}`)}`}
            target="_blank"
            rel="noreferrer"
            title={dirty ? 'Save first to preview your latest changes' : 'Preview on the site (drafts included)'}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold hover:bg-blush-50"
          >
            <Eye size={16} /> Preview
          </a>
        )}
        <Button type="submit" disabled={pending}>
          <Save size={16} /> {pending ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {groups.map(([group, groupFieldsList]) => (
        <Card key={group}>
          {groups.length > 1 && <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-blush-700">{group}</h2>}
          <div className="grid gap-5 md:grid-cols-2">
            {groupFieldsList.map((field) => {
              const id = `field-${field.name}`;
              return (
                <Field
                  key={field.name}
                  htmlFor={field.type === 'boolean' || field.type === 'm2m' ? undefined : id}
                  label={field.label}
                  help={field.help}
                  error={errors[field.name]}
                  required={field.required}
                  className={cn(isWide(field) && 'md:col-span-2')}
                >
                  <FieldControl
                    field={field}
                    id={id}
                    value={values[field.name]}
                    onChange={(v) => set(field.name, v)}
                    options={options[field.name]}
                    invalid={Boolean(errors[field.name])}
                  />
                </Field>
              );
            })}
          </div>
        </Card>
      ))}
    </form>
  );
}
