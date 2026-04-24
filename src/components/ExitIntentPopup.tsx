// Popup exit-intent pour capture email
// S'affiche quand le curseur quitte la fenêtre (desktop)
// Cookie de 7 jours pour ne pas réafficher
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import EmailCapture from './EmailCapture'

const COOKIE_NAME = 'origines_exit_popup'
const COOKIE_DAYS = 7
const MIN_TIME_ON_PAGE_MS = 15000 // 15 secondes minimum avant affichage

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? match[1] : null
}

const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  const showPopup = useCallback(() => {
    if (hasTriggered) return
    if (getCookie(COOKIE_NAME)) return

    setHasTriggered(true)
    setIsVisible(true)
  }, [hasTriggered])

  const closePopup = useCallback(() => {
    setIsVisible(false)
    setCookie(COOKIE_NAME, 'dismissed', COOKIE_DAYS)
  }, [])

  useEffect(() => {
    // Ne pas afficher si déjà dismissé
    if (getCookie(COOKIE_NAME)) return

    // Attendre un temps minimum sur la page
    const timer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        // Seulement quand le curseur sort par le haut (intention de quitter)
        if (e.clientY <= 0) {
          showPopup()
        }
      }

      document.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }, MIN_TIME_ON_PAGE_MS)

    return () => clearTimeout(timer)
  }, [showPopup])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={closePopup}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header gradient */}
              <div className="bg-gradient-to-br from-violet-500 to-pink-500 p-5 text-white text-center relative">
                <button
                  onClick={closePopup}
                  className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold mb-1">
                  Avant de partir...
                </h2>
                <p className="text-white/80 text-xs">
                  Rejoignez notre communauté et recevez le meilleur d'Origines chaque semaine.
                </p>
              </div>

              {/* Formulaire */}
              <div className="p-5">
                <EmailCapture
                  source="exit-intent"
                  variant="default"
                  placeholder="votre@email.com"
                  buttonText="S'abonner"
                  successMessage="Bienvenue !"
                  successDescription="Vous recevrez notre newsletter vendredi."
                />
                <p className="text-center text-gray-400 text-[10px] mt-3">
                  Gratuit, sans spam. Désabonnement en 1 clic.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ExitIntentPopup
