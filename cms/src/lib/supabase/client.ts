/**
 * Supabase Client (Browser)
 *
 * Creates a Supabase client for client-side operations
 * Uses anon key (publicly safe)
 * Used in React components and client-side hooks
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
