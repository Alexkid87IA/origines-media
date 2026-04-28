import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'node:http';

type VercelDevRequest = IncomingMessage & { body?: unknown };

interface VercelDevResponse {
  status(code: number): VercelDevResponse;
  setHeader(name: string, value: string | number | readonly string[]): VercelDevResponse;
  json(payload: unknown): VercelDevResponse;
  send(payload: unknown): VercelDevResponse;
  end(payload?: unknown): VercelDevResponse;
}

type VercelLikeHandler = (req: VercelDevRequest, res: VercelDevResponse) => unknown | Promise<unknown>;

const localInterviewHandlers: Record<string, () => Promise<{ default: unknown }>> = {
  '/api/interview/article': () => import('./api/interview/article'),
  '/api/interview/generate': () => import('./api/interview/generate'),
  '/api/interview/notify': () => import('./api/interview/notify'),
  '/api/interview/transcribe': () => import('./api/interview/transcribe'),
};

function applyLocalEnv(mode: string) {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined || process.env[key] === '') {
      process.env[key] = value;
    }
  }
}

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  const maxBodySize = 60 * 1024 * 1024;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array);
    size += buffer.length;
    if (size > maxBodySize) {
      throw new Error('Request body too large');
    }
    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    return {};
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
}

function createVercelDevResponse(res: ServerResponse): VercelDevResponse {
  return {
    status(code: number) {
      res.statusCode = code;
      return this;
    },
    setHeader(name: string, value: string | number | readonly string[]) {
      res.setHeader(name, value);
      return this;
    },
    json(payload: unknown) {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify(payload));
      return this;
    },
    send(payload: unknown) {
      res.end(typeof payload === 'string' ? payload : JSON.stringify(payload));
      return this;
    },
    end(payload?: unknown) {
      res.end(payload);
      return this;
    },
  };
}

function localInterviewApiPlugin(mode: string): Plugin {
  return {
    name: 'local-interview-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url || '/', 'http://localhost').pathname;
        const loadHandler = localInterviewHandlers[pathname];

        if (!loadHandler) {
          return next();
        }

        try {
          applyLocalEnv(mode);
          const body = await readJsonBody(req);
          const { default: handlerModule } = await loadHandler();
          const handler = handlerModule as VercelLikeHandler;
          const vercelReq = Object.assign(req, { body }) as VercelDevRequest;
          await handler(vercelReq, createVercelDevResponse(res));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Local API error';
          console.error(`[local-interview-api] ${pathname}:`, error);
          if (!res.headersSent) {
            res.statusCode = message === 'Request body too large' ? 413 : 500;
            res.setHeader('Content-Type', 'application/json');
          }
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  applyLocalEnv(mode);

  return {
  plugins: [react(), localInterviewApiPlugin(mode)],
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
          // Firebase - chunk séparé (volumineux)
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase';
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
  };
});
