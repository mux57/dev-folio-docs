// Singleton Supabase client
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Get Supabase configuration from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('❌ Missing Supabase environment variables. Please check your .env file.');
}

// Create singleton Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    console.log('☁️ Creating Supabase singleton client');
    supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'supabase.auth.token'
      }
    });
  }
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();
