import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Cache configuration
const CACHE_CONFIG = {
  blogPosts: {
    key: 'blog-posts',
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
  userPreferences: {
    key: 'user-preferences',
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  },
  resumeLinks: {
    key: 'resume-links',
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  },
  blogPost: {
    key: 'blog-post',
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
} as const;

export type CacheKey = keyof typeof CACHE_CONFIG;

interface CacheStats {
  totalQueries: number;
  cachedQueries: number;
  hitRate: number;
  lastRefresh: Date | null;
}

export const useCache = () => {
  const queryClient = useQueryClient();
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalQueries: 0,
    cachedQueries: 0,
    hitRate: 0,
    lastRefresh: null,
  });

  // Get cache configuration for a specific key
  const getCacheConfig = useCallback((key: CacheKey) => {
    return CACHE_CONFIG[key];
  }, []);

  // Refresh specific cache
  const refreshCache = useCallback(async (key: CacheKey) => {
    const config = getCacheConfig(key);
    await queryClient.invalidateQueries({ queryKey: [config.key] });
    
    setCacheStats(prev => ({
      ...prev,
      lastRefresh: new Date(),
    }));

    if (import.meta.env.DEV) {
      console.log(`🔄 Cache refreshed: ${key}`);
    }
  }, [queryClient, getCacheConfig]);

  // Refresh all caches
  const refreshAllCaches = useCallback(async () => {
    const promises = Object.keys(CACHE_CONFIG).map(key => 
      refreshCache(key as CacheKey)
    );
    
    await Promise.all(promises);
    
    if (import.meta.env.DEV) {
      console.log('🔄 All caches refreshed');
    }
  }, [refreshCache]);

  // Clear specific cache
  const clearCache = useCallback((key: CacheKey) => {
    const config = getCacheConfig(key);
    queryClient.removeQueries({ queryKey: [config.key] });
    
    if (import.meta.env.DEV) {
      console.log(`🗑️ Cache cleared: ${key}`);
    }
  }, [queryClient, getCacheConfig]);

  // Clear all caches
  const clearAllCaches = useCallback(() => {
    queryClient.clear();
    setCacheStats({
      totalQueries: 0,
      cachedQueries: 0,
      hitRate: 0,
      lastRefresh: new Date(),
    });
    
    if (import.meta.env.DEV) {
      console.log('🗑️ All caches cleared');
    }
  }, [queryClient]);

  // Get cache status for a specific key
  const getCacheStatus = useCallback((key: CacheKey) => {
    const config = getCacheConfig(key);
    const queryState = queryClient.getQueryState([config.key]);
    
    return {
      isCached: !!queryState?.data,
      isStale: queryState ? Date.now() - queryState.dataUpdatedAt > config.staleTime : true,
      lastFetched: queryState?.dataUpdatedAt ? new Date(queryState.dataUpdatedAt) : null,
      fetchCount: queryState?.fetchFailureCount || 0,
    };
  }, [queryClient, getCacheConfig]);

  // Update cache stats
  useEffect(() => {
    const updateStats = () => {
      const allQueries = queryClient.getQueryCache().getAll();
      const totalQueries = allQueries.length;
      const cachedQueries = allQueries.filter(query => query.state.data).length;
      const hitRate = totalQueries > 0 ? (cachedQueries / totalQueries) * 100 : 0;

      setCacheStats(prev => ({
        ...prev,
        totalQueries,
        cachedQueries,
        hitRate: Math.round(hitRate),
      }));
    };

    // Update stats every 30 seconds
    const interval = setInterval(updateStats, 30000);
    updateStats(); // Initial update

    return () => clearInterval(interval);
  }, [queryClient]);

  return {
    // Cache operations
    refreshCache,
    refreshAllCaches,
    clearCache,
    clearAllCaches,
    
    // Cache info
    getCacheConfig,
    getCacheStatus,
    cacheStats,
    
    // Cache keys
    CACHE_KEYS: Object.keys(CACHE_CONFIG) as CacheKey[],
  };
};

// Global cache functions for debugging (development only)
if (import.meta.env.DEV) {
  (window as any).cacheDebug = {
    refresh: (key?: string) => {
      const event = new CustomEvent('cache-refresh', { detail: key });
      window.dispatchEvent(event);
    },
    clear: (key?: string) => {
      const event = new CustomEvent('cache-clear', { detail: key });
      window.dispatchEvent(event);
    },
    stats: () => {
      const event = new CustomEvent('cache-stats');
      window.dispatchEvent(event);
    },
  };
}
