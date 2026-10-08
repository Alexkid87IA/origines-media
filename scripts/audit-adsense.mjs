// Read-only check of public production responses and the corrected local renderer.
// Run: node scripts/audit-adsense.mjs /private/tmp/origines-adsense-audit
// After deployment, append --require-live-match to fail if public content differs.
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const output = process.argv[2] || '/private/tmp/origines-adsense-audit';
const requireLiveMatch = process.argv.includes('--require-live-match');
await mkdir(output, { recursive: true });
const temp = await mkdtemp(join(tmpdir(), 'origines-adsense-audit-'));
const exec = promisify(execFile);
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const originalFetch = globalThis.fetch;
const base = 'https://www.origines.media';
const sanity = 'https://r941i081.api.sanity.io/v2024-03-01/data/query/production';

async function get(url, agent = 'Mozilla/5.0') {
  const { stdout } = await exec('curl', [
    '--location', '--silent', '--show-error', '--max-time', '20',
    '--user-agent', agent, '--write-out', '\n%{http_code}', url,
  ], { maxBuffer: 8_000_000 });
  const offset = stdout.lastIndexOf('\n');
  return { status: Number(stdout.slice(offset + 1)), body: stdout.slice(0, offset) };
}

function bodyText(html) {
  return (html.split(/<body[^>]*>/i)[1] || html)
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function crawlerRewrite(path, agent) {
  return config.rewrites.find(rule => {
    if (!rule.destination.startsWith('/api/prerender?')) return false;
    const route = rule.source.split('/').map(segment => segment.startsWith(':') ? '[^/]+' : segment).join('/');
    const condition = rule.has.find(value => value.key === 'user-agent');
    return new RegExp(`^${route}$`).test(path) && new RegExp(`^(?:${condition.value})$`).test(agent);
  });
}

try {
  await build({ entryPoints: ['api/prerender.ts'], bundle: true, platform: 'node', format: 'esm', outfile: join(temp, 'handler.mjs') });
  const { default: handler } = await import(pathToFileURL(join(temp, 'handler.mjs')));
  // curl uses the host certificate store; all requests stay public and read-only.
  globalThis.fetch = async url => {
    const response = await get(String(url));
    return { ok: response.status >= 200 && response.status < 300, status: response.status, json: async () => JSON.parse(response.body) };
  };
  async function local(path) {
    assert.ok(crawlerRewrite(path, 'Mediapartners-Google'), `Missing AdSense rewrite: ${path}`);
    let status = 200;
    let body;
    await handler({ query: { p: path } }, {
      setHeader() {}, status(value) { status = value; return this; }, send(value) { body = value; },
    });
    return { status, body };
  }
  const query = `*[_type == "production" && defined(slug.current) && coalesce(typeArticle,"article") != "video" && !defined(carouselSlides)] | order(datePublication desc)[0...12]{"title":titre,"slug":slug.current,"author":coalesce(author->name,auteur->nom),"content":coalesce(contenu,body)}`;
  const cms = await get(`${sanity}?${new URLSearchParams({ query })}`);
  assert.equal(cms.status, 200, 'Public CMS accessible');
  const sample = JSON.parse(cms.body).result;
  assert.equal(sample.length, 12);
  const report = { checkedAt: new Date().toISOString(), articleSample: [], pageChecks: [], internalLinkChecks: [] };
  const paths = ['/', '/articles', '/a-propos', '/contact', '/mentions-legales', '/confidentialite', '/ads.txt', '/robots.txt'];
  for (const path of paths) {
    const live = await get(`${base}${path}`, 'Mediapartners-Google');
    const revised = path.endsWith('.txt') ? { status: 200, body: await readFile(`public${path}`, 'utf8') } : await local(path);
    report.pageChecks.push({ path, liveStatus: live.status, liveTextCharacters: bodyText(live.body).length, revisedStatus: revised.status, revisedTextCharacters: bodyText(revised.body).length, liveContentMatches: bodyText(live.body) === bodyText(revised.body) });
    assert.equal(live.status, 200, `Public page ${path}`);
    assert.equal(revised.status, 200, `Corrected page ${path}`);
    await writeFile(join(output, path === '/' ? 'homepage.html' : `${path.slice(1).replaceAll('/', '-')}.html`), revised.body);
  }
  const internalLinks = new Set();
  // Three at a time to keep public requests modest and avoid stressing the CMS.
  for (let offset = 0; offset < sample.length; offset += 3) {
    const results = await Promise.all(sample.slice(offset, offset + 3).map(async article => {
      const path = `/article/${article.slug}`;
      const [live, revised] = await Promise.all([get(`${base}${path}`, 'Mediapartners-Google'), local(path)]);
      const cmsText = (article.content || []).filter(block => block._type === 'block').flatMap(block => (block.children || []).map(child => child.text || '')).join(' ');
      const points = (article.content || []).filter(block => block._type === 'keyTakeaways').flatMap(block => block.takeaways || block.items || []).map(item => typeof item === 'string' ? item : item.point || item.text || '').filter(Boolean);
      const quoteSafe = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
      for (const point of points) assert.ok(revised.body.includes(quoteSafe(point)), `Missing key point: ${article.slug}`);
      for (const block of article.content || []) for (const mark of block.markDefs || []) if (mark.href?.startsWith('/article/')) internalLinks.add(mark.href);
      assert.equal(live.status, 200, path);
      assert.equal(revised.status, 200, path);
      assert.ok(bodyText(revised.body).length > 1000, `Article text absent: ${path}`);
      assert.ok(revised.body.includes(quoteSafe(article.title)), `Article title absent: ${path}`);
      assert.ok(revised.body.includes(quoteSafe(article.author)), `Author absent: ${path}`);
      await writeFile(join(output, `${article.slug}.html`), revised.body);
      return { path, author: article.author, cmsWords: cmsText.split(/\s+/).length, hasSourceSection: /sources?|références?/i.test(cmsText), liveStatus: live.status, liveTextCharacters: bodyText(live.body).length, revisedStatus: revised.status, revisedTextCharacters: bodyText(revised.body).length, liveContentMatches: bodyText(live.body) === bodyText(revised.body), preservedKeyPoints: points.length };
    }));
    report.articleSample.push(...results);
  }
  for (const path of [...internalLinks].slice(0, 12)) {
    const response = await get(`${base}${path}`, 'Googlebot');
    report.internalLinkChecks.push({ path, status: response.status, textCharacters: bodyText(response.body).length });
    assert.equal(response.status, 200, path);
    assert.ok(bodyText(response.body).length > 1000, `Internal article text absent: ${path}`);
  }
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (requireLiveMatch) {
    for (const page of [...report.pageChecks, ...report.articleSample]) {
      assert.ok(page.liveContentMatches, `Production content differs: ${page.path}`);
    }
  }
} finally {
  globalThis.fetch = originalFetch;
  await rm(temp, { recursive: true, force: true });
}
