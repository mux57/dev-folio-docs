import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RefreshCw, Database, Trash2, ChevronDown } from 'lucide-react';
import { useCache, type CacheKey } from '@/hooks/useCache';
import { useToast } from '@/hooks/use-toast';

interface CacheControlProps {
  variant?: 'button' | 'card' | 'minimal';
  showStats?: boolean;
}

const CacheControl = ({ variant = 'button', showStats = false }: CacheControlProps) => {
  const { 
    refreshCache, 
    refreshAllCaches, 
    clearCache, 
    clearAllCaches, 
    getCacheStatus, 
    cacheStats, 
    CACHE_KEYS 
  } = useCache();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await refreshAllCaches();
      toast({
        title: "Cache refreshed",
        description: "All cached data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh cache. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefreshSpecific = async (key: CacheKey) => {
    try {
      await refreshCache(key);
      toast({
        title: "Cache refreshed",
        description: `${key} cache has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: `Failed to refresh ${key} cache.`,
        variant: "destructive",
      });
    }
  };

  const handleClearAll = () => {
    clearAllCaches();
    toast({
      title: "Cache cleared",
      description: "All cached data has been removed.",
    });
  };

  const formatCacheKey = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  if (variant === 'minimal') {
    return (
      <Button
        onClick={handleRefreshAll}
        disabled={isRefreshing}
        variant="ghost"
        size="sm"
        className="h-8 px-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    );
  }

  if (variant === 'card') {
    return (
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cache Control
              </CardTitle>
              <CardDescription>
                Manage cached data to improve performance
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {cacheStats.hitRate}% hit rate
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showStats && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg">{cacheStats.totalQueries}</div>
                <div className="text-muted-foreground">Total Queries</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{cacheStats.cachedQueries}</div>
                <div className="text-muted-foreground">Cached</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{cacheStats.hitRate}%</div>
                <div className="text-muted-foreground">Hit Rate</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {CACHE_KEYS.map((key) => {
              const status = getCacheStatus(key);
              return (
                <div key={key} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatCacheKey(key)}</span>
                    <Badge variant={status.isCached ? 'default' : 'secondary'} className="text-xs">
                      {status.isCached ? (status.isStale ? 'Stale' : 'Fresh') : 'Empty'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleRefreshSpecific(key)}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => clearCache(key)}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="flex-1"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default button variant with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          Cache
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleRefreshAll} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClearAll}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {CACHE_KEYS.map((key) => (
          <DropdownMenuItem key={key} onClick={() => handleRefreshSpecific(key)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh {formatCacheKey(key)}
          </DropdownMenuItem>
        ))}
        {showStats && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Hit Rate: {cacheStats.hitRate}% ({cacheStats.cachedQueries}/{cacheStats.totalQueries})
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CacheControl;
