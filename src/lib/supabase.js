import { createClient } from '@supabase/supabase-js';

let supabase;

export function getSupabaseClient() {
  const url = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in rezonx-app/.env.local.',
    );
  }

  if (!supabase) {
    supabase = createClient(url, publishableKey);
  }

  return supabase;
}
