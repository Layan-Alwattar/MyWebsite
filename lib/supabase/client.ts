import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_KEY, SUPABASE_URL } from './env';

/**
 * Supabase client for Client Components (e.g. drag-and-drop uploads in the
 * admin media manager). Shares the auth session via cookies.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
