/**
 * Supabase connection settings. The publishable key is safe to expose (it is
 * sent to every visitor's browser anyway): Row Level Security decides what
 * each visitor can read or write. The defaults below point at the live
 * project so a deploy works even if the host's environment variables are
 * missing; set the variables to point at a different project.
 */
const DEFAULT_URL = 'https://woduddttpizmlkazxvxu.supabase.co';
const DEFAULT_KEY = 'sb_publishable_Zr1xHLRRzpUjT4S4kgUhSg_cbPgkMmj';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_URL;
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || DEFAULT_KEY;

/** True when both values are set, so pages can show a helpful message instead of crashing. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
