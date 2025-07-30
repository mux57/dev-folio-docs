import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, ArrowRight, Edit, Search } from "lucide-react";
import Header from "@/components/Header";

const BlogList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const allPosts = [
    {
      id: 1,
      title: "Building Scalable React Applications",
      excerpt: "Learn the best practices for building large-scale React applications with proper architecture and performance optimization.",
      content: "Full content here...",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["React", "Architecture", "Performance"],
      featured: true
    },
    {
      id: 2,
      title: "The Future of Web Development",
      excerpt: "Exploring emerging technologies and trends that will shape the future of web development in the next decade.",
      content: "Full content here...",
      date: "2024-01-10",
      readTime: "12 min read",
      tags: ["Web Development", "Trends", "Technology"],
      featured: true
    },
    {
      id: 3,
      title: "TypeScript Best Practices",
      excerpt: "A comprehensive guide to writing better TypeScript code with advanced patterns and best practices.",
      content: "Full content here...",
      date: "2024-01-05",
      readTime: "10 min read",
      tags: ["TypeScript", "Best Practices", "JavaScript"],
      featured: false
    },
    {
      id: 4,
      title: "Microservices with Node.js",
      excerpt: "How to design and implement microservices architecture using Node.js and modern DevOps practices.",
      content: "Full content here...",
      date: "2023-12-28",
      readTime: "15 min read",
      tags: ["Node.js", "Microservices", "DevOps"],
      featured: false
    },
    {
      id: 5,
      title: "Modern CSS Techniques",
      excerpt: "Discover the latest CSS features and techniques for creating beautiful, responsive designs.",
      content: "Full content here...",
      date: "2023-12-20",
      readTime: "7 min read",
      tags: ["CSS", "Design", "Frontend"],
      featured: false
    }
  ];

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReadPost = (postId: number) => {
    navigate(`/blog/${postId}`);
  };

  const handleWritePost = () => {
    navigate('/blog/write');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Blog Posts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Insights, tutorials, and thoughts on software development and technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Button onClick={handleWritePost} variant="hero" size="lg" className="group">
                <Edit className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Write New Post
              </Button>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-portfolio-lg group cursor-pointer h-full flex flex-col"
                onClick={() => handleReadPost(post.id)}
              >
                <CardHeader className="flex-1">
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
                  <CardTitle className="text-foreground group-hover:text-primary transition-colors text-xl mb-3">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed flex-1">
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

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No posts found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogList;