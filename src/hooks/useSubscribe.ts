// Hook pour l'inscription email via /api/subscribe
import { useState, useCallback } from 'react'

type Source = 'newsletter' | 'boutique' | 'article' | 'exit-intent' | 'homepage' | 'guides'

interface SubscribeOptions {
  source: Source
  productId?: string
  productName?: string
}

interface SubscribeState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
}

export function useSubscribe(options: SubscribeOptions) {
  const [state, setState] = useState<SubscribeState>({ status: 'idle', error: null })

  const subscribe = useCallback(async (email: string) => {
    setState({ status: 'loading', error: null })

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: options.source,
          productId: options.productId,
          productName: options.productName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setState({ status: 'error', error: data.error || 'Une erreur est survenue' })
        return false
      }

      setState({ status: 'success', error: null })
      return true
    } catch {
      setState({ status: 'error', error: 'Erreur de connexion. Réessayez.' })
      return false
    }
  }, [options.source, options.productId, options.productName])

  const reset = useCallback(() => {
    setState({ status: 'idle', error: null })
  }, [])

  return { ...state, subscribe, reset }
}
