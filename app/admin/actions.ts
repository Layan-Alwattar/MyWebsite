'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { safeAdminPath } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export type SignInState = { error?: string };

const credentials = z.object({
  email: z.email('Please enter a valid email.'),
  password: z.string().min(1, 'Please enter your password.'),
});

/** Email + password sign-in for the admin portal. */
export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = credentials.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Deliberately vague: don't reveal whether the email exists.
  if (error) return { error: 'Incorrect email or password.' };

  // Signed in, but are they the site owner?
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access.' };
  }

  redirect(safeAdminPath(formData.get('next')));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
