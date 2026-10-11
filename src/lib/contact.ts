export const CONTACT_EMAIL = 'admin@origines.media';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export function contactMailto(message: ContactMessage): string {
  const subject = encodeURIComponent(message.subject || 'Contact Origines');
  const body = encodeURIComponent(`Nom : ${message.name}\nEmail : ${message.email}\n\n${message.message}`);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export async function sendContactMessage(message: ContactMessage): Promise<void> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.sent !== true) {
    throw new Error(result.error || "Le message n’a pas été envoyé. Réessayez ou contactez-nous par email.");
  }
}
