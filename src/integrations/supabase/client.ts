// Database client with environment-based switching
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { sqliteClient } from '@/database/sqlite-client';

const SUPABASE_URL = "https://zfglwpfoshlteckqnbgr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZ2x3cGZvc2hsdGVja3FuYmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTIzNTAsImV4cCI6MjA2OTQ2ODM1MH0.RezElKHz5f5D1lxxgqpoNhDs7jkQy1IawI63tIg0US8";

// Check if we should use local development mode
const USE_LOCAL_DB = localStorage.getItem('use_local_db') === 'true' ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

// Create the appropriate client based on environment
let supabase: any;

const initializeClient = async () => {
  if (USE_LOCAL_DB) {
    // Check if real SQLite server is running
    try {
      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) {
        console.log('🗄️ Using Real SQLite Server (localhost:3001)');
        const { realSQLiteClient } = await import('@/database/real-sqlite-client');
        return realSQLiteClient;
      }
    } catch {
      // Server not running, fall back to browser SQLite
    }

    console.log('🔧 Using Browser SQLite for local development');
    return sqliteClient;
  } else {
    console.log('☁️ Using Supabase for production');
    return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }
};

// Initialize the client
supabase = await initializeClient();

export { supabase };