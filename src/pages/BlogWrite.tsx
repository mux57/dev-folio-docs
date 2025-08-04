import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, X, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBlogPost } from "@/hooks/useBlogPost";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "@/components/RichTextEditor";
import CacheControl from "@/components/CacheControl";
import { AdminRoute } from "@/components/ProtectedRoute";
import { useAdminAuth } from "@/hooks/useAuth";
import { Shield, LogOut } from "lucide-react";


const BlogWrite = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { toast } = useToast();
  const { isAdmin, loading: permissionsLoading } = useUserPermissions();
  const { post, loading: postLoading } = useBlogPost(slug || '');
  const { user, signOut } = useAdminAuth();
  
  const isEditMode = Boolean(slug);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: [] as string[],
    currentTag: ""
  });

  const [isPreview, setIsPreview] = useState(false);

  // Load existing post data for editing
  useEffect(() => {
    if (isEditMode && post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content,
        tags: post.tags,
        currentTag: ""
      });
    }
  }, [isEditMode, post]);

  // Redirect if not admin (but don't show error during auth transitions)
  useEffect(() => {
    if (!permissionsLoading && !isAdmin) {
      // Only show error if user is actually authenticated but not admin
      // Don't show error during initial load or auth transitions
      if (user) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive"
        });
      }
      navigate('/blog');
    }
  }, [isAdmin, permissionsLoading, navigate, toast, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ""
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (isDraft = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the title and content.",
        variant: "destructive"
      });
      return;
    }

    // Show loading state
    const loadingToast = toast({
      title: "Saving...",
      description: "Your blog post is being saved to the database.",
    });

    try {
      // Generate slug from title if creating new post
      const generateSlug = (title: string) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      };

      const postSlug = isEditMode ? slug : generateSlug(formData.title);
      const status: 'draft' | 'published' = isDraft ? 'draft' : 'published';

      if (isEditMode && post) {
        // Update existing post

        const updateData = {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || null,
          tags: formData.tags,
          status: status,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', post.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Update error:', error);
          throw new Error(`Failed to update post: ${error.message}`);
        }

        toast({
          title: isDraft ? "Draft Saved!" : "Post Updated!",
          description: isDraft
            ? "Your draft has been saved successfully to the database."
            : "Your blog post has been updated successfully in the database.",
        });

        if (!isDraft) {
          navigate(`/blog/${postSlug}`);
        }
      } else {
        // Create new post

        const insertData = {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || null,
          slug: postSlug,
          tags: formData.tags,
          author: 'Mukesh Kumar Gupta',
          featured: false,
          status: status,
          like_count: 0,
          read_count: 0
        };

        const { data, error } = await supabase
          .from('blog_posts')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('❌ Insert error:', error);
          throw new Error(`Failed to create post: ${error.message}`);
        }

        toast({
          title: isDraft ? "Draft Saved!" : "Post Created!",
          description: isDraft
            ? "Your draft has been saved successfully to the database."
            : "Your blog post has been created and published to the database.",
        });

        if (!isDraft) {
          navigate(`/blog/${postSlug}`);
        } else {
          navigate('/blog');
        }
      }
    } catch (error: any) {
      console.error('❌ Error saving post:', error);

      // Provide specific error messages
      let errorMessage = "There was an error saving your post. Please try again.";

      if (error.message?.includes('duplicate key')) {
        errorMessage = "A post with this title already exists. Please choose a different title.";
      } else if (error.message?.includes('permission')) {
        errorMessage = "You don't have permission to save posts. Please check your authentication.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.currentTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Show loading while checking permissions or loading post data
  if (permissionsLoading || (isEditMode && postLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-8 w-32"></div>
              <div className="h-12 bg-muted rounded mb-6"></div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Don't render if not admin (will be redirected)
  if (!isAdmin) {
    return null;
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
            <Button 
              onClick={() => navigate('/blog')} 
              variant="ghost" 
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Button>
            
            <div className="flex items-center gap-3">
              {/* Admin indicator */}
              <div className="flex items-center gap-2">
                <Badge variant="default" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
                <span className="text-sm text-muted-foreground">{user?.email}</span>
                <CacheControl variant="minimal" />
                <Button
                  onClick={async () => {
                    try {
                      await signOut();
                      toast({
                        title: "Signed out successfully",
                        description: "You have been logged out.",
                      });
                      navigate('/blog');
                    } catch (error) {
                      // Even if sign out fails, redirect to blog page
                      // since the user intent is clear
                      navigate('/blog');
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-6 w-px bg-border" />

              <Button
                onClick={() => setIsPreview(!isPreview)}
                variant="outline"
                className="group"
              >
                <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                onClick={() => handleSave(true)}
                variant="outline"
                className="group"
              >
                <FileText className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave(false)}
                variant="hero"
                className="group"
              >
                <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                {isEditMode ? 'Update Post' : 'Publish Post'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {isPreview ? 'Preview' : (isEditMode ? 'Edit Post' : 'Write New Post')}
                  </CardTitle>
                  <CardDescription>
                    {isPreview 
                      ? 'Preview how your post will look' 
                      : (isEditMode ? 'Edit your existing blog post' : 'Create a new blog post')
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isPreview ? (
                    <>
                      {/* Title Input */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Post Title
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter your post title..."
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="bg-background border-border text-lg"
                        />
                      </div>

                      {/* Excerpt Input */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Excerpt (Optional)
                        </label>
                        <Textarea
                          placeholder="Brief description of your post..."
                          value={formData.excerpt}
                          onChange={(e) => handleInputChange('excerpt', e.target.value)}
                          className="bg-background border-border resize-none h-20"
                        />
                      </div>

                      {/* Content Input - Rich Text Editor */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Content
                        </label>
                        <RichTextEditor
                          value={formData.content}
                          onChange={(value) => handleInputChange('content', value)}
                          placeholder="Write your post content here..."
                          className="bg-background border-border"
                        />
                      </div>
                    </>
                  ) : (
                    /* Preview Mode */
                    <div className="prose prose-lg prose-invert max-w-none">
                      <h1 className="text-3xl font-bold text-foreground mb-4">
                        {formData.title || 'Your Post Title'}
                      </h1>
                      {formData.excerpt && (
                        <p className="text-lg text-muted-foreground italic mb-6">
                          {formData.excerpt}
                        </p>
                      )}
                      <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {formData.content || 'Your post content will appear here...'}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Tags Section */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                  <CardDescription>
                    Add tags to help categorize your post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Add a tag..."
                        value={formData.currentTag}
                        onChange={(e) => handleInputChange('currentTag', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && formData.currentTag.trim()) {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="bg-background border-border"
                      />
                      <Button 
                        onClick={handleAddTag} 
                        variant="outline" 
                        size="sm"
                        disabled={!formData.currentTag.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="group cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag}
                          <X className="ml-1 h-3 w-3 group-hover:scale-110 transition-transform" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </main>
    </div>
    </AdminRoute>
  );
};

export default BlogWrite;