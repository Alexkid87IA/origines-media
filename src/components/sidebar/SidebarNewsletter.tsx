// src/components/sidebar/SidebarNewsletter.tsx
import { useState } from 'react';
import { ArrowRight, Check, Clock } from 'lucide-react';

type Variant = 'form' | 'coming-soon';

interface Props {
  variant?: Variant;
}

export default function SidebarNewsletter({ variant = 'form' }: Props) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50 border border-violet-100/50">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-2xl" />

      <div className="relative p-5">
        {variant === 'coming-soon' ? (
          <>
            {/* Coming Soon variant (ArticlePage) */}
            <div className="text-center mb-4">
              <div className="relative inline-block">
                <img
                  src="/kit-introspection.jpg"
                  alt="Kit d'Introspection"
                  className="w-20 h-auto mx-auto rounded-xl shadow-lg shadow-violet-500/20 mb-3 -rotate-3 grayscale-[30%]"
                />
                <span className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[8px] font-bold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
                  Bientôt
                </span>
              </div>
              <h4 className="text-gray-900 font-bold text-base">Kit d'Introspection</h4>
              <p className="text-violet-600/70 text-[11px] font-medium mt-1">Guide gratuit &bull; 24 pages</p>
            </div>

            <p className="text-gray-600 text-xs text-center mb-4 leading-relaxed">
              Les meilleurs outils de développement personnel de nos intervenants.
            </p>

            <div className="bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl p-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-2">
                <Clock className="w-3 h-3 text-amber-500" />
                <span className="text-amber-700 text-[10px] font-bold uppercase tracking-wider">Bientôt disponible</span>
              </div>
              <p className="text-gray-500 text-[11px]">
                Nous préparons quelque chose de spécial pour vous.
              </p>
            </div>
          </>
        ) : !success ? (
          <>
            {/* Form variant (VideoPage) */}
            <div className="text-center mb-4">
              <img
                src="/kit-introspection.jpg"
                alt="Kit d'Introspection"
                className="w-20 h-auto mx-auto rounded-xl shadow-lg shadow-violet-500/20 mb-3 -rotate-3 hover:rotate-0 transition-transform"
              />
              <h4 className="text-gray-900 font-bold text-base">Kit d'Introspection</h4>
              <p className="text-violet-600/70 text-[11px] font-medium mt-1">Guide gratuit &bull; 24 pages</p>
            </div>

            <p className="text-gray-600 text-xs text-center mb-4 leading-relaxed">
              Les meilleurs outils de développement personnel de nos intervenants.
            </p>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-violet-200/50 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
              <button
                type="submit"
                disabled={!email.trim() || submitting}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
              >
                {submitting ? 'Envoi...' : 'Recevoir mon guide'}
                {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              Pas de spam. Désabonnement en 1 clic.
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25">
              <Check className="w-7 h-7 text-white" />
            </div>
            <p className="text-gray-900 font-bold text-base">Merci !</p>
            <p className="text-gray-500 text-xs mt-1">Vérifiez votre boîte mail</p>
          </div>
        )}
      </div>
    </div>
  );
}
