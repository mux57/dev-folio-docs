-- SQLite version of your Supabase migrations
-- Compatible with your existing schema

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT, -- SQLite doesn't have arrays, we'll store as JSON string
  author TEXT NOT NULL DEFAULT 'Software Engineer',
  featured BOOLEAN DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published', -- 'draft' or 'published'
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create user_likes table to track individual likes
CREATE TABLE IF NOT EXISTS user_likes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id), -- Ensure one like per user per post
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);

-- Create profiles table (simplified for local development)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'default' CHECK (theme IN ('default', 'ocean', 'sunset', 'light')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create trigger for updating timestamps on blog_posts
CREATE TRIGGER IF NOT EXISTS update_blog_posts_updated_at
AFTER UPDATE ON blog_posts
FOR EACH ROW
BEGIN
  UPDATE blog_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create trigger for updating timestamps on profiles
CREATE TRIGGER IF NOT EXISTS update_profiles_updated_at
AFTER UPDATE ON profiles
FOR EACH ROW
BEGIN
  UPDATE profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create trigger for updating timestamps on user_preferences
CREATE TRIGGER IF NOT EXISTS update_user_preferences_updated_at
AFTER UPDATE ON user_preferences
FOR EACH ROW
BEGIN
  UPDATE user_preferences SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert sample blog posts (converted from your existing data)
INSERT OR IGNORE INTO blog_posts (title, content, excerpt, slug, tags, featured) VALUES
(
  'Building Scalable React Applications',
  '<h2>Introduction</h2><p>Building scalable React applications requires careful planning and architecture decisions. In this comprehensive guide, we''ll explore the best practices and patterns that have proven successful in large-scale applications.</p><h2>Component Architecture</h2><p>The foundation of any scalable React application lies in its component architecture. Here are the key principles:</p><ul><li><strong>Single Responsibility Principle:</strong> Each component should have a single, well-defined purpose</li><li><strong>Composition over Inheritance:</strong> Build complex UIs by composing smaller, reusable components</li><li><strong>Props Interface Design:</strong> Design clear and consistent props interfaces</li></ul><h2>State Management</h2><p>For large applications, choosing the right state management solution is crucial:</p><ul><li><strong>Context API:</strong> Perfect for application-wide state like themes and user authentication</li><li><strong>Redux Toolkit:</strong> Ideal for complex state logic and time-travel debugging</li><li><strong>Zustand:</strong> Lightweight alternative for simpler state management needs</li></ul><h2>Performance Optimization</h2><p>Performance becomes critical as your application grows. Key strategies include:</p><ul><li>Code splitting with React.lazy() and Suspense</li><li>Memoization with React.memo, useMemo, and useCallback</li><li>Virtual scrolling for large lists</li><li>Image optimization and lazy loading</li></ul><h2>Testing Strategy</h2><p>A comprehensive testing strategy should include:</p><ul><li>Unit tests for individual components</li><li>Integration tests for component interactions</li><li>End-to-end tests for critical user flows</li></ul><h2>Conclusion</h2><p>Building scalable React applications is an iterative process that requires continuous learning and adaptation. By following these principles and patterns, you''ll be well-equipped to handle the challenges of large-scale development.</p>',
  'Learn the essential patterns and best practices for building scalable React applications that can grow with your team and user base.',
  'building-scalable-react-applications',
  '["React", "Architecture", "Performance"]',
  1
),
(
  'The Future of Web Development',
  '<h2>The Evolution Continues</h2><p>Web development is in a constant state of evolution, with new technologies and approaches emerging regularly. Let''s explore what the next decade might hold for our industry.</p><h2>Emerging Technologies</h2><h3>WebAssembly (WASM)</h3><p>WebAssembly is revolutionizing web performance by allowing near-native execution speeds in browsers. We''re seeing increased adoption for computationally intensive tasks.</p><h3>Edge Computing</h3><p>Edge computing is bringing computation closer to users, reducing latency and improving user experience. Frameworks like Next.js are already embracing edge functions.</p><h2>Development Trends</h2><ul><li><strong>JAMstack Evolution:</strong> Static site generation continues to mature with improved dynamic capabilities</li><li><strong>Micro-frontends:</strong> Breaking down monolithic frontends into manageable pieces</li><li><strong>No-code/Low-code:</strong> Democratizing development while requiring new skills from traditional developers</li></ul><h2>The AI Revolution</h2><p>Artificial Intelligence is transforming how we write code:</p><ul><li>AI-powered code completion and generation</li><li>Automated testing and debugging</li><li>Intelligent design systems</li></ul><h2>Preparing for the Future</h2><p>To stay relevant in this rapidly evolving landscape:</p><ul><li>Focus on fundamental concepts that transcend specific technologies</li><li>Stay curious and embrace continuous learning</li><li>Build a diverse skill set spanning multiple domains</li></ul>',
  'Explore the emerging technologies and trends that will shape the future of web development in the coming decade.',
  'the-future-of-web-development',
  '["Web Development", "Trends", "Technology"]',
  0
),
(
  'Getting Started with TypeScript',
  '<h2>Why TypeScript?</h2><p>TypeScript brings static typing to JavaScript, making your code more reliable and easier to maintain. Let''s explore the basics and see why it''s become essential for modern development.</p><h2>Basic Types</h2><p>TypeScript provides several basic types:</p><ul><li><strong>string:</strong> Text data</li><li><strong>number:</strong> Numeric values</li><li><strong>boolean:</strong> True/false values</li><li><strong>array:</strong> Collections of items</li></ul><h2>Interfaces</h2><p>Interfaces define the shape of objects:</p><pre><code>interface User {
  name: string;
  age: number;
  email?: string; // Optional property
}</code></pre><h2>Functions</h2><p>Type your function parameters and return values:</p><pre><code>function greet(name: string): string {
  return `Hello, ${name}!`;
}</code></pre><h2>Best Practices</h2><ul><li>Start with strict mode enabled</li><li>Use interfaces for object shapes</li><li>Leverage union types for flexibility</li><li>Don''t use ''any'' unless absolutely necessary</li></ul>',
  'Learn TypeScript fundamentals and discover how static typing can improve your JavaScript development experience.',
  'getting-started-with-typescript',
  '["TypeScript", "JavaScript", "Programming"]',
  1
);

-- Insert a sample profile for local development
INSERT OR IGNORE INTO profiles (id, email, full_name, avatar_url) VALUES
('local-user-1', 'developer@localhost.com', 'Local Developer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');

-- Insert default preferences for the sample user
INSERT OR IGNORE INTO user_preferences (user_id, theme) VALUES
('local-user-1', 'default');

-- Create resume_links table for managing resume downloads
CREATE TABLE IF NOT EXISTS resume_links (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  file_size TEXT,
  is_active BOOLEAN DEFAULT 1,
  display_order INTEGER DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updating timestamps on resume_links
CREATE TRIGGER IF NOT EXISTS update_resume_links_updated_at
AFTER UPDATE ON resume_links
FOR EACH ROW
BEGIN
  UPDATE resume_links SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert default resume link (Google Drive)
INSERT OR IGNORE INTO resume_links (id, name, description, file_url, file_type, file_size, is_active, display_order) VALUES
('resume-1', 'Software Engineer Resume', 'Latest resume with current experience and skills', 'https://drive.google.com/uc?export=download&id=1Sc1-lz6ejMOKE8fvOJitZi5mUzKgKtPC', 'pdf', '10MB', 1, 1);
