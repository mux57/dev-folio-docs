import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import DatabaseToggle from "@/components/DatabaseToggle";
import DatabaseDebug from "@/components/DatabaseDebug";

const Index = () => {
  useEffect(() => {
    // SEO optimization
    document.title = "Software Engineer Portfolio | Full Stack Developer";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Portfolio of a passionate full-stack software engineer specializing in React, Node.js, and modern web technologies. View projects, blog posts, and get in touch.');
    }

    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'software engineer, full stack developer, React, Node.js, TypeScript, portfolio, web development, blog';
    document.head.appendChild(metaKeywords);

    // Structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Software Engineer",
      "jobTitle": "Full Stack Developer",
      "description": "Passionate full-stack software engineer specializing in React, Node.js, and modern web technologies",
      "url": window.location.origin,
      "sameAs": [
        "https://github.com/username",
        "https://linkedin.com/in/username"
      ],
      "knowsAbout": ["React", "Node.js", "TypeScript", "JavaScript", "Python", "Web Development"],
      "alumniOf": "Computer Science",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(metaKeywords);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <TechStack />
      <Projects />
      <Blog />
      <Contact />
      <DatabaseToggle />
      <DatabaseDebug />
    </div>
  );
};

export default Index;
