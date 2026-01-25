// src/pages/RecommandationPage.tsx
// Page détail d'une recommandation - Style Magazine avec Sidebar ArticlePage

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BookOpen, Film, Headphones, ShoppingBag, Sparkles, Music, Youtube, MapPin, Palette, Globe,
  Star, Calendar, Share2, Link2, Check, ExternalLink, Play,
  Heart, Award, Trophy, Medal, Crown, Loader2, Tag, Mail,
  Info, AlertCircle, CheckCircle, Lightbulb, Zap, TrendingUp, Quote, Key, Target
} from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import { RECOMMENDATION_BY_SLUG_QUERY, RELATED_RECOS_QUERY } from '../lib/queries';
import { PortableText } from '@portabletext/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// ============ SOCIAL ICONS ============
const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.942-.783 2.264-1.217 3.727-1.223h.036c1.26.005 2.378.296 3.322.864.376.226.706.493.99.796.03-.317.043-.636.036-.957-.05-2.358-.756-4.022-2.098-4.942-1.135-.778-2.704-1.18-4.663-1.194-.964.008-1.87.1-2.694.28l-.485-1.947c.985-.216 2.07-.326 3.227-.334 2.431.018 4.396.567 5.844 1.632 1.72 1.266 2.614 3.394 2.674 6.33.003.165.003.33-.001.495.404.252.773.546 1.106.88 1.01 1.016 1.674 2.37 1.885 3.878.257 1.838-.168 3.878-1.282 5.28-1.692 2.131-4.381 3.31-7.57 3.322zm-1.25-8.063c-.06 0-.12.001-.18.003-1.347.06-2.28.537-2.547 1.303-.13.372-.12.784.028 1.16.242.615.857 1.108 1.739 1.392.525.168 1.09.244 1.678.224 1.073-.057 1.896-.453 2.449-1.178.476-.625.78-1.487.902-2.565-.724-.383-1.578-.586-2.534-.59h-.036c-.51.001-1.003.083-1.5.25z"/>
  </svg>
);

// Share buttons
const shareButtons = [
  { id: 'twitter', icon: XIcon, label: 'X', color: '#000000' },
  { id: 'facebook', icon: FacebookIcon, label: 'Facebook', color: '#1877F2' },
  { id: 'linkedin', icon: LinkedInIcon, label: 'LinkedIn', color: '#0A66C2' },
  { id: 'whatsapp', icon: WhatsAppIcon, label: 'WhatsApp', color: '#25D366' },
  { id: 'telegram', icon: TelegramIcon, label: 'Telegram', color: '#0088CC' },
];

// Types de recommandations (synchronisé avec Navbar et RecommandationsPage)
const recommendationTypes: Record<string, { color: string; label: string; icon: any; gradient: string; ctaLabel: string }> = {
  livre: { color: '#EC4899', label: 'Livres', icon: BookOpen, gradient: 'from-pink-500 to-rose-500', ctaLabel: 'Découvrir le livre' },
  film: { color: '#8B5CF6', label: 'Films & Séries', icon: Film, gradient: 'from-violet-500 to-purple-500', ctaLabel: 'Voir la bande-annonce' },
  musique: { color: '#6366F1', label: 'Musique', icon: Music, gradient: 'from-indigo-500 to-blue-500', ctaLabel: 'Écouter' },
  podcast: { color: '#14B8A6', label: 'Podcasts', icon: Headphones, gradient: 'from-teal-500 to-cyan-500', ctaLabel: 'Écouter le podcast' },
  youtube: { color: '#EF4444', label: 'YouTube', icon: Youtube, gradient: 'from-red-500 to-orange-500', ctaLabel: 'Voir la chaîne' },
  activite: { color: '#10B981', label: 'Activité', icon: Globe, gradient: 'from-emerald-500 to-green-500', ctaLabel: 'En savoir plus' },
  destination: { color: '#0EA5E9', label: 'Destination', icon: MapPin, gradient: 'from-sky-500 to-blue-500', ctaLabel: 'Explorer' },
  culture: { color: '#A855F7', label: 'Culture', icon: Palette, gradient: 'from-purple-500 to-fuchsia-500', ctaLabel: 'Découvrir' },
  produit: { color: '#F59E0B', label: 'Produits', icon: ShoppingBag, gradient: 'from-amber-500 to-yellow-500', ctaLabel: 'Voir le produit' },
  'reseaux-sociaux': { color: '#E11D48', label: 'Réseaux sociaux', icon: Globe, gradient: 'from-rose-500 to-pink-500', ctaLabel: 'Voir le compte' },
};

type RecoType = keyof typeof recommendationTypes;

// Interface pour les items de la liste
interface ListItem {
  _key: string;
  titre: string;
  description?: string;
  note?: number;
  imageUrl?: string;
  lien?: string;
  auteurItem?: string;
  annee?: string;
}

// Interface recommandation
interface Recommendation {
  _id: string;
  titre: string;
  type: RecoType;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
  contenu?: any[];
  items?: ListItem[];
}

interface RelatedReco {
  _id: string;
  titre: string;
  type: RecoType;
  imageUrl?: string;
  slug: string;
  note?: number;
}

// ============ PORTABLE TEXT COMPONENTS ============
const portableTextComponents = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 leading-loose">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-4 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-bold text-gray-900 mt-8 mb-3 leading-tight">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-700 leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-violet-500 pl-6 py-2 my-8 italic text-gray-700 bg-violet-50/50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-600 hover:text-violet-700 underline decoration-violet-300 hover:decoration-violet-500 transition-colors"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }: any) => {
      // Pour les recommandations, les liens internes pointent vers des articles (productions)
      const slug = value?.slug;
      if (!slug) return <span className="text-violet-600">{children}</span>;
      return (
        <a
          href={`/article/${slug}`}
          className="text-violet-600 hover:text-violet-700 underline decoration-violet-300 hover:decoration-violet-500 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="space-y-3 mb-6 pl-0 list-none">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="space-y-3 mb-6 pl-0 list-none counter-reset-item">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="flex items-start gap-3 text-gray-700">
        <span className="w-2 h-2 mt-2.5 rounded-full bg-violet-500 flex-shrink-0" />
        <span className="leading-relaxed">{children}</span>
      </li>
    ),
    number: ({ children }: any) => (
      <li className="flex items-start gap-3 text-gray-700 counter-increment-item">
        <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="counter-item" />
        </span>
        <span className="leading-relaxed">{children}</span>
      </li>
    ),
  },
  types: {
    // Callout - Encadré d'information/alerte
    callout: ({ value }: any) => {
      const types: Record<string, { icon: any; bg: string; border: string; text: string; iconBg: string }> = {
        info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-100' },
        warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconBg: 'bg-amber-100' },
        success: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', iconBg: 'bg-emerald-100' },
        tip: { icon: Lightbulb, bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', iconBg: 'bg-violet-100' },
        remember: { icon: BookOpen, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', iconBg: 'bg-indigo-100' },
        didyouknow: { icon: Sparkles, bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', iconBg: 'bg-pink-100' },
        key: { icon: Zap, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', iconBg: 'bg-orange-100' },
        testimonial: { icon: Heart, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', iconBg: 'bg-rose-100' },
        stat: { icon: TrendingUp, bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', iconBg: 'bg-cyan-100' },
      };
      const style = types[value.type] || types.info;
      const Icon = style.icon;
      const content = value.text || value.content || value.body;
      const isRichText = Array.isArray(content);

      // Style spécial pour les stats
      if (value.type === 'stat') {
        return (
          <div className="my-10 p-8 rounded-2xl bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 border border-violet-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              {value.title && (
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{value.title}</h4>
              )}
            </div>
            <div className="text-gray-700 leading-relaxed pl-13">
              {isRichText ? <PortableText value={content} /> : <p>{content}</p>}
            </div>
            {value.source && (
              <p className="text-xs text-gray-500 mt-4 pl-13">Source : {value.source}</p>
            )}
          </div>
        );
      }

      return (
        <div className={`my-8 p-6 rounded-2xl ${style.bg} border ${style.border}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${style.text}`} />
            </div>
            <div className="flex-1">
              {value.title && (
                <h4 className={`font-bold ${style.text} mb-2`}>{value.title}</h4>
              )}
              <div className={`${style.text.replace('800', '700')} leading-relaxed`}>
                {isRichText ? <PortableText value={content} /> : <p>{content}</p>}
              </div>
              {value.source && (
                <p className="text-xs opacity-70 mt-3">Source : {value.source}</p>
              )}
            </div>
          </div>
        </div>
      );
    },

    // Styled Quote - Citation stylisée
    styledQuote: ({ value }: any) => {
      const quoteStyle = value.style || 'classic';

      // Style Testimonial - avec author et role
      if (quoteStyle === 'testimonial') {
        return (
          <figure className="my-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-violet-200" />
              <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed pl-6">
                "{value.quote}"
              </blockquote>
            </div>
            <figcaption className="mt-6 flex items-center gap-3 pl-6">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-violet-600 font-bold text-sm">
                  {value.author?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <cite className="not-italic font-semibold text-gray-900">{value.author}</cite>
                {value.role && (
                  <p className="text-sm text-gray-500">{value.role}</p>
                )}
              </div>
            </figcaption>
          </figure>
        );
      }

      // Style Large
      if (quoteStyle === 'large') {
        return (
          <figure className="my-12 text-center">
            <Quote className="w-12 h-12 text-violet-300 mx-auto mb-4" />
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed italic max-w-3xl mx-auto">
              "{value.quote}"
            </blockquote>
            {value.author && (
              <figcaption className="mt-6 text-gray-500">
                — <cite className="not-italic font-medium">{value.author}</cite>
                {value.role && <span className="text-gray-400"> · {value.role}</span>}
              </figcaption>
            )}
          </figure>
        );
      }

      // Style Filled
      if (quoteStyle === 'filled') {
        return (
          <figure className="my-10 p-8 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
            <Quote className="w-10 h-10 text-white/30 mb-4" />
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic">
              "{value.quote}"
            </blockquote>
            {value.author && (
              <figcaption className="mt-6 text-violet-100">
                — <cite className="not-italic font-semibold text-white">{value.author}</cite>
                {value.role && <span className="text-violet-200"> · {value.role}</span>}
              </figcaption>
            )}
          </figure>
        );
      }

      // Style Classic (default)
      return (
        <figure className="my-10 border-l-4 border-violet-500 pl-6 py-2">
          <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed">
            "{value.quote}"
          </blockquote>
          {value.author && (
            <figcaption className="mt-4 text-gray-500">
              — <cite className="not-italic font-medium text-gray-700">{value.author}</cite>
              {value.role && <span className="text-gray-400"> · {value.role}</span>}
            </figcaption>
          )}
        </figure>
      );
    },

    // Key Takeaways - Points clés à retenir
    keyTakeaways: ({ value }: any) => {
      const items = value.items || value.points || value.takeaways || value.list || [];
      const title = value.title || 'À retenir';
      const style = value.style || 'boxed';

      const getIcon = (iconName?: string) => {
        switch (iconName) {
          case 'bulb':
          case 'lightbulb':
            return <Lightbulb className="w-5 h-5 text-amber-500" />;
          case 'check':
          case 'checkmark':
            return <CheckCircle className="w-5 h-5 text-emerald-500" />;
          case 'target':
            return <Target className="w-5 h-5 text-rose-500" />;
          case 'star':
            return <Star className="w-5 h-5 text-yellow-500" />;
          case 'key':
            return <Key className="w-5 h-5 text-indigo-500" />;
          default:
            return <CheckCircle className="w-5 h-5 text-emerald-500" />;
        }
      };

      // Style Boxed (default)
      if (style === 'boxed' || style === 'list') {
        return (
          <div className="my-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
            <h4 className="flex items-center gap-3 text-lg font-bold text-emerald-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              {title}
            </h4>
            <ul className="space-y-4">
              {items.map((item: any, index: number) => (
                <li key={item._key || index} className="flex items-start gap-3">
                  {getIcon(item.icon)}
                  <span className="text-gray-700 leading-relaxed">
                    {typeof item === 'string' ? item : (item.point || item.text || item.content || '')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Style Cards
      if (style === 'cards') {
        return (
          <div className="my-10">
            <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-violet-600" />
              </div>
              {title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item: any, index: number) => (
                <div
                  key={item._key || index}
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    {getIcon(item.icon)}
                    <span className="text-gray-700 leading-relaxed text-sm">
                      {typeof item === 'string' ? item : (item.point || item.text || item.content || '')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Style Timeline
      return (
        <div className="my-10">
          <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            {title}
          </h4>
          <div className="space-y-4 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-violet-200">
            {items.map((item: any, index: number) => (
              <div key={item._key || index} className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-violet-300 flex items-center justify-center z-10 flex-shrink-0">
                  <span className="text-violet-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {typeof item === 'string' ? item : (item.point || item.text || item.content || '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
};

// Rank badge component
const RankBadge = ({ rank, color }: { rank: number; color: string }) => {
  if (rank === 1) return <Crown className="w-5 h-5" />;
  if (rank === 2) return <Medal className="w-5 h-5" />;
  if (rank === 3) return <Award className="w-5 h-5" />;
  return <span className="text-sm font-bold">{rank}</span>;
};

// Liste Item Component avec CTA
const ListItemCard = ({
  item,
  index,
  typeConfig,
}: {
  item: ListItem;
  index: number;
  typeConfig: typeof recommendationTypes[string];
}) => {
  const rank = index + 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative"
    >
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300">
        <div className="flex gap-4 p-5">
          {/* Rank + Image */}
          <div className="relative flex-shrink-0">
            {/* Rank Badge */}
            <div
              className="absolute -top-2 -left-2 w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg z-10"
              style={{ backgroundColor: typeConfig.color }}
            >
              <RankBadge rank={rank} color={typeConfig.color} />
            </div>
            {/* Image */}
            <div className="w-20 h-28 rounded-xl overflow-hidden bg-gray-100 mt-2">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.titre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: `${typeConfig.color}15` }}
                >
                  <typeConfig.icon className="w-8 h-8" style={{ color: typeConfig.color }} />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1.5 group-hover:text-gray-700 transition-colors">
              {item.titre}
            </h3>

            {/* Meta line */}
            <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
              {item.auteurItem && (
                <span className="text-gray-500">{item.auteurItem}</span>
              )}
              {item.annee && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {item.annee}
                </span>
              )}
              {item.note && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-amber-600">{item.note}/5</span>
                </span>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                {item.description}
              </p>
            )}

            {/* CTA Button */}
            {item.lien && (
              <a
                href={item.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: typeConfig.color,
                  boxShadow: `0 4px 14px -3px ${typeConfig.color}50`
                }}
              >
                {typeConfig.ctaLabel}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default function RecommandationPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [reco, setReco] = useState<Recommendation | null>(null);
  const [relatedRecos, setRelatedRecos] = useState<RelatedReco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Sidebar sticky
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  // Fetch recommendation
  useEffect(() => {
    const fetchReco = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await sanityFetch(RECOMMENDATION_BY_SLUG_QUERY, { slug }) as Recommendation;

        if (!data) {
          setError('Recommandation non trouvée');
          return;
        }

        setReco(data);

        // Fetch related
        if (data.type) {
          const related = await sanityFetch(RELATED_RECOS_QUERY, {
            type: data.type,
            slug
          }) as RelatedReco[];
          setRelatedRecos(related || []);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchReco();
  }, [slug]);

  // Sidebar sticky behavior (same as ArticlePage)
  useEffect(() => {
    const handleSidebarScroll = () => {
      if (!sidebarRef.current || !sidebarContainerRef.current) return;

      const container = sidebarContainerRef.current;
      const sidebar = sidebarRef.current;
      const containerRect = container.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const viewportHeight = window.innerHeight;
      const sidebarBottomIfRelative = containerRect.top + sidebarHeight;

      if (sidebarBottomIfRelative > viewportHeight) {
        // État 1: Le bas de la sidebar n'a pas encore atteint le bas du viewport
        // → Scroll normal avec la page
        setSidebarStyle({ position: 'relative', top: 0 });
      } else if (containerRect.bottom > sidebarHeight) {
        // État 2: Le bas de la sidebar a atteint le bas du viewport
        // ET le conteneur n'est pas encore fini
        // → Fixed avec le bas collé au bas du viewport
        const topPosition = viewportHeight - sidebarHeight;
        setSidebarStyle({ position: 'fixed', top: topPosition, width: container.offsetWidth });
      } else {
        // État 3: Le conteneur est presque fini
        // → Absolute en bas du conteneur pour finir ensemble
        setSidebarStyle({ position: 'absolute', bottom: 0, top: 'auto', width: '100%' });
      }
    };

    window.addEventListener('scroll', handleSidebarScroll, { passive: true });
    window.addEventListener('resize', handleSidebarScroll);
    setTimeout(handleSidebarScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleSidebarScroll);
      window.removeEventListener('resize', handleSidebarScroll);
    };
  }, [reco]);

  // Share handler
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = reco?.titre || '';

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Newsletter handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNewsletterSuccess(true);
    setNewsletterSubmitting(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !reco) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Sparkles className="w-12 h-12 text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Recommandation introuvable</h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link
            to="/recommandations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux recommandations
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const typeConfig = recommendationTypes[reco.type] || recommendationTypes.livre;
  const TypeIcon = typeConfig.icon;

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={reco.titre}
        description={reco.accroche || reco.description}
        image={reco.imageUrl}
        url={`/recommandation/${reco.slug}`}
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Recommandations', url: '/recommandations' },
          { name: reco.titre, url: `/recommandation/${reco.slug}` }
        ]}
      />
      <Navbar />

      <main className="pt-8 pb-16">
        {/* Back button */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>

        {/* Hero Header */}
        <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {reco.imageUrl && (
              <div className="absolute inset-0">
                <img src={reco.imageUrl} alt={`Illustration de la recommandation : ${reco.titre || ''}`} className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
              </div>
            )}

            <div className="relative p-8 lg:p-12">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${typeConfig.gradient} text-white text-sm font-semibold shadow-lg`}
                >
                  <TypeIcon className="w-4 h-4" />
                  {typeConfig.label}
                </span>
                {reco.coupDeCoeur && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                    <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                    Coup de coeur
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 max-w-3xl">
                {reco.titre}
              </h1>

              {reco.accroche && (
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mb-6">
                  {reco.accroche}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {reco.auteur && (
                  <span>Par <span className="text-white font-medium">{reco.auteur}</span></span>
                )}
                {reco.datePublication && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(reco.datePublication)}
                  </span>
                )}
                {reco.items && reco.items.length > 0 && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Top {reco.items.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content + Sidebar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Main Content */}
            <article className="lg:col-span-8">
              {/* Liste / Top Items */}
              {reco.items && reco.items.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${typeConfig.color}15` }}
                    >
                      <Trophy className="w-5 h-5" style={{ color: typeConfig.color }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Notre sélection</h2>
                      <p className="text-sm text-gray-500">
                        {reco.items.length} {typeConfig.label.toLowerCase()} recommandés
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reco.items.map((item, index) => (
                      <ListItemCard
                        key={item._key}
                        item={item}
                        index={index}
                        typeConfig={typeConfig}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Article Content (Portable Text) */}
              {reco.contenu && reco.contenu.length > 0 && (
                <section className="mb-12">
                  <div className="max-w-none">
                    <PortableText value={reco.contenu} components={portableTextComponents} />
                  </div>
                </section>
              )}

              {/* Call to action section */}
              <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
                <TypeIcon className="w-12 h-12 mx-auto mb-4" style={{ color: typeConfig.color }} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Vous avez aimé cette sélection ?
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Découvrez toutes nos recommandations {typeConfig.label.toLowerCase()} et bien plus encore.
                </p>
                <Link
                  to={`/recommandations?type=${reco.type}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: typeConfig.color }}
                >
                  Voir toutes les recos {typeConfig.label.toLowerCase()}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </section>
            </article>

            {/* Sidebar (style ArticlePage) */}
            <aside
              ref={sidebarContainerRef}
              className="hidden lg:block lg:col-span-4 relative"
            >
              <div
                ref={sidebarRef}
                className="space-y-4"
                style={sidebarStyle}
              >
                {/* 1. Share Widget */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
                    <Share2 className="w-4 h-4" style={{ color: typeConfig.color }} />
                    Partager
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {shareButtons.map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleShare(btn.id)}
                        className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:border-transparent hover:text-white hover:scale-105"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = btn.color;
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.color = '#6B7280';
                          e.currentTarget.style.borderColor = '#E5E7EB';
                        }}
                        title={btn.label}
                      >
                        <btn.icon />
                      </button>
                    ))}
                    {/* Threads */}
                    <button
                      onClick={() => window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(reco.titre)} ${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:bg-black hover:text-white hover:border-transparent hover:scale-105"
                      title="Threads"
                    >
                      <ThreadsIcon />
                    </button>
                    {/* Copy Link */}
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:text-white hover:border-transparent hover:scale-105"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = typeConfig.color;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#6B7280';
                      }}
                      title="Copier le lien"
                    >
                      {copySuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. Related Recommendations */}
                {relatedRecos.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4" style={{ color: typeConfig.color }} />
                      Autres {typeConfig.label.toLowerCase()}
                    </h4>
                    <div className="space-y-3">
                      {relatedRecos.map((related) => (
                        <Link
                          key={related._id}
                          to={`/recommandation/${related.slug}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {related.imageUrl ? (
                              <img
                                src={related.imageUrl}
                                alt={related.titre || 'Recommandation similaire'}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ backgroundColor: `${typeConfig.color}20` }}
                              >
                                <TypeIcon className="w-5 h-5" style={{ color: typeConfig.color }} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                              {related.titre}
                            </h5>
                            {related.note && (
                              <span className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {related.note}/5
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Newsletter CTA */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50 border border-violet-100/50">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-2xl" />

                  <div className="relative p-5">
                    {!newsletterSuccess ? (
                      <>
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-3">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-gray-900 font-bold text-base">Restez inspirés</h4>
                          <p className="text-violet-600/70 text-[11px] font-medium mt-1">Newsletter hebdomadaire</p>
                        </div>

                        <p className="text-gray-600 text-xs text-center mb-4 leading-relaxed">
                          Recevez nos meilleures recommandations directement dans votre boîte mail.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                          <input
                            type="email"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                            className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-violet-200/50 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                          />
                          <button
                            type="submit"
                            disabled={!newsletterEmail.trim() || newsletterSubmitting}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
                          >
                            {newsletterSubmitting ? 'Envoi...' : "S'inscrire"}
                            {!newsletterSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                          <Check className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h4 className="text-gray-900 font-bold text-sm mb-1">Merci !</h4>
                        <p className="text-gray-500 text-xs">Vous êtes inscrit à notre newsletter.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Back to all recos */}
                <Link
                  to="/recommandations"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Toutes les recommandations
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
