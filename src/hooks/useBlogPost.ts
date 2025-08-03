import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

        // Increment read count
        await supabase
          .from('blog_posts')
          .update({ read_count: data.read_count + 1 })
          .eq('id', data.id);

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

// Hook for liking/unliking a blog post (one like per user)
export const useLikeBlogPost = () => {
  const [isLiking, setIsLiking] = useState(false);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});

  // Get current user ID (mock for local, real for production)
  const getCurrentUserId = async () => {
    const isLocalDev = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1' ||
                      localStorage.getItem('use_local_db') === 'true';

    if (isLocalDev) {
      return 'local-user-1'; // Mock user for local development
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id || 'anonymous-user';
    }
  };

  // Check if user has liked a post
  const checkUserLike = async (postId: string) => {
    try {
      const userId = await getCurrentUserId();

      // Check if using SQLite client
      if (typeof supabase.likePost === 'function') {
        const { data } = await (supabase as any).checkUserLike(postId, userId);
        return data?.liked || false;
      }

      // Supabase check
      const { data, error } = await supabase
        .from('user_likes')
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
        if (typeof supabase.unlikePost === 'function') {
          // SQLite client
          const { error } = await (supabase as any).unlikePost(postId, userId);
          if (error) throw error;
        } else {
          // Supabase
          const { error: deleteError } = await supabase
            .from('user_likes')
            .delete()
            .eq('user_id', userId)
            .eq('post_id', postId);

          if (deleteError) throw deleteError;

          // Decrement like count
          const { error: updateError } = await supabase.rpc('decrement_like_count', {
            post_id: postId
          });

          if (updateError) throw updateError;
        }

        setUserLikes(prev => ({ ...prev, [postId]: false }));
        return { success: true, action: 'unliked', likeChange: -1 };
      } else {
        // Like the post
        if (typeof supabase.likePost === 'function') {
          // SQLite client
          const { error } = await (supabase as any).likePost(postId, userId);
          if (error) throw error;
        } else {
          // Supabase - Insert like record
          const { error: insertError } = await supabase
            .from('user_likes')
            .insert({ user_id: userId, post_id: postId });

          if (insertError) throw insertError;

          // Increment like count
          const { error: updateError } = await supabase.rpc('increment_like_count', {
            post_id: postId
          });

          if (updateError) throw updateError;
        }

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