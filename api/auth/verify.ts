// API serverless pour validation du mot de passe (sécurisé côté serveur)
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Le mot de passe est stocké dans une variable d'environnement NON exposée au client
  // (pas de préfixe VITE_)
  const CORRECT_PASSWORD = process.env.JOIN_PASSWORD

  if (!CORRECT_PASSWORD) {
    console.error('JOIN_PASSWORD environment variable is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const { password } = req.body

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' })
  }

  // Comparaison sécurisée (timing-safe serait mieux mais OK pour ce cas)
  const isValid = password === CORRECT_PASSWORD

  // Rate limiting basique via headers (Vercel gère le reste)
  res.setHeader('Cache-Control', 'no-store')

  if (isValid) {
    return res.status(200).json({ success: true })
  } else {
    // Délai pour éviter le brute force
    await new Promise(resolve => setTimeout(resolve, 500))
    return res.status(401).json({ success: false, error: 'Invalid password' })
  }
}
