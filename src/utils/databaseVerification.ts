import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create dedicated Supabase client for database verification (bypasses SQLite)
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Development logging only
if (import.meta.env.DEV) {
  console.log('🔧 Database Verification Configuration initialized');
}

export interface DatabaseStatus {
  connected: boolean;
  tablesExist: boolean;
  errors: string[];
  tableStatus: {
    blog_posts: boolean;
    blog_likes: boolean;
    user_preferences: boolean;
    resume_links: boolean;
  };
}

export const verifyDatabaseConnection = async (): Promise<DatabaseStatus> => {
  const status: DatabaseStatus = {
    connected: false,
    tablesExist: false,
    errors: [],
    tableStatus: {
      blog_posts: false,
      blog_likes: false,
      user_preferences: false,
      resume_links: false
    }
  };

  try {
    // Test basic connection
    const { error: connectionError } = await supabaseClient
      .from('blog_posts')
      .select('id')
      .limit(1);

    if (connectionError) {
      status.errors.push(`Connection error: ${connectionError.message}`);
      return status;
    }

    status.connected = true;

    // Check each table
    const tables = ['blog_posts', 'blog_likes', 'user_preferences', 'resume_links'];

    for (const table of tables) {
      try {
        const { error } = await supabaseClient
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          status.errors.push(`Table ${table}: ${error.message}`);
          status.tableStatus[table as keyof typeof status.tableStatus] = false;
        } else {
          status.tableStatus[table as keyof typeof status.tableStatus] = true;
        }
      } catch (err: any) {
        status.errors.push(`Table ${table}: ${err.message}`);
        status.tableStatus[table as keyof typeof status.tableStatus] = false;
      }
    }

    // Check if all required tables exist
    status.tablesExist = Object.values(status.tableStatus).every(exists => exists);

    if (status.tablesExist) {
      console.log('✅ All required tables exist and are accessible');
    } else {
      console.log('❌ Some tables are missing or inaccessible');
    }

  } catch (error: any) {
    status.errors.push(`General error: ${error.message}`);
    console.error('❌ Database verification failed:', error);
  }

  return status;
};

export const testBlogPostCreation = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing blog post creation...');

    const testPost = {
      title: 'Test Post - ' + Date.now(),
      slug: 'test-post-' + Date.now(),
      content: '<p>This is a test post to verify database functionality.</p>',
      excerpt: 'Test post excerpt',
      author: 'Test Author',
      featured: false,
      status: 'draft' as const,
      tags: ['test'],
      like_count: 0,
      read_count: 0
    };

    // Create test post
    const { data: createdPost, error: createError } = await supabaseClient
      .from('blog_posts')
      .insert(testPost)
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create test post:', createError);
      return false;
    }

    console.log('✅ Test post created successfully:', createdPost.id);

    // Clean up - delete test post
    const { error: deleteError } = await supabaseClient
      .from('blog_posts')
      .delete()
      .eq('id', createdPost.id);

    if (deleteError) {
      console.warn('⚠️ Failed to delete test post:', deleteError);
    } else {
      console.log('✅ Test post cleaned up successfully');
    }

    return true;
  } catch (error: any) {
    console.error('❌ Blog post creation test failed:', error);
    return false;
  }
};

// Helper function to run full database verification
export const runDatabaseDiagnostics = async () => {
  const status = await verifyDatabaseConnection();
  const canCreatePosts = status.tablesExist ? await testBlogPostCreation() : false;

  if (import.meta.env.DEV) {
    console.log('📊 Database Diagnostics Results:');
    console.log('- Connected:', status.connected);
    console.log('- All tables exist:', status.tablesExist);
    console.log('- Can create posts:', canCreatePosts);
    console.log('- Table status:', status.tableStatus);

    if (status.errors.length > 0) {
      console.log('❌ Errors found:');
      status.errors.forEach(error => console.log('  -', error));
    }
  }

  return {
    ...status,
    canCreatePosts
  };
};

// Test environment variables configuration (development only)
export const testEnvironmentVariables = () => {
  if (!import.meta.env.DEV) return true;

  console.log('🧪 Testing Environment Variables Configuration:');

  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    VITE_USE_SUPABASE_AUTH: import.meta.env.VITE_USE_SUPABASE_AUTH,
    VITE_ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL ? '✅ Set' : '❌ Missing',
    VITE_SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID ? '✅ Set' : '❌ Missing'
  };

  console.table(envVars);

  // Check if all required vars are set
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_USE_SUPABASE_AUTH', 'VITE_ADMIN_EMAIL'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length === 0) {
    console.log('✅ All required environment variables are configured!');
    return true;
  } else {
    console.log('❌ Missing environment variables:', missing);
    return false;
  }
};

// Make functions available globally for debugging (development only)
if (import.meta.env.DEV) {
  (window as any).verifyDatabase = runDatabaseDiagnostics;
  (window as any).testBlogCreation = testBlogPostCreation;
  (window as any).testEnvironment = testEnvironmentVariables;
}
