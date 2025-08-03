-- Add like_count column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Create index for better performance on like_count queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_like_count ON public.blog_posts(like_count);

-- Update existing posts to have 0 likes if null
UPDATE public.blog_posts 
SET like_count = 0 
WHERE like_count IS NULL;
