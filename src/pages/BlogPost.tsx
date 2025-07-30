import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Download, Eye } from "lucide-react";
import Header from "@/components/Header";
import { ShareMenu } from "@/components/ShareMenu";
import { useBlogPost } from "@/hooks/useBlogPost";
import { generateBlogPDF } from "@/utils/blogPdf";
import { useToast } from "@/hooks/use-toast";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-muted-foreground">
                Thanks for reading! Share your thoughts and download as PDF.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleDownloadPDF} variant="outline" className="group">
                  <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Download PDF
                </Button>
                <ShareMenu 
                  shareData={shareData}
                  variant="default"
                />
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;