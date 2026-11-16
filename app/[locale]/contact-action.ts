'use server';

import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { z } from 'zod';
import { createPublicClient } from '@/lib/supabase/public';

export type ContactState = { status: 'idle' | 'sent' | 'error' | 'rate_limited' | 'invalid'; errors?: Record<string, string> };

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  subject: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().min(5).max(5000),
  locale: z.enum(['en', 'ar']).default('en'),
});

/**
 * Contact form handler. Writes through the submit_contact_message() database
 * function, which validates input and rate-limits per (hashed) IP address.
 * The raw IP is never stored.
 */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never fill the hidden "website" field.
  if (formData.get('website')) return { status: 'sent' };

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject') ?? '',
    message: formData.get('message'),
    locale: formData.get('locale'),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = 'invalid';
    return { status: 'invalid', errors };
  }

  const h = await headers();
  const ip = h.get('x-nf-client-connection-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('x-real-ip') ?? '';
  const salt = process.env.CONTACT_HASH_SALT ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const ipHash = ip ? createHash('sha256').update(`${salt}:${ip}`).digest('hex') : null;

  const { error } = await createPublicClient().rpc('submit_contact_message', {
    p_name: parsed.data.name,
    p_email: parsed.data.email,
    p_subject: parsed.data.subject,
    p_message: parsed.data.message,
    p_locale: parsed.data.locale,
    p_ip_hash: ipHash,
  });

  if (error) return { status: error.message.includes('rate_limited') ? 'rate_limited' : 'error' };
  return { status: 'sent' };
}
