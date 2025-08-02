import { useEffect } from 'react';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  canonical?: string;
}

export const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    const {
      title = "Mukesh Kumar Gupta | Staff Engineer @Tekion.Corp",
      description = "Portfolio of Mukesh Kumar Gupta, Staff Engineer at Tekion.Corp specializing in distributed systems, backend architecture, Java, Spring Boot, and scalable solutions.",
      keywords = ["Mukesh Kumar Gupta", "Staff Engineer", "Tekion", "Java", "Spring Boot", "Backend", "Distributed Systems", "Software Engineer", "Portfolio"],
      image = "/og-image.jpg",
      url = window.location.href,
      type = "website",
      author = "Mukesh Kumar Gupta",
      publishedTime,
      modifiedTime,
      tags,
      canonical = window.location.href
    } = seoData;

    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string, attribute = 'content') => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const match = selector.match(/property="([^"]*)"/);
          if (match) element.setAttribute('property', match[1]);
        } else if (selector.includes('name=')) {
          const match = selector.match(/name="([^"]*)"/);
          if (match) element.setAttribute('name', match[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Basic meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords.join(', '));
    updateMetaTag('meta[name="author"]', author);

    // Privacy protection for contact information
    updateMetaTag('meta[name="robots"]', 'index, follow, noarchive, nosnippet');
    updateMetaTag('meta[name="googlebot"]', 'index, follow, noarchive, nosnippet');
    updateMetaTag('meta[name="bingbot"]', 'index, follow, noarchive, nosnippet');

    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:image"]', image);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:site_name"]', "Mukesh Kumar Gupta - Portfolio");

    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', image);
    updateMetaTag('meta[name="twitter:creator"]', '@mukeshknit57');

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('meta[property="article:published_time"]', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
      }
      if (author) {
        updateMetaTag('meta[property="article:author"]', author);
      }
      if (tags && tags.length > 0) {
        // Remove existing article:tag meta tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        // Add new tags
        tags.forEach(tag => {
          const tagMeta = document.createElement('meta');
          tagMeta.setAttribute('property', 'article:tag');
          tagMeta.setAttribute('content', tag);
          document.head.appendChild(tagMeta);
        });
      }
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // Cleanup function
    return () => {
      // Note: We don't remove meta tags on cleanup as they should persist
      // until the next page/component updates them
    };
  }, [seoData]);
};

// Helper hook for structured data
export const useStructuredData = (data: any) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';
    
    // Remove existing structured data
    const existing = document.getElementById('structured-data');
    if (existing) {
      document.head.removeChild(existing);
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [data]);
};
