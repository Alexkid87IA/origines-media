import type { VercelRequest } from '@vercel/node'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

function getApp() {
  if (getApps().length) return getApps()[0]
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not configured')
  return initializeApp({ credential: cert(JSON.parse(raw)) })
}

export async function verifyAuth(req: VercelRequest): Promise<{ uid: string; email?: string } | null> {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null

  const token = header.slice(7)
  if (!token) return null

  try {
    getApp()
    const decoded = await getAuth().verifyIdToken(token)
    return { uid: decoded.uid, email: decoded.email }
  } catch {
    return null
  }
}
