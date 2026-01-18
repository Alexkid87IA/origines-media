// src/pages/ShareStoryPage.tsx
// Page "Racontez votre histoire" - Structure complète optimisée

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import {
  ArrowRight,
  PenLine,
  Video,
  Mic,
  BookOpen,
  Film,
  Send,
  Heart,
  Quote,
  Check,
  Play,
  Users,
  Sparkles,
  Clock,
  Shield,
  Eye,
  MessageCircle,
  Globe,
  Lightbulb,
  Target,
  Phone,
  Calendar,
  FileText
} from 'lucide-react';

// ============ DATA ============

// Vidéo/histoire featured pour le hero
const featuredStory = {
  title: "Comment j'ai reconstruit ma vie après un burn-out",
  author: 'Nadia K.',
  role: 'Entrepreneuse, 34 ans',
  thumbnail: '/placeholder.svg',
  videoUrl: '#',
  duration: '8:24',
  views: '45K',
  category: 'Santé mentale',
  color: '#8B5CF6',
};

// Étapes du processus - redesign
const processSteps = [
  {
    number: '01',
    title: 'Premier contact',
    desc: 'Remplissez le formulaire en 2 minutes. Parlez-nous de vous et de votre histoire.',
    icon: Send,
    color: '#6366F1',
    detail: 'Réponse sous 48h',
  },
  {
    number: '02',
    title: 'Appel découverte',
    desc: 'On vous rappelle pour faire connaissance. 20 minutes pour comprendre votre parcours.',
    icon: Phone,
    color: '#EC4899',
    detail: 'Sans engagement',
  },
  {
    number: '03',
    title: 'Préparation',
    desc: 'On structure ensemble votre récit. Coaching personnalisé si besoin.',
    icon: Calendar,
    color: '#F59E0B',
    detail: 'À votre rythme',
  },
  {
    number: '04',
    title: 'Création',
    desc: 'Tournage, rédaction ou enregistrement avec notre équipe professionnelle.',
    icon: Sparkles,
    color: '#10B981',
    detail: 'Qualité pro',
  },
];

// Grille d'histoires publiées (vraies vidéos/articles)
const publishedStories = [
  {
    id: '1',
    title: "J'ai quitté mon CDI pour devenir artisan",
    author: 'Thomas R.',
    thumbnail: '/placeholder.svg',
    type: 'video',
    duration: '6:12',
    views: '32K',
    category: 'Reconversion',
    color: '#F59E0B',
    slug: 'quitter-cdi-artisan',
  },
  {
    id: '2',
    title: 'Vivre avec la bipolarité au quotidien',
    author: 'Camille L.',
    thumbnail: '/placeholder.svg',
    type: 'video',
    duration: '12:45',
    views: '89K',
    category: 'Santé mentale',
    color: '#8B5CF6',
    slug: 'vivre-bipolarite',
  },
  {
    id: '3',
    title: "L'adoption de notre fille en Colombie",
    author: 'Marie & Jean',
    thumbnail: '/placeholder.svg',
    type: 'article',
    readTime: '8 min',
    views: '28K',
    category: 'Famille',
    color: '#EC4899',
    slug: 'adoption-colombie',
  },
  {
    id: '4',
    title: 'Mon coming-out à 45 ans',
    author: 'Patrick M.',
    thumbnail: '/placeholder.svg',
    type: 'podcast',
    duration: '42 min',
    views: '56K',
    category: 'Identité',
    color: '#10B981',
    slug: 'coming-out-45-ans',
  },
  {
    id: '5',
    title: 'Reconstruire après la perte de mon fils',
    author: 'Sophie D.',
    thumbnail: '/placeholder.svg',
    type: 'livre',
    readTime: '280 pages',
    views: '124K',
    category: 'Deuil',
    color: '#6366F1',
    slug: 'reconstruire-perte-fils',
  },
  {
    id: '6',
    title: "De SDF à chef d'entreprise",
    author: 'Karim B.',
    thumbnail: '/placeholder.svg',
    type: 'video',
    duration: '9:18',
    views: '210K',
    category: 'Parcours',
    color: '#EF4444',
    slug: 'sdf-chef-entreprise',
  },
];

// Raisons de partager - Version premium
const reasons = [
  {
    icon: Heart,
    title: 'Aider quelqu\'un',
    desc: 'Votre histoire pourrait être exactement ce dont quelqu\'un a besoin aujourd\'hui',
    stat: '2M+',
    statLabel: 'messages reçus',
    color: '#EC4899',
  },
  {
    icon: Lightbulb,
    title: 'Donner du sens',
    desc: 'Transformez votre vécu en quelque chose de plus grand que vous',
    stat: '89%',
    statLabel: 'se sentent libérés',
    color: '#F59E0B',
  },
  {
    icon: Users,
    title: 'Rejoindre une communauté',
    desc: 'Faites partie d\'un mouvement de 1 000+ personnes qui osent raconter',
    stat: '1K+',
    statLabel: 'témoins actifs',
    color: '#8B5CF6',
  },
  {
    icon: Sparkles,
    title: 'Créer un héritage',
    desc: 'Laissez une trace qui inspirera encore dans 10, 20, 50 ans',
    stat: '10B+',
    statLabel: 'vues totales',
    color: '#10B981',
  },
];

// Stats d'impact
const impactStats = [
  { value: '10B+', label: 'vues cumulées', icon: Eye },
  { value: '1 000+', label: 'histoires partagées', icon: FileText },
  { value: '2M+', label: 'messages de soutien', icon: MessageCircle },
  { value: '45+', label: 'pays touchés', icon: Globe },
];

// Tous les formats disponibles (5 formats)
const formats = [
  {
    id: 'video',
    icon: Video,
    title: 'Vidéo',
    subtitle: 'Le plus impactant',
    desc: 'Tournage pro chez vous ou en studio.',
    duration: '4-6 semaines',
    color: '#EC4899',
    popular: true,
  },
  {
    id: 'article',
    icon: PenLine,
    title: 'Article',
    subtitle: 'Pour les plumes',
    desc: 'Vous écrivez, on édite ensemble.',
    duration: '2-4 semaines',
    color: '#6366F1',
    popular: false,
  },
  {
    id: 'podcast',
    icon: Mic,
    title: 'Podcast',
    subtitle: 'En toute intimité',
    desc: 'Juste votre voix, idéal pour l\'anonymat.',
    duration: '2-3 semaines',
    color: '#10B981',
    popular: false,
  },
  {
    id: 'livre',
    icon: BookOpen,
    title: 'Livre',
    subtitle: 'Pour les épopées',
    desc: 'Votre histoire en version longue.',
    duration: '3-6 mois',
    color: '#F59E0B',
    popular: false,
  },
  {
    id: 'documentaire',
    icon: Film,
    title: 'Documentaire',
    subtitle: 'L\'immersion totale',
    desc: 'Format long, plusieurs témoins.',
    duration: '6-12 mois',
    color: '#EF4444',
    popular: false,
  },
];

// Témoignages de participants
const participantTestimonials = [
  {
    quote: "J'avais peur de me livrer. L'équipe m'a mise tellement à l'aise que j'ai oublié la caméra.",
    author: 'Nadia K.',
    role: 'A partagé en vidéo',
    image: '/placeholder.svg',
    color: '#8B5CF6',
  },
  {
    quote: "Je reçois encore des messages de personnes que mon témoignage a aidées. C'est incroyable.",
    author: 'Thomas R.',
    role: 'A partagé en vidéo',
    image: '/placeholder.svg',
    color: '#F59E0B',
  },
  {
    quote: "Le podcast m'a permis de raconter sans montrer mon visage. C'était parfait pour moi.",
    author: 'Anonyme',
    role: 'A partagé en podcast',
    image: '/placeholder.svg',
    color: '#10B981',
  },
];

// FAQ
const faqs = [
  { q: "C'est vraiment gratuit ?", a: "Oui, 100% gratuit. Notre mission est de donner la parole." },
  { q: 'Qui peut participer ?', a: "Tout le monde. Chaque histoire compte, même les plus simples." },
  { q: 'Je peux rester anonyme ?', a: 'Absolument. Pseudonyme, voix modifiée, visage flouté.' },
  { q: "J'ai le droit de relecture ?", a: "Bien sûr. Vous validez tout avant publication." },
  { q: 'Ça prend combien de temps ?', a: 'De 2 semaines à 6 mois selon le format choisi.' },
  { q: 'Et si je change d\'avis ?', a: "Vous pouvez vous retirer à tout moment." },
];

// ============ COMPONENT ============
const ShareStoryPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <>
      <SEO
        title="Racontez votre histoire | Origines Media"
        description="Partagez votre parcours et inspirez des milliers de personnes. 100% gratuit, accompagnement personnalisé."
        url="/racontez-votre-histoire"
      />

      <Navbar />

      <main className="bg-white">

        {/* ============ 1. HERO ============ */}
        <section className="py-6 lg:py-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-center">

              {/* Left - Content */}
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                  1 000+ histoires partagées
                </span>

                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2">
                  Votre histoire mérite d'être entendue
                </h1>

                <p className="text-[11px] lg:text-xs text-gray-600 leading-relaxed mb-4">
                  Vous avez traversé quelque chose d'important ? Partagez votre parcours et inspirez des milliers de personnes qui vivent la même chose.
                </p>

                <a
                  href="#formulaire"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors"
                >
                  Je veux raconter mon histoire
                  <ArrowRight className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <Check className="w-3 h-3 text-emerald-500" />
                    100% gratuit
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <Check className="w-3 h-3 text-emerald-500" />
                    Accompagnement pro
                  </span>
                </div>
              </div>

              {/* Right - Featured video card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={`/histoire/${featuredStory.videoUrl}`}
                  className="group block rounded-2xl overflow-hidden bg-white"
                  style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}
                >
                  <div className="relative aspect-video">
                    <img
                      src={featuredStory.thumbnail}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute top-2 right-2">
                      <span className="px-1.5 py-0.5 bg-black/60 rounded text-[9px] font-medium text-white">
                        {featuredStory.duration}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-white mb-1.5"
                        style={{ backgroundColor: featuredStory.color }}
                      >
                        <span className="w-1 h-1 rounded-full bg-white/60" />
                        {featuredStory.category}
                      </span>
                      <h2 className="text-xs lg:text-sm font-bold text-white leading-snug">
                        {featuredStory.title}
                      </h2>
                      <p className="text-[10px] text-white/70 mt-1">
                        {featuredStory.author} · {featuredStory.views} vues
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============ 2. COMMENT ÇA MARCHE - Timeline Premium ============ */}
        <section className="py-8 lg:py-12 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Processus simple
              </span>
              <h2 className="text-xl lg:text-2xl font-bold text-white">
                Comment ça marche ?
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Ligne de connexion horizontale - desktop */}
              <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500 via-pink-500 via-amber-500 to-emerald-500 opacity-30" />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    className="relative"
                  >
                    {/* Card */}
                    <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 lg:p-5 h-full hover:border-gray-600/50 transition-colors group">
                      {/* Number badge */}
                      <div
                        className="absolute -top-3 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mt-2 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <step.icon className="w-6 h-6" style={{ color: step.color }} />
                      </div>

                      {/* Content */}
                      <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
                      <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                        {step.desc}
                      </p>

                      {/* Detail badge */}
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{ backgroundColor: `${step.color}15`, color: step.color }}
                      >
                        <Check className="w-2.5 h-2.5" />
                        {step.detail}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <a
                href="#formulaire"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-full font-semibold text-xs hover:bg-gray-100 transition-colors"
              >
                Commencer maintenant
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ============ 3. NOS HISTOIRES ============ */}
        <section className="py-6 lg:py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                  Des histoires qui inspirent
                </h2>
                <p className="text-gray-500 text-xs">
                  Découvrez les témoignages de notre communauté
                </p>
              </div>
              <Link
                to="/histoires"
                className="group inline-flex items-center gap-1 text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Voir tout
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {publishedStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/histoire/${story.slug}`}
                    className="group block rounded-xl overflow-hidden bg-white"
                    style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)' }}
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={story.thumbnail}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Type icon */}
                      <div className="absolute top-2 left-2">
                        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                          {story.type === 'video' && <Play className="w-3 h-3 text-gray-900 ml-0.5" fill="currentColor" />}
                          {story.type === 'article' && <PenLine className="w-3 h-3 text-gray-900" />}
                          {story.type === 'podcast' && <Mic className="w-3 h-3 text-gray-900" />}
                          {story.type === 'livre' && <BookOpen className="w-3 h-3 text-gray-900" />}
                          {story.type === 'documentaire' && <Film className="w-3 h-3 text-gray-900" />}
                        </div>
                      </div>

                      {/* Duration/Time */}
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-medium text-white">
                          {story.type === 'article' || story.type === 'livre' ? story.readTime : story.duration}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-white/90 mb-1">
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: story.color }} />
                          {story.category}
                        </span>
                        <h3 className="text-[10px] lg:text-[11px] font-semibold text-white leading-snug line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="text-[9px] text-white/60 mt-0.5">
                          {story.author} · {story.views} vues
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 4. POURQUOI PARTAGER - Premium ============ */}
        <section className="py-10 lg:py-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-3">
                <Heart className="w-3 h-3" />
                L'impact de votre voix
              </span>
              <h2 className="text-xl lg:text-3xl font-bold text-white mb-2">
                Pourquoi partager votre histoire ?
              </h2>
              <p className="text-gray-400 text-xs max-w-md mx-auto">
                Chaque témoignage a le pouvoir de transformer des vies. Voici ce qui se passe quand vous osez raconter.
              </p>
            </div>

            {/* Reasons grid - Premium cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <div
                    className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 lg:p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    {/* Stat badge */}
                    <div
                      className="absolute -top-3 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg"
                      style={{ backgroundColor: reason.color }}
                    >
                      {reason.stat}
                    </div>

                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${reason.color}20` }}
                    >
                      <reason.icon className="w-6 h-6" style={{ color: reason.color }} />
                    </div>

                    {/* Content */}
                    <h3 className="text-sm font-bold text-white mb-1.5">{reason.title}</h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                      {reason.desc}
                    </p>

                    {/* Stat label */}
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-medium"
                      style={{ color: reason.color }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: reason.color }} />
                      {reason.statLabel}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <a
                href="#formulaire"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-full font-semibold text-xs hover:bg-gray-100 transition-colors"
              >
                Je veux faire partie de l'aventure
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ============ 5. L'IMPACT ============ */}
        <section className="py-5 lg:py-6 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-4 gap-4">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <p className="text-lg lg:text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-[9px] lg:text-[10px] text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 6. NOS FORMATS ============ */}
        <section className="py-6 lg:py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                Choisissez votre format
              </h2>
              <p className="text-gray-500 text-xs">
                Cinq façons de raconter, selon vos envies
              </p>
            </div>

            {/* Formats grid - 5 formats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {formats.map((format, index) => (
                <motion.div
                  key={format.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-xl overflow-hidden bg-white border-2 transition-all hover:shadow-lg cursor-pointer group ${
                    format.popular ? 'border-pink-300' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {format.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-pink-500 text-white text-[8px] font-bold uppercase tracking-wider text-center py-0.5">
                      Populaire
                    </div>
                  )}

                  <div className={`p-4 ${format.popular ? 'pt-6' : ''}`}>
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${format.color}15` }}
                    >
                      <format.icon className="w-5 h-5" style={{ color: format.color }} />
                    </div>

                    {/* Content */}
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">{format.title}</h3>
                    <p className="text-[9px] text-gray-400 mb-2">{format.subtitle}</p>
                    <p className="text-[10px] text-gray-600 leading-relaxed mb-3">
                      {format.desc}
                    </p>

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      {format.duration}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 7. TÉMOIGNAGES PARTICIPANTS ============ */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                Ils ont partagé leur histoire
              </h2>
              <p className="text-gray-500 text-xs">
                Ce qu'ils disent de l'expérience
              </p>
            </div>

            {/* Testimonials */}
            <div className="grid lg:grid-cols-3 gap-3">
              {participantTestimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4"
                  style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.04)' }}
                >
                  <Quote className="w-5 h-5 text-gray-200 mb-2" />
                  <p className="text-[11px] text-gray-700 leading-relaxed italic mb-3">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-8 h-8 rounded-full object-cover"
                      style={{ border: `2px solid ${testimonial.color}` }}
                    />
                    <div>
                      <p className="text-[10px] font-bold text-gray-900">{testimonial.author}</p>
                      <p className="text-[9px] text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 8. FORMULAIRE - Redesign Premium ============ */}
        <section id="formulaire" className="py-8 lg:py-12 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-white/90 mb-3">
                <Heart className="w-3 h-3" />
                Rejoignez 1 000+ témoins
              </span>
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">
                Prêt(e) à partager votre histoire ?
              </h2>
              <p className="text-violet-200 text-xs max-w-md mx-auto">
                Remplissez ce formulaire en 2 minutes. On vous recontacte sous 48h pour faire connaissance.
              </p>
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-5 lg:p-6 max-w-lg mx-auto"
              style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Format selection - 5 formats */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Format souhaité
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {formats.map((f) => {
                        const isSelected = selectedFormat === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setSelectedFormat(f.id)}
                            className={`relative p-2 rounded-lg text-center transition-all ${
                              isSelected
                                ? 'bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-1'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <f.icon className={`w-4 h-4 mx-auto mb-0.5 ${isSelected ? 'text-white' : ''}`} style={{ color: isSelected ? undefined : f.color }} />
                            <p className="text-[9px] font-bold">{f.title}</p>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                        placeholder="Marie"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                        placeholder="marie@exemple.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone (optional) */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Votre histoire en quelques mots
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all resize-none"
                      placeholder="J'aimerais partager mon parcours sur..."
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-500/25"
                  >
                    {isSubmitting ? (
                      'Envoi en cours...'
                    ) : (
                      <>
                        Envoyer ma demande
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {/* Guarantees */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <span className="flex items-center gap-1 text-[9px] text-gray-400">
                      <Shield className="w-3 h-3" />
                      Données protégées
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      Réponse sous 48h
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-gray-400">
                      <Check className="w-3 h-3" />
                      100% gratuit
                    </span>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Merci {formData.name} !
                  </h3>
                  <p className="text-gray-600 text-xs mb-4">
                    Votre demande a bien été envoyée.<br />
                    On vous recontacte très vite pour faire connaissance.
                  </p>
                  <Link
                    to="/histoires"
                    className="inline-flex items-center gap-1.5 text-violet-600 font-medium text-xs hover:text-violet-700 transition-colors"
                  >
                    Découvrir les histoires
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ============ 9. FAQ ============ */}
        <section className="py-6 lg:py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-4">
              <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                Questions fréquentes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gray-50 rounded-lg p-3"
                >
                  <h3 className="text-xs font-bold text-gray-900 mb-1">{faq.q}</h3>
                  <p className="text-[10px] text-gray-600 leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default ShareStoryPage;
