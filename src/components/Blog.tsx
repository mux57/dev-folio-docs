import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();
  
  const blogPosts = [
    {
      id: 1,
      title: "Building Scalable React Applications",
      excerpt: "Learn the best practices for building large-scale React applications with proper architecture and performance optimization.",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["React", "Architecture", "Performance"],
      featured: true
    },
    {
      id: 2,
      title: "The Future of Web Development",
      excerpt: "Exploring emerging technologies and trends that will shape the future of web development in the next decade.",
      date: "2024-01-10",
      readTime: "12 min read",
      tags: ["Web Development", "Trends", "Technology"],
      featured: true
    },
    {
      id: 3,
      title: "TypeScript Best Practices",
      excerpt: "A comprehensive guide to writing better TypeScript code with advanced patterns and best practices.",
      date: "2024-01-05",
      readTime: "10 min read",
      tags: ["TypeScript", "Best Practices", "JavaScript"],
      featured: false
    },
    {
      id: 4,
      title: "Microservices with Node.js",
      excerpt: "How to design and implement microservices architecture using Node.js and modern DevOps practices.",
      date: "2023-12-28",
      readTime: "15 min read",
      tags: ["Node.js", "Microservices", "DevOps"],
      featured: false
    }
  ];

  const handleReadPost = (postId: number) => {
    navigate(`/blog/${postId}`);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {blogPosts.filter(post => post.featured).map((post) => (
            <Card key={post.id} className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-portfolio-lg group cursor-pointer" onClick={() => handleReadPost(post.id)}>
              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
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

        {/* Recent Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Card key={post.id} className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg group cursor-pointer" onClick={() => handleReadPost(post.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
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