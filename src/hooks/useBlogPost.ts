import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCache } from './useCache';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  tags: string[];
  author: string;
  featured: boolean;
  read_count: number;
  like_count: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export const useBlogPost = (slug: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          setError('Post not found');
          return;
        }

        setPost(data);

        // Increment read count asynchronously (non-blocking)
        // Don't await - let it happen in background
        supabase
          .from('blog_posts')
          .update({ read_count: data.read_count + 1 })
          .eq('id', data.id)
          .then(() => {
            // Silently update local state if successful
            setPost(prev => prev ? { ...prev, read_count: prev.read_count + 1 } : null);
          })
          .catch(() => {
            // Silently fail - read count is not critical
          });

      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
};

export const useBlogPosts = () => {
  const { getCacheConfig } = useCache();
  const cacheConfig = getCacheConfig('blogPosts');

  return useQuery({
    queryKey: [cacheConfig.key],
    queryFn: async (): Promise<BlogPost[]> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: cacheConfig.staleTime,
    gcTime: cacheConfig.cacheTime,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
};

// Hook for liking/unliking a blog post (one like per user)
export const useLikeBlogPost = () => {
  const [isLiking, setIsLiking] = useState(false);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});

  // Get current user ID - Supabase only
  const getCurrentUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.id) {
      return session.user.id;
    } else {
      // For anonymous users, generate a consistent UUID
      const anonymousId = localStorage.getItem('anonymous_user_id');
      if (anonymousId) {
        return anonymousId;
      } else {
        const newAnonymousId = crypto.randomUUID();
        localStorage.setItem('anonymous_user_id', newAnonymousId);
        return newAnonymousId;
      }
    }
  };

  // Check if user has liked a post
  const checkUserLike = async (postId: string) => {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking user like:', error);
      return false;
    }
  };

  // Toggle like/unlike
  const toggleLike = async (postId: string) => {
    try {
      setIsLiking(true);
      const userId = await getCurrentUserId();
      const isCurrentlyLiked = userLikes[postId] || await checkUserLike(postId);

      if (isCurrentlyLiked) {
        // Unlike the post
        const { error: deleteError } = await supabase
          .from('blog_likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);

        if (deleteError) throw deleteError;

        // Decrement like count
        const { error: updateError } = await supabase.rpc('decrement_like_count', {
          post_id: postId
        });

        if (updateError) throw updateError;

        setUserLikes(prev => ({ ...prev, [postId]: false }));
        return { success: true, action: 'unliked', likeChange: -1 };
      } else {
        // Like the post
        const { error: insertError } = await supabase
          .from('blog_likes')
          .insert({ user_id: userId, post_id: postId });

        if (insertError) throw insertError;

        // Increment like count
        const { error: updateError } = await supabase.rpc('increment_like_count', {
          post_id: postId
        });

        if (updateError) throw updateError;

        setUserLikes(prev => ({ ...prev, [postId]: true }));
        return { success: true, action: 'liked', likeChange: 1 };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false, error };
    } finally {
      setIsLiking(false);
    }
  };

  return { toggleLike, isLiking, userLikes, checkUserLike };
};