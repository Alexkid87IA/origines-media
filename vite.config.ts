import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
          // Sanity - chunk séparé
          if (id.includes('node_modules/@sanity') || id.includes('node_modules/@portabletext')) {
            return 'vendor-sanity';
          }
          // Lucide icons - séparés car très volumineux
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Univers components - séparés
          if (id.includes('src/components/univers/')) {
            return 'univers-components';
          }
        },
      },
    },
    // Le chunk d'icônes sera gros mais c'est inévitable avec lucide-react
    chunkSizeWarningLimit: 800,
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
