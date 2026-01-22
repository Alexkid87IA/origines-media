// src/pages/PartnershipsPage.tsx
// Page Partenariats - Style minimaliste blanc

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Download, ArrowRight, Users, Eye, Heart, Clock,
  Target, TrendingUp, CheckCircle, MessageCircle, Play,
  Video, FileText, Megaphone, Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Icônes des réseaux sociaux
const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const YouTubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SnapchatIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301a.794.794 0 01.304-.065c.24 0 .47.09.644.255.183.166.305.421.305.69 0 .3-.15.554-.404.765-.165.135-.435.27-.82.39-.27.09-.495.15-.645.195-.245.075-.39.135-.42.195-.03.06-.03.15 0 .27.045.18.21.57.615 1.215.735 1.17 1.665 2.115 2.175 2.475.375.24.39.375.39.39 0 .12-.06.225-.195.315-.315.21-.86.37-1.62.48-.135.015-.24.045-.3.075-.06.03-.135.09-.195.195-.06.12-.135.27-.21.405-.09.165-.195.345-.33.495-.18.21-.42.33-.69.33-.135 0-.285-.03-.45-.075-.315-.09-.645-.21-1.08-.36-.18-.06-.375-.105-.57-.105-.105 0-.225.015-.345.045-.21.06-.42.165-.66.345-.6.45-1.26.675-1.92.675-.66 0-1.32-.225-1.92-.675-.24-.18-.45-.285-.66-.345-.12-.03-.24-.045-.345-.045-.195 0-.39.045-.57.105-.435.15-.765.27-1.08.36-.165.045-.315.075-.45.075-.27 0-.51-.12-.69-.33-.135-.15-.24-.33-.33-.495-.075-.135-.15-.285-.21-.405-.06-.105-.135-.165-.195-.195-.06-.03-.165-.06-.3-.075-.76-.11-1.305-.27-1.62-.48-.135-.09-.195-.195-.195-.315 0-.015.015-.15.39-.39.51-.36 1.44-1.305 2.175-2.475.405-.645.57-1.035.615-1.215.03-.12.03-.21 0-.27-.03-.06-.18-.12-.42-.195-.15-.045-.375-.105-.645-.195-.385-.12-.66-.255-.82-.39-.254-.211-.404-.465-.404-.765 0-.27.12-.525.305-.69.174-.165.405-.255.644-.255.105 0 .21.015.305.065.374.18.734.285 1.033.301.18 0 .315-.045.4-.09-.007-.165-.017-.33-.029-.51l-.004-.06c-.104-1.628-.23-3.654.299-4.847C7.86 1.069 11.216.793 12.206.793z"/>
  </svg>
);

const PartnershipsPage: React.FC = () => {
  // Stats réseaux sociaux
  const socialStats = [
    { platform: 'Facebook', followers: '2,12M', icon: FacebookIcon, color: '#1877F2' },
    { platform: 'Snapchat', followers: '800K', icon: SnapchatIcon, color: '#FFFC00' },
    { platform: 'Instagram', followers: '261K', icon: InstagramIcon, color: '#E4405F' },
    { platform: 'TikTok', followers: '130K', icon: TikTokIcon, color: '#000000' },
    { platform: 'YouTube', followers: '100K', icon: YouTubeIcon, color: '#FF0000' },
  ];

  // Formats de partenariat
  const partnershipFormats = [
    { title: '1 Reel', description: 'Instagram', icon: Play, color: '#EC4899' },
    { title: '1 Série', description: 'Épisodes dédiés', icon: Video, color: '#8B5CF6' },
    { title: '1 Vidéo YouTube', description: 'Long format', icon: YouTubeIcon, color: '#EF4444' },
    { title: '1 Documentaire', description: 'Sur-mesure', icon: FileText, color: '#F59E0B' },
    { title: 'Multi-plateformes', description: 'Tous réseaux', icon: Megaphone, color: '#6366F1' },
  ];

  // Case studies
  const caseStudies = [
    {
      title: 'Paola Locatelli & Julia',
      subtitle: 'Transmission',
      description: 'Rencontre émouvante entre Paola et Julia Wallach, rescapée d\'Auschwitz.',
      vues: '20M',
      impressions: '46M',
      color: '#8B5CF6',
    },
    {
      title: 'Louane',
      subtitle: 'La Lettre',
      description: 'Face caméra, Louane écrit une lettre à la jeune fille qu\'elle était.',
      vues: '10M',
      impressions: '950K',
      color: '#EC4899',
    },
    {
      title: 'Naestro',
      subtitle: 'Urban Opera',
      description: 'Dispositif 100% organique pour le lancement du clip de Naestro.',
      vues: '15M+',
      impressions: '3min12',
      color: '#F59E0B',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="Partenariats - Annonceurs"
        description="Associez votre marque à des histoires incroyables. Origines Media : 5 milliards de vues, 3 millions d'abonnés."
        url="/partenariats"
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
                  Partenariats
                </h1>
                <p className="text-gray-500 text-xs">
                  Associez votre marque à des histoires incroyables
                </p>
              </div>

              {/* CTA inline */}
              <a
                href="/kit-media-origines.pdf"
                download="Kit-Media-Origines-2024.pdf"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-[10px] font-bold rounded-lg hover:bg-violet-700 transition-all self-start sm:self-center"
              >
                <Download className="w-3 h-3" />
                <span>Télécharger le kit média</span>
              </a>
            </div>
          </div>
        </section>

        {/* Stats principales */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

              {/* Chiffre principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl p-4 text-white"
              >
                <div className="text-4xl lg:text-5xl font-black mb-1">
                  5B<span className="text-white/60">+</span>
                </div>
                <p className="text-white/70 text-[10px] uppercase tracking-wider mb-3">
                  Vues sur nos réseaux depuis 2022
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: '3M+', label: 'Abonnés' },
                    { value: '43M', label: 'Reach/mois' },
                    { value: '3:42', label: 'Temps moyen' },
                    { value: '9M', label: 'Interactions' },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white/20 backdrop-blur rounded-lg p-2 text-center">
                      <div className="text-sm font-bold">{stat.value}</div>
                      <div className="text-[9px] text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Description + Réseaux */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-3 bg-white rounded-xl p-4 border border-gray-200"
              >
                <p className="text-gray-600 text-xs leading-relaxed mb-4">
                  <strong className="text-gray-900">Origines</strong> est un média 100% vidéo dédié aux récits authentiques.
                  Nous touchons une audience jeune, diversifiée, en quête de contenus qui résonnent.
                  <strong className="text-gray-900"> Chaque histoire compte.</strong>
                </p>

                {/* Réseaux sociaux */}
                <div className="flex flex-wrap gap-2">
                  {socialStats.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <div
                        key={social.platform}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded-full hover:shadow-sm transition-all"
                      >
                        <IconComponent
                          className="w-3 h-3"
                          style={{ color: social.color === '#FFFC00' ? '#FFCC00' : social.color }}
                        />
                        <span className="text-[10px] font-bold text-gray-900">{social.followers}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-violet-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Audience</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Répartition âge */}
              <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-xs text-gray-900 mb-3">Répartition par âge</h3>
                <div className="space-y-2">
                  {[
                    { age: '13-24', percent: 24, color: '#8B5CF6' },
                    { age: '25-34', percent: 40, color: '#EC4899' },
                    { age: '34-44', percent: 24, color: '#F59E0B' },
                    { age: '45+', percent: 12, color: '#6366F1' },
                  ].map((item) => (
                    <div key={item.age} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-10">{item.age}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.percent * 2}%`, backgroundColor: item.color }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-900 w-8">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <h3 className="font-semibold text-xs text-gray-900 mb-3">Genre</h3>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <div className="text-2xl font-black text-pink-500">56%</div>
                    <div className="text-[9px] text-gray-500">Femmes</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <div className="text-2xl font-black text-violet-500">44%</div>
                    <div className="text-[9px] text-gray-500">Hommes</div>
                  </div>
                </div>
              </div>

              {/* Engagement */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-xs text-gray-900 mb-3">Engagement</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-amber-500" /> Temps
                    </span>
                    <span className="text-[10px] font-bold text-amber-600">3:42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <MessageCircle className="w-2.5 h-2.5 text-violet-500" /> Interactions
                    </span>
                    <span className="text-[10px] font-bold text-violet-600">9M/mois</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Target className="w-2.5 h-2.5 text-pink-500" /> Taux
                    </span>
                    <span className="text-[10px] font-bold text-pink-600">+5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formats de partenariat */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-gray-900 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Formats</span>
            </div>

            <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-4">
              Des formats adaptés à vos objectifs
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {partnershipFormats.map((format, index) => {
                const IconComponent = format.icon;
                return (
                  <motion.div
                    key={format.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-3 border border-gray-200 text-center hover:shadow-sm transition-all group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{ backgroundColor: `${format.color}15` }}
                    >
                      <IconComponent
                        className="w-4 h-4"
                        style={{ color: format.color }}
                      />
                    </div>
                    <h3 className="font-bold text-[11px] text-gray-900 mb-0.5">{format.title}</h3>
                    <p className="text-[9px] text-gray-500">{format.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Valeurs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { text: 'Histoires 100% authentiques', icon: CheckCircle, color: '#8B5CF6' },
                { text: 'Communauté bienveillante', icon: Heart, color: '#EC4899' },
                { text: 'Diversité des parcours', icon: Users, color: '#F59E0B' },
              ].map((value, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-full"
                >
                  <value.icon className="w-3 h-3" style={{ color: value.color }} />
                  <span className="text-[9px] text-gray-700 font-medium">{value.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
              <div>
                <div className="h-0.5 w-6 bg-amber-500 rounded-full mb-2" />
                <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-0.5">
                  Des histoires qui marquent
                </h2>
                <p className="text-gray-500 text-xs">
                  Nos collaborations les plus impactantes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all relative overflow-hidden"
                >
                  {/* Barre colorée en haut */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: study.color }}
                  />
                  <span
                    className="inline-block px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full mb-2"
                    style={{
                      backgroundColor: `${study.color}15`,
                      color: study.color
                    }}
                  >
                    {study.subtitle}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{study.title}</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
                    {study.description}
                  </p>
                  <div className="flex gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <div
                        className="text-lg font-black"
                        style={{ color: study.color }}
                      >
                        {study.vues}
                      </div>
                      <div className="text-[8px] text-gray-400 uppercase">Vues</div>
                    </div>
                    <div>
                      <div
                        className="text-lg font-black"
                        style={{ color: study.color }}
                      >
                        {study.impressions}
                      </div>
                      <div className="text-[8px] text-gray-400 uppercase">
                        {study.title === 'Naestro' ? 'Temps moyen' : 'Impressions'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ce qu'on apporte */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-gray-900 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Notre offre</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  title: 'Nos Médias',
                  description: 'Notre expertise sociale au service de nos médias',
                  gradient: 'from-violet-500 to-violet-600',
                },
                {
                  title: 'Nos Productions',
                  description: 'Faire matcher l\'ADN de nos médias avec vos enjeux',
                  gradient: 'from-pink-500 to-fuchsia-600',
                },
                {
                  title: 'Nos Créateurs',
                  description: 'Accompagner les générateurs d\'engagement',
                  gradient: 'from-amber-500 to-orange-600',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl p-4 bg-gradient-to-br ${item.gradient} text-white`}
                >
                  <h3 className="font-bold text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed text-white/80">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-8 lg:py-12 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl lg:text-2xl font-bold mb-2">
                Êtes-vous prêt à écrire l'histoire ?
              </h2>
              <p className="text-gray-400 text-xs mb-6 max-w-md mx-auto">
                Rejoignez-nous pour créer ensemble des contenus authentiques qui touchent des millions de personnes.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href="/kit-media-origines.pdf"
                  download="Kit-Media-Origines-2024.pdf"
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-100 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger le kit média
                </a>

                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white/10 text-white text-xs font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  Nous contacter
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Réponse sous 48h
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Solutions sur-mesure
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-4 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[10px] text-gray-500">
                Devenez ambassadeur, proposez des projets ou inscrivez-vous à notre newsletter.
              </p>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-gray-400">Contact :</span>
                <span className="font-semibold text-gray-900">Alex, président</span>
                <a
                  href="mailto:Alex@origines.media"
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  Alex@origines.media
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnershipsPage;
