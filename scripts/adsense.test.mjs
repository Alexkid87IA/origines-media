import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { after, test } from 'node:test';
import { build } from 'esbuild';

const temp = await mkdtemp(join(tmpdir(), 'origines-adsense-test-'));
await build({
  entryPoints: ['api/prerender.ts', 'api/_lib/portableTextToHtml.ts'],
  bundle: true, platform: 'node', format: 'esm', outdir: temp, outbase: 'api',
});
const { default: handler } = await import(pathToFileURL(join(temp, 'prerender.js')));
const { renderPortableText } = await import(pathToFileURL(join(temp, '_lib/portableTextToHtml.js')));
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

test('Trust pages contain the existing public information rather than a short description', async () => {
  for (const [path, expected] of [
    ['/a-propos', 'Alexandre Quilghini'],
    ['/contact', 'mailto:contact@originesmedia.com'],
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
