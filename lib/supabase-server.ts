/**
 * Server-side Supabase client for use in Next.js App Router Server Components,
 * Route Handlers, and Server Actions.
 *
 * Uses @supabase/ssr to correctly handle cookies so the session is available
 * server-side (e.g. for school-head authenticated pages).
 *
 * Usage in a Server Component:
 *   import { createServerClient } from '@/lib/supabase-server'
 *   const supabase = await createServerClient()
 *   const { data } = await supabase.from('schools').select(...)
 */

import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // Server components are read-only — cookie setting is a no-op here.
        // Use a Route Handler or Server Action if you need to write cookies.
        setAll() {},
      },
    }
  );
}

/** Convenience: fetch the public school list server-side. */
export async function fetchPublicSchools() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('schools')
    .select('id, name, logo_url, address, phone, email, motto, plan, primary_colour, status')
    .eq('status', 'active') // TODO: replace with .eq('is_public', true) once column exists
    .order('name');
  return { data, error };
}
