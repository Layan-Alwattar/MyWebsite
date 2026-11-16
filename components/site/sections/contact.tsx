'use client';

import { CheckCircle2, Mail, Send } from 'lucide-react';
import { useActionState } from 'react';
import { sendContactMessage, type ContactState } from '@/app/[locale]/contact-action';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/site/dictionary';
import { btnPrimary } from '../styles';

const fieldClass =
  'w-full rounded-[calc(var(--radius)*0.7)] border border-[color-mix(in_srgb,var(--c-ink)_14%,transparent)] bg-card px-4 py-3 text-fg outline-none transition ' +
  'placeholder:text-fg-muted/70 focus:border-primary-ink focus:ring-4 focus:ring-[color-mix(in_srgb,var(--c-primary)_20%,transparent)] aria-[invalid=true]:border-rose-500';

export function ContactForm({ locale, dict, email }: { locale: Locale; dict: Dictionary; email: string | null }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, { status: 'idle' });
  const invalid = (name: string) => Boolean(state.errors?.[name]);

  if (state.status === 'sent') {
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-theme bg-card p-10 text-center shadow-sm">
        <CheckCircle2 size={40} className="text-emerald-500" aria-hidden />
        <p className="font-display text-2xl text-fg">{dict.sent}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot — hidden from people and screen readers */}
      <div aria-hidden className="pointer-events-none absolute size-0 overflow-hidden opacity-0">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-fg">{dict.contactName}</span>
          <input name="name" required maxLength={120} autoComplete="name" aria-invalid={invalid('name')} className={fieldClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-fg">{dict.contactEmail}</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" aria-invalid={invalid('email')} className={cn(fieldClass, 'rtl:text-right')} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-fg">{dict.contactSubject}</span>
        <input name="subject" maxLength={200} className={fieldClass} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-fg">{dict.contactMessage}</span>
        <textarea name="message" required minLength={5} maxLength={5000} rows={5} aria-invalid={invalid('message')} className={cn(fieldClass, 'resize-y')} />
      </label>

      {(state.status === 'error' || state.status === 'rate_limited' || state.status === 'invalid') && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-800">
          {state.status === 'rate_limited' ? dict.rateLimited : state.status === 'invalid' ? (locale === 'ar' ? 'يرجى التحقق من الحقول المظللة.' : 'Please check the highlighted fields.') : dict.sendError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={cn(btnPrimary, 'disabled:opacity-60')}>
          <Send size={16} aria-hidden className="rtl:-scale-x-100" /> {pending ? dict.sending : dict.send}
        </button>
        {email && (
          <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink hover:underline" dir="ltr">
            <Mail size={15} aria-hidden /> {email}
          </a>
        )}
      </div>
    </form>
  );
}
