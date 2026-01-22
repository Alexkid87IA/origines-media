// src/components/Footer.tsx
// Footer Premium - Complet et cohérent avec la Navbar

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Heart } from 'lucide-react';

// ============ ICÔNES RÉSEAUX SOCIAUX ============
const YouTubeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

// ============ DATA ============
const socialLinks = [
  { icon: YouTubeIcon, href: 'https://youtube.com/@originesmedia', label: 'YouTube', color: '#FF0000' },
  { icon: XIcon, href: 'https://x.com/originesmedia', label: 'X', color: '#000000' },
  { icon: SnapchatIcon, href: 'https://snapchat.com/add/originesmedia', label: 'Snapchat', color: '#FFFC00' },
  { icon: FacebookIcon, href: 'https://facebook.com/originesmedia', label: 'Facebook', color: '#1877F2' },
  { icon: InstagramIcon, href: 'https://instagram.com/originesmedia', label: 'Instagram', color: '#E4405F' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@originesmedia', label: 'TikTok', color: '#000000' },
];

const navigationColumns = [
  {
    title: 'Contenus',
    titleHref: '/bibliotheque',
    color: '#EC4899',
    links: [
      { label: 'Séries', href: '/series' },
      { label: 'Histoires', href: '/histoires' },
      { label: 'Articles', href: '/articles' },
      { label: 'Vidéos', href: '/videos' },
      { label: 'Bibliothèque', href: '/bibliotheque' },
    ]
  },
  {
    title: 'Explorer',
    titleHref: '/univers',
    color: '#8B5CF6',
    links: [
      { label: 'Tous les univers', href: '/univers' },
      { label: 'Recommandations', href: '/recommandations' },
      { label: 'Academy', href: '/academy' },
    ]
  },
  {
    title: 'Ensemble',
    titleHref: '/ensemble',
    color: '#14B8A6',
    links: [
      { label: 'Raconter son histoire', href: '/racontez-votre-histoire' },
      { label: 'Rejoindre l\'équipe', href: '/rejoindre' },
      { label: 'Newsletter', href: '/newsletter' },
      { label: 'Partenariats', href: '/partenariats' },
    ]
  },
  {
    title: 'À propos',
    titleHref: '/a-propos',
    color: '#F59E0B',
    links: [
      { label: 'Notre mission', href: '/a-propos' },
      { label: 'Contact', href: '/contact' },
      { label: 'Média Kit', href: '/kit-media-origines.pdf', download: true },
    ]
  }
];

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-900" role="contentinfo" aria-label="Pied de page">
      {/* Gradient accent bar at top */}
      <div className="h-1 bg-gradient-to-r from-rose-400 via-violet-400 to-teal-400" />

      {/* Newsletter Section - Top */}
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left - Text */}
            <div className="lg:max-w-md">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Restez inspirés
              </h3>
              <p className="text-gray-500 text-sm">
                Recevez nos meilleurs récits et recommandations directement dans votre boîte mail.
              </p>
            </div>

            {/* Right - Form */}
            <div className="flex-1 lg:max-w-md">
              {!isSubmitted ? (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3" aria-label="Inscription à la newsletter">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    aria-label="Adresse email pour la newsletter"
                    className="flex-1 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!email.trim() || isSubmitting}
                    aria-label={isSubmitting ? "Envoi en cours..." : "S'inscrire à la newsletter"}
                    className="px-6 py-3 text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 text-white shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      'Envoi...'
                    ) : (
                      <>
                        S'inscrire
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-emerald-700 text-sm">
                    Merci ! Vous recevrez bientôt nos récits inspirants.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Left - Brand & Social */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/logo-origines.png"
                alt="Origines Media"
                className="h-12 w-auto"
              />
            </Link>

            <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">
              Des récits qui inspirent, transforment et éclairent. Rejoignez notre communauté de lecteurs passionnés.
            </p>

            {/* Social Links - couleurs de marque par défaut */}
            <div className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100"
                  aria-label={social.label}
                >
                  <span
                    className="transition-transform duration-300 block group-hover:scale-110"
                    style={{ color: social.color }}
                  >
                    <social.icon />
                  </span>
                  {/* Glow subtil au hover */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md -z-10"
                    style={{ backgroundColor: social.color }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right - Navigation Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {navigationColumns.map((column) => (
                <div key={column.title}>
                  <Link
                    to={column.titleHref}
                    className="text-sm font-semibold mb-5 uppercase tracking-wider flex items-center gap-2 hover:opacity-70 transition-opacity"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="text-gray-900">{column.title}</span>
                  </Link>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        {'download' in link && link.download ? (
                          <a
                            href={link.href}
                            download="Kit-Media-Origines-2024.pdf"
                            className="text-sm text-gray-500 hover:text-gray-900 transition-colors inline-block"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            className="text-sm text-gray-500 hover:text-gray-900 transition-colors inline-block"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <span>© {currentYear} Origines Media</span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                Fait avec <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> en France
              </span>
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link to="/mentions-legales" className="text-gray-400 hover:text-gray-600 transition-colors">
                Mentions légales
              </Link>
              <Link to="/cgu" className="text-gray-400 hover:text-gray-600 transition-colors">
                CGU
              </Link>
              <Link to="/cgv" className="text-gray-400 hover:text-gray-600 transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
