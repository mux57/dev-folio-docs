import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPost";

const Blog = () => {
  const navigate = useNavigate();
  const { data: posts = [], isLoading: loading } = useBlogPosts();

  const handleReadPost = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const handleWritePost = () => {
    navigate('/blog/write');
  };

  const handleViewAllPosts = () => {
    navigate('/blog');
  };

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Latest Blog Posts</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Sharing insights, tutorials, and thoughts on software development and technology
          </p>
          <Button onClick={handleWritePost} variant="hero" size="lg" className="group">
            <Edit className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Write New Post
          </Button>
        </div>

        {/* Featured Posts */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse bg-gradient-card border-border">
                <CardHeader>
                  <div className="h-4 bg-muted rounded mb-3 w-1/3"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {posts.filter(post => post.featured).map((post) => (
              <Card key={post.id} className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-portfolio-lg group cursor-pointer" onClick={() => handleReadPost(post.slug)}>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.read_count}
                    </div>
                  </div>
                  <CardTitle className="text-foreground group-hover:text-primary transition-colors text-xl">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary group/btn">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recent Posts */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse bg-gradient-card border-border">
                <CardHeader className="pb-3">
                  <div className="h-3 bg-muted rounded mb-2 w-1/4"></div>
                  <div className="h-5 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-1 mb-3">
                    <div className="h-5 bg-muted rounded w-12"></div>
                    <div className="h-5 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {posts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg group cursor-pointer" onClick={() => handleReadPost(post.slug)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.read_count}
                    </div>
                  </div>
                  <CardTitle className="text-foreground group-hover:text-primary transition-colors text-lg">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="border-primary/20 text-primary text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="outline" className="border-primary/20 text-primary text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary text-sm group/btn">
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button onClick={handleViewAllPosts} variant="outline" size="lg" className="group">
            View All Posts
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;