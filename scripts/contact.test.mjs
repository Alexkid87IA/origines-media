import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const temp = await mkdtemp(join(tmpdir(), 'origines-contact-test-'));
await build({ entryPoints: ['api/contact.ts', 'api/subscribe.ts', 'src/lib/contact.ts'],
  bundle: true, platform: 'node', format: 'esm', outdir: temp, outbase: '.' });
const { default: handler } = await import(pathToFileURL(join(temp, 'api/contact.js')));
const { default: subscribe } = await import(pathToFileURL(join(temp, 'api/subscribe.js')));
const { CONTACT_EMAIL, contactMailto, sendContactMessage } = await import(pathToFileURL(join(temp, 'src/lib/contact.js')));
const originalFetch = globalThis.fetch;
const originalKey = process.env.BREVO_API_KEY;
after(async () => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.BREVO_API_KEY;
  else process.env.BREVO_API_KEY = originalKey;
  await rm(temp, { recursive: true, force: true });
});

const valid = { name: 'Visiteur', email: 'visiteur@example.org', subject: 'Question', message: 'Message de vérification' };
let requestId = 0;
async function request(body = valid, options = {}, target = handler) {
  let status = 200;
  let json;
  const headers = {};
  await target({ method: 'POST', body, headers: { origin: 'https://www.origines.media', 'x-forwarded-for': `test-${++requestId}`, ...options.headers }, ...options }, {
    setHeader(key, value) { headers[key.toLowerCase()] = value; },
    status(value) { status = value; return this; },
    json(value) { json = value; return this; },
  });
  return { status, json, headers };
}

test('Invalid input, foreign origins and honeypot never call the email service', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw Error('Must not call'); };
  for (const body of [null, [], {}, { ...valid, email: 'invalid' }, { ...valid, name: 'Name\nInjected' }, { ...valid, message: 'x'.repeat(10001) }, { ...valid, website: 'bot.example' }]) {
    assert.equal((await request(body)).status, 400);
  }
  assert.equal((await request(valid, { headers: { origin: 'https://foreign.example' } })).status, 403);
  const wrongMethod = await request(valid, { method: 'PUT' });
  assert.equal(wrongMethod.status, 405);
  assert.equal(wrongMethod.headers.allow, 'GET, POST');
  assert.equal(calls, 0);
});

test('Missing email configuration is an honest failure', async () => {
  delete process.env.BREVO_API_KEY;
  const response = await request();
  assert.equal(response.status, 503);
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal(response.json.sent, undefined);
});

test('Provider confirmation sends plain text to the published address with visitor reply-to', async () => {
  process.env.BREVO_API_KEY = 'test-key';
  let payload;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email');
    assert.equal(options.method, 'POST');
    payload = JSON.parse(options.body);
    return { ok: true, json: async () => ({ messageId: 'mock-confirmation' }) };
  };
  const response = await request({ ...valid, message: '<script>literal message</script>' });
  assert.equal(response.status, 200);
  assert.deepEqual(response.json, { sent: true });
  assert.equal(payload.to[0].email, CONTACT_EMAIL);
  assert.deepEqual(payload.replyTo, { name: valid.name, email: valid.email });
  assert.ok(payload.textContent.includes('<script>literal message</script>'));
  assert.equal(payload.htmlContent, undefined);
});

test('Unconfirmed delivery and provider/network failures cannot return success', async () => {
  process.env.BREVO_API_KEY = 'test-key';
  for (const provider of [
    async () => ({ ok: true, json: async () => ({}) }),
    async () => ({ ok: false, status: 502 }),
    async () => { throw new Error('Timeout'); },
  ]) {
    globalThis.fetch = provider;
    const response = await request();
    assert.equal(response.status, 502);
    assert.equal(response.json.sent, undefined);
  }
});

test('Availability check reads approved senders without sending email or exposing credentials', async () => {
  process.env.BREVO_API_KEY = 'test-key';
  for (const active of [true, false]) {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://api.brevo.com/v3/senders');
      assert.equal(options.body, undefined);
      return { ok: true, json: async () => ({ senders: [{ email: 'noreply@origines.media', active }] }) };
    };
    const response = await request(undefined, { method: 'GET' });
    assert.equal(response.status, active ? 200 : 503);
    assert.deepEqual(response.json, { available: active });
  }
  globalThis.fetch = async () => ({ ok: false, status: 401 });
  assert.equal((await request(undefined, { method: 'GET' })).status, 503);
});

test('Burst limit prevents repeated provider calls from the same address', async () => {
  process.env.BREVO_API_KEY = 'test-key';
  let calls = 0;
  globalThis.fetch = async () => { calls++; return { ok: true, json: async () => ({ messageId: 'mock' }) }; };
  const options = { headers: { origin: 'https://origines.media', 'x-forwarded-for': 'burst-test' } };
  for (let i = 0; i < 5; i++) assert.equal((await request(valid, options)).status, 200);
  const response = await request(valid, options);
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers['retry-after']) > 0);
  assert.equal(calls, 5);
});

test('Client requires confirmed success and offers a draft preserving the message on failure', async () => {
  for (const result of [{ ok: false, sent: false }, { ok: true, sent: false }]) {
    globalThis.fetch = async () => ({ ok: result.ok, json: async () => ({ sent: result.sent }) });
    await assert.rejects(sendContactMessage(valid), /pas été envoyé/);
  }
  globalThis.fetch = async () => ({ ok: false, json: async () => { throw Error('HTML error page'); } });
  await assert.rejects(sendContactMessage(valid), /pas été envoyé/);
  const mailto = contactMailto({ ...valid, message: 'Texte & caractères\nDeuxième ligne' });
  const params = new URLSearchParams(mailto.split('?')[1]);
  assert.ok(mailto.startsWith(`mailto:${CONTACT_EMAIL}?`));
  assert.equal(params.get('subject'), valid.subject);
  assert.ok(params.get('body').includes('Texte & caractères\nDeuxième ligne'));
});

test('Guide subscriptions use the real CRM and missing configuration does not report success', async () => {
  delete process.env.BREVO_API_KEY;
  assert.equal((await request({ email: valid.email, source: 'guides' }, {}, subscribe)).status, 500);
  process.env.BREVO_API_KEY = 'test-key';
  let payload;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/contacts');
    payload = JSON.parse(options.body);
    return { status: 201 };
  };
  assert.equal((await request({ email: valid.email, source: 'guides' }, {}, subscribe)).status, 200);
  assert.equal(payload.attributes.SOURCE, 'guides');
});
