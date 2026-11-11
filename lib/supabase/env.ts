/**
 * Supabase connection settings, read once from environment variables.
 * The publishable key is safe to expose: Row Level Security decides what
 * each visitor can read or write.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

/** True when both variables are set, so pages can show a helpful message instead of crashing. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
