// lighthouserc.js - Configuration Lighthouse CI
// Run: npx lhci autorun

module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/articles',
        'http://localhost:4173/videos',
        'http://localhost:4173/histoires',
      ],
      // Number of runs per URL (more runs = more accurate)
      numberOfRuns: 3,
      // Start server before testing
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local',
      startServerReadyTimeout: 30000,
    },
    assert: {
      // Assertions for Core Web Vitals and SEO
      assertions: {
        // Performance
        'categories:performance': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],

        // SEO
        'categories:seo': ['error', { minScore: 0.9 }],
        'meta-description': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'link-text': 'warn',
        'crawlable-anchors': 'warn',

        // Accessibility
        'categories:accessibility': ['warn', { minScore: 0.85 }],
        'color-contrast': 'warn',
        'image-alt': 'error',

        // Best Practices
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'is-on-https': 'off', // Désactivé pour localhost
        'uses-http2': 'off', // Désactivé pour localhost

        // PWA
        'service-worker': 'warn',
        'installable-manifest': 'warn',
      },
    },
    upload: {
      // Upload to temporary storage (or configure LHCI server)
      target: 'temporary-public-storage',
    },
  },
};
