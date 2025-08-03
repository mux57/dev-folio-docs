import { useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Use environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zfglwpfoshlteckqnbgr.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZ2x3cGZvc2hsdGVja3FuYmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTIzNTAsImV4cCI6MjA2OTQ2ODM1MH0.RezElKHz5f5D1lxxgqpoNhDs7jkQy1IawI63tIg0US8";

// Create a single shared Supabase client for auth
let authSupabase: any = null;

// Initialize auth client only once
const getAuthSupabase = () => {
  if (!authSupabase) {
    authSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'supabase.auth.token' // Use default storage key
      }
    });
  }
  return authSupabase;
};

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
  console.log('🔗 Admin login URL: http://localhost:8080/admin/login');
};

(window as any).disableSupabaseAuth = () => {
  localStorage.removeItem('force_supabase_auth');
  console.log('✅ Supabase authentication disabled! Using local mock auth.');
};

// Global function to test OAuth configuration
(window as any).testOAuthConfig = () => {
  console.log('🔧 OAuth Configuration Test:');
  console.log('- Supabase URL:', SUPABASE_URL);
  console.log('- Current Origin:', window.location.origin);
  console.log('- Expected Callback:', `${window.location.origin}/admin/callback`);
  console.log('- Admin Email:', PORTFOLIO_OWNER_EMAIL);
  console.log('- Use Supabase Auth:', USE_SUPABASE_AUTH);

  console.log('\n📋 Supabase Setup Checklist:');
  console.log('1. Site URL should be:', window.location.origin);
  console.log('2. Redirect URLs should include:', `${window.location.origin}/admin/callback`);
  console.log('3. Google OAuth should be enabled in Supabase Auth settings');
  console.log('4. Google OAuth redirect URI should be: https://[your-project].supabase.co/auth/v1/callback');
};

// Global session check function for debugging
(window as any).checkAuthSession = async () => {
  try {
    const { data: { session }, error } = await getAuthSupabase().auth.getSession();

    console.log('🔍 Current Auth Session:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      isAdmin: session?.user?.email === PORTFOLIO_OWNER_EMAIL,
      error: error?.message,
      sessionData: session,
      currentUrl: window.location.href,
      hasAuthParams: window.location.href.includes('access_token') || window.location.href.includes('code')
    });

    return session;
  } catch (error) {
    console.error('Session check failed:', error);
    return null;
  }
};

// Global function to manually process auth callback
(window as any).processAuthCallback = async () => {
  try {
    console.log('🔄 Manually processing auth callback...');

    // Check if URL has auth parameters
    const url = window.location.href;
    const hasAuthParams = url.includes('access_token') || url.includes('code') || url.includes('refresh_token');

    console.log('🔍 URL Analysis:', {
      currentUrl: url,
      hasAuthParams: hasAuthParams,
      urlParams: new URLSearchParams(window.location.search).toString(),
      hashParams: window.location.hash
    });

    if (hasAuthParams) {
      // Force session refresh to pick up auth from URL
      const { data: { session }, error } = await getAuthSupabase().auth.getSession();

      console.log('🔍 Session after URL processing:', {
        hasSession: !!session,
        userEmail: session?.user?.email,
        error: error?.message,
        session: session
      });

      return { session, error };
    } else {
      console.log('❌ No auth parameters found in URL');
      return { session: null, error: null };
    }
  } catch (error) {
    console.error('Auth callback processing failed:', error);
    return { session: null, error };
  }
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
          const { data: { session }, error } = await getAuthSupabase().auth.getSession();

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
      const { data: { subscription } } = getAuthSupabase().auth.onAuthStateChange(
        async (event: string, session: Session | null) => {
          console.log('🔄 Auth state changed:', event, session?.user?.email);

          const isAdmin = session?.user?.email === PORTFOLIO_OWNER_EMAIL;

          // Debug logging for auth state change
          console.log('🔄 Auth State Change Debug:', {
            event: event,
            userEmail: session?.user?.email,
            adminEmail: PORTFOLIO_OWNER_EMAIL,
            isAdmin: isAdmin,
            sessionExists: !!session,
            userExists: !!session?.user
          });

          // Handle different auth events
          if (event === 'SIGNED_IN' && session) {
            console.log('✅ User signed in successfully');
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('🔄 Token refreshed');
          }

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

        // Validate Supabase configuration before attempting OAuth
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          throw new Error('Supabase configuration is missing. Please check environment variables.');
        }

        // Check if we're in a secure context for OAuth
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
          throw new Error('OAuth requires HTTPS or localhost environment.');
        }

        const redirectUrl = `${window.location.origin}/admin/callback`;
        console.log('🔗 OAuth redirect URL:', redirectUrl);

        const { data, error } = await getAuthSupabase().auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
            skipBrowserRedirect: false
          }
        });

        if (error) {
          console.error('Google sign in error:', error);

          // Provide more specific error messages
          if (error.message.includes('redirect')) {
            throw new Error('OAuth redirect configuration error. Please check Supabase redirect URLs.');
          } else if (error.message.includes('provider')) {
            throw new Error('Google OAuth provider not configured. Please check Supabase settings.');
          } else {
            throw error;
          }
        }

        console.log('✅ OAuth initiated successfully');
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
        const { data, error } = await getAuthSupabase().auth.signInWithPassword({
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
        const { error } = await getAuthSupabase().auth.signOut();

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
        const { data, error } = await getAuthSupabase().auth.resetPasswordForEmail(email, {
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

  // Manual session check for debugging
  const checkSession = async () => {
    try {
      console.log('🔍 Manual session check...');
      const { data: { session }, error } = await getAuthSupabase().auth.getSession();

      console.log('🔍 Session check result:', {
        session: !!session,
        user: session?.user?.email,
        error: error?.message,
        isAdmin: session?.user?.email === PORTFOLIO_OWNER_EMAIL
      });

      return { session, error };
    } catch (error) {
      console.error('Session check error:', error);
      return { session: null, error };
    }
  };

  return {
    ...authState,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    resetPassword,
    checkSession
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
