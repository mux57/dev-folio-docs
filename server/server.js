import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Initialize SQLite database
const db = new Database(join(__dirname, 'portfolio.db'));

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database schema
const initDB = () => {
  // Create blog_posts table
  db.exec(`
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
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT,
      full_name TEXT,
      avatar_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create user_preferences table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL,
      theme TEXT NOT NULL DEFAULT 'default' CHECK (theme IN ('default', 'ocean', 'sunset', 'light')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id)
    )
  `);

  // Insert sample data if empty
  const postCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get();
  if (postCount.count === 0) {
    const insertPost = db.prepare(`
      INSERT INTO blog_posts (id, title, content, excerpt, slug, tags, featured, read_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const samplePosts = [
      {
        id: '1',
        title: 'Building Scalable React Applications',
        content: '<h2>Introduction</h2><p>Building scalable React applications requires careful planning and architecture decisions...</p>',
        excerpt: 'Learn the essential patterns and best practices for building scalable React applications.',
        slug: 'building-scalable-react-applications',
        tags: JSON.stringify(['React', 'Architecture', 'Performance']),
        featured: 1,
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
        tags: JSON.stringify(['Web Development', 'Trends', 'Technology']),
        featured: 0,
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
        tags: JSON.stringify(['TypeScript', 'JavaScript', 'Programming']),
        featured: 1,
        read_count: 312,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    samplePosts.forEach(post => {
      insertPost.run(
        post.id, post.title, post.content, post.excerpt, post.slug,
        post.tags, post.featured, post.read_count, post.created_at, post.updated_at
      );
    });

    console.log('✅ Sample data inserted into SQLite database');
  }
};

// API Routes

// Get all blog posts
app.get('/api/blog_posts', (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      featured: Boolean(post.featured)
    }));
    res.json({ data: formattedPosts, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Get single blog post by slug
app.get('/api/blog_posts/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug);
    
    if (!post) {
      return res.json({ data: null, error: null });
    }

    // Increment read count
    db.prepare('UPDATE blog_posts SET read_count = read_count + 1, updated_at = ? WHERE slug = ?')
      .run(new Date().toISOString(), slug);

    const formattedPost = {
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      featured: Boolean(post.featured)
    };

    res.json({ data: formattedPost, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Create new blog post
app.post('/api/blog_posts', (req, res) => {
  try {
    const { title, content, excerpt, slug, tags, author = 'Software Engineer', featured = false } = req.body;
    
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      excerpt,
      slug,
      tags: JSON.stringify(tags || []),
      author,
      featured: featured ? 1 : 0,
      read_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const insert = db.prepare(`
      INSERT INTO blog_posts (id, title, content, excerpt, slug, tags, author, featured, read_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      newPost.id, newPost.title, newPost.content, newPost.excerpt, newPost.slug,
      newPost.tags, newPost.author, newPost.featured, newPost.read_count,
      newPost.created_at, newPost.updated_at
    );

    const responsePost = {
      ...newPost,
      tags: JSON.parse(newPost.tags),
      featured: Boolean(newPost.featured)
    };

    res.json({ data: responsePost, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Update blog post
app.put('/api/blog_posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = Object.keys(updates).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => 
      field === 'tags' ? JSON.stringify(updates[field]) :
      field === 'featured' ? (updates[field] ? 1 : 0) :
      updates[field]
    );

    const update = db.prepare(`
      UPDATE blog_posts 
      SET ${setClause}, updated_at = ? 
      WHERE id = ?
    `);

    update.run(...values, new Date().toISOString(), id);
    
    res.json({ data: null, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Get user preferences
app.get('/api/user_preferences/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(userId);
    res.json({ data: preferences || null, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Upsert user preferences
app.post('/api/user_preferences', (req, res) => {
  try {
    const { user_id, theme } = req.body;

    // Try to update first
    const update = db.prepare('UPDATE user_preferences SET theme = ?, updated_at = ? WHERE user_id = ?');
    const result = update.run(theme, new Date().toISOString(), user_id);

    if (result.changes === 0) {
      // No rows updated, insert new record
      const insert = db.prepare(`
        INSERT INTO user_preferences (user_id, theme, created_at, updated_at)
        VALUES (?, ?, ?, ?)
      `);
      insert.run(user_id, theme, new Date().toISOString(), new Date().toISOString());
    }

    res.json({ data: { user_id, theme }, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'SQLite', timestamp: new Date().toISOString() });
});

// Initialize database and start server
initDB();

app.listen(PORT, () => {
  console.log(`🚀 SQLite server running on http://localhost:${PORT}`);
  console.log(`📊 Database file: ${join(__dirname, 'portfolio.db')}`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down SQLite server...');
  db.close();
  process.exit(0);
});
