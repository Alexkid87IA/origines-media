// src/pages/JoinPage.tsx
// Page Rejoindre l'équipe - Style minimaliste avec couleurs

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Heart, Briefcase, MapPin, Clock, ArrowRight,
  Send, CheckCircle, Video, Pen, Megaphone, Code,
  Camera, Music, Palette, BookOpen, Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const JoinPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Offres d'emploi
  const jobOpenings = [
    {
      id: 'journaliste',
      title: 'Journaliste / Rédacteur',
      type: 'CDI',
      location: 'Paris',
      description: 'Vous rédigez des récits authentiques et menez des interviews inspirantes.',
      icon: Pen,
      color: '#8B5CF6',
    },
    {
      id: 'realisateur',
      title: 'Réalisateur / Vidéaste',
      type: 'CDI',
      location: 'Paris',
      description: 'Vous donnez vie à nos histoires à travers des productions vidéo de qualité.',
      icon: Video,
      color: '#EC4899',
    },
    {
      id: 'community',
      title: 'Community Manager',
      type: 'CDI',
      location: 'Paris / Remote',
      description: 'Vous animez notre communauté et développez notre présence sur les réseaux.',
      icon: Megaphone,
      color: '#F59E0B',
    },
    {
      id: 'dev',
      title: 'Développeur Full Stack',
      type: 'CDI',
      location: 'Remote',
      description: 'Vous construisez les outils qui permettent à nos récits de toucher des millions de personnes.',
      icon: Code,
      color: '#10B981',
    },
  ];

  // Valeurs de l'équipe
  const teamValues = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'L\'amour des belles histoires',
      color: '#EC4899',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'On construit ensemble',
      color: '#8B5CF6',
    },
    {
      icon: Palette,
      title: 'Créativité',
      description: 'L\'innovation au quotidien',
      color: '#F59E0B',
    },
    {
      icon: BookOpen,
      title: 'Authenticité',
      description: 'La vérité avant tout',
      color: '#10B981',
    },
  ];

  // Stats équipe
  const teamStats = [
    { value: '15+', label: 'Membres', color: '#8B5CF6' },
    { value: '5B', label: 'Vues générées', color: '#EC4899' },
    { value: '100%', label: 'Remote-friendly', color: '#10B981' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="Rejoindre l'équipe - Carrières"
        description="Rejoignez l'équipe Origines Media. Découvrez nos offres d'emploi et participez à la création de contenus qui inspirent des millions de personnes."
        url="/rejoindre"
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
                  Rejoindre l'équipe
                </h1>
                <p className="text-gray-500 text-xs">
                  Créez l'impact avec nous
                </p>
              </div>

              {/* Quick stats inline */}
              <div className="flex items-center gap-2">
                {teamStats.map((stat, index) => (
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

        {/* Intro Section */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

              {/* Main intro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl p-5 text-white"
              >
                <h2 className="text-base lg:text-lg font-bold mb-2">
                  Construisez l'avenir du média avec nous
                </h2>
                <p className="text-white/80 text-xs leading-relaxed mb-4">
                  Chez <strong className="text-white">Origines</strong>, nous croyons au pouvoir des histoires pour transformer les vies.
                  Rejoignez une équipe passionnée qui produit des contenus vus par des millions de personnes.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {teamValues.map((value, index) => {
                    const IconComponent = value.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur rounded-lg p-2 flex items-center gap-2"
                      >
                        <IconComponent className="w-4 h-4 text-white/80" />
                        <div>
                          <div className="text-[10px] font-bold">{value.title}</div>
                          <div className="text-[8px] text-white/60">{value.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Avantages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 space-y-2"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <h3 className="font-semibold text-[11px] text-gray-900 mb-2">
                    Pourquoi nous rejoindre
                  </h3>
                  <ul className="space-y-1.5">
                    {[
                      { text: 'Impact réel sur des millions de vies', icon: Heart, color: '#EC4899' },
                      { text: 'Équipe jeune et dynamique', icon: Users, color: '#8B5CF6' },
                      { text: 'Flexibilité remote / hybride', icon: MapPin, color: '#10B981' },
                      { text: 'Projets créatifs variés', icon: Palette, color: '#F59E0B' },
                    ].map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <li key={index} className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${item.color}15` }}
                          >
                            <IconComponent className="w-2.5 h-2.5" style={{ color: item.color }} />
                          </div>
                          <span className="text-[10px] text-gray-700">{item.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-[10px] text-amber-700">
                    <strong>Candidatures spontanées :</strong> Même si aucune offre ne correspond à votre profil, n'hésitez pas à nous écrire !
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Offres d'emploi */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-pink-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Offres actuelles
              </span>
            </div>

            <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-4">
              Postes ouverts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {jobOpenings.map((job, index) => {
                const IconComponent = job.icon;
                const isSelected = selectedJob === job.id;

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedJob(isSelected ? null : job.id)}
                    className={`bg-white rounded-xl p-4 border cursor-pointer transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-gray-300 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Colored top bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: job.color }}
                    />

                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${job.color}15` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: job.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-gray-900 mb-1">
                          {job.title}
                        </h3>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-medium text-gray-600">
                            <Briefcase className="w-2 h-2" />
                            {job.type}
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-medium text-gray-600">
                            <MapPin className="w-2 h-2" />
                            {job.location}
                          </span>
                        </div>

                        <p className="text-[10px] text-gray-500 leading-relaxed">
                          {job.description}
                        </p>

                        {isSelected && (
                          <motion.button
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('candidature-form')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-white text-[10px] font-bold rounded-lg transition-all"
                            style={{ backgroundColor: job.color }}
                          >
                            Postuler
                            <ArrowRight className="w-2.5 h-2.5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Formulaire de candidature */}
        <section id="candidature-form" className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-violet-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Candidature
              </span>
            </div>

            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-4 border border-gray-200 max-w-2xl"
              >
                <h2 className="text-sm font-bold text-gray-900 mb-1">
                  {selectedJob
                    ? `Postuler pour : ${jobOpenings.find(j => j.id === selectedJob)?.title}`
                    : 'Envoyez votre candidature'}
                </h2>
                <p className="text-[10px] text-gray-500 mb-4">
                  {selectedJob
                    ? 'Remplissez le formulaire ci-dessous'
                    : 'Candidature spontanée ou pour un poste spécifique'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-[10px] font-medium text-gray-700 mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-300"
                        placeholder="Jean Dupont"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-[10px] font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-300"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label htmlFor="linkedin" className="block text-[10px] font-medium text-gray-700 mb-1">
                      LinkedIn / Portfolio (optionnel)
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-300"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-[10px] font-medium text-gray-700 mb-1">
                      Présentez-vous *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-300 resize-none"
                      placeholder="Parlez-nous de vous, votre parcours et pourquoi vous souhaitez rejoindre Origines..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    className="w-full sm:w-auto py-2 px-5 bg-violet-600 text-white text-[11px] font-bold rounded-lg hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Envoi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Envoyer ma candidature</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 max-w-2xl text-center"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Candidature envoyée !
                </h3>

                <p className="text-gray-600 text-xs mb-4">
                  Merci {formData.name.split(' ')[0]} ! Nous étudions votre profil et reviendrons vers vous très vite.
                </p>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', linkedin: '', message: '' });
                    setSelectedJob(null);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-[10px] font-medium rounded-lg hover:bg-gray-50 transition-all"
                >
                  <span>Nouvelle candidature</span>
                </button>
              </motion.div>
            )}
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
                Une question sur nos offres ?
              </h2>
              <p className="text-gray-400 text-xs mb-5 max-w-md mx-auto">
                N'hésitez pas à nous contacter pour en savoir plus sur la vie chez Origines.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href="mailto:jobs@origines.media"
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-100 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  jobs@origines.media
                </a>

                <Link
                  to="/a-propos"
                  className="group inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white/10 text-white text-xs font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  En savoir plus sur nous
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JoinPage;
