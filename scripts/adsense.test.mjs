import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { after, test } from 'node:test';
import { build } from 'esbuild';

const temp = await mkdtemp(join(tmpdir(), 'origines-adsense-test-'));
await build({
  entryPoints: ['api/prerender.ts', 'api/_lib/portableTextToHtml.ts', 'api/_lib/staticPages.generated.ts'],
  bundle: true, platform: 'node', format: 'esm', outdir: temp, outbase: 'api',
});
const { default: handler } = await import(pathToFileURL(join(temp, 'prerender.js')));
const { renderPortableText } = await import(pathToFileURL(join(temp, '_lib/portableTextToHtml.js')));
const { STATIC_PAGE_CONTENT } = await import(pathToFileURL(join(temp, '_lib/staticPages.generated.js')));
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const originalFetch = globalThis.fetch;
after(async () => {
  globalThis.fetch = originalFetch;
  await rm(temp, { recursive: true, force: true });
});

async function request(path, result, upstreamStatus = 200) {
  let status = 200;
  let html;
  let requestedQuery;
  const headers = {};
  globalThis.fetch = async (url) => {
    requestedQuery = new URL(url).searchParams.get('query');
    return { ok: upstreamStatus === 200, status: upstreamStatus, json: async () => ({ result }) };
  };
  const response = {
    setHeader(key, value) { headers[key.toLowerCase()] = value; },
    status(value) { status = value; return this; },
    send(value) { html = value; return this; },
  };
  await handler({ query: { p: path } }, response);
  return { status, html, headers, requestedQuery };
}

test('AdSense desktop/mobile and Google Ads receive HTML on every existing crawler route', () => {
  const rules = config.rewrites.filter(rule => rule.destination.startsWith('/api/prerender?'));
  assert.ok(rules.length > 40, 'Cover all public page families');
  for (const rule of rules) {
    const condition = rule.has.find(value => value.key === 'user-agent');
    const regex = new RegExp(`^(?:${condition.value})$`);
    for (const ua of [
      'Mediapartners-Google',
      'Mozilla/5.0 (Linux; Android 13) (compatible; Mediapartners-Google/2.1; +http://www.google.com/bot.html)',
      'AdsBot-Google (+http://www.google.com/adsbot.html)',
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    ]) assert.ok(regex.test(ua), `${rule.source}: ${ua}`);
    assert.equal(regex.test('Mozilla/5.0 Chrome/134.0.0.0 Safari/537.36'), false, rule.source);
  }
});

test('Vercel entry does not shadow the homepage crawler route and preserves the visitor HTML', async () => {
  const output = await mkdtemp(join(temp, 'entry-'));
  const html = '<!doctype html><div id="root"></div><script type="module" src="/assets/app.js"></script>';
  await writeFile(join(output, 'index.html'), html);
  await promisify(execFile)(process.execPath, ['scripts/prepare-vercel-entry.mjs', output]);
  await assert.rejects(access(join(output, 'index.html')), { code: 'ENOENT' });
  assert.equal(await readFile(join(output, 'app.html'), 'utf8'), html);
  assert.equal(config.rewrites.at(-1).destination, '/app.html');
  assert.ok(config.rewrites.some(rule => rule.source === '/' && rule.destination === '/api/prerender?p=/'));
  assert.ok(config.redirects.some(rule => rule.source === '/index.html' && rule.destination === '/'));
  const scripts = JSON.parse(await readFile('package.json', 'utf8')).scripts;
  assert.equal(config.buildCommand, 'npm run build:vercel');
  assert.equal(scripts.build, 'vite build', 'Normal local builds keep the default Vite entry');
  assert.match(scripts['build:vercel'], /npm run build && node scripts\/prepare-vercel-entry\.mjs/);
});

test('Homepage exposes genuine article/video titles and excerpts with correct destinations', async () => {
  const response = await request('/', [
    { title: 'Un article & son sujet', slug: 'article-exemple', description: 'Son extrait public.' },
    { title: 'Une vidéo', slug: 'video-exemple', type: 'video', videoUrl: 'https://youtu.be/example' },
  ]);
  assert.equal(response.status, 200);
  assert.match(response.requestedQuery, /rubrique != "guides"/);
  assert.match(response.html, /href="\/article\/article-exemple"/);
  assert.match(response.html, /href="\/video\/video-exemple"/);
  assert.match(response.html, /Un article &amp; son sujet/);
  assert.match(response.html, /Son extrait public/);
  assert.match(response.html, /href="\/mentions-legales"/);
});

test('Article body preserves citations, source attribution, key points and internal links', async () => {
  const response = await request('/article/exemple', {
    title: 'Un article', author: 'Auteur réel', publishedAt: '2026-10-07',
    contenu: [
      { _type: 'block', children: [{ text: 'Une référence', marks: ['ref'] }], markDefs: [{ _key: 'ref', _type: 'link', href: 'https://example.org/recherche?a=1&b=2' }] },
      { _type: 'block', children: [{ text: 'Autre article', marks: ['internal'] }], markDefs: [{ _key: 'internal', _type: 'internalLink', slug: 'autre-article' }] },
      { _type: 'callout', content: [{ _type: 'block', children: [{ text: 'Une limite documentée.' }] }], source: 'Une institution', sourceUrl: 'https://example.org/source' },
      { _type: 'keyTakeaways', takeaways: [{ point: 'Un point à retenir.' }, 'Une seconde information.'] },
    ],
  });
  assert.equal(response.status, 200);
  assert.match(response.html, /Par Auteur réel/);
  assert.match(response.html, /Une limite documentée/);
  assert.match(response.html, /href="https:\/\/example.org\/source">Une institution/);
  assert.match(response.html, /href="https:\/\/example.org\/recherche\?a=1&amp;b=2"/);
  assert.match(response.html, /href="\/article\/autre-article"/);
  assert.match(response.html, /Un point à retenir/);
  assert.match(response.html, /Une seconde information/);
  assert.match(response.requestedQuery, /coalesce\(contenu, body\)/);
  assert.match(response.requestedQuery, /reference->slug.current/);
});

test('Nested accordion content retains source links', () => {
  const html = renderPortableText([{ _type: 'accordion', sections: [{ question: 'Une question', answer: [
    { _type: 'block', children: [{ text: 'La source', marks: ['ref'] }], markDefs: [{ _key: 'ref', _type: 'link', href: 'https://example.org/etude' }] },
  ] }] }]);
  assert.match(html, /Une question/);
  assert.match(html, /href="https:\/\/example.org\/etude"/);
});

test('A removed internal target loses only its hyperlink and keeps the published text', () => {
  const html = renderPortableText([{ _type: 'block',
    children: [{ text: 'Texte conservé de la référence', marks: ['gone'] }],
    markDefs: [{ _key: 'gone', _type: 'link', href: '/article/supprime', missingArticle: true }],
  }]);
  assert.match(html, /Texte conservé de la référence/);
  assert.doesNotMatch(html, /href=|supprime/);
});

test('Trust pages contain the existing public information rather than a short description', async () => {
  for (const [path, expected] of [
    ['/a-propos', 'Alexandre Quilghini'],
    ['/contact', 'mailto:admin@origines.media'],
    ['/mentions-legales', '981 012 917'],
    ['/confidentialite', 'admin@origines.media'],
  ]) {
    const response = await request(path, null);
    assert.equal(response.status, 200, path);
    assert.ok(response.html.includes(expected), path);
    assert.equal((response.html.match(/<h1\b/g) || []).length, 1, path);
    assert.ok(response.html.length > 7000, path);
  }
});

test('Extended catalogues expose actual items and link to their correct content family', async () => {
  for (const path of ['/media', '/bibliotheque', '/programmes', '/guides', '/actu', '/recommandations/produits']) {
    const response = await request(path, [{ title: 'Titre public & vérifié', slug: 'contenu-reel', description: 'Son extrait.', kind: 'histoire', category: 'programmes' }]);
    assert.equal(response.status, 200, path);
    assert.match(response.html, /Titre public &amp; vérifié/);
    assert.match(response.html, /Son extrait/);
    assert.doesNotMatch(response.html, /noindex, follow/);
    if (path === '/bibliotheque') assert.match(response.html, /href="\/histoire\/contenu-reel"/);
    if (path === '/recommandations/produits') assert.match(response.html, /href="\/recommandations\/produits\/contenu-reel"/);
  }
  const shop = await request('/boutique', [{ title: 'Kit réel', description: 'Ce que contient le kit.', price: '12 €', features: ['Un carnet'], lien: 'javascript:alert(1)' }]);
  assert.match(shop.html, /Un carnet/);
  assert.match(shop.html, /12 €/);
  assert.doesNotMatch(shop.html, /javascript:/);
});

test('Legal pages preserve complete published text and the verified host', async () => {
  for (const path of ['/cgu', '/cgv', '/cookies', '/plan-du-site', '/galaxie', '/ensemble']) {
    const response = await request(path, null);
    assert.equal(response.status, 200, path);
    assert.ok(STATIC_PAGE_CONTENT[path].length > 1000, `Published content absent: ${path}`);
    assert.ok(response.html.includes(STATIC_PAGE_CONTENT[path]), `Complete public snapshot absent: ${path}`);
    assert.equal((response.html.match(/<h1\b/g) || []).length, 1, path);
  }
  const legal = await request('/mentions-legales', null);
  assert.match(legal.html, /Vercel Inc/);
  assert.match(legal.html, /440 N Barranca/);
  assert.doesNotMatch(legal.html, /OVH SAS/);
});

test('Carousels retain their slides and the real companion article', async () => {
  const response = await request('/carousel/proverbes-africains', { title: 'Article compagnon', contenu: [{ _type: 'block', children: [{ text: 'Un contenu compagnon existant.' }] }] });
  assert.equal(response.status, 200);
  assert.match(response.html, /Un contenu compagnon existant/);
  assert.match(response.html, /Slide 6/);
  assert.match(response.html, /href="https:\/\/www.instagram.com\/origines.media"/);
  assert.match(response.html, /canonical" href="https:\/\/www.origines.media\/carousel\/proverbes-africains/);
  const missing = await request('/carousel/absent', null);
  assert.equal(missing.status, 404);
});

test('Formats and testimony lists use published CMS items rather than invented content', async () => {
  const format = await request('/format/la-lettre', [{ title: 'Épisode publié', slug: 'episode-reel', type: 'video' }]);
  assert.match(format.html, /href="\/video\/episode-reel"/);
  assert.match(format.requestedQuery, /\$formatName in formats\[\]->nom/);
  assert.match((await request('/format/la-lettre', [])).html, /noindex, follow/);
  assert.equal((await request('/format/invente', [])).status, 404);
  const testimonies = await request('/temoignages', [{ title: 'Témoignage publié', slug: 'temoignage' }]);
  assert.match(testimonies.html, /href="\/article\/temoignage"/);
  assert.match(testimonies.requestedQuery, /category in \["temoignages", "portraits"\]/);
  const legacy = await request('/boutique/ancien-lien', [{ title: 'Produit publié', price: '12 €' }]);
  assert.match(legacy.html, /Produit publié/);
  assert.match(legacy.html, /canonical" href="https:\/\/www.origines.media\/boutique"/);
});

test('Empty catalogues and private/utility screens are not indexed as editorial content', async () => {
  for (const path of ['/boutique', '/guides', '/bibliotheque', '/compte/profil', '/connexion', '/inscription', '/recherche']) {
    const response = await request(path, []);
    assert.equal(response.status, 200, path);
    assert.match(response.html, /noindex, follow/, path);
  }
  const category = await request('/guides/programmes', [{ title: 'Parcours réel', slug: 'parcours', category: 'programmes' }, { title: 'Autre kit', slug: 'kit', category: 'kits-gratuits' }]);
  assert.match(category.html, /Parcours réel/);
  assert.doesNotMatch(category.html, /Autre kit/);
  assert.equal((await request('/guides/categorie-inventee', [])).status, 404);
});

test('CMS text and URL attributes cannot inject markup or executable links', () => {
  const html = renderPortableText([
    { _type: 'block', children: [{ text: '<script>alert(1)</script>', marks: ['bad'] }], markDefs: [{ _key: 'bad', _type: 'link', href: 'javascript:alert(1)' }] },
    { _type: 'callout', text: 'Texte', source: 'Une source', sourceUrl: 'https://example.org/" onmouseover="alert(1)' },
    { _type: 'image', url: 'https://example.org/photo.jpg', alt: '" onerror="alert(1)' },
  ]);
  assert.doesNotMatch(html, /<script>|href="javascript:|" onerror="|" onmouseover="/);
  assert.match(html, /&lt;script&gt;/);
});

test('Missing article and dossier return real non-indexable 404 responses', async () => {
  for (const path of ['/article/absent', '/dossiers/absent', '/recommandations/produits/absent']) {
    const response = await request(path, null);
    assert.equal(response.status, 404, path);
    assert.match(response.html, /noindex, follow/);
  }
});

test('CMS outage returns a temporary 503 without caching a thin successful page', async () => {
  const response = await request('/article/exemple', null, 503);
  assert.equal(response.status, 503);
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal(response.headers['retry-after'], '60');
  assert.match(response.html, /noindex, follow/);
  assert.match(response.html, /temporairement indisponible/);
});

test('Publisher ID in ads.txt matches the site AdSense configuration', async () => {
  const ads = (await readFile('public/ads.txt', 'utf8')).trim();
  const siteConfig = await readFile('src/lib/adsConfig.ts', 'utf8');
  const match = ads.match(/^google\.com, (pub-\d{16}), DIRECT, f08c47fec0942fa0$/);
  assert.ok(match, 'Valid Google ads.txt entry');
  assert.ok(siteConfig.includes(match[1]), 'Same publisher across site and ads.txt');
});
