-- Add like_count and status columns to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_like_count ON public.blog_posts(like_count);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);

-- Update existing posts to have 0 likes and published status if null
UPDATE public.blog_posts 
SET like_count = 0 
WHERE like_count IS NULL;

UPDATE public.blog_posts 
SET status = 'published' 
WHERE status IS NULL;

-- Add constraint to ensure status is either 'draft' or 'published'
ALTER TABLE public.blog_posts
ADD CONSTRAINT check_status CHECK (status IN ('draft', 'published'));

-- Create user_likes table to track individual likes
CREATE TABLE IF NOT EXISTS public.user_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id) -- Ensure one like per user per post
);

-- Create index for better performance on user_likes queries
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON public.user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_post_id ON public.user_likes(post_id);

-- Enable RLS (Row Level Security) for user_likes
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own likes
CREATE POLICY "Users can manage their own likes" ON public.user_likes
  FOR ALL USING (auth.uid() = user_id);

-- Create policy to allow reading all likes (for like counts)
CREATE POLICY "Anyone can read likes" ON public.user_likes
  FOR SELECT USING (true);

-- Create function to increment like count safely
CREATE OR REPLACE FUNCTION increment_like_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET like_count = like_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrement like count safely
CREATE OR REPLACE FUNCTION decrement_like_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET like_count = GREATEST(0, like_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
