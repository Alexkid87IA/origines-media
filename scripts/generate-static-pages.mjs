// Keep crawler content identical to the existing public React pages.
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const temp = await mkdtemp(join(tmpdir(), 'origines-static-pages-'));
try {
  const outfile = join(temp, 'pages.mjs');
  await build({
    stdin: {
      contents: `
        import React from 'react';
        import { renderToStaticMarkup } from 'react-dom/server';
        import About from './src/pages/AboutPage.tsx';
        import Contact from './src/pages/ContactPage.tsx';
        import Legal from './src/pages/LegalPage.tsx';
        import Privacy from './src/pages/ConfidentialitePage.tsx';
        import CGU from './src/pages/CGUPage.tsx';
        import CGV from './src/pages/CGVPage.tsx';
        import Cookies from './src/pages/CookiesPage.tsx';
        import SiteMap from './src/pages/PlanDuSitePage.tsx';
        import Galaxy from './src/pages/GalaxiePage.tsx';
        import Newsletter from './src/pages/NewsletterPage.tsx';
        import SundayLetter from './src/pages/LettreDuDimanchePage.tsx';
        import Partnerships from './src/pages/PartnershipsPage.tsx';
        import Join from './src/pages/JoinPage.tsx';
        import Together from './src/pages/EnsemblePage.tsx';
        import JoinPartner from './src/pages/JoinPartnerPage.tsx';
        import Welcome from './src/components/Welcome/Welcome.tsx';
        import Edito from './src/components/Edito/Edito.tsx';
        import Pillars from './src/components/Pillars/Pillars.tsx';
        const Brand = () => React.createElement('main', null,
          React.createElement(Welcome), React.createElement(Edito), React.createElement(Pillars));
        export default Object.fromEntries(Object.entries({
          '/a-propos': About, '/contact': Contact,
          '/mentions-legales': Legal, '/confidentialite': Privacy,
          '/cgu': CGU, '/cgv': CGV, '/cookies': Cookies, '/plan-du-site': SiteMap,
          '/galaxie': Galaxy, '/newsletter': Newsletter, '/lettre-du-dimanche': SundayLetter,
          '/partenariats': Partnerships, '/rejoindre': Join, '/ensemble': Together,
          '/join-partner': JoinPartner, '/marque': Brand,
        }).map(([path, Page]) => [path, renderToStaticMarkup(React.createElement(Page))]));
      `,
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, platform: 'node', format: 'esm', jsx: 'automatic', outfile,
    alias: { '@': resolve('src') },
    banner: { js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);' },
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{ name: 'static-editorial-pages', setup(build) {
      build.onResolve({ filter: /\.module\.css$/ }, args => ({ path: args.path, namespace: 'empty-styles' }));
      build.onLoad({ filter: /.*/, namespace: 'empty-styles' }, () => ({ contents: 'export default new Proxy({}, {get: () => ""});' }));
      build.onResolve({ filter: /(?:SiteHeader\/SiteHeader|Footer2|ScrollToTop\/ScrollToTopV2|components\/SEO|ui\/Breadcrumb)$/ }, args => ({ path: args.path, namespace: 'empty-chrome' }));
      build.onLoad({ filter: /.*/, namespace: 'empty-chrome' }, () => ({ contents: 'export default () => null;' }));
      build.onResolve({ filter: /^react-router-dom$/ }, () => ({ path: 'router', namespace: 'static-links' }));
      build.onLoad({ filter: /.*/, namespace: 'static-links' }, () => ({ contents: 'import React from "react"; export const Link = ({to, children, ...props}) => React.createElement("a", {...props, href:to}, children); export const useLocation = () => ({hash:"", pathname:"/"});', resolveDir: process.cwd() }));
      build.onResolve({ filter: /lib\/sanity$/ }, () => ({ path: 'sanity', namespace: 'static-cms' }));
      build.onLoad({ filter: /.*/, namespace: 'static-cms' }, () => ({ contents: 'export const sanityFetch = async () => null;' }));
    } }],
  });
  const { default: pages } = await import(pathToFileURL(outfile));
  const content = Object.fromEntries(Object.entries(pages).map(([path, html]) => {
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] || html;
    return [path, main.replace(/<h1\b/g, '<h2').replace(/<\/h1>/g, '</h2')];
  }));
  const source = '// Generated from the public React pages by scripts/generate-static-pages.mjs.\n'
    + '// Do not edit manually. No editorial or legal text is added.\n'
    + 'export const STATIC_PAGE_CONTENT: Record<string, string> = '
    + JSON.stringify(content, null, 2) + '\n';
  await writeFile(resolve('api/_lib/staticPages.generated.ts'), source);
  console.log(`Generated ${Object.keys(content).length} public page snapshots.`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
