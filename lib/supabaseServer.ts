import { createClient } from '@supabase/supabase-js';

/**
 * Creates an authoritative Supabase client for Server Actions.
 * Prioritizes SUPABASE_SERVICE_ROLE_KEY to bypass Row Level Security (RLS)
 * for administrative write operations. Falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const keyToUse = serviceRoleKey || anonKey || '';

  if (!supabaseUrl || !keyToUse) {
    console.warn(
      '[SupabaseServer] Warning: Missing NEXT_PUBLIC_SUPABASE_URL or API keys in environment.'
    );
  }

  return createClient(
    supabaseUrl || 'https://placeholder-project.supabase.co',
    keyToUse || 'placeholder-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            cache: 'no-store',
          });
        },
      },
    }
  );
}
