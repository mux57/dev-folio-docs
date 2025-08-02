// Sitemap generation utility for SEO
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://mukeshkumargupta.dev';
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: baseUrl,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 1.0
  });

  urls.push({
    loc: `${baseUrl}/blog`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.8
  });

  // NOTE: Deliberately NOT including /contact route to protect PII
  // Contact information is protected and should not be crawled

  // Fetch blog posts for dynamic URLs
  try {
    const response = await fetch('/api/blog_posts');
    if (response.ok) {
      const { data: posts } = await response.json();

      if (posts && Array.isArray(posts)) {
        posts.forEach((post: any) => {
          if (post.slug && post.updated_at) {
            urls.push({
              loc: `${baseUrl}/blog/${post.slug}`,
              lastmod: new Date(post.updated_at).toISOString(),
              changefreq: 'monthly',
              priority: 0.7
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    // Continue with static pages even if blog posts fail
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Function to download sitemap
export const downloadSitemap = async () => {
  try {
    const sitemapXml = await generateSitemap();
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return false;
  }
};

// Robots.txt content
export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://mukeshkumargupta.dev';

  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block sensitive information and admin areas
Disallow: /admin/
Disallow: /api/

# CRITICAL: Block ALL contact routes containing PII
Disallow: /contact/
Disallow: /contact
Disallow: /*contact*
Disallow: /*Contact*
Disallow: /get-in-touch/
Disallow: /*contact-details*
Disallow: /*phone*
Disallow: /*email*
Disallow: /*personal-info*
Disallow: /*tel:*
Disallow: /*mailto:*

# Block specific contact form data
Disallow: /contact/submit
Disallow: /contact/form
Disallow: /contact/personal
Disallow: /contact/details

# Allow important pages ONLY (no contact)
Allow: /blog/
Allow: /projects/
Allow: /about/

# Block crawling of contact information patterns
User-agent: *
Disallow: *tel:*
Disallow: *mailto:*
Disallow: *phone*
Disallow: *email*
Disallow: *contact*

# Specific bot restrictions for contact info
User-agent: Googlebot
Disallow: /contact/
Disallow: /*contact*

User-agent: Bingbot
Disallow: /contact/
Disallow: /*contact*

User-agent: facebookexternalhit
Disallow: /contact/
Disallow: /*contact*

User-agent: Twitterbot
Disallow: /contact/
Disallow: /*contact*

# Additional privacy protection
Noindex: /contact/
Noindex: /contact/personal
Noindex: /contact/details`;
};

// Function to download robots.txt
export const downloadRobotsTxt = () => {
  try {
    const robotsContent = generateRobotsTxt();
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return false;
  }
};
