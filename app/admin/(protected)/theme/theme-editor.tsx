'use client';

import { Check, Copy, Moon, RotateCcw, Sun, Trash2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';
import { contrastRatio, grade, isHexColor } from '@/lib/theme/contrast';
import { themeStyle } from '@/lib/theme/css';
import { BODY_FONTS, BODY_FONTS_AR, googleFontsUrl, HEADING_FONTS, HEADING_FONTS_AR } from '@/lib/theme/fonts';
import { COLOR_KEYS, COLOR_LABELS, type ColorKey, type MotionLevel, type Theme } from '@/lib/theme/types';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Switch } from '@/components/ui/form';
import { Badge, Card } from '@/components/ui/misc';
import { activateTheme, createTheme, deleteTheme, resetPreset, saveTheme } from './actions';

type Mode = 'light' | 'dark';

export function ThemeEditor({ themes }: { themes: Theme[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(themes.find((t) => t.is_active)?.id ?? themes[0]?.id);
  const original = themes.find((t) => t.id === selectedId);
  const [draft, setDraft] = useState<Theme | undefined>(original);
  const [syncedFrom, setSyncedFrom] = useState(original);
  const [mode, setMode] = useState<Mode>('light');
  const [pending, startTransition] = useTransition();

  // Reload the draft when another theme is selected or fresh data arrives
  // from the server (after save / duplicate / reset).
  if (original && original !== syncedFrom) {
    setSyncedFrom(original);
    setDraft(original);
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(original);

  function select(id: string) {
    if (dirty && !confirm('Discard unsaved theme changes?')) return;
    setSelectedId(id);
  }

  function run(action: () => Promise<{ ok: boolean; message?: string; id?: string }>, success: string, after?: (id?: string) => void) {
    startTransition(async () => {
      const res = await action();
      if (!res.ok) return void toast.error(res.message ?? 'Something went wrong');
      toast.success(success);
      after?.(res.id);
      router.refresh();
    });
  }

  if (!draft || !draft.id) return <p className="text-sm text-muted">No themes found. Run the defaults migration.</p>;
  const id = draft.id;

  const setColor = (key: ColorKey, value: string) =>
    setDraft({ ...draft, colors: { ...draft.colors, [mode]: { ...draft.colors[mode], [key]: value } } });

  return (
    <div className="space-y-6">
      {/* Theme picker */}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {themes.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => select(t.id!)}
              aria-pressed={t.id === selectedId}
              className={cn(
                'w-full rounded-2xl border bg-white p-3 text-start transition hover:shadow-md',
                t.id === selectedId ? 'border-blush-500 ring-2 ring-blush-500/30' : 'border-line',
              )}
            >
              <div className="flex h-10 overflow-hidden rounded-xl">
                {(['bg', 'primary', 'secondary', 'accent', 'ink'] as const).map((k) => (
                  <span key={k} className="flex-1" style={{ background: t.colors.light[k] }} />
                ))}
              </div>
              <p className="mt-2 truncate text-sm font-semibold">{t.name}</p>
              <div className="mt-1 flex gap-1">
                {t.is_active && <Badge tone="green">Live</Badge>}
                {t.is_preset && <Badge>Preset</Badge>}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Controls */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <Field label="Theme name" htmlFor="theme-name">
              <Input id="theme-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} disabled={draft.is_preset} />
            </Field>

            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blush-700">Colors</h2>
              <ModeToggle mode={mode} onChange={setMode} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {COLOR_KEYS.map((key) => (
                <ColorInput key={key} colorKey={key} value={draft.colors[mode][key]} onChange={(v) => setColor(key, v)} />
              ))}
            </div>
            <ContrastReport theme={draft} mode={mode} />
          </Card>

          <Card className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blush-700">Typography</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <FontSelect label="Headings" value={draft.fonts.heading} options={HEADING_FONTS} onChange={(v) => setDraft({ ...draft, fonts: { ...draft.fonts, heading: v } })} />
              <FontSelect label="Body text" value={draft.fonts.body} options={BODY_FONTS} onChange={(v) => setDraft({ ...draft, fonts: { ...draft.fonts, body: v } })} />
              <FontSelect label="Arabic headings" value={draft.fonts.headingAr} options={HEADING_FONTS_AR} onChange={(v) => setDraft({ ...draft, fonts: { ...draft.fonts, headingAr: v } })} />
              <FontSelect label="Arabic body text" value={draft.fonts.bodyAr} options={BODY_FONTS_AR} onChange={(v) => setDraft({ ...draft, fonts: { ...draft.fonts, bodyAr: v } })} />
            </div>
          </Card>

          <Card className="space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blush-700">Shape & motion</h2>
            <Field label={`Corner roundness — ${draft.radius}`} htmlFor="radius">
              <input
                id="radius"
                type="range"
                min={0}
                max={2.5}
                step={0.25}
                value={parseFloat(draft.radius)}
                onChange={(e) => setDraft({ ...draft, radius: `${e.target.value}rem` })}
                className="w-full accent-blush-600"
              />
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Animation intensity</legend>
              <div className="inline-flex rounded-xl bg-blush-100 p-1">
                {(['off', 'subtle', 'playful'] as MotionLevel[]).map((m) => (
                  <label key={m} className={cn('cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold capitalize', draft.motion_level === m ? 'bg-white shadow-sm' : 'text-muted')}>
                    <input type="radio" name="motion" value={m} checked={draft.motion_level === m} onChange={() => setDraft({ ...draft, motion_level: m })} className="sr-only" />
                    {m}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-muted">Visitors who turn on &quot;reduce motion&quot; on their device always get no animation.</p>
            </fieldset>
            <label className="flex items-center justify-between gap-3 text-sm font-semibold">
              Soft cursor glow
              <Switch checked={draft.cursor_glow} onChange={(v) => setDraft({ ...draft, cursor_glow: v })} label="Soft cursor glow" />
            </label>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button disabled={pending || !dirty} onClick={() => run(() => saveTheme(id, draft), draft.is_active ? 'Saved — live on your site ✿' : 'Saved')}>
              <Check size={16} /> Save
            </Button>
            {!draft.is_active && (
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() =>
                  run(async () => {
                    if (dirty) {
                      const saved = await saveTheme(id, draft);
                      if (!saved.ok) return saved;
                    }
                    return activateTheme(id);
                  }, `${draft.name} is now live`)
                }
              >
                <Zap size={16} /> {dirty ? 'Save & make live' : 'Make live'}
              </Button>
            )}
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => {
                const name = prompt('Name for the new theme', `${draft.name} copy`);
                if (name) run(() => createTheme({ ...draft, name }), 'Theme duplicated', (newId) => newId && setSelectedId(newId));
              }}
            >
              <Copy size={16} /> Duplicate
            </Button>
            {dirty && (
              <Button variant="ghost" onClick={() => setDraft(original)}>
                Discard changes
              </Button>
            )}
            {draft.is_preset ? (
              <Button
                variant="ghost"
                disabled={pending}
                onClick={() => confirm(`Reset ${draft.name} to its original values?`) && run(() => resetPreset(id, draft.name), 'Preset restored')}
              >
                <RotateCcw size={16} /> Reset to original
              </Button>
            ) : (
              <Button
                variant="danger"
                disabled={pending || draft.is_active}
                className="ms-auto"
                onClick={() => confirm(`Delete ${draft.name}?`) && run(() => deleteTheme(id), 'Theme deleted', () => setSelectedId(themes.find((t) => t.is_active)?.id))}
              >
                <Trash2 size={16} /> Delete
              </Button>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="xl:sticky xl:top-6 xl:self-start">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blush-700">Live preview</h2>
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
          <ThemePreview theme={draft} mode={mode} />
        </div>
      </div>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-xl bg-blush-100 p-1" role="group" aria-label="Color mode">
      {(['light', 'dark'] as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          onClick={() => onChange(m)}
          className={cn('flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold capitalize', mode === m ? 'bg-white shadow-sm' : 'text-muted')}
        >
          {m === 'light' ? <Sun size={13} /> : <Moon size={13} />} {m}
        </button>
      ))}
    </div>
  );
}

function ColorInput({ colorKey, value, onChange }: { colorKey: ColorKey; value: string; onChange: (v: string) => void }) {
  const { label, help } = COLOR_LABELS[colorKey];
  const [text, setText] = useState(value);
  const [prev, setPrev] = useState(value);
  // Keep the text box in sync when the value changes elsewhere (mode switch, reset).
  if (value !== prev) {
    setPrev(value);
    setText(value);
  }
  const id = `color-${colorKey}`;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-2">
      <input
        type="color"
        aria-label={`${label} color picker`}
        value={isHexColor(value) ? value : '#000000'}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="size-10 shrink-0 cursor-pointer rounded-lg border border-line bg-transparent p-0.5"
      />
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
        <p className="truncate text-[11px] text-muted">{help}</p>
      </div>
      <input
        id={id}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
          if (isHexColor(v)) onChange(v.toUpperCase());
        }}
        spellCheck={false}
        className={cn('w-20 rounded-lg border px-2 py-1 font-mono text-xs uppercase outline-none', isHexColor(text) ? 'border-line' : 'border-rose-400')}
      />
    </div>
  );
}

function FontSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const id = `font-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <Field label={label} htmlFor={id}>
      <Select id={id} value={value} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: `'${value}'` }}>
        {options.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </Select>
    </Field>
  );
}

/** WCAG checks for the color pairs the site actually uses. */
function ContrastReport({ theme, mode }: { theme: Theme; mode: Mode }) {
  const p = theme.colors[mode];
  const checks = useMemo(
    () => [
      { label: 'Text on background', fg: p.ink, bg: p.bg },
      { label: 'Muted text on background', fg: p.muted, bg: p.bg },
      { label: 'Primary text on background', fg: p.primaryInk, bg: p.bg },
      { label: 'Primary text on cards', fg: p.primaryInk, bg: p.surface },
      { label: mode === 'light' ? 'Button label (white on primary text)' : 'Button label (background on primary text)', fg: mode === 'light' ? '#FFFFFF' : p.bg, bg: p.primaryInk },
    ],
    [p, mode],
  );

  return (
    <div className="rounded-xl bg-blush-50 p-3">
      <p className="mb-2 text-xs font-semibold text-muted">Readability check (WCAG AA needs 4.5)</p>
      <ul className="space-y-1">
        {checks.map((c) => {
          const ratio = contrastRatio(c.fg, c.bg);
          const g = grade(ratio);
          return (
            <li key={c.label} className="flex items-center gap-2 text-xs">
              <span className="grid size-6 place-items-center rounded-md text-[10px] font-bold" style={{ background: c.bg, color: c.fg }} aria-hidden>
                Aa
              </span>
              <span className="flex-1">{c.label}</span>
              <span className="font-mono">{ratio.toFixed(2)}</span>
              <span className={cn('w-16 rounded-full px-2 py-0.5 text-center font-semibold', g === 'Fail' ? 'bg-rose-100 text-rose-800' : g === 'AA large' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800')}>
                {g}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A miniature homepage rendered with the draft theme's variables. */
function ThemePreview({ theme, mode }: { theme: Theme; mode: Mode }) {
  const fontsHref = googleFontsUrl([theme.fonts.heading, theme.fonts.body, theme.fonts.headingAr, theme.fonts.bodyAr]);
  const btnText = mode === 'light' ? '#FFFFFF' : 'var(--c-bg)';

  return (
    <>
      {/* React 19 hoists this into <head> and de-duplicates it. */}
      <link rel="stylesheet" href={fontsHref} precedence="default" />
      <div
        style={{ ...themeStyle(theme, mode), background: 'var(--c-bg)', color: 'var(--c-ink)', fontFamily: 'var(--font-body)', borderRadius: 'var(--radius)' }}
        className="relative overflow-hidden border border-line p-6 shadow-sm"
      >
        {/* Gradient blobs */}
        <div aria-hidden className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full opacity-50 blur-3xl" style={{ background: 'var(--c-primary)' }} />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -start-10 size-56 rounded-full opacity-40 blur-3xl" style={{ background: 'var(--c-secondary)' }} />

        <div className="relative space-y-5">
          <nav className="flex items-center justify-between text-xs" style={{ color: 'var(--c-muted)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-ink)' }} className="text-base font-semibold">
              Layan<span style={{ color: 'var(--c-primary)' }}>.</span>
            </span>
            <span className="flex gap-3">
              <span>About</span>
              <span>Projects</span>
              <span>Contact</span>
            </span>
          </nav>

          <span className="inline-block px-3 py-1 text-[11px] font-semibold" style={{ borderRadius: '999px', background: 'color-mix(in srgb, var(--c-accent) 35%, transparent)', color: 'var(--c-ink)' }}>
            ✿ Available for AI/ML roles
          </span>

          <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl leading-tight font-semibold">
            Hi, I&apos;m Layan — I build{' '}
            <span style={{ color: 'var(--c-primary-ink)' }}>thoughtful AI</span>.
          </h3>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
            Machine Learning & Software Engineer crafting end-to-end ML pipelines and delightful full-stack apps.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 text-sm font-semibold" style={{ background: 'var(--c-primary-ink)', color: btnText, borderRadius: 'var(--radius)' }}>
              Contact me
            </span>
            <span className="px-4 py-2 text-sm font-semibold" style={{ border: '1.5px solid var(--c-primary-ink)', color: 'var(--c-primary-ink)', borderRadius: 'var(--radius)' }}>
              Download CV
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['Python', 'PyTorch', 'Next.js', 'Supabase'].map((s) => (
              <span key={s} className="px-2.5 py-1 text-xs font-medium" style={{ borderRadius: '999px', background: 'color-mix(in srgb, var(--c-secondary) 30%, var(--c-surface))' }}>
                {s}
              </span>
            ))}
          </div>

          <div className="p-4 shadow-sm" style={{ background: 'var(--c-surface)', borderRadius: 'var(--radius)' }}>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-primary-ink)' }}>Senior Capstone</p>
            <p style={{ fontFamily: 'var(--font-heading)' }} className="text-lg font-semibold">Eventura</p>
            <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Real-time event platform with geofenced check-ins.</p>
          </div>

          <p dir="rtl" lang="ar" className="text-sm" style={{ fontFamily: `'${theme.fonts.bodyAr}'` }}>
            <span style={{ fontFamily: `'${theme.fonts.headingAr}'` }} className="text-lg font-semibold">
              مرحباً، أنا ليان.
            </span>{' '}
            أعمل في التعلم الآلي وهندسة البرمجيات.
          </p>
        </div>
      </div>
    </>
  );
}
