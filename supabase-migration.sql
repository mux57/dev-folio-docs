-- Supabase Database Migration Script
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author VARCHAR(255) DEFAULT 'Software Engineer',
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    tags TEXT[] DEFAULT '{}',
    like_count INTEGER DEFAULT 0,
    read_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS public.blog_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID,
    user_email VARCHAR(255),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_email),
    UNIQUE(post_id, ip_address)
);

-- Create user_preferences table for admin settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create resume_links table for storing resume download links
CREATE TABLE IF NOT EXISTS public.resume_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    google_drive_link TEXT NOT NULL,
    backup_link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON public.blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_email ON public.blog_likes(user_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_links_updated_at ON public.resume_links;
CREATE TRIGGER update_resume_links_updated_at
    BEFORE UPDATE ON public.resume_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog post (optional)
INSERT INTO public.blog_posts (title, slug, content, excerpt, tags, featured)
VALUES (
    'Welcome to My Blog',
    'welcome-to-my-blog',
    '<h1>Welcome to My Blog</h1><p>This is my first blog post! I''m excited to share my thoughts and experiences with you.</p><p>Stay tuned for more content about software development, technology, and my journey as a developer.</p>',
    'Welcome to my blog! This is my first post where I introduce myself and share what you can expect from this blog.',
    ARRAY['welcome', 'introduction', 'blog'],
    true
) ON CONFLICT (slug) DO NOTHING;

-- Insert default resume link (replace with your actual Google Drive link)
INSERT INTO public.resume_links (google_drive_link, backup_link)
VALUES (
    'https://drive.google.com/file/d/your-file-id/view?usp=sharing',
    'https://backup-link.com/resume.pdf'
) ON CONFLICT DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Blog posts are viewable by everyone"
    ON public.blog_posts FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Only admin can insert blog posts" ON public.blog_posts;
CREATE POLICY "Only admin can insert blog posts"
    ON public.blog_posts FOR INSERT
    WITH CHECK (
        auth.email() = 'mukeshknit57@gmail.com'
    );

DROP POLICY IF EXISTS "Only admin can update blog posts" ON public.blog_posts;
CREATE POLICY "Only admin can update blog posts"
    ON public.blog_posts FOR UPDATE
    USING (
        auth.email() = 'mukeshknit57@gmail.com'
    );

DROP POLICY IF EXISTS "Only admin can delete blog posts" ON public.blog_posts;
CREATE POLICY "Only admin can delete blog posts"
    ON public.blog_posts FOR DELETE
    USING (
        auth.email() = 'mukeshknit57@gmail.com'
    );

-- RLS Policies for blog_likes
DROP POLICY IF EXISTS "Blog likes are viewable by everyone" ON public.blog_likes;
CREATE POLICY "Blog likes are viewable by everyone"
    ON public.blog_likes FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own likes" ON public.blog_likes;
CREATE POLICY "Users can insert their own likes"
    ON public.blog_likes FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.blog_likes;
CREATE POLICY "Users can delete their own likes"
    ON public.blog_likes FOR DELETE
    USING (
        user_email = auth.email() OR 
        user_id = auth.uid()
    );

-- RLS Policies for user_preferences
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
CREATE POLICY "Users can view their own preferences"
    ON public.user_preferences FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert their own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
CREATE POLICY "Users can update their own preferences"
    ON public.user_preferences FOR UPDATE
    USING (user_id = auth.uid());

-- RLS Policies for resume_links
DROP POLICY IF EXISTS "Resume links are viewable by everyone" ON public.resume_links;
CREATE POLICY "Resume links are viewable by everyone"
    ON public.resume_links FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Only admin can manage resume links" ON public.resume_links;
CREATE POLICY "Only admin can manage resume links"
    ON public.resume_links FOR ALL
    USING (
        auth.email() = 'mukeshknit57@gmail.com'
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_likes TO anon, authenticated;
GRANT ALL ON public.user_preferences TO anon, authenticated;
GRANT ALL ON public.resume_links TO anon, authenticated;

-- Create admin user preference for your email
INSERT INTO public.user_preferences (user_id, is_admin)
SELECT id, true
FROM auth.users
WHERE email = 'mukeshknit57@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;

-- Success message
SELECT 'Database migration completed successfully! All tables created with proper RLS policies.' as status;
