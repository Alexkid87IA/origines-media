// Composant réutilisable de capture email
// Utilisé sur : Newsletter, footer articles, exit-intent, homepage
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Check, Loader, AlertCircle } from 'lucide-react'
import { useSubscribe } from '../hooks/useSubscribe'

type Source = 'newsletter' | 'boutique' | 'article' | 'exit-intent' | 'homepage'
type Variant = 'default' | 'inline' | 'dark' | 'gradient'

interface EmailCaptureProps {
  source: Source
  variant?: Variant
  placeholder?: string
  buttonText?: string
  successMessage?: string
  successDescription?: string
  className?: string
  accentColor?: string
}

const EmailCapture: React.FC<EmailCaptureProps> = ({
  source,
  variant = 'default',
  placeholder = 'Votre adresse email',
  buttonText = "S'inscrire",
  successMessage = 'Inscription réussie !',
  successDescription = 'Vous recevrez nos prochaines communications.',
  className = '',
  accentColor,
}) => {
  const [email, setEmail] = useState('')
  const { status, error, subscribe } = useSubscribe({ source })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return
    await subscribe(email)
  }

  // Styles par variant
  const containerStyles: Record<Variant, string> = {
    default: 'bg-gray-100 rounded-xl p-1.5',
    inline: 'bg-white border border-gray-200 rounded-xl p-1.5',
    dark: 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1.5',
    gradient: 'bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-1.5',
  }

  const inputStyles: Record<Variant, string> = {
    default: 'bg-white text-gray-900 placeholder-gray-400 focus:ring-gray-900/10',
    inline: 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-gray-900/10',
    dark: 'bg-white/10 text-white placeholder-white/50 focus:ring-white/20',
    gradient: 'bg-white/20 text-white placeholder-white/60 focus:ring-white/30',
  }

  const buttonStyles: Record<Variant, string> = {
    default: 'bg-gray-900 text-white hover:bg-gray-800',
    inline: 'bg-gray-900 text-white hover:bg-gray-800',
    dark: 'bg-white text-gray-900 hover:bg-gray-100',
    gradient: 'bg-white text-gray-900 hover:bg-gray-100',
  }

  const iconColor: Record<Variant, string> = {
    default: 'text-gray-400',
    inline: 'text-gray-400',
    dark: 'text-white/50',
    gradient: 'text-white/60',
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center p-4 rounded-xl ${variant === 'dark' || variant === 'gradient' ? 'bg-white/10 border border-white/20' : 'bg-emerald-50'} ${className}`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${variant === 'dark' || variant === 'gradient' ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
          <Check className={`w-5 h-5 ${variant === 'dark' || variant === 'gradient' ? 'text-emerald-400' : 'text-emerald-600'}`} />
        </div>
        <p className={`font-semibold text-sm mb-0.5 ${variant === 'dark' || variant === 'gradient' ? 'text-white' : 'text-emerald-900'}`}>
          {successMessage}
        </p>
        <p className={`text-xs ${variant === 'dark' || variant === 'gradient' ? 'text-white/70' : 'text-emerald-700'}`}>
          {successDescription}
        </p>
      </motion.div>
    )
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${containerStyles[variant]}`}>
          <div className="flex-1 relative">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor[variant]}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              autoComplete="email"
              spellCheck="false"
              disabled={status === 'loading'}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 ${inputStyles[variant]}`}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${buttonStyles[variant]}`}
            style={accentColor ? { background: accentColor } : undefined}
          >
            {status === 'loading' ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            <span>{status === 'loading' ? 'Envoi...' : buttonText}</span>
          </button>
        </div>
      </form>

      <AnimatePresence>
        {status === 'error' && error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-1.5 mt-2 text-xs ${variant === 'dark' || variant === 'gradient' ? 'text-red-300' : 'text-red-500'}`}
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmailCapture
