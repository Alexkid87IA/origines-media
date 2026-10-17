import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const temp = await mkdtemp(join(tmpdir(), 'origines-editorial-'));
await build({ stdin: { contents: `
  import React from 'react';
  import { renderToStaticMarkup } from 'react-dom/server';
  import { PortableText } from '@portabletext/react';
  import { EditorialText } from './src/components/article/EditorialText';
  import { createPortableTextComponentsV2 } from './src/components/article/PortableTextComponentsV2';
  import { normalizeEditorialBlocks } from './src/lib/editorialContent';
  export { normalizeEditorialBlocks };
  export { renderPortableText } from './api/_lib/portableTextToHtml';
  export const inline = value => renderToStaticMarkup(React.createElement(EditorialText, {value}));
  export const render = value => renderToStaticMarkup(React.createElement(PortableText, {
    value: normalizeEditorialBlocks(value), components: createPortableTextComponentsV2({themeColor:'#0A0A0A'})
  }));`, resolveDir: process.cwd(), loader: 'tsx' }, bundle: true, platform: 'node', format: 'esm', outfile: join(temp, 'test.mjs'),
  alias: { '@': resolve('src') }, loader: { '.css': 'empty' },
  define: { 'import.meta.env': '{}', 'process.env.NODE_ENV': '"production"' },
  banner: { js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);' },
});
const { inline, render, renderPortableText, normalizeEditorialBlocks } = await import(pathToFileURL(join(temp, 'test.mjs')));
after(() => rm(temp, { recursive: true, force: true }));
const block = (text, more = {}) => ({ _type: 'block', _key: text, style: 'normal', children: [{ _type: 'span', text, marks: [] }], markDefs: [], ...more });
const fixture = JSON.parse(await readFile('scripts/fixtures/editorial-sources.json', 'utf8'));

test('real published box: two readable citations, intact figures and qualified conclusion', () => {
  const html = render([fixture]);
  assert.match(html, /href="https:\/\/doi.org\/10.3389\/fpubh.2024.1417997"[^>]*>analyse de Keyes \(2024\)<\/a>/);
  assert.match(html, /href="https:\/\/doi.org\/10.3389\/fpsyt.2026.1877502"[^>]*>revue de Guo \(2026\)<\/a>/);
  assert.match(html, /<strong>7 182 personnes/);
  assert.match(html, /<strong>12 essais randomisés réunissant 741 adultes/);
  assert.ok(html.includes('Ils ne comptent pas des personnes guéries.'));
  assert.doesNotMatch(html, /\]\(https/);
});

test('Markdown handles spaced links, balanced DOI parentheses, bold labels and multiple citations', () => {
  const html = inline('Voir [**étude**] (https://doi.org/10.1016/S0140-6736(20)30183-5), puis [suite](/article/suite).');
  assert.match(html, /href="https:\/\/doi.org\/10.1016\/S0140-6736\(20\)30183-5"/);
  assert.match(html, /<strong>étude<\/strong><\/a>, puis/);
  assert.match(html, /href="\/article\/suite"/);
});

test('unsafe links and HTML remain inert without losing labels', () => {
  for (const href of ['javascript:alert(1)', 'data:text/html,test', '//evil.test', '/\\evil.test']) {
    const value = `[source](${href}) <img src=x onerror=alert(1)>`;
    for (const html of [inline(value), renderPortableText([{_type:'callout', text:value}])]) {
      assert.doesNotMatch(html, /<a |<img /);
      assert.ok(html.includes('source'));
      assert.ok(html.includes('&lt;img'));
    }
  }
});

test('Portable Text source annotations preserve labels, strong marks and internal links', () => {
  const value = [block('étude', { children: [{_type:'span', text:'étude', marks:['strong','ref']}],
    markDefs:[{_key:'ref',_type:'link',href:'https://example.org/study'}] }),
    block('article', { children:[{_type:'span',text:'article',marks:['internal']}],
      markDefs:[{_key:'internal',_type:'internalLink',slug:{current:'autre-article'}}] })];
  for (const html of [inline(value), render([{_type:'callout',content:value}]), render([{_type:'keyTakeaways',items:[{content:value}]}])]) {
    assert.match(html,/href="https:\/\/example.org\/study"/);
    assert.match(html,/<strong>étude<\/strong>/);
    assert.match(html,/href="\/article\/autre-article"/);
    assert.doesNotMatch(html,/<a[^>]*>[^<]*<a/);
  }
});

test('callouts and stat callouts parse Markdown and source fields', () => {
  for (const type of ['info','stat']) {
    const html = render([{_type:'callout',type,text:'**Résultat** : [étude](https://example.org)',source:'[Référence](https://example.org/source)'}]);
    assert.match(html,/<strong>Résultat<\/strong>/);
    assert.match(html,/href="https:\/\/example.org\/source"/);
    assert.doesNotMatch(html,/\]\(https/);
  }
});

test('legacy checklist markers across blocks preserve existing Portable Text links', () => {
  const input = [block('Avant'), block('[CHECKLIST titre="À vérifier"]'),
    block('Lire la source',{listItem:'bullet',children:[{_type:'span',text:'Lire la source',marks:['ref']}],markDefs:[{_type:'link',_key:'ref',href:'https://example.org'}]}),
    block('[/CHECKLIST]'),block('Après')];
  const normalized = normalizeEditorialBlocks(input);
  assert.equal(normalized[1]._type,'checklist');
  assert.deepEqual(normalized[1].items[0].text[0].markDefs,input[2].markDefs);
  assert.deepEqual(normalized.at(-1),input.at(-1));
  for(const html of [render(input),renderPortableText(input)]) {
    assert.doesNotMatch(html,/\[\/?CHECKLIST/);
    assert.match(html,/href="https:\/\/example.org"/);
    assert.ok(html.includes('À vérifier'));
    assert.ok(html.includes('Avant') && html.includes('Après'));
  }
});

test('multiline checklist becomes accessible controls, native string/French items also render', () => {
  const input = [block('[CHECKLIST]\n- [ ] Lire [étude](https://example.org)\n- **Comparer**\n[/CHECKLIST]'),
    {_type:'checklist',titre:'Suite',items:['Texte',{texte:'[suite](/article/suite)'}]}];
  const html = render(input);
  assert.doesNotMatch(html,/\[\/?CHECKLIST/);
  assert.equal((html.match(/type="checkbox"/g)||[]).length,4);
  assert.match(html,/<strong>Comparer<\/strong>/);
  assert.match(html,/href="\/article\/suite"/);
});

test('incomplete wrappers and code are not discarded, normalization is idempotent', () => {
  const incomplete=[block('[CHECKLIST]'),block('Important')];
  assert.deepEqual(normalizeEditorialBlocks(incomplete),incomplete);
  const code=[{_type:'code',code:'[CHECKLIST]'}];
  assert.deepEqual(normalizeEditorialBlocks(code),code);
  const input=[block('[CHECKLIST]\n- À lire\n[/CHECKLIST]')];
  assert.deepEqual(normalizeEditorialBlocks(normalizeEditorialBlocks(input)),normalizeEditorialBlocks(input));
});

test('crawler renderer matches the same source links as the browser', () => {
  const html=renderPortableText([fixture]);
  assert.match(html,/href="https:\/\/doi.org\/10.3389\/fpubh.2024.1417997"/);
  assert.match(html,/href="https:\/\/doi.org\/10.3389\/fpsyt.2026.1877502"/);
  assert.doesNotMatch(html,/\]\(https/);
});


test('plain Markdown inside Portable Text and direct block takeaway items retain citations', () => {
  const value = block('Lire [source] (https://example.org/source) et **comparer**.');
  for (const html of [inline([value]), render([{_type:'keyTakeaways',items:[value]}])]) {
    assert.match(html,/href="https:\/\/example.org\/source"/);
    assert.match(html,/<strong>comparer<\/strong>/);
    assert.doesNotMatch(html,/\] \(/);
  }
});
