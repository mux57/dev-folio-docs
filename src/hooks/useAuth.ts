import { useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase as authSupabase } from '@/lib/supabase';

// Always use Supabase authentication
const USE_SUPABASE_AUTH = import.meta.env.VITE_USE_SUPABASE_AUTH === 'true';

// Get admin email from environment (required)
const PORTFOLIO_OWNER_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

// Get Supabase URL for logging
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper functions for development (remove in production)
if (import.meta.env.DEV) {
  (window as any).enableSupabaseAuth = () => {
    localStorage.setItem('force_supabase_auth', 'true');
    console.log('✅ Supabase authentication enabled! Refresh the page.');
  };

  (window as any).disableSupabaseAuth = () => {
    localStorage.removeItem('force_supabase_auth');
    console.log('✅ Supabase authentication disabled! Using local mock auth.');
  };

  // Global function to test OAuth configuration (development only)
  (window as any).testOAuthConfig = () => {
    console.log('🔧 OAuth Configuration Test:');
    console.log('- Current Origin:', window.location.origin);
    console.log('- Expected Callback:', `${window.location.origin}/admin/callback`);
    console.log('- Use Supabase Auth:', USE_SUPABASE_AUTH);

    console.log('\n📋 Supabase Setup Checklist:');
    console.log('1. Site URL should be:', window.location.origin);
    console.log('2. Redirect URLs should include:', `${window.location.origin}/admin/callback`);
    console.log('3. Google OAuth should be enabled in Supabase Auth settings');
    console.log('4. Google OAuth redirect URI should be: https://[your-project].supabase.co/auth/v1/callback');
  };

  // Global session check function for debugging (development only)
  (window as any).checkAuthSession = async () => {
    try {
      const { data: { session }, error } = await authSupabase.auth.getSession();

      console.log('🔍 Current Auth Session:', {
        hasSession: !!session,
        error: error?.message,
        hasAuthParams: window.location.href.includes('access_token') || window.location.href.includes('code')
      });

      return session;
    } catch (error) {
      console.error('Session check failed:', error);
      return null;
    }
  };

  // Global function to manually process auth callback (development only)
  (window as any).processAuthCallback = async () => {
    try {
      console.log('🔄 Manually processing auth callback...');

      // Check if URL has auth parameters
      const hasAuthParams = window.location.href.includes('access_token') ||
                           window.location.href.includes('code') ||
                           window.location.href.includes('refresh_token');

      console.log('🔍 URL Analysis:', {
        hasAuthParams: hasAuthParams,
        urlParams: new URLSearchParams(window.location.search).toString(),
        hashParams: window.location.hash
      });

      if (hasAuthParams) {
        // Force session refresh to pick up auth from URL
        const { data: { session }, error } = await authSupabase.auth.getSession();

        console.log('🔍 Session after URL processing:', {
          hasSession: !!session,
          error: error?.message
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
}

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
        // Use Supabase authentication
        const { data: { session }, error } = await authSupabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
        }

        const isAdmin = session?.user?.email === PORTFOLIO_OWNER_EMAIL;

        setAuthState({
          user: session?.user || null,
          session: session,
          loading: false,
          isAdmin
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = authSupabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        const isAdmin = session?.user?.email === PORTFOLIO_OWNER_EMAIL;

        // Handle different auth events
        if (import.meta.env.DEV) {
          console.log('🔄 Auth state changed:', event);
          if (event === 'SIGNED_IN' && session) {
            console.log('✅ User signed in successfully');
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('🔄 Token refreshed');
          }
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
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      if (USE_SUPABASE_AUTH) {
        // Validate Supabase configuration before attempting OAuth
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          throw new Error('Supabase configuration is missing. Please check environment variables.');
        }

        // Check if we're in a secure context for OAuth
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
          throw new Error('OAuth requires HTTPS or localhost environment.');
        }

        const redirectUrl = `${window.location.origin}/admin/callback`;

        const { data, error } = await authSupabase.auth.signInWithOAuth({
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

        return { data, error: null };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign in with email/password (fallback)
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await authSupabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Email sign in error:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Email sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await authSupabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        throw error;
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
      const { data, error } = await authSupabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Reset password error:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  };

  // Manual session check for debugging
  const checkSession = async () => {
    try {
      const { data: { session }, error } = await authSupabase.auth.getSession();

      if (import.meta.env.DEV) {
        console.log('🔍 Session check result:', {
          session: !!session,
          error: error?.message
        });
      }

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
