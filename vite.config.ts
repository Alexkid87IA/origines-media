import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Activer la minification avec esbuild (plus rapide)
    minify: 'esbuild',
    // Target navigateurs modernes pour des bundles plus petits
    target: 'es2020',
    // Activer le tree shaking agressif
    treeshake: true,
    rollupOptions: {
      output: {
        // Noms de fichiers optimisés avec hash court
        chunkFileNames: 'assets/[name]-[hash:8].js',
        entryFileNames: 'assets/[name]-[hash:8].js',
        assetFileNames: 'assets/[name]-[hash:8].[ext]',
        manualChunks(id) {
          // React core - chunk principal (chargé en premier)
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // React Router - séparé (chargé après React)
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // React Query - chunk séparé
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-query';
          }
          // Sanity - chunk séparé
          if (id.includes('node_modules/@sanity') || id.includes('node_modules/@portabletext')) {
            return 'vendor-sanity';
          }
          // Lucide icons - séparés car volumineux
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Framer Motion - séparé (lazy load si possible)
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // DOMPurify - séparé (sécurité)
          if (id.includes('node_modules/dompurify')) {
            return 'vendor-security';
          }
          // Helmet - SEO
          if (id.includes('node_modules/react-helmet-async')) {
            return 'vendor-seo';
          }
          // Partnership components - lazy loaded
          if (id.includes('src/components/partnership/')) {
            return 'partnership-components';
          }
          // Univers components - lazy loaded
          if (id.includes('src/components/univers/')) {
            return 'univers-components';
          }
          // Format components - lazy loaded
          if (id.includes('src/components/formats/')) {
            return 'formats-components';
          }
          // Article components - lazy loaded
          if (id.includes('src/components/article/')) {
            return 'article-components';
          }
        },
      },
    },
    // Augmenter la limite pour éviter les warnings
    chunkSizeWarningLimit: 600,
    // Activer le rapport de taille des bundles
    reportCompressedSize: true,
    // Source maps uniquement en mode non-production
    sourcemap: false,
    // Activer CSS code splitting
    cssCodeSplit: true,
  },
  server: {
    proxy: {
      // Proxy pour l'API Sanity - évite les problèmes CORS en développement
      '/sanity-api': {
        target: 'https://r941i081.api.sanity.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sanity-api/, ''),
        secure: true,
      },
    },
  },
  // Préchargement des modules critiques
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
});
