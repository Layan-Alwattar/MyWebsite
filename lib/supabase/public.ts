import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from './env';

/**
 * Cookie-free, anonymous Supabase client for the public website.
 * Because it doesn't touch cookies, pages using it can be statically
 * rendered and cached; RLS guarantees it only ever sees published content.
 */
export function createPublicClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
