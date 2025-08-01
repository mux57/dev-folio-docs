// SQLite client that mimics Supabase API
// Uses Web SQL API (deprecated but still works) or falls back to localStorage

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

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  id: string;
  user_id: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

interface ResumeLink {
  id: string;
  name: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

class SQLiteClient {
  private db: any = null;
  private isInitialized = false;
  private useLocalStorage = false;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Try to use Web SQL (works in Chrome, Safari)
      const webSQL = (window as any).openDatabase;
      if (webSQL) {
        this.db = webSQL('portfolio_db', '1.0', 'Portfolio Database', 5 * 1024 * 1024);
        await this.createTables();
        await this.insertSampleData();
        this.isInitialized = true;
        console.log('✅ SQLite Web SQL database initialized successfully');
      } else {
        throw new Error('Web SQL not supported');
      }
    } catch (error) {
      console.info('📦 Web SQL not supported in this browser, using localStorage instead (this is normal and expected)');
      this.useLocalStorage = true;
      this.initializeLocalStorage();
    }
  }

  private initializeLocalStorage() {
    const sampleData = {
      blog_posts: [
        {
          id: '1',
          title: 'Building Scalable React Applications',
          content: '<h2>Introduction</h2><p>Building scalable React applications requires careful planning and architecture decisions...</p>',
          excerpt: 'Learn the essential patterns and best practices for building scalable React applications.',
          slug: 'building-scalable-react-applications',
          tags: ['React', 'Architecture', 'Performance'],
          author: 'Software Engineer',
          featured: true,
          read_count: 245,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'The Future of Web Development',
          content: '<h2>The Evolution Continues</h2><p>Web development is in a constant state of evolution...</p>',
          excerpt: 'Explore the emerging technologies and trends that will shape the future of web development.',
          slug: 'the-future-of-web-development',
          tags: ['Web Development', 'Trends', 'Technology'],
          author: 'Software Engineer',
          featured: false,
          read_count: 189,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Getting Started with TypeScript',
          content: '<h2>Why TypeScript?</h2><p>TypeScript brings static typing to JavaScript...</p>',
          excerpt: 'Learn TypeScript fundamentals and discover how static typing can improve your development.',
          slug: 'getting-started-with-typescript',
          tags: ['TypeScript', 'JavaScript', 'Programming'],
          author: 'Software Engineer',
          featured: true,
          read_count: 312,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      profiles: [
        {
          id: 'local-user-1',
          email: 'developer@localhost.com',
          full_name: 'Local Developer',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    };

    if (!localStorage.getItem('sqlite_blog_posts')) {
      localStorage.setItem('sqlite_blog_posts', JSON.stringify(sampleData.blog_posts));
    }
    if (!localStorage.getItem('sqlite_profiles')) {
      localStorage.setItem('sqlite_profiles', JSON.stringify(sampleData.profiles));
    }

    // Initialize user preferences for local development
    if (!localStorage.getItem('sqlite_user_preferences')) {
      const defaultPreferences = [
        {
          id: 'pref-1',
          user_id: 'local-user-1',
          theme: 'default',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('sqlite_user_preferences', JSON.stringify(defaultPreferences));
    }

    // Initialize resume links for local development
    if (!localStorage.getItem('sqlite_resume_links')) {
      const defaultResumeLinks = [
        {
          id: 'resume-1',
          name: 'Software Engineer Resume',
          description: 'Latest resume with current experience and skills',
          file_url: 'https://drive.google.com/uc?export=download&id=1Sc1-lz6ejMOKE8fvOJitZi5mUzKgKtPC',
          file_type: 'pdf',
          file_size: '10MB',
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('sqlite_resume_links', JSON.stringify(defaultResumeLinks));
    }

    this.isInitialized = true;
    console.log('✅ LocalStorage database initialized successfully - all features working!');
  }

  private createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        // Create blog_posts table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS blog_posts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            excerpt TEXT,
            slug TEXT UNIQUE NOT NULL,
            tags TEXT,
            author TEXT NOT NULL DEFAULT 'Software Engineer',
            featured INTEGER DEFAULT 0,
            read_count INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          )
        `);

        // Create profiles table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            email TEXT,
            full_name TEXT,
            avatar_url TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          )
        `);
      }, reject, resolve);
    });
  }

  private insertSampleData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        // Check if data already exists
        tx.executeSql('SELECT COUNT(*) as count FROM blog_posts', [], (tx: any, result: any) => {
          if (result.rows.item(0).count === 0) {
            // Insert sample blog posts
            const posts = [
              {
                id: '1',
                title: 'Building Scalable React Applications',
                content: '<h2>Introduction</h2><p>Building scalable React applications requires careful planning...</p>',
                excerpt: 'Learn the essential patterns and best practices for building scalable React applications.',
                slug: 'building-scalable-react-applications',
                tags: JSON.stringify(['React', 'Architecture', 'Performance']),
                featured: 1,
                read_count: 245
              },
              {
                id: '2',
                title: 'The Future of Web Development',
                content: '<h2>The Evolution Continues</h2><p>Web development is in a constant state of evolution...</p>',
                excerpt: 'Explore the emerging technologies and trends that will shape the future of web development.',
                slug: 'the-future-of-web-development',
                tags: JSON.stringify(['Web Development', 'Trends', 'Technology']),
                featured: 0,
                read_count: 189
              }
            ];

            posts.forEach(post => {
              tx.executeSql(`
                INSERT INTO blog_posts (id, title, content, excerpt, slug, tags, featured, read_count, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                post.id, post.title, post.content, post.excerpt, post.slug, 
                post.tags, post.featured, post.read_count, 
                new Date().toISOString(), new Date().toISOString()
              ]);
            });

            // Insert sample profile
            tx.executeSql(`
              INSERT INTO profiles (id, email, full_name, avatar_url, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [
              'local-user-1', 'developer@localhost.com', 'Local Developer',
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              new Date().toISOString(), new Date().toISOString()
            ]);
          }
        });
      }, reject, resolve);
    });
  }

  // Blog posts methods
  async getBlogPosts(): Promise<{ data: BlogPost[] | null; error: any }> {
    if (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      if (this.useLocalStorage) {
        const posts = JSON.parse(localStorage.getItem('sqlite_blog_posts') || '[]');
        return { data: posts, error: null };
      }

      return new Promise((resolve, reject) => {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT * FROM blog_posts ORDER BY created_at DESC',
            [],
            (tx: any, result: any) => {
              const posts: BlogPost[] = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                posts.push({
                  ...row,
                  tags: JSON.parse(row.tags || '[]'),
                  featured: Boolean(row.featured)
                });
              }
              resolve({ data: posts, error: null });
            },
            (tx: any, error: any) => resolve({ data: null, error })
          );
        });
      });
    } catch (error) {
      return { data: null, error };
    }
  }

  async getBlogPost(slug: string): Promise<{ data: BlogPost | null; error: any }> {
    if (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      if (this.useLocalStorage) {
        const posts = JSON.parse(localStorage.getItem('sqlite_blog_posts') || '[]');
        const post = posts.find((p: BlogPost) => p.slug === slug);
        return { data: post || null, error: null };
      }

      return new Promise((resolve, reject) => {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT * FROM blog_posts WHERE slug = ?',
            [slug],
            (tx: any, result: any) => {
              if (result.rows.length > 0) {
                const row = result.rows.item(0);
                const post: BlogPost = {
                  ...row,
                  tags: JSON.parse(row.tags || '[]'),
                  featured: Boolean(row.featured)
                };
                resolve({ data: post, error: null });
              } else {
                resolve({ data: null, error: null });
              }
            },
            (tx: any, error: any) => resolve({ data: null, error })
          );
        });
      });
    } catch (error) {
      return { data: null, error };
    }
  }

  // User preferences methods
  async getUserPreferences(userId: string): Promise<{ data: any | null; error: any }> {
    if (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      if (this.useLocalStorage) {
        const preferences = localStorage.getItem('sqlite_user_preferences');
        if (preferences) {
          const prefs = JSON.parse(preferences);
          const userPref = prefs.find((p: any) => p.user_id === userId);
          return { data: userPref || null, error: null };
        }
        return { data: null, error: null };
      }

      return new Promise((resolve) => {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT * FROM user_preferences WHERE user_id = ?',
            [userId],
            (_tx: any, result: any) => {
              if (result.rows.length > 0) {
                const row = result.rows.item(0);
                resolve({ data: row, error: null });
              } else {
                resolve({ data: null, error: null });
              }
            },
            (_tx: any, error: any) => resolve({ data: null, error })
          );
        });
      });
    } catch (error) {
      return { data: null, error };
    }
  }

  async upsertUserPreferences(userId: string, theme: string): Promise<{ data: any | null; error: any }> {
    if (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      if (this.useLocalStorage) {
        const preferences = JSON.parse(localStorage.getItem('sqlite_user_preferences') || '[]');
        const existingIndex = preferences.findIndex((p: any) => p.user_id === userId);

        const newPref = {
          id: existingIndex >= 0 ? preferences[existingIndex].id : Date.now().toString(),
          user_id: userId,
          theme,
          created_at: existingIndex >= 0 ? preferences[existingIndex].created_at : new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (existingIndex >= 0) {
          preferences[existingIndex] = newPref;
        } else {
          preferences.push(newPref);
        }

        localStorage.setItem('sqlite_user_preferences', JSON.stringify(preferences));
        return { data: newPref, error: null };
      }

      return new Promise((resolve) => {
        this.db.transaction((tx: any) => {
          // Try to update first
          tx.executeSql(
            'UPDATE user_preferences SET theme = ?, updated_at = ? WHERE user_id = ?',
            [theme, new Date().toISOString(), userId],
            (_tx: any, result: any) => {
              if (result.rowsAffected === 0) {
                // No rows updated, insert new record
                tx.executeSql(
                  'INSERT INTO user_preferences (user_id, theme, created_at, updated_at) VALUES (?, ?, ?, ?)',
                  [userId, theme, new Date().toISOString(), new Date().toISOString()],
                  () => resolve({ data: { user_id: userId, theme }, error: null }),
                  (_tx: any, error: any) => resolve({ data: null, error })
                );
              } else {
                resolve({ data: { user_id: userId, theme }, error: null });
              }
            },
            (_tx: any, error: any) => resolve({ data: null, error })
          );
        });
      });
    } catch (error) {
      return { data: null, error };
    }
  }

  // Resume links methods
  async getActiveResumeLinks(): Promise<{ data: any[] | null; error: any }> {
    if (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      if (this.useLocalStorage) {
        const links = JSON.parse(localStorage.getItem('sqlite_resume_links') || '[]');
        const activeLinks = links.filter((link: any) => link.is_active);
        return { data: activeLinks, error: null };
      }

      return new Promise((resolve) => {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT * FROM resume_links WHERE is_active = 1 ORDER BY display_order ASC',
            [],
            (_tx: any, result: any) => {
              const links: any[] = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                links.push({
                  ...row,
                  is_active: Boolean(row.is_active)
                });
              }
              resolve({ data: links, error: null });
            },
            (_tx: any, error: any) => resolve({ data: null, error })
          );
        });
      });
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateResumeLink(id: string, updates: any): Promise<{ data: any | null; error: any }> {
    if (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      if (this.useLocalStorage) {
        const links = JSON.parse(localStorage.getItem('sqlite_resume_links') || '[]');
        const linkIndex = links.findIndex((link: any) => link.id === id);

        if (linkIndex !== -1) {
          links[linkIndex] = {
            ...links[linkIndex],
            ...updates,
            updated_at: new Date().toISOString()
          };
          localStorage.setItem('sqlite_resume_links', JSON.stringify(links));
          return { data: links[linkIndex], error: null };
        }
        return { data: null, error: 'Resume link not found' };
      }

      return new Promise((resolve) => {
        this.db.transaction((tx: any) => {
          const fields = Object.keys(updates).filter(key => key !== 'id');
          const setClause = fields.map(field => `${field} = ?`).join(', ');
          const values = fields.map(field =>
            field === 'is_active' ? (updates[field] ? 1 : 0) : updates[field]
          );

          tx.executeSql(`
            UPDATE resume_links
            SET ${setClause}, updated_at = ?
            WHERE id = ?
          `, [...values, new Date().toISOString(), id],
          () => resolve({ data: { id, ...updates }, error: null }),
          (_tx: any, error: any) => resolve({ data: null, error })
          );
        });
      });
    } catch (error) {
      return { data: null, error };
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
              return await self.getBlogPost(value);
            }
            if (table === 'user_preferences' && column === 'user_id') {
              return await self.getUserPreferences(value);
            }
            if (table === 'resume_links' && column === 'is_active') {
              return await self.getActiveResumeLinks();
            }
            return { data: null, error: null };
          }
        }),

        order: (column: string, options: any = {}) => ({
          then: async (callback: any) => {
            if (table === 'blog_posts') {
              const result = await self.getBlogPosts();
              // Sort by created_at descending by default
              if (result.data && column === 'created_at' && !options.ascending) {
                result.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              }
              return callback(result);
            }
            return callback({ data: [], error: null });
          }
        }),

        then: async (callback: any) => {
          if (table === 'blog_posts') {
            return callback(await self.getBlogPosts());
          }
          if (table === 'resume_links') {
            return callback(await self.getActiveResumeLinks());
          }
          return callback({ data: [], error: null });
        }
      }),

      insert: async (data: any) => {
        if (table === 'blog_posts') {
          // Handle blog post creation
          const newPost = {
            id: Date.now().toString(),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            read_count: 0
          };

          if (self.useLocalStorage) {
            const posts = JSON.parse(localStorage.getItem('sqlite_blog_posts') || '[]');
            posts.unshift(newPost);
            localStorage.setItem('sqlite_blog_posts', JSON.stringify(posts));
            return { data: newPost, error: null };
          }

          // Handle Web SQL insert
          return new Promise((resolve) => {
            self.db.transaction((tx: any) => {
              tx.executeSql(`
                INSERT INTO blog_posts (id, title, content, excerpt, slug, tags, author, featured, read_count, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                newPost.id, newPost.title, newPost.content, newPost.excerpt,
                newPost.slug, JSON.stringify(newPost.tags), newPost.author,
                newPost.featured ? 1 : 0, newPost.read_count,
                newPost.created_at, newPost.updated_at
              ],
              () => resolve({ data: newPost, error: null }),
              (_tx: any, error: any) => resolve({ data: null, error })
              );
            });
          });
        }
        return { data: null, error: 'Table not supported' };
      },

      upsert: async (data: any) => {
        if (table === 'user_preferences') {
          return await self.upsertUserPreferences(data.user_id, data.theme);
        }
        return { data: null, error: 'Table not supported' };
      },

      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => {
            if (table === 'blog_posts') {
              // Handle read count increment
              if (self.useLocalStorage) {
                const posts = JSON.parse(localStorage.getItem('sqlite_blog_posts') || '[]');
                const postIndex = posts.findIndex((p: any) => p[column] === value);
                if (postIndex !== -1) {
                  posts[postIndex] = { ...posts[postIndex], ...data, updated_at: new Date().toISOString() };
                  localStorage.setItem('sqlite_blog_posts', JSON.stringify(posts));
                  return callback({ data: posts[postIndex], error: null });
                }
              } else {
                // Handle Web SQL update
                return new Promise((resolve) => {
                  self.db.transaction((tx: any) => {
                    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
                    const values = [...Object.values(data), value];

                    tx.executeSql(`
                      UPDATE blog_posts SET ${setClause}, updated_at = ? WHERE ${column} = ?
                    `, [...values, new Date().toISOString()],
                    () => resolve({ data: null, error: null }),
                    (_tx: any, error: any) => resolve({ data: null, error })
                    );
                  });
                });
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
      // Mock auth state change
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signOut: async () => ({ error: null })
  };
}

// Create singleton instance
export const sqliteClient = new SQLiteClient();

// Export with same interface as Supabase
export const supabase = sqliteClient;
