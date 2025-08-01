import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Eye, EyeOff } from "lucide-react";
import { useResumeLinks } from "@/hooks/useResumeLinks";

const DatabaseDebug = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: resumeLinks, isLoading, error } = useResumeLinks();

  const getLocalStorageData = () => {
    return {
      resume_links: JSON.parse(localStorage.getItem('sqlite_resume_links') || '[]'),
      blog_posts: JSON.parse(localStorage.getItem('sqlite_blog_posts') || '[]'),
      profiles: JSON.parse(localStorage.getItem('sqlite_profiles') || '[]'),
      user_preferences: JSON.parse(localStorage.getItem('sqlite_user_preferences') || '[]'),
    };
  };

  const localData = getLocalStorageData();

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="gap-2"
        >
          <Database className="h-4 w-4" />
          Debug DB
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              SQLite Database Debug
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          {/* Resume Links */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">resume_links</Badge>
              <span className="text-muted-foreground">
                ({localData.resume_links.length} records)
              </span>
            </div>
            
            {/* Hook Data */}
            <div className="mb-2">
              <strong>Hook Status:</strong>
              {isLoading && <Badge variant="outline">Loading...</Badge>}
              {error && <Badge variant="destructive">Error</Badge>}
              {resumeLinks && <Badge variant="default">✅ Loaded</Badge>}
            </div>

            {/* Resume Links Data */}
            {localData.resume_links.map((link: any, index: number) => (
              <div key={index} className="bg-muted p-2 rounded text-xs mb-2">
                <div><strong>Name:</strong> {link.name}</div>
                <div><strong>URL:</strong> {link.file_url.substring(0, 50)}...</div>
                <div><strong>Active:</strong> {link.is_active ? '✅' : '❌'}</div>
                <div><strong>Type:</strong> {link.file_type}</div>
              </div>
            ))}
          </div>

          {/* Blog Posts */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">blog_posts</Badge>
              <span className="text-muted-foreground">
                ({localData.blog_posts.length} records)
              </span>
            </div>
            {localData.blog_posts.slice(0, 2).map((post: any, index: number) => (
              <div key={index} className="bg-muted p-2 rounded text-xs mb-1">
                <div><strong>Title:</strong> {post.title}</div>
                <div><strong>Slug:</strong> {post.slug}</div>
              </div>
            ))}
          </div>

          {/* User Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">user_preferences</Badge>
              <span className="text-muted-foreground">
                ({localData.user_preferences.length} records)
              </span>
            </div>
            {localData.user_preferences.map((pref: any, index: number) => (
              <div key={index} className="bg-muted p-2 rounded text-xs mb-1">
                <div><strong>User:</strong> {pref.user_id}</div>
                <div><strong>Theme:</strong> {pref.theme}</div>
              </div>
            ))}
          </div>

          {/* Profiles */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">profiles</Badge>
              <span className="text-muted-foreground">
                ({localData.profiles.length} records)
              </span>
            </div>
            {localData.profiles.map((profile: any, index: number) => (
              <div key={index} className="bg-muted p-2 rounded text-xs mb-1">
                <div><strong>Name:</strong> {profile.full_name}</div>
                <div><strong>Email:</strong> {profile.email}</div>
              </div>
            ))}
          </div>

          {/* Environment Info */}
          <div className="pt-2 border-t">
            <Badge variant="outline" className="text-xs">
              Environment: {window.location.hostname === 'localhost' ? 'Local SQLite' : 'Production Supabase'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseDebug;
