import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import DatabaseToggle from "@/components/DatabaseToggle";
import DatabaseDebug from "@/components/DatabaseDebug";

const Index = () => {
  useEffect(() => {
    // SEO optimization
    document.title = "Staff Engineer @Tekion.Corp | Portfolio";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Portfolio of a Staff Engineer at Tekion.Corp passionate about backend development, distributed systems, architecture, and scalability. Specializing in Java, Spring Boot, and high-performance solutions.');
    }

    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'software engineer, full stack developer, React, Node.js, TypeScript, portfolio, web development, blog';
    document.head.appendChild(metaKeywords);

    // Structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Staff Engineer",
      "jobTitle": "Backend Staff Engineer @Tekion.Corp",
      "description": "Backend Staff Engineer at Tekion.Corp passionate about distributed systems, architecture, scalability, Java and Spring Boot",
      "url": window.location.origin,
      "sameAs": [
        "https://github.com/username",
        "https://linkedin.com/in/username"
      ],
      "knowsAbout": ["Java", "Spring Boot", "Distributed Systems", "Backend Architecture", "Scalability", "System Design"],
      "alumniOf": "Computer Science",
      "worksFor": {
        "@type": "Organization",
        "name": "Tekion.Corp"
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
      <Education />
      <Projects />
      <Blog />
      <Contact />
      <DatabaseToggle />
      <DatabaseDebug />
    </div>
  );
};

export default Index;
