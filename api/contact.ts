import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CONTACT_EMAIL } from '../src/lib/contact.js';

const attempts = new Map<string, { count: number; expiresAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const SENDER_EMAIL = 'noreply@origines.media';

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    // Read-only availability check: never sends a message or exposes credentials.
    const key = process.env.BREVO_API_KEY?.trim();
    if (!key) return res.status(503).json({ available: false });
    try {
      const response = await fetch('https://api.brevo.com/v3/senders', {
        headers: { 'api-key': key, accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return res.status(503).json({ available: false });
      const result = await response.json();
      const available = Array.isArray(result.senders) && result.senders.some(
        (sender: { email?: string; active?: boolean }) => sender.email === SENDER_EMAIL && sender.active === true,
      );
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
      return res.status(available ? 200 : 503).json({ available });
    } catch {
      return res.status(503).json({ available: false });
    }
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }
  const origin = req.headers.origin;
  if (origin && !['https://www.origines.media', 'https://origines.media'].includes(String(origin))) {
    return res.status(403).json({ error: 'Origine non autorisée.' });
  }
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Message invalide.' });
  }
  if (body.website) return res.status(400).json({ error: 'Message invalide.' });
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 254);
  const message = cleanText(body.message, 10000);
  const subject = body.subject ? cleanText(body.subject, 160) : 'Question générale';
  if (!name || !email || !message || !subject || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || /[\r\n]/.test(name + email + subject)) {
    return res.status(400).json({ error: 'Vérifiez votre nom, votre email et votre message.' });
  }
  const key = process.env.BREVO_API_KEY?.trim();
  if (!key) return res.status(503).json({ error: 'L’envoi est temporairement indisponible. Contactez-nous par email.' });

  // Limit bursts per server instance; the honeypot also rejects simple form bots.
  const now = Date.now();
  for (const [ip, attempt] of attempts) if (attempt.expiresAt <= now) attempts.delete(ip);
  const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  const attempt = attempts.get(ip) || { count: 0, expiresAt: now + WINDOW_MS };
  if (attempt.count >= MAX_ATTEMPTS) {
    res.setHeader('Retry-After', String(Math.ceil((attempt.expiresAt - now) / 1000)));
    return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans quelques minutes.' });
  }
  attempt.count++;
  attempts.set(ip, attempt);

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST', signal: AbortSignal.timeout(8000),
      headers: { 'content-type': 'application/json', 'api-key': key, accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Origines Media', email: SENDER_EMAIL },
        to: [{ email: CONTACT_EMAIL, name: 'Rédaction Origines' }],
        replyTo: { email, name },
        subject: `[Contact Origines] ${subject}`,
        textContent: `Nom : ${name}\nEmail : ${email}\nSujet : ${subject}\n\n${message}`,
      }),
    });
    if (!response.ok) {
      console.error('[contact] Email service status:', response.status);
      return res.status(502).json({ error: 'Le message n’a pas été envoyé. Réessayez ou contactez-nous par email.' });
    }
    const result = await response.json();
    if (typeof result.messageId !== 'string' || !result.messageId.trim()) return res.status(502).json({ error: 'L’envoi n’a pas été confirmé. Contactez-nous par email.' });
    return res.status(200).json({ sent: true });
  } catch {
    return res.status(502).json({ error: 'L’envoi a échoué. Réessayez ou contactez-nous par email.' });
  }
}
