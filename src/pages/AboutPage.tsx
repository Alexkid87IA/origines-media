// src/pages/AboutPage.tsx
// Design épuré - Style minimaliste blanc

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Users, Heart, Target, Globe, Lightbulb,
  Sparkles, Quote
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EngagementSection from '../components/EngagementSection';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "Fondatrice & Directrice Éditoriale",
      description: "Ancienne journaliste, Marie a créé Origines pour donner une voix aux récits authentiques qui transforment.",
      imageUrl: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Thomas Martin",
      role: "Directeur Créatif",
      description: "Réalisateur et storyteller, Thomas orchestre la dimension visuelle et narrative de nos productions.",
      imageUrl: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Sophie Chen",
      role: "Responsable Communauté",
      description: "Psychologue de formation, Sophie cultive les liens avec notre communauté et anime nos échanges.",
      imageUrl: "/placeholder.svg"
    }
  ];

  // Values data
  const values = [
    {
      icon: Heart,
      title: "Authenticité",
      description: "Nous privilégions les récits vrais, sans filtre, qui touchent au cœur de l'expérience humaine.",
      color: "#EC4899"
    },
    {
      icon: Target,
      title: "Profondeur",
      description: "Nous creusons au-delà de la surface pour révéler les nuances et la complexité de chaque histoire.",
      color: "#8B5CF6"
    },
    {
      icon: Globe,
      title: "Diversité",
      description: "Nous célébrons la richesse des perspectives et des expériences de toutes les communautés.",
      color: "#10B981"
    },
    {
      icon: Lightbulb,
      title: "Inspiration",
      description: "Nous croyons au pouvoir transformateur des récits pour éclairer et guider nos vies.",
      color: "#F59E0B"
    }
  ];

  // Stats data
  const stats = [
    { value: "2021", label: "Création", color: "#8B5CF6" },
    { value: "500+", label: "Récits", color: "#D946EF" },
    { value: "50K+", label: "Lecteurs", color: "#10B981" },
    { value: "10", label: "Univers", color: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="À propos - Qui sommes-nous"
        description="Origines Media produit des contenus d'utilité publique. Découvrez notre équipe, notre mission et nos valeurs. Des récits authentiques qui inspirent et transforment."
        url="/a-propos"
      />
      <Navbar />

      <main>
        {/* Hero Section - Compact */}
        <section className="py-4 lg:py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                  À propos d'Origines
                </h1>
                <p className="text-gray-500 text-xs">
                  Notre histoire, mission et valeurs
                </p>
              </div>

              {/* Quick stats inline */}
              <div className="flex items-center gap-2">
                {[
                  { value: "2021", label: "Création" },
                  { value: "500+", label: "Récits" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs font-bold text-gray-900">{stat.value}</span>
                    <span className="text-[8px] text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section - Compact Bento */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

              {/* Main Mission Card (3 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 bg-white rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-0.5 w-6 bg-violet-500 rounded-full" />
                  <span className="text-[9px] font-bold text-violet-600 uppercase tracking-wider">Mission</span>
                </div>

                <h2 className="text-sm lg:text-base font-bold text-gray-900 mb-2">
                  Des contenus d'utilité publique
                </h2>

                <div className="space-y-2 text-gray-600 text-[11px] leading-relaxed">
                  <p>
                    <strong className="text-gray-900">Origines Media</strong> produit des contenus d'utilité publique :
                    des récits authentiques qui ont le pouvoir de transformer nos vies et nos perspectives.
                  </p>
                  <p>
                    Dans un monde saturé d'informations superficielles, nous créons un espace dédié
                    aux histoires qui comptent vraiment — celles qui inspirent, éclairent et font avancer.
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full hover:bg-gray-800 transition-all"
                  >
                    <span>Nous contacter</span>
                    <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>

              {/* Stats Grid (2 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 grid grid-cols-2 gap-2"
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-3 border border-gray-200 text-center hover:shadow-md transition-shadow"
                  >
                    <div
                      className="text-xl lg:text-2xl font-bold mb-0.5"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section - Compact */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
              <div>
                <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                  Nos valeurs
                </h2>
                <p className="text-gray-500 text-xs">
                  Les principes qui guident notre travail éditorial
                </p>
              </div>
            </div>

            {/* Values Grid - Horizontal scroll on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-gray-50 border border-gray-200 rounded-xl p-3 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                  >
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${value.color}15` }}
                    >
                      <IconComponent className="w-4 h-4" style={{ color: value.color }} />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-xs text-gray-900 mb-1">
                      {value.title}
                    </h3>
                    <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quote Section - Compact */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6"
            >
              <div className="flex items-start gap-3">
                <Quote className="w-6 h-6 text-violet-300 flex-shrink-0 mt-0.5" />

                <div className="flex-1">
                  <blockquote className="text-sm lg:text-base text-gray-900 font-medium leading-relaxed mb-3">
                    "Les récits qui nous transforment ne sont pas ceux qui nous divertissent,
                    mais ceux qui nous révèlent à nous-mêmes."
                  </blockquote>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt="Marie Dubois"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-[11px] text-gray-900">Marie Dubois</div>
                      <div className="text-[9px] text-violet-600">Fondatrice, Origines Media</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section - Compact */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
              <div>
                <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                  Notre équipe
                </h2>
                <p className="text-gray-500 text-xs">
                  Les personnes qui donnent vie à Origines Media
                </p>
              </div>

              <Link
                to="/equipe"
                className="group inline-flex items-center gap-1 text-gray-900 font-medium text-xs hover:text-violet-600 transition-colors"
              >
                <span>Toute l'équipe</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Team Grid - Compact cards */}
            <div className="grid grid-cols-3 gap-2 lg:gap-3">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-xl aspect-[3/4]"
                >
                  {/* Image */}
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-2 lg:p-3">
                    <h3 className="font-bold text-[10px] lg:text-xs text-white mb-0.5 line-clamp-1">
                      {member.name}
                    </h3>
                    <div className="text-violet-300 font-medium text-[8px] lg:text-[9px] uppercase tracking-wider line-clamp-1">
                      {member.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Engagement Section */}
        <EngagementSection />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
