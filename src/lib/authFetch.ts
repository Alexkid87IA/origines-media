import { getFirebaseAuth } from './firebase'

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const auth = await getFirebaseAuth()
  const user = auth.currentUser
  if (!user) return { 'Content-Type': 'application/json' }

  const token = await user.getIdToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
