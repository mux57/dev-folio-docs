import { supabase } from '@/lib/supabase';

// Diagnostic function to test Supabase auth configuration
export const runAuthDiagnostics = async () => {
  console.log('🔍 Running Supabase Auth Diagnostics...');
  
  try {
    // Test 1: Check Supabase connection
    console.log('1. Testing Supabase connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);
    
    if (healthError) {
      console.error('❌ Supabase connection failed:', healthError);
      return false;
    }
    console.log('✅ Supabase connection successful');

    // Test 2: Check current session
    console.log('2. Checking current auth session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError);
    } else if (session) {
      console.log('✅ User is signed in:', session.user.email);
    } else {
      console.log('ℹ️ No active session (user not signed in)');
    }

    // Test 3: Check auth configuration
    console.log('3. Checking auth configuration...');
    console.log('- Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('- Admin Email:', import.meta.env.VITE_ADMIN_EMAIL);
    console.log('- Use Supabase Auth:', import.meta.env.VITE_USE_SUPABASE_AUTH);
    console.log('- Current Origin:', window.location.origin);

    // Test 4: Test sign out (if signed in)
    if (session) {
      console.log('4. Testing sign out...');
      try {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('❌ Sign out failed:', signOutError);
        } else {
          console.log('✅ Sign out successful');
        }
      } catch (error) {
        console.error('❌ Sign out error:', error);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Auth diagnostics failed:', error);
    return false;
  }
};

// Test Google OAuth configuration
export const testGoogleOAuth = () => {
  console.log('🔍 Google OAuth Configuration Check:');
  console.log('- Current Origin:', window.location.origin);
  console.log('- Expected Callback URL:', `${window.location.origin}/admin/callback`);
  console.log('- Supabase Auth URL:', `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`);
  
  console.log('\n📋 Supabase Dashboard Checklist:');
  console.log('1. Go to: https://supabase.com/dashboard/project/zfglwpfoshlteckqnbgr/auth/settings');
  console.log('2. Set Site URL to:', window.location.origin);
  console.log('3. Add Redirect URL:', `${window.location.origin}/admin/callback`);
  console.log('4. Enable Google provider in Auth > Providers');
  console.log('5. Set Google OAuth redirect URI to: https://zfglwpfoshlteckqnbgr.supabase.co/auth/v1/callback');
};

// Make functions available globally for debugging
if (import.meta.env.DEV) {
  (window as any).runAuthDiagnostics = runAuthDiagnostics;
  (window as any).testGoogleOAuth = testGoogleOAuth;
}
