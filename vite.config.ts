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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React et React Router - chunk séparé
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
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
          // Framer Motion - séparé
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // DOMPurify - séparé (sécurité)
          if (id.includes('node_modules/dompurify')) {
            return 'vendor-security';
          }
          // Univers components - séparés
          if (id.includes('src/components/univers/')) {
            return 'univers-components';
          }
        },
      },
    },
    // Augmenter la limite pour éviter les warnings
    chunkSizeWarningLimit: 600,
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
});
