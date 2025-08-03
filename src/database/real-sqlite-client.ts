// Real SQLite client that connects to Node.js backend
const API_BASE_URL = 'http://localhost:3001/api';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  tags: string[];
  author: string;
  featured: boolean;
  read_count: number;
  created_at: string;
  updated_at: string;
}

class RealSQLiteClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Check if server is running
  async isServerRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Supabase-like table interface
  from(table: string) {
    const self = this;
    
    return {
      select: (_columns = '*') => ({
        eq: (column: string, value: any) => ({
          maybeSingle: async () => {
            if (table === 'blog_posts' && column === 'slug') {
              try {
                const response = await fetch(`${self.baseUrl}/blog_posts/${value}`);
                const result = await response.json();
                return result;
              } catch (error) {
                return { data: null, error: error.message };
              }
            }
            if (table === 'user_preferences' && column === 'user_id') {
              try {
                const response = await fetch(`${self.baseUrl}/user_preferences/${value}`);
                const result = await response.json();
                return result;
              } catch (error) {
                return { data: null, error: error.message };
              }
            }
            return { data: null, error: null };
          }
        }),
        
        order: (_column: string, _options: any = {}) => ({
          then: async (callback: any) => {
            if (table === 'blog_posts') {
              try {
                const response = await fetch(`${self.baseUrl}/blog_posts`);
                const result = await response.json();
                return callback(result);
              } catch (error) {
                return callback({ data: null, error: error.message });
              }
            }
            return callback({ data: [], error: null });
          }
        }),
        
        then: async (callback: any) => {
          if (table === 'blog_posts') {
            try {
              const response = await fetch(`${self.baseUrl}/blog_posts`);
              const result = await response.json();
              return callback(result);
            } catch (error) {
              return callback({ data: null, error: error.message });
            }
          }
          if (table === 'resume_links') {
            try {
              const response = await fetch(`${self.baseUrl}/resume_links`);
              const result = await response.json();
              return callback(result);
            } catch (error) {
              return callback({ data: null, error: error.message });
            }
          }
          return callback({ data: [], error: null });
        }
      }),
      
      insert: async (data: any) => {
        if (table === 'blog_posts') {
          try {
            const response = await fetch(`${self.baseUrl}/blog_posts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            const result = await response.json();
            return result;
          } catch (error) {
            return { data: null, error: error.message };
          }
        }
        return { data: null, error: 'Table not supported' };
      },

      upsert: async (data: any) => {
        if (table === 'user_preferences') {
          try {
            const response = await fetch(`${self.baseUrl}/user_preferences`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            const result = await response.json();
            return result;
          } catch (error) {
            return { data: null, error: error.message };
          }
        }
        return { data: null, error: 'Table not supported' };
      },

      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => {
            if (table === 'blog_posts') {
              try {
                // For read count updates, we need to find the post first
                if (column === 'id') {
                  const response = await fetch(`${self.baseUrl}/blog_posts/${value}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                  });
                  const result = await response.json();
                  return callback(result);
                }
              } catch (error) {
                return callback({ data: null, error: error.message });
              }
            }
            return callback({ data: null, error: null });
          }
        })
      })
    };
  }

  // Simple auth mock
  auth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (_callback: any) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signOut: async () => ({ error: null })
  };
}

// Create and export the client
export const realSQLiteClient = new RealSQLiteClient();
