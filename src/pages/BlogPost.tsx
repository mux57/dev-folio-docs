import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Download, Eye, Edit, Heart } from "lucide-react";
import Header from "@/components/Header";
import { ShareMenu } from "@/components/ShareMenu";
import { useBlogPost, useLikeBlogPost } from "@/hooks/useBlogPost";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { generateBlogPDF } from "@/utils/blogPdf";
import { useToast } from "@/hooks/use-toast";
import { useSEO, useStructuredData } from "@/hooks/useSEO";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: permissionsLoading } = useUserPermissions();

  // Convert old numeric IDs to slugs for compatibility
  const getSlugFromId = (id: string) => {
    const slugMap: Record<string, string> = {
      '1': 'building-scalable-react-applications',
      '2': 'the-future-of-web-development'
    };
    return slugMap[id] || id;
  };

  const slug = getSlugFromId(id || '');
  const { post, loading, error } = useBlogPost(slug);
  const { toggleLike, isLiking, userLikes, checkUserLike } = useLikeBlogPost();
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);

  // SEO optimization for blog post
  const stripHtml = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // Prepare SEO data (always call hooks, but with conditional data)
  const seoData = post && !loading && !error ? {
    description: post.excerpt || stripHtml(post.content).substring(0, 160) + '...',
    publishedTime: new Date(post.created_at).toISOString(),
    modifiedTime: new Date(post.updated_at).toISOString(),
    title: `${post.title} | Mukesh Kumar Gupta Blog`,
    keywords: [...(post.tags || []), "Mukesh Kumar Gupta", "Blog", "Software Engineering"],
    tags: post.tags || [],
    author: post.author || "Mukesh Kumar Gupta"
  } : {
    description: "Blog post loading...",
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    title: "Blog Post | Mukesh Kumar Gupta",
    keywords: ["Mukesh Kumar Gupta", "Blog", "Software Engineering"],
    tags: [],
    author: "Mukesh Kumar Gupta"
  };

  // Always call hooks (never conditionally)
  useSEO({
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    type: "article",
    author: seoData.author,
    publishedTime: seoData.publishedTime,
    modifiedTime: seoData.modifiedTime,
    tags: seoData.tags,
    url: window.location.href,
    canonical: window.location.href
  });

  // Always call structured data hook
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post?.title || "Blog Post",
    "description": seoData.description,
    "image": "https://mukeshkumargupta.dev/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": seoData.author,
      "url": "https://mukeshkumargupta.dev/"
    },
    "publisher": {
      "@type": "Person",
      "name": "Mukesh Kumar Gupta",
      "url": "https://mukeshkumargupta.dev/"
    },
    "datePublished": seoData.publishedTime,
    "dateModified": seoData.modifiedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "keywords": seoData.tags.join(", "),
    "articleSection": "Technology",
    "inLanguage": "en-US"
  });

  // Initialize like count and check user like status
  useEffect(() => {
    if (post) {
      setCurrentLikeCount(post.like_count);
    }
  }, [post]);

  // Check if user has liked this post on component mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (post?.id) {
        const liked = userLikes[post.id] ?? await checkUserLike(post.id);
        setHasUserLiked(liked);
      }
    };

    checkLikeStatus();
  }, [post?.id, userLikes, checkUserLike]);

  // Handle like/unlike functionality
  const handleToggleLike = async () => {
    if (!post || isLiking) return; // Prevent multiple clicks

    try {
      const result = await toggleLike(post.id);
      if (result.success) {
        // Update local state immediately for instant feedback
        const newLikedState = result.action === 'liked';
        setHasUserLiked(newLikedState);
        setCurrentLikeCount(prev => prev + (result.likeChange || 0));

        toast({
          title: result.action === 'liked' ? "Post Liked!" : "Post Unliked!",
          description: result.action === 'liked'
            ? "Thank you for liking this post!"
            : "Post removed from your likes.",
        });
      }
    } catch (error) {
      console.error('Like toggle error:', error);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-8 w-32"></div>
              <div className="h-12 bg-muted rounded mb-6"></div>
              <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-muted rounded mb-8 w-1/2"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                {error || "Post Not Found"}
              </h1>
              <Button onClick={() => navigate('/blog')} variant="default">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      const success = await generateBlogPDF({
        title: post.title,
        content: post.content,
        author: post.author,
        date: post.created_at,
        tags: post.tags,
        readTime: `${Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read`
      });
      
      if (success) {
        toast({
          title: "PDF Downloaded!",
          description: "The blog post has been saved as a PDF.",
        });
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = () => {
    navigate(`/blog/edit/${slug}`);
  };

  const shareData = {
    title: post.title,
    text: post.excerpt || `Read this insightful blog post about ${post.title}`,
    url: window.location.href
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Navigation */}
          <Button 
            onClick={() => navigate('/blog')} 
            variant="ghost" 
            className="mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {post.read_count} reads
              </div>
              <div className="flex items-center gap-2">
                By {post.author}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleToggleLike}
                  variant={hasUserLiked ? "default" : "outline"}
                  size="sm"
                  className="group"
                  disabled={isLiking}
                >
                  <Heart className={`mr-2 h-4 w-4 group-hover:scale-110 transition-transform ${hasUserLiked ? 'fill-current' : ''}`} />
                  {currentLikeCount} {currentLikeCount === 1 ? 'Like' : 'Likes'}
                </Button>
                {isAdmin && (
                  <Button
                    onClick={handleEditPost}
                    variant="outline"
                    size="sm"
                    className="group"
                  >
                    <Edit className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Edit
                  </Button>
                )}
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  size="sm"
                  className="group"
                >
                  <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  PDF
                </Button>
                <ShareMenu
                  shareData={shareData}
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                lineHeight: '1.8',
              }}
            />
          </article>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="text-center">
              <p className="text-muted-foreground">
                Thanks for reading! I hope you found this post helpful and insightful.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Use the action buttons above to like, share, or download this post.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;