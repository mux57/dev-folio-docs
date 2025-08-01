import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBlogPost } from "@/hooks/useBlogPost";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import Header from "@/components/Header";

const BlogWrite = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { toast } = useToast();
  const { isAdmin, loading: permissionsLoading } = useUserPermissions();
  const { post, loading: postLoading } = useBlogPost(slug || '');
  
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

  // Redirect if not admin
  useEffect(() => {
    if (!permissionsLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate('/blog');
    }
  }, [isAdmin, permissionsLoading, navigate, toast]);

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

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the title and content.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to a database
    toast({
      title: isEditMode ? "Post Updated!" : "Post Saved!",
      description: isEditMode 
        ? "Your blog post has been updated successfully." 
        : "Your blog post has been saved successfully.",
    });
    
    // Simulate navigation to the post
    setTimeout(() => {
      if (isEditMode && slug) {
        navigate(`/blog/${slug}`);
      } else {
        navigate('/blog');
      }
    }, 1000);
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
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsPreview(!isPreview)} 
                variant="outline"
                className="group"
              >
                <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button 
                onClick={handleSave} 
                variant="hero"
                className="group"
              >
                <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                {isEditMode ? 'Update Post' : 'Save Post'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
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

                      {/* Content Input */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Content
                        </label>
                        <Textarea
                          placeholder="Write your post content here..."
                          value={formData.content}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                          className="bg-background border-border resize-none min-h-96"
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
            <div className="space-y-6">
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
                        onKeyPress={handleKeyPress}
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

              {/* Publishing Tips */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Publishing Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Use a clear, descriptive title</li>
                    <li>• Write an engaging excerpt to draw readers</li>
                    <li>• Add relevant tags for better discoverability</li>
                    <li>• Use preview mode to check formatting</li>
                    <li>• Keep paragraphs short for better readability</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogWrite;