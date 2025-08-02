
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import DatabaseToggle from "@/components/DatabaseToggle";
import DatabaseDebug from "@/components/DatabaseDebug";
import SEOTools from "@/components/SEOTools";
import { useSEO, useStructuredData } from "@/hooks/useSEO";
import { usePerformance, preloadCriticalResources } from "@/hooks/usePerformance";

const Index = () => {
  // Performance monitoring for Core Web Vitals
  usePerformance();
  preloadCriticalResources();

  // SEO optimization using the new hook
  useSEO({
    title: "Mukesh Kumar Gupta | Staff Engineer @Tekion.Corp | Portfolio",
    description: "Portfolio of Mukesh Kumar Gupta, Staff Engineer at Tekion.Corp passionate about backend development, distributed systems, architecture, and scalability. Specializing in Java, Spring Boot, and high-performance solutions.",
    keywords: ["Mukesh Kumar Gupta", "Staff Engineer", "Tekion", "Java", "Spring Boot", "Backend", "Distributed Systems", "Software Engineer", "Portfolio", "Bengaluru"],
    type: "website",
    author: "Mukesh Kumar Gupta",
    image: "https://mukeshkumargupta.dev/og-image.jpg",
    url: "https://mukeshkumargupta.dev/"
  });

  // Enhanced structured data (without sensitive contact info)
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mukesh Kumar Gupta",
    "jobTitle": "Staff Engineer",
    "description": "Staff Engineer at Tekion.Corp passionate about distributed systems, architecture, scalability, Java and Spring Boot",
    "url": "https://mukeshkumargupta.dev/",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://github.com/mux57",
      "https://www.linkedin.com/in/mukeshknit57/",
      "https://twitter.com/mukeshknit57"
    ],
    "knowsAbout": ["Java", "Spring Boot", "Distributed Systems", "Backend Architecture", "Scalability", "System Design", "Microservices", "Cloud Computing"],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Computer Science Engineering"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Tekion.Corp",
      "url": "https://tekion.com"
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Staff Engineer",
      "occupationLocation": {
        "@type": "City",
        "name": "Bengaluru"
      }
    }
  });

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
      <SEOTools />
    </div>
  );
};

export default Index;
