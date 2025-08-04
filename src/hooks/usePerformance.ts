import { useEffect } from 'react';

// Core Web Vitals monitoring for SEO
export const usePerformance = () => {
  useEffect(() => {
    // Measure and report Core Web Vitals
    const measureCoreWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];

            // Send data to analytics
            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'web_vitals', {
                name: 'LCP',
                value: Math.round(lastEntry.startTime),
                event_category: 'Performance'
              });
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const fidEntry = entry as any; // Type assertion for FID entry
              if (typeof window !== 'undefined' && 'gtag' in window) {
                (window as any).gtag('event', 'web_vitals', {
                  name: 'FID',
                  value: Math.round(fidEntry.processingStart - fidEntry.startTime),
                  event_category: 'Performance'
                });
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const clsEntry = entry as any; // Type assertion for CLS entry
              if (!clsEntry.hadRecentInput) {
                clsValue += clsEntry.value;
              }
            });

            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'web_vitals', {
                name: 'CLS',
                value: Math.round(clsValue * 1000),
                event_category: 'Performance'
              });
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
          console.warn('Performance monitoring not supported:', error);
        }
      }
    };

    // Run after page load
    if (document.readyState === 'complete') {
      measureCoreWebVitals();
    } else {
      window.addEventListener('load', measureCoreWebVitals);
    }

    return () => {
      window.removeEventListener('load', measureCoreWebVitals);
    };
  }, []);
};

// Preload critical resources that are actually used immediately
export const preloadCriticalResources = () => {
  useEffect(() => {
    // Only preload resources that are used immediately on page load
    // The og-image.jpg is only used for social sharing, not immediate page render
    // The Google Fonts are already preconnected in index.html, no need to preload

    // If you need to preload specific images that appear above the fold, add them here
    // For example, hero background images or profile pictures
    const criticalImages: string[] = [
      // Add only images that are visible immediately on page load
      // '/hero-background.jpg', // Example: if you have a hero background
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);
};
