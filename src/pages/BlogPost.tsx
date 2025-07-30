import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import Header from "@/components/Header";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock blog post data - in a real app, this would come from an API
  const blogPosts = {
    "1": {
      title: "Building Scalable React Applications",
      content: `
        <h2>Introduction</h2>
        <p>Building scalable React applications requires careful planning and architecture decisions. In this comprehensive guide, we'll explore the best practices and patterns that have proven successful in large-scale applications.</p>
        
        <h2>Component Architecture</h2>
        <p>The foundation of any scalable React application lies in its component architecture. Here are the key principles:</p>
        <ul>
          <li><strong>Single Responsibility Principle:</strong> Each component should have a single, well-defined purpose</li>
          <li><strong>Composition over Inheritance:</strong> Build complex UIs by composing smaller, reusable components</li>
          <li><strong>Props Interface Design:</strong> Design clear and consistent props interfaces</li>
        </ul>

        <h2>State Management</h2>
        <p>For large applications, choosing the right state management solution is crucial:</p>
        <ul>
          <li><strong>Context API:</strong> Perfect for application-wide state like themes and user authentication</li>
          <li><strong>Redux Toolkit:</strong> Ideal for complex state logic and time-travel debugging</li>
          <li><strong>Zustand:</strong> Lightweight alternative for simpler state management needs</li>
        </ul>

        <h2>Performance Optimization</h2>
        <p>Performance becomes critical as your application grows. Key strategies include:</p>
        <ul>
          <li>Code splitting with React.lazy() and Suspense</li>
          <li>Memoization with React.memo, useMemo, and useCallback</li>
          <li>Virtual scrolling for large lists</li>
          <li>Image optimization and lazy loading</li>
        </ul>

        <h2>Testing Strategy</h2>
        <p>A comprehensive testing strategy should include:</p>
        <ul>
          <li>Unit tests for individual components</li>
          <li>Integration tests for component interactions</li>
          <li>End-to-end tests for critical user flows</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Building scalable React applications is an iterative process that requires continuous learning and adaptation. By following these principles and patterns, you'll be well-equipped to handle the challenges of large-scale development.</p>
      `,
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["React", "Architecture", "Performance"],
      author: "Software Engineer"
    },
    "2": {
      title: "The Future of Web Development",
      content: `
        <h2>The Evolution Continues</h2>
        <p>Web development is in a constant state of evolution, with new technologies and approaches emerging regularly. Let's explore what the next decade might hold for our industry.</p>

        <h2>Emerging Technologies</h2>
        <h3>WebAssembly (WASM)</h3>
        <p>WebAssembly is revolutionizing web performance by allowing near-native execution speeds in browsers. We're seeing increased adoption for computationally intensive tasks.</p>

        <h3>Edge Computing</h3>
        <p>Edge computing is bringing computation closer to users, reducing latency and improving user experience. Frameworks like Next.js are already embracing edge functions.</p>

        <h2>Development Trends</h2>
        <ul>
          <li><strong>JAMstack Evolution:</strong> Static site generation continues to mature with improved dynamic capabilities</li>
          <li><strong>Micro-frontends:</strong> Breaking down monolithic frontends into manageable pieces</li>
          <li><strong>No-code/Low-code:</strong> Democratizing development while requiring new skills from traditional developers</li>
        </ul>

        <h2>The AI Revolution</h2>
        <p>Artificial Intelligence is transforming how we write code:</p>
        <ul>
          <li>AI-powered code completion and generation</li>
          <li>Automated testing and debugging</li>
          <li>Intelligent design systems</li>
        </ul>

        <h2>Preparing for the Future</h2>
        <p>To stay relevant in this rapidly evolving landscape:</p>
        <ul>
          <li>Focus on fundamental concepts that transcend specific technologies</li>
          <li>Develop strong problem-solving skills</li>
          <li>Stay curious and embrace continuous learning</li>
          <li>Build a diverse skill set spanning multiple domains</li>
        </ul>
      `,
      date: "2024-01-10",
      readTime: "12 min read",
      tags: ["Web Development", "Trends", "Technology"],
      author: "Software Engineer"
    }
  };

  const post = blogPosts[id as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => navigate('/blog')} variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
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
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
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
              <Button 
                onClick={handleShare} 
                variant="outline" 
                size="sm" 
                className="group"
              >
                <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Share
              </Button>
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
                Thanks for reading! Share your thoughts in the comments.
              </p>
              <Button onClick={handleShare} variant="default" className="group">
                <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Share this post
              </Button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;