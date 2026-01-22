// src/pages/AcademyPage.tsx
// Page Academy - Style Magazine Compact (cohérent avec HomePage)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Download,
  Star,
  Check,
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  Award,
  Clock,
  ChevronDown,
  ArrowUpRight,
  Users,
  Play
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Types
interface Guide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  badgeColor: string;
  color: string;
  icon: React.ReactNode;
  features: string[];
  duration?: string;
  format: string;
  popular?: boolean;
  href: string;
  comingSoon?: boolean;
}

// Data - Tous les produits sont "Bientôt disponible"
const guides: Guide[] = [
  {
    id: 'kit-introspection',
    title: 'Kit d\'Introspection',
    subtitle: 'Votre point de départ',
    description: 'Exercices et réflexions pour commencer votre voyage intérieur.',
    price: 'Gratuit',
    badge: 'Bientôt',
    badgeColor: '#F59E0B',
    color: '#06B6D4',
    icon: <Heart className="w-3.5 h-3.5" />,
    features: ['10 exercices', 'Journal PDF', 'Audio méditation', 'Communauté'],
    duration: '1 sem.',
    format: 'PDF + Audio',
    href: '/academy/kit-introspection',
    comingSoon: true
  },
  {
    id: 'masterclass-storytelling',
    title: 'Masterclass Storytelling',
    subtitle: 'Racontez votre histoire',
    description: 'L\'art de raconter votre histoire de manière captivante.',
    price: '29€',
    originalPrice: '49€',
    badge: 'Bientôt',
    badgeColor: '#F59E0B',
    color: '#F59E0B',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    features: ['12 vidéos', 'Workbook 50p', 'Templates', 'Feedback', 'Certificat'],
    duration: '4 sem.',
    format: 'Vidéo + PDF',
    popular: false,
    href: '/academy/masterclass-storytelling',
    comingSoon: true
  },
  {
    id: 'guide-mindset',
    title: 'Guide Mindset',
    subtitle: 'Transformez votre mental',
    description: 'Développez un état d\'esprit de croissance.',
    price: '19€',
    badge: 'Bientôt',
    badgeColor: '#F59E0B',
    color: '#EC4899',
    icon: <Target className="w-3.5 h-3.5" />,
    features: ['8 modules', 'Exercices quotidiens', 'Tracker', 'Accès à vie'],
    duration: '3 sem.',
    format: 'PDF interactif',
    href: '/academy/guide-mindset',
    comingSoon: true
  },
  {
    id: 'programme-complet',
    title: 'Programme Complet',
    subtitle: 'L\'expérience ultime',
    description: 'Accès illimité à tous nos contenus premium.',
    price: '79€',
    originalPrice: '147€',
    badge: 'Bientôt',
    badgeColor: '#F59E0B',
    color: '#8B5CF6',
    icon: <Award className="w-3.5 h-3.5" />,
    features: ['Tous les guides', 'Futures formations', 'Q&A mensuelles', 'Coaching', 'Support VIP'],
    duration: 'À vie',
    format: 'Tout inclus',
    href: '/academy/programme-complet',
    comingSoon: true
  }
];

const testimonials = [
  {
    name: 'Marie L.',
    role: 'Entrepreneure',
    content: 'La Masterclass a transformé ma façon de communiquer.',
    avatar: '/placeholder.svg',
    rating: 5,
    color: '#EC4899'
  },
  {
    name: 'Thomas D.',
    role: 'Coach',
    content: 'Le Guide Mindset est devenu mon outil quotidien.',
    avatar: '/placeholder.svg',
    rating: 5,
    color: '#8B5CF6'
  },
  {
    name: 'Sophie M.',
    role: 'Auteure',
    content: 'J\'ai pris le Programme Complet. Aucun regret !',
    avatar: '/placeholder.svg',
    rating: 5,
    color: '#06B6D4'
  }
];

// Components
const GuideCard: React.FC<{ guide: Guide; index: number }> = ({ guide, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative group"
    >
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
          isExpanded ? 'ring-2' : 'ring-1 hover:ring-2'
        } ${guide.popular ? 'ring-amber-400' : 'ring-gray-100'}`}
        style={{
          ringColor: isExpanded ? guide.color : undefined,
          boxShadow: isExpanded
            ? `0 20px 40px -12px rgba(0,0,0,0.15), 0 0 0 2px ${guide.color}`
            : guide.popular
            ? '0 8px 25px -8px rgba(251, 191, 36, 0.3)'
            : '0 2px 12px -4px rgba(0,0,0,0.08)',
        }}
      >
        {/* Popular banner */}
        {guide.popular && (
          <div className="h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400" />
        )}

        {/* Header cliquable */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left"
        >
          <div className="relative p-2.5 lg:p-3 flex items-center gap-2.5">
            {/* Icon avec couleur */}
            <motion.div
              className="relative flex-shrink-0"
              animate={{ scale: isExpanded ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: `${guide.color}15`,
                  boxShadow: isExpanded ? `0 4px 12px -2px ${guide.color}40` : 'none',
                  border: isExpanded ? `2px solid ${guide.color}` : '2px solid transparent',
                }}
              >
                <div style={{ color: guide.color }}>{guide.icon}</div>
              </div>

              {/* Badge */}
              {guide.badge && (
                <span
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-wider text-white shadow-sm"
                  style={{ backgroundColor: guide.badgeColor }}
                >
                  {guide.badge}
                </span>
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: guide.color }}
                >
                  {guide.subtitle}
                </span>
                <span className="text-[9px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {guide.duration}
                </span>
              </div>
              <h3 className="text-xs lg:text-sm font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
                {guide.title}
              </h3>
            </div>

            {/* Price + Arrow */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                {guide.originalPrice && (
                  <span className="text-[9px] text-gray-400 line-through block">
                    {guide.originalPrice}
                  </span>
                )}
                <span
                  className="text-sm font-bold"
                  style={{ color: guide.price === 'Gratuit' ? '#10B981' : guide.color }}
                >
                  {guide.price}
                </span>
              </div>

              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{
                  backgroundColor: isExpanded ? `${guide.color}15` : '#f3f4f6',
                }}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown
                  className="w-3 h-3 transition-colors duration-300"
                  style={{ color: isExpanded ? guide.color : '#9ca3af' }}
                  strokeWidth={2}
                />
              </motion.div>
            </div>

            {/* Bordure gauche colorée */}
            <div
              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: guide.color,
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'scaleY(1)' : 'scaleY(0)',
              }}
            />
          </div>
        </button>

        {/* Dropdown Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-gray-100"
            >
              <motion.div
                className="p-3 lg:p-4 bg-gray-50/50"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05 }}
              >
                {/* Description */}
                <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                  {guide.description}
                </p>

                {/* Features grid */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {guide.features.map((feature, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.03 }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border"
                      style={{
                        borderColor: `${guide.color}40`,
                        color: guide.color,
                        backgroundColor: `${guide.color}08`,
                      }}
                    >
                      <Check className="w-2 h-2" />
                      {feature}
                    </motion.span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                  <div className="flex items-center gap-1.5 text-[9px] font-medium text-gray-400">
                    <Download className="w-3 h-3" />
                    <span>{guide.format}</span>
                  </div>

                  {guide.comingSoon ? (
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold text-amber-700 bg-amber-100 cursor-not-allowed"
                    >
                      <Clock className="w-2.5 h-2.5" />
                      Bientôt disponible
                    </span>
                  ) : (
                    <Link
                      to={guide.href}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: guide.color,
                        boxShadow: `0 2px 8px ${guide.color}40`
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {guide.price === 'Gratuit' ? 'Télécharger' : 'Découvrir'}
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Main Component
const AcademyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="Academy - Guides & Formations | Origines Media"
        description="Découvrez nos guides et formations pour votre développement personnel."
      />

      <Navbar />

      <main>
        {/* Hero Section - Style compact */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-pink-50/30 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-6 left-8 w-12 h-12 rounded-full bg-pink-400/10" />
        <div className="absolute top-1/3 right-12 w-8 h-8 rounded-full bg-amber-400/20" />
        <div className="absolute bottom-8 left-1/4 w-6 h-6 rounded-full bg-cyan-400/15" />
        <div className="absolute top-1/2 left-6 w-1.5 h-1.5 rounded-full bg-pink-400" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-amber-500" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <div className="grid lg:grid-cols-2 gap-4 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-pink-100 rounded-full text-gray-700 text-[8px] font-semibold uppercase tracking-wider mb-2">
                <BookOpen className="w-2 h-2 text-amber-500" />
                Formations Premium
              </span>

              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Origines{' '}
                <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                  Academy
                </span>
              </h1>

              <p className="text-gray-600 text-xs mb-3 leading-relaxed max-w-sm">
                Des guides conçus pour vous aider à écrire votre histoire et développer votre potentiel.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-[10px]">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-500" />
                  <span className="font-semibold text-gray-900">2,500+</span>
                  <span className="text-gray-500">apprenants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-gray-900">4.9/5</span>
                  <span className="text-gray-500">note</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Featured Guide Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-3 shadow-lg shadow-amber-500/10 ring-1 ring-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                    <img
                      src="/kit-introspection.jpg"
                      alt="Kit d'Introspection"
                      className="w-full h-full object-cover grayscale-[20%]"
                    />
                    {/* Badge overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 rounded-full text-amber-700 text-[8px] font-bold uppercase tracking-wider mb-1">
                      <Clock className="w-2 h-2" />
                      Bientôt
                    </span>
                    <h3 className="text-xs font-semibold text-gray-900 mb-0.5">Kit d'Introspection</h3>
                    <p className="text-[10px] text-gray-500 mb-2">Commencez votre voyage intérieur</p>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-[9px] font-semibold cursor-not-allowed"
                    >
                      Bientôt disponible
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="py-6 lg:py-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-6 bg-amber-500 rounded-full" />
              <h2 className="text-sm font-semibold text-gray-900">Nos formations</h2>
            </div>
            <span className="text-[10px] text-gray-500">{guides.length} programmes disponibles</span>
          </div>

          {/* Guides grid - 2 columns */}
          <div className="grid md:grid-cols-2 gap-3">
            {guides.map((guide, idx) => (
              <GuideCard key={guide.id} guide={guide} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Horizontal scroll style */}
      <section className="py-6 lg:py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-6 bg-pink-500 rounded-full" />
            <h2 className="text-sm font-semibold text-gray-900">Ce qu'ils en disent</h2>
          </div>

          {/* Testimonials row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="bg-white rounded-xl p-3 ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Rating */}
                <div className="flex gap-0.5 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-[11px] text-gray-600 mb-3 italic leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-[10px]">{testimonial.name}</p>
                    <p className="text-[9px] text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bientôt disponible */}
      <section className="py-6 lg:py-8 bg-gradient-to-br from-amber-50 via-white to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg shadow-orange-500/20"
          >
            <div className="p-4 lg:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded-full text-white/90 text-[9px] font-bold uppercase tracking-wider mb-2">
                  <Clock className="w-2.5 h-2.5" />
                  En préparation
                </div>
                <h3 className="text-base lg:text-lg font-bold text-white mb-1">
                  Nos formations arrivent bientôt
                </h3>
                <p className="text-white/80 text-[11px]">
                  Nous préparons des contenus de qualité pour vous accompagner.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/90 text-amber-700 rounded-full text-xs font-semibold cursor-default"
                >
                  <Clock className="w-3 h-3" />
                  Bientôt disponible
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Compact */}
      <section className="py-6 lg:py-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-6 bg-violet-500 rounded-full" />
            <h2 className="text-sm font-semibold text-gray-900">Questions fréquentes</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { q: 'Accès à vie ?', a: 'Oui, accès illimité à votre formation et mises à jour.' },
              { q: 'Remboursement ?', a: 'Garantie 30 jours satisfait ou remboursé.' },
              { q: 'Comment accéder ?', a: 'Email avec accès envoyé après achat.' },
              { q: 'Accompagnement ?', a: 'Q&A mensuelles incluses dans le Programme Complet.' }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-lg p-3 ring-1 ring-gray-100"
              >
                <h4 className="font-semibold text-gray-900 text-xs mb-1">{faq.q}</h4>
                <p className="text-[10px] text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default AcademyPage;
