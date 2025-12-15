import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// Singleton instance to ensure stable real-time connections
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  // Return existing client if already created (singleton pattern)
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );

  return supabaseClient;
}
