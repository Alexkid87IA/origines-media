// src/pages/EnsemblePage.tsx
// Page Ensemble - Hub central Origines - Style cohérent avec HomePage

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, BookOpen, Film, Users, Heart,
  Mail, MessageCircle, Handshake, Sparkles, Check,
  Instagram, Youtube, Compass, Layers, ChevronDown,
  ArrowUpRight, Lightbulb, PenLine, Target
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { typo } from '../lib/typography';

// Nos formats de contenu
const contentFormats = [
  {
    id: 'series',
    title: 'Nos séries',
    description: 'Des récits en plusieurs épisodes pour explorer en profondeur',
    longDescription: 'Plongez dans nos séries documentaires qui explorent des thématiques fortes à travers plusieurs épisodes. Chaque série est une immersion complète dans un univers, avec des témoignages authentiques et des perspectives variées.',
    icon: Play,
    href: '/series',
    color: '#6366F1',
    stat: '6 séries',
    cta: 'Découvrir les séries'
  },
  {
    id: 'videos',
    title: 'Nos vidéos',
    description: 'Portraits, interviews et documentaires courts',
    longDescription: 'Des formats vidéo variés pour découvrir des histoires inspirantes : portraits intimistes, interviews approfondies, mini-documentaires et témoignages percutants. Chaque vidéo est une fenêtre sur un parcours unique.',
    icon: Film,
    href: '/videos',
    color: '#06B6D4',
    stat: '50+ vidéos',
    cta: 'Voir les vidéos'
  },
  {
    id: 'bibliotheque',
    title: 'La bibliothèque',
    description: 'Articles, analyses et réflexions approfondies',
    longDescription: 'Notre bibliothèque rassemble articles de fond, analyses et réflexions sur des sujets qui comptent. Un espace pour prendre le temps de lire, comprendre et s\'inspirer à travers des contenus écrits de qualité.',
    icon: BookOpen,
    href: '/bibliotheque',
    color: '#F59E0B',
    stat: '100+ articles',
    cta: 'Explorer la bibliothèque'
  },
  {
    id: 'univers',
    title: 'Les univers',
    description: 'Psychologie, Société, Carrière, Art & Créativité...',
    longDescription: 'Nos contenus sont organisés par univers thématiques : Psychologie, Société, Carrière, Art & Créativité, Spiritualité... Chaque univers regroupe des histoires et réflexions autour d\'un même fil conducteur.',
    icon: Compass,
    href: '/univers',
    color: '#8B5CF6',
    stat: '5 univers',
    cta: 'Parcourir les univers'
  },
];

// Nos valeurs
const values = [
  {
    title: 'Authenticité',
    description: 'Des histoires vraies, sans filtre ni artifice',
    color: '#EC4899'
  },
  {
    title: 'Diversité',
    description: 'Des voix multiples et des parcours variés',
    color: '#F97316'
  },
  {
    title: 'Inspiration',
    description: 'Des récits qui donnent envie d\'agir',
    color: '#8B5CF6'
  },
];

// Réseaux sociaux - Où nous trouver
const socialPresence = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://instagram.com/originesmedia',
    color: '#E4405F',
    handle: '@originesmedia',
    followers: '12K',
    description: 'Coulisses, stories et extraits quotidiens'
  },
  {
    name: 'YouTube',
    icon: Youtube,
    href: 'https://youtube.com/@originesmedia',
    color: '#FF0000',
    handle: 'Origines Media',
    followers: '8K',
    description: 'Toutes nos vidéos et séries complètes'
  },
];

// Interactions communauté
const communityActions = [
  {
    title: 'Racontez votre histoire',
    description: 'Vous avez un parcours, une expérience à partager ? On veut vous entendre.',
    icon: PenLine,
    href: '/racontez-votre-histoire',
    color: '#F97316',
    cta: 'Soumettre mon histoire'
  },
  {
    title: 'Proposez une amélioration',
    description: 'Une idée pour améliorer Origines ? Vos retours nous font avancer.',
    icon: Lightbulb,
    href: '/contact?sujet=suggestion',
    color: '#10B981',
    cta: 'Faire une suggestion'
  },
  {
    title: 'Suggérez un sujet',
    description: 'Un thème qu\'on devrait explorer ? Un angle qu\'on a manqué ?',
    icon: Target,
    href: '/contact?sujet=idee',
    color: '#8B5CF6',
    cta: 'Proposer un sujet'
  },
];

// Points de contact
const contactPoints = [
  {
    title: 'Rejoindre l\'équipe',
    description: 'Contributeur, créateur ou partenaire',
    icon: Users,
    href: '/rejoindre',
    color: '#F97316'
  },
  {
    title: 'Nous contacter',
    description: 'Une question, une idée ?',
    icon: MessageCircle,
    href: '/contact',
    color: '#10B981'
  },
  {
    title: 'Partenariats',
    description: 'Collaborons ensemble',
    icon: Handshake,
    href: '/partenariats',
    color: '#8B5CF6'
  },
];

// Content Format Card avec Accordion
const ContentFormatCard: React.FC<{
  format: typeof contentFormats[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ format, index, isExpanded, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <div
        className={`rounded-xl overflow-hidden transition-all duration-300 bg-white ${
          isExpanded ? 'ring-2' : 'ring-1 hover:ring-2'
        } ring-gray-200`}
        style={{
          boxShadow: isExpanded
            ? `0 20px 40px -12px rgba(0,0,0,0.15), 0 0 0 2px ${format.color}`
            : '0 2px 12px -4px rgba(0,0,0,0.08)',
          ringColor: isExpanded ? format.color : undefined,
        }}
      >
        {/* Header cliquable */}
        <button
          onClick={onToggle}
          className="w-full text-left"
        >
          <div className="relative p-4 flex items-start gap-3 min-h-[88px]">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: `${format.color}15`,
                  boxShadow: isExpanded ? `0 4px 12px -2px ${format.color}40` : 'none',
                  border: isExpanded ? `2px solid ${format.color}` : '2px solid transparent',
                }}
              >
                <format.icon className="w-5 h-5" style={{ color: format.color }} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {format.title}
                </h3>
                <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {format.stat}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {format.description}
              </p>
            </div>

            {/* Arrow */}
            <div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{
                backgroundColor: isExpanded ? `${format.color}15` : '#f3f4f6',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ChevronDown
                className="w-3.5 h-3.5 transition-colors duration-300"
                style={{ color: isExpanded ? format.color : '#9ca3af' }}
                strokeWidth={2}
              />
            </div>

            {/* Bordure gauche colorée */}
            <div
              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: format.color,
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'scaleY(1)' : 'scaleY(0)',
              }}
            />
          </div>
        </button>

        {/* Dropdown Content - Toujours rendu, hauteur animée */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            <div className="p-4 bg-gray-50/50">
              {/* Description longue */}
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {format.longDescription}
              </p>

              {/* CTA */}
              <div className="flex items-center justify-end">
                <Link
                  to={format.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: format.color,
                    boxShadow: `0 4px 12px ${format.color}40`
                  }}
                >
                  {format.cta}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function EnsemblePage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFormat, setExpandedFormat] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="Ensemble - Découvrir Origines"
        description="Découvrez l'univers Origines Media. Des contenus d'utilité publique : séries, vidéos et articles qui inspirent, transforment et éclairent."
        url="/ensemble"
      />
      <Navbar />

      <main>
        {/* ========== HERO - Simple & Clean avec Slogan ========== */}
        <section className="bg-gray-50/50 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-6 left-8 w-10 h-10 rounded-full bg-orange-400/10" />
          <div className="absolute top-1/3 right-10 w-6 h-6 rounded-full bg-violet-400/15" />
          <div className="absolute bottom-4 left-1/4 w-8 h-8 rounded-full bg-cyan-400/10" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              {/* Badge avec slogan */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full text-gray-700 text-[10px] font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3 text-orange-500" />
                Des contenus d'utilité publique
              </span>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {typo("Bienvenue dans l'univers Origines")}
              </h1>

              <p className="text-gray-500 text-sm lg:text-base leading-relaxed mb-6">
                {typo("Origines Media raconte des histoires qui inspirent, transforment et éclairent. Des récits authentiques portés par des voix diverses.")}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/a-propos"
                  className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors"
                >
                  Qui sommes-nous
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/bibliotheque"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-full font-medium text-xs ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-sm transition-all"
                >
                  <BookOpen className="w-3 h-3" />
                  Explorer les contenus
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========== CE QU'ON FAIT - Formats avec Accordion ========== */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                Ce qu'on fait
              </h2>
              <p className="text-gray-500 text-xs">
                Différentes façons de découvrir nos histoires
              </p>
            </div>

            {/* Grid de formats - hauteur égale */}
            <div className="grid sm:grid-cols-2 gap-3">
              {contentFormats.map((format, index) => (
                <ContentFormatCard
                  key={format.id}
                  format={format}
                  index={index}
                  isExpanded={expandedFormat === format.id}
                  onToggle={() => setExpandedFormat(expandedFormat === format.id ? null : format.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ========== NOS VALEURS ========== */}
        <section className="py-6 lg:py-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                En quoi on croit
              </h2>
              <p className="text-gray-500 text-xs">
                Les valeurs qui guident chacune de nos histoires
              </p>
            </div>

            {/* Values grid */}
            <div className="grid sm:grid-cols-3 gap-3">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-xl p-4 ring-1 ring-gray-100"
                >
                  <div
                    className="w-2 h-2 rounded-full mb-3"
                    style={{ backgroundColor: value.color }}
                  />
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {value.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Link to À propos */}
            <div className="mt-4 text-center">
              <Link
                to="/a-propos"
                className="inline-flex items-center gap-1.5 text-gray-600 text-xs font-medium hover:text-gray-900 transition-colors"
              >
                En savoir plus sur notre mission
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========== RÉSEAUX SOCIAUX - Où nous trouver ========== */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                Où nous trouver
              </h2>
              <p className="text-gray-500 text-xs">
                Suivez-nous sur les réseaux pour ne rien manquer
              </p>
            </div>

            {/* Social cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              {socialPresence.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="group flex items-center gap-4 p-4 bg-white rounded-xl ring-1 ring-gray-200 hover:ring-2 hover:shadow-lg transition-all duration-300"
                  style={{ '--hover-ring': social.color } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 25px -5px ${social.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${social.color}15` }}
                  >
                    <social.icon className="w-6 h-6" style={{ color: social.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {social.name}
                      </h3>
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {social.followers} abonnés
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-1">
                      {social.handle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {social.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    className="w-4 h-4 flex-shrink-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: social.color }}
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ========== PARTICIPEZ - Interaction Communauté ========== */}
        <section className="py-6 lg:py-8 bg-gradient-to-br from-orange-50 via-white to-pink-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                Participez
              </h2>
              <p className="text-gray-500 text-xs">
                Origines, c'est aussi vous — contribuez au projet
              </p>
            </div>

            {/* Community actions grid */}
            <div className="grid sm:grid-cols-3 gap-3">
              {communityActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={action.href}
                    className="group block h-full p-4 bg-white rounded-xl ring-1 ring-gray-100 hover:ring-2 hover:shadow-lg transition-all duration-300"
                    style={{ '--hover-ring': action.color } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 25px -5px ${action.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '';
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${action.color}15` }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>

                    {/* Content */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      {action.description}
                    </p>

                    {/* CTA */}
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-semibold transition-all group-hover:gap-1.5"
                      style={{ color: action.color }}
                    >
                      {action.cta}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== POINTS DE CONTACT ========== */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                Restons en contact
              </h2>
              <p className="text-gray-500 text-xs">
                Rejoignez-nous ou collaborons ensemble
              </p>
            </div>

            {/* Contact cards */}
            <div className="grid sm:grid-cols-3 gap-3">
              {contactPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={point.href}
                    className="group flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-white hover:ring-1 hover:ring-gray-200 hover:shadow-sm transition-all"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${point.color}15` }}
                    >
                      <point.icon className="w-4 h-4" style={{ color: point.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-900">
                        {point.title}
                      </h3>
                      <p className="text-[10px] text-gray-500">
                        {point.description}
                      </p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== NEWSLETTER ========== */}
        <section className="py-6 lg:py-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden bg-white shadow-lg shadow-cyan-500/10 border border-gray-100"
            >
              <div className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Left - Content */}
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-cyan-100 to-pink-100 rounded-full text-gray-700 text-[8px] font-semibold uppercase tracking-wider mb-2">
                      <Mail className="w-2 h-2 text-pink-500" />
                      Newsletter
                    </span>
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1">
                      Restez inspiré chaque semaine
                    </h3>
                    <p className="text-gray-500 text-xs">
                      Nos meilleures histoires et recommandations, directement dans votre boîte mail.
                    </p>
                  </div>

                  {/* Right - Form */}
                  <div className="sm:w-64">
                    {!isSubmitted ? (
                      <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
                          placeholder="votre@email.com"
                        />
                        <button
                          type="submit"
                          className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-xs font-bold rounded-lg hover:from-cyan-600 hover:to-pink-600 transition-all flex items-center justify-center gap-1 shadow-lg shadow-pink-500/20"
                        >
                          S'inscrire
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </form>
                    ) : (
                      <div className="p-3 bg-gradient-to-r from-cyan-50 to-pink-50 rounded-lg text-center border border-cyan-100">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center mx-auto mb-1.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-gray-700 text-xs font-medium">
                          Merci ! Vérifiez votre boîte mail.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
