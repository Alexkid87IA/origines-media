// src/pages/NewsletterPage.tsx
// Page Newsletter - Style minimaliste avec couleurs

import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail, CheckCircle, Bell, BookOpen,
  Video, Heart, Gift, Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const NewsletterPage: React.FC = () => {

  // Avantages newsletter
  const benefits = [
    {
      icon: BookOpen,
      title: 'Récits exclusifs',
      description: 'Accès en avant-première à nos histoires les plus inspirantes',
      color: '#8B5CF6',
    },
    {
      icon: Video,
      title: 'Coulisses vidéo',
      description: 'Les making-of et interviews bonus de nos productions',
      color: '#EC4899',
    },
    {
      icon: Heart,
      title: 'Sélections personnalisées',
      description: 'Des recommandations basées sur vos univers préférés',
      color: '#F59E0B',
    },
    {
      icon: Gift,
      title: 'Contenus exclusifs',
      description: 'Des ressources et surprises réservées aux abonnés',
      color: '#10B981',
    },
  ];

  // Stats newsletter (à venir)
  const stats = [
    { value: '1/sem', label: 'Fréquence', color: '#8B5CF6' },
    { value: 'Gratuit', label: 'Toujours', color: '#10B981' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="Newsletter - Restez inspirés"
        description="Inscrivez-vous à la newsletter Origines Media. Recevez nos meilleurs récits, coulisses de tournage et recommandations directement dans votre boîte mail."
        url="/newsletter"
      />

      <Navbar />

      <main>
        {/* Hero Section - Compact */}
        <section className="py-4 lg:py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <div className="h-0.5 w-10 bg-violet-500 rounded-full mb-2" />
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                  Newsletter
                </h1>
                <p className="text-gray-500 text-xs">
                  Restez connectés à nos histoires
                </p>
              </div>

              {/* Quick stats inline */}
              <div className="flex items-center gap-2">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-full"
                  >
                    <span className="text-xs font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                    <span className="text-[8px] text-gray-500 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Section */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

              {/* Formulaire */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3"
              >
                  {/* Coming Soon State */}
                <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold">Newsletter Origines</h2>
                      <p className="text-[10px] text-white/70">Une dose d'inspiration chaque semaine</p>
                    </div>
                  </div>

                  {/* Coming Soon Badge */}
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-5 text-center">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-base font-bold mb-2">Bientôt disponible</h3>
                    <p className="text-white/80 text-xs mb-4 max-w-xs mx-auto">
                      Nous préparons une newsletter de qualité pour vous accompagner chaque semaine.
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/30 rounded-full text-[11px] font-semibold">
                      <Clock className="w-3 h-3" />
                      En préparation
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Info Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 space-y-2"
              >
                {/* Ce que vous recevrez */}
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <h3 className="font-semibold text-[11px] text-gray-900 mb-2">
                    Ce que vous recevrez
                  </h3>
                  <ul className="space-y-1.5">
                    {[
                      'Notre sélection hebdomadaire de récits',
                      'Les coulisses de nos productions',
                      'Des interviews exclusives',
                      'Les actualités de la communauté',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-[10px] text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fréquence */}
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                      <Bell className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[11px] text-gray-900">Une fois par semaine</h3>
                      <p className="text-[9px] text-gray-500">Le vendredi matin</p>
                    </div>
                  </div>
                </div>

                {/* Désabonnement */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-[10px] text-amber-700">
                    <strong>Promis :</strong> Pas de spam, pas de revente de données. Désabonnement en 1 clic.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Avantages Section */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-pink-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Avantages exclusifs
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md transition-all group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${benefit.color}15` }}
                    >
                      <IconComponent
                        className="w-4 h-4"
                        style={{ color: benefit.color }}
                      />
                    </div>
                    <h3 className="font-bold text-[11px] text-gray-900 mb-0.5">
                      {benefit.title}
                    </h3>
                    <p className="text-[9px] text-gray-500 leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Témoignages Section */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-violet-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Ce qu'ils en disent
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  quote: "La seule newsletter que j'ouvre systématiquement. Les histoires sont toujours touchantes.",
                  name: 'Sophie M.',
                  role: 'Abonnée depuis 2023',
                  color: '#8B5CF6',
                },
                {
                  quote: "J'adore les coulisses de tournage et les interviews exclusives. Un vrai plus !",
                  name: 'Thomas L.',
                  role: 'Abonné depuis 2022',
                  color: '#EC4899',
                },
                {
                  quote: "Des recommandations personnalisées qui tombent toujours juste. Merci Origines !",
                  name: 'Marie D.',
                  role: 'Abonnée depuis 2024',
                  color: '#F59E0B',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 relative"
                >
                  {/* Colored top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                    style={{ backgroundColor: testimonial.color }}
                  />

                  <p className="text-[10px] text-gray-600 leading-relaxed mb-3 italic">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                      style={{ backgroundColor: testimonial.color }}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[10px] text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-[8px] text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-8 lg:py-10 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-lg lg:text-xl font-bold mb-2">
                La newsletter arrive bientôt
              </h2>
              <p className="text-gray-400 text-xs mb-5 max-w-md mx-auto">
                Nous préparons une expérience unique pour vous accompagner chaque semaine.
              </p>

              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                Bientôt disponible
              </span>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NewsletterPage;
