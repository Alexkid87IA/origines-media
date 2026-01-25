// src/components/EngagementSection.tsx
// Section Boutique - Cartes Premium avec images - Optimisé mobile

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Check } from 'lucide-react';
import { typo } from '../lib/typography';

// Produits de la Boutique
const academyProducts = [
  {
    id: 'kit-introspection',
    title: "Kit d'Introspection",
    subtitle: 'Votre voyage intérieur commence ici',
    description: '24 pages d\'exercices pour mieux vous connaître.',
    image: '/kit-introspection.jpg',
    price: 'Gratuit',
    originalPrice: null,
    color: '#06B6D4', // Cyan
    href: '/boutique/kit-introspection',
    tag: 'Gratuit',
    tagColor: '#10B981',
    benefits: ['24 pages de contenu', 'Exercices pratiques', 'Téléchargement immédiat'],
  },
  {
    id: 'masterclass-storytelling',
    title: 'Masterclass Storytelling',
    subtitle: "L'art de raconter votre histoire",
    description: 'Apprenez à captiver et structurer vos récits.',
    image: '/academy/masterclass-storytelling.jpg',
    price: '29€',
    originalPrice: '49€',
    color: '#F59E0B', // Amber
    href: '/boutique/masterclass-storytelling',
    tag: '-40%',
    tagColor: '#EF4444',
    benefits: ['3h de vidéo HD', 'Workbook inclus', 'Accès à vie'],
  },
  {
    id: 'guide-mindset',
    title: 'Guide Mindset',
    subtitle: 'Transformez votre mental',
    description: 'Développez un état d\'esprit de croissance.',
    image: '/academy/guide-mindset.jpg',
    price: '19€',
    originalPrice: null,
    color: '#8B5CF6', // Violet
    href: '/boutique/guide-mindset',
    tag: 'Nouveau',
    tagColor: '#8B5CF6',
    benefits: ['Guide PDF complet', '12 exercices', 'Audio méditations'],
  },
  {
    id: 'programme-complet',
    title: 'Programme Complet',
    subtitle: 'Accès illimité à vie',
    description: 'Toutes nos formations en un seul pass.',
    image: '/academy/programme-complet.jpg',
    price: '79€',
    originalPrice: '147€',
    color: '#EC4899', // Pink
    href: '/boutique/programme-complet',
    tag: 'Best-seller',
    tagColor: '#EC4899',
    benefits: ['Tout le catalogue', 'Mises à jour gratuites', 'Communauté privée'],
  },
];

// Composant carte produit Premium
interface ProductCardProps {
  product: typeof academyProducts[0];
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        to={product.href}
        className="group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
        style={{
          backgroundColor: 'white',
          boxShadow: isHovered
            ? `0 25px 50px -12px ${product.color}40, 0 0 0 2px ${product.color}`
            : '0 4px 20px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image du produit */}
        <div
          className="relative aspect-[4/3] overflow-hidden flex-shrink-0"
          style={{ backgroundColor: `${product.color}15` }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Tag promo */}
          {product.tag && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                style={{ backgroundColor: product.tagColor }}
              >
                {product.tag}
              </span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          {/* Titre + Sous-titre */}
          <div className="mb-4">
            <h3
              className="text-lg sm:text-xl font-bold mb-1.5 transition-colors duration-300 leading-tight"
              style={{ color: isHovered ? product.color : '#111827' }}
            >
              {product.title}
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {product.subtitle}
            </p>
          </div>

          {/* Bénéfices */}
          <div className="space-y-2.5 flex-1 mb-4">
            {product.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${product.color}15` }}
                >
                  <Check className="w-3 h-3" style={{ color: product.color }} />
                </div>
                <span className="text-sm text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Prix et CTA */}
          <div
            className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: `${product.color}20` }}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: product.color }}
              >
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                backgroundColor: isHovered ? product.color : `${product.color}15`,
                color: isHovered ? 'white' : product.color
              }}
            >
              Voir
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const EngagementSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1.5 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Apprendre</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Notre{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Boutique
              </span>
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
              {typo("Des ressources premium pour votre développement personnel. Guides, masterclasses et programmes complets créés par des experts.")}
            </p>
          </div>

          <Link
            to="/boutique"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium text-base hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
          >
            <span>Voir la Boutique</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grille de produits - 1 sur mobile, 2 sur tablet, 4 sur desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
          {academyProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Footer stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 sm:mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8">
            <span className="text-sm sm:text-base text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              2,500+ apprenants
            </span>
            <span className="text-sm sm:text-base text-gray-500 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              4.9/5 de satisfaction
            </span>
            <span className="text-sm sm:text-base text-gray-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              Garantie satisfait ou remboursé
            </span>
          </div>

          <Link
            to="/boutique"
            className="text-base font-semibold text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-2"
          >
            Tout découvrir
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EngagementSection;
