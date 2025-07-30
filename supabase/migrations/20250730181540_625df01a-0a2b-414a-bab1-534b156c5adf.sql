-- Create table for blog posts and read tracking
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[],
  author TEXT NOT NULL DEFAULT 'Software Engineer',
  featured BOOLEAN DEFAULT false,
  read_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Blog posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (true);

-- Create policy to allow public read count updates
CREATE POLICY "Blog post read counts can be incremented" 
ON public.blog_posts 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, content, excerpt, slug, tags, featured) VALUES
(
  'Building Scalable React Applications',
  '<h2>Introduction</h2><p>Building scalable React applications requires careful planning and architecture decisions. In this comprehensive guide, we''ll explore the best practices and patterns that have proven successful in large-scale applications.</p><h2>Component Architecture</h2><p>The foundation of any scalable React application lies in its component architecture. Here are the key principles:</p><ul><li><strong>Single Responsibility Principle:</strong> Each component should have a single, well-defined purpose</li><li><strong>Composition over Inheritance:</strong> Build complex UIs by composing smaller, reusable components</li><li><strong>Props Interface Design:</strong> Design clear and consistent props interfaces</li></ul><h2>State Management</h2><p>For large applications, choosing the right state management solution is crucial:</p><ul><li><strong>Context API:</strong> Perfect for application-wide state like themes and user authentication</li><li><strong>Redux Toolkit:</strong> Ideal for complex state logic and time-travel debugging</li><li><strong>Zustand:</strong> Lightweight alternative for simpler state management needs</li></ul><h2>Performance Optimization</h2><p>Performance becomes critical as your application grows. Key strategies include:</p><ul><li>Code splitting with React.lazy() and Suspense</li><li>Memoization with React.memo, useMemo, and useCallback</li><li>Virtual scrolling for large lists</li><li>Image optimization and lazy loading</li></ul><h2>Testing Strategy</h2><p>A comprehensive testing strategy should include:</p><ul><li>Unit tests for individual components</li><li>Integration tests for component interactions</li><li>End-to-end tests for critical user flows</li></ul><h2>Conclusion</h2><p>Building scalable React applications is an iterative process that requires continuous learning and adaptation. By following these principles and patterns, you''ll be well-equipped to handle the challenges of large-scale development.</p>',
  'Learn the essential patterns and best practices for building scalable React applications that can grow with your team and user base.',
  'building-scalable-react-applications',
  ARRAY['React', 'Architecture', 'Performance'],
  true
),
(
  'The Future of Web Development',
  '<h2>The Evolution Continues</h2><p>Web development is in a constant state of evolution, with new technologies and approaches emerging regularly. Let''s explore what the next decade might hold for our industry.</p><h2>Emerging Technologies</h2><h3>WebAssembly (WASM)</h3><p>WebAssembly is revolutionizing web performance by allowing near-native execution speeds in browsers. We''re seeing increased adoption for computationally intensive tasks.</p><h3>Edge Computing</h3><p>Edge computing is bringing computation closer to users, reducing latency and improving user experience. Frameworks like Next.js are already embracing edge functions.</p><h2>Development Trends</h2><ul><li><strong>JAMstack Evolution:</strong> Static site generation continues to mature with improved dynamic capabilities</li><li><strong>Micro-frontends:</strong> Breaking down monolithic frontends into manageable pieces</li><li><strong>No-code/Low-code:</strong> Democratizing development while requiring new skills from traditional developers</li></ul><h2>The AI Revolution</h2><p>Artificial Intelligence is transforming how we write code:</p><ul><li>AI-powered code completion and generation</li><li>Automated testing and debugging</li><li>Intelligent design systems</li></ul><h2>Preparing for the Future</h2><p>To stay relevant in this rapidly evolving landscape:</p><ul><li>Focus on fundamental concepts that transcend specific technologies</li><li>Develop strong problem-solving skills</li><li>Stay curious and embrace continuous learning</li><li>Build a diverse skill set spanning multiple domains</li></ul>',
  'Explore the emerging technologies and trends that will shape the future of web development in the coming decade.',
  'the-future-of-web-development',
  ARRAY['Web Development', 'Trends', 'Technology'],
  false
);