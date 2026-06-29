/**
 * Google OAuth callback handler.
 * Supabase exchanges the OAuth code for a session, then redirects to home.
 *
 * Flow:
 *   1. User clicks "Continue with Google" in SCAuthModal
 *   2. supabase.auth.signInWithOAuth redirects to Google
 *   3. Google redirects back to /auth/callback?code=…
 *   4. This route exchanges the code for a Supabase session
 *   5. User is redirected to / (or the `next` query param if provided)
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // Use a server-side client to exchange the code for a session.
    // NOTE: @supabase/auth-helpers-nextjs is not installed; we use supabase-js directly.
    // The session is set in the browser via the fragment URL — Supabase handles this
    // automatically when `detectSessionInUrl: true` is set on the browser client.
    // For pure server-side session exchange, install @supabase/ssr and use
    // createServerClient with cookies(). TODO when @supabase/ssr is added.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error.message);
      return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error.message)}`, origin));
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}
