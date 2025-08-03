import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

// Create dedicated Supabase client for authentication (bypasses SQLite)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zfglwpfoshlteckqnbgr.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZ2x3cGZvc2hsdGVja3FuYmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTIzNTAsImV4cCI6MjA2OTQ2ODM1MH0.RezElKHz5f5D1lxxgqpoNhDs7jkQy1IawI63tIg0US8";

const authSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Environment flag to force Supabase authentication
const USE_SUPABASE_AUTH = import.meta.env.VITE_USE_SUPABASE_AUTH === 'true' ||
                         localStorage.getItem('force_supabase_auth') === 'true';

// Get admin email from environment or use default
const PORTFOLIO_OWNER_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'mukeshknit57@gmail.com';

// Debug logging
console.log('🔧 Auth Configuration:');
console.log('- Supabase URL:', SUPABASE_URL);
console.log('- Auth client created:', !!authSupabase);
console.log('- Use Supabase Auth:', USE_SUPABASE_AUTH);
console.log('- Admin Email:', PORTFOLIO_OWNER_EMAIL);

// Temporary bypass for testing (remove in production)
const TEMP_BYPASS = localStorage.getItem('temp_admin_bypass') === 'true';
if (TEMP_BYPASS) {
  console.log('🚨 TEMPORARY ADMIN BYPASS ENABLED');
}

// Helper function to enable Supabase auth (call in browser console)
(window as any).enableSupabaseAuth = () => {
  localStorage.setItem('force_supabase_auth', 'true');
  console.log('✅ Supabase authentication enabled! Refresh the page.');
  console.log('🔗 Admin login URL: http://localhost:8082/admin/login');
};

(window as any).disableSupabaseAuth = () => {
  localStorage.removeItem('force_supabase_auth');
  console.log('✅ Supabase authentication disabled! Using local mock auth.');
};

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false
  });

  // Use the environment variable for admin email

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        if (USE_SUPABASE_AUTH) {
          // Use Supabase authentication
          console.log('🔐 Using Supabase authentication');
          const { data: { session }, error } = await authSupabase.auth.getSession();

          if (error) {
            console.error('Error getting session:', error);
          }

          const isAdmin = session?.user?.email === PORTFOLIO_OWNER_EMAIL;

          // Debug logging for admin check
          console.log('🔍 Admin Check Debug:', {
            userEmail: session?.user?.email,
            adminEmail: PORTFOLIO_OWNER_EMAIL,
            isAdmin: isAdmin,
            emailMatch: session?.user?.email === PORTFOLIO_OWNER_EMAIL
          });

          setAuthState({
            user: session?.user || null,
            session: session,
            loading: false,
            isAdmin
          });
        } else {
          // Use local mock authentication
          console.log('🔧 Using local mock authentication');
          const localAuth = localStorage.getItem('local_admin_auth');
          if (localAuth === 'true') {
            const mockUser = {
              id: 'local-admin-user',
              email: 'mukeshknit57@gmail.com',
              user_metadata: {
                full_name: 'Mukesh Kumar Gupta',
                avatar_url: ''
              }
            };

            setAuthState({
              user: mockUser as any,
              session: { user: mockUser } as any,
              loading: false,
              isAdmin: true
            });
          } else {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              isAdmin: false
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes (only for Supabase)
    if (USE_SUPABASE_AUTH) {
      const { data: { subscription } } = authSupabase.auth.onAuthStateChange(
        async (event: string, session: Session | null) => {
          console.log('Auth state changed:', event, session?.user?.email);

          const isAdmin = session?.user?.email === PORTFOLIO_OWNER_EMAIL;

          // Debug logging for auth state change
          console.log('🔄 Auth State Change Debug:', {
            event: event,
            userEmail: session?.user?.email,
            adminEmail: PORTFOLIO_OWNER_EMAIL,
            isAdmin: isAdmin
          });

          setAuthState({
            user: session?.user || null,
            session: session,
            loading: false,
            isAdmin
          });
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      if (USE_SUPABASE_AUTH) {
        console.log('� Starting Google OAuth with Supabase');

        const { data, error } = await authSupabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/admin/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });

        if (error) {
          console.error('Google sign in error:', error);
          throw error;
        }

        return { data, error: null };
      } else {
        // Local mock authentication
        console.log('🔧 Local development mode: Simulating Google OAuth');

        const mockUser = {
          id: 'local-admin-user',
          email: 'mukeshknit57@gmail.com',
          user_metadata: {
            full_name: 'Mukesh Kumar Gupta',
            avatar_url: ''
          }
        };

        // Set local storage flag
        localStorage.setItem('local_admin_auth', 'true');

        // Set the auth state manually for local development
        setAuthState({
          user: mockUser as any,
          session: { user: mockUser } as any,
          loading: false,
          isAdmin: true
        });

        return { data: { user: mockUser }, error: null };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign in with email/password (fallback)
  const signInWithEmail = async (email: string, password: string) => {
    try {
      if (USE_SUPABASE_AUTH) {
        const { data, error } = await authSupabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.error('Email sign in error:', error);
          throw error;
        }

        return { data, error: null };
      } else {
        // Local mock authentication
        if (email === 'mukeshknit57@gmail.com') {
          const mockUser = {
            id: 'local-admin-user',
            email: 'mukeshknit57@gmail.com',
            user_metadata: {
              full_name: 'Mukesh Kumar Gupta',
              avatar_url: ''
            }
          };

          localStorage.setItem('local_admin_auth', 'true');

          setAuthState({
            user: mockUser as any,
            session: { user: mockUser } as any,
            loading: false,
            isAdmin: true
          });

          return { data: { user: mockUser }, error: null };
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Email sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      if (USE_SUPABASE_AUTH) {
        const { error } = await authSupabase.auth.signOut();

        if (error) {
          console.error('Sign out error:', error);
          throw error;
        }
      } else {
        // Local mock sign out
        localStorage.removeItem('local_admin_auth');
        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAdmin: false
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      if (USE_SUPABASE_AUTH) {
        const { data, error } = await authSupabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) {
          console.error('Reset password error:', error);
          throw error;
        }

        return { data, error: null };
      } else {
        // Local mock - just return success
        return { data: null, error: null };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  };

  return {
    ...authState,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    resetPassword
  };
};

// Hook specifically for checking admin permissions
export const useAdminAuth = () => {
  const auth = useAuth();
  
  return {
    isAdmin: auth.isAdmin,
    isAuthenticated: !!auth.user,
    loading: auth.loading,
    user: auth.user,
    signOut: auth.signOut
  };
};
