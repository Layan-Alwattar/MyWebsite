import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from './env';

/**
 * Refreshes the Supabase auth session (used by proxy.ts) and returns
 * the response carrying any updated cookies, plus whether a user is signed in.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return { response, isSignedIn: false };

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not put code between createServerClient and getClaims(): this call
  // validates the token and triggers the refresh that keeps the user signed in.
  const { data } = await supabase.auth.getClaims();

  return { response, isSignedIn: Boolean(data?.claims) };
}
