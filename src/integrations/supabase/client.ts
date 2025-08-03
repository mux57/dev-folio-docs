// Database client with environment-based switching
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { sqliteClient } from '@/database/sqlite-client';

// Get Supabase configuration from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zfglwpfoshlteckqnbgr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZ2x3cGZvc2hsdGVja3FuYmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTIzNTAsImV4cCI6MjA2OTQ2ODM1MH0.RezElKHz5f5D1lxxgqpoNhDs7jkQy1IawI63tIg0US8";
const isSupaBaseEnabled = import.meta.env.VITE_USE_SUPABASE_AUTH === 'true';

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('❌ Missing Supabase environment variables. Please check your .env file.');
}

// Check if we should use local development mode
const USE_LOCAL_DB = localStorage.getItem('use_local_db') === 'true' ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

// Create the appropriate client based on environment
let supabase: any;

// Initialize the client immediately (no async)
if (USE_LOCAL_DB && !isSupaBaseEnabled) {
  console.log('🔧 Using Browser SQLite for local development');
  supabase = sqliteClient;
} else {
  console.log('☁️ Using Supabase for production');
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'supabase.main.token'
    }
  });
}

export { supabase };